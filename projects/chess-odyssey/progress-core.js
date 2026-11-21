/* Chess Odyssey B6 — progress mathematics, strict independent-bot match eligibility.
 * Pure data module; no DOM, network, chess engine reimplementation, random ratings.
 * Academy Reputation and local AI Ladder Index are NOT Elo/FIDE ratings.
 */
(function(root,factory){
 "use strict";const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.ChessProgressCore=api;
})(typeof window!=="undefined"?window:this,function(){
 "use strict";
 const VERSION=1;
 const TIERS=Object.freeze(["beginner","novice","intermediate","advanced","expert","grandmaster"]);
 const REPUTATION={lesson:20,momentViewed:4,momentSolved:12,fullMaster:20,firstWinTier:15};
 const LANG=["ru","en","az"];
 const ACHIEVEMENTS=Object.freeze([
  {id:"first-lesson",name:{ru:"Первый ход",en:"First step",az:"İlk addım"},desc:{ru:"Завершить первый урок Академии.",en:"Complete one Academy lesson.",az:"Akademiyada ilk dərsi tamamlayın."}},
  {id:"rules",name:{ru:"Знаю правила",en:"Rules learned",az:"Qaydaları öyrəndim"},desc:{ru:"Пройти все 9 базовых уроков.",en:"Complete all 9 Rules lessons.",az:"9 əsas qayda dərsinin hamısını bitirin."}},
  {id:"tactics",name:{ru:"Вижу комбинации",en:"Tactics explorer",az:"Taktika bilicisi"},desc:{ru:"Пройти все 8 уроков тактики.",en:"Complete all 8 Tactics lessons.",az:"8 taktika dərsinin hamısını bitirin."}},
  {id:"openings",name:{ru:"Владею дебютами",en:"Opening student",az:"Debüt tələbəsi"},desc:{ru:"Освоить 8 дебютных уроков за оба цвета.",en:"Complete all 8 Opening lessons for both colours.",az:"Hər iki rənglə 8 debüt dərsini bitirin."}},
  {id:"endgames",name:{ru:"Освоил эндшпиль",en:"Endgame student",az:"Endşpil tələbəsi"},desc:{ru:"Пройти все 8 уроков эндшпиля.",en:"Complete all 8 Endgame lessons.",az:"8 endşpil dərsinin hamısını bitirin."}},
  {id:"all-lessons",name:{ru:"Выпускник Академии",en:"Academy graduate",az:"Akademiya məzunu"},desc:{ru:"Пройти все 33 урока.",en:"Complete all 33 lessons.",az:"33 dərsin hamısını bitirin."}},
  {id:"first-moment",name:{ru:"Историк",en:"History explorer",az:"Şahmat tarixçisi"},desc:{ru:"Изучить один ключевой ход мастера.",en:"Study one highlighted master move.",az:"Ustadın bir əsas gedişini öyrənin."}},
  {id:"ten-moments",name:{ru:"Десять идей",en:"Ten master ideas",az:"On ustad ideyası"},desc:{ru:"Открыть 10 разных исторических моментов.",en:"Study 10 different historical moments.",az:"10 fərqli tarixi məqamı öyrənin."}},
  {id:"first-quiz",name:{ru:"Угадал ход мастера",en:"Read the master's mind",az:"Ustadın gedişini tapdım"},desc:{ru:"Верно назвать один исторический ход.",en:"Guess one real historical move.",az:"Bir həqiqi tarixi gedişi düzgün tapın."}},
  {id:"ten-quizzes",name:{ru:"Знаток комбинаций",en:"Ten master moves",az:"On ustad gedişi"},desc:{ru:"Решить 10 разных задач «Угадай ход».",en:"Solve 10 unique historical-move quizzes.",az:"10 fərqli tarixi gediş tapşırığını həll edin."}},
  {id:"first-master",name:{ru:"Изучил партию",en:"First complete study",az:"İlk tam təhlil"},desc:{ru:"Просмотреть все ключевые моменты и финал одной партии.",en:"Visit all annotated moments and the ending of one game.",az:"Bir oyunun bütün əsas məqamlarını və sonluğunu öyrənin."}},
  {id:"ten-masters",name:{ru:"Библиотекарь",en:"Chess librarian",az:"Şahmat kitabxanaçısı"},desc:{ru:"Полностью изучить 10 партий.",en:"Complete 10 historical game studies.",az:"10 tarixi partiyanı tam öyrənin."}},
  {id:"all-masters",name:{ru:"Мастера и легенды",en:"Masters & legends",az:"Ustadlar və əfsanələr"},desc:{ru:"Изучить все 31 исторические партии.",en:"Complete all 31 historical studies.",az:"31 tarixi partiyanın hamısını öyrənin."}},
  {id:"first-independent",name:{ru:"Самостоятельный игрок",en:"Independent player",az:"Müstəqil oyunçu"},desc:{ru:"Завершить полноценный матч без помощи.",en:"Finish one eligible unassisted match.",az:"Köməksiz bir tam oyunu bitirin."}},
  {id:"first-independent-win",name:{ru:"Первая самостоятельная победа",en:"First independent win",az:"İlk müstəqil qələbə"},desc:{ru:"Выиграть матч без помощи.",en:"Win an eligible independent match.",az:"Köməksiz oyunda qələbə qazanın."}},
  {id:"five-independent",name:{ru:"Первые выводы",en:"First provisional score",az:"İlkin nəticələr"},desc:{ru:"Завершить 5 независимых матчей.",en:"Finish 5 eligible independent matches.",az:"5 müstəqil oyunu bitirin."}}
 ]);
 const isString=(x)=>typeof x==="string";
 const validId=(s)=>isString(s)&&/^[a-z0-9][a-z0-9-]{0,70}$/.test(s);
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 function empty(){return {schema:VERSION,masters:{},matches:[]};}
 function safe(raw,validGames){
  const state=empty();
  if(!raw||raw.schema!==VERSION||typeof raw!=="object")return state;
  const valid=new Map((validGames||[]).map(g=>[g.id,g]));
  if(raw.masters&&typeof raw.masters==="object"&&!Array.isArray(raw.masters)){
    for(const [id,info] of Object.entries(raw.masters)){
      const game=valid.get(id);
      if(!game||!info||typeof info!=="object")continue;
      const allowed=new Set(game.moments.map(m=>m.ply));
      const filter=arr=>[...new Set((Array.isArray(arr)?arr:[]).filter(x=>Number.isInteger(x)&&allowed.has(x)))].sort((a,b)=>a-b);
      state.masters[id]={seen:filter(info.seen),solved:filter(info.solved),endViewed:info.endViewed===true};
    }
  }
  const known=new Set();
  for(const m of (Array.isArray(raw.matches)?raw.matches:[]).slice(-500)){
    if(!m||!validId(m.id)||known.has(m.id))continue;
    if(!TIERS.includes(m.level)||!["w","b"].includes(m.side)||!["win","loss","draw"].includes(m.result))continue;
    if(!Number.isInteger(m.plies)||m.plies<4||m.plies>1000)continue;
    if(m.engine!==(TIERS.indexOf(m.level)<2?"local":"stockfish"))continue;
    if(typeof m.date!=="string"||m.date.length>60)continue;
    known.add(m.id);
    state.matches.push({id:m.id,level:m.level,side:m.side,result:m.result,plies:m.plies,engine:m.engine,date:m.date});
  }
  return state;
 }
 function clone(state){return {schema:VERSION,masters:Object.fromEntries(Object.entries(state.masters).map(([id,m])=>[id,{seen:[...m.seen],solved:[...m.solved],endViewed:m.endViewed}])),matches:state.matches.map(m=>({...m}))};}
 function visit(state,game,ply){
  if(!game||!validId(game.id)||!Number.isInteger(ply)||ply<0||ply>game.totalPlies)return state;
  const before=state.masters[game.id]||{seen:[],solved:[],endViewed:false};
  const marker=game.moments.some(m=>m.ply===ply);
  if(!marker&&!(ply===game.totalPlies))return state;
  const next=clone(state),old=next.masters[game.id]||{seen:[],solved:[],endViewed:false};
  if(marker&&!old.seen.includes(ply))old.seen.push(ply);
  old.seen.sort((a,b)=>a-b);
  if(ply===game.totalPlies)old.endViewed=true;
  next.masters[game.id]=old;
  return next;
 }
 function solve(state,game,ply){
  if(!game||!game.moments.some(m=>m.ply===ply))return state;
  const next=visit(state,game,ply),full=clone(next);
  const info=full.masters[game.id];
  if(!info.solved.includes(ply))info.solved.push(ply);
  info.solved.sort((a,b)=>a-b);
  return full;
 }
 function validateMatch(Chess,record){
  if(!record||record.mode!=="independent")return {ok:false,reason:"not-independent"};
  if(!validId(record.id)||!TIERS.includes(record.level)||!["w","b"].includes(record.side))return {ok:false,reason:"unknown-match"};
  if(record.assisted||record.undone||record.restarted||record.fallback)return {ok:false,reason:"assisted-or-fallback"};
  if(record.engine!==(TIERS.indexOf(record.level)<2?"local":"stockfish"))return {ok:false,reason:"engine-not-verified"};
  if(!isString(record.pgn)||!record.pgn.trim()||record.pgn.length>50000)return {ok:false,reason:"missing-pgn"};
  const chess=new Chess();
  if(!chess.load_pgn(record.pgn))return {ok:false,reason:"invalid-pgn"};
  if(chess.history().length<4||!chess.game_over())return {ok:false,reason:"not-finished"};
  const result=chess.in_checkmate()?(chess.turn()===record.side?"loss":"win"):"draw";
  if(record.result!==result)return {ok:false,reason:"outcome-inconsistent"};
  return {ok:true,entry:{id:record.id,level:record.level,side:record.side,result,plies:chess.history().length,engine:record.engine,date:typeof record.date==="string"?record.date.slice(0,60):"local"}};
 }
 function match(state,Chess,record){
  const check=validateMatch(Chess,record);
  if(!check.ok)return {state,accepted:false,reason:check.reason};
  if(state.matches.some(m=>m.id===check.entry.id))return {state,accepted:false,reason:"already-counted"};
  const next=clone(state);
  next.matches.push(check.entry);
  next.matches=next.matches.slice(-500);
  return {state:next,accepted:true,reason:"ok"};
 }
 function summary(state,completed,academy,library){
  const validLesson=new Set((academy||[]).map(x=>x.id));
  const done=new Set((Array.isArray(completed)?completed:[]).filter(x=>validLesson.has(x)));
  const tracks={};
  for(const t of ["basics","tactics","openings","endgames"]){
    const tasks=(academy||[]).filter(x=>x.track===t);
    tracks[t]={completed:tasks.filter(x=>done.has(x.id)).length,total:tasks.length};
  }
  const masters=(library||[]).map(g=>{
    const m=state.masters[g.id]||{seen:[],solved:[],endViewed:false};
    const allowed=new Set(g.moments.map(x=>x.ply));
    const seen=m.seen.filter(p=>allowed.has(p)).length;
    const solved=m.solved.filter(p=>allowed.has(p)).length;
    return {id:g.id,seen,solved,total:g.moments.length,completed:m.endViewed&&seen===g.moments.length};
  });
  const visited=masters.reduce((s,g)=>s+g.seen,0),solved=masters.reduce((s,g)=>s+g.solved,0);
  const full=masters.filter(x=>x.completed).length;
  const winsByTier=Object.fromEntries(TIERS.map(level=>[level,state.matches.filter(m=>m.level===level&&m.result==="win").length]));
  const score=s=>s==="win"?1:s==="draw"?.5:0;
  const eligible=state.matches.length;
  // Explicit original formula. 0-100 INTERNAL index, not Elo or calibrated playing strength.
  // Weighted opponent-tier results averaged over last 20 games: (score * level[1..6]/6)*100.
  // At least five authentic unassisted matches are required before the number can appear.
  const recent=state.matches.slice(-20);
  const index=eligible>=5?Math.round(100*recent.reduce((sum,m)=>sum+(TIERS.indexOf(m.level)+1)/6*score(m.result),0)/recent.length):null;
  const reputation=done.size*REPUTATION.lesson+visited*REPUTATION.momentViewed+solved*REPUTATION.momentSolved+
   full*REPUTATION.fullMaster+Object.values(winsByTier).filter(n=>n>0).length*REPUTATION.firstWinTier;
  const achievements=new Set();
  if(done.size>0)achievements.add("first-lesson");
  if(tracks.basics.total&&tracks.basics.completed===tracks.basics.total)achievements.add("rules");
  if(tracks.tactics.total&&tracks.tactics.completed===tracks.tactics.total)achievements.add("tactics");
  if(tracks.openings.total&&tracks.openings.completed===tracks.openings.total)achievements.add("openings");
  if(tracks.endgames.total&&tracks.endgames.completed===tracks.endgames.total)achievements.add("endgames");
  if(academy.length&&done.size===academy.length)achievements.add("all-lessons");
  if(visited>=1)achievements.add("first-moment");
  if(visited>=10)achievements.add("ten-moments");
  if(solved>=1)achievements.add("first-quiz");
  if(solved>=10)achievements.add("ten-quizzes");
  if(full>=1)achievements.add("first-master");
  if(full>=10)achievements.add("ten-masters");
  if(library.length&&full===library.length)achievements.add("all-masters");
  if(eligible>=1)achievements.add("first-independent");
  if(state.matches.some(x=>x.result==="win"))achievements.add("first-independent-win");
  if(eligible>=5)achievements.add("five-independent");
  const rated={eligible,win:state.matches.filter(m=>m.result==="win").length,draw:state.matches.filter(m=>m.result==="draw").length,loss:state.matches.filter(m=>m.result==="loss").length,
    index,provisional:index!==null&&eligible<20,period:recent.length,minimum:5,tiers:winsByTier};
  return {academy:{done:done.size,total:academy.length,tracks},masters:{total:library.length,studied:full,momentsVisited:visited,momentsTotal:masters.reduce((s,m)=>s+m.total,0),quizzesSolved:solved,progress:masters},
    reputation,achievements:ACHIEVEMENTS.map(a=>({...a,unlocked:achievements.has(a.id)})),rated};
 }
 return Object.freeze({VERSION,TIERS,REPUTATION,ACHIEVEMENTS,empty,safe,visit,solve,match,validateMatch,summary});
});