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
let invitation=null,game=null,failInvite=true,writes=0,dropNextMove=false,failNextRead=false;const blocked=[],committed=new Map();
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
    game={game_id:gameId,white_user_id:"alice",black_user_id:identity,state:"active",canonical_pgn:"",canonical_fen:chess.fen(),version:0,base_ms:300000,white_remaining_ms:300000,black_remaining_ms:300000,running_color:"w",last_clock_at:new Date().toISOString(),move_count:0,result:null};
    invitation.state="accepted";invitation.game_id=gameId;writes++;
    return reply(200,{game_id:gameId});
   }
   if(u.pathname==="/api/pvp/game"&&method==="GET"){
    if(failNextRead){failNextRead=false;return reply(503,{error:"TEMPORARY_NETWORK_ERROR"})}
    if(!game||u.searchParams.get("id")!==gameId||![game.white_user_id,game.black_user_id].includes(identity))return reply(404,{error:"NOT_FOUND"});
    return reply(200,{game,playerColor:game.white_user_id===identity?"w":"b"});
   }
   if(u.pathname==="/api/pvp/play"&&method==="POST"){
    const body=request.postDataJSON();
    if(!game||![game.white_user_id,game.black_user_id].includes(identity))return reply(404,{error:"NOT_FOUND"});
    if(committed.has(body.requestId)){const old=committed.get(body.requestId);if(old.identity!==identity||old.from!==body.from||old.to!==body.to)return reply(409,{error:"REQUEST_ID_REUSED"});return reply(200,{game_id:gameId,version:game.version,duplicate:true});}
    if(body.expectedVersion!==game.version)return reply(409,{error:"STALE_GAME_VERSION"});
    const chess=new Chess();if(game.canonical_pgn)chess.load_pgn(game.canonical_pgn);
    if(chess.turn()!==(identity==="alice"?"w":"b"))return reply(409,{error:"NOT_YOUR_TURN"});
    if(!chess.move({from:body.from,to:body.to,promotion:body.promotion||"q"}))return reply(422,{error:"ILLEGAL_MOVE"});
    const elapsed=Date.now()-Date.parse(game.last_clock_at);const clockKey=game.running_color==="w"?"white_remaining_ms":"black_remaining_ms";
    game={...game,[clockKey]:Math.max(0,game[clockKey]-elapsed),canonical_pgn:chess.pgn(),canonical_fen:chess.fen(),version:game.version+1,move_count:game.move_count+1,running_color:chess.turn(),last_clock_at:new Date().toISOString()};
    committed.set(body.requestId,{identity,from:body.from,to:body.to});writes++;if(dropNextMove){dropNextMove=false;return route.abort("failed")}return reply(200,{game_id:gameId,version:game.version});
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
  await a.page.locator("#nav-masters").click();
  const mastersText=await a.page.locator("#m-explain").evaluate(x=>getComputedStyle(x).fontSize);
  assert.ok(parseFloat(mastersText)>14,"Masters instructional comments should zoom");
  await a.page.locator("#nav-play").click();
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
  await a.page.waitForFunction(()=>document.querySelector("#pvp-game-status")?.textContent?.includes("партия началась")||document.querySelector("#pvp-game-status")?.textContent?.includes("Ваш ход"));
  assert.equal(await a.page.locator("#pvp-board .square").count(),64);
  pass("creator auto-enters game after friend accepts without guessing game ID");
  await a.page.locator('#pvp-board [data-square="e2"]').click();
  await a.page.locator('#pvp-board [data-square="e4"]').click();
  await a.page.waitForFunction(()=>document.querySelector("#pvp-moves")?.textContent.includes("e4"));
  await b.page.locator("#pvp-refresh").click();
  await b.page.waitForFunction(()=>document.querySelector("#pvp-moves")?.textContent.includes("e4"));
  assert.equal(writes,3);
  pass("server-authoritative legal move visible to both mock players");
  for(const player of [a,b]){
   assert.equal(await player.page.locator("#pvp-board .file").count(),8);assert.equal(await player.page.locator("#pvp-board .rank").count(),8);
   assert.equal(await player.page.locator("#pvp-board .last").count(),2);
   assert.equal(await player.page.locator("#pvp-black-card").getAttribute("data-active"),"true");
   assert.equal(await player.page.locator("#pvp-review-open").isDisabled(),true);
   const first=await player.page.locator("#pvp-board .square").first().getAttribute("data-square");await player.page.locator("#pvp-flip").click();assert.notEqual(await player.page.locator("#pvp-board .square").first().getAttribute("data-square"),first);await player.page.locator("#pvp-flip").click();
  }
  pass("PvP coordinates, confirmed last move, active color, both orientations and no live review");
  // No manual refresh for subsequent moves. Wait for opposing automatic synchronization.
  for(const [player,other,from,to,san] of [[b,a,"e7","e5","e5"],[a,b,"g1","f3","Nf3"],[b,a,"b8","c6","Nc6"],[a,b,"f1","b5","Bb5"],[b,a,"a7","a6","a6"]]){
   await player.page.locator(`#pvp-board [data-square="${from}"]`).click();
   await player.page.waitForTimeout(1400); // polling must not clear an unchanged selection
   await player.page.locator(`#pvp-board [data-square="${to}"]`).click();
   await other.page.waitForFunction(x=>document.querySelector("#pvp-moves")?.textContent.includes(x),san,{timeout:15000});
  }
  assert.equal(game.move_count,6);
  pass("automatic alternating moves and selection survives polling");
  for(const player of [a,b]){await player.page.reload({waitUntil:"domcontentloaded"});await player.page.waitForFunction(()=>window.ChessCloud?.authenticated?.()&&!document.querySelector("#pvp-view").hidden&&document.querySelector("#pvp-moves").textContent.includes("a6"),null,{timeout:20000});}
  pass("both real browser contexts recover same active game after F5");
  for(const player of [a,b])assert.equal(await player.page.locator("#pvp-board .last").count(),2);
  pass("last-move highlighting restores after F5");
  const clock1=await a.page.locator("#pvp-white-time").innerText();await a.page.waitForTimeout(1300);assert.notEqual(await a.page.locator("#pvp-white-time").innerText(),clock1);pass("server-clock snapshot counts down between polls");
  failNextRead=true;await a.page.locator("#pvp-refresh").click();await a.page.waitForFunction(()=>document.querySelector("#pvp-game-status")?.textContent?.includes("Ваш ход"),null,{timeout:15000});pass("temporary read failure recovers active game");
  dropNextMove=true;
  for(let i=6;i<40;i++){
   const c=new Chess();assert.ok(c.load_pgn(game.canonical_pgn));const actor=c.turn()==="w"?a:b,other=actor===a?b:a;
   const candidates=c.moves({verbose:true});let move;
   for(const m of candidates){if(m.flags.includes("p"))continue;c.move({from:m.from,to:m.to,promotion:m.promotion||"q"});const good=!c.game_over();c.undo();if(good){move=m;break;}}
   assert.ok(move,"no non-terminal move at ply "+i);
   await actor.page.locator(`#pvp-board [data-square="${move.from}"]`).click();await actor.page.locator(`#pvp-board [data-square="${move.to}"]`).click();
   const next=new Chess();assert.ok(next.load_pgn(c.pgn()));assert.ok(next.move({from:move.from,to:move.to}));const expected=next.pgn();
   for(const player of [actor,other])await player.page.waitForFunction(pgn=>document.querySelector("#pvp-moves")?.textContent.endsWith(pgn),expected,{timeout:15000});
   assert.equal(game.move_count,i+1);
  }
  assert.equal(writes,42);assert.equal(committed.size,40);pass("40 alternating half-moves with lost-response idempotent replay and no duplicate writes");
  for(const [lang,expected] of [["ru","Блиц · 5+0"],["en","Blitz · 5+0"],["az","Blits · 5+0"]]){await a.page.locator("#global-language").selectOption(lang);assert.equal(await a.page.locator('#pvp-time option[value="blitz5"]').innerText(),expected);}
  pass("localized online time-control options");
  for(const [lang,preset,piece,aria] of [["ru","Рапид · 15+10","Ферзь","Шахматная доска"],["en","Rapid · 15+10","Queen","Chessboard"],["az","Rapid · 15+10","Vəzir","Şahmat lövhəsi"]]){await a.page.locator("#global-language").selectOption(lang);assert.equal(await a.page.locator('#pvp-time option[value="rapid1510"]').innerText(),preset);assert.equal(await a.page.locator('#pvp-promotion option[value="q"]').innerText(),piece);await a.page.locator("#nav-play").click();assert.equal(await a.page.locator('#time-control option[value="rapid1510"]').innerText(),preset);assert.equal(await a.page.locator("#board").getAttribute("aria-label"),aria);await a.page.locator("#nav-pvp").click();}
  pass("local and online presets, promotion and board accessibility in all three locales");
  for(const [lang,turn] of [["ru","Ход белых"],["en","White to move"],["az","Ağların gedişi"]]){
   await a.page.locator("#global-language").selectOption(lang);assert.equal(await a.page.locator("#pvp-turn").innerText(),turn);
  }
  for(const width of [1280,390,320]){
   await a.page.setViewportSize({width,height:860});assert.equal(await a.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   await a.page.locator("#nav-play").click();assert.equal(await a.page.locator(".board-replay-dock").evaluate(x=>getComputedStyle(x).position),"static");
   const board=await a.page.locator("#practice-view .board-frame").boundingBox(),dock=await a.page.locator(".board-replay-dock").boundingBox();assert.ok(Math.abs(board.width-dock.width)<3&&Math.abs(board.x-dock.x)<3,"dock must align at "+width);
   await a.page.locator("#nav-pvp").click();
  }
  await a.page.setViewportSize({width:1280,height:860});
  pass("three-language absolute turn and non-sticky aligned responsive Practice controls");
  const captureGame=new Chess();assert.ok(captureGame.load_pgn("1. e4 d5 2. exd5 Qxd5 3. Nc3 Qe5+ 4. Be2"));
  await a.page.locator("#global-language").selectOption("en");await b.page.locator("#global-language").selectOption("ru");
  game={...game,canonical_pgn:captureGame.pgn(),canonical_fen:captureGame.fen(),state:"finished",result:"1-0",reason:"timeout",version:game.version+1,running_color:null,move_count:captureGame.history().length};
  for(const [player,lang,title] of [[a,"en","You won"],[b,"ru","Вы проиграли"]]){
   await player.page.waitForFunction(()=>document.querySelector("#pvp-result")?.open,null,{timeout:15000});
   assert.equal(await player.page.locator("#pvp-result-title").innerText(),title);
   assert.equal(await player.page.locator("#pvp-white-captured [data-piece=p]").getAttribute("data-count"),"1");assert.equal(await player.page.locator("#pvp-black-captured [data-piece=p]").getAttribute("data-count"),"1");
   await player.page.locator("#pvp-result-review").click();assert.equal(await player.page.locator("#pvp-review-panel").isVisible(),true);
   await player.page.locator("#pvp-review-first").click();assert.equal(await player.page.locator("#pvp-board .last").count(),0);assert.equal(await player.page.locator("#pvp-white-captured [data-piece=p]").count(),0);
   await player.page.locator("#pvp-review-last").click();assert.equal(await player.page.locator("#pvp-board .last").count(),2);
   await player.page.locator("#pvp-review-close").click();
  }
  pass("both-player terminal result, captured counts and read-only finished-game replay");
  const timing=await a.page.evaluate(()=>window.ChessPvp.latency());assert.ok(timing.read.count>0&&timing.read.p95>=0&&timing.move.count>0);console.log("Synthetic latency (ms): "+JSON.stringify(timing));
  pass("bounded local timing diagnostics");
  await c.page.goto(BASE,{waitUntil:"domcontentloaded"});await c.page.waitForFunction(()=>window.ChessCloud?.authenticated?.());
  await c.page.locator("#nav-pvp").click();assert.equal(await c.page.locator("#pvp-games button").count(),0);
  pass("mock outsider cannot see either player's game");
  assert.deepEqual(problems,[]);
  assert.deepEqual(blocked,[]);
  console.log("PASS v1.1 Header/PvP "+checks+"/"+checks+" (mock transport; live Neon E2E remains open)");
 } finally{await browser.close()}
})().catch(e=>{console.error("FAIL v1.1 Header/PvP",e);process.exitCode=1});
