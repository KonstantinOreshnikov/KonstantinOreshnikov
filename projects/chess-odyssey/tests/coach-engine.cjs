/* B2 deterministic coach QA — source-backed, no FIDE/Elo claims. */
"use strict";
const assert=require("node:assert/strict");
const {Chess}=require("../vendor/chess.js");
const Coach=require("../coach-engine.js");
let passed=0;
function test(name,fn){fn();passed++;console.log("PASS "+name);}
function seq(moves){const c=new Chess();for(const san of moves)assert.ok(c.move(san),"illegal "+san);return c;}
test("opening: 3 distinct legal candidates and replies, immutable FEN/PGN",()=>{
 const c=new Chess(),fen=c.fen(),pgn=c.pgn(),report=Coach.analyze(c);
 assert.equal(report.lines.length,3);assert.equal(report.perspective,"w");
 assert.equal(new Set(report.lines.map(x=>x.san)).size,3);
 report.lines.forEach(x=>assert.ok(Coach.isValidLine(c,x.san,x.reply),x.san+" / "+x.reply));
 assert.equal(c.fen(),fen);assert.equal(c.pgn(),pgn);
});
test("black turn has three legal replies; position remains unchanged",()=>{
 const c=seq(["e4"]),fen=c.fen(),report=Coach.analyze(c);
 assert.equal(report.perspective,"b");assert.equal(report.lines.length,3);
 report.lines.forEach(x=>assert.ok(Coach.isValidLine(c,x.san,x.reply)));
 assert.equal(c.fen(),fen);
});
test("mate-in-one rated as terminal with no opponent response",()=>{
 const c=seq(["e4","e5","Bc4","Nc6","Qh5","Nf6"]),fen=c.fen();
 const mate=Coach.analyze(c).all.find(x=>x.san==="Qxf7#");
 assert.ok(mate);assert.equal(mate.checkmate,true);assert.equal(mate.kind,"mate");
 assert.equal(mate.reply,null);assert.ok(Coach.isValidLine(c,mate.san,mate.reply));
 assert.equal(c.fen(),fen);
});
test("capturable queen warning is a real legal capture, not claim of guaranteed loss",()=>{
 const c=new Chess("4k3/8/8/8/3r4/8/3Q4/4K3 w - - 0 1"),fen=c.fen();
 const report=Coach.analyze(c),hang=report.all.find(x=>x.san==="Qb4");
 assert.ok(hang&&hang.risk);
 assert.equal(hang.risk.square,"b4");
 assert.equal(hang.risk.capture,"Rxb4");
 assert.ok(Coach.isValidLine(c,hang.san,hang.reply));
 assert.equal(c.fen(),fen);
});
test("shallow mistake grading distinguishes capturing rook from hanging queen",()=>{
 const c=new Chess("4k3/8/8/8/3r4/8/3Q4/4K3 w - - 0 1");
 const good=Coach.grade(c,"Qxd4"),bad=Coach.grade(c,"Qb4");
 assert.equal(good.drop,0);assert.equal(good.severity,"fine");
 assert.equal(bad.severity,"major");assert.ok(bad.drop>=300);
 assert.equal(bad.best,"Qxd4");
 assert.ok(Coach.isValidLine(c,bad.san,bad.reply));
});
test("illegal move cannot be graded",()=>{
 const c=new Chess();
 assert.throws(()=>Coach.grade(c,"Qa9"),/illegal move/i);
});
test("forced no-reply mate remains legal; no fake mate when only check",()=>{
 const c=seq(["f3","e5","g4"]);
 const report=Coach.analyze(c);
 const mate=report.all.find(x=>x.san==="Qh4#");
 assert.ok(mate&&mate.checkmate&&mate.reply===null);
 assert.ok(Coach.isValidLine(c,"Qh4#",null));
});
test("one legal-move branch exposes at most available candidates",()=>{
 const c=new Chess("7k/6Q1/5K2/8/8/8/8/8 b - - 0 1");
 assert.equal(c.in_checkmate(),true);
 assert.equal(Coach.analyze(c).lines.length,0);
});
console.log("PASS coach B2 "+passed+" / "+passed);
