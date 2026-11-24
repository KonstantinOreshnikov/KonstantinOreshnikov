"use strict";
/* One-user JWT diagnostic of QA Neon Data API SQL auth.user_id, never emits credentials. */
const crypto=require("node:crypto");
const AUTH="https://ep-long-water-b9d3jvwb.neonauth.c-7.eu-central-1.aws.neon.tech/chess_odyssey/auth";
const API="https://br-muddy-truth-b96hxtdg-chesscloud.compute.c-7.eu-central-1.aws.neon.tech";
const ORIGIN="https://konstantinoreshnikov.github.io";
const email="chess-actor-probe-"+crypto.randomBytes(7).toString("hex")+"@example.test";
const password=crypto.randomBytes(22).toString("base64url");
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function request(path,body){
 const res=await fetch(AUTH+path,{method:"POST",headers:{"Origin":ORIGIN,"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(11000)});
 const json=await res.json().catch(()=>({}));
 return {status:res.status,json,cookies:(res.headers.getSetCookie?.()||[]).map(x=>x.split(";")[0]).join("; "),jwt:res.headers.get("set-auth-jwt")};
}
(async()=>{
 let x=await request("/sign-up/email",{name:"Chess QA Actor Probe",email,password});
 console.log("QA_PROBE_SIGNUP status="+x.status);
 if(x.status!==200)throw Error("PROBE_SIGNUP_"+x.status);
 console.log("QA_PROBE_ACCOUNT_CREATED emailPrefix=chess-actor-probe- (awaiting isolated fixture verification)");
 let s;
 for(let k=0;k<24;k++){
  s=await request("/sign-in/email",{email,password});
  if(s.status===200)break;
  await pause(5000);
 }
 if(s.status!==200)throw Error("PROBE_SIGNIN_"+s.status);
 const opaque=s.json?.token||s.json?.session?.token;
 let jwt=s.jwt;
 if(!jwt||jwt.split(".").length!==3){
  const response=await fetch(AUTH+"/token",{headers:{"Origin":ORIGIN,"Cookie":s.cookies,"Authorization":"Bearer "+opaque},signal:AbortSignal.timeout(11000)});
  const body=await response.json().catch(()=>({}));jwt=body?.token||response.headers.get("set-auth-jwt");
  if(response.status!==200||!jwt)throw Error("PROBE_JWT_EXCHANGE_"+response.status);
 }
 if(jwt.split(".").length!==3)throw Error("PROBE_JWT_BAD_SHAPE");
 console.log("QA_PROBE_JWT real JWT minted, token not logged");
 const me=await fetch(API+"/api/me",{headers:{"Origin":ORIGIN,"Authorization":"Bearer "+jwt},signal:AbortSignal.timeout(11000)});
 if(me.status!==200)throw Error("TOKEN_NOT_VALID_AT_FUNCTION_"+me.status);
 console.log("PASS QA AUTH /api/me valid JWT");
 const response=await fetch(API+"/api/pvp/invite",{method:"POST",headers:{"Origin":ORIGIN,"Authorization":"Bearer "+jwt,"Content-Type":"application/json"},body:JSON.stringify({color:"w",preset:"none"}),signal:AbortSignal.timeout(11000)});
 const data=await response.json().catch(()=>({}));
 console.log("QA_PVP_GATE_PROBE status="+response.status+" code="+String(data.error||"none"));
 if(response.status===200){console.log("PASS QA authenticated invite RPC and secret gate");return}
 if(response.status===403)throw Error("ACTOR_REQUIRED_OR_OTHER_28000");
 if(response.status===502)throw Error("SERVICE_KEY_MISMATCH_OR_OTHER_DB_ERROR");
 throw Error("UNEXPECTED_GATE_RESPONSE_"+response.status);
})().catch(e=>{console.error("FAIL QA SQL ACTOR "+e.message);process.exitCode=1});
