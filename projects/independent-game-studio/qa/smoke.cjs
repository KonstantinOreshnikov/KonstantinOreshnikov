'use strict';
const {chromium}=require('playwright');
const path=require('node:path');
const http=require('node:http');
const fs=require('node:fs');
const root=path.resolve(__dirname,'../../..');
const files=[
 ['Caribbean v1.2','projects/independent-game-studio/games/caribbean-merchant/releases/CaribbeanMerchant_v1.2.html'],
 ['Kingdoms v1.1','projects/independent-game-studio/games/kingdoms-of-ember/dist/KingdomsOfEmber_v1.1.html'],
 ['Chess v0.8','projects/independent-game-studio/games/chess-odyssey/dist/ChessOdyssey_v0.8.0_PREVIEW.html']
];
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const target=path.resolve(root,'.'+pathname);
 if(!target.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
 fs.readFile(target,(err,buf)=>{if(err){res.writeHead(404).end();return;}res.setHeader('content-type',mime[path.extname(target)]||'application/octet-stream');res.end(buf);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||'chromium'});
 let passed=0;
 try{for(const [name,file] of files){
  const ctx=await browser.newContext();const page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const address=`http://127.0.0.1:${server.address().port}/${file}`;
  const response=await page.goto(address,{waitUntil:'load'});
  if(response.status()!==200)throw Error(`${name}: HTTP ${response.status()}`);
  await page.waitForTimeout(300);
  const title=await page.title();const visible=await page.locator('body').innerText();
  if(!title||visible.length<350||errors.length)throw Error(`${name}: title=${title}, visible=${visible.length}, JS errors=${errors.join('; ')}`);
  const key='studio-migration-smoke';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[key,name]);
  await page.reload({waitUntil:'load'});
  if(await page.evaluate(k=>localStorage.getItem(k),key)!==name)throw Error(`${name}: storage failed across reload`);
  console.log(`PASS ${name}: HTTP 200, UI content, JS, storage reload`);passed++;await ctx.close();
 }}finally{await browser.close();server.close()}
 console.log(`${passed}/${files.length} migration smoke PASS`);
})().catch(e=>{server.close();console.error(e);process.exitCode=1});
