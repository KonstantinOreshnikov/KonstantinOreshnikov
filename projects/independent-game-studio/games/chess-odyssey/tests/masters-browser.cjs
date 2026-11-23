/* Real browser acceptance of B5 Masters & Legends, independent of practice.
 * No mocked chess history or engine; actual full 31-game replay and UI events.
 */
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const fs=require("node:fs");
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1280,height:830},acceptDownloads:true});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 const pathTo=(name)=>"file://"+path.resolve(__dirname,"../"+name);
 let total=0;
 try{
  await page.goto(pathTo("index.html"));
  await page.waitForFunction("window.ChessMastersQA && window.ChessMastersQA.compile().ok");
  const stats=await page.evaluate(()=>window.ChessMastersQA.compile());
  assert.deepEqual(stats,{games:31,plies:1923,moments:116,checkmates:6,ok:true});total++;
  assert.equal(await page.locator("#masters-view").isVisible(),false);
  assert.equal(await page.locator("#practice-view #board .square").count(),64);total++;
  await page.locator("#nav-masters").click();
  assert.equal(await page.locator("#masters-view").isVisible(),true);
  assert.equal(await page.locator("#practice-view").isVisible(),false);
  assert.equal(await page.locator("#m-board .square").count(),64);
  assert.equal(await page.locator("#m-game option").count(),31);total++;
  assert.match(await page.locator("#m-meta").innerText(),/Paul Morphy/);
  assert.match(await page.locator("#m-source").getAttribute("href"),/opera-game/);total++;
  await page.locator("#m-next").click();
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),1);
  assert.match(await page.locator("#m-progress").innerText(),/e4/);total++;
  await page.locator("#m-last").click();
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),33);
  assert.match(await page.locator("#m-progress").innerText(),/Rd8#/);
  assert.match(await page.locator("#m-explain").innerText(),/мат/i);total++;
  await page.locator("#m-first").click();
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),0);total++;
  // A chosen historical move is reflected in the board and move list.
  await page.locator("#m-moves button[data-ply='31']").click();
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),31);
  assert.match(await page.locator("#m-moves button.current").innerText(),/Qb8\+/);total++;
  await page.locator("#m-bookmark").click();
  assert.equal(await page.locator("#m-bookmark").getAttribute("aria-pressed"),"true");
  assert.equal(await page.locator("#m-bookmarks button").count(),1);total++;
  await page.reload();
  await page.waitForFunction("window.ChessMastersQA && window.ChessMastersQA.compile().ok");
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().id),"opera-game");
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),31);
  assert.equal(await page.locator("#m-bookmarks button").count(),1);
  assert.equal(await page.locator("#practice-view").isVisible(),true);total++;
  await page.locator("#nav-masters").click();
  await page.locator("#m-first").click();
  // Select 16.Qb8+ as correct move; all distractors should be chess.js legal.
  await page.evaluate(()=>window.ChessMastersQA.jump("opera-game",30));
  await page.locator("#m-quiz").click();
  assert.equal(await page.locator("#m-quiz-panel").isVisible(),true);
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),30);
  const options=await page.locator("#m-options button").allTextContents();
  assert.ok(options.includes("Qb8+"));assert.equal(new Set(options).size,options.length);
  total++;
  const wrong=options.find(x=>x!=="Qb8+");
  if(wrong){
   await page.locator('#m-options button[data-san="'+wrong+'"]').click();
   assert.match(await page.locator("#m-feedback").innerText(),/допустим|легальн|законн/i);
   assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),30);total++;
  }
  await page.locator('#m-options button[data-san="Qb8+"]').click();
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),31);
  assert.equal(await page.locator("#m-quiz-panel").isVisible(),false);
  assert.match(await page.locator("#m-explain").innerText(),/Верно/);total++;
  await page.selectOption("#global-language","en");
  assert.match(await page.locator("#m-explain").innerText(),/Yes|queen|capture|forced/i);
  assert.match(await page.locator("#nav-masters").innerText(),/Masters/);total++;
  await page.selectOption("#global-language","az");
  assert.match(await page.locator("#nav-masters").innerText(),/Ustadlar/);
  assert.match(await page.locator("#m-explain").innerText(),/Vəzir|vəziri|atın/i);total++;
  await page.selectOption("#global-language","ru");
  assert.match(await page.locator("#nav-masters").innerText(),/Мастера/);total++;
  await page.locator("#m-search").fill("Carlsen");
  assert.ok((await page.locator("#m-game option").count())>=1);
  assert.match(await page.locator("#m-game").inputValue(),/carlsen/i);total++;
  await page.locator("#m-search").fill("");
  await page.selectOption("#m-filter","machine");
  assert.equal(await page.locator("#m-game option").count(),1);
  assert.equal(await page.locator("#m-game").inputValue(),"deep-blue-kasparov-1997");total++;
  await page.selectOption("#m-filter","all");
  await page.selectOption("#m-game","immortal-game");
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().id),"immortal-game");
  assert.match(await page.locator("#m-title").innerText(),/Бессмертная/);total++;
  // Actual exported full PGN must have complete numbered history and source.
  const [download]=await Promise.all([page.waitForEvent("download"),page.locator("#m-download").click()]);
  assert.equal(download.suggestedFilename(),"immortal-game.pgn");
  const exported=fs.readFileSync(await download.path(),"utf8");
  assert.match(exported,/23\. Be7#/);
  assert.match(exported,/\[Source "https:\/\/chessgator\.com\/games\/immortal-game"\]/);
  assert.match(exported,/\[Result "1-0"\]/);total++;
  // First is correctly disabled at ply 0; test the back-to-first operation from ply 1.
  await page.locator("#m-next").click();
  await page.locator("#m-first").click();
  await page.locator("#m-flip").check();
  assert.equal(await page.locator("#m-board .square").first().getAttribute("aria-label").then(x=>x.slice(0,2)),"h1");total++;
  await page.locator("#m-next").focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.evaluate(()=>window.ChessMastersQA.snapshot().ply),1);total++;
  // Practice remains independent and retains played PGN on return.
  await page.locator("#nav-play").click();
  await page.selectOption("#side","w");await page.locator("#new-game").click();
  await page.locator('#board button[aria-label^="e2 "]').click();
  await page.locator('#board button[aria-label^="e4 "]').click();
  assert.match(await page.locator("#moves").innerText(),/e4/);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")).pgn);
  await page.locator("#nav-masters").click();
  await page.locator("#m-next").click();
  await page.locator("#nav-play").click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")).pgn),saved);total++;
  // A real, working single-file release includes all offline master games.
  await page.goto(pathTo("dist/ChessOdyssey_v0.5.0_PREVIEW.html"));
  await page.waitForFunction("window.ChessMastersQA && window.ChessMastersQA.compile().games===31");
  await page.locator("#nav-masters").click();
  assert.equal(await page.locator("#m-game option").count(),31);total++;
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.locator("#m-board .square").count(),64);
  const scroll=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  assert.equal(scroll,false);total++;
  assert.deepEqual(errors,[]);total++;
  console.log("PASS B5 Masters real browser "+total+" / "+total);
 }finally{await browser.close();}
})().catch(e=>{console.error("FAIL B5 Masters browser",e);process.exitCode=1;});
