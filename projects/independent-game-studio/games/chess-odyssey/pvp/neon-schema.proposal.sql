-- Chess Odyssey B9 — proposed Neon PostgreSQL schema, DOCUMENTATION ONLY.
-- DO NOT RUN against any live DB until owner authorizes staging apply, auth-role setup,
-- backup and migration review. No direct unauthenticated Data API/table access.
BEGIN;

CREATE SCHEMA IF NOT EXISTS chess_odyssey;

CREATE TABLE chess_odyssey.invites (
  invite_id uuid PRIMARY KEY,
  inviter_user_id text NOT NULL,
  invited_user_id text,
  invite_token_hash bytea UNIQUE,
  creator_color char(1) NOT NULL CHECK (creator_color IN ('w','b')),
  base_ms bigint NOT NULL CHECK (base_ms BETWEEN 0 AND 10800000),
  increment_ms bigint NOT NULL CHECK (increment_ms BETWEEN 0 AND 120000),
  preset text NOT NULL,
  state text NOT NULL DEFAULT 'pending'
    CHECK (state IN ('pending','accepted','declined','revoked','expired')),
  game_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  CONSTRAINT different_invited_player CHECK (invited_user_id IS NULL OR invited_user_id <> inviter_user_id)
);

CREATE TABLE chess_odyssey.games (
  game_id uuid PRIMARY KEY,
  white_user_id text NOT NULL,
  black_user_id text NOT NULL,
  created_by_user_id text NOT NULL,
  state text NOT NULL DEFAULT 'active' CHECK (state IN ('active','finished')),
  result text CHECK (result IN ('1-0','0-1','1/2-1/2')),
  reason text CHECK (reason IN ('checkmate','chess-draw','flag-fall','resignation',
    'agreed-draw','no-mating-potential','abandoned')),
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  canonical_fen text NOT NULL,
  canonical_pgn text NOT NULL DEFAULT '',
  move_count integer NOT NULL DEFAULT 0 CHECK (move_count >= 0),
  base_ms bigint NOT NULL CHECK (base_ms BETWEEN 0 AND 10800000),
  increment_ms bigint NOT NULL CHECK (increment_ms BETWEEN 0 AND 120000),
  white_remaining_ms bigint NOT NULL CHECK (white_remaining_ms >= 0),
  black_remaining_ms bigint NOT NULL CHECK (black_remaining_ms >= 0),
  running_color char(1) CHECK (running_color IN ('w','b')),
  last_clock_at timestamptz NOT NULL DEFAULT now(),
  draw_offered_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  CONSTRAINT distinct_players CHECK (white_user_id <> black_user_id),
  CONSTRAINT result_if_finished CHECK (
    (state = 'active' AND result IS NULL AND finished_at IS NULL)
    OR (state = 'finished' AND result IS NOT NULL AND finished_at IS NOT NULL)
  ),
  CONSTRAINT draw_offer_by_participant CHECK (
    draw_offered_by IS NULL OR draw_offered_by IN (white_user_id,black_user_id)
  )
);

ALTER TABLE chess_odyssey.invites
  ADD CONSTRAINT accepted_game_fk FOREIGN KEY (game_id)
  REFERENCES chess_odyssey.games(game_id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE chess_odyssey.moves (
  game_id uuid NOT NULL REFERENCES chess_odyssey.games(game_id) ON DELETE RESTRICT,
  ply_number integer NOT NULL CHECK (ply_number >= 1),
  actor_user_id text NOT NULL,
  request_id uuid NOT NULL,
  from_square varchar(2) NOT NULL CHECK (from_square ~ '^[a-h][1-8]$'),
  to_square varchar(2) NOT NULL CHECK (to_square ~ '^[a-h][1-8]$'),
  promotion char(1) CHECK (promotion IN ('q','r','b','n')),
  san varchar(32) NOT NULL,
  fen_after text NOT NULL,
  clock_at timestamptz NOT NULL,
  white_remaining_ms bigint NOT NULL,
  black_remaining_ms bigint NOT NULL,
  PRIMARY KEY (game_id,ply_number),
  UNIQUE (game_id,request_id)
);

-- Cloud saves are user-private and NEVER equal verified global competitive rating.
CREATE TABLE chess_odyssey.user_progress (
  user_id text PRIMARY KEY,
  progress_doc jsonb NOT NULL DEFAULT '{}'::jsonb,
  data_revision bigint NOT NULL DEFAULT 0 CHECK (data_revision >= 0),
  source_version varchar(64) NOT NULL DEFAULT 'chess-odyssey-v1',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT progress_is_object CHECK (jsonb_typeof(progress_doc) = 'object')
);

CREATE INDEX ix_chess_odyssey_active_games_white ON chess_odyssey.games(white_user_id,created_at DESC);
CREATE INDEX ix_chess_odyssey_active_games_black ON chess_odyssey.games(black_user_id,created_at DESC);
CREATE INDEX ix_chess_odyssey_invites_to ON chess_odyssey.invites(invited_user_id,state,expires_at);
CREATE INDEX ix_chess_odyssey_invites_from ON chess_odyssey.invites(inviter_user_id,state,created_at DESC);

-- FAIL CLOSED until Neon Auth identity and server/roles are configured.
REVOKE ALL ON SCHEMA chess_odyssey FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA chess_odyssey FROM PUBLIC;
ALTER TABLE chess_odyssey.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.invites FORCE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.games FORCE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.moves FORCE ROW LEVEL SECURITY;
ALTER TABLE chess_odyssey.user_progress FORCE ROW LEVEL SECURITY;
-- No permissive policies yet. RLS role design MUST be signed off and tested in staging.
-- Server Functions must verify Neon Auth token -> authenticated actor ID,
-- and execute SERIALIZABLE or SELECT ... FOR UPDATE on the game row before
-- validating server-time, revision, turns, legal chess.js moves and idempotency.
COMMIT;
