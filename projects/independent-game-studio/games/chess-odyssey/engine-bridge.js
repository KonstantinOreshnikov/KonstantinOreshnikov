/*
 * Chess Odyssey B3 UCI bridge — the only connection to genuine Stockfish.
 * Keeps Stockfish as a separate Worker with GPLv3 source and license.
 * Does not approximate Stockfish strength, invent Elo, or make server calls.
 */
(function(root,make){
  "use strict";
  const api=make();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.ChessEngineBridge=api;
})(typeof window!=="undefined"?window:this,function(){
  "use strict";
  const LEVELS=Object.freeze({
    beginner:Object.freeze({id:"beginner",title:"Beginner",mode:"local",localDepth:1,spread:105}),
    novice:Object.freeze({id:"novice",title:"Novice",mode:"local",localDepth:2,spread:20}),
    intermediate:Object.freeze({id:"intermediate",title:"Intermediate",mode:"uci",skill:2,movetime:180,localDepth:2}),
    advanced:Object.freeze({id:"advanced",title:"Advanced",mode:"uci",skill:8,movetime:350,localDepth:3}),
    expert:Object.freeze({id:"expert",title:"Expert",mode:"uci",skill:15,movetime:750,localDepth:3}),
    grandmaster:Object.freeze({id:"grandmaster",title:"Grandmaster Challenge",mode:"uci",skill:20,movetime:1450,localDepth:3})
  });
  const ids=Object.keys(LEVELS);
  const ENGINE_PATH="engine/stockfish-19-lite-single.js";
  const UCI_RE=/^bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?|0000)(?:\s|$)/;
  function profile(id){return LEVELS[id]||LEVELS.beginner;}
  function parseBestMove(line){
    if(typeof line!=="string")return null;
    const m=UCI_RE.exec(line.trim());
    return m&&m[1]!=="0000"?m[1]:null;
  }
  function legalUci(board,uci){
    if(!uci||typeof uci!=="string"||!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci))return null;
    const from=uci.slice(0,2),to=uci.slice(2,4),promotion=uci.slice(4)||undefined;
    const legal=board.moves({verbose:true}).find(x=>x.from===from&&x.to===to&&x.promotion===promotion);
    return legal?{from,to,promotion,san:legal.san}:null;
  }
  class Bridge{
    constructor(options){
      const o=options||{};
      this.path=o.path||ENGINE_PATH;
      this.factory=o.createWorker||((url)=>new Worker(url));
      this.setTimer=o.setTimer||((fn,ms)=>setTimeout(fn,ms));
      this.clearTimer=o.clearTimer||((id)=>clearTimeout(id));
      this.worker=null;this.ready=null;this.pending=null;this.waiting=null;this.readyTimer=null;
      this.lastError=null;this.generation=0;
    }
    _send(line){if(!this.worker)throw new Error("Stockfish worker unavailable");this.worker.postMessage(line);}
    _lines(payload){
      const lines=Array.isArray(payload)?payload:[payload];
      return lines.flatMap(x=>String(x).split(/\r?\n/)).map(x=>x.trim()).filter(Boolean);
    }
    _receive(event){
      for(const line of this._lines(event.data)){
        if(line==="uciok"&&this.waiting==="uci"){this.waiting="ready";this._send("isready");continue;}
        if(line==="readyok"&&this.waiting==="ready"){
          this.waiting=null;this.clearTimer(this.readyTimer);this.readyTimer=null;
          if(this.ready){const r=this.ready;this.ready=null;r.resolve(true);}
          continue;
        }
        if(line.startsWith("bestmove ")&&this.pending){
          const pending=this.pending;this.pending=null;this.clearTimer(pending.timer);
          const uci=parseBestMove(line);
          if(uci)pending.resolve({uci,engine:"stockfish-19-lite",level:pending.level});
          else pending.reject(new Error("Stockfish returned no usable move: "+line));
        }
      }
    }
    _error(error){
      const reason=error instanceof Error?error:new Error("Stockfish worker failed");
      this.lastError=reason.message;
      if(this.ready){const r=this.ready;this.ready=null;r.reject(reason);}
      if(this.pending){const p=this.pending;this.pending=null;this.clearTimer(p.timer);p.reject(reason);}
      this.cancel(reason);
    }
    async ensureReady(){
      if(this.worker&&!this.waiting&&!this.ready)return true;
      if(this.ready)return this.ready.promise;
      let resolve,reject;
      const promise=new Promise((ok,no)=>{resolve=ok;reject=no;});
      this.ready={promise,resolve,reject};this.waiting="uci";
      const token=++this.generation;
      try{
        const worker=this.factory(this.path);
        this.worker=worker;
        worker.onmessage=(event)=>{if(token===this.generation)this._receive(event);};
        worker.onerror=(event)=>{if(token===this.generation)this._error(new Error(event&&event.message||"Stockfish load error"));};
        this.readyTimer=this.setTimer(()=>{
          if(token===this.generation&&this.ready)this._error(new Error("Stockfish initialization timed out"));
        },13000);
        this._send("uci");
      }catch(err){this._error(err);}
      return promise;
    }
    async choose(fen,levelId){
      const level=profile(levelId);
      if(level.mode!=="uci")throw new Error("Local profile is not a Stockfish engine profile");
      if(typeof fen!=="string"||!fen.includes(" "))throw new Error("Invalid FEN input");
      await this.ensureReady();
      if(this.pending)throw new Error("Another Stockfish search is in progress");
      // A started search belongs to this engine generation only. cancel() invalidates it.
      const token=this.generation;
      return new Promise((resolve,reject)=>{
        const timer=this.setTimer(()=>{
          if(this.pending&&this.pending.generation===token)this._error(new Error("Stockfish search timed out"));
        },level.movetime+11000);
        this.pending={resolve,reject,timer,generation:token,level:level.id};
        try{
          this._send("setoption name Skill Level value "+level.skill);
          this._send("position fen "+fen);
          this._send("go movetime "+level.movetime);
        }catch(err){this._error(err);}
      });
    }
    cancel(reason){
      this.generation++;
      const error=reason instanceof Error?reason:new Error("Stockfish analysis cancelled");
      this.clearTimer(this.readyTimer);this.readyTimer=null;this.waiting=null;
      if(this.ready){const r=this.ready;this.ready=null;r.reject(error);}
      if(this.pending){const p=this.pending;this.pending=null;this.clearTimer(p.timer);p.reject(error);}
      if(this.worker){this.worker.onmessage=null;this.worker.onerror=null;try{this.worker.terminate();}catch(_e){}this.worker=null;}
    }
    dispose(){this.cancel();}
  }
  return Object.freeze({LEVELS,ids,profile,parseBestMove,legalUci,Bridge,ENGINE_PATH,version:"B3-UCI-1"});
});