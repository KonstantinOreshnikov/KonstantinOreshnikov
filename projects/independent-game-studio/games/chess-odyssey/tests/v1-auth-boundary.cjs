"use strict";
const assert=require("node:assert/strict");
const {createGateway}=require("../pvp/cloud/auth-gateway.cjs");
const allowed="https://konstantinoreshnikov.github.io",token="aaaa.bbbb.cccc";
let n=0;
async function ok(label,fn){await fn();console.log("PASS V1 Auth boundary "+(++n)+" "+label);}
const gate=createGateway({allowedOrigins:[allowed],verifyToken:async x=>{if(x===token)return {sub:"auth-user-01",emailVerified:true};throw Error("bad signature")}});
const get=(path,headers={},method="GET")=>gate.fetch(new Request("https://neon.example"+path,{method,headers}));
(async()=>{
 await ok("health contains no secrets",async()=>{const r=await get("/health");assert.equal(r.status,200);const s=JSON.stringify(await r.json());assert.ok(!s.includes("DATABASE_URL")&&!s.includes("jwt"));});
 await ok("anonymous profile is forbidden",async()=>assert.equal((await get("/api/me",{origin:allowed})).status,401));
 await ok("invalid JWT is forbidden",async()=>assert.equal((await get("/api/me",{origin:allowed,authorization:"Bearer wrong.sig.token"})).status,401));
 await ok("mocked valid verification claims resolve only their subject",async()=>{const r=await get("/api/me",{origin:allowed,authorization:"Bearer "+token});assert.equal(r.status,200);assert.deepEqual(await r.json(),{authenticated:true,user:{id:"auth-user-01"}});});
 await ok("untrusted Origin rejected without mirroring",async()=>{const r=await get("/api/me",{origin:"https://attacker.example",authorization:"Bearer "+token});assert.equal(r.status,403);assert.equal(r.headers.get("access-control-allow-origin"),null);});
 await ok("X-Demo-User identity spoofing rejected",async()=>assert.equal((await get("/api/me",{origin:allowed,authorization:"Bearer "+token,"x-demo-user":"alice"})).status,400));
 await ok("CORS preflight only for explicit approved origin",async()=>{const r=await get("/api/me",{origin:allowed},"OPTIONS");assert.equal(r.status,204);assert.equal(r.headers.get("access-control-allow-origin"),allowed);});
 await ok("no unauthenticated browser preflight from unknown origin",async()=>assert.equal((await get("/api/me",{origin:"https://evil.test"},"OPTIONS")).status,403));
 await ok("no API writes enabled before DB authorization",async()=>{assert.equal((await get("/api/progress",{origin:allowed,authorization:"Bearer "+token})).status,404);assert.equal((await get("/api/me",{origin:allowed,authorization:"Bearer "+token},"POST")).status,405);});
 await ok("email unverified cannot get identity",async()=>{const g=createGateway({allowedOrigins:[allowed],verifyToken:async()=>({sub:"unverified",emailVerified:false})});const r=await g.fetch(new Request("https://neon.example/api/me",{headers:{origin:allowed,authorization:"Bearer "+token}}));assert.equal(r.status,401);});
 await ok("unsafe wildcard origin configuration rejected",async()=>{assert.throws(()=>createGateway({allowedOrigins:["*"],verifyToken:async()=>({})}));assert.throws(()=>createGateway({allowedOrigins:["http://insecure.example"],verifyToken:async()=>({})}));});
 console.log("PASS V1 Auth boundary "+n+"/"+n);
})().catch(e=>{console.error(e);process.exitCode=1;});
