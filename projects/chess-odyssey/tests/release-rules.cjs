/* B7 deterministic source-of-truth and integrity acceptance. Real chess.js, no fake chess engine. */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const {Chess}=require("../vendor/chess.js");
const Academy=require("../academy.js");
const MasterCore=require("../masters-core.js");
const Source=require("../masters-library.js");
const Notes=[require("../masters-notes-a.js"),require("../masters-notes-b.js"),require("../masters-notes-c.js")];
const Progress=require("../progress-core.js");
const ROOT=path.resolve(__dirname,"..");
let count=0;function test(label,fn){fn();console.log("PASS B7 rules "+(++count)+" "+label);}
function play(c,moves){for(const move of moves)assert.ok(c.move(move),"legal SAN: "+move);return c;}
function perft(c,depth){if(!depth)return 1;let sum=0;for(const san of c.moves()){c.move(san);sum+=perft(c,depth-1);c.undo();}return sum;}
test("official start-position perft(4) 197281, no illegal move generator",()=>{
 const c=new Chess();assert.equal(perft(c,4),197281);assert.equal(c.history().length,0);
});
test("starting position 20 legal moves each by side",()=>{
 const c=new Chess();assert.equal(c.moves().length,20);c.move("e4");assert.equal(c.moves().length,20);
});
test("white kingside O-O physically places king and rook, SAN verified",()=>{
 const c=play(new Chess(),["Nf3","Nf6","g3","g6","Bg2","Bg7","O-O"]);
 assert.equal(c.get("g1").type,"k");assert.equal(c.get("f1").type,"r");assert.equal(c.get("e1"),null);
});
test("black kingside O-O similarly relocates both pieces",()=>{
 const c=play(new Chess(),["Nf3","Nf6","g3","g6","Bg2","Bg7","O-O","O-O"]);
 assert.equal(c.get("g8").type,"k");assert.equal(c.get("f8").type,"r");assert.equal(c.get("e8"),null);
});
test("white long castle O-O-O in canonical history is legal and reversible",()=>{
 const g=MasterCore.compile(Chess,Source,Notes).byId["opera-game"];
 const c=new Chess();let seen=false;
 for(const m of g.moves){const move=c.move(m.san);assert.ok(move);if(m.san==="O-O-O"){seen=true;assert.equal(c.get("c1").type,"k");assert.equal(c.get("d1").type,"r");const prev=c.fen();c.undo();assert.notEqual(c.fen(),prev);assert.ok(c.move("O-O-O"));break;}}
 assert.equal(seen,true);
});
test("en passant legal capture removes target pawn and cannot happen one turn later",()=>{
 const c=play(new Chess(),["e4","a6","e5","d5"]);
 assert.ok(c.moves().includes("exd6"));const copy=new Chess(c.fen());
 play(c,["exd6"]);assert.equal(c.get("d5"),null);assert.equal(c.get("d6").type,"p");
 play(copy,["Nf3","a5"]);assert.equal(copy.moves().includes("exd6"),false);
});
test("queen promotion and knight underpromotion both affect real piece",()=>{
 const fen="8/P7/8/8/8/8/8/k1K5 w - - 0 1";
 const q=new Chess(fen),n=new Chess(fen);
 assert.ok(q.move("a8=Q"));assert.equal(q.get("a8").type,"q");
 assert.ok(n.move("a8=N"));assert.equal(n.get("a8").type,"n");
});
test("Fool's Mate full from starting position is actual board checkmate",()=>{
 const c=play(new Chess(),["f3","e5","g4","Qh4#"]);
 assert.equal(c.in_checkmate(),true);assert.equal(c.turn(),"w");assert.equal(c.game_over(),true);
});
test("Scholar's Mate full from starting position is actual board checkmate",()=>{
 const c=play(new Chess(),["e4","e5","Bc4","Nc6","Qh5","Nf6","Qxf7#"]);
 assert.equal(c.in_checkmate(),true);assert.equal(c.turn(),"b");assert.equal(c.game_over(),true);
});
test("threefold positions recognized by pinned rules; claim is simplified auto draw",()=>{
 const c=play(new Chess(),["Nf3","Nf6","Ng1","Ng8","Nf3","Nf6","Ng1","Ng8"]);
 assert.equal(c.in_threefold_repetition(),true);assert.equal(c.in_draw(),true);
});
test("stalemate is draw not checkmate",()=>{
 const c=new Chess("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1");
 assert.equal(c.in_stalemate(),true);assert.equal(c.in_checkmate(),false);
});
test("insufficient material is a draw",()=>{
 const c=new Chess("8/8/8/8/8/8/4k3/6K1 w - - 0 1");
 assert.equal(c.insufficient_material(),true);
});
test("every one of the 31 master scores exactly legal from ordinary opening",()=>{
 const b=MasterCore.compile(Chess,Source,Notes);assert.equal(b.ok,true);
 assert.equal(b.games.length,31);assert.equal(b.totalPlies,1923);assert.equal(b.moments,116);
 for(const g of b.games){const c=new Chess();for(const m of g.moves)assert.ok(c.move(m.san),g.id+"/"+m.san);assert.equal(c.history().length,g.totalPlies);}
});
test("all 33 Academy lessons and 49 learner step sequence have valid chess moves",()=>{
 const r=Academy.validate(Chess);assert.equal(r.ok,true);assert.equal(r.total,33);
 assert.deepEqual(r.counts,{basics:9,tactics:8,openings:8,endgames:8});
});
test("independent B6 accepts complete standard-start winning game",()=>{
 const c=play(new Chess(),["e4","e5","Bc4","Nc6","Qh5","Nf6","Qxf7#"]);
 const record={id:"g-fullverified",mode:"independent",level:"beginner",side:"w",engine:"local",pgn:c.pgn(),result:"win",date:"2026-11-21",
  assisted:false,undone:false,restarted:false,fallback:false};
 const result=Progress.validateMatch(Chess,record);
 assert.equal(result.ok,true);assert.equal(result.entry.plies,7);
});
test("custom-FEN late-mate replay is NOT a full-game independent score",()=>{
 const original=play(new Chess(),["f3","e5"]);
 const c=new Chess(original.fen());
 play(c,["g4","Qh4#"]);
 const record={id:"g-customfen",mode:"independent",level:"beginner",side:"b",engine:"local",pgn:c.pgn(),result:"win",date:"2026-11-21",
   assisted:false,undone:false,restarted:false,fallback:false};
 const result=Progress.validateMatch(Chess,record);
 assert.equal(result.ok,false);
 assert.ok(["not-full-standard-start","invalid-pgn"].includes(result.reason),JSON.stringify(result));
});
test("independent index rejects even legal full game when coaching flags/engine fallback set",()=>{
 const c=play(new Chess(),["f3","e5","g4","Qh4#"]);
 const record={id:"g-testassist",mode:"independent",level:"beginner",side:"b",engine:"local",pgn:c.pgn(),result:"win",date:"2026-11-21",
   assisted:false,undone:false,restarted:false,fallback:false};
 for(const field of ["assisted","undone","restarted","fallback"])assert.equal(Progress.validateMatch(Chess,{...record,[field]:true}).ok,false,field);
 assert.equal(Progress.validateMatch(Chess,{...record,level:"expert"}).ok,false);
});
test("historical and coach routes cannot earn new independent-game credit",()=>{
 const c=play(new Chess(),["f3","e5","g4","Qh4#"]);
 const record={id:"g-1",mode:"practice",level:"beginner",side:"b",engine:"local",pgn:c.pgn(),result:"win",date:"2026-11-21"};
 for(const mode of ["practice","academy","masters"])assert.equal(Progress.validateMatch(Chess,{...record,mode}).ok,false);
});
test("all 31 primary source URLs unique, exact game metadata and HTTPS",()=>{
 const list=JSON.parse(fs.readFileSync(path.join(ROOT,"data/masters-source-scores.json"),"utf8")).games;
 assert.equal(list.length,31);assert.equal(new Set(list.map(x=>x.source)).size,31);
 for(const g of list){assert.equal(g.source,"https://chessgator.com/games/"+g.id);assert.ok(g.year>=1834&&g.year<=2013);assert.equal(g.moves.length,g.plies);}
});
test("no imported third-party runtime scripts/styles and no dynamic HTML injection",()=>{
 const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
 assert.equal(/<(?:script|link)\b[^>]+(?:src|href)\s*=\s*["']https?:\/\//i.test(html),false);
 for(const file of ["app.js","masters-ui.js","progress-ui.js"]){
  const js=fs.readFileSync(path.join(ROOT,file),"utf8");
  assert.equal(/\binnerHTML\s*=/.test(js),false,"unsafe dynamic HTML: "+file);
 }
});
test("Stockfish pinned GPL notices and all engine packaging remain available",()=>{
 const source=fs.readFileSync(path.join(ROOT,"THIRD_PARTY_NOTICES.md"),"utf8");
 const manifest=fs.readFileSync(path.join(ROOT,"engine/MANIFEST.md"),"utf8");
 const gpl=fs.readFileSync(path.join(ROOT,"engine/Copying.txt"),"utf8");
 assert.match(source,/GPL/i);assert.match(manifest,/SHA256/);assert.match(gpl,/GNU GENERAL PUBLIC LICENSE/);
});
test("RU/EN/AZ coverage and exact key count across verified Academy and Masters",()=>{
 for(const a of Academy.lessons){for(const lang of ["ru","en","az"]){assert.ok(a.title[lang]?.length>5);assert.ok(a.intro[lang]?.length>25);for(const st of a.steps)assert.ok(st.prompt[lang]?.length>8);}}
 const b=MasterCore.compile(Chess,Source,Notes);assert.equal(b.moments,116);
 for(const g of b.games){for(const lang of ["ru","en","az"])assert.ok(g.title[lang]?.length>5);
  for(const m of g.moments)for(const lang of ["ru","en","az"])assert.ok(m.note[lang]?.length>20,g.id+" "+m.ply+" "+lang);}
});
console.log("PASS B7 release rules "+count+" / "+count);
