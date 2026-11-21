/* B8 real Chromium acceptance: clock lifecycle and localization, no mocked chess moves. */
"use strict";
const {chromium}=require("playwright"),assert=require("node:assert/strict"),path=require("node:path");
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:1280,height:860}});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 let checks=0;const check=async(name,fn)=>{await fn();checks++;console.log("PASS B8 browser "+checks+" "+name);};
 try{
   await page.clock.install({time:new Date("2026-11-21T12:00:00.000Z")});
   await page.goto("file://"+path.resolve(__dirname,"../index.html"));
   await page.waitForFunction(()=>Boolean(window.ChessOdysseyQA?.clock));
   await check("untimed is default and does not show clocks",async()=>{
     assert.equal(await page.locator("#time-control").inputValue(),"none");
     assert.equal(await page.locator("#clock-panel").isVisible(),false);
   });
   await check("select 15+10 starts two real clocks",async()=>{
     await page.selectOption("#time-control","rapid1510");
     assert.equal(await page.locator("#clock-panel").isVisible(),true);
     assert.equal(await page.locator("#clock-white-time").innerText(),"15:00");
     assert.equal((await page.evaluate(()=>ChessOdysseyQA.clock().clockState)).incrementMs,10000);
   });
   await check("white clock runs with elapsed time before move",async()=>{
     await page.clock.fastForward(20000);
     const state=await page.evaluate(()=>ChessOdysseyQA.clock().clockState);
     assert.equal(state.remaining.w,880000);assert.equal(state.remaining.b,900000);
   });
   await check("move adds exactly ten seconds, switches running side",async()=>{
     await page.locator("#board [data-square=e2]").click();
     await page.locator("#board [data-square=e4]").click();
     const state=await page.evaluate(()=>ChessOdysseyQA.clock().clockState);
     assert.equal(state.remaining.w,890000);assert.equal(state.active,"b");
     assert.match(await page.locator("#moves").innerText(),/e4/);
   });
   await check("hourglass is visual-only and numeric time stays visible",async()=>{
     await page.selectOption("#clock-style","hourglass");
     assert.equal(await page.locator("#clock-panel").evaluate(e=>e.classList.contains("hourglass-mode")),true);
     assert.match(await page.locator("#clock-black-time").innerText(),/\\d{2}:\\d{2}/);
   });
   await check("time and skin survive reload",async()=>{
     await page.reload();
     assert.equal(await page.locator("#time-control").inputValue(),"rapid1510");
     assert.equal(await page.locator("#clock-style").inputValue(),"hourglass");
     assert.match(await page.locator("#moves").innerText(),/e4/);
   });
   await check("localized clock labels for EN and AZ",async()=>{
     await page.selectOption("#lang","en");
     assert.equal(await page.locator('[data-i18n="timeControl"]').innerText(),"Time control");
     await page.selectOption("#lang","az");
     assert.equal(await page.locator('[data-i18n="timeControl"]').innerText(),"Vaxt nəzarəti");
   });
   await check("rematch resets both clocks and position",async()=>{
     await page.locator("#rematch").click();
     assert.equal(await page.locator("#clock-white-time").innerText(),"15:00");
     assert.equal(await page.locator("#moves").innerText(),"—");
   });
   await check("resignation terminates game once, no fake AI index",async()=>{
     page.once("dialog",dialog=>dialog.accept());
     await page.locator("#resign").click();
     assert.equal((await page.evaluate(()=>ChessOdysseyQA.clock())).endedBy.type,"resign");
     assert.equal((await page.evaluate(()=>ChessOdysseyQA.clock())).clockState.done,true);
     assert.equal(await page.locator("#resign").isDisabled(),true);
   });
   await check("bullet timeout awards loss and survives reload",async()=>{
     await page.selectOption("#side","w");
     await page.selectOption("#time-control","bullet1");
     await page.clock.fastForward(61000);
     const snapshot=await page.evaluate(()=>ChessOdysseyQA.clock());
     assert.equal(snapshot.endedBy.type,"timeout");
     assert.equal(snapshot.endedBy.loser,"w");
     assert.equal(snapshot.clockState.remaining.w,0);
     await page.reload();
     assert.equal((await page.evaluate(()=>ChessOdysseyQA.clock())).endedBy.type,"timeout");
   });
   await check("all B8 browser actions produce no JS errors",async()=>assert.deepEqual(errors,[]));
   console.log("PASS B8 browser "+checks+"/"+checks);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
