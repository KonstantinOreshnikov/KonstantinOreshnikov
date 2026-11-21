/* B6 strict methodology: progress, source-backed achievements and independent matches.
 * No browser mocks: pure data rules and real chess.js for finished-game PGN.
 */
"use strict";
const assert=require("node:assert/strict");
const Core=require("../progress-core.js");
const Academy=require("../academy.js");
const Source=require("../masters-library.js");
const MasterCore=require("../masters-core.js");
const notes=[require("../masters-notes-a.js"),require("../masters-notes-b.js"),require("../masters-notes-c.js")];
const {Chess}=require("../vendor/chess.js");
const lib=MasterCore.compile(Chess,Source,notes);assert.equal(lib.ok,true);
let checks=0;function test(name,fn){fn();checks++;console.log("PASS B6 "+name);}
const fool=new Chess();for(const san of ["f3","e5","g4","Qh4#"])assert.ok(fool.move(san));
const scholar=new Chess();for(const san of ["e4","e5","Bc4","Nc6","Qh5","Nf6","Qxf7#"])assert.ok(scholar.move(san));
const rec=(id,changes={})=>({id,mode:"independent",level:"novice",side:"w",assisted:false,undone:false,restarted:false,fallback:false,engine:"local",pgn:scholar.pgn(),result:"win",date:"2026-11-21T00:00:00.000Z",...changes});
test("fresh state: zero Academy Reputation and no invented local rating",()=>{
 const a=Core.empty(),b=Core.summary(a,[],Academy.lessons,lib.games);
 assert.equal(b.reputation,0);assert.equal(b.rated.index,null);assert.equal(b.rated.eligible,0);
 assert.equal(b.academy.total,33);assert.equal(b.masters.total,31);assert.equal(b.masters.momentsTotal,116);
});
test("prior B4 lesson completion is read-only deduplicated and four track grains reconcile",()=>{
 const ids=Academy.lessons.map(x=>x.id);
 const m=Core.summary(Core.empty(),[ids[0],ids[0],ids[2],"unknown"],Academy.lessons,lib.games);
 assert.equal(m.academy.done,2);assert.equal(m.reputation,40);
 assert.equal(Object.values(m.academy.tracks).reduce((n,x)=>n+x.completed,0),2);
});
test("all 33 existing Academy lessons unlock five milestone achievements once",()=>{
 const m=Core.summary(Core.empty(),Academy.lessons.map(x=>x.id),Academy.lessons,lib.games);
 assert.equal(m.academy.done,33);assert.equal(m.reputation,660);
 assert.ok(["rules","tactics","openings","endgames","all-lessons"].every(id=>m.achievements.some(x=>x.id===id&&x.unlocked)));
});
test("historical visits are credited only for annotated ply or game end, without farming",()=>{
 const game=lib.byId["opera-game"],note=game.moments[0];
 let state=Core.empty();
 state=Core.visit(state,game,1);assert.equal(state.masters[game.id],undefined);
 state=Core.visit(state,game,note.ply);
 state=Core.visit(state,game,note.ply);
 const m=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(m.masters.momentsVisited,1);assert.equal(m.reputation,4);
});
test("118? No: exactly 116 original moment markers can be reviewed, one time only",()=>{
 let state=Core.empty();
 for(const g of lib.games)for(const m of g.moments){state=Core.visit(state,g,m.ply);state=Core.visit(state,g,m.ply);}
 const sum=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(sum.masters.momentsVisited,116);assert.equal(sum.masters.studied,0);
});
test("study completion requires all key moments AND reaching actual historical final position",()=>{
 const game=lib.byId["immortal-game"];
 let state=Core.empty();
 for(const m of game.moments)state=Core.visit(state,game,m.ply);
 assert.equal(Core.summary(state,[],Academy.lessons,lib.games).masters.studied,0);
 state=Core.visit(state,game,game.totalPlies);
 const sum=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(sum.masters.studied,1);assert.equal(sum.reputation,game.moments.length*4+20);
});
test("116 master quiz solves only count once and are separate from move visits",()=>{
 let state=Core.empty();
 for(const g of lib.games)for(const note of g.moments)state=Core.solve(state,g,note.ply);
 for(const g of lib.games)for(const note of g.moments)state=Core.solve(state,g,note.ply);
 const sum=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(sum.masters.momentsVisited,116);assert.equal(sum.masters.quizzesSolved,116);
 assert.equal(sum.reputation,116*(4+12));assert.ok(sum.achievements.find(x=>x.id==="ten-quizzes").unlocked);
});
test("invalid source or out-of-bounds master ply cannot mint achievements",()=>{
 const g=lib.byId["opera-game"],state=Core.empty();
 assert.strictEqual(Core.visit(state,g,-1),state);
 assert.strictEqual(Core.visit(state,g,g.totalPlies+1),state);
 assert.strictEqual(Core.solve(state,g,6),state);
 assert.strictEqual(Core.visit(state,null,3),state);
});
test("one full unassisted chess.js-validated terminal win counted and duplicate ID rejected",()=>{
 let state=Core.empty();const a=Core.match(state,Chess,rec("g-t001"));
 assert.equal(a.accepted,true);state=a.state;
 assert.equal(state.matches.length,1);
 const again=Core.match(state,Chess,rec("g-t001"));assert.equal(again.accepted,false);
 assert.equal(again.reason,"already-counted");assert.equal(state.matches.length,1);
});
test("AI ladder has minimum denominator five; never outputs fake rating from one game",()=>{
 let state=Core.empty();
 for(let i=1;i<=4;i++)state=Core.match(state,Chess,rec("g-five-"+i)).state;
 assert.equal(Core.summary(state,[],Academy.lessons,lib.games).rated.index,null);
 state=Core.match(state,Chess,rec("g-five-5")).state;
 const m=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(m.rated.index,33);assert.equal(m.rated.eligible,5);assert.equal(m.rated.period,5);
 assert.equal(m.rated.provisional,true);
});
test("provisional index transparent weighted-tier formula, 0..100, not Elo",()=>{
 let state=Core.empty();
 for(let i=0;i<5;i++){const tier=Core.TIERS[i],engine=i<2?"local":"stockfish";
  state=Core.match(state,Chess,rec("g-weight-"+i,{level:tier,engine,result:"loss",pgn:fool.pgn()})).state;
 }
 assert.equal(Core.summary(state,[],Academy.lessons,lib.games).rated.index,0);
 let successes=Core.empty();
 for(let i=0;i<5;i++)successes=Core.match(successes,Chess,rec("g-win-"+i,{level:"grandmaster",engine:"stockfish"})).state;
 assert.equal(Core.summary(successes,[],Academy.lessons,lib.games).rated.index,100);
});
test("unassisted games reject hints, undo, restarts and engine fallback",()=>{
 for(const field of ["assisted","undone","restarted","fallback"]){
  assert.equal(Core.validateMatch(Chess,rec("g-no-"+field,{[field]:true})).ok,false,field);
 }
 assert.equal(Core.validateMatch(Chess,rec("g-wrong-engine",{level:"expert",engine:"local"})).reason,"engine-not-verified");
});
test("practice, Academy or replayed games can never enter local independent rating",()=>{
 for(const mode of ["practice","academy","masters","guided"]){
  assert.equal(Core.match(Core.empty(),Chess,rec("g-mode-"+mode,{mode})).accepted,false);
 }
});
test("unfinished, corrupt, wrong-outcome and side-swapped PGNs must be rejected",()=>{
 assert.equal(Core.validateMatch(Chess,rec("g-unfinished",{pgn:new Chess().pgn()})).ok,false);
 assert.equal(Core.validateMatch(Chess,rec("g-bad-pgn",{pgn:"1. e2e4 2. nonsense"})).ok,false);
 assert.equal(Core.validateMatch(Chess,rec("g-wrong-winner",{result:"loss"})).reason,"outcome-inconsistent");
 assert.equal(Core.validateMatch(Chess,rec("g-wrong-side",{side:"b",result:"win"})).reason,"outcome-inconsistent");
});
test("true terminal loss or draw determines result from actual board not user input",()=>{
 const m=Core.validateMatch(Chess,rec("g-loss",{pgn:fool.pgn(),result:"loss"}));
 assert.equal(m.ok,true);assert.equal(m.entry.result,"loss");assert.equal(m.entry.plies,4);
 const d=new Chess();
 for(const move of ["Nf3","Nf6","Ng1","Ng8","Nf3","Nf6","Ng1","Ng8"])assert.ok(d.move(move));
 assert.equal(d.in_threefold_repetition(),true);
 assert.equal(Core.validateMatch(Chess,rec("g-draw",{pgn:d.pgn(),result:"draw"})).ok,true);
});
test("safe migration: missing/invalid v0.1..v0.5 progress never fabricates game history",()=>{
 const a=Core.safe(null,lib.games);assert.deepEqual(a,Core.empty());
 const b=Core.safe({schema:0,masters:{"opera-game":{seen:[1],solved:[1]}},matches:[{}]},lib.games);
 assert.deepEqual(b,Core.empty());
});
test("corrupt, duplicate and forged saved IDs discarded on deserialization",()=>{
 const game=lib.byId["opera-game"];
 const source={schema:1,masters:{[game.id]:{seen:[game.moments[0].ply,1000,game.moments[0].ply],solved:[game.moments[0].ply,-1],endViewed:true},"fake":{seen:[1],solved:[1],endViewed:true}},matches:[
  {id:"g-clean",level:"beginner",side:"w",result:"win",plies:7,engine:"local",date:"local"},
  {id:"g-clean",level:"beginner",side:"w",result:"loss",plies:7,engine:"local",date:"local"},
  {id:"wrong",level:"expert",side:"w",result:"win",plies:7,engine:"local",date:"local"}
 ]};
 const safe=Core.safe(source,lib.games);
 assert.deepEqual(safe.masters[game.id].seen,[game.moments[0].ply]);
 assert.deepEqual(safe.masters[game.id].solved,[game.moments[0].ply]);
 assert.equal(safe.masters.fake,undefined);
 assert.equal(safe.matches.length,1);
});
test("rated stats, achievements and reputation are source-distinct from practice WDL",()=>{
 const state=Core.match(Core.empty(),Chess,rec("g-rated")).state;
 const sum=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(sum.rated.win,1);assert.equal(sum.rated.draw,0);assert.equal(sum.rated.loss,0);
 assert.equal(sum.reputation,15);
 assert.ok(sum.achievements.find(x=>x.id==="first-independent-win").unlocked);
});
test("last-20 rolling index and quality gate 20-game provisional flag",()=>{
 let state=Core.empty();
 for(let i=0;i<24;i++)state=Core.match(state,Chess,rec("g-roll-"+i,{
   level:"novice",engine:"local",result:i<4?"loss":"win",pgn:i<4?fool.pgn():scholar.pgn()
 })).state;
 const v=Core.summary(state,[],Academy.lessons,lib.games);
 assert.equal(v.rated.eligible,24);assert.equal(v.rated.period,20);assert.equal(v.rated.provisional,false);
 assert.equal(v.rated.index,33);
});
console.log("PASS B6 Progress core "+checks+" / "+checks);
