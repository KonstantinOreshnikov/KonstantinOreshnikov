"use strict";
/* Five-category Stockfish proxy contract: no screenshot scores and no sparse-data invention. */
const assert=require("node:assert/strict");
const R=require("../game-review-core.js");
let n=0;const test=(name,fn)=>{fn();console.log("PASS Skill QA "+(++n)+" "+name)};
const e=(ply,color,loss,opts={})=>({ply,color,loss,depth:8,cpBefore:100,cpAfter:50,san:"Nc3",piece:"n",...opts});
const input={entries:[
 e(1,"w",0,{san:"e4",piece:"p",cpBefore:0}),
 e(2,"b",.2,{san:"e5",piece:"p",cpBefore:0}),
 e(3,"w",.1,{san:"Nf3",piece:"n",cpBefore:0}),
 e(4,"b",.3,{san:"Nc6",piece:"n",cpBefore:0}),
 e(5,"w",.05,{san:"Bxf7+",piece:"b",captured:"p",cpBefore:200}),
 e(6,"b",.4,{san:"Nf6",piece:"n",cpBefore:-210}),
 e(7,"w",.12,{san:"Bc4",piece:"b",cpBefore:230}),
 e(8,"b",null,{san:"a6",piece:"p",depth:0,cpBefore:0}),
 e(21,"w",.08,{san:"Re1",piece:"r",cpBefore:300}),
 e(22,"b",.09,{san:"c6",piece:"p",cpBefore:-210}),
 e(25,"w",.18,{san:"Nf3",piece:"n",cpBefore:400}),
 e(26,"b",.09,{san:"Nd7",piece:"n",cpBefore:-250})
 ],positions:Array(27).fill("8/8/8/8/8/8/8/8 w - - 0 1")};
test("five categories and both sides always present",()=>{
 const r=R.skillReport(input);assert.deepEqual(Object.keys(r.rows),["opening","tactics","coordination","conversion","endgame"]);
 for(const row of Object.values(r.rows))assert.deepEqual(Object.keys(row),["w","b"]);
});
test("opening score based solely on same-side evaluated opening moves",()=>{
 const r=R.skillReport(input);
 assert.equal(r.rows.opening.w.analyzed,4);
 assert.equal(r.rows.opening.w.value,9.3);
 assert.equal(r.rows.opening.b.analyzed,3);
 assert.equal(r.rows.opening.b.value,7);
});
test("category requires two assessed moves",()=>{
 const r=R.skillReport(input);
 assert.equal(r.rows.tactics.w.analyzed,1);
 assert.equal(r.rows.tactics.w.value,null);
 assert.equal(r.rows.tactics.b.value,null);
});
test("conversion scores materialized advantages only",()=>{
 const r=R.skillReport(input);
 assert.equal(r.rows.conversion.w.analyzed,4);
 assert.equal(r.rows.conversion.w.value,8.9);
 assert.equal(r.rows.conversion.b.analyzed,3);
});
test("endgame filters queenless and low nonpawn material; sparse returns N/A",()=>{
 const q=R.skillReport({...input,positions:Array(27).fill("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1")});
 assert.equal(q.rows.endgame.w.value,null);assert.equal(q.rows.endgame.w.eligible,0);
 const r=R.skillReport(input);
 assert.ok(r.rows.endgame.w.value!==null);
});
test("unknown engine evaluations do not generate scores",()=>{
 const r=R.skillReport({entries:[e(1,"w",null,{depth:0}),e(2,"w",null,{depth:0})]});
 assert.equal(r.rows.opening.w.analyzed,0);assert.equal(r.rows.opening.w.value,null);
});
test("scores are bounded to 0..10 despite anomalous loss inputs",()=>{
 const r=R.skillReport({entries:[e(1,"w",3),e(3,"w",4)]});
 assert.equal(r.rows.opening.w.value,0);
});
console.log("PASS Skill QA "+n+"/"+n);
