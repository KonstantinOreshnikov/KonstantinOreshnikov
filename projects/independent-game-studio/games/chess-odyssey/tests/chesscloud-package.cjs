"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const ROOT=path.resolve(__dirname,".."),tmp=fs.mkdtempSync(path.join(os.tmpdir(),"chesscloud-qa-"));
try{
 const zip=path.join(tmp,"chesscloud.zip");
 const out=JSON.parse(cp.execFileSync(process.execPath,[path.join(ROOT,"scripts/build-chesscloud.cjs"),zip],{encoding:"utf8"}));
 assert.equal(out.status,"PASS");
 const bytes=fs.readFileSync(zip);
 assert.equal(bytes.readUInt32LE(0),0x04034b50);
 const fnameLen=bytes.readUInt16LE(26),dataLen=bytes.readUInt32LE(18),offset=30+fnameLen;
 assert.equal(bytes.subarray(30,offset).toString(),"index.mjs");
 assert.equal(bytes.readUInt32LE(offset+dataLen),0x02014b50);
 assert.equal(bytes.readUInt32LE(bytes.length-22),0x06054b50);
 const modulePath=path.join(tmp,"index.mjs");
 fs.writeFileSync(modulePath,bytes.subarray(offset,offset+dataLen));
 const source=fs.readFileSync(modulePath,"utf8");
 assert.ok(!source.includes('import ChessPackage from "../../vendor/chess.js"'));
 assert.ok(!source.includes('import Clock from "../../clock-core.js"'));
 assert.match(source,/duplicate:true/);
 assert.match(source,/return asJson\(200,\{game_id:game\.game_id,version:Number\(game\.version\)/);
 assert.ok(!source.includes("CHESS_RPC_SECRET="));
 cp.execFileSync(process.execPath,["--check",modulePath],{stdio:"pipe"});
 const rerun=JSON.parse(cp.execFileSync(process.execPath,[path.join(ROOT,"scripts/build-chesscloud.cjs"),zip],{encoding:"utf8"}));
 assert.equal(rerun.sha256,out.sha256,"archive must be deterministic");
 console.log("PASS Chess Odyssey Neon Function ZIP: root index.mjs, Node syntax, idempotent replay, reproducible digest");
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
