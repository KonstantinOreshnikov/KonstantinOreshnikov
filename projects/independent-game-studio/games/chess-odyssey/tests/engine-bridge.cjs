/* B3 UCI bridge contract; pure mocked protocol + real chess.js move validation */
"use strict";
const assert=require("node:assert/strict");
const Bridge=require("../engine-bridge.js");
const {Chess}=require("../vendor/chess.js");
let count=0;
function check(name,fn){return Promise.resolve().then(fn).then(()=>{count++;console.log("PASS "+name);});}
function workerFactory(options){
 const messages=[],instances=[];
 function spawn(){
   const w={
     messages:[],terminated:false,onmessage:null,onerror:null,
     postMessage(value){
       this.messages.push(value);
       if(value==="uci")queueMicrotask(()=>this.onmessage&&this.onmessage({data:"id name Stub\nuciok"}));
       if(value==="isready")queueMicrotask(()=>this.onmessage&&this.onmessage({data:"readyok"}));
       if(value.startsWith("go ")){
         const reply=options&&options.reply||"bestmove e2e4 ponder e7e5";
         queueMicrotask(()=>this.onmessage&&this.onmessage({data:reply}));
       }
     },
     terminate(){this.terminated=true;}
   };
   instances.push(w);return w;
 }
 return {spawn,instances};
}
(async()=>{
 await check("six distinct profiles with increasing real-engine strength settings",()=>{
  assert.deepEqual(Bridge.ids,["beginner","novice","intermediate","advanced","expert","grandmaster"]);
  assert.equal(Bridge.profile("beginner").mode,"local");
  assert.equal(Bridge.profile("novice").mode,"local");
  const strong=Bridge.ids.slice(2).map(Bridge.profile);
  assert.deepEqual(strong.map(x=>x.skill),[2,8,15,20]);
  assert.ok(strong.every(x=>x.mode==="uci"));
  assert.ok(strong.every((x,i)=>i===0||x.movetime>strong[i-1].movetime));
  assert.equal(Bridge.profile("UNKNOWN").id,"beginner");
 });
 await check("bestmove grammar rejects malformed or 0000",()=>{
  assert.equal(Bridge.parseBestMove("bestmove e2e4 ponder e7e5"),"e2e4");
  assert.equal(Bridge.parseBestMove("bestmove e7e8q"),"e7e8q");
  assert.equal(Bridge.parseBestMove("bestmove 0000"),null);
  assert.equal(Bridge.parseBestMove("info depth 5"),null);
  assert.equal(Bridge.parseBestMove("bestmove e9e4"),null);
 });
 await check("chess.js accepts legal UCI, rejects illegal move or missing promotion",()=>{
  const chess=new Chess();
  assert.equal(Bridge.legalUci(chess,"e2e4").san,"e4");
  assert.equal(Bridge.legalUci(chess,"e2e5"),null);
  assert.equal(Bridge.legalUci(chess,"0000"),null);
  const promotion=new Chess("8/P7/8/8/8/8/8/k1K5 w - - 0 1");
  assert.equal(Bridge.legalUci(promotion,"a7a8n").san,"a8=N");
  assert.equal(Bridge.legalUci(promotion,"a7a8"),null);
 });
 await check("UCI handshake, skill, position, go movetime and legal move",async()=>{
  const mock=workerFactory(),engine=new Bridge.Bridge({createWorker:mock.spawn});
  const fen=new Chess().fen();
  const result=await engine.choose(fen,"advanced");
  assert.equal(result.uci,"e2e4");assert.equal(result.engine,"stockfish-19-lite");
  assert.equal(Bridge.legalUci(new Chess(),result.uci).san,"e4");
  const msgs=mock.instances[0].messages;
  assert.equal(msgs[0],"uci");assert.ok(msgs.includes("isready"));
  assert.ok(msgs.includes("setoption name Skill Level value 8"));
  assert.ok(msgs.includes("position fen "+fen));
  assert.ok(msgs.includes("go movetime 350"));
  engine.dispose();assert.equal(mock.instances[0].terminated,true);
 });
 await check("second move reuses ready worker and switches skill",async()=>{
  const mock=workerFactory(),engine=new Bridge.Bridge({createWorker:mock.spawn});
  const fen=new Chess().fen();
  await engine.choose(fen,"intermediate");
  await engine.choose(fen,"grandmaster");
  assert.equal(mock.instances.length,1);
  assert.ok(mock.instances[0].messages.includes("setoption name Skill Level value 20"));
  assert.ok(mock.instances[0].messages.includes("go movetime 1450"));
  engine.dispose();
 });
 await check("cancel tears down in-flight UCI search (no stale bestmove)",async()=>{
  const sent=[];
  const mock={
   onmessage:null,onerror:null,terminated:false,
   postMessage(x){
     sent.push(x);
     if(x==="uci")queueMicrotask(()=>this.onmessage&&this.onmessage({data:"uciok"}));
     if(x==="isready")queueMicrotask(()=>this.onmessage&&this.onmessage({data:"readyok"}));
     // never answer search; it will be cancelled by new game
   },
   terminate(){this.terminated=true;}
  };
  const engine=new Bridge.Bridge({createWorker:()=>mock});
  const promise=engine.choose(new Chess().fen(),"expert");
  // ensure startup, then cancel pending after next microtask
  await Promise.resolve();await Promise.resolve();await Promise.resolve();await Promise.resolve();
  engine.cancel();
  await assert.rejects(promise,/cancelled/);
  assert.equal(mock.terminated,true);
 });
 await check("worker failure is surfaced, never an invented bestmove",async()=>{
  const engine=new Bridge.Bridge({createWorker:()=>{throw new Error("Unavailable worker");}});
  await assert.rejects(engine.choose(new Chess().fen(),"expert"),/Unavailable worker/);
  engine.dispose();
 });
 console.log("PASS B3 bridge "+count+" / "+count);
})().catch(e=>{console.error("FAIL B3 bridge",e);process.exitCode=1;});
