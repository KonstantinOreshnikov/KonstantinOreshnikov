-- Chess Odyssey v1.0 / staging-only / 2026-11-23
-- Original state: Neon staging had all tables RLS FORCE, zero policies, zero game rows.
-- Data API is enabled ONLY for chess_odyssey schema with no default table grants.
-- Only owner-scoped progress SELECT and controlled atomic compare-and-swap are exposed.
-- SECURITY DEFINER is owned by a database owner and never trusts a user-supplied ID.
-- PostgreSQL 'authenticated' role is set by Neon Data API only with verified Better Auth JWT.
-- No grants for invites/games/moves, no production DB edits.
GRANT USAGE ON SCHEMA chess_odyssey TO authenticated;

GRANT SELECT ON chess_odyssey.user_progress TO authenticated;

CREATE POLICY chess_progress_own_select ON chess_odyssey.user_progress FOR SELECT TO authenticated USING (user_id = auth.user_id());

CREATE OR REPLACE FUNCTION chess_odyssey.save_progress(p_expected_revision bigint, p_progress_doc jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = pg_catalog, chess_odyssey, auth
AS $$
DECLARE
 v_user text := auth.user_id();
 v_new bigint;
BEGIN
 IF v_user IS NULL OR length(v_user)=0 THEN
   RAISE EXCEPTION USING ERRCODE='28000', MESSAGE='AUTH_REQUIRED';
 END IF;
 IF p_expected_revision IS NULL OR p_expected_revision<0 OR p_progress_doc IS NULL
    OR jsonb_typeof(p_progress_doc)<>'object' OR pg_column_size(p_progress_doc)>131072 THEN
   RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='INVALID_PROGRESS';
 END IF;
 IF p_expected_revision=0 THEN
   INSERT INTO chess_odyssey.user_progress(user_id, progress_doc, data_revision, source_version, updated_at)
   VALUES(v_user, p_progress_doc, 1, 'chess-odyssey-v1', now())
   ON CONFLICT (user_id) DO NOTHING RETURNING data_revision INTO v_new;
 ELSE
   UPDATE chess_odyssey.user_progress
   SET progress_doc=p_progress_doc, data_revision=data_revision+1, updated_at=now()
   WHERE user_id=v_user AND data_revision=p_expected_revision
   RETURNING data_revision INTO v_new;
 END IF;
 IF v_new IS NULL THEN
   RAISE EXCEPTION USING ERRCODE='40001', MESSAGE='STALE_PROGRESS_REVISION';
 END IF;
 RETURN jsonb_build_object('data_revision',v_new, 'progress_doc',p_progress_doc, 'saved',true);
END;
$$;

REVOKE ALL ON FUNCTION chess_odyssey.save_progress(bigint,jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION chess_odyssey.save_progress(bigint,jsonb) TO authenticated;

-- Security postconditions:
-- authenticated: USAGE schema, SELECT own user_progress, EXECUTE save_progress.
-- authenticated: NO direct INSERT/UPDATE/DELETE on user_progress; no games/moves/invites grants.
-- anonymous: no schema/table/procedure access.
