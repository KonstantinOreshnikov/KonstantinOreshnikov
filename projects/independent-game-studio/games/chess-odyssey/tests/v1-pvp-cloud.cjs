"use strict";
/* Genuine chess.js validation + signed EdDSA user tokens with in-process mock
 * PostgREST transport. NOT a live two-user Neon E2E substitute. */
const assert=require("node:assert/strict");
const {generateKeyPairSync,sign}=require("node:crypto");
const {pathToFileURL}=require("node:url");
(async()=>{
 const {createCloud}=await import(pathToFileURL(require.resolve("../functions/chesscloud/index.mjs")).href);
 const {Chess}=require("../vendor/chess.js");
 const {publicKey,privateKey}=generateKeyPairSync("ed25519");
 const jwk={...publicKey.export({format:"jwk"}),kid:"pvp-key"};
 const origin="https://neon-auth.qa.test",at=Date.parse("2026-11-23T12:00:00Z");
 const bearer={};const secret="s".repeat(48);
 for(const id of ["alice","bob","charlie"]){
  const hdr=Buffer.from(JSON.stringify({alg:"EdDSA",kid:"pvp-key"})).toString("base64url");
  const payload=Buffer.from(JSON.stringify({sub:id,iss:origin,aud:origin,iat:at/1000,exp:at/1000+900,role:"authenticated",emailVerified:true})).toString("base64url");
  bearer[id]=hdr+"."+payload+"."+sign(null,Buffer.from(hdr+"."+payload),privateKey).toString("base64url");
 }
 let invite=null,game=null,invites=[],games=[],moves=0;
 const rpcCalls=[];
 const dataFetch=async (url,options={})=>{
  if(url.endsWith("jwks.json"))return Response.json({keys:[jwk]});
  const uid=JSON.parse(Buffer.from(options.headers.Authorization.split(".")[1],"base64url").toString("utf8")).sub;
  const u=new URL(url),path=u.pathname,method=options.method||"GET";
  if(method==="GET"){
   if(path.endsWith("/games"))return Response.json(games.filter(g=>[g.white_user_id,g.black_user_id].includes(uid)).filter(g=>!u.searchParams.has("game_id")||"eq."+g.game_id===u.searchParams.get("game_id")));
   if(path.endsWith("/invites"))return Response.json(invites.filter(i=>[i.inviter_user_id,i.invited_user_id].includes(uid)));
   return Response.json([]);
  }
  const body=JSON.parse(options.body);
  if(body.p_secret!==secret)return Response.json({code:"28000",message:"DENIED"},{status:403});
  rpcCalls.push({method:path,uid,body});
  if(path.endsWith("/rpc/create_invite")){
   invite={invite_id:"11111111-1111-4111-8111-111111111111",inviter_user_id:uid,invited_user_id:body.p_invited_user_id,creator_color:body.p_creator_color,state:"pending",game_id:null,expires_at:"2026-11-24T12:00:00Z",token:body.p_invite_token,base_ms:body.p_base_ms,increment_ms:body.p_increment_ms};
   invites.push(invite);return Response.json({invite_id:invite.invite_id,state:"pending",expires_at:invite.expires_at});
  }
  if(path.endsWith("/rpc/accept_invite")){
   if(!invite||invite.token!==body.p_invite_token||invite.inviter_user_id===uid||invite.state!=="pending")return Response.json({code:"23505",message:"INVITE_USED"},{status:409});
   invite.state="accepted";invite.invited_user_id=uid;
   const c=new Chess();
   game={game_id:"22222222-2222-4222-8222-22222222222"+String(games.length+1),white_user_id:invite.creator_color==="w"?invite.inviter_user_id:uid,black_user_id:invite.creator_color==="b"?invite.inviter_user_id:uid,state:"active",version:0,canonical_fen:c.fen(),canonical_pgn:"",move_count:0,result:null,reason:null,base_ms:invite.base_ms,increment_ms:invite.increment_ms,created_at:new Date(at).toISOString()};
   games.push(game);invite.game_id=game.game_id;
   return Response.json({game_id:game.game_id,state:"active",version:0});
  }
  if(path.endsWith("/rpc/commit_move")){
   if(Number(game.version)!==body.p_expected_version)return Response.json({code:"40001",message:"STALE_GAME_VERSION"},{status:409});
   game.canonical_fen=body.p_new_fen;game.canonical_pgn=body.p_new_pgn;game.version++;game.move_count++;moves++;
   if(body.p_result){game.state="finished";game.result=body.p_result;game.reason=body.p_reason}
   return Response.json({game_id:game.game_id,version:game.version,fen:game.canonical_fen,san:body.p_san,duplicate:false});
  }
  if(path.endsWith("/rpc/draw_game")){
   if(body.p_expected_version!==game.version)return Response.json({code:"40001"},{status:409});
   if(body.p_action==="accept"){game.state="finished";game.result="1/2-1/2";game.reason="agreed-draw"}
   game.version++;return Response.json({game_id:game.game_id,version:game.version,draw_action:body.p_action});
  }
  if(path.endsWith("/rpc/resign_game")){
   if(body.p_expected_version!==game.version)return Response.json({code:"40001"},{status:409});
   game.state="finished";game.result=uid===game.white_user_id?"0-1":"1-0";game.reason="resignation";game.version++;
   return Response.json({game_id:game.game_id,result:game.result,version:game.version});
  }
  return Response.json({error:"unexpected"},{status:500});
 };
 const api=createCloud({env:{NEON_AUTH_BASE_URL:origin+"/auth",NEON_AUTH_JWKS_URL:origin+"/auth/.well-known/jwks.json",
 NEON_DATA_API_URL:"https://data.qa.test/chess_odyssey/rest/v1",CHESS_ALLOWED_ORIGINS:"https://konstantinoreshnikov.github.io",CHESS_RPC_SECRET:secret},fetchImpl:dataFetch,now:()=>at});
 const request=(id,action,body,method="POST")=>api.fetch(new Request("https://chess.qa.test/api/pvp/"+action,{
  method,headers:{origin:"https://konstantinoreshnikov.github.io",Authorization:"Bearer "+(bearer[id]||"invalid"),...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined}));
 let n=0;async function ok(label,fn){await fn();console.log("PASS Chess PvP Cloud "+(++n)+" "+label)}
 await ok("anonymous bearer rejected",async()=>assert.equal((await request("unknown","dashboard",null,"GET")).status,401));
 let token;
 await ok("Alice creates private 5-minute invitation",async()=>{
  const r=await request("alice","invite",{color:"w",preset:"blitz5",actorId:"bob"});assert.equal(r.status,200);
  const d=await r.json();assert.match(d.inviteToken,/^[\w-]{43}$/);token=d.inviteToken;
  assert.equal(invite.inviter_user_id,"alice");assert.equal(invite.base_ms,300000);
  assert.equal(rpcCalls.at(-1).body.actorId,undefined);
 });
 await ok("same user cannot accept own invite",async()=>assert.equal((await request("alice","accept",{inviteToken:token})).status,409));
 await ok("Bob accepts private invite",async()=>{
  let r=await request("bob","accept",{inviteToken:token});assert.equal(r.status,200);assert.equal(game.white_user_id,"alice");assert.equal(game.black_user_id,"bob");
 });
 await ok("Charlie cannot discover other players' games",async()=>{let r=await request("charlie","dashboard",null,"GET");assert.deepEqual((await r.json()).games,[])});
 await ok("Alice dashboard includes ongoing game",async()=>{let r=await request("alice","dashboard",null,"GET");assert.equal((await r.json()).games.length,1)});
 await ok("Bob cannot move before white",async()=>{let r=await request("bob","play",{gameId:game.game_id,expectedVersion:0,requestId:"11111111-2222-4222-8222-111111111111",from:"e7",to:"e5"});assert.equal(r.status,409)});
 await ok("illegal rook jump rejected before DB call",async()=>{let prior=rpcCalls.length;let r=await request("alice","play",{gameId:game.game_id,expectedVersion:0,requestId:"11111111-2222-4222-8222-111111111112",from:"a1",to:"a6"});assert.equal(r.status,422);assert.equal(rpcCalls.length,prior)});
 await ok("Alice legal e2-e4 committed",async()=>{let r=await request("alice","play",{gameId:game.game_id,expectedVersion:0,requestId:"11111111-2222-4222-8222-111111111113",from:"e2",to:"e4"});assert.equal(r.status,200);assert.equal(game.move_count,1);assert.match(game.canonical_pgn,/e4/)});
 await ok("Alice cannot make consecutive move",async()=>{let r=await request("alice","play",{gameId:game.game_id,expectedVersion:1,requestId:"11111111-2222-4222-8222-111111111114",from:"d2",to:"d4"});assert.equal(r.status,409)});
 await ok("Bob legal e7-e5 committed",async()=>{let r=await request("bob","play",{gameId:game.game_id,expectedVersion:1,requestId:"11111111-2222-4222-8222-111111111115",from:"e7",to:"e5"});assert.equal(r.status,200);assert.equal(game.move_count,2);assert.match(game.canonical_pgn,/e5/)});
 await ok("Stale version rejects competing move",async()=>assert.equal((await request("alice","play",{gameId:game.game_id,expectedVersion:0,requestId:"11111111-2222-4222-8222-111111111116",from:"g1",to:"f3"})).status,409));
 await ok("Third player cannot read private game by actual ID",async()=>assert.equal((await request("charlie","game?id="+game.game_id,null,"GET")).status,404));
 await ok("Alice offers draw",async()=>{let r=await request("alice","draw",{gameId:game.game_id,expectedVersion:2,action:"offer"});assert.equal(r.status,200);assert.equal(game.version,3)});
 await ok("Bob accepts draw",async()=>{let r=await request("bob","draw",{gameId:game.game_id,expectedVersion:3,action:"accept"});assert.equal(r.status,200);assert.equal(game.state,"finished");assert.equal(game.result,"1/2-1/2")});
 await ok("Finished game disallows play",async()=>assert.equal((await request("alice","play",{gameId:game.game_id,expectedVersion:4,requestId:"11111111-2222-4222-8222-111111111117",from:"g1",to:"f3"})).status,409));
 await ok("Alice creates targeted rematch",async()=>{let r=await request("alice","rematch",{gameId:game.game_id,expectedVersion:4});assert.equal(r.status,200);assert.equal(invite.invited_user_id,"bob");token=(await r.clone().json()).inviteToken});
 await ok("Bob accepts rematch with opposite colors",async()=>{let r=await request("bob","accept",{inviteToken:token});assert.equal(r.status,200);assert.equal(game.white_user_id,"bob");assert.equal(game.black_user_id,"alice")});
 await ok("Bob resigns second game",async()=>{let r=await request("bob","resign",{gameId:game.game_id,expectedVersion:0});assert.equal(r.status,200);assert.equal(game.result,"0-1")});
 await ok("PVP mock creates 2 persistent game rows",async()=>{assert.equal(games.length,2);assert.equal(moves,2)});
 await ok("browser preflight permits authenticated PvP POST",async()=>{
  const r=await api.fetch(new Request("https://chess.qa.test/api/pvp/invite",{method:"OPTIONS",headers:{origin:"https://konstantinoreshnikov.github.io","access-control-request-method":"POST","access-control-request-headers":"authorization,content-type"}}));
  assert.equal(r.status,204);assert.match(r.headers.get("access-control-allow-methods")||"",/(?:^|,)POST(?:,|$)/);
 });
 await ok("RU EN AZ PvP dynamic status labels are localized",async()=>{
  const fs=require("node:fs"),path=require("node:path");
  const source=fs.readFileSync(path.resolve(__dirname,"../pvp/pvp-ui.js"),"utf8");
  for(const label of ["Ожидающих приглашений: {count}","Pending invitations: {count}","Gözləyən dəvətlər: {count}"])assert.ok(source.includes(label));
  assert.ok(source.includes('tr("pendingInvites").replace("{count}",String(pending))'));
  assert.ok(source.includes('tr("stateFinished")'));
  assert.ok(!source.includes('length+" pending invitations"'));
 });
 console.log("PASS Chess PvP Cloud "+n+"/"+n);
})().catch(e=>{console.error(e);process.exitCode=1});
