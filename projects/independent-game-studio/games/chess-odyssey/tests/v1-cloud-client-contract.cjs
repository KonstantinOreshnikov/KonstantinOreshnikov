"use strict";
/* Contract tests for Neon JWT retrieval and cloud revision safety. No real users or DB writes. */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const source=fs.readFileSync(path.resolve(__dirname,"../cloud/cloud-client.js"),"utf8");
function extract(name){
 const pattern=new RegExp("async function "+name+"\\(\\)\\{[\\s\\S]*?\\n\\}");
 const match=source.match(pattern);
 assert.ok(match,"Cannot find "+name+"() in browser cloud client");
 return match[0];
}
const tokenSource=extract("token");
const revisionSource=extract("refreshRevision");
const makeToken=(auth)=>new Function("neon",tokenSource+";return token;")({auth});
const makeRevision=(api)=>new Function("api","let revision=-1;"+revisionSource+";return {refreshRevision,getRevision:()=>revision};")(api);
const jwt="eyJhbGciOiJFZERTQSJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.c2lnbmF0dXJl";
(async()=>{
 let count=0;
 const ok=async(label,fn)=>{await fn();console.log("PASS Auth Client "+(++count)+" "+label)};
 await ok("uses documented getSession token, no undocumented getJWTToken dependency",async()=>{
  let calls=0;
  const token=makeToken({getSession:async()=>{calls++;return {data:{session:{token:jwt}},error:null}}});
  assert.equal(await token(),jwt);
  assert.equal(calls,1);
  assert.ok(!tokenSource.includes("getJWTToken"));
 });
 await ok("denies missing session",async()=>{
  const token=makeToken({getSession:async()=>({data:{session:null},error:null})});
  await assert.rejects(token(),/SESSION_EXPIRED/);
 });
 await ok("denies failed auth session",async()=>{
  const token=makeToken({getSession:async()=>({data:null,error:{message:"expired"}})});
  await assert.rejects(token(),/SESSION_EXPIRED/);
 });
 await ok("denies opaque session token",async()=>{
  const token=makeToken({getSession:async()=>({data:{session:{token:"opaque-session-id"}},error:null})});
  await assert.rejects(token(),/SESSION_EXPIRED/);
 });
 await ok("denies malformed JWT segments",async()=>{
  const token=makeToken({getSession:async()=>({data:{session:{token:"a.b.!@#$"}},error:null})});
  await assert.rejects(token(),/SESSION_EXPIRED/);
 });
 await ok("loads actual revision for existing signed-in profile",async()=>{
  let pathUsed=null;
  const ctx=makeRevision(async p=>{pathUsed=p;return {revision:7,progressDoc:{schema:1}}});
  await ctx.refreshRevision();
  assert.equal(pathUsed,"/api/progress");
  assert.equal(ctx.getRevision(),7);
 });
 await ok("new profile starts at revision zero",async()=>{
  const ctx=makeRevision(async()=>({revision:0,progressDoc:null}));
  await ctx.refreshRevision();
  assert.equal(ctx.getRevision(),0);
 });
 await ok("rejects invalid cloud revision instead of submitting stale CAS",async()=>{
  for(const revision of [-1,1.5,"2",null,Number.MAX_SAFE_INTEGER+1]){
   const ctx=makeRevision(async()=>({revision}));
   await assert.rejects(ctx.refreshRevision(),/INVALID_CLOUD_REVISION/);
   assert.equal(ctx.getRevision(),-1);
  }
 });
 await ok("login waits for remote revision before claiming success",async()=>{
  assert.ok(source.includes('await updateSession();await activateAccount();show(t("logged"))'));
  assert.ok(source.includes('if(await updateSession())await activateAccount()'));
  assert.ok(source.includes('applyAccountDocument(remote.progressDoc||null)'));
  assert.ok(source.includes('if(!accountReady||!session?.user?.id||localStorage.getItem(OWNER_KEY)!==session.user.id)return null'));
  assert.ok(source.includes('if(doc.ownerId!==requireOwner())throw Error("CLOUD_OWNER_MISMATCH")'));
  assert.ok(source.includes('window.addEventListener("chess-progress-commit",queueAutoSave)'));
  assert.ok(!source.includes('practice.completed=clean;localStorage.setItem(PRACTICE,JSON.stringify(practice))'));
 });
 console.log("PASS Auth Client "+count+"/"+count);
})().catch(error=>{console.error(error);process.exitCode=1;});
