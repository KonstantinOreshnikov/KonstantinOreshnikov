"use strict";
/* Real Chromium + Stockfish reviewed-postgame UX regression; never uses live Neon. */
const assert=require("node:assert/strict");
const path=require("node:path"),http=require("node:http"),fs=require("node:fs");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
async function server(){
 const srv=http.createServer((req,res)=>{
  const file=path.resolve(ROOT,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
  if(!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end();return}
  fs.readFile(file,(err,data)=>{
   if(err){res.writeHead(404);res.end();return}
   const type=file.endsWith(".js")?"text/javascript":file.endsWith(".wasm")?"application/wasm":file.endsWith(".svg")?"image/svg+xml":file.endsWith(".css")?"text/css":"text/html; charset=utf-8";
   res.writeHead(200,{"Content-Type":type,"Cache-Control":"no-store"});res.end(data);
  });
 });
 await new Promise(resolve=>srv.listen(0,"127.0.0.1",resolve));
 return srv;
}
(async()=>{
 const host=await server();
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 let n=0;const check=async(name,fn)=>{await fn();console.log("PASS V1 Postgame UX "+(++n)+" "+name)};
 const site="http://127.0.0.1:"+host.address().port+"/index.html";
 async function seed(moves,side){
  await page.evaluate(({moves,side})=>{
   const g=new Chess();for(const san of moves)if(!g.move(san))throw Error("Invalid fixture "+san);
   localStorage.setItem("chess-odyssey-v01",JSON.stringify({
    pgn:g.pgn(),side,difficulty:"beginner",language:"ru",flipped:false,finalized:false,notes:[],
    stats:{wins:0,losses:0,draws:0},matchMode:"practice",matchSession:null,
    completed:[],clockState:null,endedBy:null
   }));
  },{moves,side});
  await page.reload();await page.waitForSelector("#board .square");
 }
 async function click(from,to){
  await page.locator('#board [data-square="'+from+'"]').click();
  await page.locator('#board [data-square="'+to+'"]').click();
 }
 try{
  await page.goto(site);
  await seed(["e4","e5","Bc4","Nc6","Qh5","Nf6"],"w");
  await check("white mate triggers winner and player perspective without reload",async()=>{
   await click("h5","f7");
   await page.locator("#game-result-toast").waitFor({state:"visible"});
   assert.match(await page.locator("#game-result-title").innerText(),/Победили белые/);
   assert.match(await page.locator("#game-result-detail").innerText(),/Вы победили/);
   await page.locator("#game-result-close").click();
   assert.equal(await page.locator("#game-result-toast").isVisible(),false);
  });
  await check("replay toolbar and current SAN are board-adjacent",async()=>{
   const hierarchy=await page.evaluate(()=>{
    const dock=document.querySelector(".board-replay-dock"),frame=document.querySelector(".board-frame");
    return {sameParent:dock.parentElement===frame.parentElement,next:frame.nextElementSibling===dock,
      first:dock.querySelector("#h-first")!==null,san:dock.querySelector("#h-current-san")!==null};
   });
   assert.deepEqual(hierarchy,{sameParent:true,next:true,first:true,san:true});
   await page.locator("#h-first").click();
   assert.match(await page.locator("#h-current-san").innerText(),/Начальная позиция/);
  });
  await check("Stockfish completes review and shows 5×2 category table",async()=>{
   await page.locator("#full-review-details > summary").click();
   await page.locator("#review-quality").selectOption("quick");
   await page.locator("#start-review").click();
   await page.waitForFunction(()=>/Разбор завершён/.test(document.querySelector("#review-progress").textContent),null,{timeout:120000});
   assert.equal(await page.locator("#review-skills tbody tr").count(),5);
   assert.equal(await page.locator("#review-skills tbody td").count(),10);
   assert.match(await page.locator("#review-skills").innerText(),/Тактическая игра/);
   assert.match(await page.locator(".skills-method").innerText(),/ожидаемых очков/);
  });
  await check("on-board reviewed move badge matches exact move-list grade for both sides",async()=>{
   const known=await page.locator('#review-entries [data-tag]:not([data-tag="unknown"])').evaluateAll(elements=>elements.map(x=>({ply:Number(x.dataset.ply),tag:x.dataset.tag})));
   const white=known.find(x=>x.ply%2===1),black=known.find(x=>x.ply%2===0);
   assert.ok(white&&black,JSON.stringify(known));
   for(const entry of [white,black]){
    await page.locator('#review-entries button[data-ply="'+entry.ply+'"]').click();
    const badge=page.locator("#board .move-grade-badge");
    assert.equal(await badge.count(),1);
    assert.equal(await badge.getAttribute("data-tag"),entry.tag);
    assert.equal(Number(await badge.getAttribute("data-ply")),entry.ply);
    const square=await badge.evaluate(x=>x.parentElement.dataset.square);
    const san=await page.locator("#h-current-san").innerText();
    assert.ok(san.length>2);
    const target=await page.evaluate(ply=>{
     const g=new Chess(),moves=["e4","e5","Bc4","Nc6","Qh5","Nf6","Qxf7#"];
     let last=null;for(let i=0;i<ply;i++)last=g.move(moves[i]);return last.to;
    },entry.ply);
    assert.equal(square,target);
   }
   await page.locator("#flip").check();
   assert.equal(await page.locator("#board .move-grade-badge").count(),1);
  });
  await check("10+ previous/next clicks never shift scroll or lose visible board and dock",async()=>{
   await page.locator("#flip").uncheck();
   await page.locator("#h-first").click();
   await page.evaluate(()=>{
    const dock=document.querySelector(".board-replay-dock");
    window.scrollTo(0,window.scrollY+dock.getBoundingClientRect().bottom-innerHeight+32);
   });
   const start=await page.evaluate(()=>scrollY);
   for(let i=0;i<7;i++){
    await page.locator("#h-next").click();
    const y=await page.evaluate(()=>scrollY);assert.ok(Math.abs(y-start)<=2,"scroll jump "+i+": "+y+" vs "+start);
    const region=await page.evaluate(()=>({board:document.querySelector("#board").getBoundingClientRect().top,
      dock:document.querySelector(".board-replay-dock").getBoundingClientRect().bottom,height:window.innerHeight}));
    assert.ok(region.board>=-4&&region.dock<=region.height+4,JSON.stringify(region));
   }
   for(let i=0;i<7;i++)await page.locator("#h-prev").click();
   assert.equal(await page.locator("#board .move-grade-badge").count(),0);
  });
  await check("black mating move shows black winner and You won",async()=>{
   await seed(["f3","e5","g4"],"b");
   await click("d8","h4");
   await page.locator("#game-result-toast").waitFor({state:"visible"});
   assert.match(await page.locator("#game-result-title").innerText(),/Победили чёрные/);
   assert.match(await page.locator("#game-result-detail").innerText(),/Вы победили/);
  });
  await check("draw result displays no false winner",async()=>{
   await seed(["Nf3","Nf6","Ng1","Ng8","Nf3","Nf6","Ng1"],"b");
   await click("f6","g8");
   await page.locator("#game-result-toast").waitFor({state:"visible"});
   assert.match(await page.locator("#game-result-title").innerText(),/Ничья/);
   assert.match(await page.locator("#game-result-detail").innerText(),/вничью/);
  });
  await check("resignation confirmation produces loss toast and never repeats on reload",async()=>{
   await seed([],"w");
   page.once("dialog",dialog=>dialog.accept());
   await page.locator("#resign").click();
   await page.locator("#game-result-toast").waitFor({state:"visible"});
   assert.match(await page.locator("#game-result-title").innerText(),/Победили чёрные/);
   assert.match(await page.locator("#game-result-detail").innerText(),/Вы проиграли/);
   await page.reload();
   assert.equal(await page.locator("#game-result-toast").isVisible(),false);
  });
  await check("mobile reviewed navigation fits viewport without horizontal scrolling",async()=>{
   // Use a live move history: after the resignation test the replay buttons are correctly disabled.
   await seed(["e4","e5"],"w");
   await page.setViewportSize({width:390,height:844});
   await page.locator("#h-first").click();
   const state=await page.evaluate(()=>({vp:innerWidth,scroll:document.documentElement.scrollWidth,
     buttons:[...document.querySelectorAll(".board-replay-dock button")].filter(x=>!x.hidden).every(x=>x.getBoundingClientRect().width>=30)}));
   assert.ok(state.scroll<=state.vp+3,JSON.stringify(state));
   assert.ok(state.buttons,JSON.stringify(state));
  });
  await check("mobile game setup appears under tabs with unique original controls",async()=>{
   const panel=page.locator("#mobile-game-settings");
   await panel.waitFor({state:"visible"});
   const initial=await page.evaluate(()=>{
     const details=document.getElementById("mobile-game-settings");
     return {collapsed:!details.open,aboveBoard:details.nextElementSibling.classList.contains("play-section"),
       parent:details.parentElement.id,visible:getComputedStyle(details).display!=="none",
       duplicates:["level","side","match-mode","time-control","board-theme-details","piece-style-details"]
         .every(id=>document.querySelectorAll("#"+id).length===1)};
   });
   assert.deepEqual(initial,{collapsed:true,aboveBoard:true,parent:"practice-view",visible:true,duplicates:true});
   await page.locator("#mobile-game-settings > summary").click();
   assert.equal(await panel.evaluate(x=>x.open),true);
   const moved=await page.evaluate(()=>[".appearance-panel",".settings-panel"]
     .every(sel=>document.querySelector("#mobile-settings-fields > "+sel)!==null));
   assert.ok(moved,"both original panels must move under the accordion");
   await page.locator("#level").selectOption("advanced");
   await page.locator("#side").selectOption("b");
   await page.locator("#match-mode").selectOption("independent");
   await page.locator("#time-control").selectOption("blitz5");
   await page.locator("#board-theme-details > summary").click();
   await page.locator("#theme-options [data-value]").nth(1).click();
   await page.locator("#piece-style-details > summary").click();
   await page.locator("#piece-options [data-value]").nth(1).click();
   await page.locator("#mobile-settings-done").click();
   assert.equal(await panel.evaluate(x=>x.open),false);
   for(const [id,expected] of [["level","advanced"],["side","b"],["match-mode","independent"],["time-control","blitz5"]]){
     assert.equal(await page.locator("#"+id).inputValue(),expected);
   }
  });
  await check("mobile setup survives desktop resize, RU EN AZ and reload without overflow",async()=>{
   await page.evaluate(()=>{window.__gameSettingsNodes=["level","side","match-mode","time-control"]
     .map(id=>document.getElementById(id));});
   await page.setViewportSize({width:1280,height:900});
   const desktop=await page.evaluate(()=>({
     restored:[".appearance-panel",".settings-panel"].every(sel=>document.querySelector("#practice-view > .sidebar > "+sel)),
     original:window.__gameSettingsNodes.every((node,i)=>node===document.getElementById(["level","side","match-mode","time-control"][i])),
     hidden:getComputedStyle(document.getElementById("mobile-game-settings")).display==="none"
   }));
   assert.deepEqual(desktop,{restored:true,original:true,hidden:true});
   await page.setViewportSize({width:390,height:844});
   await page.locator("#mobile-game-settings > summary").click();
   await page.locator("#global-language").selectOption("en");
   assert.match(await page.locator("#mobile-game-settings > summary").innerText(),/Game settings/);
   assert.match(await page.locator("#mobile-settings-done").innerText(),/Done/);
   await page.locator("#global-language").selectOption("az");
   assert.match(await page.locator("#mobile-game-settings > summary").innerText(),/Partiya ayarları/);
   await page.locator("#global-language").selectOption("ru");
   await page.locator("#mobile-settings-done").click();
   const mobile=await page.evaluate(()=>({
     original:window.__gameSettingsNodes.every((node,i)=>node===document.getElementById(["level","side","match-mode","time-control"][i])),
     moved:[".appearance-panel",".settings-panel"].every(sel=>document.querySelector("#mobile-settings-fields > "+sel)),
     width:document.documentElement.scrollWidth,viewport:innerWidth,squares:document.querySelectorAll("#board .square").length
   }));
   assert.equal(mobile.original,true);
   assert.equal(mobile.moved,true);
   assert.ok(mobile.width<=mobile.viewport+3,JSON.stringify(mobile));
   assert.equal(mobile.squares,64);
   await page.reload();
   assert.equal(await page.locator("#mobile-game-settings").evaluate(el=>el.open),false);
   assert.equal(await page.locator("#level").inputValue(),"advanced");
   assert.equal(await page.locator("#side").inputValue(),"b");
   assert.equal(await page.locator("#match-mode").inputValue(),"independent");
   assert.equal(await page.locator("#time-control").inputValue(),"blitz5");
  });
  await check("no uncaught browser exceptions",async()=>assert.deepEqual(errors,[]));
  console.log("PASS V1 Postgame UX "+n+"/"+n);
 }finally{await browser.close();await new Promise(resolve=>host.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
