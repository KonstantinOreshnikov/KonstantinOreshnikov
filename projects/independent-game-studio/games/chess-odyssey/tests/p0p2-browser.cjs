/* P0-P2 actual Chromium E2E: standalone, trilingual UI, exact move replay, styling, UCI. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
function startServer(){
 const server=http.createServer((req,res)=>{
  const p=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname));
  if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);res.end();return;}
    res.writeHead(200,{"Content-Type":p.endsWith(".js")?"text/javascript":p.endsWith(".wasm")?"application/wasm":p.endsWith(".svg")?"image/svg+xml":p.endsWith(".css")?"text/css":"text/html; charset=utf-8","Cache-Control":"no-store"});res.end(data);
  });
 });
 return new Promise((resolve,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",()=>resolve(server));});
}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:1280,height:880}}),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 let count=0;const check=async(label,fn)=>{await fn();count++;console.log("PASS UX Chrome "+count+" "+label);};
 const seed=async(target,sans,mode="practice")=>{
  await target.evaluate(({sans,mode})=>{
   const game=new Chess();for(const x of sans){if(!game.move(x))throw Error("Illegal QA PGN "+x);}
   const old=JSON.parse(localStorage.getItem("chess-odyssey-v01")||"{}");
   localStorage.setItem("chess-odyssey-v01",JSON.stringify({...old,pgn:game.pgn(),side:"w",difficulty:"beginner",language:"ru",flipped:false,
      finalized:false,notes:[],academy:null,matchMode:mode,stats:{wins:0,losses:0,draws:0},
      matchSession:mode==="independent"?{id:"g-p0p2-fixture",mode:"independent",side:"w",level:"beginner",assisted:false,undone:false,restarted:false,fallback:false}:null}));
  },{sans,mode});
  await target.reload();
  await target.waitForFunction(()=>Boolean(window.ChessOdysseyQA?.ux));
 };
 let server=null;
 try{
  await page.goto("file://"+path.resolve(root,"index.html"));
  await page.waitForFunction(()=>Boolean(window.ChessOdysseyQA?.ux));
  await check("global trilingual selector exists and board has 64 squares",async()=>{
   assert.equal(await page.locator("#global-language option").count(),3);
   assert.equal(await page.locator("#board .square").count(),64);
  });
  await check("switch EN then AZ across Practice, Masters and Progress without restart",async()=>{
   await page.selectOption("#global-language","en");
   assert.equal(await page.locator('[data-i18n="fullReview"]').innerText(),"Full Game Review");
   await page.locator("#nav-masters").click();
   assert.equal(await page.locator("#m-lang").inputValue(),"en");
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-lang").inputValue(),"en");
   await page.selectOption("#global-language","az");
   assert.equal(await page.locator("#m-lang").inputValue(),"az");
   assert.equal(await page.locator("#progress-lang").inputValue(),"az");
   assert.equal(await page.locator('[data-i18n="moveLegend"]').innerText(),"Gediş qiymətləndirmələri nə deməkdir?");
   await page.locator("#nav-play").click();
  });
  await check("four tabs include offline-safe PvP board and 64 accessible squares",async()=>{
   assert.equal(await page.locator('.game-tabs [role="tab"]').count(),4);
   await page.locator("#nav-pvp").click();
   assert.equal(await page.locator("#pvp-view").isVisible(),true);
   assert.equal(await page.locator("#pvp-board .square").count(),64);
   assert.equal(await page.locator("#pvp-create").isVisible(),true);
   assert.equal(await page.locator("#pvp-resign").isDisabled(),true);
   assert.match(await page.locator("#pvp-game-status").textContent(),/daxil olun|Войдите|Sign in/i);
   await page.locator("#pvp-flip").click();
   assert.equal(await page.locator("#pvp-board button").first().getAttribute("data-square"),"h1");
   await page.locator("#pvp-flip").click();
   assert.equal(await page.locator("#pvp-board button").first().getAttribute("data-square"),"a8");
   await page.locator("#nav-progress").click();
   await page.locator("#nav-play").click();
  });
  await check("both setting menus start collapsed and are independent",async()=>{
   assert.equal(await page.locator("#board-theme-details").evaluate(x=>x.open),false);
   assert.equal(await page.locator("#piece-style-details").evaluate(x=>x.open),false);
   await page.locator("#board-theme-details summary").click();
   assert.equal(await page.locator("#theme-options button").count(),10);
   assert.equal(await page.locator("#piece-style-details").evaluate(x=>x.open),false);
  });
  await check("pick sea palette, collapses and applies to board and Masters",async()=>{
   await page.locator('#theme-options [data-value="sea"]').click();
   assert.equal(await page.locator("#board-theme-details").evaluate(x=>x.open),false);
   assert.equal(await page.locator("#board").getAttribute("data-theme"),"sea");
   await page.locator("#nav-masters").click();
   assert.equal(await page.locator("#m-board").getAttribute("data-theme"),"sea");
   await page.locator("#nav-play").click();
  });
  await check("10 real SVG styles, apply Golden Elite",async()=>{
   await page.locator("#piece-style-details summary").click();
   assert.equal(await page.locator("#piece-options button").count(),10);
   await page.locator('#piece-options [data-value="metal"]').click();
   assert.equal(await page.locator("#piece-style-details").evaluate(x=>x.open),false);
   assert.equal(await page.locator("#board").getAttribute("data-pieces"),"metal");
   assert.equal(await page.locator("#board .piece[data-code]").count(),32);
   assert.match(await page.locator("#board .piece[data-code=wN]").first().evaluate(x=>getComputedStyle(x).backgroundImage),/fantasy\/wN\.svg/);
  });
  await check("all ten real SVG piece sets load on Practice and Masters",async()=>{
   const variants=["staunton","tournament","neo","minimal","outline","wood","marble","metal","soft3d","highcontrast"];
   const inspect=()=>page.locator("#board .piece[data-code=wN]").first().evaluate(async el=>{
      const css=getComputedStyle(el).backgroundImage,match=css.match(/^url\(["']?(.*?)["']?\)$/);
      if(!match)return {loaded:false,css};
      return await new Promise(resolve=>{
       const picture=new Image();
       picture.onload=()=>resolve({loaded:true,width:picture.naturalWidth,src:match[1]});
       picture.onerror=()=>resolve({loaded:false,src:match[1]});
       picture.src=match[1];
      });
   });
   for(const id of variants){
      await page.locator("#piece-style-details > summary").click();
      await page.locator('#piece-options [data-value="'+id+'"]').click();
      const r=await inspect();
      assert.equal(r.loaded,true,id+": "+JSON.stringify(r));
      assert.ok(r.width>0,id+": invalid SVG dimensions");
   }
   await page.locator("#piece-style-details > summary").click();
   await page.locator('#piece-options [data-value="metal"]').click();
   await page.locator("#nav-masters").click();
   assert.equal(await page.locator("#m-board").getAttribute("data-pieces"),"metal");
   const sprite=await page.locator("#m-board .piece[data-code=wN]").first().evaluate(x=>getComputedStyle(x).backgroundImage);
   assert.match(sprite,/fantasy\/wN\.svg/);
   await page.locator("#nav-play").click();
  });
  await check("board and pieces persist after reload",async()=>{
   await page.reload();
   assert.equal(await page.locator("#board").getAttribute("data-theme"),"sea");
   assert.equal(await page.locator("#board").getAttribute("data-pieces"),"metal");
   assert.equal(await page.locator("#global-language").inputValue(),"az");
  });
  await check("fullscreen wide board is optional and does not mutate game",async()=>{
   const pgnBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")||"{}").pgn||"");
   await page.locator("#wide-view").click();
   assert.equal(await page.locator("#practice-view").evaluate(x=>x.classList.contains("wide-board-mode")),true);
   await page.locator("#wide-view").click();
   assert.equal(await page.locator("#practice-view").evaluate(x=>x.classList.contains("wide-board-mode")),false);
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")||"{}").pgn||""),pgnBefore);
  });
  await seed(page,["e4","e5","Nf3","Nc6"]);
  await check("clickable SAN history, 4 halfmoves, chronological board navigation",async()=>{
   assert.equal(await page.locator("#moves button").count(),4);
   assert.equal(await page.locator("#h-progress").innerText(),"4 / 4");
   await page.locator("#h-first").click();
   assert.equal(await page.locator("#h-progress").innerText(),"0 / 4");
   assert.match(await page.locator('#board [data-square="e2"]').getAttribute("aria-label"),/пешка|pawn|piyada/i);
   assert.equal(await page.locator("#undo").isDisabled(),true);
   await page.locator("#h-next").click();
   assert.equal(await page.locator("#h-progress").innerText(),"1 / 4");
   await page.locator('#moves button[data-ply="3"]').click();
   assert.equal(await page.locator("#h-progress").innerText(),"3 / 4");
   await page.locator("#h-last").click();
   assert.equal((await page.evaluate(()=>ChessOdysseyQA.ux())).cursor,null);
  });
  await check("replay never rewrites official PGN or game clock",async()=>{
   const before=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem("chess-odyssey-v01")).pgn,clock:ChessOdysseyQA.clock().clockState}));
   await page.locator("#h-prev").click();await page.locator("#h-first").click();
   const after=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem("chess-odyssey-v01")).pgn,clock:ChessOdysseyQA.clock().clockState}));
   assert.equal(after.p,before.p);assert.deepEqual(after.clock,before.clock);
   await page.locator("#h-return").click();
  });
  await check("full review collapsible and multilingual legend explains positive Brilliant",async()=>{
   assert.equal(await page.locator("#full-review-details").evaluate(x=>x.open),false);
   await page.locator("#full-review-details > summary").click();
   assert.equal(await page.locator("#move-legend").evaluate(x=>x.open),false);
   await page.locator("#move-legend summary").click();
   assert.equal(await page.locator("#move-legend-list div").count(),9);
   assert.match(await page.locator("#move-legend-list").innerText(),/Блестящ|Brilliant|Parlaq/);
   assert.equal(await page.locator("#review-entries button").count(),4);
  });
  await check("offline file HTML never invents engine accuracy",async()=>{
   await page.locator("#start-review").click();
   assert.match(await page.locator("#review-progress").innerText(),/tək HTML|одиночном HTML|standalone HTML/i);
   assert.equal(await page.locator("#review-summary .side-report").count(),0);
   assert.equal(await page.locator('#review-entries [data-tag="unknown"]').count(),4);
  });
  await check("actual standalone bundled HTML contains new features",async()=>{
   const standalone=await browser.newPage();
   await standalone.goto("file://"+path.resolve(root,"dist/ChessOdyssey_v0.9.0_PREVIEW.html"));
   await standalone.waitForFunction(()=>Boolean(window.ChessOdysseyQA?.ux));
   assert.equal(await standalone.locator("#global-language option").count(),3);
   assert.equal(await standalone.locator("#board .square").count(),64);
   await standalone.close();
  });
  await check("phone layout prevents sideways overflow",async()=>{
   await page.setViewportSize({width:390,height:844});
   const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.width+3,JSON.stringify(size));
  });
  await check("independent game blocks engine suggestions while still running",async()=>{
   await seed(page,["e4","e5"],"independent");
   await page.locator("#full-review-details > summary").click();
   assert.equal(await page.locator("#start-review").isDisabled(),true);
   assert.equal(await page.locator("#hint").isDisabled(),true);
  });
  await check("real Stockfish UCI postgame review on localhost, no mocked results",async()=>{
   server=await startServer();
   const online=await browser.newPage();
   const errors2=[];online.on("pageerror",e=>errors2.push(e.message));
   await online.goto("http://127.0.0.1:"+server.address().port+"/index.html");
   await online.waitForFunction(()=>Boolean(window.ChessOdysseyQA?.ux));
   await seed(online,["e4","e5"]);
   await online.locator("#full-review-details > summary").click();
   await online.locator("#start-review").click();
   await online.waitForFunction(()=>/завершён|complete|tamamlandı/.test(document.getElementById("review-progress").textContent),null,{timeout:75000});
   const report=await online.evaluate(()=>({ready:ChessOdysseyQA.ux().analysisReady,unknown:document.querySelectorAll('#review-entries [data-tag="unknown"]').length,summary:document.querySelectorAll("#review-summary .side-report").length}));
   assert.equal(report.ready,true,JSON.stringify(report));
   assert.equal(report.unknown,0,JSON.stringify(report));
   assert.equal(report.summary,2);
   assert.deepEqual(errors2,[]);
   await online.close();
  });
  await check("offline pages have no JS runtime exceptions",async()=>assert.deepEqual(errors,[]));
  console.log("PASS UX Chrome "+count+"/"+count);
 }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
