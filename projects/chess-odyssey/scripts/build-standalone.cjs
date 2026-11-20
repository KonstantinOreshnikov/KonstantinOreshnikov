/* Reproducible self-contained preview builder.
 * This file bundles the game UI and LOCAL fallback. The Stockfish GPL WASM
 * engine stays a separate on-origin asset; file:// cannot host its Worker.
 */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const version=process.argv[2]||"0.3.0";
if(!/^0\.[0-9]+\.[0-9]+$/.test(version))throw new Error("Invalid preview version");
const name="ChessOdyssey_v"+version+"_PREVIEW.html";
const h=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"styles.css"),"utf8");
let out=h.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+css+'\n</style>');
for(const file of ["vendor/chess.js","coach-engine.js","engine-bridge.js","academy.js","app.js"]){
 const src=fs.readFileSync(path.join(root,file),"utf8");
 assert.ok(!src.includes("</script"),"unsafe script boundary "+file);
 const link='<script defer src="'+file+'"></script>';
 assert.ok(out.includes(link),"missing reference "+file);
 out=out.replace(link,"<script>\n"+src+"\n</script>");
}
assert.ok(!out.includes('<script defer src=')&&!out.includes('href="styles.css"'));
assert.ok(out.includes("ChessEngineBridge")&&out.includes("ChessCoachEngine")&&out.includes("ChessAcademy")&&out.includes("Copyright (c) 2020, Jeff Hlywa"));
const dest=path.join(root,"dist",name);
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,out);
console.log("PASS built standalone fallback "+dest+" ("+out.length+" chars)");
