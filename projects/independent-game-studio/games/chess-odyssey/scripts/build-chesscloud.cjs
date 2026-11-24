"use strict";
/* Deterministic, dependency-free Neon Function packaging. No credentials enter the archive. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const ROOT=path.resolve(__dirname,"..");
const input=fs.readFileSync(path.join(ROOT,"functions/chesscloud/index.mjs"),"utf8");
const chess=fs.readFileSync(path.join(ROOT,"vendor/chess.js"),"utf8");
const clock=fs.readFileSync(path.join(ROOT,"clock-core.js"),"utf8");
const marker='import ChessPackage from "../../vendor/chess.js";\nimport Clock from "../../clock-core.js";';
assert.equal(input.split(marker).length,2,"unexpected Function import graph");
const embedded=[
 'const ChessPackage=(()=>{const module={exports:{}};const exports=module.exports;',
 chess,'return module.exports;})();',
 'const Clock=(()=>{const module={exports:{}};const exports=module.exports;',
 clock,'return module.exports;})();'
].join("\n");
const bundled=input.replace(marker,embedded);
assert.match(bundled,/duplicate:true/,"must preserve replay idempotency");
assert.match(bundled,/export default \{fetch\(request\)/,"must export Neon fetch handler");
const body=Buffer.from(bundled,"utf8"),name=Buffer.from("index.mjs","ascii");
let crc=0xffffffff;
for(const byte of body){crc^=byte;for(let k=0;k<8;k++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1}
crc=(crc^0xffffffff)>>>0;
const local=Buffer.alloc(30+name.length),central=Buffer.alloc(46+name.length),end=Buffer.alloc(22);
local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0,6);
local.writeUInt16LE(0,8);local.writeUInt32LE(crc,14);local.writeUInt32LE(body.length,18);
local.writeUInt32LE(body.length,22);local.writeUInt16LE(name.length,26);name.copy(local,30);
central.writeUInt32LE(0x02014b50,0);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);
central.writeUInt32LE(crc,16);central.writeUInt32LE(body.length,20);
central.writeUInt32LE(body.length,24);central.writeUInt16LE(name.length,28);
central.writeUInt32LE(0,42);name.copy(central,46);
end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(1,8);end.writeUInt16LE(1,10);
end.writeUInt32LE(central.length,12);end.writeUInt32LE(local.length+body.length,16);
const zip=Buffer.concat([local,body,central,end]);
const output=path.resolve(process.argv[2]||path.join(ROOT,"dist","chesscloud.zip"));
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,zip);
const sha=crypto.createHash("sha256").update(zip).digest("hex");
console.log(JSON.stringify({status:"PASS",output:path.relative(ROOT,output),files:1,entry:"index.mjs",bundleBytes:body.length,zipBytes:zip.length,sha256:sha}));
