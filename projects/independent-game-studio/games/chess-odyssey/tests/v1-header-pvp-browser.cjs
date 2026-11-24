"use strict";
/* Deterministic browser E2E of v1.1 UX; mock transport only, NOT real Neon evidence. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const {chromium}=require("playwright");
const Chess=require("../vendor/chess.js").Chess;
const ROOT=path.resolve(__dirname,"..");
const ORIGIN="https://konstantinoreshnikov.github.io";
const PREFIX="/KonstantinOreshnikov/chess-odyssey/";
const BASE=ORIGIN+PREFIX;
const SDK=[
'export function createClient(){',
'const a=window.__mockIdentity;',
'return {auth:{',
'getSession:async()=>({data:a.id?{session:{token:a.token},user:{id:a.id,email:a.id+"@example.test"}}:{session:null,user:null},error:null}),',
'signOut:async()=>{a.id=null;return {data:{},error:null}},',
'signIn:{email:async()=>({data:{},error:null})},signUp:{email:async()=>({data:{},error:null})},',
'emailOtp:{verifyEmail:async()=>({data:{},error:null}),sendVerificationOtp:async()=>({data:{},error:null})}',
'}};}'
].join("\n");
const actors={alice:"aaa.bbb.ccc",bob:"ddd.eee.fff",charlie:"ggg.hhh.iii"};
const inviteId="11111111-1111-4111-8111-111111111111",gameId="22222222-2222-4222-8222-222222222222";
let invitation=null,game=null,failInvite=true,writes=0;const blocked=[];
const fixture=async(actor,browser)=>{
 const context=await browser.newContext({viewport:{width:1280,height:860}});
 await context.addInitScript(identity=>{window.__mockIdentity=identity}, {id:actor,token:actors[actor]});
 await context.route("**/*",async route=>{
  const request=route.request(),u=new URL(request.url()),method=request.method();
  if(u.origin===ORIGIN){
   if(!u.pathname.startsWith(PREFIX)){blocked.push("bad-path "+u.pathname);return route.abort()}
   let relative=u.pathname.slice(PREFIX.length)||"index.html";
   const f=path.resolve(ROOT,relative);
   if(!f.startsWith(ROOT+path.sep)){blocked.push("bad-file");return route.abort()}
   try{
    const body=await fs.promises.readFile(f);
    const mime=f.endsWith(".js")?"text/javascript":f.endsWith(".css")?"text/css":f.endsWith(".wasm")?"application/wasm":f.endsWith(".svg")?"image/svg+xml":f.endsWith(".json")?"application/json":"text/html; charset=utf-8";
    return route.fulfill({status:200,contentType:mime,body});
   }catch{blocked.push("missing "+relative);return route.fulfill({status:404,body:"Missing"})}
  }
  if(u.hostname==="esm.sh")return route.fulfill({status:200,contentType:"text/javascript",headers:{"Access-Control-Allow-Origin":"*"},body:SDK});
  if(u.hostname.endsWith(".neon.tech")&&u.pathname.startsWith("/api/")){
   const headers={"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Headers":"authorization,content-type","Access-Control-Allow-Methods":"GET,POST,PUT,OPTIONS","Content-Type":"application/json"};
   if(method==="OPTIONS")return route.fulfill({status:204,headers});
   const identity=Object.keys(actors).find(k=>request.headers().authorization==="Bearer "+actors[k]);
   const reply=(status,data)=>route.fulfill({status,headers,body:JSON.stringify(data)});
   if(!identity)return reply(401,{error:"UNAUTHORIZED"});
   if(u.pathname==="/api/progress"&&method==="GET")return reply(200,{revision:0,progressDoc:null});
   if(u.pathname==="/api/pvp/dashboard")return reply(200,{games:game&&[game.white_user_id,game.black_user_id].includes(identity)?[game]:[],invites:invitation&&invitation.inviter_user_id===identity?[invitation]:[]});
   if(u.pathname==="/api/pvp/invite"&&method==="POST"){
    if(failInvite)return reply(503,{error:"PVP_NOT_CONFIGURED"});
    invitation={invite_id:inviteId,inviter_user_id:identity,invited_user_id:null,state:"pending",game_id:null,creator_color:"w",expires_at:"2026-11-25T23:00:00Z"};
    writes++;return reply(200,{...invitation,inviteToken:"x".repeat(43)});
   }
   if(u.pathname==="/api/pvp/accept"&&method==="POST"){
    const body=request.postDataJSON();
    if(!invitation||body.inviteToken!=="x".repeat(43)||identity===invitation.inviter_user_id)return reply(409,{error:"INVALID_INVITE"});
    const chess=new Chess();
    game={game_id:gameId,white_user_id:"alice",black_user_id:identity,state:"active",canonical_pgn:"",canonical_fen:chess.fen(),version:0,white_remaining_ms:300000,black_remaining_ms:300000,move_count:0,result:null};
    invitation.state="accepted";invitation.game_id=gameId;writes++;
    return reply(200,{game_id:gameId});
   }
   if(u.pathname==="/api/pvp/game"&&method==="GET"){
    if(!game||u.searchParams.get("id")!==gameId||![game.white_user_id,game.black_user_id].includes(identity))return reply(404,{error:"NOT_FOUND"});
    return reply(200,{game,playerColor:game.white_user_id===identity?"w":"b"});
   }
   if(u.pathname==="/api/pvp/play"&&method==="POST"){
    const body=request.postDataJSON();
    if(!game||![game.white_user_id,game.black_user_id].includes(identity))return reply(404,{error:"NOT_FOUND"});
    if(body.expectedVersion!==game.version)return reply(409,{error:"STALE_GAME_VERSION"});
    const chess=new Chess();if(game.canonical_pgn)chess.load_pgn(game.canonical_pgn);
    if(chess.turn()!==(identity==="alice"?"w":"b"))return reply(409,{error:"NOT_YOUR_TURN"});
    if(!chess.move({from:body.from,to:body.to,promotion:body.promotion||"q"}))return reply(422,{error:"ILLEGAL_MOVE"});
    game={...game,canonical_pgn:chess.pgn(),canonical_fen:chess.fen(),version:game.version+1,move_count:game.move_count+1};
    writes++;return reply(200,{game_id:gameId,version:game.version});
   }
   blocked.push("unhandled-api "+method+" "+u.pathname);return reply(404,{error:"NOT_FOUND"});
  }
  blocked.push("uncontrolled "+u.host+u.pathname);return route.abort();
 });
 return {context,page:await context.newPage()};
};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const a=await fixture("alice",browser),b=await fixture("bob",browser),c=await fixture("charlie",browser),anonymous=await fixture(null,browser);
 const problems=[];for(const x of [a.page,b.page,c.page])x.on("pageerror",e=>problems.push(e.message));
 let checks=0;const pass=n=>{console.log("PASS v1.1 Header/PvP "+(++checks)+" "+n)};
 try{
  await a.page.goto(BASE,{waitUntil:"domcontentloaded"});await a.page.waitForFunction(()=>window.ChessHeader&&window.ChessCloud?.authenticated?.(),null,{timeout:25000});
  const boardBefore=await a.page.locator("#board").boundingBox();
  const baseText=await a.page.locator("#academy-dock-instruction").evaluate(x=>getComputedStyle(x).fontSize);
  await a.page.locator("#header-zoom-in").click();await a.page.locator("#header-zoom-in").click();
  assert.equal(await a.page.locator("#header-zoom-value").innerText(),"120%");
  const larger=await a.page.locator("#academy-dock-instruction").evaluate(x=>getComputedStyle(x).fontSize);
  assert.ok(parseFloat(larger)>parseFloat(baseText));
  const boardAfter=await a.page.locator("#board").boundingBox();
  assert.equal(boardAfter.width,boardBefore.width);assert.equal(boardAfter.height,boardBefore.height);
  pass("text-only zoom scales explanations, not chessboard");
  await a.page.reload({waitUntil:"domcontentloaded"});await a.page.waitForFunction(()=>window.ChessHeader&&window.ChessCloud?.authenticated?.());
  assert.equal(await a.page.locator("#header-zoom-value").innerText(),"120%");
  await a.page.locator("#header-zoom-value").click();
  assert.equal(await a.page.locator("#header-zoom-value").innerText(),"100%");
  pass("persisted preference and reset");
  const bounds=[];
  for(const lang of ["ru","en","az"]){
   await a.page.locator("#global-language").selectOption(lang);
   bounds.push(await a.page.locator("#global-language").boundingBox());
  }
  assert.ok(bounds.every(x=>x.width===bounds[0].width&&x.x===bounds[0].x));
  pass("locale selector has stable position and width RU EN AZ");
  for(const width of [720,390,320]){
   await a.page.setViewportSize({width,height:850});
   const overflow=await a.page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflow,false,"Unexpected horizontal scroll at "+width+"px");
   assert.equal(await a.page.locator("#header-login").isVisible(),true);
  }
  await a.page.setViewportSize({width:1280,height:860});
  pass("320/390/720 responsive header: no clipping or horizontal page scroll");
  await a.page.locator("#global-language").selectOption("ru");
  await a.page.locator("#header-login").click();
  assert.equal(await a.page.locator("#header-account-dialog").evaluate(x=>x.open),true);
  assert.equal(await a.page.locator("#header-account-dialog #cloud-account").count(),1);
  assert.equal(await a.page.locator("#cloud-account").count(),1);
  await a.page.locator("#header-account-close").click();
  assert.equal(await a.page.locator("#progress-view #cloud-account").count(),1);
  pass("single live Neon session form reparented to accessible header dialog and restored");
  await a.page.locator("#nav-pvp").click();await a.page.locator("#pvp-create").click();
  await a.page.waitForFunction(()=>document.querySelector("#pvp-game-status")?.textContent?.includes("503"));
  assert.equal(writes,0);
  pass("unconfigured 503 backend shown as actionable localized error without invite write");
  failInvite=false;await a.page.locator("#pvp-create").click();
  await a.page.waitForFunction(()=>document.querySelector("#pvp-invite-link")?.value.includes("#invite="));
  assert.equal(writes,1);
  const link=await a.page.locator("#pvp-invite-link").inputValue();
  assert.ok(link.endsWith("#invite="+"x".repeat(43)));
  assert.equal(await a.page.locator("#pvp-waiting").isVisible(),true);
  pass("creator gets shareable 43-char invite URL and visible waiting state");
  await anonymous.page.goto(link,{waitUntil:"domcontentloaded"});
  await anonymous.page.waitForFunction(()=>window.ChessHeader&&document.querySelector("#pvp-invite-token")?.value.length===43);
  assert.equal(await anonymous.page.locator("#pvp-view").isVisible(),true);
  assert.equal(await anonymous.page.locator("#pvp-login").isVisible(),true);
  assert.equal(await anonymous.page.locator("#pvp-accept").isDisabled(),true);
  await anonymous.page.locator("#pvp-login").click();
  assert.equal(await anonymous.page.locator("#header-account-dialog").evaluate(x=>x.open),true);
  await anonymous.page.locator("#header-account-close").click();
  assert.equal(await anonymous.page.locator("#pvp-invite-token").inputValue(),"x".repeat(43));
  pass("signed-out recipient follows share URL, sees login without losing invite");
  await b.page.goto(link,{waitUntil:"domcontentloaded"});
  await b.page.waitForFunction(()=>window.ChessCloud?.authenticated?.()&&document.querySelector("#pvp-invite-token")?.value.length===43);
  assert.equal(await b.page.locator("#pvp-view").isVisible(),true);
  assert.equal(await b.page.locator("#pvp-invite-token").inputValue(),"x".repeat(43));
  await b.page.locator("#pvp-accept").click();
  await b.page.waitForFunction(()=>document.querySelector("#pvp-game-status")?.textContent?.includes("приглашение принято")||document.querySelector("#pvp-game-status")?.textContent?.includes("Приглашение принято"));
  assert.equal(writes,2);assert.equal(await b.page.locator("#pvp-board .square").count(),64);
  pass("friend link auto-opens PvP and one-click accept starts board");
  await a.page.locator("#pvp-refresh").click();
  await a.page.waitForFunction(()=>document.querySelector("#pvp-game-status")?.textContent?.includes("партия началась"));
  assert.equal(await a.page.locator("#pvp-board .square").count(),64);
  pass("creator auto-enters game after friend accepts without guessing game ID");
  await a.page.locator('#pvp-board [data-square="e2"]').click();
  await a.page.locator('#pvp-board [data-square="e4"]').click();
  await a.page.waitForFunction(()=>document.querySelector("#pvp-moves")?.textContent.includes("e4"));
  await b.page.locator("#pvp-refresh").click();
  await b.page.waitForFunction(()=>document.querySelector("#pvp-moves")?.textContent.includes("e4"));
  assert.equal(writes,3);
  pass("server-authoritative legal move visible to both mock players");
  await c.page.goto(BASE,{waitUntil:"domcontentloaded"});await c.page.waitForFunction(()=>window.ChessCloud?.authenticated?.());
  await c.page.locator("#nav-pvp").click();assert.equal(await c.page.locator("#pvp-games button").count(),0);
  pass("mock outsider cannot see either player's game");
  assert.deepEqual(problems,[]);
  assert.deepEqual(blocked,[]);
  console.log("PASS v1.1 Header/PvP "+checks+"/"+checks+" (mock transport; live Neon E2E remains open)");
 } finally{await browser.close()}
})().catch(e=>{console.error("FAIL v1.1 Header/PvP",e);process.exitCode=1});
