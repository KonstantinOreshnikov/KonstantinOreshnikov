/* Chess Odyssey V1 Neon Auth boundary. No persistence or PvP operations here.
 * Production verifyToken must cryptographically validate EdDSA/JWKS, iss, aud, exp.
 */
"use strict";
const cleanHeaders={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"};
const reply=(code,body,extra={})=>new Response(JSON.stringify(body),{status:code,headers:{"Content-Type":"application/json; charset=utf-8",...cleanHeaders,...extra}});
function createGateway({verifyToken,allowedOrigins}){
 if(typeof verifyToken!=="function"||!Array.isArray(allowedOrigins)||!allowedOrigins.length)throw Error("Auth gateway requires verifier and explicit origins");
 const origins=new Set();
 for(const item of allowedOrigins){
  if(typeof item!=="string"||!/^https:\/\/[A-Za-z0-9.-]+(?::[0-9]{2,5})?$/.test(item)||item.includes("*"))throw Error("Invalid trusted HTTPS origin");
  origins.add(item);
 }
 return Object.freeze({async fetch(request){
  if(!request||!request.headers||typeof request.method!=="string")return reply(400,{error:"BAD_REQUEST"});
  const requestOrigin=request.headers.get("origin");
  if(requestOrigin&&!origins.has(requestOrigin))return reply(403,{error:"ORIGIN_DENIED"});
  const cors=requestOrigin?{"Access-Control-Allow-Origin":requestOrigin,"Vary":"Origin","Access-Control-Allow-Headers":"authorization,content-type","Access-Control-Allow-Methods":"GET,OPTIONS"}:{};
  if(request.headers.has("x-demo-user"))return reply(400,{error:"DEMO_IDENTITY_PROHIBITED"},cors);
  if(request.method==="OPTIONS")return requestOrigin?new Response(null,{status:204,headers:{...cleanHeaders,...cors}}):reply(403,{error:"ORIGIN_REQUIRED"});
  const path=new URL(request.url).pathname;
  if(path==="/health"&&request.method==="GET")return reply(200,{ok:true,component:"auth-gateway",phase:"staging-only"},cors);
  if(path!=="/api/me")return reply(404,{error:"NOT_FOUND"},cors);
  if(request.method!=="GET")return reply(405,{error:"METHOD_NOT_ALLOWED"},cors);
  const auth=request.headers.get("authorization")||"";
  const match=/^Bearer ([A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+)$/.exec(auth);
  if(!match)return reply(401,{error:"UNAUTHORIZED"},cors);
  try{
   const claims=await verifyToken(match[1]);
   if(!claims||typeof claims.sub!=="string"||!claims.sub||claims.sub.length>255||claims.emailVerified!==true)return reply(401,{error:"UNAUTHORIZED"},cors);
   return reply(200,{authenticated:true,user:{id:claims.sub}},cors);
  }catch{
   return reply(401,{error:"UNAUTHORIZED"},cors);
  }
 }});
}
module.exports={createGateway};
