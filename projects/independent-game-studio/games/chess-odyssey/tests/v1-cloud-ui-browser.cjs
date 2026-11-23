"use strict";
/* Synthetic Chromium acceptance of cloud UI without external accounts or Neon writes. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
const ORIGIN="https://konstantinoreshnikov.github.io";
const PREFIX="/KonstantinOreshnikov/chess-odyssey/";
const fakeSdk=String.raw\`export function createClient() {
 const a=window.__chessMockAuth;
 return {auth:{
  getSession:async()=>({data:a.session?{session:{token:"aaa.bbb.ccc"},user:{email:a.email}}:{session:null,user:null},error:null}),
  signUp:{email:async({email})=>{a.email=email;a.verified=false;return {data:{user:{email}},error:null}}},
  signIn:{email:async({email})=>{if(!a.verified)return {error:{message:"EMAIL_NOT_VERIFIED"}};a.email=email;a.session=true;return {data:{user:{email}},error:null}}},
  emailOtp:{verifyEmail:async({otp})=>{if(otp!=="654321")return {error:{message:"INVALID_OTP"}};a.verified=true;return {data:{},error:null}},sendVerificationOtp:async()=>({data:{},error:null})},
  signOut:async()=>{a.session=false;return {data:{},error:null}}
 }};
}\`;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1280,height:840}});
 const page=await context.newPage();
 let remoteRev=7,remoteDoc={schema:1,progress:{source:"remote"}}, writes=[],blocked=[],count=0;
 const check=async(name,fn)=>{await fn();console.log("PASS Chess Cloud UI "+(++count)+" "+name)};
 const pageErrors=[];page.on("pageerror",e=>pageErrors.push(e.message));
 await page.addInitScript(()=>{window.__chessMockAuth={email:"",verified:false,session:false}});
 await context.route("**/*",async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.origin===ORIGIN){
   let relative=u.pathname.startsWith(PREFIX)?u.pathname.slice(PREFIX.length):null;
   if(relative===null){blocked.push("unexpected-origin-path "+u.pathname);return route.abort()}
   if(!relative)relative="index.html";
   const f=path.resolve(ROOT,relative);
   if(!f.startsWith(ROOT+path.sep)){blocked.push("unsafe-file "+relative);return route.abort()}
   try{
    const data=await fs.promises.readFile(f);
    const contentType=f.endsWith(".js")?"text/javascript":f.endsWith(".css")?"text/css":f.endsWith(".wasm")?"application/wasm":f.endsWith(".svg")?"image/svg+xml":f.endsWith(".json")?"application/json":"text/html; charset=utf-8";
    return route.fulfill({status:200,body:data,contentType});
   }catch{blocked.push("missing-asset "+relative);return route.fulfill({status:404,body:"Missing"})}
  }
  if(u.hostname==="esm.sh"){
   return route.fulfill({status:200,contentType:"text/javascript",headers:{"Access-Control-Allow-Origin":"*"},body:fakeSdk});
  }
  if(u.hostname.endsWith(".neon.tech")&&u.pathname.startsWith("/api/")){
   if(req.headers().authorization!=="Bearer aaa.bbb.ccc"){return route.fulfill({status:401,contentType:"application/json",body:'{"error":"UNAUTHORIZED"}',headers:{"Access-Control-Allow-Origin":ORIGIN}})}
   if(u.pathname==="/api/progress"){
    if(req.method()==="GET")return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({revision:remoteRev,progressDoc:remoteDoc}),headers:{"Access-Control-Allow-Origin":ORIGIN}});
    if(req.method()==="PUT"){
     const data=req.postDataJSON();writes.push(data);
     if(data.expectedRevision!==remoteRev)return route.fulfill({status:409,contentType:"application/json",body:'{"error":"STALE_PROGRESS_REVISION"}',headers:{"Access-Control-Allow-Origin":ORIGIN}});
     remoteRev++;remoteDoc=data.progressDoc;
     return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({revision:remoteRev,saved:true}),headers:{"Access-Control-Allow-Origin":ORIGIN}});
    }
   }
   blocked.push("unexpected-api "+req.method()+" "+u.pathname);
   return route.fulfill({status:404,body:'{"error":"NOT_FOUND"}',contentType:"application/json",headers:{"Access-Control-Allow-Origin":ORIGIN}});
  }
  blocked.push("external-request "+u.hostname+u.pathname);
  return route.abort();
 });
 const waitStatus=async fragment=>page.waitForFunction(f=>document.querySelector("#cloud-status")?.textContent?.includes(f),fragment,{timeout:20000});
 try{
  await page.goto(ORIGIN+PREFIX,{waitUntil:"domcontentloaded"});
  await page.locator("#nav-progress").click();
  await page.waitForFunction(()=>window.ChessCloud&&document.querySelector("#cloud-auth-form")?.hidden===false);
  await check("anonymous user sees login and cannot overwrite cloud",async()=>{
   assert.equal(await page.locator("#cloud-upload").isDisabled(),true);
   assert.equal(await page.locator("#cloud-download").isDisabled(),true);
   assert.equal(await page.locator("#cloud-auth-form").isVisible(),true);
   assert.equal(remoteRev,7);
  });
  await page.locator("#cloud-email").fill("synthetic@example.test");
  await page.locator("#cloud-password").fill("ExamplePass-123");
  await check("sign-up requests verification without creating a real account",async()=>{
   await page.locator("#cloud-signup").click();await waitStatus("Проверьте почту");
   assert.equal(await page.evaluate(()=>window.__chessMockAuth.verified),false);
  });
  await check("synthetic OTP verifies email only",async()=>{
   await page.locator("#cloud-otp").fill("654321");
   await page.locator("#cloud-verify").click();await waitStatus("Email подтверждён");
   assert.equal(await page.evaluate(()=>window.__chessMockAuth.verified),true);
  });
  await check("sign-in reads existing server revision 7",async()=>{
   await page.locator("#cloud-login").click();await waitStatus("Вход выполнен");
   assert.equal(await page.locator("#cloud-signed-in").isVisible(),true);
   assert.equal(await page.locator("#cloud-identity").innerText(),"Аккаунт: synthetic@example.test");
   assert.equal(writes.length,0);
  });
  await page.evaluate(()=>localStorage.setItem("chess-odyssey-progress-v1",JSON.stringify({schema:1,synthetic:true})));
  await check("manual upload CAS starts at revision 7 and increments to 8",async()=>{
   await page.locator("#cloud-upload").click();await waitStatus("ревизия 8");
   assert.equal(writes.length,1);assert.equal(writes[0].expectedRevision,7);
   assert.equal(remoteRev,8);
  });
  await check("stale remote revision 409 never modifies local progress",async()=>{
   remoteRev=9;
   const before=await page.evaluate(()=>localStorage.getItem("chess-odyssey-progress-v1"));
   await page.locator("#cloud-upload").click();await waitStatus("Облако изменилось");
   assert.equal(remoteRev,9);
   assert.equal(await page.evaluate(()=>localStorage.getItem("chess-odyssey-progress-v1")),before);
  });
  await check("logout and login resynchronize CAS to revision 9",async()=>{
   await page.locator("#cloud-logout").click();await waitStatus("Выход выполнен");
   assert.equal(await page.locator("#cloud-auth-form").isVisible(),true);
   await page.locator("#cloud-login").click();await waitStatus("Вход выполнен");
   await page.locator("#cloud-upload").click();await waitStatus("ревизия 10");
   assert.equal(writes.at(-1).expectedRevision,9);assert.equal(remoteRev,10);
  });
  await check("cloud download cancellation leaves local store untouched",async()=>{
   const before=await page.evaluate(()=>localStorage.getItem("chess-odyssey-progress-v1"));
   page.once("dialog",dialog=>dialog.dismiss());
   await page.locator("#cloud-download").click();
   await page.waitForTimeout(300);
   assert.equal(await page.evaluate(()=>localStorage.getItem("chess-odyssey-progress-v1")),before);
   assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(x=>x.startsWith("chess-odyssey-cloud-backup-")).length),0);
  });
  await check("RU EN AZ change cloud panel labels while authenticated",async()=>{
   for(const [lang,heading] of [["ru","Аккаунт и облачный прогресс"],["en","Account & cloud progress"],["az","Hesab və bulud inkişafı"]]){
    await page.locator("#global-language").selectOption(lang);
    await page.waitForFunction(t=>document.querySelector("#cloud-heading")?.textContent===t,heading);
   }
  });
  await check("no real credential writes, uncontrolled requests or page errors",async()=>{
   assert.deepEqual(blocked,[]);
   assert.deepEqual(pageErrors,[]);
  });
  console.log("PASS Chess Cloud UI "+count+"/"+count);
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
