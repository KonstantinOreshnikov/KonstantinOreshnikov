/* Chess Odyssey B6 — Player Progress & Reputation.
 * Offline-only analytics; all actual rating/achievement signals derived from
 * verified immutable lesson IDs, unique history positions or completed no-help
 * chess.js games. No Elo / FIDE / third-party rating calibration claim.
 */
(function(root,document){
 "use strict";
 const Core=root.ChessProgressCore,Academy=root.ChessAcademy,Source=root.ChessMastersLibrary,MastersCore=root.ChessMastersCore,Chess=root.Chess;
 if(!Core||!Academy||!Source||!MastersCore||typeof Chess!=="function"){root.ChessProgress={error:"B6 modules unavailable"};return;}
 const books=[root.ChessMasterNotesA,root.ChessMasterNotesB,root.ChessMasterNotesC];
 const verified=MastersCore.compile(Chess,Source,books);
 if(!verified.ok){root.ChessProgress={error:"B5 validated library missing"};return;}
 const KEY="chess-odyssey-progress-v1",PRACTICE_KEY="chess-odyssey-v01";
 const $=(x)=>document.getElementById(x);
 const translations={
  ru:{progressTab:"Мой прогресс",progressLangLabel:"Язык",eyebrow:"ВАШ ПУТЬ В ШАХМАТАХ",title:"Путь шахматиста",
    lead:"Прогресс обучения и результаты самостоятельных партий учитываются отдельно.",
    reputation:"Репутация Академии",repNote:"За уникальные уроки, реальные исторические задачи и достижения. Повторы не накручивают очки.",
    academy:"Академия",lessons:"Пройдено интерактивных уроков",masters:"Мастера и легенды",mastersNote:"Изучены все ключевые моменты и финал партии",
    index:"AI Ladder Index",indexWaiting:"Доступен после пяти полных самостоятельных матчей без помощи",
    indexIntro:"Локальный индекс по партиям против AI, не Elo и не рейтинг ФИДЕ.",
    indexReady:"Локальная оценка · {count} матчей, последние {period} входят в индекс",
    indexProvisional:"Предварительная оценка. Мало партий; колебания высоки.",
    indexUncalibrated:"Не сравнивайте это число с рейтингами реальных шахматистов и онлайн-платформ.",
    trackTitle:"Прогресс Академии",independentTitle:"Самостоятельная игра",
    achievementsTitle:"Достижения",achievementsCount:"Открыто: {count} из {total}",
    recentTitle:"Последние самостоятельные матчи",storage:"Всё хранится локально в браузере. Без аккаунтов, глобального рейтинга и облачной синхронизации.",
    trackBasics:"Основы и правила",trackTactics:"Тактика",trackOpenings:"Дебюты",trackEndgames:"Эндшпиль",
    moments:"Ключевых моментов изучено: {done} из {total}",quizzes:"Разных исторических ходов угадано: {total}",
    resultCount:"В индекс допущено партий: {total}",results:"Победы: {win} · Ничьи: {draw} · Поражения: {loss}",
    tier:"Первых побед по уровням: {count}/6",method:"Метод: среднее за последние 20 матчей от 100 × (номер уровня AI / 6) × результат (1 / 0,5 / 0). Индекс показывается с пятого матча; это внутриигровая шкала 0–100, не оценка шахматной силы в Elo.",
    nothing:"Пока нет завершённых самостоятельных партий.",win:"Победа",loss:"Поражение",draw:"Ничья",
    unlocked:"Открыто",locked:"Ещё не открыто",modeLabel:"Тип партии",practiceMode:"Тренировка с подсказками",
    independentMode:"Самостоятельная партия без помощи",practiceIntegrity:"В тренировке можно учиться и отменять ходы; AI Ladder Index не изменяется.",
    independentIntegrity:"Самостоятельный режим: подсказки, live Coach, анализ и отмена отключены. Начните новую партию для смены режима.",
    ineligible:"Результат матча не включён в индекс: движок переключился на запасной или обнаружена помощь.",
    independentResult:"Самостоятельная партия окончена: результат учтён в локальном AI Ladder Index.",
    invalidRating:"Матч не подходит для индекса. Прогресс обучения не пострадал.",assistBlocked:"В самостоятельной партии помощь отключена.",
    loading:"Идёт самостоятельная партия: живые подсказки скрыты."
  },
  en:{progressTab:"My progress",progressLangLabel:"Language",eyebrow:"YOUR CHESS LEARNING JOURNEY",title:"Your chess journey",
    lead:"Learning progress and truly unassisted game results are tracked separately.",
    reputation:"Academy Reputation",repNote:"Unique lessons, historical puzzles and achievements; repeated work cannot farm points.",
    academy:"Academy",lessons:"Interactive lessons completed",masters:"Masters & Legends",mastersNote:"Every highlighted moment and the game ending studied",
    index:"AI Ladder Index",indexWaiting:"Available after five complete unassisted games",
    indexIntro:"Local AI game index; not Elo and not a FIDE rating.",
    indexReady:"Local score · {count} eligible games, last {period} in the index",
    indexProvisional:"Provisional. Small sample; expect large variation.",
    indexUncalibrated:"Do not compare this number with online or real-player ratings.",
    trackTitle:"Academy tracks",independentTitle:"Independent games",
    achievementsTitle:"Achievements",achievementsCount:"Unlocked: {count} of {total}",
    recentTitle:"Recent independent matches",storage:"Stored in this browser only. No account, global rating or cloud sync.",
    trackBasics:"Rules",trackTactics:"Tactics",trackOpenings:"Openings",trackEndgames:"Endgames",
    moments:"Highlighted positions studied: {done} of {total}",quizzes:"Unique historical moves guessed: {total}",
    resultCount:"Eligible independent games: {total}",results:"Wins: {win} · Draws: {draw} · Losses: {loss}",
    tier:"AI levels beaten at least once: {count}/6",method:"Formula: mean of the last 20 games of 100 × (AI tier 1–6 / 6) × score (1 / 0.5 / 0). Visible after five games; this 0–100 in-game index is not a calibrated chess Elo.",
    nothing:"No eligible completed independent games yet.",win:"Win",loss:"Loss",draw:"Draw",
    unlocked:"Unlocked",locked:"Not yet unlocked",modeLabel:"Match type",practiceMode:"Coached practice",
    independentMode:"Independent game · no assistance",practiceIntegrity:"Practice allows coaching and undo; the AI Ladder Index never changes.",
    independentIntegrity:"Independent: hints, live Coach, move analysis and undo are disabled. Starting a new game switches modes.",
    ineligible:"This game was excluded from the index due to engine fallback or assistance.",
    independentResult:"Independent game completed and included in the local AI Ladder Index.",
    invalidRating:"Game is not eligible for the local index. Learning progress is unaffected.",assistBlocked:"Assistance is disabled in independent games.",
    loading:"Independent game in progress: live help is hidden."
  },
  az:{progressTab:"Mənim inkişafım",progressLangLabel:"Dil",eyebrow:"ŞAHMAT ÖYRƏNMƏ YOLUNUZ",title:"Şahmat inkişafınız",
    lead:"Təlim nəticələri və tam müstəqil oyunlar ayrıca hesablanır.",
    reputation:"Akademiya nüfuzu",repNote:"Təkrar xal toplamadan unikal dərslər, tarixi tapşırıqlar və nailiyyətlər üçün.",
    academy:"Akademiya",lessons:"Tamamlanmış interaktiv dərslər",masters:"Ustadlar və Əfsanələr",mastersNote:"Partiyanın bütün əsas məqamları və sonluğu öyrənilib",
    index:"AI Ladder Index",indexWaiting:"Beş tam müstəqil oyundan sonra görünəcək",
    indexIntro:"AI ilə oyunlar üçün lokal göstərici; nə Elo, nə də FIDE reytinqidir.",
    indexReady:"Lokal göstərici · {count} oyun, son {period} nəticə hesablanır",
    indexProvisional:"İlkin göstəricidir. Az oyun olduğundan dəyişkənlik yüksəkdir.",
    indexUncalibrated:"Bu göstəricini real oyunçu və ya onlayn reytinqlə müqayisə etməyin.",
    trackTitle:"Akademiya bölmələri",independentTitle:"Müstəqil oyunlar",
    achievementsTitle:"Nailiyyətlər",achievementsCount:"Açılıb: {count}/{total}",
    recentTitle:"Son müstəqil oyunlar",storage:"Məlumatlar yalnız bu brauzerdə saxlanılır. Hesab, qlobal reytinq və bulud sinxronizasiyası yoxdur.",
    trackBasics:"Qaydalar",trackTactics:"Taktika",trackOpenings:"Debütlər",trackEndgames:"Endşpil",
    moments:"Öyrənilmiş əsas mövqelər: {done}/{total}",quizzes:"Tapılmış fərqli tarixi gedişlər: {total}",
    resultCount:"Müstəqil oyunlar: {total}",results:"Qələbə: {win} · Heç-heçə: {draw} · Məğlubiyyət: {loss}",
    tier:"Ən azı bir dəfə qalib gəlinən AI səviyyələri: {count}/6",method:"Düstur: son 20 oyun üzrə 100 × (AI səviyyəsi 1–6 / 6) × nəticənin (1 / 0,5 / 0) ortası. Beş oyundan sonra görünür; 0–100 oyundaxili göstəricidir, kalibrə edilmiş Elo deyil.",
    nothing:"Hələ uyğun tamamlanmış müstəqil oyun yoxdur.",win:"Qələbə",loss:"Məğlubiyyət",draw:"Heç-heçə",
    unlocked:"Açılıb",locked:"Hələ açılmayıb",modeLabel:"Oyun növü",practiceMode:"İpuclu məşq",
    independentMode:"Müstəqil oyun · köməksiz",practiceIntegrity:"Məşqdə ipucu və gedişin qaytarılması mümkündür; AI Ladder Index dəyişmir.",
    independentIntegrity:"Müstəqil oyunda ipucu, canlı təhlil və gedişin qaytarılması söndürülür. Rejim dəyişikliyi yeni oyun başladır.",
    ineligible:"Mühərrik ehtiyat AI-yə keçdiyi və ya yardım olduğu üçün oyun indeksə daxil edilmədi.",
    independentResult:"Müstəqil oyun tamamlandı və lokal AI Ladder Index-də nəzərə alındı.",
    invalidRating:"Oyun indeks üçün uyğun deyil. Təlim irəliləyişi dəyişmir.",assistBlocked:"Müstəqil oyunda kömək söndürülüb.",
    loading:"Müstəqil oyun gedir: canlı ipucları gizlədilib."
  }
 };
 let lang="ru",state=Core.empty(),ready=false;
 const format=(key,vars)=>((translations[lang]||translations.ru)[key]||key).replace(/\{(\w+)\}/g,(_m,k)=>vars&&vars[k]!==undefined?String(vars[k]):"?");
 function load(){
   // Never display cached server-owned scores before the account is re-verified.
   if(localStorage.getItem("chess-odyssey-cloud-owner-v1")){state=Core.empty();return;}
   try{state=Core.safe(JSON.parse(localStorage.getItem(KEY)||"null"),verified.games);}catch(_error){state=Core.empty();}
 }
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_error){/* private mode */}}
 function notifyCloud(){
   if(typeof root.dispatchEvent==="function"&&typeof Event==="function")root.dispatchEvent(new Event("chess-progress-commit"));
 }
 function completed(){
   try{
     const record=JSON.parse(localStorage.getItem(PRACTICE_KEY)||"null");
     return Array.isArray(record?.completed)?record.completed:[];
   }catch(_error){return [];}
 }
 const model=()=>Core.summary(state,completed(),Academy.lessons,verified.games);
 function setText(id,value){if($(id))$(id).textContent=value;}
 function refresh(){
   if(!ready)return;
   lang=["ru","en","az"].includes($("lang")?.value)?$("lang").value:lang;
   const sum=model(),matches=state.matches;
   setText("progress-eyebrow",format("eyebrow"));setText("progress-title",format("title"));
   setText("progress-lead",format("lead"));setText("progress-lang-label",format("progressLangLabel"));
   if($("progress-lang"))$("progress-lang").value=lang;
   setText("progress-rep-label",format("reputation"));
   setText("progress-rep",sum.reputation);
   setText("progress-rep-note",format("repNote"));
   setText("progress-lessons-label",format("academy"));
   setText("progress-lessons",sum.academy.done+" / "+sum.academy.total);
   setText("progress-lessons-note",format("lessons"));
   setText("progress-masters-label",format("masters"));
   setText("progress-masters",sum.masters.studied+" / "+sum.masters.total);
   setText("progress-masters-note",format("mastersNote"));
   setText("progress-index-label",format("index"));
   setText("progress-index",sum.rated.index===null?"—":sum.rated.index+" / 100");
   setText("progress-index-note",sum.rated.index===null?format("indexWaiting"):format("indexReady",{count:sum.rated.eligible,period:sum.rated.period}));
   setText("progress-academy-title",format("trackTitle"));
   setText("progress-independent-title",format("independentTitle"));
   setText("progress-achievements-title",format("achievementsTitle"));
   setText("progress-achievements-count",format("achievementsCount",{count:sum.achievements.filter(a=>a.unlocked).length,total:sum.achievements.length}));
   setText("progress-history-title",format("recentTitle"));
   setText("progress-storage-note",format("storage"));
   setText("progress-moments-label",format("moments",{done:sum.masters.momentsVisited,total:sum.masters.momentsTotal}));
   setText("progress-quiz-label",format("quizzes",{total:sum.masters.quizzesSolved}));
   setText("progress-match-count",format("resultCount",{total:sum.rated.eligible}));
   setText("progress-results",format("results",sum.rated));
   setText("progress-integrity-note",format("independentIntegrity"));
   setText("progress-index-method",format("indexIntro")+" "+format("method")+" "+(sum.rated.provisional?format("indexProvisional")+" ":"")+format("indexUncalibrated"));
   setText("progress-tier-results",format("tier",{count:Object.values(sum.rated.tiers).filter(x=>x>0).length}));
   const tracks=document.createDocumentFragment();
   for(const id of ["basics","tactics","openings","endgames"]){
     const data=sum.academy.tracks[id],box=document.createElement("div"),row=document.createElement("div"),label=document.createElement("strong"),num=document.createElement("span"),meter=document.createElement("progress");
     box.className="progress-track";row.className="progress-track-row";
     label.textContent=format("track"+id[0].toUpperCase()+id.slice(1));
     num.textContent=data.completed+" / "+data.total;
     meter.max=data.total||1;meter.value=data.completed;
     meter.setAttribute("aria-label",label.textContent);
     row.append(label,num);box.append(row,meter);tracks.appendChild(box);
   }
   $("progress-tracks").replaceChildren(tracks);
   const awards=document.createDocumentFragment();
   for(const a of sum.achievements){
     const box=document.createElement("div");box.className="progress-award"+(a.unlocked?" unlocked":" locked");
     const heading=document.createElement("strong");heading.textContent=(a.unlocked?"◆ ":"◇ ")+a.name[lang];
     const desc=document.createElement("p");desc.textContent=a.desc[lang];
     const status=document.createElement("small");status.textContent=format(a.unlocked?"unlocked":"locked");
     box.append(heading,desc,status);awards.appendChild(box);
   }
   $("progress-awards").replaceChildren(awards);
   const history=document.createDocumentFragment();
   if(!matches.length){const p=document.createElement("p");p.className="progress-note";p.textContent=format("nothing");history.appendChild(p);}
   else for(const m of matches.slice(-12).reverse()){
     const row=document.createElement("div");row.className="progress-history-row";
     const left=document.createElement("strong");left.textContent=format(m.result);
     const right=document.createElement("span");right.textContent=m.level+" · "+m.plies+" plies · "+m.date.slice(0,10);
     row.append(left,right);history.appendChild(row);
   }
   $("progress-match-history").replaceChildren(history);
   const mode=$("match-mode")?.value||"practice";
   setText("match-mode-label",format("modeLabel"));
   const select=$("match-mode");
   if(select){
     for(const option of select.options)option.textContent=format(option.value==="independent"?"independentMode":"practiceMode");
   }
   // Keep the app-reported eligibility reason, translate on language changes.
   const reason=$("match-integrity")?.dataset?.reason||(mode==="independent"?"independentIntegrity":"practiceIntegrity");
   setText("match-integrity",format(reason));
 }
 function recordStudy(id,ply){
   const game=verified.byId[id];
   if(!game)return false;
   const updated=Core.visit(state,game,ply);
   if(updated===state)return false;
   const old=JSON.stringify(state.masters[id]||null),next=JSON.stringify(updated.masters[id]||null);
   if(old===next)return false;
   state=updated;persist();refresh();notifyCloud();return true;
 }
 function recordQuiz(id,ply){
   const game=verified.byId[id];if(!game)return false;
   const changed=Core.solve(state,game,ply),old=JSON.stringify(state.masters[id]||null),next=JSON.stringify(changed.masters[id]||null);
   if(old===next)return false;
   state=changed;persist();refresh();notifyCloud();return true;
 }
 function recordGame(record){
   const result=Core.match(state,Chess,record);
   if(result.accepted){state=result.state;persist();refresh();notifyCloud();}
   return {accepted:result.accepted,reason:result.reason};
 }
 const api={
   study:recordStudy,quiz:recordQuiz,recordGame,refresh,
   snapshot:()=>({store:JSON.parse(JSON.stringify(state)),summary:model()}),
   restoreCloudStore:(raw)=>{
     const clean=Core.safe(raw,verified.games);
     if(!clean||clean.schema!==Core.VERSION)throw Error("INVALID_CLOUD_PROGRESS");
     state=clean;persist();refresh();return true;
   },
   translate:(key)=>format(key),
   language:()=>lang
 };
 root.ChessProgress=api;
 root.ChessProgressQA={
   snapshot:api.snapshot,
   simulateSummary:()=>model(),allLabels:()=>translations
 };
 function init(){
   load();ready=true;refresh();
   $("lang").addEventListener("change",()=>{lang=$("lang").value;refresh();});
   $("m-lang").addEventListener("change",()=>{lang=$("m-lang").value;refresh();});
   $("progress-lang").addEventListener("change",()=>{
     lang=$("progress-lang").value;
     $("m-lang").value=lang;
     $("m-lang").dispatchEvent(new Event("change",{bubbles:true}));
     refresh();
   });
   document.addEventListener("chess-progress-change",refresh);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})(window,document);
