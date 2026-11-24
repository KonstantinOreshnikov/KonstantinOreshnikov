"use strict";
/* Live unauthenticated Neon QA Function security checks, no credentials and no writes. */
const assert=require("node:assert/strict");
const ROOT="https://br-muddy-truth-b96hxtdg-chesscloud.compute.c-7.eu-central-1.aws.neon.tech";
const GOOD="https://konstantinoreshnikov.github.io";
const BAD="https://untrusted.qa.example";
(async()=>{
let count=0;const check=async(name,path,options,expected)=>{
 const r=await fetch(ROOT+path,{...options,signal:AbortSignal.timeout(10000)});
 assert.equal(r.status,expected,name+": expected "+expected+", observed "+r.status);
 assert.match(r.headers.get("content-type")||"",/application\\/json/);count++;
 console.log("PASS QA LIVE HTTP "+count+" "+name+" => "+r.status);
};
const health=await fetch(ROOT+"/health",{signal:AbortSignal.timeout(10000)});
assert.equal(health.status,200);const state=await health.json();
assert.equal(state.auth,"mandatory");count++;
console.log("PASS QA LIVE HTTP "+count+" health mandatory => 200");
await check("no JWT me","/api/me",{},401);
await check("no JWT progress","/api/progress",{},401);
await check("no JWT PvP dashboard","/api/pvp/dashboard",{},401);
await check("bad Bearer denied","/api/pvp/dashboard",{headers:{Authorization:"Bearer invalid.invalid.invalid"}},401);
await check("invalid Origin denied","/api/pvp/dashboard",{headers:{Origin:BAD}},403);
const preflight=await fetch(ROOT+"/api/pvp/invite",{method:"OPTIONS",headers:{Origin:GOOD,"Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"authorization,content-type"},signal:AbortSignal.timeout(10000)});
assert.equal(preflight.status,204);
assert.equal(preflight.headers.get("access-control-allow-origin"),GOOD);count++;
console.log("PASS QA LIVE HTTP "+count+" valid origin preflight => 204");
await check("blocked demo identity","/api/pvp/dashboard",{headers:{"x-demo-user":"alice"}},400);
console.log("PASS QA LIVE HTTP "+count+"/"+count+" — no real OTP/JWT actor tested");
})().catch(e=>{console.error("FAIL QA LIVE HTTP",e);process.exitCode=1});
