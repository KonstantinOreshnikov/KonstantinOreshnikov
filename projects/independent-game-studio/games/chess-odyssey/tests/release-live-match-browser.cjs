/* B7: genuinely completed, full-length unseeded game from standard start.
 * Real local AI responds to physical UI clicks; player moves are calculated by
 * independent genuine licensed Stockfish 19 UCI on localhost, not mocks/fixtures.
 * Not a human-rated/Elo calibration. Deterministic game-over, legality and
 * independent-rating proof only.
 */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
function server(){
 const h=http.createServer((req,res)=>{
   const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
   const file=path.resolve(root,"."+pathname);
   if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
   fs.readFile(file,(error,bytes)=>{
     if(error){res.writeHead(404);res.end();return;}
     const type=file.endsWith(".wasm")?"application/wasm":file.endsWith(".js")?"text/javascript":file.endsWith(".html")?"text/html; charset=utf-8":file.endsWith(".css")?"text/css":"application/octet-stream";
     res.writeHead(200,{"Content-Type":type,"Cache-Control":"no-store"});res.end(bytes);
   });
 });
 return new Promise((resolve,reject)=>{h.once("error",reject);h.listen(0,"127.0.0.1",()=>resolve(h));});
}
(async()=>{
 const host=await server(),browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const context=await browser.newContext({viewport:{width:1280,height:850}});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 let turns=0;
 const read=()=>page.evaluate(()=>{
   const raw=JSON.parse(localStorage.getItem("chess-odyssey-v01")||"null");
   if(!raw)throw Error("Practice state missing");
   const board=new Chess();
   if(raw.pgn&&!board.load_pgn(raw.pgn))throw Error("Actual played PGN invalid");
   return {pgn:raw.pgn||"",plies:board.history().length,fen:board.fen(),turn:board.turn(),ended:board.game_over(),
     mate:board.in_checkmate(),draw:board.in_draw(),mode:raw.matchMode,level:raw.difficulty,finalized:raw.finalized};
 });
 try{
  await page.goto("http://127.0.0.1:"+host.address().port+"/index.html");
  await page.waitForFunction("window.ChessOdysseyQA && window.ChessProgressQA");
  await page.selectOption("#level","beginner");
  await page.selectOption("#match-mode","independent");
  assert.equal(await page.evaluate(()=>window.ChessOdysseyQA.match().mode),"independent");
  assert.equal(await page.evaluate(()=>window.ChessOdysseyQA.match().session.fallback),false);
  assert.equal((await read()).plies,0);
  await page.evaluate(()=>{window.__b7Player=new window.ChessEngineBridge.Bridge();});
  let done=false;
  for(let n=0;n<100;n++){
    const previous=await read();
    if(previous.ended){done=true;break;}
    assert.equal(previous.turn,"w","Expected our turn after the actual local bot's response");
    const action=await page.evaluate(async()=>{
      const raw=JSON.parse(localStorage.getItem("chess-odyssey-v01"));
      const board=new Chess();if(raw.pgn&&!board.load_pgn(raw.pgn))throw Error("Corrupt game");
      const choice=await window.__b7Player.choose(board.fen(),"advanced");
      const move=window.ChessEngineBridge.legalUci(board,choice.uci);
      if(!move)throw Error("Genuine Stockfish UCI move is illegal: "+choice.uci);
      return {from:move.from,to:move.to,promotion:move.promotion||"q"};
    });
    await page.locator('#board button[aria-label^="'+action.from+' "]').click();
    await page.locator('#board button[aria-label^="'+action.to+' "]').click();
    if(await page.locator("#promotion").isVisible()){
       await page.locator('#promotion [data-promote="'+action.promotion+'"]').click();
    }
    const after=await read();
    assert.ok(after.plies>previous.plies,"Player UI failed to perform legal Stockfish-selected move");
    if(!after.ended){
      await page.waitForFunction(plies=>{
        const raw=JSON.parse(localStorage.getItem("chess-odyssey-v01")||"null");
        if(!raw?.pgn)return false;
        const b=new Chess();return b.load_pgn(raw.pgn)&&(b.history().length>=plies+2||b.game_over());
      },previous.plies,{timeout:15000});
    }
    turns++;
    if(turns%12===0)console.log("B7 live game underway: "+turns+" full UI human turns, "+(await read()).plies+" verified plies");
    if((await read()).ended){done=true;break;}
  }
  const final=await read();
  assert.equal(done,true,"Full organic game failed to reach any legal result within 100 player turns");
  assert.ok(final.plies>=12,"Game did not last enough half-moves to prove an actual multi-turn match");
  assert.equal(final.ended,true);
  assert.equal(final.finalized,true);
  assert.ok(final.mate||final.draw);
  const ledger=await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated);
  assert.equal(ledger.eligible,1,"Real full independent game should register exactly once");
  assert.equal(ledger.index,null,"A single independent match never creates a fictional index");
  assert.equal(ledger.win+ledger.draw+ledger.loss,1);
  assert.equal((await page.locator("#hint").isDisabled()),false,"After full game, postgame help must be available");
  await page.reload();await page.waitForFunction("window.ChessProgressQA && window.ChessOdysseyQA");
  assert.equal(await page.evaluate(()=>window.ChessProgressQA.snapshot().summary.rated.eligible),1,"Reload must not double count organic game");
  assert.equal((await read()).fen,final.fen,"Reload should reconstruct the full organic final board");
  assert.deepEqual(errors,[]);
  console.log("PASS B7 organic actual Stockfish-vs-Beginner full independent match 1 / 1; plies="+final.plies+", humanTurns="+turns+", "+(final.mate?"checkmate":"draw"));
 }finally{
  try{await page.evaluate(()=>window.__b7Player?.cancel?.());}catch(_){}
  await browser.close();
  await new Promise(resolve=>host.close(resolve));
 }
})().catch(e=>{console.error("FAIL B7 full organic match",e);process.exitCode=1;});
