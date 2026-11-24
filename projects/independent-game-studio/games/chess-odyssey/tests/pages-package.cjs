"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),os=require("node:os"),cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"..");
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"chess-pages-contract-"));
let n=0;const ok=(label,fn)=>{fn();console.log("PASS B10 web "+(++n)+" "+label)};
try{
  cp.execFileSync(process.execPath,[path.join(ROOT,"scripts","build-pages.cjs"),temp],{stdio:"pipe"});
  const game=path.join(temp,"chess-odyssey"),html=fs.readFileSync(path.join(game,"index.html"),"utf8");
  ok("landing and modular HTTPS path",()=>{assert.ok(fs.existsSync(path.join(temp,"index.html")));assert.match(fs.readFileSync(path.join(temp,"index.html"),"utf8"),/\.\/chess-odyssey\//);});
  ok("local chess, legal engine and Stockfish WASM bundled",()=>{for(const s of ["index.html","app.js","chess-appearance.js","vendor/chess.js","engine/stockfish-19-lite-single.js","engine/stockfish-19-lite-single.wasm","engine/Copying.txt","masters-library.js","masters-expanded.js","header-controls.js","progress-core.js"])assert.ok(fs.statSync(path.join(game,s)).size>0,s);});
  ok("all relative page scripts and styles present",()=>{const refs=[...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)].map(x=>x[1]);for(const r of refs){if(r.startsWith("http"))continue;const clean=r.split(/[?#]/)[0];assert.ok(!clean.startsWith("/")&&!clean.includes(".."),r);assert.ok(fs.existsSync(path.join(game,clean)),"Missing "+clean);}});
  ok("v1 catalog expansion packaged",()=>{const data=fs.readFileSync(path.join(game,"masters-expanded.js"),"utf8");assert.match(data,/ChessMastersExpansion/);assert.match(html,/masters-expanded\.js/);});
  ok("no synthetic PvP backend or secrets exposed",()=>{for(const s of ["pvp/dev-server.cjs","pvp/demo.js",".env",".env.local","tests","scripts","chess_odyssey.sql"])assert.ok(!fs.existsSync(path.join(game,s)),s);});
  ok("all 96 licensed SVGs are copied to the same origin",()=>{const sets=["fantasy","spatial","celtic","chessnut","rhosgfx","kiwen-suwi","totoy","papercut"];for(const set of sets)for(const side of "bw")for(const k of "KQRBNP"){const asset=path.join(game,"pieces",set,side+k+".svg");assert.ok(fs.statSync(asset).size>100,asset);}for(const file of ["pieces/SOURCE_REGISTER.md","pieces/LICENSE-MIT.txt","pieces/LICENSE-APACHE-2.0.txt","pieces/piece-sets.css"]){assert.ok(fs.existsSync(path.join(game,file)),file);}});
  ok("licence and engine package evidence retained",()=>{assert.match(fs.readFileSync(path.join(game,"engine/Copying.txt"),"utf8"),/GNU GENERAL PUBLIC LICENSE/);assert.ok(fs.statSync(path.join(game,"engine/stockfish-19-lite-single.wasm")).size>1000000);});
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log("PASS B10 web "+n+"/"+n);
