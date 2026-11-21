/* Chess Odyssey B6 real Chrome E2E: Academy, Masters and strictly gated AI index.
 * Deterministic terminal-game fixture uses true complete chess.js opening + final UI move.
 * This is NOT a claim that a long human-vs-bot tournament was performed.
 */
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1280,height:880}});
 const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
 const pathTo=f=>"file://"+path.resolve(__dirname,"../"+f);
 let n=0;
 const check=async(label,fn)=>{await fn();n++;console.log("PASS B6 browser "+label);};
 async function seedNearMate(id){
   await page.evaluate(id=>{
     const g=new Chess();
     for(const san of ["e4","e5","Bc4","Nc6","Qh5","Nf6"]){
       if(!g.move(san))throw Error("fixture must be legal: "+san);
     }
     if(g.game_over())throw Error("fixture should not be terminal");
     const key="chess-odyssey-v01";
     const previous=JSON.parse(localStorage.getItem(key)||"{}");
     localStorage.setItem(key,JSON.stringify({...previous,pgn:g.pgn(),side:"w",difficulty:"beginner",
       language:"ru",academy:null,notes:[],finalized:false,matchMode:"independent",
       matchSession:{id,mode:"independent",side:"w",level:"beginner",assisted:false,undone:false,restarted:false,fallback:false}}));
   },id);
   await page.reload();
   await page.waitForFunction("window.ChessOdysseyQA && window.ChessProgressQA");
   assert.equal(await page.locator("#match-mode").inputValue(),"independent");
 }
 try{
  await page.goto(pathTo("index.html"));
  await page.waitForFunction("window.ChessOdysseyQA && window.ChessMastersQA && window.ChessProgressQA");
  await check("B6 starts at zero, no fake index",async()=>{
   const x=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(x.academy.total,33);assert.equal(x.masters.total,31);
   assert.equal(x.masters.momentsTotal,116);assert.equal(x.reputation,0);
   assert.equal(x.rated.index,null);
  });
  await check("dedicated third tab visible and other tabs hidden",async()=>{
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-view").isVisible(),true);
   assert.equal(await page.locator("#practice-view").isVisible(),false);
   assert.equal(await page.locator("#masters-view").isVisible(),false);
   assert.equal(await page.locator("#progress-awards .progress-award").count(),16);
  });
  await check("Academy one completed exercise yields only 20 reputation points",async()=>{
   await page.locator("#nav-play").click();
   await page.selectOption("#lesson","pawn");
   await page.locator('#board button[aria-label^="e2 "]').click();
   await page.locator('#board button[aria-label^="e4 "]').click();
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-rep").innerText(),"20");
   assert.match(await page.locator("#progress-lessons").innerText(),/1 \/ 33/);
  });
  await check("opening progress retained after reload without fake awards",async()=>{
   await page.reload();
   await page.waitForFunction("window.ChessProgressQA && window.ChessOdysseyQA");
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-rep").innerText(),"20");
   const x=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(x.achievements.filter(a=>a.unlocked).length,1);
  });
  await check("source-verified B5 move visit adds exactly one unique item",async()=>{
   await page.evaluate(()=>window.ChessMastersQA.jump("opera-game",31));
   const x=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(x.masters.momentsVisited,1);
   assert.equal(x.reputation,24);
   await page.evaluate(()=>window.ChessMastersQA.jump("opera-game",31));
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.reputation),24);
  });
  await check("legal historical quiz records unique successful answer",async()=>{
   await page.evaluate(()=>window.ChessMastersQA.jump("opera-game",30));
   await page.locator("#m-quiz").click();
   assert.equal(await page.locator("#m-quiz-panel").isVisible(),true);
   await page.locator('#m-options button[data-san="Qb8+"]').click();
   const x=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(x.masters.quizzesSolved,1);
   assert.equal(x.masters.momentsVisited,1);
   assert.equal(x.reputation,36);
  });
  await check("master study completion requires all critical moments AND final ply",async()=>{
   for(const p of [5,19,33])await page.evaluate(x=>window.ChessMastersQA.jump("opera-game",x),p);
   const x=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(x.masters.momentsVisited,4);
   assert.equal(x.masters.studied,1);
   assert.equal(x.reputation,20+4*4+12+20);
  });
  await check("RU EN AZ achievement translations preserve counts and state",async()=>{
   await page.locator("#nav-progress").click();
   const c=await page.locator("#progress-rep").innerText();
   await page.selectOption("#progress-lang","en");
   assert.match(await page.locator("#progress-title").innerText(),/chess journey/i);
   assert.match(await page.locator("#progress-index-method").innerText(),/not a calibrated chess Elo/i);
   await page.selectOption("#progress-lang","az");
   assert.match(await page.locator("#progress-title").innerText(),/Şahmat/);
   assert.match(await page.locator("#progress-index-method").innerText(),/Elo/);
   assert.equal(await page.locator("#progress-rep").innerText(),c);
   await page.selectOption("#progress-lang","ru");
  });
  await check("coached practice remains default and index untouched",async()=>{
   await page.locator("#nav-play").click();
   await page.locator("#new-game").click();
   assert.equal(await page.locator("#match-mode").inputValue(),"practice");
   assert.equal(await page.locator("#hint").isEnabled(),true);
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),0);
  });
  await check("independent mode disables live help, review and Academy",async()=>{
   await page.selectOption("#match-mode","independent");
   assert.equal(await page.locator("#hint").isDisabled(),true);
   assert.equal(await page.locator("#review-button").isDisabled(),true);
   assert.equal(await page.locator("#lesson").isDisabled(),true);
   assert.equal(await page.locator("#undo").isDisabled(),true);
   assert.match(await page.locator("#match-integrity").innerText(),/Самостоятельн/);
  });
  await check("independent mode hides legal destination highlights",async()=>{
   await page.locator('#board button[aria-label^="e2 "]').click();
   assert.equal(await page.locator("#board .square.legal").count(),0);
   assert.equal(await page.locator("#coach-variations").isVisible(),false);
  });
  await check("independent match identity survives reload with restrictions",async()=>{
   const id=await page.evaluate(()=>window.ChessOdysseyQA.match().session.id);
   await page.reload();await page.waitForFunction("window.ChessOdysseyQA && window.ChessProgressQA");
   const restored=await page.evaluate(()=>window.ChessOdysseyQA.match());
   assert.equal(restored.mode,"independent");
   assert.equal(restored.session.id,id);
   assert.equal(await page.locator("#hint").isDisabled(),true);
  });
  await check("switch to practice starts separate game, no rating retroactive",async()=>{
   await page.selectOption("#match-mode","practice");
   assert.equal(await page.evaluate(()=>window.ChessOdysseyQA.match().mode),"practice");
   assert.equal(await page.locator("#hint").isEnabled(),true);
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),0);
  });
  await check("terminal game fixture: chess.js validates six real moves then actual UI Qxf7# wins",async()=>{
   await seedNearMate("g-browser-proof-1");
   await page.locator('#board button[aria-label^="h5 "]').click();
   await page.locator('#board button[aria-label^="f7 "]').click();
   assert.match(await page.locator("#game-status").innerText(),/Мат/);
   const x=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(x.rated.eligible,1);assert.equal(x.rated.win,1);
   assert.equal(x.rated.index,null);
  });
  await check("rated terminal game cannot be undone after score recorded",async()=>{
   assert.equal(await page.locator("#undo").isDisabled(),true);
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),1);
  });
  await check("reload terminal independent match never double-counts",async()=>{
   await page.reload();await page.waitForFunction("window.ChessProgressQA && window.ChessOdysseyQA");
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),1);
  });
  await check("five distinct eligible terminal UI games unlock only provisional local index",async()=>{
   for(let i=2;i<=5;i++){
     await seedNearMate("g-browser-proof-"+i);
     await page.locator('#board button[aria-label^="h5 "]').click();
     await page.locator('#board button[aria-label^="f7 "]').click();
   }
   const r=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated);
   assert.equal(r.eligible,5);assert.equal(r.index,17);
   assert.equal(r.provisional,true);assert.equal(r.period,5);
  });
  await check("Progress panel shows transparent AI index, not FIDE or online Elo",async()=>{
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-index").innerText(),"17 / 100");
   assert.match(await page.locator("#progress-index-method").innerText(),/не Elo/);
   assert.match(await page.locator("#progress-index-method").innerText(),/последние 20/);
   assert.match(await page.locator("#progress-results").innerText(),/5/);
  });
  await check("one duplicated terminal match ID cannot mint second score",async()=>{
   await seedNearMate("g-browser-proof-5");
   await page.locator('#board button[aria-label^="h5 "]').click();
   await page.locator('#board button[aria-label^="f7 "]').click();
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),5);
  });
  await check("browser rejects forged independent result and incomplete PGN",async()=>{
   const bad=await page.evaluate(()=>{
     const base={id:"g-invalid-ui",mode:"independent",level:"beginner",side:"w",result:"win",engine:"local",
       assisted:false,undone:false,restarted:false,fallback:false,pgn:"1. e4",date:"2026-11-21"};
     return window.ChessProgress.recordGame(base);
   });
   assert.equal(bad.accepted,false);
   assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),5);
  });
  await check("local HTML higher-level Stockfish fallback is never rated",async()=>{
   await page.selectOption("#level","expert");
   assert.equal(await page.evaluate(()=>window.ChessOdysseyQA.match().session.fallback),true);
   assert.match(await page.locator("#match-integrity").innerText(),/не включён/i);
  });
  await check("progress metrics persist after reloading and never overwrite practice PGN",async()=>{
   const snapshot=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   await page.reload();await page.waitForFunction("window.ChessProgressQA && window.ChessOdysseyQA");
   const after=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary);
   assert.equal(after.reputation,snapshot.reputation);
   assert.equal(after.rated.eligible,snapshot.rated.eligible);
   assert.equal(after.masters.studied,snapshot.masters.studied);
  });
  await check("versioned one-file offline v0.6.0 contains all B0-B6 engines and progress",async()=>{
   await page.goto(pathTo("dist/ChessOdyssey_v0.6.0_PREVIEW.html"));
   await page.waitForFunction("window.ChessOdysseyQA && window.ChessMastersQA && window.ChessProgressQA");
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-index").innerText(),"17 / 100");
   assert.equal(await page.locator("#progress-awards .progress-award").count(),16);
  });
  await check("real mobile 390px layout has no horizontal overflow",async()=>{
   await page.setViewportSize({width:390,height:844});
   const width=await page.evaluate(()=>({w:window.innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(width.scroll<=width.w+2,JSON.stringify(width));
   assert.equal(await page.locator("#progress-view").isVisible(),true);
  });
  await check("no JavaScript runtime errors across three tabs",async()=>assert.deepEqual(errors,[]));
  console.log("PASS B6 Player Progress real Chrome "+n+" / "+n);
 }finally{await browser.close();}
})().catch(e=>{console.error("FAIL B6 Progress browser",e);process.exitCode=1;});
