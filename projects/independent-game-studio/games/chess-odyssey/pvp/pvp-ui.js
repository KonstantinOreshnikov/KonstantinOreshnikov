/* Chess Odyssey v1.0 / PvP SPA UI. Only server-committed moves count. */
(function(root){
"use strict";
const $=id=>document.getElementById(id),FILES="abcdefgh";
const PI={wk:"♔",wq:"♕",wr:"♖",wb:"♗",wn:"♘",wp:"♙",bk:"♚",bq:"♛",br:"♜",bb:"♝",bn:"♞",bp:"♟"};
const locale={
ru:{overline:"ОНЛАЙН С ДРУГОМ · STAGING",heading:"Шахматная дуэль",info:"Для сетевой партии войдите в аккаунт во вкладке «Мой прогресс». Локальная игра работает отдельно.",invite:"Пригласить друга",time:"Контроль времени",color:"Ваш цвет",friend:"ID друга (необязательно)",create:"Создать приглашение",link:"Ссылка для друга",copy:"Скопировать ссылку",join:"Принять приглашение",token:"Секретный код приглашения",accept:"Принять и начать",games:"Мои партии",promote:"Превращение пешки",refresh:"Обновить",flip:"Повернуть доску",resign:"Сдаться",draw:"Предложить ничью",acceptDraw:"Принять ничью",rematch:"Реванш",offline:"Онлайн-PvP доступен только после включения защищённого сайта и входа в Neon.",wait:"Войдите, чтобы начать сетевую игру.",noGame:"Активная партия ещё не выбрана.",ready:"Партия открыта",yourTurn:"Ваш ход",opponent:"Ход соперника",finished:"Партия завершена",confirmResign:"Подтвердить сдачу партии?",confirmJoin:"Принять приглашение?",confirmDraw:"Предложить ничью?",copied:"Ссылка скопирована",created:"Скопируйте ссылку и отправьте другу",accepted:"Приглашение принято",error:"Ошибка сети. Попробуйте обновить.",notReady:"Партия ещё не активна",white:"Белые",black:"Чёрные",waiting:"Приглашения доступны после входа.",none:"Пока нет партий.",match:"Партия",emptySquare:"пустая клетка",state:"Статус",invalid:"Некорректная ссылка приглашения",moves:"Ходы",stateActive:"Активная",stateFinished:"Завершена",pendingInvites:"Ожидающих приглашений: {count}",yourWhite:"Белые",yourBlack:"Чёрные"},
en:{overline:"PLAY A FRIEND · STAGING",heading:"Chess duel",info:"Sign in on My Progress to play friends. Local chess stays available offline.",invite:"Invite a friend",time:"Time control",color:"Your color",friend:"Friend's user ID (optional)",create:"Create invitation",link:"Shareable link",copy:"Copy link",join:"Join invitation",token:"Private invitation token",accept:"Accept and start",games:"My games",promote:"Pawn promotion",refresh:"Refresh",flip:"Flip board",resign:"Resign",draw:"Offer draw",acceptDraw:"Accept draw",rematch:"Rematch",offline:"Online PvP is available only on the secure HTTPS site with Neon sign-in.",wait:"Sign in to start an online game.",noGame:"No active game selected.",ready:"Game opened",yourTurn:"Your turn",opponent:"Opponent to move",finished:"Game finished",confirmResign:"Confirm resignation?",confirmJoin:"Accept invitation?",confirmDraw:"Offer a draw?",copied:"Link copied",created:"Copy this link to your friend",accepted:"Invitation accepted",error:"Network error, please refresh.",notReady:"Game is not active",white:"White",black:"Black",waiting:"Invitations are available after login.",none:"No games yet.",match:"Game",emptySquare:"empty square",state:"Status",invalid:"Invalid invitation link",moves:"Moves",stateActive:"Active",stateFinished:"Finished",pendingInvites:"Pending invitations: {count}",yourWhite:"White",yourBlack:"Black"},
az:{overline:"DOSTLA OYNA · STAGING",heading:"Şahmat dueli",info:"Dostla oynamaq üçün «Mənim inkişafım» bölməsindən daxil olun. Lokal oyun ayrı işləyir.",invite:"Dostu dəvət et",time:"Vaxt nəzarəti",color:"Sizin rəng",friend:"Dostun ID-si (istəyə bağlı)",create:"Dəvət yarat",link:"Paylaşma linki",copy:"Linki kopyala",join:"Dəvəti qəbul et",token:"Gizli dəvət kodu",accept:"Qəbul et və başla",games:"Oyunlarım",promote:"Piyada çevrilməsi",refresh:"Yenilə",flip:"Lövhəni çevir",resign:"Təslim ol",draw:"Heç-heçə təklif et",acceptDraw:"Heç-heçəni qəbul et",rematch:"Təkrar oyun",offline:"Onlayn PvP yalnız təhlükəsiz HTTPS saytı və Neon girişi ilə mümkündür.",wait:"Onlayn oynamaq üçün hesabınıza daxil olun.",noGame:"Aktiv oyun seçilməyib.",ready:"Oyun açıldı",yourTurn:"Sizin gediş",opponent:"Rəqibin gedişi",finished:"Oyun başa çatdı",confirmResign:"Təslim olmağı təsdiqləyirsiniz?",confirmJoin:"Dəvəti qəbul edirsiniz?",confirmDraw:"Heç-heçə təklif edilsin?",copied:"Link kopyalandı",created:"Linki dostunuza göndərin",accepted:"Dəvət qəbul edildi",error:"Şəbəkə xətası. Yeniləyin.",notReady:"Oyun aktiv deyil",white:"Ağlar",black:"Qaralar",waiting:"Daxil olduqdan sonra dəvət yarada bilərsiniz.",none:"Hələ oyun yoxdur.",match:"Oyun",emptySquare:"boş xana",state:"Status",invalid:"Dəvət linki yanlışdır",moves:"Gedişlər",stateActive:"Aktiv",stateFinished:"Başa çatıb",pendingInvites:"Gözləyən dəvətlər: {count}",yourWhite:"Ağlar",yourBlack:"Qaralar"}
};
const ux={
 ru:{overline:"ОНЛАЙН С ДРУГОМ",info:"Войдите через Login наверху, создайте ссылку и отправьте её другу. Друг должен войти в свой аккаунт и принять приглашение.",advanced:"Дополнительно: пригласить конкретный ID",help:"Выберите цвет и контроль времени, создайте ссылку, затем отправьте её другу. ID не требуется.",joinHelp:"Откройте ссылку от друга. После входа нажмите «Принять и начать».",loginJoin:"Войти, чтобы принять",waitingFriend:"Ожидаем, пока друг откроет ссылку и примет приглашение…",joinReady:"Приглашение получено. Войдите, затем нажмите «Принять и начать».",started:"Друг присоединился — партия началась.",backendMissing:"Онлайн-партии пока не настроены на сервере (503). Сообщите администратору сайта.",loginNeeded:"Сначала войдите в аккаунт через кнопку Login.",invalidOrUsed:"Приглашение недействительно, уже принято или срок его действия истёк.",copy:"Скопируйте выделенную ссылку вручную."},
 en:{overline:"PLAY A FRIEND",info:"Use Login at the top, create an invitation link and send it to a friend. Your friend signs in with a separate account and accepts.",advanced:"Advanced: restrict to a specific user ID",help:"Choose color and time, create a link and share it. No user ID is needed.",joinHelp:"Open your friend's link, sign in and click Accept and start.",loginJoin:"Sign in to accept",waitingFriend:"Waiting for your friend to open and accept the invitation…",joinReady:"Invitation received. Sign in, then click Accept and start.",started:"Your friend joined — the game has started.",backendMissing:"Online play is not yet configured on the server (503). Contact the site administrator.",loginNeeded:"Sign in via the top Login button first.",invalidOrUsed:"Invitation is invalid, already used or expired.",copy:"Copy the selected link manually."},
 az:{overline:"DOSTLA OYNA",info:"Yuxarıdakı Login vasitəsilə daxil olun, dəvət linki yaradıb dostunuza göndərin. Dostunuz öz hesabına daxil olub qəbul etməlidir.",advanced:"Əlavə: konkret istifadəçi ID-si ilə dəvət",help:"Rəng və vaxt seçin, link yaradıb dostunuza göndərin. ID lazım deyil.",joinHelp:"Dostunuzun linkini açın, daxil olun və Qəbul et və başla düyməsinə basın.",loginJoin:"Qəbul etmək üçün daxil ol",waitingFriend:"Dostunuzun dəvəti qəbul etməsi gözlənilir…",joinReady:"Dəvət alındı. Daxil olun və Qəbul et və başla düyməsinə basın.",started:"Dostunuz qoşuldu — oyun başladı.",backendMissing:"Onlayn oyun serverdə hələ konfiqurasiya edilməyib (503). Administratorla əlaqə saxlayın.",loginNeeded:"Əvvəl yuxarıdakı Login ilə daxil olun.",invalidOrUsed:"Dəvət yanlışdır, artıq istifadə olunub və ya vaxtı bitib.",copy:"Seçilmiş linki əl ilə kopyalayın."}
};
for(const k of ["ru","en","az"])Object.assign(locale[k],ux[k]);
const captions={overline:"pvp-overline",heading:"pvp-heading",info:"pvp-information",invite:"pvp-invite-heading",time:"pvp-time-label",color:"pvp-color-label",friend:"pvp-friend-label",create:"pvp-create",link:"pvp-link-label",copy:"pvp-copy",join:"pvp-join-heading",token:"pvp-token-label",accept:"pvp-accept",games:"pvp-games-heading",promote:"pvp-promotion-label",refresh:"pvp-refresh",flip:"pvp-flip",resign:"pvp-resign",draw:"pvp-draw",acceptDraw:"pvp-accept-draw",rematch:"pvp-rematch"};
const lang=()=>["ru","en","az"].includes($("global-language")?.value)?$("global-language").value:"ru";
const tr=key=>(locale[lang()]||locale.ru)[key]||key;
const state={id:null,game:null,color:"w",flip:false,selected:null,keyboardSquare:"e2",pending:false,connected:false,waitingInviteId:null};
const api=()=>root.ChessCloud;
function status(s,err=false){const e=$("pvp-game-status");if(e){e.textContent=s;e.dataset.error=String(err)}}
function errorMessage(err){
 const raw=String(err?.message||err||"");
 if(/PVP_NOT_CONFIGURED|STAGING_CONFIGURATION_MISSING/.test(raw))return tr("backendMissing");
 if(/UNAUTHORIZED|SESSION_EXPIRED|MISSING_ACCOUNT/.test(raw))return tr("loginNeeded");
 if(/BAD_TOKEN|INVITE_EXPIRED|INVITE_USED|INVITE_REVOKED|INVITE_SELF|NOT_FOUND|TOKEN_INVALID/.test(raw))return tr("invalidOrUsed");
 return raw.length<170?raw:tr("error");
}
function showInvitation(){
 const match=location.hash.match(/^#invite=([A-Za-z0-9_-]{43})$/);
 if(!match)return false;
 $("pvp-invite-token").value=match[1];
 $("nav-pvp")?.click();
 $("pvp-accept-card")?.scrollIntoView?.({block:"nearest",behavior:"instant"});
 status(tr("joinReady"));
 return true;
}
function accountCues(){
 const signed=Boolean(api()?.authenticated?.());
 $("pvp-login").hidden=signed;
 $("pvp-accept").disabled=!signed;
 $("pvp-login").textContent=tr("loginJoin");
}
function translate(){
 for(const [word,id] of Object.entries(captions)){const el=$(id);if(el)el.textContent=tr(word)}
 $("pvp-advanced-title").textContent=tr("advanced");
 $("pvp-invite-help").textContent=tr("help");
 $("pvp-join-help").textContent=tr("joinHelp");
 if(!state.game&&!$("pvp-invite-token").value)status(api()?.authenticated()?tr("noGame"):tr("wait"));
 accountCues();render();
}
function gameEngine(){
 const chess=new Chess();
 const g=state.game;
 if(!g)return chess;
 if(g.canonical_pgn&&!chess.load_pgn(g.canonical_pgn))throw Error("CORRUPT_PGN");
 if(chess.fen()!==g.canonical_fen)throw Error("SERVER_STATE_MISMATCH");
 return chess;
}
function render(){
 const board=$("pvp-board");if(!board)return;
 const keepFocus=board.contains(document.activeElement);
 const chess=gameEngine(),g=state.game;
 const bottom=state.flip?(state.color==="w"?"b":"w"):state.color; // flipped orientation: invert side
 const reversed=bottom==="b",rows=chess.board(),frag=document.createDocumentFragment();
 for(let visualRank=0;visualRank<8;visualRank++){
  for(let visualFile=0;visualFile<8;visualFile++){
   const rank=reversed?visualRank:7-visualRank,file=reversed?7-visualFile:visualFile;
   const sq=FILES[file]+String(rank+1),p=rows[7-rank][file];
   const cell=document.createElement("button");cell.type="button";cell.className="square "+((file+rank)%2?"dark":"light");
   cell.dataset.square=sq;cell.tabIndex=sq===state.keyboardSquare?0:-1;
   cell.addEventListener("keydown",event=>{
    const jumps={ArrowUp:[0,1],ArrowDown:[0,-1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    const step=jumps[event.key];if(!step)return;
    event.preventDefault();const file=Math.min(7,Math.max(0,FILES.indexOf(sq[0])+(reversed?-step[0]:step[0])));
    const rank=Math.min(8,Math.max(1,Number(sq[1])+(reversed?-step[1]:step[1])));
    state.keyboardSquare=FILES[file]+rank;
    for(const node of board.querySelectorAll("button"))node.tabIndex=node.dataset.square===state.keyboardSquare?0:-1;
    board.querySelector("button[data-square="+state.keyboardSquare+"]")?.focus();
   });
   const legal=state.selected?chess.moves({square:state.selected,verbose:true}).some(m=>m.to===sq):false;
   if(sq===state.selected)cell.classList.add("selected");
   if(legal)cell.classList.add("legal");
   const turnOk=!!g&&g.state==="active"&&!state.pending&&chess.turn()===state.color;
   cell.setAttribute("aria-label",sq+" "+(p?(p.color==="w"?tr("white"):tr("black"))+" "+p.type:tr("emptySquare")));
   cell.setAttribute("aria-disabled",String(!turnOk));
   const symbol=document.createElement("span");symbol.className="piece";
   if(p){symbol.textContent=PI[p.color+p.type];symbol.dataset.code=p.color+p.type.toUpperCase();cell.classList.add(p.color==="w"?"white-piece":"black-piece")}
   cell.appendChild(symbol);cell.addEventListener("click",()=>pick(sq));frag.appendChild(cell);
  }
 }
 board.replaceChildren(frag);
 if(keepFocus)board.querySelector("button[data-square="+state.keyboardSquare+"]")?.focus();
 root.ChessAppearance?.apply?.(document);
 if(g){
  const clock=n=>n===null||n===undefined?"—":root.ChessClock?.format?.(Number(n))||"—";
  $("pvp-white-time").textContent=tr("white")+": "+clock(g.white_remaining_ms);
  $("pvp-black-time").textContent=tr("black")+": "+clock(g.black_remaining_ms);
  $("pvp-moves").textContent=tr("moves")+": "+(g.canonical_pgn||"—");
  if(g.state==="finished")status(tr("finished")+(g.result?" · "+g.result:""));
  else status((chess.turn()===state.color?tr("yourTurn"):tr("opponent"))+" · "+tr("match")+" "+g.game_id.slice(0,8));
 } else {$("pvp-moves").textContent=tr("none");$("pvp-white-time").textContent=tr("white")+": —";$("pvp-black-time").textContent=tr("black")+": —";}
 const active=g?.state==="active"&&!state.pending,finished=g?.state==="finished"&&!state.pending;
 $("pvp-resign").disabled=!active;$("pvp-draw").disabled=!active;
 $("pvp-accept-draw").disabled=!active||!g.draw_offered_by||g.draw_offered_by===api()?.user()?.id;
 $("pvp-rematch").disabled=!finished;
}
async function pick(sq){
 if(state.pending||!state.game||state.game.state!=="active"||!api()?.authenticated())return;
 let chess;
 try{chess=gameEngine()}catch(e){status(e.message,true);return;}
 if(chess.turn()!==state.color)return;
 const current=chess.get(sq);
 if(!state.selected){if(current&&current.color===state.color){state.selected=sq;render()}return;}
 if(sq===state.selected){state.selected=null;render();return;}
 if(current&&current.color===state.color){state.selected=sq;render();return;}
 const from=state.selected,to=sq;
 const legal=chess.moves({square:from,verbose:true}).find(x=>x.to===to);
 if(!legal){state.selected=null;render();return}
 state.selected=null;
 await command("play",{gameId:state.id,expectedVersion:Number(state.game.version),requestId:crypto.randomUUID(),from,to,
  ...(legal.flags.includes("p")?{promotion:$("pvp-promotion").value}: {})},true);
}
async function command(name,body,load=false){
 if(state.pending||!api()?.authenticated()){status(tr("wait"),true);return}
 state.pending=true;render();
 let feedback=null,failed=false;
 try{
  const resp=await api().api("/api/pvp/"+name,{method:"POST",body});
  if(load&&resp?.game_id){state.id=resp.game_id;await loadGame(state.id)}
  if(name==="invite"){
   const link=location.origin+location.pathname+"#invite="+encodeURIComponent(resp.inviteToken);
   $("pvp-invite-link").value=link;
   state.waitingInviteId=resp.invite_id||null;
   $("pvp-waiting").hidden=false;
   $("pvp-waiting").textContent=tr("waitingFriend");
   status(tr("created"));feedback=tr("created");
  }
  if(name==="accept"){
   state.id=resp.game_id;await loadGame(state.id);status(tr("accepted"));feedback=tr("accepted");
   history.replaceState(null,"",location.pathname+location.search);
   $("pvp-invite-token").value="";
  }
  if(["draw","resign","rematch"].includes(name)){if(name==="rematch"){const link=location.origin+location.pathname+"#invite="+encodeURIComponent(resp.inviteToken);$("pvp-invite-link").value=link;status(tr("created"));feedback=tr("created")}else await loadGame(state.id)}
  await dashboard();
 }catch(e){feedback=errorMessage(e);failed=true}
 finally{state.pending=false;render();if(feedback)status(feedback,failed)}
}
async function loadGame(id){
 const result=await api().api("/api/pvp/game?id="+encodeURIComponent(id));
 state.game=result.game;state.id=id;state.color=result.playerColor;
 state.selected=null;render();
}
async function dashboard(){
 if(!api()?.authenticated())return;
 try{
  const data=await api().api("/api/pvp/dashboard");
  const list=$("pvp-games"),frag=document.createDocumentFragment();
  for(const g of (data.games||[])){
   const button=document.createElement("button");button.type="button";button.textContent=tr("match")+" "+g.game_id.slice(0,8)+" · "+(g.state==="active"?tr("stateActive"):g.state==="finished"?tr("stateFinished"):g.state)+" · "+(g.result||"");
   button.dataset.active=String(g.game_id===state.id);
   button.addEventListener("click",()=>openGame(g.game_id));frag.appendChild(button);
  }
  list.replaceChildren(frag);
  if(!list.children.length)list.textContent=tr("none");
  const invites=data.invites||[];
  const pending=invites.filter(x=>x.state==="pending").length;
  $("pvp-invites").textContent=tr("pendingInvites").replace("{count}",String(pending));
  const accepted=invites.find(x=>x.invite_id===state.waitingInviteId&&x.game_id);
  if(accepted&&accepted.game_id&&!state.id){
   await loadGame(accepted.game_id);state.waitingInviteId=null;
   $("pvp-waiting").hidden=true;
   status(tr("started"));
  }
 }catch(e){status(errorMessage(e),true)}
}
async function openGame(id){if(!api()?.authenticated())return;try{await loadGame(id)}catch(e){status(e.message,true)}}
async function refresh(){
 if($("pvp-view")?.hidden||!api()?.authenticated()){if(!api()?.authenticated()){state.id=null;state.game=null;render()}return}
 try{if(state.id)await loadGame(state.id);await dashboard()}catch(e){status(errorMessage(e),true)}
}
function bind(id,action){$(id)?.addEventListener("click",action)}
function init(){
 if(!$("pvp-view"))return;
 translate();
 $("global-language")?.addEventListener("change",translate);
 root.addEventListener("chess-cloud-session",()=>{
  accountCues();
  if(!api()?.authenticated()){state.game=null;state.id=null;render();status($("pvp-invite-token").value?tr("joinReady"):tr("wait"))}
  else refresh();
 });
 bind("pvp-refresh",refresh);
 bind("pvp-login",()=>{$("header-login")?.click()});
 bind("pvp-flip",()=>{state.flip=!state.flip;render()});
 bind("pvp-create",()=>command("invite",{color:$("pvp-color").value,preset:$("pvp-time").value,
  ...( $("pvp-friend").value.trim()?{toUserId:$("pvp-friend").value.trim()}:{})}));
 bind("pvp-accept",()=>{const token=$("pvp-invite-token").value.trim();if(!/^[A-Za-z0-9_-]{43}$/.test(token)){status(tr("invalid"),true);return}command("accept",{inviteToken:token},true)});
 bind("pvp-copy",async()=>{const link=$("pvp-invite-link").value;if(!link)return;try{await navigator.clipboard.writeText(link);status(tr("copied"))}catch{$("pvp-invite-link").select();status(tr("copy"))}});
 bind("pvp-resign",()=>{if(state.game&&root.confirm(tr("confirmResign")))command("resign",{gameId:state.id,expectedVersion:Number(state.game.version)})});
 bind("pvp-draw",()=>{if(state.game&&root.confirm(tr("confirmDraw")))command("draw",{gameId:state.id,expectedVersion:Number(state.game.version),action:"offer"})});
 bind("pvp-accept-draw",()=>{if(state.game)command("draw",{gameId:state.id,expectedVersion:Number(state.game.version),action:"accept"})});
 bind("pvp-rematch",()=>{if(state.game)command("rematch",{gameId:state.id,expectedVersion:Number(state.game.version)})});
 root.addEventListener("hashchange",showInvitation);
 showInvitation();
 accountCues();render();
 root.ChessPvp=Object.freeze({refresh});
 root.setInterval(()=>{if(!document.hidden&&$("pvp-view")&&!$("pvp-view").hidden&&!state.pending)refresh()},6500);
 if(api()?.authenticated())refresh();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})(window);
