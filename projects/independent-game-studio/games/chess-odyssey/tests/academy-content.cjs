/* Full B4 authoring QA: all 33 actual chess.js positions and RU/EN/AZ semantic anchors. */
"use strict";
const assert=require("node:assert/strict");
const Academy=require("../academy.js");
const {Chess}=require("../vendor/chess.js");
let total=0;function test(name,fn){fn();total++;console.log("PASS "+name);}
test("all 33 lessons have legal moves, scripted replies, valid objectives and full language fields",()=>{
 const report=Academy.validate(Chess);
 assert.deepEqual(report.errors,[]);
 assert.equal(report.ok,true);
 assert.equal(report.total,33);
 assert.deepEqual(report.counts,{basics:9,tactics:8,openings:8,endgames:8});
});
test("three languages exist on every lesson title, intro and each step prompt",()=>{
 for(const task of Academy.lessons){
  for(const lang of ["ru","en","az"]){
   assert.ok(task.title[lang].length>=8,task.id+" "+lang+" title");
   assert.ok(task.intro[lang].length>=45,task.id+" "+lang+" intro");
   for(const step of task.steps)assert.ok(step.prompt[lang].length>=16,task.id+" "+lang+" prompt");
  }
 }
});
test("eight opening exercises each require 3 correct moves and legal scripted black/white replies",()=>{
 const tasks=Academy.lessons.filter(x=>x.track==="openings");
 assert.equal(tasks.length,8);
 assert.ok(tasks.every(t=>t.steps.length===3));
 let black=0,white=0;
 for(const task of tasks){
  const c=Academy.createPosition(task,Chess);
  if(c.turn()==="b")black++;else white++;
  for(const step of task.steps){
   assert.ok(c.moves().includes(step.san),task.id+"/"+step.san);
   assert.ok(c.move(step.san));
   if(step.reply)assert.ok(c.move(step.reply),task.id+" reply");
  }
 }
 assert.equal(black,4);assert.equal(white,4);
});
test("legacy lesson IDs stay stable, all progress IDs unique",()=>{
 assert.ok(Academy.byId.pawn&&Academy.byId.knight&&Academy.byId.mate);
 assert.equal(new Set(Academy.lessons.map(x=>x.id)).size,33);
});
test("tactics are real: knight fork, absolute pin, defended skewer and discovered check",()=>{
 const knight=Academy.createPosition(Academy.byId.fork,Chess);
 assert.ok(knight.move("Nc7+"));assert.ok(knight.in_check());
 assert.equal(knight.get("c7").type,"n");assert.equal(knight.get("a8").type,"r");
 const pin=Academy.createPosition(Academy.byId.pin,Chess);
 assert.ok(pin.move("Bb5"));assert.deepEqual(pin.moves({square:"c6"}),[]);
 const skewer=Academy.createPosition(Academy.byId.skewer,Chess);
 assert.ok(skewer.move("Rg6+"));assert.ok(skewer.in_check());
 assert.ok(!skewer.moves().includes("Kxg6"));
 const discovery=Academy.createPosition(Academy.byId.discovery,Chess);
 assert.ok(discovery.move("Bc4+"));assert.equal(discovery.in_check(),true);
});
test("basics: castling, en passant, queen promotion and explicit knight underpromotion",()=>{
 const castle=Academy.createPosition(Academy.byId.castle,Chess);assert.ok(castle.move("O-O"));assert.equal(castle.get("g1").type,"k");assert.equal(castle.get("f1").type,"r");
 const ep=Academy.createPosition(Academy.byId.enpassant,Chess);assert.ok(ep.move("exd6"));assert.equal(ep.get("d5"),null);assert.equal(ep.get("d6").type,"p");
 const queen=Academy.createPosition(Academy.byId.promotion,Chess);assert.ok(queen.move("a8=Q"));assert.equal(queen.get("a8").type,"q");
 const knight=Academy.createPosition(Academy.byId["end-underpromotion"],Chess);assert.ok(knight.move("a8=N"));assert.equal(knight.get("a8").type,"n");
});
test("mat exercises truly terminate in checkmate, not merely check",()=>{
 for(const task of Academy.lessons.filter(x=>x.goal==="mate")){
  const board=Academy.createPosition(task,Chess);
  for(const step of task.steps)assert.ok(board.move(step.san));
  assert.ok(board.in_checkmate(),task.id);
 }
});
test("opposition and passed-pawn endgames are valid under both king and pawn legality",()=>{
 for(const id of ["end-opposition","end-race","end-escort","end-king","end-rookbehind"]){
  const task=Academy.byId[id],board=Academy.createPosition(task,Chess);
  assert.ok(!board.game_over(),id+" unexpectedly terminal");
  assert.ok(board.move(task.steps[0].san),id);
 }
});
console.log("PASS B4 content and chess truth "+total+" / "+total);
