"use strict";
const assert=require("node:assert/strict");
const {generateKeyPairSync,sign}=require("node:crypto");
const {pathToFileURL}=require("node:url");
(async()=>{
 const {createCloud}=await import(pathToFileURL(require.resolve("../functions/chesscloud/index.mjs")).href);
 const {publicKey,privateKey}=generateKeyPairSync("ed25519");
 const jwk=publicKey.export({format:"jwk"});jwk.kid="keyA";
 const issuer="https://auth.example.test",now=Date.parse("2026-11-23T09:00:00Z");
 let userRows=[],stored=null,tokenCalls=0; const actions=[];
 const fetchImpl=async (url,options={})=>{
  if(url.endsWith("jwks.json"))return new Response(JSON.stringify({keys:[jwk]}),{status:200});
  assert.ok(options.headers.Authorization.startsWith("Bearer "));
  actions.push({url,method:options.method,headers:options.headers,body:options.body});
  if(url.includes("/rpc/save_progress")){
   const args=JSON.parse(options.body);
   if(args.p_expected_revision!==0)return new Response(JSON.stringify({code:"40001",message:"STALE_PROGRESS_REVISION"}),{status:409});
   stored=args.p_progress_doc;
   return new Response(JSON.stringify({saved:true,data_revision:1}),{status:200});
  }
  return new Response(JSON.stringify(userRows),{status:200});
 };
 const env={NEON_AUTH_BASE_URL:issuer+"/auth",NEON_AUTH_JWKS_URL:issuer+"/auth/.well-known/jwks.json",NEON_DATA_API_URL:"https://data.example.test/db/rest/v1",CHESS_ALLOWED_ORIGINS:"https://konstantinoreshnikov.github.io"};
 const api=createCloud({env,fetchImpl,now:()=>now});
 const claims={iss:issuer,aud:issuer,sub:"alice-a",role:"authenticated",emailVerified:true,iat:now/1000-100,exp:now/1000+900};
 const jwt=(payload=claims,header={alg:"EdDSA",kid:"keyA",typ:"JWT"})=>{
  const payloads=[header,payload].map(x=>Buffer.from(JSON.stringify(x)).toString("base64url"));
  return payloads.join(".")+"."+sign(null,Buffer.from(payloads.join(".")),privateKey).toString("base64url");
 };
 const call=(path,token,method="GET",body)=>api.fetch(new Request("https://function.example.test"+path,{
  method,headers:{origin:"https://konstantinoreshnikov.github.io",...(token?{Authorization:"Bearer "+token}:{}),...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined}));
 let n=0;async function ok(name,fn){await fn();console.log("PASS ChessCloud "+(++n)+" "+name)}
 await ok("health no secrets",async()=>assert.equal((await call("/health")).status,200));
 await ok("anonymous denied",async()=>assert.equal((await call("/api/me")).status,401));
 await ok("signed JWT subject returned",async()=>{let r=await call("/api/me",jwt());assert.equal(r.status,200);assert.equal((await r.json()).user.id,"alice-a")});
 await ok("expired signed JWT rejected",async()=>assert.equal((await call("/api/me",jwt({...claims,exp:now/1000-5}))).status,401));
 await ok("wrong issuer rejected",async()=>assert.equal((await call("/api/me",jwt({...claims,iss:"https://evil.example"}))).status,401));
 await ok("wrong audience rejected",async()=>assert.equal((await call("/api/me",jwt({...claims,aud:"other"}))).status,401));
 await ok("unverified email rejected",async()=>assert.equal((await call("/api/me",jwt({...claims,emailVerified:false}))).status,401));
 await ok("role claim enforced",async()=>assert.equal((await call("/api/me",jwt({...claims,role:"anonymous"}))).status,401));
 await ok("tampered signature rejected",async()=>assert.equal((await call("/api/me",jwt().slice(0,-3)+"abc")).status,401));
 await ok("algorithm none rejected",async()=>assert.equal((await call("/api/me",jwt(claims,{alg:"none",kid:"keyA"}))).status,401));
 await ok("valid JWT reads scoped progress",async()=>{userRows=[{data_revision:2,progress_doc:{schema:1}}];let r=await call("/api/progress",jwt());assert.deepEqual(await r.json(),{revision:2,progressDoc:{schema:1}});assert.ok(actions.at(-1).url.includes("user_id=eq.alice-a"))});
 await ok("empty progress is clean new user",async()=>{userRows=[];let r=await call("/api/progress",jwt());assert.deepEqual(await r.json(),{revision:0,progressDoc:null})});
 await ok("CAS write no user-supplied identity",async()=>{let r=await call("/api/progress",jwt(),"PUT",{expectedRevision:0,progressDoc:{schema:1,matches:[]},userId:"mallory"});assert.equal(r.status,200);assert.equal(stored.schema,1);assert.equal(actions.at(-1).body.includes("mallory"),false)});
 await ok("CAS stale revision maps to conflict",async()=>{let r=await call("/api/progress",jwt(),"PUT",{expectedRevision:7,progressDoc:{}});assert.equal(r.status,409)});
 await ok("origin denied without echo",async()=>{let r=await api.fetch(new Request("https://function.example.test/api/me",{headers:{origin:"https://attacker.example",Authorization:"Bearer "+jwt()}}));assert.equal(r.status,403);assert.equal(r.headers.get("access-control-allow-origin"),null)});
 await ok("spoof header denied",async()=>{let r=await api.fetch(new Request("https://function.example.test/api/me",{headers:{origin:env.CHESS_ALLOWED_ORIGINS,"x-demo-user":"alice",Authorization:"Bearer "+jwt()}}));assert.equal(r.status,400)});
 await ok("empty origin configuration fails closed",async()=>assert.throws(()=>createCloud({env:{...env,CHESS_ALLOWED_ORIGINS:""},fetchImpl})));
 await ok("preflight allowed only configured site",async()=>{let r=await api.fetch(new Request("https://function.example.test/api/progress",{method:"OPTIONS",headers:{origin:env.CHESS_ALLOWED_ORIGINS}}));assert.equal(r.status,204);assert.equal(r.headers.get("access-control-allow-origin"),env.CHESS_ALLOWED_ORIGINS)});
 await ok("unknown resource unavailable",async()=>assert.equal((await call("/api/pvp",jwt())).status,404));
 await ok("browser cloud fetch obtains JWT not opaque session ID",async()=>{
  const fs=require("node:fs"),path=require("node:path");
  const source=fs.readFileSync(path.resolve(__dirname,"../cloud/cloud-client.js"),"utf8");
  assert.match(source,/neon\\.auth\\.getJWTToken\\(\\)/);
  assert.doesNotMatch(source,/data\\.session\\.token/);
  assert.match(source,/SESSION_EXPIRED/);
 });
 console.log("PASS ChessCloud "+n+"/"+n);
})().catch(e=>{console.error(e);process.exitCode=1;});
