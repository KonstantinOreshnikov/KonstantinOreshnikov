/* Real Chromium UCI E2E: serves vendored GPL Stockfish over localhost.
 * No mock engine response is accepted. Browser source is never changed by this test.
 */
"use strict";
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
function startServer(){
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const file=path.resolve(root,"."+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end("Forbidden");return;}
  fs.readFile(file,(error,contents)=>{
   if(error){res.writeHead(404);res.end("Not found");return;}
   const type=file.endsWith(".wasm")?"application/wasm":file.endsWith(".svg")?"image/svg+xml":file.endsWith(".js")?"text/javascript":file.endsWith(".html")?"text/html; charset=utf-8":file.endsWith(".css")?"text/css":"application/octet-stream";
   res.writeHead(200,{"Content-Type":type,"Cache-Control":"no-store"});
   res.end(contents);
  });
 });
 return new Promise((resolve,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",()=>resolve(server));});
}
(async()=>{
 let tests=0;
 const server=await startServer();
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1140,height:800}});
 const page=await context.newPage();
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  const origin="http://127.0.0.1:"+server.address().port;
  // The vendor must be genuinely present; this cannot silently pass with fallback.
  for(const f of ["stockfish-19-lite-single.js","stockfish-19-lite-single.wasm","Copying.txt"]){
   assert.ok(fs.existsSync(path.join(root,"engine",f)),f+" missing");
  }
  await page.goto(origin+"/index.html");
  await page.waitForFunction("window.ChessOdysseyQA && document.querySelectorAll('#board .square').length===64");
  assert.equal(await page.locator("#level option").count(),6);tests++;
  await page.selectOption("#level","intermediate");
  await page.selectOption("#side","b"); // engine as White, immediate move
  await page.waitForFunction("document.querySelector('#engine-status').dataset.kind==='stockfish'",null,{timeout:35000});
  assert.ok((await page.locator("#moves").innerText()).includes("1."));
  assert.equal(await page.evaluate(()=>window.ChessOdysseyQA.engineStatus()),"stockfish");tests++;
  const pgn=await page.evaluate(()=>JSON.parse(localStorage.getItem("chess-odyssey-v01")).pgn);
  assert.ok(pgn&&pgn.length>2);tests++;
  // Both intermediate and advanced use actual UCI moves, not the fallback.
  await page.selectOption("#level","advanced");
  await page.waitForFunction("document.querySelector('#engine-status').dataset.kind==='stockfish'",null,{timeout:35000});
  assert.ok((await page.locator("#moves").innerText()).includes("1."));tests++;
  // New difficulty must recreate the worker and apply its UCI skill profile.
  await page.selectOption("#level","expert");
  await page.waitForFunction("document.querySelector('#engine-status').dataset.kind==='stockfish'",null,{timeout:35000});
  assert.ok((await page.locator("#moves").innerText()).includes("1."));tests++;
  await page.selectOption("#level","grandmaster");
  await page.waitForFunction("document.querySelector('#engine-status').dataset.kind==='stockfish'",null,{timeout:35000});
  assert.ok((await page.locator("#moves").innerText()).includes("1."));tests++;
  await page.reload();
  await page.waitForFunction("window.ChessOdysseyQA");
  assert.equal(await page.locator("#level").inputValue(),"grandmaster");tests++;
  // Rapidly switching levels must not apply a stale engine move after reset.
  await page.selectOption("#level","grandmaster");
  await page.selectOption("#level","beginner");
  await page.selectOption("#side","w");
  await page.waitForTimeout(1600);
  assert.equal(await page.locator("#moves").innerText(),"—");tests++;
  assert.equal(await page.locator("#engine-status").getAttribute("data-kind"),"local");tests++;
  // file:// must explicitly mark fallback, not advertise Stockfish.
  const offline=await browser.newPage();
  await offline.goto("file://"+path.join(root,"index.html"));
  await offline.waitForFunction("window.ChessOdysseyQA");
  await offline.selectOption("#level","grandmaster");
  assert.equal(await offline.locator("#engine-status").getAttribute("data-kind"),"fallback");tests++;
  await offline.close();
  assert.deepEqual(errors,[]);tests++;
  console.log("PASS Stockfish 19 real browser "+tests+" / "+tests);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(err=>{console.error("FAIL real browser Stockfish",err);process.exitCode=1;});
