"use strict";
/* B10: deterministic, allowlisted GitHub Pages static artifact (no private API/DB credentials). */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const ROOT=path.resolve(__dirname,"..");
const OUT=path.resolve(process.argv[2]||path.join(ROOT,"build","github-pages"));
const DEST=path.join(OUT,"chess-odyssey");
const files=[
 "index.html","styles.css","app.js","chess-appearance.js","game-review-core.js",
 "clock-core.js","coach-engine.js","engine-bridge.js","academy.js",
 "progress-core.js","progress-ui.js","masters-library.js",
 "masters-core.js","masters-ui.js","masters-notes-a.js","masters-notes-b.js","masters-notes-c.js",
 "vendor/chess.js","data/masters-source-scores.json",
 "engine/stockfish-19-lite-single.js","engine/stockfish-19-lite-single.wasm",
 "engine/Copying.txt","engine/MANIFEST.md","THIRD_PARTY_NOTICES.md"
];
if(OUT===ROOT||OUT.startsWith(ROOT+path.sep)&&!OUT.includes(path.sep+"build"+path.sep)){
  throw Error("Refusing unsafe build output path");
}
fs.rmSync(OUT,{recursive:true,force:true});
fs.mkdirSync(DEST,{recursive:true});
for(const file of files){
 const src=path.join(ROOT,file),dst=path.join(DEST,file);
 if(!fs.statSync(src).isFile()||fs.statSync(src).size===0)throw Error("Missing asset "+file);
 fs.mkdirSync(path.dirname(dst),{recursive:true});
 fs.copyFileSync(src,dst);
}
const pieceDir=path.join(ROOT,"pieces");
if(fs.existsSync(pieceDir)){
 for(const set of fs.readdirSync(pieceDir,{withFileTypes:true}).filter(x=>x.isDirectory())){
   if(!/^[a-z0-9-]+$/.test(set.name))throw Error("Invalid set directory");
   const src=path.join(pieceDir,set.name),dst=path.join(DEST,"pieces",set.name);
   fs.mkdirSync(dst,{recursive:true});
   for(const file of fs.readdirSync(src)){
     if(!/^[bw][KQRBNP]\.svg$/.test(file))throw Error("Unapproved piece asset "+file);
     fs.copyFileSync(path.join(src,file),path.join(dst,file));
   }
 }
}
const landing=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chess Odyssey</title><meta http-equiv="refresh" content="0;url=./chess-odyssey/"></head><body><p><a href="./chess-odyssey/">Open Chess Odyssey development preview</a></p></body></html>`;
fs.writeFileSync(path.join(OUT,"index.html"),landing);
fs.writeFileSync(path.join(OUT,".nojekyll"),"");
const inventory=files.map(f=>({path:f,size:fs.statSync(path.join(DEST,f)).size}));
const stat=inventory.reduce((sum,x)=>sum+x.size,0);
console.log("PASS B10 GitHub Pages package: "+inventory.length+" allowlisted runtime assets, "+stat+" bytes (plus optional licensed SVGs); no PVP dev-server or secrets");
