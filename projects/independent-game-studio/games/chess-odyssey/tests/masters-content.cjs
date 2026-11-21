/* Chess Odyssey B5 provenance, chess-truth, PGN and learning-QA acceptance.
 * All data comes from versioned source register and original RU/EN/AZ notes.
 */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {Chess}=require("../vendor/chess.js");
const Library=require("../masters-library.js");
const NotesA=require("../masters-notes-a.js");
const NotesB=require("../masters-notes-b.js");
const NotesC=require("../masters-notes-c.js");
const Core=require("../masters-core.js");
const raw=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../data/masters-source-scores.json"),"utf8"));
const compiled=Core.compile(Chess,Library,[NotesA,NotesB,NotesC]);
let count=0;
function test(name,fn){fn();count++;console.log("PASS "+name);}
test("source register 31 complete games and 1,923 unannotated plies",()=>{
 assert.equal(raw.games.length,31);
 assert.equal(raw.games.reduce((x,g)=>x+g.plies,0),1923);
 assert.equal(raw.schema,"chess-odyssey-masters-scores-v2");
 for(const g of raw.games){
  assert.equal(g.moves.length,g.plies);
  assert.ok(g.source.endsWith("/"+g.id),g.id);
  assert.ok(g.event&&g.white&&g.black&&g.year);
 }
});
test("runtime scores match exact canonical factual source register",()=>{
 assert.equal(Library.games.length,raw.games.length);
 for(const g of raw.games){
  const published=Library.byId[g.id];assert.ok(published,g.id);
  for(const k of ["white","black","event","year","result","source","plies"])assert.deepEqual(published[k],g[k],g.id+"/"+k);
  assert.deepEqual(Array.from(published.moves),g.moves,g.id+" full moves");
 }
});
test("full chess.js replay: 31 games, 1,923 legal SAN and every intermediate FEN",()=>{
 assert.equal(compiled.ok,true,compiled.problems.join("; "));
 assert.deepEqual(compiled.problems,[]);
 assert.equal(compiled.games.length,31);
 assert.equal(compiled.totalPlies,1923);
 for(const g of compiled.games){
  assert.equal(g.positions.length,g.moves.length+1,g.id);
  const chess=new Chess();
  for(let i=0;i<g.moves.length;i++){
   assert.equal(chess.fen(),g.positions[i],g.id+" pre "+i);
   assert.equal(chess.move(g.moves[i].san).san,g.moves[i].san,g.id+" SAN "+i);
  }
  assert.equal(chess.fen(),g.endFen,g.id);
  assert.equal(chess.fen(),g.positions.at(-1),g.id);
 }
});
test("result provenance: six true checkmates, other games are not mislabelled mat",()=>{
 assert.equal(compiled.checkmates,6);
 for(const g of compiled.games){
  const c=new Chess(g.endFen);
  assert.equal(c.in_checkmate(),g.isCheckmate,g.id);
  if(g.isCheckmate)assert.ok(g.moves.at(-1).san.includes("#"),g.id);
  if(!g.isCheckmate)assert.ok(!g.moves.at(-1).san.includes("#"),g.id);
  assert.ok(["1-0","0-1","1/2-1/2"].includes(g.result),g.id);
 }
});
test("116 original critical-move instructions bind to historically played moves",()=>{
 assert.equal(compiled.moments,116);
 for(const g of compiled.games){
  assert.ok(g.moments.length>=3&&g.moments.length<=6,g.id);
  let prev=0;
  for(const m of g.moments){
   assert.ok(m.ply>prev&&m.ply<=g.totalPlies,g.id);prev=m.ply;
   assert.equal(g.moves[m.ply-1].san,m.san,g.id+" "+m.anchor);
   const p=Core.referencePly(m.anchor);assert.equal(p.ply,m.ply);
   for(const l of Core.languages)assert.ok(m.explain[l].length>=40,g.id+"/"+l);
  }
 }
});
test("31 full explanations have original RU EN AZ title, summary and theme",()=>{
 for(const g of compiled.games){
  for(const l of ["ru","en","az"]){
   assert.ok(g.title[l].length>=12,g.id+"/"+l+" title");
   assert.ok(g.summary[l].length>=60,g.id+"/"+l+" summary");
  }
  assert.ok(["attack","strategy","endgame","machine"].includes(g.category));
  assert.ok(["beginner","intermediate","advanced"].includes(g.difficulty));
 }
});
test("116 historical quiz answers have only legal distinct options, with actual SAN present",()=>{
 for(const g of compiled.games)for(const note of g.moments){
  const legal=new Chess(g.positions[note.ply-1]).moves();
  const options=Core.exerciseChoices(Chess,g,note);
  assert.ok(options.length>=1&&options.length<=4,g.id);
  assert.equal(options.includes(note.san),true,g.id+"/"+note.anchor);
  assert.equal(new Set(options).size,options.length,g.id+"/"+note.anchor);
  assert.ok(options.every(opt=>legal.includes(opt)),g.id+"/"+note.anchor);
  assert.deepEqual(Core.exerciseChoices(Chess,g,note),options,"stable choices");
 }
});
test("PGN export is parseable, whole-game SAN and result consistent with source",()=>{
 for(const g of compiled.games){
  const pgn=Core.pgn(g);
  assert.match(pgn,/\[Event "/);assert.match(pgn,/\[White "/);assert.match(pgn,/\[Black "/);
  assert.ok(pgn.trim().endsWith(g.result),g.id);
  assert.ok(pgn.includes(g.source),"PGN should preserve source URL");
  const restored=new Chess();assert.ok(restored.load_pgn(pgn),g.id+" PGN parse");
  assert.deepEqual(restored.history(),g.moves.map(m=>m.san),g.id+" full score round-trip");
  assert.equal(restored.fen(),g.endFen,g.id+" result FEN");
 }
});
test("metadata misattribution regressions repaired for 1963 and 1834",()=>{
 for(const [id,year,white,black,result] of [
  ["byrne-fischer-1963",1963,"Robert Byrne","Bobby Fischer","0-1"],
  ["mcdonnell-labourdonnais-1834",1834,"Alexander McDonnell","Louis-Charles de la Bourdonnais","0-1"]
 ]){
  const g=compiled.byId[id];
  assert.ok(g);assert.equal(g.year,year);assert.equal(g.white,white);
  assert.equal(g.black,black);assert.equal(g.result,result);
  assert.ok(g.source.endsWith(id));
 }
});
test("31 source URLs, no copied source commentary in original teaching dataset",()=>{
 const ids=new Set(),urls=new Set();
 for(const g of compiled.games){
  assert.ok(/^https:\/\/chessgator\.com\/games\/[a-z0-9-]+$/.test(g.source));
  assert.ok(!urls.has(g.source));urls.add(g.source);
  assert.ok(!ids.has(g.id));ids.add(g.id);
 }
 assert.equal(urls.size,31);
 assert.ok(raw.scope.includes("unannotated")&&raw.licence.includes("No sourced editorial prose"));
});
console.log("PASS B5 Masters full source and teaching "+count+" / "+count);
