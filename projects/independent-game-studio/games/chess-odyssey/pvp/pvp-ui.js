/* Chess Odyssey v1.0 / PvP SPA UI. Only server-committed moves count. */
(function(root){
"use strict";
const $=id=>document.getElementById(id),FILES="abcdefgh";
const PI={wk:"♔",wq:"♕",wr:"♖",wb:"♗",wn:"♘",wp:"♙",bk:"♚",bq:"♛",br:"♜",bb:"♝",bn:"♞",bp:"♟"};
const locale={
ru:{overline:"ОНЛАЙН С ДРУГОМ",heading:"Шахматная дуэль",info:"Для сетевой партии войдите в аккаунт во вкладке «Мой прогресс». Локальная игра работает отдельно.",invite:"Пригласить друга",time:"Контроль времени",color:"Ваш цвет",friend:"ID друга (необязательно)",create:"Создать приглашение",link:"Ссылка для друга",copy:"Скопировать ссылку",join:"Принять приглашение",token:"Секретный код приглашения",accept:"Принять и начать",games:"Мои партии",promote:"Превращение пешки",refresh:"Обновить",flip:"Повернуть доску",resign:"Сдаться",draw:"Предложить ничью",acceptDraw:"Принять ничью",rematch:"Реванш",offline:"Онлайн-PvP доступен только после включения защищённого сайта и входа в Neon.",wait:"Войдите, чтобы начать сетевую игру.",noGame:"Активная партия ещё не выбрана.",ready:"Партия открыта",yourTurn:"Ваш ход",opponent:"Ход соперника",finished:"Партия завершена",confirmResign:"Подтвердить сдачу партии?",confirmJoin:"Принять приглашение?",confirmDraw:"Предложить ничью?",copied:"Ссылка скопирована",created:"Скопируйте ссылку и отправьте другу",accepted:"Приглашение принято",error:"Ошибка сети. Попробуйте обновить.",notReady:"Партия ещё не активна",white:"Белые",black:"Чёрные",waiting:"Приглашения доступны после входа.",none:"Пока нет партий.",match:"Партия",emptySquare:"пустая клетка",state:"Статус",invalid:"Некорректная ссылка приглашения",moves:"Ходы",stateActive:"Активная",stateFinished:"Завершена",pendingInvites:"Ожидающих приглашений: {count}",yourWhite:"Белые",yourBlack:"Чёрные"},
en:{overline:"PLAY A FRIEND",heading:"Chess duel",info:"Sign in on My Progress to play friends. Local chess stays available offline.",invite:"Invite a friend",time:"Time control",color:"Your color",friend:"Friend's user ID (optional)",create:"Create invitation",link:"Shareable link",copy:"Copy link",join:"Join invitation",token:"Private invitation token",accept:"Accept and start",games:"My games",promote:"Pawn promotion",refresh:"Refresh",flip:"Flip board",resign:"Resign",draw:"Offer draw",acceptDraw:"Accept draw",rematch:"Rematch",offline:"Online PvP is available only on the secure HTTPS site with Neon sign-in.",wait:"Sign in to start an online game.",noGame:"No active game selected.",ready:"Game opened",yourTurn:"Your turn",opponent:"Opponent to move",finished:"Game finished",confirmResign:"Confirm resignation?",confirmJoin:"Accept invitation?",confirmDraw:"Offer a draw?",copied:"Link copied",created:"Copy this link to your friend",accepted:"Invitation accepted",error:"Network error, please refresh.",notReady:"Game is not active",white:"White",black:"Black",waiting:"Invitations are available after login.",none:"No games yet.",match:"Game",emptySquare:"empty square",state:"Status",invalid:"Invalid invitation link",moves:"Moves",stateActive:"Active",stateFinished:"Finished",pendingInvites:"Pending invitations: {count}",yourWhite:"White",yourBlack:"Black"},
az:{overline:"DOSTLA OYNA",heading:"Şahmat dueli",info:"Dostla oynamaq üçün «Mənim inkişafım» bölməsindən daxil olun. Lokal oyun ayrı işləyir.",invite:"Dostu dəvət et",time:"Vaxt nəzarəti",color:"Sizin rəng",friend:"Dostun ID-si (istəyə bağlı)",create:"Dəvət yarat",link:"Paylaşma linki",copy:"Linki kopyala",join:"Dəvəti qəbul et",token:"Gizli dəvət kodu",accept:"Qəbul et və başla",games:"Oyunlarım",promote:"Piyada çevrilməsi",refresh:"Yenilə",flip:"Lövhəni çevir",resign:"Təslim ol",draw:"Heç-heçə təklif et",acceptDraw:"Heç-heçəni qəbul et",rematch:"Təkrar oyun",offline:"Onlayn PvP yalnız təhlükəsiz HTTPS saytı və Neon girişi ilə mümkündür.",wait:"Onlayn oynamaq üçün hesabınıza daxil olun.",noGame:"Aktiv oyun seçilməyib.",ready:"Oyun açıldı",yourTurn:"Sizin gediş",opponent:"Rəqibin gedişi",finished:"Oyun başa çatdı",confirmResign:"Təslim olmağı təsdiqləyirsiniz?",confirmJoin:"Dəvəti qəbul edirsiniz?",confirmDraw:"Heç-heçə təklif edilsin?",copied:"Link kopyalandı",created:"Linki dostunuza göndərin",accepted:"Dəvət qəbul edildi",error:"Şəbəkə xətası. Yeniləyin.",notReady:"Oyun aktiv deyil",white:"Ağlar",black:"Qaralar",waiting:"Daxil olduqdan sonra dəvət yarada bilərsiniz.",none:"Hələ oyun yoxdur.",match:"Oyun",emptySquare:"boş xana",state:"Status",invalid:"Dəvət linki yanlışdır",moves:"Gedişlər",stateActive:"Aktiv",stateFinished:"Başa çatıb",pendingInvites:"Gözləyən dəvətlər: {count}",yourWhite:"Ağlar",yourBlack:"Qaralar"}
};
const ux={
 ru:{overline:"ОНЛАЙН С ДРУГОМ",info:"Войдите через Login наверху, создайте ссылку и отправьте её другу. Друг должен войти в свой аккаунт и принять приглашение.",advanced:"Дополнительно: пригласить конкретный ID",help:"Выберите цвет и контроль времени, создайте ссылку, затем отправьте её другу. ID не требуется.",joinHelp:"Откройте ссылку от друга. После входа нажмите «Принять и начать».",loginJoin:"Войти, чтобы принять",waitingFriend:"Ожидаем, пока друг откроет ссылку и примет приглашение…",joinReady:"Приглашение получено. Войдите, затем нажмите «Принять и начать».",started:"Друг присоединился — партия началась.",backendMissing:"Онлайн-партии пока не настроены на сервере (503). Сообщите администратору сайта.",loginNeeded:"Сначала войдите в аккаунт через кнопку Login.",invalidOrUsed:"Приглашение недействительно, уже принято или срок его действия истёк.",copyFallback:"Скопируйте выделенную ссылку вручную."},
 en:{overline:"PLAY A FRIEND",info:"Use Login at the top, create an invitation link and send it to a friend. Your friend signs in with a separate account and accepts.",advanced:"Advanced: restrict to a specific user ID",help:"Choose color and time, create a link and share it. No user ID is needed.",joinHelp:"Open your friend's link, sign in and click Accept and start.",loginJoin:"Sign in to accept",waitingFriend:"Waiting for your friend to open and accept the invitation…",joinReady:"Invitation received. Sign in, then click Accept and start.",started:"Your friend joined — the game has started.",backendMissing:"Online play is not yet configured on the server (503). Contact the site administrator.",loginNeeded:"Sign in via the top Login button first.",invalidOrUsed:"Invitation is invalid, already used or expired.",copyFallback:"Copy the selected link manually."},
 az:{overline:"DOSTLA OYNA",info:"Yuxarıdakı Login vasitəsilə daxil olun, dəvət linki yaradıb dostunuza göndərin. Dostunuz öz hesabına daxil olub qəbul etməlidir.",advanced:"Əlavə: konkret istifadəçi ID-si ilə dəvət",help:"Rəng və vaxt seçin, link yaradıb dostunuza göndərin. ID lazım deyil.",joinHelp:"Dostunuzun linkini açın, daxil olun və Qəbul et və başla düyməsinə basın.",loginJoin:"Qəbul etmək üçün daxil ol",waitingFriend:"Dostunuzun dəvəti qəbul etməsi gözlənilir…",joinReady:"Dəvət alındı. Daxil olun və Qəbul et və başla düyməsinə basın.",started:"Dostunuz qoşuldu — oyun başladı.",backendMissing:"Onlayn oyun serverdə hələ konfiqurasiya edilməyib (503). Administratorla əlaqə saxlayın.",loginNeeded:"Əvvəl yuxarıdakı Login ilə daxil olun.",invalidOrUsed:"Dəvət yanlışdır, artıq istifadə olunub və ya vaxtı bitib.",copyFallback:"Seçilmiş linki əl ilə kopyalayın."}
};
const extra={
 ru:{untimed:"Без часов",bullet:"Пуля",blitz:"Блиц",rapid:"Рапид",q:"Ферзь",r:"Ладья",b:"Слон",n:"Конь",k:"Король",p:"Пешка",board:"Сетевая шахматная доска",gameList:"Мои активные и завершённые партии",userId:"ID пользователя",reconnecting:"Восстанавливаем соединение…",sending:"Отправляем ход…",stale:"Состояние партии изменилось. Синхронизируем…",illegal:"Недопустимый ход",badState:"Не удалось проверить состояние партии. Повторяем синхронизацию.",denied:"Доступ к партии недоступен",error:"Ошибка соединения. Повторяем синхронизацию.",unknown:"Ошибка операции. Повторите попытку.",loginNeeded:"Сначала войдите в аккаунт.",info:"Войдите в аккаунт, создайте ссылку и отправьте её другу. Друг входит в отдельный аккаунт и принимает приглашение."},
 en:{untimed:"Untimed",bullet:"Bullet",blitz:"Blitz",rapid:"Rapid",q:"Queen",r:"Rook",b:"Bishop",n:"Knight",k:"King",p:"Pawn",board:"Online chessboard",gameList:"My active and finished games",userId:"User ID",reconnecting:"Reconnecting…",sending:"Sending move…",stale:"Game state changed. Synchronizing…",illegal:"Illegal move",badState:"Unable to verify game state. Resynchronizing.",denied:"Game access unavailable",error:"Connection error. Resynchronizing.",unknown:"Operation failed. Please try again.",loginNeeded:"Sign in to your account first."},
 az:{untimed:"Vaxtsız",bullet:"Güllə",blitz:"Blits",rapid:"Rapid",q:"Vəzir",r:"Top",b:"Fil",n:"At",k:"Şah",p:"Piyada",board:"Onlayn şahmat lövhəsi",gameList:"Aktiv və bitmiş oyunlarım",userId:"İstifadəçi ID-si",reconnecting:"Bağlantı bərpa olunur…",sending:"Gediş göndərilir…",stale:"Oyun vəziyyəti dəyişdi. Sinxronlaşdırılır…",illegal:"Qaydasız gediş",badState:"Oyun vəziyyəti yoxlanmadı. Yenidən sinxronlaşdırılır.",denied:"Oyuna giriş mümkün deyil",error:"Bağlantı xətası. Sinxronlaşdırılır.",unknown:"Əməliyyat alınmadı. Yenidən cəhd edin.",loginNeeded:"Əvvəl hesabınıza daxil olun.",info:"Hesabınıza daxil olun, link yaradın və dostunuza göndərin. Dostunuz öz hesabına daxil olub dəvəti qəbul etməlidir."}
};
for(const k of ["ru","en","az"])Object.assign(locale[k],ux[k],extra[k]);
const panelLocale={
 ru:{turnW:"Ход белых",turnB:"Ход чёрных",captured:"Потери",noCaptures:"Нет взятых фигур",win:"Вы победили",loss:"Вы проиграли",drawResult:"Ничья",whiteWins:"Белые победили",blackWins:"Чёрные победили",mate:"Мат",timeout:"Время истекло",resignation:"Сдача",agreedDraw:"Ничья по соглашению",stalemate:"Пат",repetition:"Повторение позиции",fiftyMove:"Правило 50 ходов",insufficient:"Недостаточно материала",otherReason:"Партия завершена",review:"Разбор партии",close:"Закрыть",analyze:"Анализ Stockfish",cancel:"Отменить анализ",analyzing:"Анализ",analysisError:"Не удалось выполнить анализ",accuracy:"Точность (оценка Stockfish)",unknownGrade:"Нет оценки",bestMove:"Лучший ход",first:"Начальная позиция",prev:"Предыдущий ход",next:"Следующий ход",last:"Последняя позиция",reviewTitle:"Послематчевый разбор",best:"Лучший",excellent:"Отличный",good:"Хороший",ordinary:"Обычный",inaccuracy:"Неточность",mistake:"Ошибка",blunder:"Грубая ошибка",unknown:"Нет оценки"},
 en:{turnW:"White to move",turnB:"Black to move",captured:"Captured pieces",noCaptures:"No captured pieces",win:"You won",loss:"You lost",drawResult:"Draw",whiteWins:"White wins",blackWins:"Black wins",mate:"Checkmate",timeout:"Time expired",resignation:"Resignation",agreedDraw:"Draw by agreement",stalemate:"Stalemate",repetition:"Repetition",fiftyMove:"50-move rule",insufficient:"Insufficient material",otherReason:"Game finished",review:"Game review",close:"Close",analyze:"Stockfish analysis",cancel:"Cancel analysis",analyzing:"Analyzing",analysisError:"Analysis failed",accuracy:"Accuracy (Stockfish estimate)",unknownGrade:"Not assessed",bestMove:"Best move",first:"First position",prev:"Previous move",next:"Next move",last:"Last position",reviewTitle:"Post-game review",best:"Best",excellent:"Excellent",good:"Good",ordinary:"Ordinary",inaccuracy:"Inaccuracy",mistake:"Mistake",blunder:"Blunder",unknown:"Not assessed"},
 az:{turnW:"Ağların gedişi",turnB:"Qaraların gedişi",captured:"İtirilmiş fiqurlar",noCaptures:"Vurulmuş fiqur yoxdur",win:"Qalib gəldiniz",loss:"Məğlub oldunuz",drawResult:"Heç-heçə",whiteWins:"Ağlar qalib gəldi",blackWins:"Qaralar qalib gəldi",mate:"Mat",timeout:"Vaxt bitdi",resignation:"Təslim olma",agreedDraw:"Razılaşma ilə heç-heçə",stalemate:"Pat",repetition:"Mövqenin təkrarlanması",fiftyMove:"50 gediş qaydası",insufficient:"Fiqurlar kifayət etmir",otherReason:"Oyun başa çatdı",review:"Partiyanın təhlili",close:"Bağla",analyze:"Stockfish təhlili",cancel:"Təhlili dayandır",analyzing:"Təhlil edilir",analysisError:"Təhlil alınmadı",accuracy:"Dəqiqlik (Stockfish qiymətləndirməsi)",unknownGrade:"Qiymətləndirilməyib",bestMove:"Ən yaxşı gediş",first:"İlkin mövqe",prev:"Əvvəlki gediş",next:"Növbəti gediş",last:"Son mövqe",reviewTitle:"Partiyadan sonrakı təhlil",best:"Ən yaxşı",excellent:"Əla",good:"Yaxşı",ordinary:"Adi",inaccuracy:"Qeyri-dəqiqlik",mistake:"Səhv",blunder:"Kobud səhv",unknown:"Qiymətləndirilməyib"}
};
for(const k of ["ru","en","az"])Object.assign(locale[k],panelLocale[k]);
locale.ru.info="Войдите в аккаунт, создайте ссылку и отправьте её другу. Друг должен войти в свой аккаунт и принять приглашение.";
const captions={overline:"pvp-overline",heading:"pvp-heading",info:"pvp-information",invite:"pvp-invite-heading",time:"pvp-time-label",color:"pvp-color-label",friend:"pvp-friend-label",create:"pvp-create",link:"pvp-link-label",copy:"pvp-copy",join:"pvp-join-heading",token:"pvp-token-label",accept:"pvp-accept",games:"pvp-games-heading",promote:"pvp-promotion-label",refresh:"pvp-refresh",flip:"pvp-flip",resign:"pvp-resign",draw:"pvp-draw",acceptDraw:"pvp-accept-draw",rematch:"pvp-rematch"};
const lang=()=>["ru","en","az"].includes($("global-language")?.value)?$("global-language").value:"ru";
const tr=key=>(locale[lang()]||locale.ru)[key]||key;
const state={id:null,game:null,color:"w",flip:false,selected:null,keyboardSquare:"e2",pending:false,connected:false,waitingInviteId:null};
let owner=null,epoch=0,refreshing=null,lastDashboard=0,recovering=false,notice=null,clockAnchor=null;
let cache=null,reviewPly=null,reviewReport=null,reviewWorker=null,reviewToken=0,reviewProgress=null,resultSeen=null;
const latency={read:[],move:[],render:[]};
function recordLatency(key,start){const list=latency[key];list.push(Math.max(0,performance.now()-start));if(list.length>120)list.shift()}
function latencySnapshot(){return Object.fromEntries(Object.entries(latency).map(([key,values])=>{const sorted=values.slice().sort((a,b)=>a-b);return [key,{count:sorted.length,p50:sorted.length?Math.round(sorted[Math.ceil(sorted.length*.5)-1]):null,p95:sorted.length?Math.round(sorted[Math.ceil(sorted.length*.95)-1]):null}]}))}
function resetReview(){reviewToken++;reviewWorker?.dispose();reviewWorker=null;reviewPly=null;reviewReport=null;reviewProgress=null;resultSeen=null;cache=null;$("pvp-result")?.close();if($("pvp-review-panel"))$("pvp-review-panel").hidden=true}

const ACTIVE_PREFIX="chess-odyssey-pvp-active-v1:";
const uuid=x=>typeof x==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
const accountId=()=>api()?.user()?.id||null;
function remembered(){try{return owner&&localStorage.getItem(ACTIVE_PREFIX+owner)}catch{return null}}
function remember(id){try{if(owner&&uuid(id))localStorage.setItem(ACTIVE_PREFIX+owner,id)}catch{}}
function forget(){try{if(owner)localStorage.removeItem(ACTIVE_PREFIX+owner)}catch{}}
function setNotice(key,err=false){notice=key?{key,err}:null;if(notice)status(tr(key),err)}
function applyNotice(){if(notice)status(tr(notice.key),notice.err)}
function current(e,who){return e===epoch&&who===owner&&who===accountId()}
function accountChanged(){
 const next=accountId();
 if(next===owner)return false;
 epoch++;resetReview();owner=next;state.id=null;state.game=null;state.selected=null;state.pending=false;
 state.waitingInviteId=null;state.connected=false;lastDashboard=0;notice=null;clockAnchor=null;recovering=false;refreshing=null;
 games=[];invites=[];renderList();$("pvp-invite-link").value="";$("pvp-waiting").hidden=true;
 return true;
}

const api=()=>root.ChessCloud;
function status(s,err=false){const e=$("pvp-game-status");if(e){e.textContent=s;e.dataset.error=String(err)}}
function errorKey(err){
 const raw=String(err?.message||err||"");
 if(/PVP_NOT_CONFIGURED|STAGING_CONFIGURATION_MISSING/.test(raw))return "backendMissing";
 if(/UNAUTHORIZED|SESSION_EXPIRED|MISSING_ACCOUNT/.test(raw))return "loginNeeded";
 if(/BAD_TOKEN|INVALID_INVITE|INVITE_EXPIRED|INVITE_USED|INVITE_REVOKED|INVITE_SELF|TOKEN_INVALID/.test(raw))return "invalidOrUsed";
 if(/STALE_GAME_VERSION|NOT_YOUR_TURN|GAME_FINISHED|40001/.test(raw))return "stale";
 if(/ILLEGAL_MOVE|INVALID_MOVE/.test(raw))return "illegal";
 if(/CORRUPT_PGN|STATE_MISMATCH|INVALID_GAME_RESPONSE/.test(raw))return "badState";
 if(/NOT_FOUND|FORBIDDEN/.test(raw))return "denied";
 return /TIMEOUT|NETWORK|fetch|AbortError|503|502|504/i.test(raw)?"error":"unknown";
}
function showInvitation(){
 const match=location.hash.match(/^#invite=([A-Za-z0-9_-]{43})$/);
 if(!match)return false;
 $("pvp-invite-token").value=match[1];
 $("nav-pvp")?.click();
 $("pvp-accept-card")?.scrollIntoView?.({block:"nearest",behavior:"instant"});
 setNotice("joinReady");
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
 if(!state.game&&!$("pvp-invite-token").value&&!notice)status(api()?.authenticated()?tr("noGame"):tr("wait"));
 for(const o of $("pvp-time").options){const m=o.value.match(/^(blitz|rapid|bullet)(\d+)(10)?$/);o.textContent=o.value==="none"?tr("untimed"):tr(m?.[1]||"rapid")+" · "+({blitz5:"5+0",blitz3:"3+0",rapid10:"10+0",rapid1510:"15+10",rapid30:"30+0"}[o.value]||o.value);}
 for(const o of $("pvp-color").options)o.textContent=tr(o.value==="w"?"white":"black");
 for(const o of $("pvp-promotion").options)o.textContent=tr(o.value);
 $("pvp-board").setAttribute("aria-label",tr("board"));$("pvp-games").setAttribute("aria-label",tr("gameList"));
 $("pvp-friend").placeholder=tr("userId");$("pvp-invite-link").setAttribute("aria-label",tr("link"));
 if(!$("pvp-waiting").hidden)$("pvp-waiting").textContent=tr("waitingFriend");
 renderList();accountCues();render();applyNotice();
}
function canonical(g){
 if(!g)return {chess:new Chess(),moves:[]};
 if(cache&&cache.id===g.game_id&&cache.pgn===g.canonical_pgn&&cache.fen===g.canonical_fen)return cache;
 const chess=new Chess();
 if(g.canonical_pgn&&!chess.load_pgn(g.canonical_pgn))throw Error("CORRUPT_PGN");
 if(chess.fen()!==g.canonical_fen)throw Error("SERVER_STATE_MISMATCH");
 return cache={id:g.game_id,pgn:g.canonical_pgn,fen:g.canonical_fen,chess,moves:chess.history({verbose:true})};
}
function gameEngine(){return canonical(state.game).chess}
function captured(moves,color){
 const counts={};for(const m of moves)if(m.color!==color&&m.captured)counts[m.captured]=(counts[m.captured]||0)+1;
 const holder=$("pvp-"+(color==="w"?"white":"black")+"-captured");holder.replaceChildren();
 for(const kind of ["q","r","b","n","p"]){const n=counts[kind];if(!n)continue;const chip=document.createElement("span");chip.className="pvp-capture";chip.dataset.piece=kind;chip.dataset.count=String(n);chip.textContent=PI[color+kind]+(n>1?" ×"+n:"");chip.title=tr(kind)+" ×"+n;chip.setAttribute("aria-label",chip.title);holder.append(chip)}
 if(!holder.children.length){const empty=document.createElement("span");empty.textContent="—";empty.title=tr("noCaptures");holder.append(empty)}
 holder.setAttribute("aria-label",tr(color==="w"?"white":"black")+" · "+tr("captured"));
}
function reasonKey(reason){return ({"checkmate":"mate","mate":"mate","timeout":"timeout","time-forfeit":"timeout","resignation":"resignation","agreed-draw":"agreedDraw","chess-draw":"drawResult","stalemate":"stalemate","threefold-repetition":"repetition","repetition":"repetition","fifty-move":"fiftyMove","50-move":"fiftyMove","insufficient-material":"insufficient"})[reason]||"otherReason"}
function renderResult(g){
 const d=$("pvp-result"),finished=g?.state==="finished",valid=finished&&["1-0","0-1","1/2-1/2"].includes(g.result);
 $("pvp-review-open").disabled=!finished||!g.canonical_pgn;
 if(!valid){if(d.open)d.close();return}
 const winner=g.result==="1-0"?"w":g.result==="0-1"?"b":null;
 $("pvp-result-title").textContent=tr(winner===null?"drawResult":winner===state.color?"win":"loss");
 $("pvp-result-detail").textContent=tr(winner===null?"drawResult":winner==="w"?"whiteWins":"blackWins")+" · "+tr(reasonKey(g.reason))+" · "+g.result;
 $("pvp-result-review").textContent=tr("review");$("pvp-result-review").disabled=!g.canonical_pgn;$("pvp-result-close").textContent=tr("close");
 const key=g.game_id+":"+g.version;
 if(resultSeen!==key&&!$("pvp-view").hidden){resultSeen=key;if(!d.open)d.showModal()}
}
function openReview(){if(state.game?.state!=="finished"||!state.game.canonical_pgn)return;$("pvp-result").close();$("pvp-review-panel").hidden=false;reviewPly=canonical(state.game).moves.length;render();$("pvp-review-panel").scrollIntoView({block:"nearest"})}
function renderReview(moves){
 for(const [id,k] of [["pvp-review-open","review"],["pvp-review-title","reviewTitle"],["pvp-analyze","analyze"],["pvp-review-cancel","cancel"],["pvp-review-close","close"]])$(id).textContent=tr(k);
 for(const [id,k] of [["pvp-review-first","first"],["pvp-review-prev","prev"],["pvp-review-next","next"],["pvp-review-last","last"]]){$(id).title=tr(k);$(id).setAttribute("aria-label",tr(k))}
 const panel=$("pvp-review-panel");if(state.game?.state!=="finished"){panel.hidden=true;return}if(panel.hidden)return;
 const at=reviewPly??moves.length;$("pvp-review-position").textContent=at+" / "+moves.length+(at?" · "+moves[at-1].san:"");
 $("pvp-review-first").disabled=$("pvp-review-prev").disabled=at===0;
 $("pvp-review-next").disabled=$("pvp-review-last").disabled=at===moves.length;
 $("pvp-analyze").disabled=!!reviewWorker||!moves.length;$("pvp-review-cancel").hidden=!reviewWorker;
 $("pvp-review-status").textContent=reviewProgress?.error?tr("analysisError"):reviewProgress?tr("analyzing")+" "+reviewProgress.done+" / "+reviewProgress.total:"";
 const summary=$("pvp-review-summary"),entries=$("pvp-review-entries");summary.replaceChildren();entries.replaceChildren();
 if(!reviewReport)return;
 for(const c of ["w","b"]){const x=reviewReport.summary[c];const el=document.createElement("p");el.textContent=tr(c==="w"?"white":"black")+" · "+tr("accuracy")+": "+(x.accuracy==null?"—":x.accuracy+"%")+" ("+x.analyzed+"/"+x.total+")";summary.append(el)}
 for(const e of reviewReport.entries){const btn=document.createElement("button");btn.type="button";btn.className="review-entry";btn.dataset.ply=String(e.ply);btn.setAttribute("aria-current",String(at===e.ply));btn.textContent=Math.ceil(e.ply/2)+(e.color==="w"?". ":"… ")+e.san+" · "+tr(panelLocale[lang()][e.tag]?e.tag:"unknown")+(e.bestUci?" · "+tr("bestMove")+": "+e.bestUci:"");btn.addEventListener("click",()=>{reviewPly=e.ply;render()});entries.append(btn)}
}
async function analyzeFinished(){
 const g=state.game;if(g?.state!=="finished"||!g.canonical_pgn||reviewWorker)return;
 const core=root.ChessGameReview;if(!core||typeof Worker!=="function"||location.protocol==="file:"){reviewProgress={error:true};render();return}
 const token=++reviewToken,id=g.game_id,version=g.version,worker=new core.UciAnalyzer();reviewWorker=worker;reviewReport=null;reviewProgress={done:0,total:canonical(g).moves.length+1};render();
 const valid=()=>token===reviewToken&&state.game?.game_id===id&&state.game?.version===version&&state.game?.state==="finished";
 try{const result=await core.analyzeGame(Chess,g.canonical_pgn,{quality:"quick",worker,onProgress:s=>{if(valid()){reviewProgress=s;renderReview(canonical(state.game).moves)}}});if(valid()){reviewReport=result;reviewProgress=null}}
 catch{if(valid())reviewProgress={error:true}}
 finally{worker.dispose();if(reviewWorker===worker)reviewWorker=null;if(valid())render()}
}
function moveReview(delta){if(state.game?.state!=="finished")return;const n=canonical(state.game).moves.length;reviewPly=Math.max(0,Math.min(n,(reviewPly??n)+delta));render()}

function render(){
 const board=$("pvp-board");if(!board)return;
 const keepFocus=board.contains(document.activeElement);
 const started=performance.now(),g=state.game,model=canonical(g),moves=model.moves;
 const reviewing=g?.state==="finished"&&reviewPly!==null;
 const chess=reviewing?root.ChessGameReview.atPly(Chess,g.canonical_pgn,reviewPly,g.canonical_fen):model.chess;
 const shownMoves=reviewing?moves.slice(0,reviewPly):moves,lastMove=shownMoves.at(-1);
 const turn=g?.state==="active"?model.chess.turn():null;
 const legalTargets=new Set(state.selected?chess.moves({square:state.selected,verbose:true}).map(m=>m.to):[]);
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
   const legal=legalTargets.has(sq);
   if(sq===state.selected)cell.classList.add("selected");
   if(legal)cell.classList.add("legal");
   if(lastMove&&(sq===lastMove.from||sq===lastMove.to))cell.classList.add("last");
   if(p?.type==="k"&&p.color===chess.turn()&&chess.in_check())cell.classList.add("checked");
   const turnOk=!!g&&g.state==="active"&&!state.pending&&!recovering&&chess.turn()===state.color;
   cell.setAttribute("aria-label",sq+" "+(p?(p.color==="w"?tr("white"):tr("black"))+" "+tr(p.type):tr("emptySquare")));
   cell.setAttribute("aria-disabled",String(!turnOk));
   const symbol=document.createElement("span");symbol.className="piece";
   if(p){symbol.textContent=PI[p.color+p.type];symbol.dataset.code=p.color+p.type.toUpperCase();cell.classList.add(p.color==="w"?"white-piece":"black-piece")}
   cell.appendChild(symbol);
   if(visualRank===7){const c=document.createElement("small");c.className="file";c.textContent=sq[0];c.setAttribute("aria-hidden","true");cell.append(c)}
   if(visualFile===0){const c=document.createElement("small");c.className="rank";c.textContent=sq[1];c.setAttribute("aria-hidden","true");cell.append(c)}
   cell.addEventListener("click",()=>pick(sq));frag.appendChild(cell);
  }
 }
 board.replaceChildren(frag);
 if(keepFocus)board.querySelector("button[data-square="+state.keyboardSquare+"]")?.focus();
 root.ChessAppearance?.apply?.(document);
 $("pvp-clockline").dataset.bottom=bottom;
 for(const c of ["w","b"]){const key=c==="w"?"white":"black";$("pvp-"+key+"-card").dataset.active=String(turn===c);captured(shownMoves,c)}
 $("pvp-turn").textContent=turn?tr(turn==="w"?"turnW":"turnB"):g?.state==="finished"?tr("finished"):tr("noGame");
 renderResult(g);renderReview(moves);
 if(g){
  renderClocks();
  $("pvp-moves").textContent=tr("moves")+": "+(g.canonical_pgn||"—");
  if(g.state==="finished")status(tr("finished")+(g.result?" · "+g.result:""));
  else status((chess.turn()===state.color?tr("yourTurn"):tr("opponent"))+" · "+tr("match")+" "+g.game_id.slice(0,8));
 } else {$("pvp-moves").textContent=tr("none");$("pvp-white-time").textContent=tr("white")+": —";$("pvp-black-time").textContent=tr("black")+": —";}
 const active=g?.state==="active"&&!state.pending&&!recovering,finished=g?.state==="finished"&&!state.pending&&!recovering;
 $("pvp-resign").disabled=!active;$("pvp-draw").disabled=!active;
 $("pvp-accept-draw").disabled=!active||!g.draw_offered_by||g.draw_offered_by===api()?.user()?.id;
 $("pvp-rematch").disabled=!finished;
 recordLatency("render",started);
}
async function pick(sq){
 if(state.pending||recovering||!state.game||state.game.state!=="active"||!api()?.authenticated())return;
 let chess;
 try{chess=gameEngine()}catch(e){setNotice("badState",true);return;}
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
function renderClocks(){
 const g=state.game;if(!g)return;
 const timed=Number(g.base_ms)>0||(g.base_ms===undefined&&Number(g.white_remaining_ms)>0);
 const elapsed=g.state==="active"&&clockAnchor?Math.max(0,Date.now()-clockAnchor.at):0;
 for(const [color,key,id] of [["w","white","pvp-white-time"],["b","black","pvp-black-time"]]){
  const raw=g[key+"_remaining_ms"];
  const ms=Number(raw)-(clockAnchor?.running===color?elapsed:0);
  $(id).textContent=tr(key)+": "+(!timed||raw==null?"—":root.ChessClock?.format?.(Math.max(0,ms))||"—");
 }
}
let games=[],invites=[];
function renderList(){
 const list=$("pvp-games");if(!list)return;
 const frag=document.createDocumentFragment();
 for(const g of games){
  const button=document.createElement("button");button.type="button";
  button.textContent=tr("match")+" "+g.game_id.slice(0,8)+" · "+(g.state==="active"?tr("stateActive"):tr("stateFinished"))+" · "+(g.result||"");
  button.dataset.active=String(g.game_id===state.id);
  button.addEventListener("click",()=>openGame(g.game_id));frag.appendChild(button);
 }
 list.replaceChildren(frag);
 if(!list.children.length)list.textContent=tr("none");
 const pending=invites.filter(x=>x.state==="pending").length;
 $("pvp-invites").textContent=tr("pendingInvites").replace("{count}",String(pending));
}
function validateGame(result,id){
 const g=result?.game;
 if(!g||g.game_id!==id||!["w","b"].includes(result.playerColor)||!Number.isSafeInteger(Number(g.version)))throw Error("INVALID_GAME_RESPONSE");
 canonical(g);
 return g;
}
async function loadGame(id,e=epoch,who=owner){
 const started=performance.now();
 const result=await api().api("/api/pvp/game?id="+encodeURIComponent(id));recordLatency("read",started);
 if(!current(e,who))return false;
 const g=validateGame(result,id);
 if(state.id===id&&state.game&&Number(g.version)<Number(state.game.version))return false;
 const changed=state.id!==id||!state.game||Number(state.game.version)!==Number(g.version)||state.game.state!==g.state||state.game.canonical_fen!==g.canonical_fen||state.game.canonical_pgn!==g.canonical_pgn;
 if(state.id!==id||(state.game?.state==="finished"&&changed)){resetReview();}
 state.game=g;state.id=id;state.color=result.playerColor;state.connected=true;
 if(changed){
  state.selected=null;
  const last=Date.parse(g.last_clock_at||"");
  clockAnchor={running:g.running_color||null,at:Number.isFinite(last)?last:Date.now()};
 }
 if(g.state==="active")remember(id);else if(remembered()===id)forget();
 if(changed||recovering){recovering=false;notice=null;render();renderList();}
 else renderClocks();
 return true;
}
async function dashboard(e=epoch,who=owner){
 if(!current(e,who))return;
 const data=await api().api("/api/pvp/dashboard");
 if(!current(e,who))return;
 games=Array.isArray(data.games)?data.games:[];invites=Array.isArray(data.invites)?data.invites:[];
 lastDashboard=Date.now();renderList();
 const accepted=invites.find(x=>x.invite_id===state.waitingInviteId&&x.game_id);
 const saved=remembered();
 const active=games.filter(g=>g.state==="active"&&uuid(g.game_id));
 const target=accepted?.game_id||(!state.id&&(active.find(g=>g.game_id===saved)?.game_id||(active.length===1?active[0].game_id:null)));
 if(target&&target!==state.id){
  if(await loadGame(target,e,who)&&accepted){state.waitingInviteId=null;$("pvp-waiting").hidden=true;setNotice("started");}
 }
}
async function command(name,body,load=false){
 if(state.pending||recovering||!api()?.authenticated()){setNotice("wait",true);return}
 const started=performance.now(),e=++epoch,who=owner;state.pending=true;notice=null;render();
 if(name==="play")setNotice("sending");
 let feedback=null,failed=false;
 try{
  let resp;
  try{resp=await api().api("/api/pvp/"+name,{method:"POST",body})}
  catch(err){
   if(name!=="play"||!current(e,who)||!/TIMEOUT|NETWORK|fetch|AbortError|502|503|504/i.test(String(err?.message)))throw err;
   // Same request ID: server validates idempotency after a lost response.
   resp=await api().api("/api/pvp/play",{method:"POST",body});
  }
  if(!current(e,who))return;
  if(load){if(!uuid(resp?.game_id))throw Error("INVALID_GAME_RESPONSE");await loadGame(resp.game_id,e,who);}
  if(!current(e,who))return;
  if(name==="invite"||name==="rematch"){
   $("pvp-invite-link").value=location.origin+location.pathname+"#invite="+encodeURIComponent(resp.inviteToken);
   state.waitingInviteId=resp.invite_id||null;
   $("pvp-waiting").hidden=false;$("pvp-waiting").textContent=tr("waitingFriend");feedback="created";
  }
  if(name==="accept"){
   if(!state.id||state.id!==resp.game_id)throw Error("INVALID_GAME_RESPONSE");
   history.replaceState(null,"",location.pathname+location.search);$("pvp-invite-token").value="";feedback="accepted";
  }
  if(["draw","resign"].includes(name))await loadGame(state.id,e,who);
  if(name!=="play")await dashboard(e,who);
 }catch(err){
  if(!current(e,who))return;
  feedback=errorKey(err);failed=true;
  if(name==="play"||["draw","resign"].includes(name)){
   // Resolve the actual committed version; never blindly resend other mutations.
   try{if(state.id)await loadGame(state.id,e,who)}catch{recovering=true;}
  }
 }finally{
  if(name==="play")recordLatency("move",started);
  if(current(e,who)){state.pending=false;notice=null;render();if(feedback)setNotice(feedback,failed);}
 }
}
async function openGame(id){
 if(!api()?.authenticated()||state.pending||!uuid(id))return;
 const e=++epoch,who=owner;
 try{await loadGame(id,e,who)}catch(err){if(current(e,who))setNotice(errorKey(err),true)}
}
async function refresh(force=false){
 accountChanged();
 if($("pvp-view")?.hidden||!owner||state.pending)return;
 if(refreshing)return refreshing;
 const e=epoch,who=owner;
 const work=(async()=>{
  try{
   if(state.id)await loadGame(state.id,e,who);
   if(current(e,who)&&(!state.id||force||Date.now()-lastDashboard>=8000||state.waitingInviteId))await dashboard(e,who);
   if(current(e,who)&&recovering){recovering=false;notice=null;render();}
  }catch(err){
   if(!current(e,who))return;
   recovering=Boolean(state.id);state.connected=false;render();setNotice(errorKey(err),true);
  }
 })();
 refreshing=work;
 try{await work}finally{if(refreshing===work)refreshing=null}
}
function bind(id,action){$(id)?.addEventListener("click",action)}
function init(){
 if(!$("pvp-view"))return;
 translate();
 $("global-language")?.addEventListener("change",translate);
 root.addEventListener("chess-cloud-session",()=>{
  accountCues();
  const changed=accountChanged();
  if(!owner){games=[];invites=[];renderList();render();setNotice($("pvp-invite-token").value?"joinReady":"wait")}
  else if(changed&&uuid(remembered())&&!$("pvp-invite-token").value){$("nav-pvp")?.click();void refresh(true)}
  else void refresh(true);
 });
 bind("pvp-refresh",()=>refresh(true));
 bind("pvp-result-close",()=>$("pvp-result").close());bind("pvp-result-review",openReview);bind("pvp-review-open",openReview);
 bind("pvp-review-first",()=>moveReview(-100000));bind("pvp-review-prev",()=>moveReview(-1));bind("pvp-review-next",()=>moveReview(1));bind("pvp-review-last",()=>moveReview(100000));
 bind("pvp-review-close",()=>{reviewPly=null;$("pvp-review-panel").hidden=true;render()});
 bind("pvp-analyze",analyzeFinished);bind("pvp-review-cancel",()=>{reviewToken++;reviewWorker?.dispose();reviewWorker=null;reviewProgress=null;render()});

 bind("pvp-login",()=>{$("header-login")?.click()});
 bind("pvp-flip",()=>{state.flip=!state.flip;render()});
 bind("pvp-create",()=>command("invite",{color:$("pvp-color").value,preset:$("pvp-time").value,
  ...( $("pvp-friend").value.trim()?{toUserId:$("pvp-friend").value.trim()}:{})}));
 bind("pvp-accept",()=>{const token=$("pvp-invite-token").value.trim();if(!/^[A-Za-z0-9_-]{43}$/.test(token)){status(tr("invalid"),true);return}command("accept",{inviteToken:token},true)});
 bind("pvp-copy",async()=>{const link=$("pvp-invite-link").value;if(!link)return;try{await navigator.clipboard.writeText(link);status(tr("copied"))}catch{$("pvp-invite-link").select();status(tr("copyFallback"))}});
 bind("pvp-resign",()=>{if(state.game&&root.confirm(tr("confirmResign")))command("resign",{gameId:state.id,expectedVersion:Number(state.game.version)})});
 bind("pvp-draw",()=>{if(state.game&&root.confirm(tr("confirmDraw")))command("draw",{gameId:state.id,expectedVersion:Number(state.game.version),action:"offer"})});
 bind("pvp-accept-draw",()=>{if(state.game)command("draw",{gameId:state.id,expectedVersion:Number(state.game.version),action:"accept"})});
 bind("pvp-rematch",()=>{if(state.game)command("rematch",{gameId:state.id,expectedVersion:Number(state.game.version)})});
 root.addEventListener("hashchange",showInvitation);
 showInvitation();
 accountCues();render();
 root.ChessPvp=Object.freeze({refresh:()=>refresh(true),latency:latencySnapshot});
 root.setInterval(()=>{if(!document.hidden&&$("pvp-view")&&!$("pvp-view").hidden&&!state.pending)void refresh()},1200);
 root.setInterval(()=>{if(!document.hidden&&!$("pvp-view").hidden)renderClocks()},250);
 root.addEventListener("online",()=>refresh(true));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)void refresh(true)});
 if(api()?.authenticated()){accountChanged();if(uuid(remembered())&&!$("pvp-invite-token").value)$("nav-pvp")?.click();void refresh(true);}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})(window);
