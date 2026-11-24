"use strict";
/* One-user JWT diagnostic of QA Neon Data API SQL auth.user_id, never emits credentials. */
const crypto=require("node:crypto");
const AUTH="https://ep-long-water-b9d3jvwb.neonauth.c-7.eu-central-1.aws.neon.tech/chess_odyssey/auth";
const DATA="https://ep-long-water-b9d3jvwb.apirest.c-7.eu-central-1.aws.neon.tech/chess_odyssey/rest/v1";
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
 const probeResponse=await fetch(DATA+"/rpc/qa_actor_present",{method:"POST",headers:{"Origin":ORIGIN,"Authorization":"Bearer "+jwt,"Content-Type":"application/json","Content-Profile":"chess_odyssey","Accept-Profile":"chess_odyssey"},body:"{}",signal:AbortSignal.timeout(11000)});
 let outcome;try{outcome=await probeResponse.json()}catch{outcome=null}
 console.log("QA_SQL_ACTOR status="+probeResponse.status+" actorPresent="+String(outcome===true)+" errorCode="+(outcome?.code||"none"));
 if(probeResponse.status!==200||outcome!==true)throw Error("DATA_API_ACTOR_MISSING_OR_DENIED");
 console.log("PASS real Neon Auth JWT actor visible in PostgREST QA");
 const badSecretProbe=await fetch(DATA+"/rpc/create_invite",{method:"POST",
  headers:{"Origin":ORIGIN,"Authorization":"Bearer "+jwt,"Content-Type":"application/json","Content-Profile":"chess_odyssey","Accept-Profile":"chess_odyssey"},
  body:JSON.stringify({p_secret:"invalid-test-key",p_invite_token:"a".repeat(43),p_creator_color:"w",p_preset:"none",p_base_ms:0,p_increment_ms:0,p_invited_user_id:null}),
  signal:AbortSignal.timeout(11000)});
 const diag=await badSecretProbe.json().catch(()=>({}));
 console.log("QA_ACTOR_IN_CREATE_INVITE status="+badSecretProbe.status+" code="+String(diag.code||"none")+" message="+String(diag.message||"").slice(0,55));
 if(diag.code==="28001")console.log("PASS real JWT actor visible inside create_invite; invalid service key rejected");
 else throw Error("CREATE_INVITE_ACTOR_NOT_VISIBLE_OR_WRONG_CODE_"+String(diag.code||badSecretProbe.status));
})().catch(e=>{console.error("FAIL QA SQL ACTOR "+e.message);process.exitCode=1});
