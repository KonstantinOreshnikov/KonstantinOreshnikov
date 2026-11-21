/* B8 clock state machine: exact elapsed-time accounting; UI animations never own time. */
(function(root,factory) {
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.ChessClock=api;
})(typeof window!=="undefined"?window:this,function(){
  "use strict";
  const PRESETS=Object.freeze({
    none:[0,0],bullet1:[1,0],blitz3:[3,0],blitz5:[5,0],
    rapid10:[10,0],rapid15:[15,0],rapid1510:[15,10],
    rapid20:[20,0],rapid30:[30,0]
  });
  const validTime=n=>Number.isFinite(n)&&Number.isInteger(n)&&n>=0;
  function config(choice,minutes,increment) {
    const pair=Object.prototype.hasOwnProperty.call(PRESETS,choice)?PRESETS[choice]:null;
    if(choice!=="custom"&&!pair)throw new Error("Unknown clock preset");
    const m=pair?pair[0]:Number(minutes),s=pair?pair[1]:Number(increment);
    if(!validTime(m)||!validTime(s)||m>180||s>120||(!m&&choice!=="none"))
      throw new Error("Invalid time control");
    return {preset:choice,baseMs:m*60000,incrementMs:s*1000};
  }
  const validNow=n=>Number.isFinite(n)&&n>=0;
  function start(c,now) {
    if(!c||!validTime(c.baseMs)||!validTime(c.incrementMs)||!validNow(now))
      throw new Error("Invalid clock start");
    return {v:1,preset:c.preset,baseMs:c.baseMs,incrementMs:c.incrementMs,
      remaining:{w:c.baseMs,b:c.baseMs},active:c.baseMs?"w":null,
      at:now,paused:false,done:!c.baseMs,flagged:null};
  }
  function settle(s,now) {
    if(!s||!validNow(now))throw new Error("Invalid clock tick");
    if(!s.active||s.done||s.paused)return {...s,remaining:{...s.remaining}};
    // Never grant time if a wall clock moves backwards.
    const elapsed=Math.max(0,now-s.at),left=s.remaining[s.active]-elapsed;
    const remain={...s.remaining,[s.active]:Math.max(0,left)};
    return {...s,remaining:remain,at:Math.max(now,s.at),
      flagged:left<=0?s.active:null,done:left<=0,active:left<=0?null:s.active};
  }
  function move(s,color,now) {
    const current=settle(s,now);
    if(current.done||current.paused||current.active!==color||!["w","b"].includes(color))
      return {ok:false,state:current};
    const next={...current,remaining:{...current.remaining,
      [color]:current.remaining[color]+current.incrementMs},
      active:color==="w"?"b":"w",at:now};
    return {ok:true,state:next};
  }
  function pause(s,now){
    const current=settle(s,now);
    return {...current,paused:!current.done,at:now};
  }
  function resume(s,now){
    if(!validNow(now))throw new Error("Invalid resume time");
    return {...s,remaining:{...s.remaining},paused:false,at:now};
  }
  function stop(s,now){
    const current=settle(s,now);
    return {...current,active:null,paused:false,done:true};
  }
  function restore(saved,now){
    if(!saved||saved.v!==1||!Object.prototype.hasOwnProperty.call(PRESETS,saved.preset)
      &&saved.preset!=="custom")return null;
    try{
      const c=config(saved.preset,saved.baseMs/60000,saved.incrementMs/1000);
      if(saved.baseMs!==c.baseMs||saved.incrementMs!==c.incrementMs
        ||!validNow(saved.at)||!validNow(now)||!saved.remaining
        ||!["w","b",null].includes(saved.active)||typeof saved.paused!=="boolean"
        ||typeof saved.done!=="boolean"
        ||!["w","b",null].includes(saved.flagged)
        ||!["w","b"].every(x=>validTime(saved.remaining[x])&&saved.remaining[x]<=c.baseMs+1000*2000))return null;
      return settle({...saved,remaining:{w:saved.remaining.w,b:saved.remaining.b}},now);
    }catch{return null;}
  }
  function format(ms){
    const sec=Math.max(0,Math.ceil(ms/1000));
    const hours=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
    return (hours?hours+":"+String(m).padStart(2,"0"):String(m).padStart(2,"0"))+":"+String(s).padStart(2,"0");
  }
  return Object.freeze({PRESETS,config,start,settle,move,pause,resume,stop,restore,format});
});
