/* Chess Odyssey B2: explainable two-ply candidate analysis.
 * No engine Elo claims: a short-horizon heuristic, not Stockfish.
 * All SAN moves and replies are obtained from chess.js legal moves.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChessCoachEngine = api;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  const PIECE_VALUES = Object.freeze({p:100,n:320,b:335,r:500,q:900,k:0});
  const CENTRE = new Set(["d4","e4","d5","e5"]);
  function evaluate(board, perspective) {
    if (board.in_checkmate()) return board.turn() === perspective ? -100000 : 100000;
    if (board.in_draw()) return 0;
    let total=0;
    const rows=board.board();
    for (let r=0;r<8;r++) for(let f=0;f<8;f++) {
      const piece=rows[r][f]; if(!piece)continue;
      const rel=piece.color===perspective ? 1 : -1;
      const advance=piece.color==="w" ? 6-r : r-1;
      const centre=3.5-(Math.abs(f-3.5)+Math.abs(r-3.5))/2;
      const bonus=piece.type==="p" ? advance*3 : (piece.type==="n"?10:piece.type==="b"?5:0)*centre;
      total+=rel*(PIECE_VALUES[piece.type]+bonus);
    }
    return total;
  }
  function kindOf(move, board) {
    if(board.in_checkmate())return "mate";
    if(board.in_check())return "check";
    if(move.flags.includes("k")||move.flags.includes("q"))return "castle";
    if(move.captured)return "capture";
    if((move.piece==="n"||move.piece==="b") &&
       (move.from[1]===(move.color==="w"?"1":"8")))return "develop";
    if(CENTRE.has(move.to))return "center";
    if(move.piece==="p")return "pawn";
    return "quiet";
  }
  function examineMove(board, legalMove, perspective) {
    const moved=board.move(legalMove);
    if(!moved)throw new Error("Candidate is not legal in current position");
    let reply=null, score=evaluate(board,perspective), risk=null;
    const kind=kindOf(moved,board);
    try {
      if(!board.game_over()){
        const legalReplies=board.moves({verbose:true});
        let lowest=Infinity;
        for (const candidate of legalReplies) {
          // Warning applies to an *immediate legal capture*, not guaranteed material loss.
          if (!risk && candidate.captured && candidate.to===moved.to) {
            risk={square:moved.to,piece:moved.piece,capture:candidate.san};
          }
          board.move(candidate);
          const value=evaluate(board,perspective);
          board.undo();
          if(value<lowest || (value===lowest && (!reply || candidate.san.localeCompare(reply)<0))){
            lowest=value;reply=candidate.san;
          }
        }
        if(reply!==null)score=lowest;
      }
      return {san:moved.san,from:moved.from,to:moved.to,score,reply,kind,
        capture:moved.captured||null, risk, checkmate:board.in_checkmate()};
    } finally {board.undo();}
  }
  function analyze(board, options) {
    if (!board || typeof board.moves!=="function")throw new TypeError("Requires a chess.js position");
    const opts=options||{}, n=Math.max(1,Math.min(3,Number.isFinite(opts.limit)?Math.floor(opts.limit):3));
    const perspective=board.turn(), fen=board.fen();
    const list=board.moves({verbose:true}).map(move=>examineMove(board,move,perspective));
    list.sort((a,b)=>b.score-a.score || a.san.localeCompare(b.san));
    if(board.fen()!==fen)throw new Error("Analysis mutated board position");
    return {fen,perspective,depthPlies:2,lines:list.slice(0,n),all:list};
  }
  function grade(board, playedSan, options) {
    const report=analyze(board,options);
    const chosen=report.all.find(item=>item.san===playedSan);
    if(!chosen)throw new Error("Cannot classify an illegal move: "+playedSan);
    const best=report.all[0], drop=Math.max(0,best.score-chosen.score);
    const severity=drop>=300?"major":drop>=100?"warning":"fine";
    return {san:playedSan,from:chosen.from,to:chosen.to,best:best.san,
      bestReply:best.reply,reply:chosen.reply,kind:chosen.kind,risk:chosen.risk,
      score:chosen.score,drop,severity,perspective:report.perspective,
      depthPlies:report.depthPlies};
  }
  function isValidLine(board, moveSan, replySan) {
    const copy=board;
    const before=copy.fen();
    const move=copy.move(moveSan);if(!move)return false;
    let valid;
    try{valid=replySan==null ? copy.game_over() : copy.moves().includes(replySan);}
    finally {copy.undo();}
    return valid && before===copy.fen();
  }
  return Object.freeze({analyze,grade,isValidLine,evaluate,version:"B2-2ply"});
});