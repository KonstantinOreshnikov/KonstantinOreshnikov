/* Chess Odyssey B9: provider-independent authoritative small-room match core.
 * The authenticated caller identity MUST come from a validated server token.
 * No direct browser access to these methods in a production deployment.
 */
"use strict";
const {randomUUID}=require("node:crypto");
const {Chess}=require("../vendor/chess.js");
const Clock=require("../clock-core.js");

class MatchError extends Error {
 constructor(code,message=code){super(message);this.name="MatchError";this.code=code;}
}
function assert(ok,code){if(!ok)throw new MatchError(code);}
const validId=v=>typeof v==="string"&&v.trim().length>0&&v.length<=256;
const validRevision=v=>Number.isSafeInteger(v)&&v>=0;
function createService({now=Date.now,makeId=randomUUID}={}){
 const invites=new Map(),matches=new Map();
 const time=()=>{const n=now();if(!Number.isFinite(n)||n<0)throw new MatchError("BAD_SERVER_TIME");return Math.floor(n);};
 const identity=id=>{assert(validId(id),"UNAUTHENTICATED");return id;};
 const opponent=(g,actor)=>g.white===actor?g.black:g.white;
 const member=(g,actor)=>{assert(g&& (g.white===actor||g.black===actor),"NOT_FOUND");return g;};
 const colorOf=(g,actor)=>g.white===actor?"w":"b";
 const statusResult=(loser,draw)=>draw?"1/2-1/2":loser==="w"?"0-1":"1-0";
 const snapshotObject=(g,actor)=>({
   id:g.id,white:g.white,black:g.black,playerColor:colorOf(g,actor),
   status:g.status,fen:g.fen,pgn:g.pgn,ply:g.moves.length,revision:g.revision,
   lastMove:g.moves.at(-1)?.san||null,clock:g.clock?JSON.parse(JSON.stringify(g.clock)):null,
   result:g.result,reason:g.reason,drawOffer:g.drawOffer,createdAt:g.createdAt,
   finishedAt:g.finishedAt||null,opponent:opponent(g,actor),
 });
 function finalize(g,result,reason,at){
   if(g.status!=="active")return false;
   g.status="finished";g.result=result;g.reason=reason;g.finishedAt=at;
   g.drawOffer=null;g.clock=g.clock?.baseMs?Clock.stop(g.clock,at):g.clock;
   g.revision++;
   return true;
 }
 function syncClock(g,at){
   if(g.status!=="active"||!g.clock?.baseMs)return;
   g.clock=Clock.settle(g.clock,Math.max(at,g.clock.at));
   if(g.clock.flagged){
     const loser=g.clock.flagged,winner=loser==="w"?"b":"w";
     const chess=new Chess();if(g.pgn&&!chess.load_pgn(g.pgn))throw new MatchError("CORRUPT_PGN");
     const draw=Clock.cannotMate(winner,chess.board());
     finalize(g,statusResult(loser,draw),draw?"no-mating-potential":"flag-fall",at);
   }
 }
 function invite({actorId,to,creatorColor="w",preset="none",minutes,increment}){
   const from=identity(actorId);identity(to);
   assert(from!==to,"SELF_INVITE");
   assert(["w","b"].includes(creatorColor),"BAD_COLOR");
   const config=Clock.config(preset,minutes,increment);
   const createdAt=time(),id=makeId();
   assert(!invites.has(id),"ID_COLLISION");
   const entry={id,from,to,creatorColor,config,createdAt,expiresAt:createdAt+86400000,status:"pending",matchId:null};
   invites.set(id,entry);return viewInvite(id,from);
 }
 function viewInvite(id,actorId){
   const actor=identity(actorId),v=invites.get(id);
   assert(v&&(v.from===actor||v.to===actor),"NOT_FOUND");
   return {...v,config:{...v.config}};
 }
 function accept({actorId,inviteId}){
   const actor=identity(actorId),offer=invites.get(inviteId);
   assert(offer&&offer.to===actor,"NOT_FOUND");
   assert(offer.status==="pending","INVITE_USED");
   assert(time()<offer.expiresAt,"INVITE_EXPIRED");
   const createdAt=time(),id=makeId();assert(!matches.has(id),"ID_COLLISION");
   const chess=new Chess(),white=offer.creatorColor==="w"?offer.from:offer.to;
   const black=offer.creatorColor==="b"?offer.from:offer.to;
   const state={id,white,black,createdAt,finishedAt:null,
     fen:chess.fen(),pgn:"",moves:[],revision:0,status:"active",result:null,reason:null,
     drawOffer:null,clock:Clock.start(offer.config,createdAt),seenRequests:new Map()};
   matches.set(id,state);offer.status="accepted";offer.matchId=id;
   return snapshotObject(state,actor);
 }
 function decline({actorId,inviteId}){
   const actor=identity(actorId),offer=invites.get(inviteId);
   assert(offer&&offer.to===actor,"NOT_FOUND");assert(offer.status==="pending","INVITE_USED");
   offer.status="declined";return {id:inviteId,status:"declined"};
 }
 function getGame(gameId,actorId){
   const actor=identity(actorId),g=member(matches.get(gameId),actor);
   syncClock(g,time());return snapshotObject(g,actor);
 }
 function play({actorId,gameId,expectedRevision,requestId,from,to,promotion}){
   const actor=identity(actorId),g=member(matches.get(gameId),actor),at=time();
   assert(validId(requestId)&&requestId.length<=96,"BAD_REQUEST_ID");
   // Replaying an already committed request is safe and idempotent.
   const prior=g.seenRequests.get(requestId);
   if(prior){
     assert(prior.actorId===actor&&prior.from===from&&prior.to===to&&prior.promotion===(promotion||null),"REQUEST_ID_REUSED");
     return {...snapshotObject(g,actor),duplicate:true};
   }
   syncClock(g,at);
   assert(g.status==="active","GAME_FINISHED");
   assert(validRevision(expectedRevision)&&expectedRevision===g.revision,"STALE_REVISION");
   const color=colorOf(g,actor),chess=new Chess();
   assert(color===(g.moves.length%2?"b":"w"),"NOT_YOUR_TURN");
   assert(typeof from==="string"&&/^[a-h][1-8]$/.test(from)&&typeof to==="string"&&/^[a-h][1-8]$/.test(to),"BAD_SQUARE");
   assert(promotion===undefined||["q","r","b","n"].includes(promotion),"BAD_PROMOTION");
   if(g.pgn)assert(chess.load_pgn(g.pgn),"CORRUPT_PGN");
   assert(chess.fen()===g.fen,"STATE_MISMATCH");
   const m=chess.move({from,to,promotion:promotion||"q"});assert(m,"ILLEGAL_MOVE");
   if(g.clock?.baseMs){
     const transitioned=Clock.move(g.clock,color,at);
     assert(transitioned.ok,"CLOCK_EXPIRED");
     g.clock=transitioned.state;
   }
   g.pgn=chess.pgn();g.fen=chess.fen();
   g.moves.push({ply:g.moves.length+1,actorId:actor,san:m.san,from:m.from,to:m.to,promotion:m.promotion||null,serverAt:at,requestId});
   g.revision++;g.drawOffer=null;
   g.seenRequests.set(requestId,{actorId:actor,from,to,promotion:promotion||null});
   if(chess.game_over()){
     const result=chess.in_checkmate()?(color==="w"?"1-0":"0-1"):"1/2-1/2";
     finalize(g,result,chess.in_checkmate()?"checkmate":"chess-draw",at);
   }
   return snapshotObject(g,actor);
 }
 function resign({actorId,gameId,expectedRevision}){
   const actor=identity(actorId),g=member(matches.get(gameId),actor),at=time();
   syncClock(g,at);assert(g.status==="active","GAME_FINISHED");
   assert(validRevision(expectedRevision)&&expectedRevision===g.revision,"STALE_REVISION");
   const loser=colorOf(g,actor),winner=loser==="w"?"b":"w";
   const chess=new Chess();if(g.pgn)assert(chess.load_pgn(g.pgn),"CORRUPT_PGN");
   const draw=Clock.cannotMate(winner,chess.board());
   finalize(g,statusResult(loser,draw),draw?"no-mating-potential":"resignation",at);
   return snapshotObject(g,actor);
 }
 function draw({actorId,gameId,expectedRevision,action}){
   const actor=identity(actorId),g=member(matches.get(gameId),actor),at=time();
   syncClock(g,at);assert(g.status==="active","GAME_FINISHED");
   assert(validRevision(expectedRevision)&&expectedRevision===g.revision,"STALE_REVISION");
   assert(["offer","accept","decline"].includes(action),"BAD_ACTION");
   if(action==="offer"){
     assert(!g.drawOffer,"ALREADY_OFFERED");
     g.drawOffer=actor;g.revision++;
   }else{
     assert(g.drawOffer&&g.drawOffer!==actor,"NO_OPPONENT_OFFER");
     if(action==="accept")finalize(g,"1/2-1/2","agreed-draw",at);
     else{g.drawOffer=null;g.revision++;}
   }
   return snapshotObject(g,actor);
 }
 function rematch({actorId,gameId}){
   const actor=identity(actorId),g=member(matches.get(gameId),actor);
   assert(g.status==="finished","GAME_ACTIVE");
   const originalColor=colorOf(g,actor);
   return invite({actorId:actor,to:opponent(g,actor),creatorColor:originalColor==="w"?"b":"w",
     preset:g.clock.preset,minutes:g.clock.baseMs/60000,increment:g.clock.incrementMs/1000});
 }
 function visible({actorId}){
   const actor=identity(actorId);
   const myGames=[...matches.values()].filter(g=>g.white===actor||g.black===actor);
   const myInvites=[...invites.values()].filter(v=>v.to===actor||v.from===actor);
   myGames.forEach(g=>syncClock(g,time()));
   return {games:myGames.map(g=>snapshotObject(g,actor)),
     invites:myInvites.map(v=>({...v,config:{...v.config}}))};
 }
 return Object.freeze({invite,viewInvite,accept,decline,getGame,play,resign,draw,rematch,visible});
}
module.exports={createService,MatchError};
