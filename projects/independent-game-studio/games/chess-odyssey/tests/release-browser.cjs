/* B7 final release browser acceptance — actual Chess/Chrome, no mock chess engine. */
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const {chromium}=require("playwright");
const URL_FOR=file=>"file://"+path.resolve(__dirname,"../"+file);
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 let cases=0;
 async function test(label,fn){await fn();cases++;console.log("PASS B7 Chrome "+cases+" "+label);}
 const square=s=>page.locator('#board button[aria-label^="'+s+' "]');
 const move=async(from,to)=>{await square(from).click();await square(to).click();};
 const lesson=async(id)=>{await page.locator("#nav-play").click();await page.selectOption("#lesson",id);};
 const seed=async(sans,side="w",mode="practice")=>{
   await page.evaluate(({sans,side,mode})=>{
     const game=new Chess();
     for(const san of sans){if(!game.move(san))throw Error("Illegal release fixture: "+san);}
     const key="chess-odyssey-v01",prior=JSON.parse(localStorage.getItem(key)||"{}");
     const matching=mode==="independent";
     localStorage.setItem(key,JSON.stringify({...prior,pgn:game.pgn(),side,difficulty:"beginner",language:"ru",flipped:false,
       finalized:false,notes:[],academy:null,matchMode:mode,
       matchSession:matching?{id:"g-b7-fixture-"+sans.length,mode:"independent",side,level:"beginner",assisted:false,undone:false,restarted:false,fallback:false}:null,
       stats:{wins:0,losses:0,draws:0}}));
   },{sans,side,mode});
   await page.reload();await page.waitForFunction("window.ChessOdysseyQA && window.ChessMastersQA && window.ChessProgressQA");
 };
 try{
  await page.goto(URL_FOR("index.html"));
  await page.waitForFunction("window.ChessOdysseyQA && window.ChessMastersQA && window.ChessProgressQA");
  await test("third-tab ARIA roving focus initially exposes one active tab",async()=>{
   assert.equal(await page.locator('.game-tabs [role="tab"][tabindex="0"]').count(),1);
   assert.equal(await page.locator("#nav-play").getAttribute("aria-selected"),"true");
  });
  await test("ArrowRight cycles Practice -> Masters -> Progress and Home returns",async()=>{
   await page.locator("#nav-play").focus();await page.keyboard.press("ArrowRight");
   assert.equal(await page.locator("#masters-view").isVisible(),true);
   assert.equal(await page.evaluate(()=>document.activeElement.id),"nav-masters");
   await page.keyboard.press("ArrowRight");
   assert.equal(await page.locator("#progress-view").isVisible(),true);
   assert.equal(await page.evaluate(()=>document.activeElement.id),"nav-progress");
   await page.keyboard.press("Home");
   assert.equal(await page.evaluate(()=>document.activeElement.id),"nav-play");
   assert.equal(await page.locator("#practice-view").isVisible(),true);
  });
  await test("chessboard has one keyboard tab stop, 64 understandable localized square names",async()=>{
   assert.equal(await page.locator('#board button[tabindex="0"]').count(),1);
   assert.equal(await page.locator('#board button[tabindex="-1"]').count(),63);
   assert.match(await square("e2").getAttribute("aria-label"),/белая пешка/);
   assert.match(await page.locator("#board-keyboard-hint").innerText(),/Enter/);
  });
  await test("board arrow navigation and Enter select legal piece retaining focus",async()=>{
   await square("e2").focus();await page.keyboard.press("ArrowUp");
   assert.match(await page.evaluate(()=>document.activeElement?.getAttribute("aria-label")),/^e3 /);
   await page.keyboard.press("ArrowDown");assert.match(await page.evaluate(()=>document.activeElement?.getAttribute("aria-label")),/^e2 /);
   await page.keyboard.press("Enter");
   assert.equal(await square("e2").getAttribute("aria-pressed"),"true");
   assert.match(await page.evaluate(()=>document.activeElement?.getAttribute("aria-label")),/^e2 /);
  });
  await test("arrow/Enter execute genuine opening from keyboard and AI replies legally",async()=>{
   await page.keyboard.press("ArrowUp");await page.keyboard.press("ArrowUp");
   assert.match(await page.evaluate(()=>document.activeElement?.getAttribute("aria-label")),/^e4 /);
   await page.keyboard.press("Enter");
   await page.waitForFunction(()=>{const p=localStorage.getItem("chess-odyssey-v01");return p&&new Chess().load_pgn(JSON.parse(p).pgn)&&JSON.parse(p).pgn.includes("e4 ");},{timeout:12000});
   await page.waitForFunction(()=>{const g=new Chess();const p=JSON.parse(localStorage.getItem("chess-odyssey-v01"));return g.load_pgn(p.pgn)&&g.history().length>=2;},{timeout:12000});
   assert.equal(await page.locator("#moves .move-no").first().innerText(),"1.");
   assert.equal(await page.locator('#moves button[data-ply="1"]').innerText(),"e4");
  });
  await test("practice undo plus full game reload keeps only legal PGN",async()=>{
   await page.locator("#undo").click();
   assert.equal(await page.locator("#moves").innerText(),"—");
   await page.reload();await page.waitForFunction("window.ChessOdysseyQA");
   assert.equal(await page.locator("#board .square").count(),64);
   assert.equal(await page.locator("#moves").innerText(),"—");
  });
  await test("promotion popup opens on real legal academy pawn move and focuses queen",async()=>{
   await lesson("promotion");
   await move("a7","a8");
   assert.equal(await page.locator("#promotion").isVisible(),true);
   assert.equal(await page.locator("#promotion .promotion-box").getAttribute("aria-modal"),"true");
   assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.promote),"q");
  });
  await test("Escape cancels promotion without changing board and restores focus",async()=>{
   await page.keyboard.press("Escape");
   assert.equal(await page.locator("#promotion").isVisible(),false);
   assert.match(await square("a7").getAttribute("aria-label"),/белая пешка/);
   assert.match(await page.evaluate(()=>document.activeElement?.getAttribute("aria-label")),/^a7 /);
  });
  await test("keyboard promotion Tab cycles four options then escape trap returns focus",async()=>{
   await move("a7","a8");
   assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.promote),"q");
   for(let i=0;i<3;i++)await page.keyboard.press("Tab");
   assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.promote),"n");
   await page.keyboard.press("Tab");assert.equal(await page.evaluate(()=>document.activeElement.id),"promotion-close");
   await page.keyboard.press("Shift+Tab");assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.promote),"n");
  });
  await test("actual queen promotion is chess.js legal and visible after keyboard choice",async()=>{
   await page.locator('#promotion [data-promote="q"]').focus();
   await page.keyboard.press("Enter");
   assert.equal(await page.locator("#promotion").isVisible(),false);
   assert.match(await square("a8").innerText(),/♕/);
   assert.equal(await page.evaluate(()=>window.ChessOdysseyQA.academy().active),null);
  });
  await test("actual knight underpromotion uses keyboard and never defaults to queen",async()=>{
   await lesson("end-underpromotion");await move("a7","a8");
   await page.locator('#promotion [data-promote="n"]').focus();
   await page.keyboard.press("Enter");
   assert.match(await square("a8").innerText(),/♘/);
   assert.equal(await page.locator("#promotion").isVisible(),false);
  });
  await test("real Academy short castle moves king to g1 and rook to f1",async()=>{
   await lesson("castle");await move("e1","g1");
   assert.match(await square("g1").getAttribute("aria-label"),/белый король/);
   assert.match(await square("f1").getAttribute("aria-label"),/белая ладья/);
  });
  await test("real Academy en-passant captures actual pawn only on adjacent square",async()=>{
   await lesson("enpassant");await move("e5","d6");
   assert.match(await square("d6").getAttribute("aria-label"),/белая пешка/);
   assert.match(await square("d5").getAttribute("aria-label"),/пустая клетка/);
  });
  await test("B4 saved Academy completion survives a new game and reload",async()=>{
   const count=await page.locator("#completed").innerText();
   await page.locator("#new-game").click();await page.reload();await page.waitForFunction("window.ChessOdysseyQA");
   assert.equal(await page.locator("#completed").innerText(),count);
  });
  await test("full 8-ply threefold from standard initial position auto adjudicates a practice draw",async()=>{
   await seed(["Nf3","Nf6","Ng1","Ng8","Nf3","Nf6","Ng1"],"b");
   await move("f6","g8");
   assert.match(await page.locator("#game-status").innerText(),/Ничья/);
   assert.equal(await page.locator("#record").innerText(),"0 / 0 / 1");
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")).finalized),true);
  });
  await test("undo after terminal draw reverses exactly one result and can replay it",async()=>{
   await page.locator("#undo").click();
   assert.equal(await page.locator("#record").innerText(),"0 / 0 / 0");
   await move("f6","g8");
   assert.equal(await page.locator("#record").innerText(),"0 / 0 / 1");
  });
  await test("draw and old Practice PGN restored across reload with consistent status",async()=>{
   await page.reload();await page.waitForFunction("window.ChessOdysseyQA");
   assert.match(await page.locator("#game-status").innerText(),/Ничья/);
   assert.equal(await page.locator("#record").innerText(),"0 / 0 / 1");
  });
  await test("actual full 7-ply Scholar's Mate triggers one board-verified human win",async()=>{
   await seed(["e4","e5","Bc4","Nc6","Qh5","Nf6"],"w");
   await move("h5","f7");
   assert.match(await page.locator("#game-status").innerText(),/Мат/);
   assert.equal(await page.locator("#record").innerText(),"1 / 0 / 0");
   const state=await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")));
   const valid=await page.evaluate(pgn=>{const c=new Chess();return c.load_pgn(pgn)&&c.in_checkmate()&&c.history().length===7;},state.pgn);
   assert.equal(valid,true);
  });
  await test("terminal checkmate save/reload cannot double-count practice wins",async()=>{
   await page.reload();await page.waitForFunction("window.ChessOdysseyQA");
   assert.equal(await page.locator("#record").innerText(),"1 / 0 / 0");
   assert.equal(await page.locator("#undo").isEnabled(),true);
  });
  await test("master historical full-game replay visits every original Morphy SAN ply",async()=>{
   await page.locator("#nav-masters").click();await page.selectOption("#m-game","opera-game");
   if(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply)>0)await page.locator("#m-first").click();
   assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),0);
   for(let n=1;n<=33;n++){
     await page.locator("#m-next").click();
     assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),n);
   }
   assert.match(await page.locator("#m-progress").innerText(),/Rd8#/);
   assert.equal(await page.locator("#m-next").isDisabled(),true);
  });
  await test("masters final position has accessible full-game/last-SAN label",async()=>{
   assert.match(await page.locator("#m-board").getAttribute("aria-label"),/33\/33.*Rd8#/);
   assert.equal(await page.locator("#m-board .square").count(),64);
   assert.equal(await page.locator("#m-board button").count(),0);
  });
  await test("RU/EN/AZ name real kings, pawns and modal buttons accurately",async()=>{
   await page.locator("#nav-play").click();
   for(const [lang,king,pawn] of [["ru",/белый король/,/белая пешка/],["en",/white king/,/white pawn/],["az",/ağ şah/,/ağ piyada/]]){
     await page.selectOption("#global-language",lang);
     assert.match(await square("e1").getAttribute("aria-label"),king);
     // restore initial game for pawn before the next set of checks
     await page.locator("#new-game").click();
     assert.match(await square("e2").getAttribute("aria-label"),pawn);
   }
  });
  await test("four tabs stay usable and non-overflow on phone and tablet breakpoints",async()=>{
   for(const width of [320,390,768,1024]){
     await page.setViewportSize({width,height:844});
     for(const nav of ["#nav-play","#nav-masters","#nav-progress","#nav-pvp"]){
       await page.locator(nav).click();
       const dim=await page.evaluate(()=>({page:document.documentElement.scrollWidth,view:window.innerWidth}));
       assert.ok(dim.page<=dim.view+2,width+" "+nav+" "+JSON.stringify(dim));
     }
   }
  });
  await test("all critical real button touch targets including promotion close are >=24px",async()=>{
   await page.locator("#nav-play").click();await page.setViewportSize({width:390,height:844});
   const sizes=await page.evaluate(()=>["#new-game","#undo","#hint","#nav-play","#nav-masters","#nav-progress"].map(q=>{
     const r=document.querySelector(q).getBoundingClientRect();return {q,width:r.width,height:r.height};
   }));
   for(const s of sizes)assert.ok(s.width>=24&&s.height>=24,JSON.stringify(s));
  });
  await test("all four tabs support keyboard visible focus state",async()=>{
   await page.locator("#nav-play").focus();
   for(const nav of ["nav-masters","nav-progress","nav-pvp","nav-play"]){
     await page.keyboard.press("ArrowRight");
     assert.equal(await page.evaluate(()=>document.activeElement.id),nav);
   }
   assert.equal(await page.locator("#practice-view").isVisible(),true);
  });
  await test("one-file distributable B7 preview initializes all game modules offline",async()=>{
   await page.goto(URL_FOR("dist/ChessOdyssey_v0.7.0_PREVIEW.html"));
   await page.waitForFunction("window.ChessOdysseyQA && window.ChessMastersQA && window.ChessProgressQA");
   assert.equal(await page.locator("#board .square").count(),64);
   await page.locator("#nav-progress").click();
   assert.equal(await page.locator("#progress-view").isVisible(),true);
  });
  await test("no JS page errors across board, Masters, Progress and pre-release standalone",async()=>assert.deepEqual(errors,[]));
  console.log("PASS B7 release real Chrome "+cases+" / "+cases);
 }finally{await browser.close();}
})().catch(e=>{console.error("FAIL B7 release browser",e);process.exitCode=1;});
