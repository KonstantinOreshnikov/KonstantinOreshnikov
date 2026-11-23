/* Chess Odyssey staging cloud API — Node 24 Neon Function, zero external deps.
 * Auth identity exclusively from verified Neon Better Auth EdDSA JWT.
 * Data API enforces independently configured PostgreSQL RLS for progress.
 */
import {createPublicKey,verify as verifySignature} from "node:crypto";

const jsonHeaders={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
const asJson=(status,data,headers={})=>new Response(JSON.stringify(data),{status,headers:{...jsonHeaders,...headers}});
const validOrigin=o=>/^https:\/\/[a-z0-9.-]+(?::[0-9]{2,5})?$/i.test(o)&&!o.includes("*");
const decode=s=>Buffer.from(s,"base64url");
const finite=n=>Number.isSafeInteger(n)&&n>=0;
function parseConfig(env){
 const origins=(env.CHESS_ALLOWED_ORIGINS||"").split(",").map(x=>x.trim()).filter(Boolean);
 if(!origins.length||origins.some(x=>!validOrigin(x)))throw Error("Explicit HTTPS origin allowlist required");
 const auth=new URL(env.NEON_AUTH_BASE_URL||"");
 const jwks=new URL(env.NEON_AUTH_JWKS_URL||"");
 const data=new URL(env.NEON_DATA_API_URL||"");
 if([auth,jwks,data].some(x=>x.protocol!=="https:"))throw Error("Secure Neon service URLs required");
 if(!jwks.pathname.endsWith("/.well-known/jwks.json"))throw Error("JWKS URL not trusted");
 if(!data.pathname.endsWith("/rest/v1"))throw Error("Data API URL not trusted");
 return {origins:new Set(origins),issuer:auth.origin,jwksUrl:jwks.href,dataUrl:data.href.replace(/\/$/,"")};
}
export function createCloud({env,fetchImpl=fetch,now=()=>Date.now()}){
 const cfg=parseConfig(env);
 let keys=null,keysAt=0;
 async function verifyJwt(token){
  if(typeof token!=="string"||token.length>8192)throw Error("TOKEN_INVALID");
  const segments=token.split(".");
  if(segments.length!==3||segments.some(s=>!/^[a-zA-Z0-9_-]+$/.test(s)))throw Error("TOKEN_MALFORMED");
  const header=JSON.parse(decode(segments[0]).toString("utf8"));
  const claims=JSON.parse(decode(segments[1]).toString("utf8"));
  if(header.alg!=="EdDSA"||typeof header.kid!=="string"||!header.kid)throw Error("ALG_DENIED");
  if(!keys||now()-keysAt>300000){
   const response=await fetchImpl(cfg.jwksUrl,{headers:{accept:"application/json"},signal:AbortSignal.timeout(6000)});
   if(!response.ok)throw Error("JWKS_UNAVAILABLE");
   const body=await response.json();
   if(!Array.isArray(body.keys)||body.keys.length>32)throw Error("BAD_JWKS");
   keys=body.keys;keysAt=now();
  }
  const jwk=keys.find(k=>k.kid===header.kid&&k.kty==="OKP"&&k.crv==="Ed25519"&&k.x&&k.use!=="enc");
  if(!jwk)throw Error("UNKNOWN_KEY");
  const key=createPublicKey({key:{kty:"OKP",crv:"Ed25519",x:jwk.x},format:"jwk"});
  if(!verifySignature(null,Buffer.from(segments[0]+"."+segments[1]),key,decode(segments[2])))throw Error("INVALID_SIGNATURE");
  const secs=Math.floor(now()/1000);
  const aud=Array.isArray(claims.aud)?claims.aud:[claims.aud];
  if(claims.iss!==cfg.issuer||!aud.includes(cfg.issuer)||!finite(claims.exp)||claims.exp<=secs
    ||claims.exp>secs+1800||(claims.nbf!==undefined&&(!finite(claims.nbf)||claims.nbf>secs))
    ||(claims.iat!==undefined&&(!finite(claims.iat)||claims.iat>secs+60))
    ||typeof claims.sub!=="string"||!claims.sub||claims.sub.length>255
    ||claims.role!=="authenticated"||claims.emailVerified!==true)throw Error("CLAIMS_DENIED");
  return claims;
 }
 async function queryData(path,token,{method="GET",body}={}){
  const headers={Authorization:"Bearer "+token,"Accept-Profile":"chess_odyssey","Content-Type":"application/json"};
  if(method!=="GET")headers["Content-Profile"]="chess_odyssey";
  const res=await fetchImpl(cfg.dataUrl+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  let parsed=null;
  try{parsed=await res.json()}catch{}
  if(!res.ok){
   if(res.status===409||parsed?.code==="40001"||parsed?.message==="STALE_PROGRESS_REVISION")return {error:"REVISION_CONFLICT",status:409};
   return {error:"DATA_API_UNAVAILABLE",status:502};
  }
  return {data:parsed,status:200};
 }
 return Object.freeze({async fetch(request){
  let origin=request.headers.get("origin");
  if(origin&&!cfg.origins.has(origin))return asJson(403,{error:"ORIGIN_DENIED"});
  const cors=origin?{"Access-Control-Allow-Origin":origin,"Vary":"Origin","Access-Control-Allow-Headers":"authorization,content-type","Access-Control-Allow-Methods":"GET,PUT,OPTIONS"}:{};
  if(request.method==="OPTIONS")return origin?new Response(null,{status:204,headers:cors}):asJson(403,{error:"ORIGIN_REQUIRED"});
  if(request.headers.has("x-demo-user"))return asJson(400,{error:"TEST_IDENTITY_DENIED"},cors);
  const u=new URL(request.url);
  if(u.pathname==="/health"&&request.method==="GET")return asJson(200,{status:"staging",api:"chess-cloud",auth:"mandatory"},cors);
  if(!["/api/me","/api/progress"].includes(u.pathname))return asJson(404,{error:"NOT_FOUND"},cors);
  const auth=request.headers.get("authorization")||"";
  const match=/^Bearer ([a-zA-Z0-9_.-]+)$/.exec(auth);
  if(!match)return asJson(401,{error:"UNAUTHORIZED"},cors);
  let claims;
  try{claims=await verifyJwt(match[1])}catch{return asJson(401,{error:"UNAUTHORIZED"},cors)}
  if(u.pathname==="/api/me"){
   if(request.method!=="GET")return asJson(405,{error:"METHOD_NOT_ALLOWED"},cors);
   return asJson(200,{authenticated:true,user:{id:claims.sub}},cors);
  }
  if(request.method==="GET"){
   try{
    const q=await queryData("/user_progress?select=data_revision,progress_doc&user_id=eq."+encodeURIComponent(claims.sub)+"&limit=1",match[1]);
    if(q.error)return asJson(q.status,{error:q.error},cors);
    const row=q.data?.[0];
    return asJson(200,{revision:row?Number(row.data_revision):0,progressDoc:row?.progress_doc||null},cors);
   }catch{return asJson(502,{error:"DATA_API_UNAVAILABLE"},cors)}
  }
  if(request.method==="PUT"){
   let data;
   try{
    if(Number(request.headers.get("content-length")||"0")>131072)return asJson(413,{error:"DOCUMENT_TOO_LARGE"},cors);
    const raw=await request.text();
    if(raw.length>131072)return asJson(413,{error:"DOCUMENT_TOO_LARGE"},cors);
    data=JSON.parse(raw);
   }catch{return asJson(400,{error:"BAD_JSON"},cors)}
   if(!data||!finite(data.expectedRevision)||!data.progressDoc||typeof data.progressDoc!=="object"||Array.isArray(data.progressDoc))
     return asJson(422,{error:"INVALID_PROGRESS"},cors);
   try{
    const q=await queryData("/rpc/save_progress",match[1],{method:"POST",body:{p_expected_revision:data.expectedRevision,p_progress_doc:data.progressDoc}});
    if(q.error)return asJson(q.status,{error:q.error},cors);
    return asJson(200,{revision:Number(q.data?.data_revision),saved:q.data?.saved===true},cors);
   }catch{return asJson(502,{error:"DATA_API_UNAVAILABLE"},cors)}
  }
  return asJson(405,{error:"METHOD_NOT_ALLOWED"},cors);
 }});
}
const env=process.env;
const instance=env.NEON_AUTH_BASE_URL&&env.NEON_AUTH_JWKS_URL&&env.NEON_DATA_API_URL&&env.CHESS_ALLOWED_ORIGINS
 ? createCloud({env}) : null;
export default {fetch(request){return instance?instance.fetch(request):asJson(503,{error:"STAGING_CONFIGURATION_MISSING"});}};
