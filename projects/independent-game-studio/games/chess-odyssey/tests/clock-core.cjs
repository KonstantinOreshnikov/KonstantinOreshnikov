/* B8 deterministic chess-clock unit gates (no browser mocks or real-time sleeps). */
"use strict";
const assert=require("node:assert/strict");
const C=require("../clock-core.js");
let count=0;const t=(name,fn)=>{fn();count++;console.log("PASS B8 clock "+count+" "+name);};
t("nine documented controls",()=>assert.deepEqual(Object.keys(C.PRESETS),["none","bullet1","blitz3","blitz5","rapid10","rapid15","rapid1510","rapid20","rapid30"]));
t("untimed stays off",()=>{const s=C.start(C.config("none"),100);assert.equal(s.done,true);assert.equal(s.active,null);});
t("bullet exact independent clocks",()=>{const s=C.settle(C.start(C.config("bullet1"),1000),1500);assert.equal(s.remaining.w,59500);assert.equal(s.remaining.b,60000);});
t("3+0 transition charges mover, never opponent",()=>{const r=C.move(C.start(C.config("blitz3"),1000),"w",11000);assert.equal(r.ok,true);assert.equal(r.state.remaining.w,170000);assert.equal(r.state.remaining.b,180000);assert.equal(r.state.active,"b");});
t("15+10 increment only after move",()=>{const r=C.move(C.start(C.config("rapid1510"),1000),"w",21000);assert.equal(r.state.remaining.w,890000);assert.equal(r.state.incrementMs,10000);});
t("cannot move on expired time",()=>{const r=C.move(C.start(C.config("bullet1"),0),"w",60001);assert.equal(r.ok,false);assert.equal(r.state.flagged,"w");assert.equal(r.state.remaining.w,0);});
t("exact boundary flags",()=>{const r=C.settle(C.start(C.config("bullet1"),0),60000);assert.equal(r.flagged,"w");});
t("wrong side cannot advance",()=>{const r=C.move(C.start(C.config("bullet1"),0),"b",500);assert.equal(r.ok,false);assert.equal(r.state.remaining.w,59500);});
t("time doesn't increase when clock rewinds",()=>{let s=C.settle(C.start(C.config("bullet1"),10000),12000);s=C.settle(s,1000);assert.equal(s.remaining.w,58000);});
t("pause prevents time debit",()=>{let s=C.pause(C.start(C.config("bullet1"),0),1000);s=C.settle(s,57000);assert.equal(s.remaining.w,59000);});
t("resume restarts at fresh timestamp",()=>{let s=C.pause(C.start(C.config("bullet1"),0),1000);s=C.resume(s,57000);s=C.settle(s,58000);assert.equal(s.remaining.w,58000);});
t("save/restore debits real elapsed time",()=>{const s=C.start(C.config("blitz5"),500);assert.equal(C.restore(JSON.parse(JSON.stringify(s)),2000).remaining.w,298500);});
t("restore of paused clock holds",()=>{const s=C.pause(C.start(C.config("blitz5"),500),1000);assert.equal(C.restore(s,900000).remaining.w,299500);});
t("corrupt storage fails closed",()=>assert.equal(C.restore({v:1,active:"w",remaining:{w:-42,b:3}},0),null));
t("custom positive minutes and increment",()=>{const c=C.config("custom",20,5);assert.equal(c.baseMs,1200000);assert.equal(c.incrementMs,5000);});
t("reject custom zero, huge or invalid",()=>{assert.throws(()=>C.config("custom",0,0));assert.throws(()=>C.config("custom",300,0));assert.throws(()=>C.config("custom",5,-1));});
t("format hour and minute clock",()=>{assert.equal(C.format(900000),"15:00");assert.equal(C.format(1001),"00:02");assert.equal(C.format(3600000),"1:00:00");});
t("stop freezes remaining",()=>{const s=C.stop(C.start(C.config("rapid10"),1000),2000);assert.equal(C.settle(s,900000).remaining.w,599000);});
const Chess=require("../vendor/chess.js").Chess;
function board(fen){return new Chess(fen).board();}
t("no mating material with king alone",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/8/4K3 w - - 0 1")),true));
t("knight against bare king cannot mate",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/8/3NK3 w - - 0 1")),true));
t("bishop against bare king cannot mate",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/8/2B1K3 w - - 0 1")),true));
t("multiple same-colour bishops against lone king cannot mate",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/4B3/8/2B1K3 w - - 0 1")),true));
t("different-colour bishop pair could mate",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1")),false));
t("two knights may mate with cooperation, no false flag draw",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/8/2NNK3 w - - 0 1")),false));
t("knight vs defender knight must not be assumed drawn",()=>assert.equal(C.cannotMate("w",board("4kn2/8/8/8/8/8/8/3NK3 w - - 0 1")),false));
t("bare king cannot mate even with enemy queen",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/4q3/4K3 w - - 0 1")),true));
t("queen clearly can mate",()=>assert.equal(C.cannotMate("w",board("4k3/8/8/8/8/8/8/3QK3 w - - 0 1")),false));
t("invalid material board fails closed",()=>assert.throws(()=>C.cannotMate("w",[])));
t("clock monotonic across backwards wall-time at completed move",()=>{
 const s=C.move(C.start(C.config("rapid10"),10000),"w",1);
 assert.equal(s.ok,true);assert.equal(s.state.at,10000);
 assert.equal(C.settle(s.state,11000).remaining.b,599000);
});
t("resume backwards clock cannot grant time",()=>{
 const s=C.resume(C.pause(C.start(C.config("rapid10"),10000),15000),200);
 assert.equal(s.at,15000);
 assert.equal(C.settle(s,16000).remaining.w,594000);
});
t("hidden tab 48-second elapsed debit",()=>{const s=C.settle(C.start(C.config("bullet1"),300),48300);assert.equal(s.remaining.w,12000);});
t("hourglass not part of canonical clock state",()=>assert.equal("hourglass" in C.start(C.config("blitz5"),0),false));
console.log("PASS B8 clock "+count+"/"+count);
