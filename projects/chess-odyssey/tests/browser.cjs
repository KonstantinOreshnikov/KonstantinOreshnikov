/* Browser E2E for Chess Odyssey — uses real Chromium, no mocked chess logic. */
"use strict";
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const path=require("node:path");
(async()=>{
  const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const url="file://"+path.resolve(__dirname,"../index.html");
  let cases=0;
  try{
    await page.goto(url);
    await page.waitForFunction("window.ChessOdysseyQA && document.querySelectorAll('#board .square').length===64");
    assert.equal(await page.locator("#board .piece").filter({hasText:/[♔-♟]/}).count(),32);cases++;
    await page.locator('button[aria-label^="e2 "]').click();
    assert.ok(await page.locator("#board .square.legal").count()>=2);
    await page.locator('button[aria-label^="e4 "]').click();
    await page.waitForFunction("document.getElementById('moves').textContent.trim().split(' ').length>=3",{timeout:12000});
    assert.match(await page.locator("#moves").innerText(),/1\. e4/);cases++;
    await page.reload();
    await page.waitForFunction("document.getElementById('moves').textContent.includes('e4')");
    assert.match(await page.locator("#moves").innerText(),/e4/);cases++;
    await page.locator("#undo").click();
    assert.equal(await page.locator("#moves").innerText(),"—");cases++;
    await page.selectOption("#lesson","pawn");
    await page.locator('button[aria-label^="e2 "]').click();
    await page.locator('button[aria-label^="e4 "]').click();
    assert.equal(await page.locator("#completed").innerText(),"1/3");cases++;
    await page.selectOption("#lang","az");
    assert.match(await page.locator(".academy-panel h2").innerText(),/Akademiya/);cases++;
    await page.selectOption("#lang","en");
    assert.match(await page.locator(".board-controls #new-game").innerText(),/New game/);cases++;
    await page.locator("#new-game").click();
    await page.selectOption("#side","b");
    await page.waitForFunction("document.getElementById('moves').textContent.includes('1.')",{timeout:12000});
    assert.equal(await page.locator("#board .square").count(),64);cases++;
    assert.deepEqual(errors,[]);cases++;
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.locator("#board .square").count(),64);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    assert.equal(overflow,false);cases++;
    // Validate the distributed standalone HTML in a real browser.
    await page.goto("file://"+path.resolve(__dirname,"../dist/ChessOdyssey_v0.1.1_PREVIEW.html"));
    await page.waitForFunction("window.ChessOdysseyQA && document.querySelectorAll('#board .square').length===64");
    assert.equal(await page.locator("#board .square").count(),64);cases++;
    await page.selectOption("#side","w");
    await page.locator("#new-game").click();
    await page.locator('button[aria-label^="e2 "]').click();
    await page.locator('button[aria-label^="e4 "]').click();
    assert.match(await page.locator("#moves").innerText(),/e4/);cases++;
    console.log("PASS browser E2E "+cases+" / "+cases);
  }finally{await browser.close();}
})().catch(e=>{console.error("FAIL browser E2E",e);process.exitCode=1;});