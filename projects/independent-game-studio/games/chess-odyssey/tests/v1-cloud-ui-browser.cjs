"use strict";
/* Synthetic-only account isolation and autosync UX; no real identities/Neon writes. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),{chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
const ORIGIN="https://konstantinoreshnikov.github.io",PREFIX="/KonstantinOreshnikov/chess-odyssey/";
const fakeSdk=String.raw`export function createClient(){
 const a=window.__chessMockAuth;
 const identify=email=>email.startsWith("beta")?"synthetic-b":"synthetic-a";
 return {auth:{
  getSession:async()=>({data:a.session?{session:{token:a.id==="synthetic-b"?"ddd.eee.fff":"aaa.bbb.ccc"},user:{id:a.id,email:a.email}}:{session:null,user:null},error:null}),
  signUp:{email:async({email})=>{a.email=email;a.verified=false;return {data:{user:{email}},error:null}}},
  signIn:{email:async({email})=>{if(!a.verified)return {error:{message:"EMAIL_NOT_VERIFIED"}};a.email=email;a.id=identify(email);a.session=true;return {data:{user:{email}},error:null}}},
  emailOtp:{verifyEmail:async({otp})=>{if(otp!=="654321")return {error:{message:"INVALID_OTP"}};a.verified=true;return {data:{},error:null}},sendVerificationOtp:async()=>({data:{},error:null})},
  signOut:async()=>{a.session=false;return {data:{},error:null}}
 }};
}`;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1280,height:840}}),page=await context.newPage();
 const remote=new Map(),writes=[],blocked=[],pageErrors=[];let count=0;
 const check=async(name,fn)=>{await fn();console.log("PASS Chess Cloud UI "+(++count)+" "+name);};
 page.on("pageerror",e=>pageErrors.push(e.message));
 await page.addInitScript(()=>{window.__chessMockAuth={email:"",id:null,verified:false,session:false}});
 await context.route("**/*",async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.origin===ORIGIN){
   let relative=u.pathname.startsWith(PREFIX)?u.pathname.slice(PREFIX.length):null;
   if(relative===null){blocked.push("bad-static-path "+u.pathname);return route.abort()}
   if(!relative)relative="index.html";
   const f=path.resolve(ROOT,relative);
   if(!f.startsWith(ROOT+path.sep)){blocked.push("bad-path "+relative);return route.abort()}
   try{
    const body=await fs.promises.readFile(f);
    const contentType=f.endsWith(".js")?"text/javascript":f.endsWith(".css")?"text/css":f.endsWith(".wasm")?"application/wasm":f.endsWith(".svg")?"image/svg+xml":f.endsWith(".json")?"application/json":"text/html; charset=utf-8";
    return route.fulfill({status:200,body,contentType});
   }catch{blocked.push("missing "+relative);return route.fulfill({status:404,body:"Missing"})}
  }
  if(u.hostname==="esm.sh")return route.fulfill({status:200,contentType:"text/javascript",headers:{"Access-Control-Allow-Origin":"*"},body:fakeSdk});
  if(u.hostname.endsWith(".neon.tech")&&u.pathname.startsWith("/api/")){
   const headers={"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Headers":"authorization,content-type","Access-Control-Allow-Methods":"GET,PUT,OPTIONS","Content-Type":"application/json"};
   if(req.method()==="OPTIONS")return route.fulfill({status:204,headers});
   const actor=req.headers().authorization==="Bearer aaa.bbb.ccc"?"synthetic-a":req.headers().authorization==="Bearer ddd.eee.fff"?"synthetic-b":null;
   if(!actor)return route.fulfill({status:401,headers,body:'{"error":"UNAUTHORIZED"}'});
   if(u.pathname==="/api/progress"){
    const current=remote.get(actor)||{revision:0,progressDoc:null};
    if(req.method()==="GET")return route.fulfill({status:200,headers,body:JSON.stringify(current)});
    if(req.method()==="PUT"){
     const payload=req.postDataJSON();writes.push({actor,payload});
     if(payload.expectedRevision!==current.revision)return route.fulfill({status:409,headers,body:'{"error":"STALE_PROGRESS_REVISION"}'});
     if(payload.progressDoc?.ownerId!==actor)return route.fulfill({status:403,headers,body:'{"error":"FORBIDDEN"}'});
     const next={revision:current.revision+1,progressDoc:payload.progressDoc};remote.set(actor,next);
     return route.fulfill({status:200,headers,body:JSON.stringify({revision:next.revision,saved:true})});
    }
   }
   blocked.push("unexpected-api "+req.method()+" "+u.pathname);return route.fulfill({status:404,headers,body:'{"error":"NOT_FOUND"}'});
  }
  blocked.push("uncontrolled-request "+u.host+u.pathname);return route.abort();
 });
 const waitStatus=s=>page.waitForFunction(value=>document.querySelector("#cloud-status")?.textContent?.includes(value),s,{timeout:20000});
 const enter=async email=>{await page.locator("#cloud-email").fill(email);await page.locator("#cloud-password").fill("SyntheticPass-123");};
 const signup=async email=>{
  await enter(email);await page.locator("#cloud-signup").click();await waitStatus("Проверьте почту");
  await page.locator("#cloud-otp").fill("654321");await page.locator("#cloud-verify").click();await waitStatus("Email подтверждён");
  await page.locator("#cloud-login").click();await waitStatus("Аккаунт загружен");
 };
 try{
  await page.goto(ORIGIN+PREFIX,{waitUntil:"domcontentloaded"});
  await page.locator("#nav-progress").click();
  await page.waitForFunction(()=>window.ChessCloud&&document.querySelector("#cloud-auth-form")?.hidden===false);
  await check("anonymous cannot save or load another account",async()=>{
   assert.equal(await page.locator("#cloud-upload").isDisabled(),true);
   assert.equal(await page.locator("#cloud-download").isDisabled(),true);
   assert.equal(remote.size,0);
  });
  // Pre-v1 anonymous device test data is intentionally discarded on first authenticated sign-in.
  await page.evaluate(()=>{
   const ids=window.ChessAcademy.lessons.slice(0,23).map(x=>x.id);
   localStorage.setItem("chess-odyssey-v01",JSON.stringify({completed:ids,stats:{wins:17,losses:1,draws:0}}));
   localStorage.setItem("chess-odyssey-progress-v1",JSON.stringify({schema:1,masters:{},matches:[{id:"old-test"}]}));
  });
  await signup("alpha@example.test");
  await check("new verified account ignores 23 local test lessons and opens at zero",async()=>{
   assert.equal(await page.locator("#completed").innerText(),"0/33");
   assert.equal(await page.evaluate(()=>ChessProgress.snapshot().summary.academy.done),0);
   assert.equal(await page.evaluate(()=>ChessOdysseyAccount.summary().stats.wins),0);
   assert.equal(writes.length,0,"sign-in must not automatically upload old test data");
  });
  await check("new account 0 revision stays empty without an earned lesson",async()=>{
   assert.equal(remote.size,0);
   assert.equal(await page.evaluate(()=>localStorage.getItem("chess-odyssey-cloud-owner-v1")),"synthetic-a");
  });
  await check("one new earned Academy lesson automatically saves only 1/33",async()=>{
   await page.locator("#nav-play").click();
   await page.selectOption("#lesson","pawn");
   await page.locator('#board button[aria-label^="e2 "]').click();
   await page.locator('#board button[aria-label^="e4 "]').click();
   await waitStatus("ревизия 1");
   assert.equal(await page.locator("#completed").innerText(),"1/33");
   assert.equal(writes.length,1);
   assert.equal(writes[0].payload.expectedRevision,0);
   assert.equal(writes[0].payload.progressDoc.ownerId,"synthetic-a");
   assert.deepEqual(writes[0].payload.progressDoc.practiceCompleted,["pawn"]);
   assert.equal(remote.get("synthetic-a").revision,1);
   assert.equal(await page.evaluate(()=>localStorage.getItem("chess-odyssey-pending-v1:synthetic-a")),null);
  });
  await check("sign-out clears cached displayed account progress, not server row",async()=>{
   await page.locator("#nav-progress").click();await page.locator("#cloud-logout").click();await waitStatus("Выход выполнен");
   assert.equal(await page.locator("#completed").innerText(),"0/33");
   assert.equal(await page.evaluate(()=>localStorage.getItem("chess-odyssey-cloud-owner-v1")),null);
   assert.equal(remote.get("synthetic-a").revision,1);
  });
  await check("sign-in restores exact account result without local migration",async()=>{
   await enter("alpha@example.test");
   await page.locator("#cloud-login").click();await waitStatus("Аккаунт загружен");
   assert.equal(await page.locator("#completed").innerText(),"1/33");
   assert.equal(writes.length,1);
  });
  await check("another verified account starts at 0/33, cannot inherit alpha progress",async()=>{
   await page.locator("#cloud-logout").click();await waitStatus("Выход выполнен");
   await signup("beta@example.test");
   assert.equal(await page.locator("#completed").innerText(),"0/33");
   assert.equal(await page.evaluate(()=>ChessOdysseyAccount.summary().stats.wins),0);
   assert.equal(remote.get("synthetic-b"),undefined);
   assert.equal(remote.get("synthetic-a").revision,1);
  });
  await check("RU EN AZ localized account UI",async()=>{
   for(const [lang,title] of [["ru","Аккаунт и облачный прогресс"],["en","Account & cloud progress"],["az","Hesab və bulud inkişafı"]]){
    await page.locator("#global-language").selectOption(lang);
    await page.waitForFunction(t=>document.querySelector("#cloud-heading")?.textContent===t,title);
   }
   await page.locator("#global-language").selectOption("ru");
  });
  await check("all external actions were mocked; no browser runtime errors",async()=>{
   assert.deepEqual(blocked,[]);
   assert.deepEqual(pageErrors,[]);
  });
  console.log("PASS Chess Cloud UI "+count+"/"+count);
 }finally{await browser.close()}
})().catch(e=>{console.error("FAIL Chess Cloud UI",e);process.exitCode=1});
