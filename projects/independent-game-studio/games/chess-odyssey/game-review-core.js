/* Chess Odyssey P2: independent, opt-in UCI postgame review (not game AI).
 * Stockfish GPL engine runs in a separate Worker on HTTPS / localhost only.
 * Score and win-probability methodology is our own proxy; never imply FIDE Elo.
 */
(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.ChessGameReview=api;})(typeof window!=="undefined"?window:this,function(){
"use strict";
const ENGINE_PATH="engine/stockfish-19-lite-single.js";
const METHOD="CO-EXPECTED-POINTS-V1";
const LIMIT=240;
const LEVELS=Object.freeze({quick:120,balanced:280,deep:650});
function validPly(x){return Number.isSafeInteger(x)&&x>=0;}
function timeline(Chess,pgn,emptyFen){
 if(typeof Chess!=="function")throw new Error("Chess constructor required");
 const board=new Chess();
 if(typeof pgn==="string"&&pgn.trim()){
   if(!board.load_pgn(pgn))throw new Error("Invalid PGN");
 }else if(emptyFen){if(!board.load(emptyFen))throw new Error("Invalid FEN");}
 const history=board.history({verbose:true});
 const positions=Array(history.length+1);
 positions[history.length]=board.fen();
 for(let i=history.length-1;i>=0;i--){board.undo();positions[i]=board.fen();}
 return {positions,moves:history};
}
function atPly(Chess,pgn,ply,emptyFen){
 const src=timeline(Chess,pgn,emptyFen);
 if(!validPly(ply)||ply>src.moves.length)throw new Error("Invalid reviewed ply");
 return new Chess(src.positions[ply]);
}
function uciOf(m){return m.from+m.to+(m.promotion||"");}
function probability(cp){
 if(!Number.isFinite(cp))return null;
 return 1/(1+Math.exp(-0.00368*Math.max(-30000,Math.min(30000,cp))));
}
function info(line,fen){
 if(typeof line!=="string"||!/^info\s/.test(line))return null;
 if(/\b(?:lowerbound|upperbound)\b/.test(line))return null;
 const d=/\bdepth (\d+)\b/.exec(line),pv=/\bpv ([a-h][1-8][a-h][1-8][qrbn]?)/.exec(line);
 const sc=/\bscore (cp|mate) (-?\d+)\b/.exec(line);
 if(!d||!sc)return null;
 const side=fen.split(" ")[1];
 if(!["w","b"].includes(side))return null;
 const raw=Number(sc[2]);
 if(!Number.isFinite(raw))return null;
 const cp=sc[1]==="mate"?(raw===0?0:Math.sign(raw)*30000):raw;
 return {depth:Number(d[1]),cpWhite:side==="w"?cp:-cp,mate:sc[1]==="mate"?raw:null,bestUci:pv?.[1]||null};
}
function classify(before,after,move){
 const actor=move.color;
 if(!before||!after||!Number.isFinite(before.cpWhite)||!Number.isFinite(after.cpWhite)||before.depth<5||after.depth<5)
   return {tag:"unknown",loss:null,accuracy:null};
 const sign=actor==="w"?1:-1;
 const expected=probability(before.cpWhite*sign),actual=probability(after.cpWhite*sign);
 const loss=Math.max(0,Math.min(1,expected-actual));
 let tag;
 if(before.bestUci===uciOf(move))tag="best";
 else if(loss<=0.025)tag="excellent";
 else if(loss<=0.065)tag="good";
 else if(loss<=0.11)tag="ordinary";
 else if(loss<=0.18)tag="inaccuracy";
 else if(loss<=0.32)tag="mistake";
 else tag="blunder";
 return {tag,loss,accuracy:Math.round((1-loss)*1000)/10};
}
function results(moves,evals){
 const entries=moves.map((move,i)=>{
   const grade=classify(evals[i],evals[i+1],move);
   return {ply:i+1,color:move.color,san:move.san,from:move.from,to:move.to,
     bestUci:evals[i]?.bestUci||null,depth:Math.min(evals[i]?.depth||0,evals[i+1]?.depth||0),
     cpBefore:evals[i]?.cpWhite??null,cpAfter:evals[i+1]?.cpWhite??null,...grade};
 });
 const sides={w:{analyzed:0,total:0,accuracy:null,lossSum:0,counts:{}},
 b:{analyzed:0,total:0,accuracy:null,lossSum:0,counts:{}}};
 for(const e of entries){const s=sides[e.color];s.total++;s.counts[e.tag]=(s.counts[e.tag]||0)+1;
   if(e.loss!==null){s.analyzed++;s.lossSum+=e.loss;}
 }
 for(const s of Object.values(sides)){
   s.accuracy=s.analyzed?Math.round(1000*(1-s.lossSum/s.analyzed))/10:null;
   delete s.lossSum;
 }
 return {method:METHOD,entries,summary:sides,analyzed:entries.filter(x=>x.loss!==null).length,total:entries.length};
}
class UciAnalyzer{
 constructor(options={}){
   this.factory=options.factory||(path=>new Worker(path));
   this.path=options.path||ENGINE_PATH;
   this.timeout=options.timeout||5000;this.clock=options.clock||globalThis;
   this.worker=null;this.pending=null;this.readyPromise=null;this.readyResolve=null;this.readyReject=null;this.timer=null;
   this.last=null;this.cache=new Map();this.generation=0;
 }
 _send(msg){if(!this.worker)throw new Error("Worker not initialized");this.worker.postMessage(msg);}
 _onMessage(event){
   const lines=Array.isArray(event.data)?event.data:String(event.data).split(/\r?\n/);
   for(const raw of lines){
     const line=String(raw).trim();
     if(line==="uciok"){this._send("setoption name MultiPV value 1");this._send("isready");}
     else if(line==="readyok"&&this.readyResolve){const ok=this.readyResolve;this.readyResolve=null;this.readyReject=null;ok(true);}
     else if(this.pending&&/^info\s/.test(line)){
       const point=info(line,this.pending.fen);
       if(point&&(!this.last||point.depth>=this.last.depth))this.last=point;
     }else if(this.pending&&/^bestmove\s/.test(line)){
       const pending=this.pending;this.pending=null;this.clock.clearTimeout(this.timer);this.timer=null;
       const move=/^bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/.exec(line)?.[1];
       const done=this.last&&this.last.depth>=5?{...this.last,bestUci:this.last.bestUci||move||null}:null;
       this.last=null;pending.resolve(done);
     }
   }
 }
 async ready(){
   if(this.worker&&this.readyResolve===null)return;
   if(this.readyPromise)return this.readyPromise;
   this.readyPromise=new Promise((resolve,reject)=>{
     this.readyResolve=resolve;this.readyReject=reject;
     try{
       this.worker=this.factory(this.path);
       this.worker.onmessage=event=>this._onMessage(event);
       this.worker.onerror=()=>this.cancel(new Error("Stockfish analysis worker failed"));
       this.timer=this.clock.setTimeout(()=>this.cancel(new Error("Stockfish initialization timed out")),12000);
       this._send("uci");
     }catch(error){this.cancel(error);}
   });
   try{await this.readyPromise;}finally{this.clock.clearTimeout(this.timer);this.timer=null;}
 }
 async evaluate(fen,millis=LEVELS.quick){
   if(this.pending)throw new Error("Review worker already searching");
   if(!/^\S+\/\S+\/.*\s[w|b]\s/.test(fen)&&!fen.includes(" w ")&&!fen.includes(" b "))throw new Error("Invalid review position");
   const time=Math.min(2000,Math.max(50,Number(millis)||120)),key=fen+"|"+time;
   if(this.cache.has(key))return this.cache.get(key);
   await this.ready();
   this.last=null;
   const result=await new Promise((resolve,reject)=>{
     this.pending={resolve,reject,fen};
     this.timer=this.clock.setTimeout(()=>{
       const x=this.pending;this.pending=null;this.timer=null;
       if(x)x.reject(new Error("Stockfish review timed out"));
       this.cancel();
     },time+this.timeout);
     this._send("position fen "+fen);
     this._send("go movetime "+time);
   });
   if(result)this.cache.set(key,result);
   return result;
 }
 cancel(err){
   this.generation++;
   if(this.timer!==null){this.clock.clearTimeout(this.timer);this.timer=null;}
   if(this.readyReject){const no=this.readyReject;this.readyReject=null;this.readyResolve=null;no(err||new Error("Analysis cancelled"));}
   if(this.pending){const no=this.pending.reject;this.pending=null;no(err||new Error("Analysis cancelled"));}
   if(this.worker){try{this.worker.terminate();}catch{}this.worker=null;}
   this.readyPromise=null;this.last=null;
 }
 dispose(){this.cancel();}
}
async function analyzeGame(Chess,pgn,{quality="quick",onProgress=()=>{},worker}={}){
 const source=timeline(Chess,pgn);
 if(source.moves.length>LIMIT)throw new Error("PGN exceeds review safety limit");
 const ownWorker=!worker,engine=worker||new UciAnalyzer(),evals=[];
 const millis=LEVELS[quality]||LEVELS.quick;
 try{
   for(let i=0;i<source.positions.length;i++){
     evals.push(await engine.evaluate(source.positions[i],millis));
     onProgress({done:i+1,total:source.positions.length});
   }
   return { ...results(source.moves,evals),quality,engine:"Stockfish 19 Lite",positions:source.positions };
 }finally{if(ownWorker)engine.dispose();}
}
return Object.freeze({ENGINE_PATH,METHOD,LEVELS,LIMIT,timeline,atPly,info,probability,classify,results,UciAnalyzer,analyzeGame});
});
