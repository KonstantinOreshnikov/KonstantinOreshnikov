/* B9 genuine two-context synthetic browser test; NO real Neon sign-in. */
"use strict";
const {chromium}=require("playwright"),assert=require("node:assert/strict");
process.env.CHESS_ODYSSEY_PVP_DEV="1";
const {createDemoServer}=require("../pvp/dev-server.cjs");
(async()=>{
 const server=createDemoServer();
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const base="http://127.0.0.1:"+server.address().port;
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const aliceContext=await browser.newContext({viewport:{width:1300,height:850}});
 const bobContext=await browser.newContext({viewport:{width:390,height:844}});
 const alice=await aliceContext.newPage(),bob=await bobContext.newPage(),errors=[];
 alice.on("pageerror",e=>errors.push("alice "+e.message));
 bob.on("pageerror",e=>errors.push("bob "+e.message));
 let tests=0;const check=async(name,fn)=>{await fn();tests++;console.log("PASS B9 dual Chrome "+tests+" "+name);};
 try{
   await alice.goto(base+"/demo?user=alice");await bob.goto(base+"/demo?user=bob");
   await check("two genuinely separate browser sessions",async()=>{
     assert.equal(await alice.locator("#identity").inputValue(),"alice");
     assert.equal(await bob.locator("#identity").inputValue(),"bob");
     await alice.evaluate(()=>sessionStorage.setItem("qa-context-isolation","alice"));
     assert.equal(await bob.evaluate(()=>sessionStorage.getItem("qa-context-isolation")),null);
     assert.equal(await alice.evaluate(()=>sessionStorage.getItem("qa-context-isolation")),"alice");
   });
   await check("Alice creates private invite",async()=>{
     await alice.selectOption("#opponent","bob");
     await alice.selectOption("#preset","rapid1510");
     await alice.locator("#invite").click();
     await alice.waitForFunction(()=>document.getElementById("notice").textContent.includes("Invite created"));
   });
   await check("Bob can accept in separate context",async()=>{
     await bob.locator("#refresh").click();
     await bob.locator("#invitations button").first().waitFor({timeout:10000});
     await bob.locator("#invitations button").first().click();
     await bob.waitForFunction(()=>window.ChessPvPDevQA.get()?.playerColor==="b",{timeout:15000});
     assert.equal(await bob.locator("#board .square").count(),64);
   });
   await check("Alice sees match from Bob acceptance",async()=>{
     await alice.locator("#refresh").click();
     await alice.locator("#matches button").first().click();
     await alice.waitForFunction(()=>window.ChessPvPDevQA.get()?.playerColor==="w");
   });
   await check("Alice plays legal e4; Bob receives it",async()=>{
     await alice.locator("#board [data-square=e2]").click();
     await alice.locator("#board [data-square=e4]").click();
     await alice.waitForFunction(()=>window.ChessPvPDevQA.get()?.lastMove==="e4");
     await bob.waitForFunction(()=>window.ChessPvPDevQA.get()?.lastMove==="e4",{timeout:15000});
     assert.match(await bob.locator("#pgn").innerText(),/e4/);
   });
   await check("Bob responds e5 and Alice receives it",async()=>{
     await bob.locator("#board [data-square=e7]").click();
     await bob.locator("#board [data-square=e5]").click();
     await bob.waitForFunction(()=>window.ChessPvPDevQA.get()?.lastMove==="e5");
     await alice.waitForFunction(()=>window.ChessPvPDevQA.get()?.lastMove==="e5",{timeout:15000});
   });
   await check("both can reload without losing game",async()=>{
     await alice.reload();await bob.reload();
     await alice.locator("#matches button").first().waitFor({timeout:15000});
     await bob.locator("#matches button").first().waitFor({timeout:15000});
     await alice.locator("#matches button").first().click();
     await bob.locator("#matches button").first().click();
     await alice.waitForFunction(()=>window.ChessPvPDevQA.get()?.ply===2,{timeout:15000});
     await bob.waitForFunction(()=>window.ChessPvPDevQA.get()?.ply===2,{timeout:15000});
     assert.equal(await alice.locator("#board .square").count(),64);
   });
   await check("Bob mobile width keeps all actions reachable",async()=>{
     const size=await bob.evaluate(()=>({s:document.documentElement.scrollWidth,w:innerWidth}));
     assert.ok(size.s<=size.w+2,JSON.stringify(size));
   });
   await check("Bob resigns; Alice sees final game result",async()=>{
     bob.once("dialog",d=>d.accept());
     await bob.locator("#resign").click();
     await bob.waitForFunction(()=>window.ChessPvPDevQA.get()?.status==="finished");
     await alice.waitForFunction(()=>window.ChessPvPDevQA.get()?.status==="finished",{timeout:15000});
     assert.match(await alice.locator("#score").innerText(),/1-0/);
   });
   await check("rematch invitation can be created",async()=>{
     await alice.locator("#rematch").click();
     await alice.waitForFunction(()=>document.getElementById("notice").textContent.includes("Rematch invite"));
     await bob.locator("#refresh").click();
     await bob.waitForFunction(()=>document.querySelector("#invitations button"));
   });
   await check("no runtime errors",async()=>assert.deepEqual(errors,[]));
   console.log("PASS B9 dual Chrome "+tests+"/"+tests);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
