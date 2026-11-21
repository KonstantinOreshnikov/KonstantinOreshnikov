/* Real Stockfish 19.0.1 UCI acceptance: opening legality + forced mate.
 * No synthetic responses; this spawns the actual GPL engine and WASM.
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
 assert.ok(fs.existsSync(p),"Missing licensed engine file: "+p);
 assert.ok(fs.statSync(p).size>20000,"Incomplete engine file: "+p);
}
const mate=new Chess();
for(const san of ["e4","e5","Bc4","Nc6","Qh5","Nf6"])assert.ok(mate.move(san));
const positions=[
 {name:"legal opening bestmove",fen:new Chess().fen(),expectMate:false},
 {name:"verified mate-in-one bestmove",fen:mate.fen(),expectMate:true}
];
const child=spawn(process.execPath,[executable],{cwd:dir,stdio:["pipe","pipe","pipe"]});
let buffer="",err="",state="waiting-uci",index=-1,done=false;
const timeout=setTimeout(()=>finish(1,"Timed out in "+state),55000);
function finish(code,reason){
 if(done)return;done=true;clearTimeout(timeout);child.kill();
 if(code){console.error("FAIL Stockfish UCI: "+reason+"\n"+err.slice(-700));process.exitCode=1;}
 else console.log("PASS Stockfish native UCI 2 / 2 (opening legal + mate in one)");
}
function startNext(){
 index++;
 if(index===positions.length){finish(0,"done");return;}
 state="searching";
 child.stdin.write("position fen "+positions[index].fen+"\ngo depth "+(positions[index].expectMate?5:4)+"\n");
}
function onLine(line){
 line=line.trim();if(!line)return;
 if(line==="uciok"&&state==="waiting-uci"){state="waiting-ready";child.stdin.write("isready\n");return;}
 if(line==="readyok"&&state==="waiting-ready"){startNext();return;}
 if(line.startsWith("bestmove ")&&state==="searching"){
  const match=/^bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/.exec(line);
  if(!match){finish(1,"Invalid UCI bestmove "+line);return;}
  const uci=match[1],pos=positions[index],board=new Chess(pos.fen);
  const candidate=board.moves({verbose:true}).find(m=>m.from===uci.slice(0,2)&&m.to===uci.slice(2,4)&&(m.promotion||"")===(uci.slice(4)||""));
  if(!candidate){finish(1,"Illegal move "+uci+" in "+pos.name);return;}
  board.move(candidate);
  if(pos.expectMate && !board.in_checkmate()){finish(1,"Expected mate-in-one; engine suggested "+uci);return;}
  console.log("PASS Stockfish "+pos.name+": "+uci);
  startNext();
 }
}
child.stdout.setEncoding("utf8");child.stderr.setEncoding("utf8");
child.stdout.on("data",chunk=>{
 buffer+=chunk;
 let idx;
 while(!done&&(idx=buffer.indexOf("\n"))!==-1){
  const line=buffer.slice(0,idx);buffer=buffer.slice(idx+1);onLine(line);
 }
});
child.stderr.on("data",x=>err+=x);
child.on("error",e=>finish(1,e.message));
child.on("exit",code=>{if(!done)finish(1,"premature exit "+code);});
child.stdin.write("uci\n");
