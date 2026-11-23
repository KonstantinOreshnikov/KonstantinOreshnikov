/* Chess Odyssey B5 — standalone Masters & Legends interaction layer.
 * Isolated state: never changes the practice chessboard, Academy, AI, ratings or PGN.
 * User-controlled display of factual chess scores + original RU/EN/AZ explanation.
 */
(function(root,document){
 "use strict";
 const Core=root.ChessMastersCore,source=root.ChessMastersLibrary;
 const banks=[root.ChessMasterNotesA,root.ChessMasterNotesB,root.ChessMasterNotesC];
 const Chess=root.Chess;
 if(!Core||!source||banks.some(x=>!Array.isArray(x))||typeof Chess!=="function"){
   root.ChessMastersQA={error:"Required verified B5 modules are missing"};
   return;
 }
 const verified=Core.compile(Chess,source,banks);
 if(!verified.ok){
   root.ChessMastersQA={error:verified.problems.slice()};
   return;
 }
 const $=(id)=>document.getElementById(id);
 const STORAGE="chess-odyssey-masters-v1";
 const PIECES={w:{k:"♔",q:"♕",r:"♖",b:"♗",n:"♘",p:"♙"},b:{k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟"}};
 const dict={
  ru:{practiceTab:"Практика и Академия",mastersTab:"Мастера и легенды",progressTab:"Мой прогресс",mastersHeading:"ИСТОРИЯ ШАХМАТ · ОБУЧЕНИЕ",
   flip:"Повернуть доску",guessMove:"Угадать ход мастера",bookmark:"Закладка",bookmarked:"Закладка сохранена",
   downloadPGN:"Скачать PGN",scoreTitle:"Полная запись — нажмите на любой ход",libraryTitle:"Библиотека исторических партий",
   filterTitle:"Тема",all:"Все темы",attack:"Атаки и комбинации",strategy:"Стратегия и защита",
   endgame:"Эндшпиль и пешки",machine:"Человек и машина",searchTitle:"Поиск по игроку, названию и году",
   chooseTitle:"Историческая партия",language:"Язык объяснений",source:"Источник записи",momentsTitle:"Ключевые учебные моменты",
   teachingNote:"Цель — найти исторический ход мастера, не обязательно объективно лучший. Другие ходы тоже могут быть допустимы.",
   bookmarksTitle:"Мои закладки",none:"Пока нет закладок",searchZero:"По запросу партий не найдено",
   count:"Партий: {count} из {total}",move:"Ход {ply} из {total}",white:"Белые",black:"Чёрные",
   played:"Зафиксировано: {san}.",capture:" Это взятие.",check:" Этот ход даёт шах.",mate:" Это мат на доске.",
   promote:" Пешка превращается.",noNote:" Подробное объяснение доступно на отмеченных ключевых моментах.",
   intro:"Начните с первого хода или выберите учебный момент справа.",
   result:"Записанный результат: {result}.",resigned:" В записи нет мата на доске; причину завершения уточняйте по источнику.",
   complete:"Партия завершена.",readyQuiz:"Найдите ход, реально сыгранный мастером на этой позиции.",
   correct:"Верно: в партии сыграно {san}. Это совпадение с исторической записью, а не оценка качества всех других ходов.",
   wrong:"{san} — допустимый ход, но в этой партии был сыгран другой. Попробуйте снова.",
   quizEmpty:"Нет подходящего учебного момента.",noteAt:"После {move}",play:"Воспроизводить",pause:"Пауза",
   noBook:"Пока нет закладок.",start:"Начало партии"},
  en:{practiceTab:"Practice & Academy",mastersTab:"Masters & Legends",progressTab:"My progress",mastersHeading:"CHESS HISTORY · LEARN BY REPLAYING",
   flip:"Flip board",guessMove:"Guess the master's move",bookmark:"Bookmark",bookmarked:"Bookmarked",
   downloadPGN:"Download PGN",scoreTitle:"Complete score — select any move",libraryTitle:"Historical games library",
   filterTitle:"Theme",all:"All themes",attack:"Attacks and combinations",strategy:"Strategy and defence",
   endgame:"Endgames and pawns",machine:"Human vs machine",searchTitle:"Search player, title or year",
   chooseTitle:"Historical game",language:"Explanation language",source:"Source score",momentsTitle:"Original teaching moments",
   teachingNote:"Guess the historical move, not necessarily the objectively best move. Other legal moves may also be reasonable.",
   bookmarksTitle:"My bookmarks",none:"No bookmarks yet",searchZero:"No games match this search",
   count:"Games: {count} of {total}",move:"Ply {ply} of {total}",white:"White",black:"Black",
   played:"Recorded move: {san}.",capture:" This move captures a piece.",check:" The move gives check.",mate:" This is checkmate on the board.",
   promote:" The pawn promotes.",noNote:" Detailed original explanations are available at the highlighted key moments.",
   intro:"Start the game or select a teaching moment on the right.",
   result:"Recorded result: {result}.",resigned:" No on-board checkmate is recorded; check the source for termination details.",
   complete:"Game score complete.",readyQuiz:"Find the move actually played by the master in this position.",
   correct:"Yes: the recorded move was {san}. This checks historical recall, not the quality of every other legal move.",
   wrong:"{san} is legal, but another move was played in this game. Try again.",
   quizEmpty:"No suitable teaching moment.",noteAt:"After {move}",play:"Autoplay",pause:"Pause",
   noBook:"No bookmarks yet.",start:"Starting position"},
  az:{practiceTab:"Məşq və Akademiya",mastersTab:"Ustadlar və Əfsanələr",progressTab:"Mənim inkişafım",mastersHeading:"ŞAHMAT TARİXİ · OYNAYARAQ ÖYRƏNİN",
   flip:"Taxtanı çevir",guessMove:"Ustadın gedişini tap",bookmark:"Əlfəcin",bookmarked:"Əlfəcin saxlanıb",
   downloadPGN:"PGN yüklə",scoreTitle:"Bütün gedişlər — istənilən gedişi seçin",libraryTitle:"Tarixi partiyalar kitabxanası",
   filterTitle:"Mövzu",all:"Bütün mövzular",attack:"Hücumlar və kombinasiyalar",strategy:"Strategiya və müdafiə",
   endgame:"Endşpil və piyadalar",machine:"İnsan və kompüter",searchTitle:"Oyunçu, ad və il üzrə axtarış",
   chooseTitle:"Tarixi partiya",language:"İzahların dili",source:"Gedişlərin mənbəyi",momentsTitle:"Əsas təlim məqamları",
   teachingNote:"Məqsəd ustadın tarixi gedişini tapmaqdır; bu, mütləq ən yaxşı gediş demək deyil. Digər qanuni gedişlər də məntiqli ola bilər.",
   bookmarksTitle:"Əlfəcinlərim",none:"Hələ əlfəcin yoxdur",searchZero:"Axtarışa uyğun partiya tapılmadı",
   count:"Partiya: {count}/{total}",move:"Gediş {ply}/{total}",white:"Ağlar",black:"Qaralar",
   played:"Qeyd edilmiş gediş: {san}.",capture:" Bu, almadır.",check:" Bu gediş şah verir.",mate:" Bu, lövhədə matdır.",
   promote:" Piyada çevrilir.",noNote:" Ətraflı izah üçün işarələnmiş əsas məqamlardan birini seçin.",
   intro:"İlk gedişdən başlayın və ya sağdakı əsas məqamlardan birini seçin.",
   result:"Qeyd edilmiş nəticə: {result}.",resigned:" Lövhədə mat qeydə alınmayıb; bitmə səbəbini mənbədən yoxlayın.",
   complete:"Partiyanın qeydi tamamlandı.",readyQuiz:"Bu mövqedə ustadın həqiqətən oynadığı gedişi tapın.",
   correct:"Düzdür: tarixi gediş {san} idi. Bu, digər qanuni gedişlərin keyfiyyətinin qiyməti deyil.",
   wrong:"{san} qanuni gedişdir, lakin bu partiyada başqa gediş oynanılıb. Yenidən cəhd edin.",
   quizEmpty:"Uyğun təlim məqamı yoxdur.",noteAt:"{move} gedişindən sonra",play:"Göstər",pause:"Pauza",
   noBook:"Hələ əlfəcin yoxdur.",start:"Başlanğıc mövqe"}
 };
 const initial={id:verified.games[0].id,ply:0,flipped:false,filter:"all",search:"",bookmarks:[],lang:"ru"};
 const state={...initial,quiz:null,feedback:"",playing:false,timer:null,view:"practice"};
 const tr=(name,args)=>((dict[state.lang]||dict.ru)[name]||name).replace(/\{(\w+)\}/g,(_,k)=>args&&args[k]!==undefined?String(args[k]):"?");
 const current=()=>verified.byId[state.id]||verified.games[0];
 const plyLabel=(g,ply)=>ply===0?tr("start"):(Math.ceil(ply/2)+(ply%2===1?".":"...")+" "+g.moves[ply-1].san);
 function memory(){
   try{
     const o=JSON.parse(localStorage.getItem(STORAGE)||"null");
     if(!o||typeof o!=="object")return;
     if(verified.byId[o.id])state.id=o.id;
     if(Number.isInteger(o.ply))state.ply=Math.max(0,Math.min(o.ply,current().totalPlies));
     state.flipped=Boolean(o.flipped);
     state.filter=["all","attack","strategy","endgame","machine"].includes(o.filter)?o.filter:"all";
     if(["ru","en","az"].includes(o.lang))state.lang=o.lang;
     state.bookmarks=Array.isArray(o.bookmarks)?o.bookmarks.filter(x=>x&&verified.byId[x.id]&&Number.isInteger(x.ply)&&x.ply>=0&&x.ply<=verified.byId[x.id].totalPlies).slice(-80):[];
   }catch(_error){/* corrupted localStorage does not obstruct the game */}
 }
 function save(){
   try{localStorage.setItem(STORAGE,JSON.stringify({id:state.id,ply:state.ply,flipped:state.flipped,filter:state.filter,lang:state.lang,bookmarks:state.bookmarks.slice(-80)}));}
   catch(_error){/* private mode may deny localStorage */}
 }
 function stop(){
   state.playing=false;
   if(state.timer!==null){clearInterval(state.timer);state.timer=null;}
   const el=$("m-play");if(el){el.textContent="▶";el.setAttribute("aria-label",tr("play"));}
 }
 function board(){
   const game=current(),pos=new Chess(game.positions[state.ply]),rows=pos.board(),fragment=document.createDocumentFragment();
   const last=state.ply>0?game.moves[state.ply-1]:null,files="abcdefgh";
   for(let visualRank=0;visualRank<8;visualRank++){
     for(let visualFile=0;visualFile<8;visualFile++){
       const ri=state.flipped?7-visualRank:visualRank,fi=state.flipped?7-visualFile:visualFile;
       const square=files[fi]+(8-ri),p=rows[ri][fi],button=document.createElement("div");
       // This historic board is read-only: use static cells, not 64 fake buttons.
       // The parent role="img" exposes a localized summary of the entire position.
       button.className="square "+((ri+fi)%2===0?"light":"dark");
       if(last&&(last.from===square||last.to===square))button.classList.add("last");
       button.setAttribute("aria-label",square+" "+(p?(p.color==="w"?"white ":"black ")+p.type:"empty"));
       button.setAttribute("aria-hidden","true");
       if(p){
         button.classList.add(p.color==="w"?"white-piece":"black-piece");
         const icon=document.createElement("span");icon.className="piece";icon.textContent=PIECES[p.color][p.type];icon.dataset.code=p.color+p.type.toUpperCase();button.appendChild(icon);
       }
       fragment.appendChild(button);
     }
   }
   $("m-board").replaceChildren(fragment);
   const intro={ru:"Историческая позиция",en:"Historical position",az:"Tarixi mövqe"};
   const move=state.ply?game.moves[state.ply-1].san:"0";
   $("m-board").setAttribute("aria-label",(intro[state.lang]||intro.ru)+": "+game.white+" — "+game.black+", "+state.ply+"/"+game.totalPlies+", "+move);
 }
 function score(){
   const game=current(),holder=$("m-moves"),fragment=document.createDocumentFragment();
   for(let i=0;i<game.moves.length;i++){
     if(i%2===0){const num=document.createElement("span");num.className="masters-turn";num.textContent=Math.floor(i/2)+1+".";fragment.appendChild(num);}
     const move=game.moves[i],button=document.createElement("button");
     button.type="button";button.className="masters-move"+(i+1===state.ply?" current":"");
     button.dataset.ply=String(i+1);button.textContent=move.san;
     button.setAttribute("aria-label",plyLabel(game,i+1));
     if(i+1===state.ply)button.setAttribute("aria-current","step");
     button.addEventListener("click",()=>go(i+1));
     fragment.appendChild(button);
   }
   holder.replaceChildren(fragment);
 }
 function moments(){
   const game=current(),holder=$("m-moments"),fragment=document.createDocumentFragment();
   for(const entry of game.moments){
     const li=document.createElement("li"),button=document.createElement("button");
     button.type="button";button.className="masters-moment"+(entry.ply===state.ply?" current":"");
     button.textContent=plyLabel(game,entry.ply)+" · "+entry.explain[state.lang];
     button.addEventListener("click",()=>go(entry.ply));
     li.appendChild(button);fragment.appendChild(li);
   }
   holder.replaceChildren(fragment);
 }
 function explain(){
   const game=current();
   if(state.ply===0){$("m-explain").textContent=game.summary[state.lang]+" "+tr("intro");return;}
   const move=game.moves[state.ply-1],entry=game.moments.find(x=>x.ply===state.ply);
   let desc=entry?entry.explain[state.lang]:tr("played",{san:move.san})+
     (move.captured?tr("capture"):"")+
     (move.flags.includes("p")?tr("promote"):"")+
     (move.san.includes("#")?tr("mate"):move.san.includes("+")?tr("check"):"")+tr("noNote");
   if(state.ply===game.totalPlies)desc+=" "+tr("complete")+" "+tr("result",{result:game.result})+(game.isCheckmate?"":tr("resigned"));
   if(state.feedback)desc=state.feedback+"\n"+desc;
   $("m-explain").textContent=desc;
 }
 function bookmarkList(){
   const frag=document.createDocumentFragment();
   if(!state.bookmarks.length){
     const p=document.createElement("p");p.className="masters-meta";p.textContent=tr("noBook");frag.appendChild(p);
   }else{
     for(const bm of state.bookmarks.slice().reverse().slice(0,18)){
       const g=verified.byId[bm.id],b=document.createElement("button");
       b.type="button";b.textContent=g.title[state.lang]+" · "+plyLabel(g,bm.ply);
       b.addEventListener("click",()=>{select(g.id,bm.ply);showTab("masters");});
       frag.appendChild(b);
     }
   }
   $("m-bookmarks").replaceChildren(frag);
   const present=state.bookmarks.some(x=>x.id===state.id&&x.ply===state.ply);
   $("m-bookmark").setAttribute("aria-pressed",String(present));
   $("m-bookmark").textContent=tr(present?"bookmarked":"bookmark");
 }
 function updateLabels(){
   for(const el of document.querySelectorAll("[data-master-label]")){
     el.textContent=tr(el.getAttribute("data-master-label"));
   }
   $("m-lang").value=state.lang;
   $("m-search").setAttribute("placeholder",state.lang==="ru"?"Морфи, Фишер, Каспаров…":state.lang==="az"?"Morfi, Fişer, Kasparov…":"Morphy, Fischer, Kasparov…");
   $("m-play").setAttribute("aria-label",tr(state.playing?"pause":"play"));
 }
 function gameInfo(){
   const game=current();
   $("m-title").textContent=game.title[state.lang];
   $("m-meta").textContent=game.white+" — "+game.black+" · "+game.event+" · "+game.year+" · "+game.result;
   $("m-summary").textContent=game.summary[state.lang];
   $("m-source").textContent=game.source;
   $("m-source").setAttribute("href",game.source);
   $("m-progress").textContent=tr("move",{ply:state.ply,total:game.totalPlies})+" · "+plyLabel(game,state.ply);
   $("m-slider").max=String(game.totalPlies);$("m-slider").value=String(state.ply);
   $("m-slider").setAttribute("aria-valuetext",plyLabel(game,state.ply));
   $("m-first").disabled=state.ply===0;$("m-prev").disabled=state.ply===0;
   $("m-next").disabled=state.ply>=game.totalPlies;$("m-last").disabled=state.ply>=game.totalPlies;
   $("m-flip").checked=state.flipped;
 }
 function render(){
   updateLabels();gameInfo();board();score();moments();explain();bookmarkList();
 }
 function go(ply){
   stop();
   const game=current();
   state.ply=Math.max(0,Math.min(Number(ply)||0,game.totalPlies));
   state.quiz=null;state.feedback="";$("m-quiz-panel").hidden=true;
   save();render();
   root.ChessProgress?.study?.(state.id,state.ply);
 }
 function select(id,ply=0){
   if(!verified.byId[id])return;
   stop();state.id=id;state.ply=Math.max(0,Math.min(Number(ply)||0,current().totalPlies));
   state.quiz=null;state.feedback="";$("m-quiz-panel").hidden=true;
   save();render();catalogue(false);
   root.ChessProgress?.study?.(state.id,state.ply);
 }
 function catalogue(shouldSelect){
   const words=state.search.trim().toLocaleLowerCase("ru");
   const matches=verified.games.filter(g=>{
     if(state.filter!=="all"&&g.category!==state.filter)return false;
     return !words||[g.white,g.black,g.title.ru,g.title.en,g.title.az,String(g.year),g.event].some(s=>String(s).toLocaleLowerCase("ru").includes(words));
   });
   const selector=$("m-game"),frag=document.createDocumentFragment();
   if(matches.length===0){
     const opt=document.createElement("option");opt.value="";opt.textContent=tr("searchZero");frag.appendChild(opt);
   }else for(const g of matches){
     const opt=document.createElement("option");opt.value=g.id;
     opt.textContent=g.year+" · "+g.white+" — "+g.black+" · "+g.title[state.lang];
     frag.appendChild(opt);
   }
   selector.replaceChildren(frag);
   $("m-catalogue-count").textContent=tr("count",{count:matches.length,total:verified.games.length});
   if(matches.length&&!matches.some(g=>g.id===state.id)&&shouldSelect){select(matches[0].id);return;}
   if(matches.some(g=>g.id===state.id))selector.value=state.id;
   else if(!matches.length)selector.value="";
 }
 function language(lang,sync){
   if(!["ru","en","az"].includes(lang))return;
   state.lang=lang;save();render();catalogue(false);
   if(sync){
     const practice=$("lang");if(practice&&practice.value!==lang){
       practice.value=lang;practice.dispatchEvent(new Event("change",{bubbles:true}));
     }
   }
 }
 function showTab(name){
   state.view=["practice","masters","progress"].includes(name)?name:"practice";
   $("practice-view").hidden=state.view!=="practice";
   $("masters-view").hidden=state.view!=="masters";
   $("progress-view").hidden=state.view!=="progress";
   for(const [tab,view] of [["nav-play","practice"],["nav-masters","masters"],["nav-progress","progress"]]){
     $(tab).setAttribute("aria-selected",String(state.view===view));
     $(tab).setAttribute("tabindex",state.view===view?"0":"-1");
     $(tab).classList.toggle("active",state.view===view);
   }
   if(state.view==="masters"){language($("lang").value,false);catalogue(false);}
   else {stop();if(state.view==="progress")root.ChessProgress?.refresh?.();}
 }
 function quiz(){
   stop();
   const game=current();
   const m=game.moments.find(e=>e.ply>state.ply)||game.moments[0];
   if(!m){$("m-explain").textContent=tr("quizEmpty");return;}
   state.ply=m.ply-1;state.quiz=m;state.feedback="";
   save();render();
   $("m-question").textContent=tr("readyQuiz")+" "+(Math.ceil(m.ply/2))+(m.ply%2?" ":"...")+
     (m.ply%2?"("+tr("white")+")":"("+tr("black")+")");
   const choices=Core.exerciseChoices(Chess,game,m),frag=document.createDocumentFragment();
   for(const san of choices){
     const btn=document.createElement("button");btn.type="button";btn.textContent=san;btn.dataset.san=san;
     btn.addEventListener("click",()=>{
       if(!state.quiz)return;
       if(san!==state.quiz.san){
         $("m-feedback").textContent=tr("wrong",{san});return;
       }
       const movePlayed=state.quiz.san;
       state.quiz=null;state.ply=m.ply;state.feedback=tr("correct",{san:movePlayed});
       $("m-quiz-panel").hidden=true;save();render();
       root.ChessProgress?.quiz?.(state.id,state.ply);
     });
     frag.appendChild(btn);
   }
   $("m-options").replaceChildren(frag);
   $("m-feedback").textContent="";
   $("m-quiz-panel").hidden=false;
 }
 function toggleBookmark(){
   const ix=state.bookmarks.findIndex(x=>x.id===state.id&&x.ply===state.ply);
   if(ix>=0)state.bookmarks.splice(ix,1);
   else state.bookmarks.push({id:state.id,ply:state.ply});
   state.bookmarks=state.bookmarks.slice(-80);
   save();bookmarkList();
 }
 function download(){
   const game=current(),data=Core.pgn(game),blob=new Blob([data],{type:"application/x-chess-pgn;charset=utf-8"});
   const url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download=game.id+".pgn";
   document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 function togglePlay(){
   if(state.playing){stop();return;}
   if(state.ply>=current().totalPlies)state.ply=0;
   state.playing=true;state.feedback="";
   $("m-play").textContent="❚❚";$("m-play").setAttribute("aria-label",tr("pause"));
   state.timer=setInterval(()=>{
     if(state.view!=="masters"||state.ply>=current().totalPlies){stop();return;}
     state.ply++;state.quiz=null;$("m-quiz-panel").hidden=true;save();render();
     root.ChessProgress?.study?.(state.id,state.ply);
     if(state.ply>=current().totalPlies)stop();
   },1000);
 }
 function init(){
   memory();
   if(!verified.byId[state.id])state.id=verified.games[0].id;
   if($("lang")&&["ru","en","az"].includes($("lang").value))state.lang=$("lang").value;
   $("m-filter").value=state.filter;
   $("nav-play").addEventListener("click",()=>showTab("practice"));
   $("nav-masters").addEventListener("click",()=>showTab("masters"));
   $("nav-progress").addEventListener("click",()=>showTab("progress"));
   const tabs=[["nav-play","practice"],["nav-masters","masters"],["nav-progress","progress"]];
   for(let index=0;index<tabs.length;index++){
     $(tabs[index][0]).addEventListener("keydown",event=>{
       let target=-1;
       if(event.key==="ArrowRight")target=(index+1)%tabs.length;
       else if(event.key==="ArrowLeft")target=(index+tabs.length-1)%tabs.length;
       else if(event.key==="Home")target=0;
       else if(event.key==="End")target=tabs.length-1;
       if(target<0)return;
       event.preventDefault();showTab(tabs[target][1]);
       $(tabs[target][0]).focus();
     });
   }
   $("m-first").addEventListener("click",()=>go(0));
   $("m-prev").addEventListener("click",()=>go(state.ply-1));
   $("m-next").addEventListener("click",()=>go(state.ply+1));
   $("m-last").addEventListener("click",()=>go(current().totalPlies));
   $("m-play").addEventListener("click",togglePlay);
   $("m-flip").addEventListener("change",()=>{state.flipped=$("m-flip").checked;save();render();});
   $("m-slider").addEventListener("input",()=>go(Number($("m-slider").value)));
   $("m-game").addEventListener("change",()=>select($("m-game").value));
   $("m-filter").addEventListener("change",()=>{state.filter=$("m-filter").value;catalogue(true);save();});
   $("m-search").addEventListener("input",()=>{state.search=$("m-search").value;catalogue(true);});
   $("m-lang").addEventListener("change",()=>language($("m-lang").value,true));
   $("lang").addEventListener("change",()=>language($("lang").value,false));
   $("m-quiz").addEventListener("click",quiz);
   $("m-bookmark").addEventListener("click",toggleBookmark);
   $("m-download").addEventListener("click",download);
   document.addEventListener("keydown",e=>{
     if(state.view!=="masters"||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
     if(e.target&&["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName))return;
     if(e.key==="ArrowLeft"){e.preventDefault();go(state.ply-1);}
     else if(e.key==="ArrowRight"){e.preventDefault();go(state.ply+1);}
     else if(e.key==="Home"){e.preventDefault();go(0);}
     else if(e.key==="End"){e.preventDefault();go(current().totalPlies);}
   });
   render();catalogue(false);showTab("practice");
 }
 root.ChessMastersQA={
   compile:()=>({games:verified.games.length,plies:verified.totalPlies,moments:verified.moments,checkmates:verified.checkmates,ok:verified.ok}),
   snapshot:()=>({id:state.id,ply:state.ply,lang:state.lang,view:state.view,filter:state.filter,playing:state.playing,quiz:state.quiz&&state.quiz.anchor,bookmarks:state.bookmarks.slice()}),
   jump:(id,ply)=>{select(id,ply);showTab("masters");},
   pgn:(id)=>Core.pgn(verified.byId[id]||current()),
   moments:(id)=>(verified.byId[id]||current()).moments.map(x=>({ply:x.ply,san:x.san,anchor:x.anchor})),
   choose:quiz, stop
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})(window,document);
