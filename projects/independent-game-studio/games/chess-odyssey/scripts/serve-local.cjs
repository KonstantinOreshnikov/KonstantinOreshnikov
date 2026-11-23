/* Built-in Node static server for a local-only Stockfish browser session.
 * No npm modules, no account, no analytics, no remote listening.
 */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const root=path.resolve(__dirname,"..");
const port=Number(process.env.CHESS_PORT||8765);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error("Invalid CHESS_PORT");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".wasm":"application/wasm",".svg":"image/svg+xml",".txt":"text/plain; charset=utf-8",".md":"text/plain; charset=utf-8"};
const app=http.createServer((req,res)=>{
 try{
  if(req.method!=="GET"&&req.method!=="HEAD"){res.writeHead(405);res.end();return;}
  const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  const file=path.resolve(root,"."+(!pathname||pathname==="/"?"/index.html":pathname));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(err,stat)=>{
   if(err||!stat||!stat.isFile()){res.writeHead(404);res.end("Not found");return;}
   const stream=fs.createReadStream(file);
   res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Content-Length":stat.size,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});
   if(req.method==="HEAD"){stream.destroy();res.end();return;}
   stream.on("error",()=>{if(!res.writableEnded)res.destroy();});
   stream.pipe(res);
  });
 }catch(_e){res.writeHead(400);res.end("Bad request");}
});
app.listen(port,"127.0.0.1",()=>console.log("Chess Odyssey (local only): http://127.0.0.1:"+port+"/index.html"));
app.on("error",error=>{console.error("Cannot start local chess server:",error.message);process.exitCode=1;});
