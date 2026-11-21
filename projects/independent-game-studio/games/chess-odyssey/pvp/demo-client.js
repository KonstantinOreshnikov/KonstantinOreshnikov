/* B9 synthetic QA browser. All results come from server; JS cannot arbitrate. */
(()=>{
 "use strict";
 const $=id=>document.getElementById(id);
 const glyph={K:"♔",Q:"♕",R:"♖",B:"♗",N:"♘",P:"♙",k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟"};
 const params=new URLSearchParams(location.search),users=["alice","bob","charlie"];
 let actor=users.includes(params.get("user"))?params.get("user"):"alice";
 let gameId=sessionStorage.getItem("pvp-local-game-"+actor)||null;
 let snapshot=null,selected=null,loading=false;
 $("identity").value=actor;
 $("identity").addEventListener("change",()=>{
   const url=new URL(location.href);url.searchParams.set("user",$("identity").value);location.assign(url.href);
 });
 function message(value){$("notice").textContent=value;}
 async function api(path,body){
   const response=await fetch(path,{method:body?"POST":"GET",
     headers:{"X-Demo-User":actor,...(body?{"Content-Type":"application/json"}:{})},
     body:body?JSON.stringify(body):undefined,credentials:"omit"});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Request failed "+response.status);
   return result;
 }
 const cell=(square,piece,color)=>{
   const b=document.createElement("button");
   b.type="button";b.className="square "+(color?"dark":"light");
   b.dataset.square=square;
   b.textContent=glyph[piece]||"";
   b.setAttribute("aria-label",square+": "+(piece||"empty"));
   if(selected===square)b.classList.add("selected");
   b.disabled=!snapshot||snapshot.status!=="active"||snapshot.playerColor!==(snapshot.ply%2?"b":"w");
   b.addEventListener("click",()=>move(square,piece));
   return b;
 };
 function renderBoard(){
   const board=$("board");board.replaceChildren();
   const fen=(snapshot?.fen||"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR").split(" ")[0];
   const rows=fen.split("/"),flip=snapshot?.playerColor==="b";
   for(let y=0;y<8;y++){
     const raw=rows[flip?7-y:y],pieces=[];
     for(const v of raw)if(/^[1-8]$/.test(v))for(let n=0;n<Number(v);n++)pieces.push("");
     else pieces.push(v);
     if(pieces.length!==8)throw new Error("Invalid server FEN");
     for(let x=0;x<8;x++){
       const f=flip?7-x:x;
       const square="abcdefgh"[f]+(flip?y+1:8-y);
       board.appendChild(cell(square,pieces[f],(x+y)%2===0));
     }
   }
 }
 function format(ms){
   const total=Math.max(0,Math.ceil(ms/1000));
   const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;
   return (h?h+":"+String(m).padStart(2,"0"):String(m).padStart(2,"0"))+":"+String(s).padStart(2,"0");
 }
 function renderClock(){
   if(!snapshot?.clock?.baseMs){$("white-clock").textContent="∞";$("black-clock").textContent="∞";return;}
   const clock=snapshot.clock;
   for(const c of ["w","b"]){
     const elapsed=clock.active===c&&snapshot.status==="active"?Math.max(0,Date.now()-clock.at):0;
     const remain=Math.max(0,clock.remaining[c]-elapsed);
     const name=c==="w"?"white":"black";
     $(name+"-clock").textContent=format(remain);
   }
 }
 function renderGame(){
   $("game-title").textContent=snapshot?"Match "+snapshot.id.slice(0,8):"Waiting for a match";
   $("state").textContent=snapshot?.status||"";
   $("white-name").textContent=snapshot?.white||"White";
   $("black-name").textContent=snapshot?.black||"Black";
   $("score").textContent=snapshot?(snapshot.status==="finished"?
     "Result "+snapshot.result+" · "+snapshot.reason:
     "Turn: "+(snapshot.ply%2?"Black":"White")+" · Revision "+snapshot.revision):"No game selected.";
   $("pgn").textContent=snapshot?.pgn||"—";
   $("resign").disabled=!snapshot||snapshot.status!=="active";
   $("draw").disabled=!snapshot||snapshot.status!=="active";
   $("rematch").disabled=!snapshot||snapshot.status!=="finished";
   renderBoard();renderClock();
 }
 const tile=(title,meta,buttonText,action)=>{
   const node=document.createElement("div");node.className="tile";
   const label=document.createElement("strong"),hint=document.createElement("p"),button=document.createElement("button");
   label.textContent=title;hint.textContent=meta;button.textContent=buttonText;
   button.addEventListener("click",()=>action().catch(e=>message(e.message)));
   node.append(label,hint,button);return node;
 };
 async function refresh(){
   if(loading)return;loading=true;
   try{
     const dash=await api("/api/dashboard"),invites=$("invitations"),matches=$("matches");
     invites.replaceChildren();matches.replaceChildren();
     for(const entry of dash.invites.filter(i=>i.to===actor&&i.status==="pending")){
       invites.appendChild(tile("From "+entry.from,"Time "+entry.config.preset,"Accept",async()=>{
         const g=await api("/api/accept",{inviteId:entry.id});choose(g.id);message("Invitation accepted");
       }));
     }
     for(const g of dash.games){
       matches.appendChild(tile(g.white+" vs "+g.black,g.status+" · "+(g.result||g.ply+" plies"),"Open",async()=>{
         choose(g.id);await refreshGame();
       }));
     }
     if(gameId)await refreshGame();
   }catch(e){message("Refresh: "+e.message);}finally{loading=false;}
 }
 function choose(id){gameId=id;selected=null;sessionStorage.setItem("pvp-local-game-"+actor,id);}
 async function refreshGame(){
   try{snapshot=await api("/api/game?id="+encodeURIComponent(gameId));renderGame();}
   catch(e){snapshot=null;gameId=null;sessionStorage.removeItem("pvp-local-game-"+actor);renderGame();message(e.message);}
 }
 async function move(square,piece){
   if(!snapshot||snapshot.status!=="active")return;
   if(!selected){
     const own=piece&&(snapshot.playerColor==="w"?piece===piece.toUpperCase():piece===piece.toLowerCase());
     if(!own)return;
     selected=square;renderBoard();return;
   }
   if(square===selected){selected=null;renderBoard();return;}
   const from=selected;selected=null;
   try{
     snapshot=await api("/api/play",{gameId,expectedRevision:snapshot.revision,requestId:crypto.randomUUID(),from,to:square});
     renderGame();message("Move accepted by server");
   }catch(e){renderBoard();message(e.message);await refreshGame();}
 }
 $("invite").addEventListener("click",async()=>{
   const to=$("opponent").value;
   if(to===actor){message("Pick a different player");return;}
   try{const invite=await api("/api/invite",{to,creatorColor:$("color").value,preset:$("preset").value});
     message("Invite created: "+invite.id+" → "+to);await refresh();
   }catch(e){message(e.message);}
 });
 $("refresh").addEventListener("click",()=>refresh());
 $("resign").addEventListener("click",async()=>{
   if(!snapshot||!confirm("Resign this game?"))return;
   try{snapshot=await api("/api/resign",{gameId,expectedRevision:snapshot.revision});renderGame();message("Resigned");}
   catch(e){message(e.message);}
 });
 $("draw").addEventListener("click",async()=>{
   if(!snapshot)return;
   const action=snapshot.drawOffer&&snapshot.drawOffer!==actor?"accept":"offer";
   try{snapshot=await api("/api/draw",{gameId,expectedRevision:snapshot.revision,action});renderGame();message(action+" draw");}
   catch(e){message(e.message);}
 });
 $("rematch").addEventListener("click",async()=>{
   if(!snapshot)return;
   try{const v=await api("/api/rematch",{gameId});message("Rematch invite sent: "+v.id);await refresh();}
   catch(e){message(e.message);}
 });
 $("opponent").value=actor==="bob"?"alice":"bob";
 window.ChessPvPDevQA={get:()=>snapshot,refresh,choose};
 renderGame();refresh();setInterval(refresh,1200);setInterval(renderClock,250);
})();
