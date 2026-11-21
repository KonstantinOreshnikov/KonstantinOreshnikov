/* B9 isolated trusted-server model tests. These do NOT assert Neon/Auth E2E. */
"use strict";
const assert=require("node:assert/strict");
const {createService,MatchError}=require("../pvp/match-service.cjs");
let now=1000,id=0,passed=0;
const svc=createService({now:()=>now,makeId:()=>("test-id-"+(++id))});
const test=(name,fn)=>{fn();passed++;console.log("PASS B9 domain "+passed+" "+name);};
const fail=(code,fn)=>assert.throws(fn,e=>e instanceof MatchError&&e.code===code);
let invite,m1;
test("cannot invite self",()=>fail("SELF_INVITE",()=>svc.invite({actorId:"alice",to:"alice"})));
test("reject anonymous caller",()=>fail("UNAUTHENTICATED",()=>svc.invite({actorId:"",to:"bob"})));
test("invite validates configured time and target",()=>{
 invite=svc.invite({actorId:"alice",to:"bob",preset:"rapid1510",creatorColor:"w"});
 assert.equal(invite.from,"alice");assert.equal(invite.to,"bob");assert.equal(invite.config.incrementMs,10000);
});
test("outsider cannot fetch private invite",()=>fail("NOT_FOUND",()=>svc.viewInvite(invite.id,"mallory")));
test("outsider cannot accept invite",()=>fail("NOT_FOUND",()=>svc.accept({actorId:"mallory",inviteId:invite.id})));
test("correct recipient accepts, game is server owned",()=>{
 m1=svc.accept({actorId:"bob",inviteId:invite.id});
 assert.equal(m1.white,"alice");assert.equal(m1.black,"bob");assert.equal(m1.playerColor,"b");
 assert.equal(m1.status,"active");assert.equal(m1.revision,0);assert.equal(m1.clock.remaining.w,900000);
});
test("same invite can be accepted only once",()=>fail("INVITE_USED",()=>svc.accept({actorId:"bob",inviteId:invite.id})));
test("outsider cannot see match state",()=>fail("NOT_FOUND",()=>svc.getGame(m1.id,"mallory")));
test("not your turn is rejected",()=>fail("NOT_YOUR_TURN",()=>svc.play({actorId:"bob",gameId:m1.id,expectedRevision:0,requestId:"wrongturn",from:"e7",to:"e5"})));
test("illegal square notation rejected",()=>fail("BAD_SQUARE",()=>svc.play({actorId:"alice",gameId:m1.id,expectedRevision:0,requestId:"wrongSquare",from:"z9",to:"e4"})));
test("illegal move rejected without changing revision",()=>{
 fail("ILLEGAL_MOVE",()=>svc.play({actorId:"alice",gameId:m1.id,expectedRevision:0,requestId:"illegal",from:"e2",to:"e5"}));
 assert.equal(svc.getGame(m1.id,"alice").revision,0);
});
test("first move charges server time and adds increment",()=>{
 now=11000;
 const g=svc.play({actorId:"alice",gameId:m1.id,expectedRevision:0,requestId:"alice-1",from:"e2",to:"e4",clientNow:0,clientWinner:"alice"});
 assert.equal(g.ply,1);assert.equal(g.revision,1);assert.equal(g.lastMove,"e4");
 assert.equal(g.clock.remaining.w,900000);assert.equal(g.clock.active,"b");
 assert.match(g.pgn,/e4/);
});
test("same request is idempotent",()=>{
 const g=svc.play({actorId:"alice",gameId:m1.id,expectedRevision:0,requestId:"alice-1",from:"e2",to:"e4"});
 assert.equal(g.duplicate,true);assert.equal(g.revision,1);assert.equal(g.ply,1);
});
test("same id with different payload is rejected",()=>fail("REQUEST_ID_REUSED",()=>svc.play({actorId:"alice",gameId:m1.id,expectedRevision:1,requestId:"alice-1",from:"d2",to:"d4"})));
test("stale revision cannot race in",()=>fail("STALE_REVISION",()=>svc.play({actorId:"bob",gameId:m1.id,expectedRevision:0,requestId:"bob-1",from:"e7",to:"e5"})));
test("different actor cannot replay another's id",()=>fail("REQUEST_ID_REUSED",()=>svc.play({actorId:"bob",gameId:m1.id,expectedRevision:1,requestId:"alice-1",from:"e2",to:"e4"})));
test("second player move uses new revision",()=>{
 now=16000;
 const g=svc.play({actorId:"bob",gameId:m1.id,expectedRevision:1,requestId:"bob-1",from:"e7",to:"e5"});
 assert.equal(g.revision,2);assert.equal(g.clock.remaining.b,905000);assert.match(g.pgn,/e5/);
});
test("white cannot jump ahead on alternate turn stale version",()=>fail("STALE_REVISION",()=>svc.play({actorId:"alice",gameId:m1.id,expectedRevision:1,requestId:"alice-2",from:"g1",to:"f3"})));
test("offer draw and accepting own offer prohibited",()=>{
 const g=svc.draw({actorId:"alice",gameId:m1.id,expectedRevision:2,action:"offer"});
 assert.equal(g.drawOffer,"alice");assert.equal(g.revision,3);
 fail("NO_OPPONENT_OFFER",()=>svc.draw({actorId:"alice",gameId:m1.id,expectedRevision:3,action:"accept"}));
});
test("opponent accepts draw and no more moves accepted",()=>{
 const g=svc.draw({actorId:"bob",gameId:m1.id,expectedRevision:3,action:"accept"});
 assert.equal(g.status,"finished");assert.equal(g.result,"1/2-1/2");assert.equal(g.reason,"agreed-draw");
 fail("GAME_FINISHED",()=>svc.play({actorId:"alice",gameId:m1.id,expectedRevision:4,requestId:"stale",from:"g1",to:"f3"}));
});
test("finished game rematch creates private invitation, reversed colors",()=>{
 const r=svc.rematch({actorId:"alice",gameId:m1.id});
 assert.equal(r.from,"alice");assert.equal(r.to,"bob");assert.equal(r.creatorColor,"b");
 const g=svc.accept({actorId:"bob",inviteId:r.id});assert.equal(g.white,"bob");assert.equal(g.black,"alice");
});
test("resignation decides winner once",()=>{
 const v=svc.visible({actorId:"bob"}).games.find(g=>g.white==="bob");
 const g=svc.resign({actorId:"alice",gameId:v.id,expectedRevision:v.revision});
 assert.equal(g.result,"1-0");assert.equal(g.reason,"resignation");
 fail("GAME_FINISHED",()=>svc.resign({actorId:"alice",gameId:v.id,expectedRevision:g.revision}));
});
test("declined invite never accepted",()=>{
 const i=svc.invite({actorId:"alice",to:"bob"});
 assert.equal(svc.decline({actorId:"bob",inviteId:i.id}).status,"declined");
 fail("INVITE_USED",()=>svc.accept({actorId:"bob",inviteId:i.id}));
});
test("expired invite never accepted",()=>{
 const i=svc.invite({actorId:"alice",to:"bob"});
 now+=86400000;
 fail("INVITE_EXPIRED",()=>svc.accept({actorId:"bob",inviteId:i.id}));
});
test("flag fall is server-authoritative",()=>{
 const i=svc.invite({actorId:"alice",to:"bob",preset:"bullet1"});
 const g=svc.accept({actorId:"bob",inviteId:i.id});
 now+=60001;
 const finished=svc.getGame(g.id,"alice");
 assert.equal(finished.status,"finished");assert.equal(finished.reason,"flag-fall");
 assert.equal(finished.result,"0-1");
 fail("GAME_FINISHED",()=>svc.play({actorId:"alice",gameId:g.id,expectedRevision:0,requestId:"late",from:"e2",to:"e4"}));
});
test("client state edits cannot modify server record",()=>{
 const v=svc.visible({actorId:"alice"}),g=v.games[0],orig=svc.getGame(g.id,"alice").pgn;
 v.games[0].pgn="1. Qh5#";v.games[0].clock.remaining.w=999999999;
 assert.equal(svc.getGame(g.id,"alice").pgn,orig);
});
test("private match list is scoped to its actual participants",()=>{
 assert.equal(svc.visible({actorId:"mallory"}).games.length,0);
 assert.ok(svc.visible({actorId:"alice"}).games.length>=2);
});
console.log("PASS B9 domain "+passed+"/"+passed);
