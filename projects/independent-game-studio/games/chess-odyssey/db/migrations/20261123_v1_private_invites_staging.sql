-- Chess Odyssey live STAGING only; 2026-11-23. No production DB changes.
-- Server secret is generated separately inside Neon; never embed in GitHub.
-- Neon's JWT RLS will permit SELECT by participants; all writes restricted to guarded SECURITY DEFINER RPCs.
CREATE TABLE IF NOT EXISTS chess_odyssey.api_gate (
 gate_id smallint PRIMARY KEY CHECK (gate_id=1),
 secret_hash bytea NOT NULL
);

REVOKE ALL ON chess_odyssey.api_gate FROM PUBLIC;

REVOKE ALL ON chess_odyssey.api_gate FROM authenticated;

GRANT SELECT ON chess_odyssey.games,chess_odyssey.invites,chess_odyssey.moves TO authenticated;

CREATE POLICY chess_games_participants_select ON chess_odyssey.games
 FOR SELECT TO authenticated
 USING (auth.user_id()=white_user_id OR auth.user_id()=black_user_id);

CREATE POLICY chess_invites_participants_select ON chess_odyssey.invites
 FOR SELECT TO authenticated
 USING (auth.user_id()=inviter_user_id OR auth.user_id()=invited_user_id);

CREATE POLICY chess_moves_game_participants_select ON chess_odyssey.moves
 FOR SELECT TO authenticated
 USING (EXISTS(SELECT 1 FROM chess_odyssey.games g WHERE g.game_id=moves.game_id
 AND (g.white_user_id=auth.user_id() OR g.black_user_id=auth.user_id())));

CREATE OR REPLACE FUNCTION chess_odyssey.authorized_actor(p_secret text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,chess_odyssey,auth
AS $$
DECLARE actor text := auth.user_id();
BEGIN
 IF actor IS NULL OR length(actor)=0 OR length(actor)>255 THEN
   RAISE EXCEPTION USING ERRCODE='28000',MESSAGE='AUTH_REQUIRED';
 END IF;
 IF p_secret IS NULL OR length(p_secret)<40 OR
   NOT EXISTS(SELECT 1 FROM chess_odyssey.api_gate WHERE gate_id=1
   AND secret_hash=sha256(convert_to(p_secret,'UTF8'))) THEN
   RAISE EXCEPTION USING ERRCODE='28000',MESSAGE='SERVICE_NOT_AUTHORIZED';
 END IF;
 RETURN actor;
END;
$$;

REVOKE ALL ON FUNCTION chess_odyssey.authorized_actor(text) FROM PUBLIC;

CREATE OR REPLACE FUNCTION chess_odyssey.create_invite(
 p_secret text,p_invite_token text,p_creator_color text,p_preset text,
 p_base_ms bigint,p_increment_ms bigint,p_invited_user_id text DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,chess_odyssey,auth
AS $$
DECLARE actor text:=chess_odyssey.authorized_actor(p_secret);newid uuid:=gen_random_uuid();expiry timestamptz:=now()+interval '24 hours';
BEGIN
 IF p_invite_token IS NULL OR p_invite_token !~ '^[A-Za-z0-9_-]{43}$' OR
    p_creator_color NOT IN('w','b') OR
    p_preset NOT IN('none','bullet1','blitz3','blitz5','rapid10','rapid15','rapid1510','rapid20','rapid30','custom')
    OR p_base_ms IS NULL OR p_base_ms<0 OR p_base_ms>10800000
    OR p_increment_ms IS NULL OR p_increment_ms<0 OR p_increment_ms>120000
    OR (p_base_ms=0 AND (p_preset<>'none' OR p_increment_ms<>0))
    OR (p_base_ms>0 AND p_preset='none')
    OR (p_invited_user_id IS NOT NULL AND (p_invited_user_id=actor OR length(p_invited_user_id)>255)) THEN
   RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_INVITE';
 END IF;
 INSERT INTO chess_odyssey.invites(invite_id,inviter_user_id,invited_user_id,invite_token_hash,
 creator_color,base_ms,increment_ms,preset,state,expires_at)
 VALUES (newid,actor,p_invited_user_id,sha256(convert_to(p_invite_token,'UTF8')),
 p_creator_color::char(1),p_base_ms,p_increment_ms,p_preset,'pending',expiry);
 RETURN jsonb_build_object('invite_id',newid,'expires_at',expiry,'state','pending');
END;
$$;

CREATE OR REPLACE FUNCTION chess_odyssey.accept_invite(p_secret text,p_invite_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,chess_odyssey,auth
AS $$
DECLARE actor text:=chess_odyssey.authorized_actor(p_secret);offer chess_odyssey.invites%ROWTYPE;
 gid uuid:=gen_random_uuid();white_player text;black_player text;
BEGIN
 IF p_invite_token IS NULL OR p_invite_token !~ '^[A-Za-z0-9_-]{43}$' THEN
   RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_TOKEN';
 END IF;
 SELECT * INTO offer FROM chess_odyssey.invites
 WHERE invite_token_hash=sha256(convert_to(p_invite_token,'UTF8')) FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='INVITE_NOT_FOUND';END IF;
 IF offer.state<>'pending' OR offer.expires_at<=now() THEN
   RAISE EXCEPTION USING ERRCODE='23505',MESSAGE='INVITE_USED_OR_EXPIRED';
 END IF;
 IF actor=offer.inviter_user_id OR (offer.invited_user_id IS NOT NULL AND offer.invited_user_id<>actor) THEN
   RAISE EXCEPTION USING ERRCODE='28000',MESSAGE='INVITEE_NOT_AUTHORIZED';
 END IF;
 white_player:=CASE WHEN offer.creator_color='w' THEN offer.inviter_user_id ELSE actor END;
 black_player:=CASE WHEN offer.creator_color='b' THEN offer.inviter_user_id ELSE actor END;
 INSERT INTO chess_odyssey.games(game_id,white_user_id,black_user_id,created_by_user_id,
 state,canonical_fen,canonical_pgn,move_count,base_ms,increment_ms,
 white_remaining_ms,black_remaining_ms,running_color,last_clock_at)
 VALUES(gid,white_player,black_player,offer.inviter_user_id,'active',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1','',0,
 offer.base_ms,offer.increment_ms,offer.base_ms,offer.base_ms,
 CASE WHEN offer.base_ms>0 THEN 'w'::char(1) ELSE NULL END,now());
 UPDATE chess_odyssey.invites SET state='accepted',invited_user_id=actor,game_id=gid,accepted_at=now()
 WHERE invite_id=offer.invite_id;
 RETURN jsonb_build_object('game_id',gid,'white',white_player,'black',black_player,'state','active','version',0);
END;
$$;

REVOKE ALL ON FUNCTION chess_odyssey.create_invite(text,text,text,text,bigint,bigint,text) FROM PUBLIC;

REVOKE ALL ON FUNCTION chess_odyssey.accept_invite(text,text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION chess_odyssey.create_invite(text,text,text,text,bigint,bigint,text) TO authenticated;

GRANT EXECUTE ON FUNCTION chess_odyssey.accept_invite(text,text) TO authenticated;
