/* Offline unit/regression checks: node tests/chess-smoke.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {Chess}=require("../vendor/chess.js");
let passed=0;
function test(name,fn){fn();passed++;process.stdout.write("PASS "+name+"\n");}
function perft(c,d){if(d===0)return 1;let n=0;for(const m of c.moves()){c.move(m);n+=perft(c,d-1);c.undo();}return n;}
test("start 20 legal moves, perft depth 2/3",()=>{
 const c=new Chess();assert.equal(c.moves().length,20);
 assert.equal(perft(c,2),400);assert.equal(perft(c,3),8902);
});
test("illegal move rejected without state mutation",()=>{
 const c=new Chess(),f=c.fen();assert.equal(c.move({from:"e2",to:"e5"}),null);assert.equal(c.fen(),f);
});
test("Fool's Mate is checkmate",()=>{
 const c=new Chess();for(const m of ["f3","e5","g4","Qh4#"])assert.ok(c.move(m));
 assert.equal(c.in_checkmate(),true);assert.equal(c.game_over(),true);
});
test("castling on developed board",()=>{
 const c=new Chess();for(const m of ["Nf3","Nf6","g3","g6","Bg2","Bg7","O-O"])assert.ok(c.move(m));
 assert.equal(c.get("g1").type,"k");assert.equal(c.get("f1").type,"r");
});
test("en passant uses correct target and capture",()=>{
 const c=new Chess();for(const m of ["e4","a6","e5","d5","exd6"])assert.ok(c.move(m));
 assert.equal(c.get("d5"),null);assert.equal(c.get("d6").type,"p");assert.equal(c.get("d6").color,"w");
});
test("promotion and underpromotion",()=>{
 const fen="8/P7/8/8/8/8/8/k1K5 w - - 0 1";
 const c=new Chess(fen);const q=c.move({from:"a7",to:"a8",promotion:"q"});
 assert.ok(q);assert.equal(c.get("a8").type,"q");
 const n=new Chess(fen);assert.ok(n.move({from:"a7",to:"a8",promotion:"n"}));assert.equal(n.get("a8").type,"n");
});
test("threefold repetition detected",()=>{
 const c=new Chess();for(let i=0;i<2;i++)for(const m of ["Nf3","Nf6","Ng1","Ng8"])assert.ok(c.move(m));
 assert.equal(c.in_threefold_repetition(),true);assert.equal(c.game_over(),true);
});
test("stalemate and insufficient material",()=>{
 const s=new Chess("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1");
 assert.equal(s.in_stalemate(),true);assert.equal(s.in_checkmate(),false);
 const i=new Chess("8/8/8/8/8/8/4k3/6K1 w - - 0 1");
 assert.equal(i.insufficient_material(),true);
});
test("lesson's historical-looking tactic is a legal constructed position",()=>{
 const c=new Chess();for(const m of ["e4","e5","Bc4","Nc6","Qh5","Nf6"])assert.ok(c.move(m));
 assert.ok(c.moves({square:"h5",verbose:true}).some(m=>m.to==="f7"));
 const fin=c.move("Qxf7#");assert.ok(fin);assert.equal(c.in_checkmate(),true);
});
test("practice save/load PGN round trip",()=>{
 const c=new Chess();["e4","e5","Nf3","Nc6"].forEach(m=>c.move(m));
 const copy=new Chess();assert.equal(copy.load_pgn(c.pgn()),true);assert.equal(copy.fen(),c.fen());
});
test("own app parses and exposes safe basic test API",()=>{
 const js=fs.readFileSync(path.join(__dirname,"../app.js"),"utf8");
 const ctx={Chess,document:{readyState:"loading",addEventListener:()=>{}},window:{},console};
 vm.runInNewContext(js,ctx,{timeout:1000});
 assert.equal(ctx.window.ChessOdysseyQA.legalCount(),20);
 assert.deepEqual(Array.from(ctx.window.ChessOdysseyQA.lessonIds()),["pawn","knight","mate"]);
 assert.equal(ctx.window.ChessOdysseyQA.evaluate(),0);
});
test("HTML routes JS, offline vendor, coach and promotion",()=>{
 const h=fs.readFileSync(path.join(__dirname,"../index.html"),"utf8");
 for(const id of ["board","coach-message","promotion","lesson","lang","level","side","undo"])assert.ok(h.includes('id="'+id+'"'));
 assert.ok(h.includes('src="vendor/chess.js"'));assert.ok(h.includes('src="app.js"'));
 assert.ok(!h.includes("http://")&&!h.includes("https://"));
});
console.log("PASS total "+passed+" / "+passed);