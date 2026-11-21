/* B9 HTTP integration fixture: localhost only, synthetic identities, not Neon Auth. */
"use strict";
const assert=require("node:assert/strict");
process.env.CHESS_ODYSSEY_PVP_DEV="1";
const {createDemoServer}=require("../pvp/dev-server.cjs");
(async()=>{
 const server=createDemoServer();
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const base="http://127.0.0.1:"+server.address().port;
 let count=0;
 const t=async(name,fn)=>{await fn();count++;console.log("PASS B9 HTTP "+count+" "+name);};
 const api=async(user,path,body)=>{
   const r=await fetch(base+path,{method:body?"POST":"GET",
     headers:{"x-demo-user":user,...(body?{"content-type":"application/json"}:{})},
     ...(body?{body:JSON.stringify(body)}:{})});
   return {status:r.status,data:await r.json(),headers:r.headers};
 };
 try{
   await t("dev health discloses unsafe fixture",async()=>{
     const r=await fetch(base+"/health"),d=await r.json();
     assert.equal(r.status,200);assert.equal(d.mode,"UNSAFE_LOCAL_FIXTURE");
   });
   await t("unauthenticated requests denied",async()=>{
     const r=await fetch(base+"/api/dashboard");
     assert.equal(r.status,401);
   });
   let invite,game;
   await t("Alice creates 10-minute invite for Bob",async()=>{
     const r=await api("alice","/api/invite",{to:"bob",preset:"rapid10"});
     assert.equal(r.status,200);invite=r.data;assert.equal(invite.to,"bob");
   });
   await t("Charlie cannot access private invite or match",async()=>{
     const r=await api("charlie","/api/accept",{inviteId:invite.id});
     assert.equal(r.status,404);assert.equal(r.data.error,"NOT_FOUND");
   });
   await t("Bob accepts invitation with independent identity",async()=>{
     const r=await api("bob","/api/accept",{inviteId:invite.id});
     assert.equal(r.status,200);game=r.data;assert.equal(game.playerColor,"b");
   });
   await t("white legal move committed in server state",async()=>{
     const r=await api("alice","/api/play",{gameId:game.id,expectedRevision:0,requestId:"http-alice-1",from:"e2",to:"e4"});
     assert.equal(r.status,200);assert.equal(r.data.lastMove,"e4");assert.equal(r.data.revision,1);
   });
   await t("Bob sees Alice move through independent polling",async()=>{
     const r=await api("bob","/api/game?id="+encodeURIComponent(game.id));
     assert.equal(r.status,200);assert.equal(r.data.lastMove,"e4");
   });
   await t("third user cannot access game",async()=>{
     const r=await api("charlie","/api/game?id="+encodeURIComponent(game.id));
     assert.equal(r.status,404);
   });
   await t("wrong turn cannot play",async()=>{
     const r=await api("alice","/api/play",{gameId:game.id,expectedRevision:1,requestId:"http-alice-2",from:"d2",to:"d4"});
     assert.equal(r.status,409);assert.equal(r.data.error,"NOT_YOUR_TURN");
   });
   await t("stale client revision cannot overwrite",async()=>{
     const r=await api("bob","/api/play",{gameId:game.id,expectedRevision:0,requestId:"http-bob-1",from:"e7",to:"e5"});
     assert.equal(r.status,409);
   });
   await t("only Bob can make next move",async()=>{
     const r=await api("bob","/api/play",{gameId:game.id,expectedRevision:1,requestId:"http-bob-1",from:"e7",to:"e5"});
     assert.equal(r.status,200);assert.match(r.data.pgn,/e4 e5/);
   });
   await t("idempotent replay cannot duplicate recorded moves",async()=>{
     const r=await api("bob","/api/play",{gameId:game.id,expectedRevision:1,requestId:"http-bob-1",from:"e7",to:"e5"});
     assert.equal(r.data.duplicate,true);assert.equal(r.data.ply,2);
   });
   await t("malicious cross-origin request denied",async()=>{
     const r=await fetch(base+"/api/dashboard",{headers:{"x-demo-user":"alice",Origin:"https://evil.example"}});
     assert.equal(r.status,403);
   });
   await t("resigning terminates and persists result",async()=>{
     const r=await api("bob","/api/resign",{gameId:game.id,expectedRevision:2});
     assert.equal(r.status,200);assert.equal(r.data.result,"1-0");
     const a=await api("alice","/api/game?id="+game.id);
     assert.equal(a.data.status,"finished");
   });
   await t("local fixture never leaks database credentials",async()=>{
     const r=await fetch(base+"/demo"),h=await r.text();
     assert.equal(r.status,200);assert.match(h,/Synthetic users/);assert.doesNotMatch(h,/DATABASE_URL|NEON_AUTH_SECRET/);
     assert.equal(r.headers.get("cache-control"),"no-store");
   });
   console.log("PASS B9 HTTP "+count+"/"+count);
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
