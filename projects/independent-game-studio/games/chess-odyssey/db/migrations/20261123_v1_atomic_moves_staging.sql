-- Chess Odyssey v1.0 STAGING. Atomic version+turn+clock+request-id checks; chess.js rule authority in the trusted Neon Function. Never grant public direct table writes.
CREATE OR REPLACE FUNCTION chess_odyssey.commit_move(
 p_secret text,p_game_id uuid,p_request_id uuid,p_expected_version bigint,
 p_from text,p_to text,p_promotion text,p_san text,p_new_fen text,p_new_pgn text,
 p_result text DEFAULT NULL,p_reason text DEFAULT NULL,p_timeout_draw boolean DEFAULT false
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,chess_odyssey,auth
AS $$
DECLARE actor text:=chess_odyssey.authorized_actor(p_secret);
 game chess_odyssey.games%ROWTYPE;prev chess_odyssey.moves%ROWTYPE;
 mover_color text;clock_at timestamptz;elapsed bigint:=0;left_ms bigint;
 w_ms bigint;b_ms bigint;timeout_result text;timeout_reason text;
BEGIN
 IF p_game_id IS NULL OR p_request_id IS NULL OR p_expected_version IS NULL OR p_expected_version<0 OR
    p_from !~ '^[a-h][1-8]$' OR p_to !~ '^[a-h][1-8]$'
    OR (p_promotion IS NOT NULL AND p_promotion NOT IN('q','r','b','n'))
    OR p_san IS NULL OR length(p_san)<1 OR length(p_san)>32
    OR p_new_fen IS NULL OR length(p_new_fen)<15 OR length(p_new_fen)>128
    OR p_new_pgn IS NULL OR length(p_new_pgn)>100000
    OR (p_result IS NULL)<>(p_reason IS NULL)
    OR (p_result IS NOT NULL AND (p_result NOT IN('1-0','0-1','1/2-1/2')
        OR p_reason NOT IN('checkmate','chess-draw'))) THEN
   RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='INVALID_MOVE';
 END IF;
 SELECT * INTO game FROM chess_odyssey.games WHERE game_id=p_game_id FOR UPDATE;
 IF NOT FOUND OR actor NOT IN(game.white_user_id,game.black_user_id) THEN
   RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='GAME_NOT_FOUND';
 END IF;
 SELECT * INTO prev FROM chess_odyssey.moves WHERE game_id=p_game_id AND request_id=p_request_id;
 IF FOUND THEN
   IF prev.actor_user_id<>actor OR prev.from_square<>p_from OR prev.to_square<>p_to
      OR coalesce(prev.promotion::text,'')<>coalesce(p_promotion,'') THEN
     RAISE EXCEPTION USING ERRCODE='23505',MESSAGE='REQUEST_ID_REUSED';
   END IF;
   RETURN jsonb_build_object('game_id',p_game_id,'version',game.version,'duplicate',true,'fen',game.canonical_fen);
 END IF;
 IF game.state<>'active' THEN
   RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='GAME_FINISHED';
 END IF;
 IF game.version<>p_expected_version THEN
   RAISE EXCEPTION USING ERRCODE='40001',MESSAGE='STALE_GAME_VERSION';
 END IF;
 mover_color:=CASE WHEN mod(game.move_count,2)=0 THEN 'w' ELSE 'b' END;
 IF (mover_color='w' AND actor<>game.white_user_id)
    OR (mover_color='b' AND actor<>game.black_user_id) THEN
    RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='NOT_YOUR_TURN';
 END IF;
 clock_at:=clock_timestamp();
 w_ms:=game.white_remaining_ms;b_ms:=game.black_remaining_ms;
 IF game.base_ms>0 THEN
   elapsed:=greatest(0,floor(extract(epoch from (clock_at-game.last_clock_at))*1000)::bigint);
   left_ms:=(CASE WHEN mover_color='w' THEN w_ms ELSE b_ms END)-elapsed;
   IF left_ms<=0 THEN
     timeout_result:=CASE WHEN p_timeout_draw THEN '1/2-1/2'
       WHEN mover_color='w' THEN '0-1' ELSE '1-0' END;
     timeout_reason:=CASE WHEN p_timeout_draw THEN 'no-mating-potential' ELSE 'flag-fall' END;
     UPDATE chess_odyssey.games SET state='finished',version=version+1,
       result=timeout_result,reason=timeout_reason,finished_at=clock_at,running_color=NULL,
       white_remaining_ms=CASE WHEN mover_color='w' THEN 0 ELSE w_ms END,
       black_remaining_ms=CASE WHEN mover_color='b' THEN 0 ELSE b_ms END,last_clock_at=clock_at
     WHERE game_id=p_game_id;
     RETURN jsonb_build_object('game_id',p_game_id,'version',game.version+1,'timeout',true,
        'result',timeout_result,'reason',timeout_reason);
   END IF;
   IF mover_color='w' THEN w_ms:=left_ms+game.increment_ms;
   ELSE b_ms:=left_ms+game.increment_ms;END IF;
 END IF;
 UPDATE chess_odyssey.games SET canonical_fen=p_new_fen,canonical_pgn=p_new_pgn,
   version=version+1,move_count=move_count+1,
   white_remaining_ms=w_ms,black_remaining_ms=b_ms,
   running_color=CASE WHEN p_result IS NOT NULL OR base_ms=0 THEN NULL
       WHEN mover_color='w' THEN 'b'::char(1) ELSE 'w'::char(1) END,
   last_clock_at=clock_at,
   state=CASE WHEN p_result IS NULL THEN 'active' ELSE 'finished' END,
   result=p_result,reason=p_reason,
   finished_at=CASE WHEN p_result IS NULL THEN NULL ELSE clock_at END,
   draw_offered_by=NULL
 WHERE game_id=p_game_id;
 INSERT INTO chess_odyssey.moves(game_id,ply_number,actor_user_id,request_id,
 from_square,to_square,promotion,san,fen_after,clock_at,white_remaining_ms,black_remaining_ms)
 VALUES(p_game_id,game.move_count+1,actor,p_request_id,p_from,p_to,
 NULLIF(p_promotion,'')::char(1),p_san,p_new_fen,clock_at,w_ms,b_ms);
 RETURN jsonb_build_object('game_id',p_game_id,'version',game.version+1,
    'fen',p_new_fen,'pgn',p_new_pgn,'san',p_san,'move_count',game.move_count+1,
    'white_ms',w_ms,'black_ms',b_ms,'result',p_result,'reason',p_reason,'duplicate',false);
END;
$$;

CREATE OR REPLACE FUNCTION chess_odyssey.resign_game(
 p_secret text,p_game_id uuid,p_expected_version bigint,p_no_mating_potential boolean DEFAULT false
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,chess_odyssey,auth
AS $$
DECLARE actor text:=chess_odyssey.authorized_actor(p_secret);game chess_odyssey.games%ROWTYPE;
 result_text text;reason_text text;
BEGIN
 SELECT * INTO game FROM chess_odyssey.games WHERE game_id=p_game_id FOR UPDATE;
 IF NOT FOUND OR actor NOT IN(game.white_user_id,game.black_user_id) THEN
    RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='GAME_NOT_FOUND';
 END IF;
 IF game.state<>'active' OR game.version<>p_expected_version THEN
   RAISE EXCEPTION USING ERRCODE='40001',MESSAGE='STALE_GAME_VERSION';
 END IF;
 result_text:=CASE WHEN p_no_mating_potential THEN '1/2-1/2'
   WHEN actor=game.white_user_id THEN '0-1' ELSE '1-0' END;
 reason_text:=CASE WHEN p_no_mating_potential THEN 'no-mating-potential' ELSE 'resignation' END;
 UPDATE chess_odyssey.games SET state='finished',result=result_text,reason=reason_text,
 finished_at=now(),version=version+1,running_color=NULL,draw_offered_by=NULL WHERE game_id=p_game_id;
 RETURN jsonb_build_object('game_id',p_game_id,'version',game.version+1,
  'result',result_text,'reason',reason_text);
END;
$$;

CREATE OR REPLACE FUNCTION chess_odyssey.draw_game(
 p_secret text,p_game_id uuid,p_expected_version bigint,p_action text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,chess_odyssey,auth
AS $$
DECLARE actor text:=chess_odyssey.authorized_actor(p_secret);game chess_odyssey.games%ROWTYPE;
BEGIN
 SELECT * INTO game FROM chess_odyssey.games WHERE game_id=p_game_id FOR UPDATE;
 IF NOT FOUND OR actor NOT IN(game.white_user_id,game.black_user_id) THEN
    RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='GAME_NOT_FOUND';
 END IF;
 IF game.state<>'active' OR game.version<>p_expected_version THEN
   RAISE EXCEPTION USING ERRCODE='40001',MESSAGE='STALE_GAME_VERSION';
 END IF;
 IF p_action NOT IN('offer','accept','decline') THEN
   RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='BAD_DRAW_ACTION';
 END IF;
 IF p_action='offer' THEN
   IF game.draw_offered_by IS NOT NULL THEN
     RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='ALREADY_OFFERED';
   END IF;
   UPDATE chess_odyssey.games SET draw_offered_by=actor,version=version+1 WHERE game_id=p_game_id;
 ELSE
   IF game.draw_offered_by IS NULL OR game.draw_offered_by=actor THEN
     RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='NO_OPPONENT_OFFER';
   END IF;
   IF p_action='accept' THEN
     UPDATE chess_odyssey.games SET state='finished',result='1/2-1/2',
       reason='agreed-draw',finished_at=now(),draw_offered_by=NULL,
       running_color=NULL,version=version+1 WHERE game_id=p_game_id;
   ELSE
     UPDATE chess_odyssey.games SET draw_offered_by=NULL,version=version+1 WHERE game_id=p_game_id;
   END IF;
 END IF;
 RETURN jsonb_build_object('game_id',p_game_id,'version',game.version+1,
   'draw_action',p_action,'result',CASE WHEN p_action='accept' THEN '1/2-1/2' ELSE NULL END);
END;
$$;

REVOKE ALL ON FUNCTION chess_odyssey.commit_move(text,uuid,uuid,bigint,text,text,text,text,text,text,text,text,boolean) FROM PUBLIC;

REVOKE ALL ON FUNCTION chess_odyssey.resign_game(text,uuid,bigint,boolean) FROM PUBLIC;

REVOKE ALL ON FUNCTION chess_odyssey.draw_game(text,uuid,bigint,text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION chess_odyssey.commit_move(text,uuid,uuid,bigint,text,text,text,text,text,text,text,text,boolean) TO authenticated;

GRANT EXECUTE ON FUNCTION chess_odyssey.resign_game(text,uuid,bigint,boolean) TO authenticated;

GRANT EXECUTE ON FUNCTION chess_odyssey.draw_game(text,uuid,bigint,text) TO authenticated;
