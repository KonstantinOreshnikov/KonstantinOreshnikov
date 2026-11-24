"use strict";
/* Live backend gate retest: isolated Neon Function deployment #3 matches QA api_gate SHA-256. */
/* Real Neon Auth+PvP on isolated QA only. Verifications of synthetic QA fixtures are performed by authorized QA admin, not email OTP. */
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const AUTH="https://ep-long-water-b9d3jvwb.neonauth.c-7.eu-central-1.aws.neon.tech/chess_odyssey/auth";
const API="https://br-muddy-truth-b96hxtdg-chesscloud.compute.c-7.eu-central-1.aws.neon.tech";
const ORIGIN="https://konstantinoreshnikov.github.io";
const suffix=crypto.randomBytes(7).toString("hex");
const users=["alice","bob","outsider"].map(name=>({name,email:"chess-qa-"+suffix+"-"+name+"@example.test",password:crypto.randomBytes(22).toString("base64url"),token:null}));
const pause=ms=>new Promise(done=>setTimeout(done,ms));
async function call(base,route,body,token){
 const res=await fetch(base+route,{method:body?"POST":"GET",headers:{"Content-Type":"application/json","Origin":ORIGIN,...(token?{Authorization:"Bearer "+token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(11000)});
 let data;try{data=await res.json()}catch{data={error:"INVALID_JSON"}}
 const cookies=(res.headers.getSetCookie?.()||[]).map(v=>v.split(";")[0]).join("; ");
 return {status:res.status,data,cookies,jwtHeader:res.headers.get("set-auth-jwt")};
}
const jwtShape=value=>typeof value==="string"&&value.split(".").length===3;
async function extractJwt(login){
 const opaque=login.data?.session?.token||login.data?.token;
 for(const item of [login.jwtHeader,opaque])if(jwtShape(item))return item;
 const cookie=login.cookies;
 const outcomes=[];
 for(const endpoint of ["/token","/get-session"]){
  const result=await fetch(AUTH+endpoint,{headers:{"Origin":ORIGIN,...(cookie?{Cookie:cookie}:{}),...(opaque?{Authorization:"Bearer "+opaque}:{})},signal:AbortSignal.timeout(11000)});
  let data;try{data=await result.json()}catch{data={}}
  outcomes.push(endpoint+":"+result.status);
  const token=data?.token||result.headers.get("set-auth-jwt");
  if(jwtShape(token))return token;
 }
 throw Error("JWT_EXCHANGE_UNAVAILABLE_"+outcomes.join("_"));
}
(async()=>{
 for(const u of users){
  const r=await call(AUTH,"/sign-up/email",{name:"Chess QA "+u.name,email:u.email,password:u.password});
  console.log("QA_SIGNUP "+u.name+" status="+r.status+" code="+String(r.data?.code||r.data?.error?.code||r.data?.error||"none").slice(0,60));
  if(r.status>=400)throw Error("SIGNUP_BLOCKED_"+u.name+"_"+r.status);
 }
 console.log("QA_ACCOUNTS_CREATED prefix=chess-qa-"+suffix+"- count=3 (awaiting verification of synthetic test fixtures; OTP gate not tested)");
 let signed=false;
 for(let attempt=0;attempt<36;attempt++){
  let ok=true;
  for(const u of users){
   if(u.token)continue;
   const r=await call(AUTH,"/sign-in/email",{email:u.email,password:u.password});
   const token=r.data?.token||r.data?.session?.token;
   if(r.status===200&&typeof token==="string"){u.token=await extractJwt(r)}else ok=false;
  }
  if(ok&&users.every(u=>u.token)){signed=true;break}
  await pause(5000);
 }
 if(!signed)throw Error("AUTH_SIGNIN_NOT_READY_AFTER_VERIFICATION");
 console.log("PASS QA AUTH signed in 3 independent identities; OTP method not validated");
 for(const u of users){
  const parts=u.token.split(".");
  const head=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8"));
  const claims=JSON.parse(Buffer.from(parts[1],"base64url").toString("utf8"));
  console.log("QA_JWT_METADATA "+u.name+" alg="+head.alg+" role="+String(claims.role)+" verified="+String(claims.emailVerified)+" audPresent="+Boolean(claims.aud)+" expPresent="+Boolean(claims.exp));
 }
 for(const u of users){
  const m=await call(API,"/api/me",null,u.token);
  if(m.status!==200)throw Error("JWT_"+u.name+"_REJECTED_"+m.status+"_"+String(m.data?.error||""));
  console.log("PASS QA AUTH /api/me "+u.name+" status=200");
 }
 let r=await call(API,"/api/pvp/invite",{color:"w",preset:"none"},users[0].token);
 if(r.status!==200)throw Error("INVITE_FAILED_"+r.status+"_"+String(r.data?.error||""));
 const token=r.data.inviteToken;assert.match(token,/^[a-zA-Z0-9_-]{43}$/);
 console.log("PASS QA PVP invited (token hidden)");
 r=await call(API,"/api/pvp/accept",{inviteToken:token},users[1].token);
 if(r.status!==200)throw Error("ACCEPT_FAILED_"+r.status+"_"+String(r.data?.error||""));
 const gameId=r.data.game_id;assert.ok(gameId);
 console.log("PASS QA PVP accepted by Bob");
 const replayInvite=await call(API,"/api/pvp/accept",{inviteToken:token},users[1].token);
 assert.notEqual(replayInvite.status,200,"single-use invitation must not be accepted twice");
 console.log("PASS QA PVP invitation reuse denied");
 const thirdDashboard=await call(API,"/api/pvp/dashboard",null,users[2].token);
 assert.equal(thirdDashboard.status,200);
 assert.ok(!(thirdDashboard.data?.games||[]).some(g=>g.game_id===gameId));
 console.log("PASS QA PVP outsider cannot list the game");
 const thirdMove=await call(API,"/api/pvp/play",{gameId,expectedVersion:0,requestId:crypto.randomUUID(),from:"e2",to:"e4"},users[2].token);
 assert.notEqual(thirdMove.status,200);
 console.log("PASS QA PVP outsider cannot submit a move");
 const other=await call(API,"/api/pvp/game?id="+encodeURIComponent(gameId),null,users[2].token);
 assert.equal(other.status,404);console.log("PASS QA PVP outsider denied game");
 let game=await call(API,"/api/pvp/game?id="+encodeURIComponent(gameId),null,users[0].token);
 assert.equal(game.status,200);const version=Number(game.data.game.version);
 const wrongTurn=await call(API,"/api/pvp/play",{gameId,expectedVersion:version,requestId:crypto.randomUUID(),from:"e7",to:"e5"},users[1].token);
 assert.equal(wrongTurn.status,409);
 console.log("PASS QA PVP opponent move out of turn denied");
 const aliceRequestId=crypto.randomUUID();
 r=await call(API,"/api/pvp/play",{gameId,expectedVersion:version,requestId:aliceRequestId,from:"e2",to:"e4"},users[0].token);
 if(r.status!==200)throw Error("ALICE_MOVE_FAILED_"+r.status+"_"+String(r.data?.error||""));
 console.log("PASS QA PVP Alice e2-e4");
 const retry=await call(API,"/api/pvp/play",{gameId,expectedVersion:version,requestId:aliceRequestId,from:"e2",to:"e4"},users[0].token);
 console.log("QA_IDEMPOTENT_RETRY status="+retry.status+" code="+String(retry.data?.error||"none"));
 assert.equal(retry.status,200);assert.equal(retry.data.duplicate,true);
 console.log("PASS QA PVP lost-response replay is idempotent");
 const stale=await call(API,"/api/pvp/play",{gameId,expectedVersion:version,requestId:crypto.randomUUID(),from:"d2",to:"d4"},users[0].token);
 assert.equal(stale.status,409);
 console.log("PASS QA PVP stale revision denied");
 game=await call(API,"/api/pvp/game?id="+encodeURIComponent(gameId),null,users[1].token);
 assert.equal(game.status,200);assert.ok(game.data.game.canonical_pgn.includes("e4"));
 r=await call(API,"/api/pvp/play",{gameId,expectedVersion:Number(game.data.game.version),requestId:crypto.randomUUID(),from:"e7",to:"e5"},users[1].token);
 if(r.status!==200)throw Error("BOB_MOVE_FAILED_"+r.status+"_"+String(r.data?.error||""));
 console.log("PASS QA PVP Bob e7-e5; both authenticated players and third-party isolation");
 console.log("PASS QA PVP LIVE: real Neon Auth/JWT + real DB on isolated QA; email OTP not tested");
})().catch(e=>{console.error("FAIL QA AUTH/PVP "+e.message);process.exitCode=1});
