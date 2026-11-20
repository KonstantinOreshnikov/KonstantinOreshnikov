/* Only for authorized B3 development on game/chess-odyssey-v0.1.
 * Copies prebuilt UNMODIFIED Stockfish assets after npm fixed-version install.
 * Do not auto-run package scripts or change unrelated repository content.
 */
"use strict";
const path=require("node:path");
const fs=require("node:fs");
const crypto=require("node:crypto");
const root=path.resolve(__dirname,"..");
const pkg=process.env.CHESS_STOCKFISH_PKG;
if(!pkg)throw new Error("CHESS_STOCKFISH_PKG must point to the installed package");
const meta=JSON.parse(fs.readFileSync(path.join(pkg,"package.json"),"utf8"));
if(meta.name!=="stockfish"||meta.version!=="19.0.1"||meta.license!=="GPL-3.0"){
 throw new Error("Unexpected package version or license: "+JSON.stringify(meta));
}
const target=path.join(root,"engine");
fs.mkdirSync(target,{recursive:true});
const names=["stockfish-19-lite-single.js","stockfish-19-lite-single.wasm"];
const recorded=[];
for(const name of names){
 const original=path.join(pkg,"bin",name),output=path.join(target,name);
 if(!fs.existsSync(original))throw new Error("Missing expected npm asset: "+original);
 fs.copyFileSync(original,output);
 const bytes=fs.readFileSync(output);
 if(bytes.length<20000)throw new Error("Unexpectedly short engine binary: "+name);
 recorded.push([name,bytes.length,crypto.createHash("sha256").update(bytes).digest("hex")]);
}
const originalLicense=path.join(pkg,"Copying.txt");
if(!fs.existsSync(originalLicense))throw new Error("Cannot convey GPL engine without Copying.txt");
fs.copyFileSync(originalLicense,path.join(target,"Copying.txt"));
const licenseText=fs.readFileSync(path.join(target,"Copying.txt"),"utf8");
if(!licenseText.includes("GNU GENERAL PUBLIC LICENSE"))throw new Error("Wrong license body");
const manifest=[
 "# Chess Odyssey — Pinned Third-party Chess Engine",
 "",
 "Version: stockfish npm 19.0.1 (Stockfish.js 19 Lite single-threaded)",
 "License: GPL-3.0, full Copying.txt included",
 "Upstream engine port: https://github.com/nmrugg/stockfish.js/tree/v19.0.1",
 "Upstream engine: https://github.com/official-stockfish/Stockfish",
 "Package: https://www.npmjs.com/package/stockfish/v/19.0.1",
 "Files reproduced from npm stockfish@19.0.1, without changes to binary or glue code.",
 "Source and build scripts: pinned upstream source tree above (corresponding version).",
 "",
 "Asset | Bytes | SHA256",
 "--- | ---: | ---",
 ...recorded.map(x=>x[0]+" | "+x[1]+" | "+x[2]),
 "",
 "Note: single-threaded WASM can run on a conventional static HTTP host; an",
 "offline file:// browser load may block Workers. Chess Odyssey then reports",
 "and uses a clearly labeled built-in fallback rather than silently mislabeling it.",
 ""
].join("\n");
fs.writeFileSync(path.join(target,"MANIFEST.md"),manifest);
console.log(manifest);
