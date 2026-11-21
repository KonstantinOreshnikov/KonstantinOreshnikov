/* B9 loopback-only HTTP integration fixture. DO NOT DEPLOY.
 * No real Neon auth: X-Demo-User is spoofable and accepted ONLY in this
 * localhost test fixture, with CHESS_ODYSSEY_PVP_DEV=1.
 */
"use strict";
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {createService,MatchError}=require("./match-service.cjs");
const base=path.resolve(__dirname,"..");
const demoFiles=Object.freeze({
 "/demo":{file:path.join(__dirname,"demo.html"),type:"text/html; charset=utf-8"},
 "/demo.js":{file:path.join(__dirname,"demo-client.js"),type:"text/javascript; charset=utf-8"},
 "/demo.css":{file:path.join(__dirname,"demo.css"),type:"text/css; charset=utf-8"},
});
function createDemoServer(){
 if(process.env.CHESS_ODYSSEY_PVP_DEV!=="1"||process.env.NODE_ENV==="production"){
   throw new Error("B9 dev-server is a synthetic fixture: explicit local DEV flag required. NOT deployable.");
 }
 const service=createService();
 return http.createServer(async(req,res)=>{
  const secureHeaders={
    "Cache-Control":"no-store","X-Content-Type-Options":"nosniff",
    "Content-Security-Policy":"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; object-src 'none'; frame-ancestors 'none'",
    "X-Frame-Options":"DENY","Referrer-Policy":"no-referrer"
  };
  const send=(status,body)=>{res.writeHead(status,{"Content-Type":"application/json; charset=utf-8",...secureHeaders});res.end(JSON.stringify(body));};
  const identity=()=>{
    const name=req.headers["x-demo-user"];
    if(typeof name!=="string"||!["alice","bob","charlie"].includes(name))throw new MatchError("UNAUTHENTICATED");
    return name;
  };
  try{
    const ip=req.socket.remoteAddress;
    if(!["127.0.0.1","::1","::ffff:127.0.0.1"].includes(ip)){send(403,{error:"LOCAL_ONLY"});return;}
    if(req.headers.origin){
      const origin=new URL(req.headers.origin);
      if(!["127.0.0.1","localhost"].includes(origin.hostname)||origin.host!==req.headers.host){
        send(403,{error:"CROSS_ORIGIN"});return;
      }
    }
    const url=new URL(req.url,"http://127.0.0.1");
    if(req.method==="GET"&&url.pathname==="/health"){send(200,{ok:true,mode:"UNSAFE_LOCAL_FIXTURE"});return;}
    if(req.method==="GET"&&demoFiles[url.pathname]){
      const def=demoFiles[url.pathname];
      res.writeHead(200,{"Content-Type":def.type,...secureHeaders});res.end(fs.readFileSync(def.file));return;
    }
    if(!url.pathname.startsWith("/api/")){send(404,{error:"NOT_FOUND"});return;}
    const actorId=identity();
    if(req.method==="GET"){
      if(url.pathname==="/api/dashboard"){send(200,service.visible({actorId}));return;}
      if(url.pathname==="/api/game"){
        send(200,service.getGame(url.searchParams.get("id"),actorId));return;
      }
      send(404,{error:"NOT_FOUND"});return;
    }
    if(req.method!=="POST"){send(405,{error:"METHOD_NOT_ALLOWED"});return;}
    let raw="",bytes=0;
    for await(const chunk of req){
      bytes+=chunk.length;if(bytes>8192)throw new MatchError("REQUEST_TOO_LARGE");
      raw+=chunk.toString("utf8");
    }
    let body;try{body=JSON.parse(raw);}catch{throw new MatchError("BAD_JSON");}
    if(!body||Array.isArray(body)||typeof body!=="object")throw new MatchError("BAD_JSON");
    const args={...body,actorId};
    const handlers={
      "/api/invite":service.invite,"/api/accept":service.accept,"/api/decline":service.decline,
      "/api/play":service.play,"/api/resign":service.resign,"/api/draw":service.draw,
      "/api/rematch":service.rematch,
    };
    const handler=handlers[url.pathname];
    if(!handler){send(404,{error:"NOT_FOUND"});return;}
    const state=handler(args);
    send(200,state);
  }catch(e){
    const code=e instanceof MatchError?e.code:"INTERNAL_ERROR";
    const status=code==="UNAUTHENTICATED"?401:code==="NOT_FOUND"?404:
      ["STALE_REVISION","NOT_YOUR_TURN","INVITE_USED","GAME_FINISHED","REQUEST_ID_REUSED"].includes(code)?409:
      code==="INTERNAL_ERROR"?500:400;
    send(status,{error:code});
  }
 });
}
if(require.main===module){
 const server=createDemoServer();
 server.listen(8781,"127.0.0.1",()=>process.stdout.write("B9 UNSAFE LOCAL DEMO http://127.0.0.1:8781/demo\n"));
}
module.exports={createDemoServer};
