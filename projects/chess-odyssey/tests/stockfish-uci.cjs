/* Stockfish 19.0.1 Lite single-threaded UCI integration smoke.
 * Requires the vendored GPL engine assets in ../engine.
 * This test talks to the ACTUAL engine; no mocked UCI responses.
 */
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const fs=require("node:fs");
const {spawn}=require("node:child_process");
const {Chess}=require("../vendor/chess.js");
const dir=path.join(__dirname,"../engine");
const executable=path.join(dir,"stockfish-19-lite-single.js");
const wasm=path.join(dir,"stockfish-19-lite-single.wasm");
for(const p of [executable,wasm,path.join(dir,"Copying.txt")]){
  assert.ok(fs.existsSync(p),"Required vendored engine missing: "+p);
  assert.ok(fs.statSync(p).size>20000,"Vendored engine incomplete: "+p);
}
const child=spawn(process.execPath,[executable],{cwd:dir,stdio:["pipe","pipe","pipe"]});
let out="",err="",ready=false,done=false;
const stop=(code,message)=>{
 if(done)return;done=true;clearTimeout(timeout);
 child.kill();
 if(code!==0){console.error("FAIL stockfish UCI: "+message+"\n"+out.slice(-900)+"\n"+err.slice(-900));process.exitCode=1;}
 else console.log("PASS Stockfish 19.0.1 native UCI, startpos depth 4, legal bestmove");
};
const timeout=setTimeout(()=>stop(1,"UCI timeout"),35000);
child.stdout.setEncoding("utf8");
child.stderr.setEncoding("utf8");
child.stdout.on("data",chunk=>{
 out+=chunk;
 if(!ready&&out.includes("uciok")){ready=true;child.stdin.write("isready\nposition startpos\ngo depth 4\n");}
 const m=out.match(/(?:^|\n)bestmove ([a-h][1-8][a-h][1-8][qrbn]?)(?:\s|$)/);
 if(m){
   const c=new Chess();
   const legal=c.moves({verbose:true}).some(x=>x.from===m[1].slice(0,2)&&x.to===m[1].slice(2,4));
   if(!legal)stop(1,"engine returned illegal bestmove "+m[1]);else stop(0,"legal bestmove");
 }
});
child.stderr.on("data",x=>err+=x);
child.on("error",e=>stop(1,e.message));
child.on("exit",code=>{if(!done)stop(1,"early exit "+code);});
child.stdin.write("uci\n");
