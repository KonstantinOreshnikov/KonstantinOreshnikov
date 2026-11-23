/* Chess Odyssey staging cloud API — Node 24 Neon Function, zero external deps.
 * Auth identity exclusively from verified Neon Better Auth EdDSA JWT.
 * Data API enforces independently configured PostgreSQL RLS for progress.
 */
import {createPublicKey,verify as verifySignature,randomBytes} from "node:crypto";
import ChessPackage from "../../vendor/chess.js";
import Clock from "../../clock-core.js";
const Chess=ChessPackage.Chess;

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
   const dbCode=parsed?.code||"";
   if(["40001","23505","23514"].includes(dbCode)||res.status===409)return {error:parsed?.message||"REVISION_CONFLICT",status:409};
   if(dbCode==="P0002")return {error:"NOT_FOUND",status:404};
   if(dbCode==="28000")return {error:"NOT_AUTHORIZED",status:403};
   if(dbCode==="22023")return {error:"INVALID_REQUEST",status:422};
   return {error:"DATA_API_UNAVAILABLE",status:502};
  }
  return {data:parsed,status:200};
 }

 const secret=env.CHESS_RPC_SECRET||"";
 const uuid=x=>typeof x==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
 const safeStr=x=>typeof x==="string"&&x.length>0&&x.length<256;
 async function fromDb(path,token){
  const out=await queryData(path,token);
  if(out.error)throw Object.assign(new Error(out.error),{status:out.status});
  return out.data;
 }
 async function callRpc(method,params,token){
  const out=await queryData("/rpc/"+method,token,{method:"POST",body:{p_secret:secret,...params}});
  if(out.error)throw Object.assign(new Error(out.error),{status:out.status});
  return out.data;
 }
 async function pvp(u,request,token,claims,cors){
  if(!secret||secret.length<40)return asJson(503,{error:"PVP_NOT_CONFIGURED"},cors);
  const action=u.pathname.slice("/api/pvp/".length);
  if(request.method==="GET"&&action==="dashboard"){
   try{
    const [games,invites]=await Promise.all([
     fromDb("/games?select=game_id,white_user_id,black_user_id,state,version,move_count,result,reason,created_at&order=created_at.desc&limit=40",token),
     fromDb("/invites?select=invite_id,inviter_user_id,invited_user_id,creator_color,state,game_id,expires_at&order=created_at.desc&limit=40",token)
    ]);
    return asJson(200,{games,invites},cors);
   }catch(e){return asJson(e.status||502,{error:e.message},cors)}
  }
  if(request.method==="GET"&&action==="game"){
   const id=u.searchParams.get("id");
   if(!uuid(id))return asJson(422,{error:"BAD_GAME_ID"},cors);
   try{
    const rows=await fromDb("/games?select=*&game_id=eq."+encodeURIComponent(id)+"&limit=1",token);
    if(!rows?.length)return asJson(404,{error:"NOT_FOUND"},cors);
    return asJson(200,{game:rows[0],playerColor:rows[0].white_user_id===claims.sub?"w":"b"},cors);
   }catch(e){return asJson(e.status||502,{error:e.message},cors)}
  }
  if(request.method!=="POST")return asJson(405,{error:"METHOD_NOT_ALLOWED"},cors);
  let args;
  try{const raw=await request.text();if(raw.length>8192)return asJson(413,{error:"REQUEST_TOO_LARGE"},cors);args=JSON.parse(raw)}
  catch{return asJson(400,{error:"BAD_JSON"},cors)}
  if(!args||typeof args!=="object"||Array.isArray(args))return asJson(400,{error:"BAD_JSON"},cors);
  try{
   if(action==="invite"){
    const config=Clock.config(args.preset||"none",args.minutes,args.increment);
    const creatorColor=args.color||"w";
    if(!["w","b"].includes(creatorColor))return asJson(422,{error:"BAD_COLOR"},cors);
    const inviteToken=randomBytes(32).toString("base64url");
    const rec=await callRpc("create_invite",{
     p_invite_token:inviteToken,p_creator_color:creatorColor,p_preset:config.preset,
     p_base_ms:config.baseMs,p_increment_ms:config.incrementMs,
     p_invited_user_id:safeStr(args.toUserId)?args.toUserId:null
    },token);
    return asJson(200,{...rec,inviteToken},cors);
   }
   if(action==="accept"){
    if(typeof args.inviteToken!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(args.inviteToken))
      return asJson(422,{error:"BAD_TOKEN"},cors);
    const rec=await callRpc("accept_invite",{p_invite_token:args.inviteToken},token);
    return asJson(200,rec,cors);
   }
   if(!uuid(args.gameId))return asJson(422,{error:"BAD_GAME_ID"},cors);
   const list=await fromDb("/games?select=*&game_id=eq."+encodeURIComponent(args.gameId)+"&limit=1",token);
   if(!list?.length)return asJson(404,{error:"NOT_FOUND"},cors);
   const game=list[0],color=game.white_user_id===claims.sub?"w":"b";
   if(claims.sub!==game.white_user_id&&claims.sub!==game.black_user_id)return asJson(404,{error:"NOT_FOUND"},cors);
   if(!finite(args.expectedVersion))return asJson(422,{error:"BAD_VERSION"},cors);
   if(action==="rematch"){
    if(game.state!=="finished")return asJson(409,{error:"GAME_ACTIVE"},cors);
    const inviteToken=randomBytes(32).toString("base64url");
    const rec=await callRpc("create_invite",{
     p_invite_token:inviteToken,p_creator_color:color==="w"?"b":"w",
     p_preset:game.base_ms>0?"custom":"none",
     p_base_ms:Number(game.base_ms),p_increment_ms:Number(game.increment_ms),
     p_invited_user_id:color==="w"?game.black_user_id:game.white_user_id
    },token);
    return asJson(200,{...rec,inviteToken},cors);
   }
   if(game.state!=="active")return asJson(409,{error:"GAME_FINISHED"},cors);
   if(Number(game.version)!==args.expectedVersion)return asJson(409,{error:"STALE_GAME_VERSION"},cors);
   const chess=new Chess();
   if(game.canonical_pgn&&!chess.load_pgn(game.canonical_pgn))return asJson(502,{error:"CORRUPT_PGN"},cors);
   if(chess.fen()!==game.canonical_fen)return asJson(502,{error:"STATE_MISMATCH"},cors);
   if(action==="resign"){
    const other=color==="w"?"b":"w";
    const noMate=Clock.cannotMate(other,chess.board());
    return asJson(200,await callRpc("resign_game",{p_game_id:args.gameId,p_expected_version:args.expectedVersion,p_no_mating_potential:noMate},token),cors);
   }
   if(action==="draw"){
    if(!["offer","accept","decline"].includes(args.action))return asJson(422,{error:"BAD_DRAW_ACTION"},cors);
    return asJson(200,await callRpc("draw_game",{p_game_id:args.gameId,p_expected_version:args.expectedVersion,p_action:args.action},token),cors);
   }
   if(action!=="play")return asJson(404,{error:"NOT_FOUND"},cors);
   if(!uuid(args.requestId)||typeof args.from!=="string"||typeof args.to!=="string"||
     !/^[a-h][1-8]$/.test(args.from)||!/^[a-h][1-8]$/.test(args.to)||
     (args.promotion!==undefined&&!["q","r","b","n"].includes(args.promotion)))
     return asJson(422,{error:"INVALID_MOVE"},cors);
   if(chess.turn()!==color)return asJson(409,{error:"NOT_YOUR_TURN"},cors);
   const opponent=color==="w"?"b":"w";
   const noMate=Clock.cannotMate(opponent,chess.board());
   const move=chess.move({from:args.from,to:args.to,promotion:args.promotion||"q"});
   if(!move)return asJson(422,{error:"ILLEGAL_MOVE"},cors);
   const over=chess.game_over();
   const result=over?(chess.in_checkmate()?(color==="w"?"1-0":"0-1"):"1/2-1/2"):null;
   const reason=over?(chess.in_checkmate()?"checkmate":"chess-draw"):null;
   const saved=await callRpc("commit_move",{
    p_game_id:args.gameId,p_request_id:args.requestId,p_expected_version:args.expectedVersion,
    p_from:move.from,p_to:move.to,p_promotion:move.promotion||null,p_san:move.san,
    p_new_fen:chess.fen(),p_new_pgn:chess.pgn(),p_result:result,p_reason:reason,p_timeout_draw:noMate
   },token);
   return asJson(200,saved,cors);
  }catch(e){return asJson(e.status||502,{error:e.message||"PVP_SERVER_ERROR"},cors)}
 }
 return Object.freeze({async fetch(request){
  let origin=request.headers.get("origin");
  if(origin&&!cfg.origins.has(origin))return asJson(403,{error:"ORIGIN_DENIED"});
  const cors=origin?{"Access-Control-Allow-Origin":origin,"Vary":"Origin","Access-Control-Allow-Headers":"authorization,content-type","Access-Control-Allow-Methods":"GET,PUT,POST,OPTIONS"}:{};
  if(request.method==="OPTIONS")return origin?new Response(null,{status:204,headers:cors}):asJson(403,{error:"ORIGIN_REQUIRED"});
  if(request.headers.has("x-demo-user"))return asJson(400,{error:"TEST_IDENTITY_DENIED"},cors);
  const u=new URL(request.url);
  if(u.pathname==="/health"&&request.method==="GET")return asJson(200,{status:"staging",api:"chess-cloud",auth:"mandatory"},cors);
  if(!["/api/me","/api/progress"].includes(u.pathname)&&!u.pathname.startsWith("/api/pvp/"))return asJson(404,{error:"NOT_FOUND"},cors);
  const auth=request.headers.get("authorization")||"";
  const match=/^Bearer ([a-zA-Z0-9_.-]+)$/.exec(auth);
  if(!match)return asJson(401,{error:"UNAUTHORIZED"},cors);
  let claims;
  try{claims=await verifyJwt(match[1])}catch{return asJson(401,{error:"UNAUTHORIZED"},cors)}
  if(u.pathname.startsWith("/api/pvp/"))return pvp(u,request,match[1],claims,cors);
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
