/* Chess Odyssey v0.1 | Custom game, AI and coach logic | chess.js supplies legal rules */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const KEY = "chess-odyssey-v01";
  const PIECES = {wk:"♔",wq:"♕",wr:"♖",wb:"♗",wn:"♘",wp:"♙",bk:"♚",bq:"♛",br:"♜",bb:"♝",bn:"♞",bp:"♟"};
  const VALUES = {p:100,n:320,b:330,r:500,q:900,k:0};
  const FILES = "abcdefgh";
  const COACH = window.ChessCoachEngine;
  const ENGINE = window.ChessEngineBridge;
  const PROGRESS = window.ChessProgressCore;
  // Old preview smoke fixtures may omit the optional B6 module. Independent match
  // recording fails closed if the progress controller is unavailable.
  const I18N = {
    ru:{turn:"Ваш ход",thinking:"Противник выбирает ход",check:"Шах!",mate:"Мат",draw:"Ничья",win:"Победа",loss:"Поражение",select:"Выберите фигуру, затем доступную клетку.",illegal:"Недопустимый ход.",hint:"Возможные идеи",notRated:"Тренировочная игра: рейтинг не меняется.",safe:"Сейчас фигуру нельзя немедленно взять легальным ходом.",risk:"После этого хода соперник сможет взять фигуру на {square}. Подумайте о продолжении.",capture:"Взятие фигуры соперника",develop:"Развитие фигуры помогает включить её в игру.",center:"Ход влияет на борьбу за центр.",castle:"Рокировка помогает укрыть короля.",pawn:"Пешки помогают контролировать пространство.",quiet:"Спокойный ход: проверьте угрозы соперника.",lesson:"Учебная задача",lessonGood:"Верно! Продолжайте обучение.",lessonRetry:"Попробуйте выполнить показанную задачу.",lessonDone:"Урок пройден. Выберите следующий.",mateMove:"Этот ход завершает партию матом.",checkMove:"Вы даёте шах.",promo:"Выберите превращение пешки",restored:"Партия восстановлена.",newGame:"Новая тренировочная партия.",undo:"Последний ход отменён.",noUndo:"Нет ходов для отмены.",gameOver:"Партия окончена.",bot:"Компьютер",you:"Вы",beginner:"Начинающий",novice:"Любитель",intermediate:"Средний",advanced:"Продвинутый",expert:"Эксперт",grandmaster:"Гроссмейстерский вызов"},
    en:{turn:"Your turn",thinking:"Opponent is choosing a move",check:"Check!",mate:"Checkmate",draw:"Draw",win:"Victory",loss:"Defeat",select:"Select a piece, then a legal destination.",illegal:"Illegal move.",hint:"Possible ideas",notRated:"Practice game: no rating changes.",safe:"This piece cannot be captured by an immediate legal move.",risk:"After this move, your opponent can capture the piece on {square}. Consider the reply.",capture:"Captures an opposing piece.",develop:"Developing a piece brings it into play.",center:"This move contributes to control of the center.",castle:"Castling helps shelter your king.",pawn:"Pawns help claim space.",quiet:"A quiet move: check the opponent's threats.",lesson:"Training challenge",lessonGood:"Correct! Keep learning.",lessonRetry:"Try to complete the displayed challenge.",lessonDone:"Lesson complete. Choose the next one.",mateMove:"This move ends the game with checkmate.",checkMove:"This move gives check.",promo:"Choose pawn promotion",restored:"Game restored.",newGame:"New practice game.",undo:"Last turn undone.",noUndo:"No moves to undo.",gameOver:"The game has ended.",bot:"Computer",you:"You",beginner:"Beginner",novice:"Novice",intermediate:"Intermediate",advanced:"Advanced",expert:"Expert",grandmaster:"Grandmaster Challenge"},
    az:{turn:"Sizin gedişiniz",thinking:"Rəqib gedişi seçir",check:"Şah!",mate:"Mat",draw:"Heç-heçə",win:"Qələbə",loss:"Məğlubiyyət",select:"Fiquru, sonra mümkün xanəni seçin.",illegal:"Qeyri-qanuni gediş.",hint:"Mümkün ideyalar",notRated:"Məşq oyunu: reytinq dəyişmir.",safe:"Hazırda bu fiquru dərhal qanuni gedişlə almaq mümkün deyil.",risk:"Bu gedişdən sonra rəqib {square} xanəsindəki fiquru ala bilər. Cavabı nəzərdən keçirin.",capture:"Rəqib fiqurunu alır.",develop:"Fiquru inkişaf etdirmək onu oyuna qoşur.",center:"Bu gediş mərkəzə nəzarətə kömək edir.",castle:"Rokirovka şahı qorumağa kömək edir.",pawn:"Piyadalar sahəyə nəzarəti artırır.",quiet:"Sakit gediş: rəqibin təhdidlərini yoxlayın.",lesson:"Təlim tapşırığı",lessonGood:"Düzdür! Öyrənməyə davam edin.",lessonRetry:"Göstərilən tapşırığı yerinə yetirin.",lessonDone:"Dərs tamamlandı. Növbəti dərsi seçin.",mateMove:"Bu gediş oyunu mat ilə bitirir.",checkMove:"Bu gediş şah verir.",promo:"Piyadanın çevrilməsini seçin",restored:"Oyun bərpa edildi.",newGame:"Yeni məşq oyunu.",undo:"Son gediş ləğv edildi.",noUndo:"Ləğv ediləcək gediş yoxdur.",gameOver:"Oyun başa çatıb.",bot:"Kompüter",you:"Siz",beginner:"Başlanğıc",novice:"Həvəskar",intermediate:"Orta",advanced:"İrəliləmiş",expert:"Ekspert",grandmaster:"Qrossmeyster sınağı"}
  };
  const ACADEMY=window.ChessAcademy;
  if(!ACADEMY||typeof ACADEMY.createPosition!=="function")throw new Error("Chess Academy content missing");
  const LESSONS=ACADEMY.lessons;
  let game = new Chess();
  let language = "ru", side = "w", difficulty = "beginner", selected = null, last = null, lesson = null;
  let completed = [], stats = {wins:0,losses:0,draws:0}, epoch = 0, aiTimer = null, finalized = false, pendingPromotion = null, parked = null;
  let notes = [], hintState = null, showReview = false;
  let lessonStep=0,academyTrack="all",lastLessonId=null;
  let matchMode="practice",matchSession=null;
  const engine = ENGINE && new ENGINE.Bridge();
  let lastEngineKind="local";
  function tr(k) {return (I18N[language] || I18N.ru)[k] || k;}
  function text(k, val){return $(k) && ($(k).textContent=val);}
  function message(str){text("coach-message",str);}
  function learnMessage(str){text("lesson-status",str);}
  const prog=(key)=>window.ChessProgress?.translate?.(key)||key;
  const matchId=()=>("g-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,12));
  function currentMatch(){return matchMode==="independent"&&!lesson&&Boolean(matchSession);}
  function matchNotice(key){const node=$("match-integrity");node.dataset.reason=key;node.textContent=prog(key);}
  function restoreMatchNotice(){
    const code=matchMode==="independent"?(matchSession?.fallback||matchSession?.assisted?"ineligible":"independentIntegrity"):"practiceIntegrity";
    matchNotice(code);$("match-mode").value=matchMode;
  }


  const ENGINE_MESSAGES = {
    ru:{local:"Локальный учебный AI · лёгкий режим",pending:"Stockfish 19 Lite · запустится на ходе компьютера",loading:"Stockfish 19 Lite · вычисляет ход",stockfish:"Stockfish 19 Lite · настоящий UCI-движок",fallback:"Запасной локальный AI · Stockfish недоступен; сила ниже выбранного уровня"},
    en:{local:"Local practice AI · gentle mode",pending:"Stockfish 19 Lite · starts on the computer's turn",loading:"Stockfish 19 Lite · searching",stockfish:"Stockfish 19 Lite · real UCI engine",fallback:"Local fallback AI · Stockfish unavailable; weaker than selected level"},
    az:{local:"Lokal məşq AI · yüngül rejim",pending:"Stockfish 19 Lite · kompüterin gedişində başlayır",loading:"Stockfish 19 Lite · gedişi hesablayır",stockfish:"Stockfish 19 Lite · həqiqi UCI mühərriki",fallback:"Ehtiyat lokal AI · Stockfish mövcud deyil; seçilən səviyyədən zəifdir"}
  };
  function canRunStockfish(){
    return typeof Worker==="function" && typeof location!=="undefined" &&
      (location.protocol==="http:"||location.protocol==="https:");
  }
  function showEngineStatus(kind){
    lastEngineKind=kind;
    const el=$("engine-status");
    el.dataset.kind=kind;
    el.textContent=(ENGINE_MESSAGES[language]||ENGINE_MESSAGES.ru)[kind]||kind;
  }
  function updateEngineAvailability(){
    const tier=ENGINE.profile(difficulty);
    showEngineStatus(tier.mode==="local"?"local":canRunStockfish()?"pending":"fallback");
  }

  const ACADEMY_MESSAGES={
    ru:{step:"Шаг {current} из {total}.",completed:"Урок выполнен. Можно продолжить обучение или вернуться к партии.",inTrack:"В разделе: {total}. Пройдено: {done}.",overall:"Всего уроков: {total}. Пройдено: {done}.",hint:"Подсказка: сыграйте {move}.",wrong:"Это легальный ход, но не решение задания. Проверьте цель урока."},
    en:{step:"Step {current} of {total}.",completed:"Lesson complete. Continue learning or return to your game.",inTrack:"In this track: {total}. Completed: {done}.",overall:"All lessons: {total}. Completed: {done}.",hint:"Hint: play {move}.",wrong:"That move is legal, but it does not solve this exercise. Check the lesson goal."},
    az:{step:"Addım {current}/{total}.",completed:"Dərs tamamlandı. Növbəti dərsə keçə və ya oyuna qayıda bilərsiniz.",inTrack:"Bölmədə: {total}. Tamamlanıb: {done}.",overall:"Bütün dərslər: {total}. Tamamlanıb: {done}.",hint:"İpucu: {move} gedişini edin.",wrong:"Bu gediş qanunidir, lakin tapşırığın həlli deyil. Dərsin məqsədini yoxlayın."}
  };
  function at(key,values){
    return ((ACADEMY_MESSAGES[language]||ACADEMY_MESSAGES.ru)[key]||key)
      .replace(/\{(\w+)\}/g,(_,name)=>values&&values[name]!==undefined?String(values[name]):"?");
  }
  function lessonTask(){return lesson?ACADEMY.byId[lesson]||null:null;}
  function lessonPrompt(task){
    const stage=task.steps[lessonStep];
    return at("step",{current:lessonStep+1,total:task.steps.length})+" "+stage.prompt[language];
  }
  function renderAcademy(){
    const tasks=LESSONS.filter(x=>academyTrack==="all"||x.track===academyTrack);
    text("academy-track-status",at(academyTrack==="all"?"overall":"inTrack",{total:tasks.length,done:tasks.filter(x=>completed.includes(x.id)).length}));
    const options=$("lesson").options;
    options[0].textContent=LABELS[language].chooseLesson;
    LESSONS.forEach((task,i)=>{
      const option=options[i+1];
      if(!option)throw new Error("Missing Academy option "+task.id);
      option.textContent=(completed.includes(task.id)?"✓ ":"")+task.title[language];
      option.hidden=academyTrack!=="all"&&task.track!==academyTrack&&task.id!==lesson;
      option.disabled=option.hidden;
    });
    const task=lessonTask();
    $("academy-intro").hidden=!task;
    $("academy-step").hidden=!task;
    text("academy-intro",task?task.intro[language]:"");
    text("academy-step",task?lessonPrompt(task):"");
    $("next-lesson").hidden=!lastLessonId||!parked||Boolean(lesson);
    text("completed",completed.length+"/"+LESSONS.length);
  }

  const COACH_TEXT = {
    ru:{
      hintIntro:"Возможные ходы (быстрый просмотр на один ответ соперника, не глубокий анализ):",
      candidate:"Вариант",answer:"Возможный ответ соперника",noAnswer:"Ответа нет: партия закончена",
      captureRisk:"Соперник может сразу взять фигуру на {square} ходом {reply}. Это возможность взятия, не доказательство потери.",
      major:"По короткой оценке этот ход существенно слабее варианта {best}.",
      warning:"По короткой оценке стоит рассмотреть альтернативу {best}.",
      fine:"Короткая проверка не выявила существенного отставания от варианта {best}.",
      reviewEmpty:"Пока нет ходов для разбора. Сыграйте хотя бы один ход.",
      reviewCount:"Разобрано ходов: {total}. Заметных отклонений в коротком расчёте: {count}.",
      reviewMove:"Ваш ход №{ply}: {san}",reviewAlternative:"Альтернатива",limited:"Оценка предварительная, только на один ответ соперника.",
      reasonMate:"Шах и мат подтверждены правилами.",reasonCheck:"Шах: король соперника под атакой.",
      reasonCapture:"Ход забирает фигуру соперника.",reasonCastle:"Рокировка уводит короля в сторону и развивает ладью.",
      reasonDevelop:"Фигура выходит с начального поля в игру.",reasonCenter:"Ход помогает бороться за центральные поля.",
      reasonPawn:"Пешка продвигается и меняет контроль над клетками.",
      reasonQuiet:"Нет немедленного взятия или шаха: проверьте возможный ответ."
    },
    en:{
      hintIntro:"Legal ideas (short look-ahead: one opponent reply, not deep analysis):",
      candidate:"Candidate",answer:"Possible opponent reply",noAnswer:"No reply: the game has ended",
      captureRisk:"The opponent can immediately capture a piece on {square} with {reply}. This is a legal capture, not proof of material loss.",
      major:"In this shallow check, the move is substantially weaker than {best}.",
      warning:"This shallow check suggests considering {best}.",
      fine:"The shallow check found no significant gap from {best}.",
      reviewEmpty:"No moves to review yet. Play at least one move.",
      reviewCount:"Moves analyzed: {total}. Notable gaps in the shallow check: {count}.",
      reviewMove:"Your move #{ply}: {san}",reviewAlternative:"Alternative",limited:"Preliminary estimate, looking only one opponent reply ahead.",
      reasonMate:"Checkmate confirmed by the rules.",reasonCheck:"Check: the enemy king is under attack.",
      reasonCapture:"This move captures an opposing piece.",reasonCastle:"Castling shelters the king and activates the rook.",
      reasonDevelop:"A piece leaves its starting square and enters play.",reasonCenter:"This move helps contest the central squares.",
      reasonPawn:"The pawn advances and changes square control.",
      reasonQuiet:"No immediate capture or check: consider the opponent's reply."
    },
    az:{
      hintIntro:"Qanuni variantlar (rəqibin bir cavab gedişi üzrə qısa baxış, dərin təhlil deyil):",
      candidate:"Variant",answer:"Rəqibin mümkün cavabı",noAnswer:"Cavab yoxdur: oyun başa çatıb",
      captureRisk:"Rəqib {reply} gedişi ilə {square} xanəsindəki fiquru dərhal ala bilər. Bu, mümkün götürmədir, mütləq itki deyil.",
      major:"Qısa qiymətləndirməyə görə bu gediş {best} variantından xeyli zəifdir.",
      warning:"Qısa qiymətləndirməyə əsasən {best} variantını da nəzərdən keçirin.",
      fine:"Qısa yoxlama {best} variantına nisbətən əhəmiyyətli fərq göstərmədi.",
      reviewEmpty:"Hələ təhlil ediləcək gediş yoxdur. Ən azı bir gediş edin.",
      reviewCount:"Təhlil edilən gedişlər: {total}. Qısa yoxlamada nəzərə çarpan fərqlər: {count}.",
      reviewMove:"Sizin {ply}-ci gedişiniz: {san}",reviewAlternative:"Alternativ",limited:"İlkin qiymətləndirmədir: yalnız rəqibin bir cavab gedişi yoxlanılıb.",
      reasonMate:"Mat şahmat qaydaları ilə təsdiqlənib.",reasonCheck:"Şah: rəqibin şahı hücum altındadır.",
      reasonCapture:"Bu gediş rəqibin fiqurunu alır.",reasonCastle:"Rokirovka şahı qoruyur və topu oyuna qoşur.",
      reasonDevelop:"Fiqur başlanğıc xanəsindən oyuna daxil olur.",reasonCenter:"Bu gediş mərkəzi xanələr uğrunda mübarizəyə kömək edir.",
      reasonPawn:"Piyada irəliləyir və xanələrə nəzarəti dəyişir.",
      reasonQuiet:"Dərhal götürmə və ya şah yoxdur: rəqibin cavabını nəzərdən keçirin."
    }
  };
  function ct(key, values){
    const raw=(COACH_TEXT[language]||COACH_TEXT.ru)[key]||key;
    return raw.replace(/\{(\w+)\}/g,(_match,name)=>values&&values[name]!==undefined?String(values[name]):"?");
  }
  function reason(kind){return ct("reason"+(kind||"quiet").charAt(0).toUpperCase()+(kind||"quiet").slice(1));}
  function clearHints(){hintState=null;$("coach-variations").replaceChildren();$("coach-variations").hidden=true;}
  function appendLabel(parent,heading,detail){
    const bold=document.createElement("strong");bold.textContent=heading;
    const info=document.createElement("p");info.textContent=detail;
    parent.appendChild(bold);parent.appendChild(info);
  }
  function showHints(){
    const list=$("coach-variations");list.replaceChildren();
    if(currentMatch()&&!finalized){list.hidden=true;return;}
    if(!hintState || hintState.fen!==game.fen()){list.hidden=true;return;}
    for(let i=0;i<hintState.lines.length;i++){
      const line=hintState.lines[i], item=document.createElement("li");
      const responses=line.reply ? ct("answer")+": "+line.reply : ct("noAnswer");
      const capture=line.risk?" "+ct("captureRisk",{square:line.risk.square,reply:line.risk.capture}):"";
      appendLabel(item,(i+1)+". "+line.san,reason(line.kind)+" "+responses+"."+capture);
      list.appendChild(item);
    }
    list.hidden=hintState.lines.length===0;
  }
  function gradeCompletedIndependentGame(){
    // Post-game only. Rebuild the exact played PGN; no analysis during the rated match.
    if(!currentMatch()||!finalized||!game.game_over()||notes.length)return;
    const transcript=game.history({verbose:true}),replay=new Chess(),result=[];
    for(let i=0;i<transcript.length;i++){
      const played=transcript[i];
      if(played.color===side){
        const detail=COACH.grade(replay,played.san);
        result.push(Object.assign({ply:i+1},detail));
      }
      if(!replay.move(played.san))throw new Error("Invalid scored PGN at "+i);
    }
    if(replay.fen()!==game.fen())throw new Error("Postgame replay changed chess truth");
    notes=result.slice(-160);persist();
  }
  function renderReview(){
    const panel=$("coach-review"),list=$("review-list");
    panel.hidden=!showReview||(currentMatch()&&!finalized);list.replaceChildren();
    if(!showReview||(currentMatch()&&!finalized))return;
    if(!notes.length){const item=document.createElement("li");item.textContent=ct("reviewEmpty");list.appendChild(item);return;}
    const count=notes.filter(x=>x.severity!=="fine").length;
    const intro=document.createElement("li");
    intro.textContent=ct("reviewCount",{total:notes.length,count});
    list.appendChild(intro);
    const ranked=notes.slice().sort((a,b)=>b.drop-a.drop||a.ply-b.ply).slice(0,3);
    for(const note of ranked){
      const item=document.createElement("li"),better=ct("reviewAlternative")+": "+note.best;
      const verdict=ct(note.severity,{best:note.best});
      const response=note.reply?ct("answer")+": "+note.reply+". ":"";
      appendLabel(item,ct("reviewMove",{ply:note.ply,san:note.san}),
        verdict+" "+reason(note.kind)+" "+better+". "+response);
      list.appendChild(item);
    }
    const caution=document.createElement("li");caution.textContent=ct("limited");list.appendChild(caution);
  }
  function assessmentMessage(note){
    const base=ct(note.severity,{best:note.best});
    const counter=note.reply?ct("answer")+": "+note.reply+". ":"";
    const capture=note.risk?ct("captureRisk",{square:note.risk.square,reply:note.risk.capture}):"";
    return base+" "+reason(note.kind)+" "+counter+capture;
  }

  function boardSquares(){const squares=[]; for(let rank=8;rank>=1;rank--) for(const file of FILES) squares.push(file+rank); return squares;}
  function fileRank(s){return [FILES.indexOf(s[0]),Number(s[1])-1];}
  function scorePosition(){
    if(game.in_checkmate()) return game.turn()==="w" ? -100000:100000;
    if(game.in_draw()) return 0;
    let value=0;
    const rows=game.board();
    for(let ri=0;ri<8;ri++) for(let ci=0;ci<8;ci++){
      const piece=rows[ri][ci];
      if(!piece) continue;
      const p=piece.type, sign=piece.color==="w"?1:-1;
      const f=ci, r=7-ri;
      const center=3.5-(Math.abs(f-3.5)+Math.abs(r-3.5))/2;
      const bonus=p==="n"?center*10:p==="b"?center*5:p==="p"?(piece.color==="w"?r:7-r)*3:0;
      value+=sign*(VALUES[p]+bonus);
    }
    return value;
  }
  function search(depth,alpha,beta){
    if(depth===0 || game.game_over()) return scorePosition()*(game.turn()==="w"?1:-1);
    let best=-Infinity;
    const moves=game.moves({verbose:true});
    moves.sort((a,b)=>(b.captured?VALUES[b.captured]:0)-(a.captured?VALUES[a.captured]:0));
    for(const move of moves){
      game.move(move);
      const value=-search(depth-1,-beta,-alpha);
      game.undo();
      if(value>best) best=value;
      if(value>alpha) alpha=value;
      if(alpha>=beta) break;
    }
    return best;
  }
  function candidates(depth){
    const list=[];
    for(const move of game.moves({verbose:true})){
      game.move(move);
      const value=-search(depth-1,-Infinity,Infinity);
      game.undo();
      list.push({move,score:value});
    }
    list.sort((a,b)=>b.score-a.score || a.move.san.localeCompare(b.move.san));
    return list;
  }
  function completeBotMove(choice){
    if(!choice||game.game_over()||lesson||game.turn()===side)return false;
    const moved=game.move(choice);
    if(!moved)return false;
    clearHints();last=[moved.from,moved.to];finalized=false;selected=null;
    if(currentMatch()&&ENGINE.profile(difficulty).mode!=="local"&&lastEngineKind!=="stockfish")matchSession.fallback=true;
    render();persist();
    if(game.game_over())finish();else message(currentMatch()?prog("loading"):explain(moved));
    return true;
  }
  function fallbackBotMove(){
    if(game.game_over()||lesson||game.turn()===side)return;
    const tier=ENGINE.profile(difficulty);
    // No grandmaster claim for the low-depth fallback.
    const depth=tier.mode==="local"?tier.localDepth:Math.min(2,tier.localDepth);
    const ranked=candidates(depth);
    if(!ranked.length)return;
    const top=ranked[0].score,margin=tier.mode==="local"?tier.spread:0;
    const allowed=ranked.filter(x=>x.score>=top-margin).slice(0,tier.mode==="local"?5:1);
    completeBotMove(allowed[Math.floor(Math.random()*allowed.length)].move);
  }
  function botMove(){
    if(game.game_over()||lesson||game.turn()===side)return;
    const tier=ENGINE.profile(difficulty);
    if(tier.mode==="local"){showEngineStatus("local");fallbackBotMove();return;}
    if(!canRunStockfish()){showEngineStatus("fallback");fallbackBotMove();return;}
    const currentEpoch=epoch,fen=game.fen();
    showEngineStatus("loading");
    engine.choose(fen,difficulty).then(({uci})=>{
      if(currentEpoch!==epoch||game.fen()!==fen||game.game_over()||lesson)return;
      const legal=ENGINE.legalUci(game,uci);
      if(!legal){showEngineStatus("fallback");fallbackBotMove();return;}
      showEngineStatus("stockfish");
      completeBotMove({from:legal.from,to:legal.to,promotion:legal.promotion});
    }).catch(()=>{
      if(currentEpoch!==epoch||game.fen()!==fen||game.game_over()||lesson)return;
      showEngineStatus("fallback");fallbackBotMove();
    });
  }
  function scheduleBot(){
    clearTimeout(aiTimer); const version=++epoch;
    aiTimer=setTimeout(()=>{if(version===epoch) botMove();},230);
  }
  function explain(move){
    if(game.in_checkmate()) return tr("mateMove");
    if(game.in_check()) return tr("checkMove");
    if(move.flags.includes("c") || move.flags.includes("e")) return tr("capture");
    if(move.flags.includes("k") || move.flags.includes("q")) return tr("castle");
    if((move.piece==="n"||move.piece==="b") && (move.from[1]==="1" || move.from[1]==="8")) return tr("develop");
    if(["d4","e4","d5","e5"].includes(move.to)) return tr("center");
    if(move.piece==="p") return tr("pawn");
    return tr("quiet");
  }
function hint(){
    if(currentMatch()&&!finalized)return message(prog("assistBlocked"));
    if(game.game_over())return message(tr("gameOver"));
    if(!lesson&&game.turn()!==side)return;
    if(lesson){
      const task=lessonTask(),san=task.steps[lessonStep].san;
      const expected=game.moves({verbose:true}).find(x=>x.san===san);
      if(!expected)throw new Error("Academy answer not legal: "+task.id+"/"+san);
      selected=expected.from;
      message(at("hint",{move:san})+" "+task.steps[lessonStep].prompt[language]);
      render();return;
    }
    const analysis=COACH.analyze(game,{limit:3});
    hintState={fen:analysis.fen,lines:analysis.lines};
    message(ct("hintIntro"));showHints();
  }
  function doMove(from,to,promotion){
    const matches=game.moves({square:from,verbose:true}).filter(x=>x.to===to);
    if(!matches.length) return message(tr("illegal"));
    if(matches.some(m=>m.promotion) && !promotion) {
      pendingPromotion={from,to}; $("promotion").hidden=false; text("promotion-label",tr("promo")); return;
    }
    const candidate=matches.find(x=>!x.promotion||x.promotion===promotion);
    if(!candidate) return message(tr("illegal"));
    if(lesson){
      const task=lessonTask();
      const expected=game.moves({verbose:true}).find(x=>x.san===task.steps[lessonStep].san);
      if(!expected)throw new Error("Academy answer not legal: "+task.id);
      if(from!==expected.from||to!==expected.to||(candidate.promotion||"")!==(expected.promotion||"")){
        selected=null;learnMessage(at("wrong"));render();return;
      }
    }
    const assessment=lesson||currentMatch()?null:COACH.grade(game,candidate.san);
    const move=game.move({from,to,promotion:promotion||"q"});
    if(!move) return message(tr("illegal"));
    last=[from,to]; selected=null;
    clearHints();
    $("promotion").hidden=true; pendingPromotion=null;
    if(lesson){
      const task=lessonTask(),stage=task.steps[lessonStep];
      if(stage.reply){
        const response=game.move(stage.reply);
        if(!response)throw new Error("Invalid scripted opponent response: "+task.id+"/"+stage.reply);
        last=[response.from,response.to];
      }
      lessonStep++;
      if(lessonStep===task.steps.length){
        if(!completed.includes(task.id))completed.push(task.id);
        lastLessonId=task.id;
        lesson=null;lessonStep=0;finalized=true;$("lesson").value="";
        learnMessage(at("completed"));
        message(tr("lessonGood")+" "+explain(move));
      }else{
        learnMessage(lessonPrompt(task));
        message(task.steps[lessonStep].prompt[language]);
      }
      renderAcademy();
    } else if(assessment){
      notes.push(Object.assign({ply:game.history().length},assessment));
      message(assessmentMessage(assessment));
    }else message(prog("loading"));
    render();persist();
    if(game.game_over()) finish();
    else if(!lesson && !finalized && game.turn()!==side) scheduleBot();
  }
  function clickSquare(square){
    if(game.game_over() || finalized || (!lesson && game.turn()!==side)) return;
    const piece=game.get(square);
    if(selected){
      if(square===selected){selected=null;render();return;}
      const allowed=game.moves({square:selected,verbose:true});
      if(allowed.some(x=>x.to===square)){doMove(selected,square);return;}
    }
    if(piece&&piece.color===game.turn()){selected=square;message(tr("select"));}
    else {selected=null;message(tr("illegal"));}
    render();
  }
  function showMoves(){
    const moves=game.history();
    const pairs=[];
    for(let i=0;i<moves.length;i+=2) pairs.push((Math.floor(i/2)+1)+". "+moves[i]+(moves[i+1]?" "+moves[i+1]:""));
    text("moves",pairs.join("   ")||"—");
  }
  function status(){
    if(game.in_checkmate()) return tr("mate") + " — " + (game.turn()===side?tr("loss"):tr("win"));
    if(game.in_draw()) return tr("draw");
    if(game.in_check()) return tr("check") + " " + (game.turn()===side?tr("turn"):tr("bot"));
    return lesson?tr("lesson"):game.turn()===side?tr("turn"):tr("thinking");
  }
  function render(){
    // Independent games do not reveal candidate destinations before the move.
    const legal=selected&&!(currentMatch()&&!finalized)?game.moves({square:selected,verbose:true}).map(m=>m.to):[];
    const flipped=$("flip").checked; const order=boardSquares();
    if(flipped) order.reverse();
    const frag=document.createDocumentFragment();
    for(const square of order){
      const p=game.get(square), [f,r]=fileRank(square);
      const b=document.createElement("button");
      b.type="button"; b.className="square "+((f+r)%2===0?"dark":"light");
      if(p)b.classList.add(p.color==="w"?"white-piece":"black-piece");
      if(selected===square)b.classList.add("selected");
      if(legal.includes(square))b.classList.add("legal");
      if(last&&last.includes(square))b.classList.add("last");
      if(p && p.type==="k" && p.color===game.turn() && game.in_check())b.classList.add("checked");
      b.setAttribute("aria-label",square+" "+(p?p.color+" "+p.type:"empty"));
      b.setAttribute("aria-pressed",selected===square?"true":"false");
      const mark=document.createElement("span");mark.className="piece";mark.textContent=p?PIECES[p.color+p.type]:"";b.appendChild(mark);
      if((flipped?r===7:r===0)) {const c=document.createElement("small");c.className="file";c.textContent=square[0];b.appendChild(c);}
      if((flipped?f===7:f===0)) {const c=document.createElement("small");c.className="rank";c.textContent=square[1];b.appendChild(c);}
      b.addEventListener("click",()=>clickSquare(square));
      frag.appendChild(b);
    }
    $("board").replaceChildren(frag);
    text("game-status",status());showMoves();
    text("record",stats.wins+" / "+stats.losses+" / "+stats.draws);
    text("completed",completed.length+"/"+LESSONS.length);
    $("undo").disabled=!!parked||!game.history().length||currentMatch();
    $("hint").disabled=currentMatch()&&!finalized;
    $("review-button").disabled=currentMatch()&&!finalized;
    $("lesson").disabled=currentMatch()&&!finalized;
    $("academy-track").disabled=currentMatch()&&!finalized;
    $("resume-game").hidden=!parked;
  }
  function finish(){
    if(finalized || lesson || !game.game_over()) return;
    if(game.in_checkmate()) {
      if(game.turn()===side)stats.losses++;
      else stats.wins++;
    } else stats.draws++;
    finalized=true;showReview=!currentMatch();
    let ratedMessage=tr("notRated");
    if(currentMatch()){
      const result=game.in_checkmate()?(game.turn()===side?"loss":"win"):"draw";
      const tier=ENGINE.profile(difficulty);
      const method=tier.mode==="local"?"local":lastEngineKind==="stockfish"&&!matchSession.fallback?"stockfish":"fallback";
      const receipt=window.ChessProgress.recordGame({...matchSession,pgn:game.pgn(),result,engine:method,level:difficulty,side,date:new Date().toISOString()});
      ratedMessage=receipt.accepted?prog("independentResult"):prog("invalidRating");
      matchNotice(receipt.accepted?"independentResult":"ineligible");
    }
    persist();render();renderReview();
    message(status()+" — "+ratedMessage);
  }
  function persist(){
    const session=parked||{pgn:lesson?null:game.pgn(),side,difficulty,flipped:$("flip").checked,finalized:finalized&&!lesson,notes};
    try{localStorage.setItem(KEY,JSON.stringify({pgn:session.pgn,side:session.side,difficulty:session.difficulty,language,completed,stats,flipped:session.flipped,finalized:session.finalized,notes:session.notes||[],academy:lesson?{id:lesson,step:lessonStep}:null,academyTrack,matchMode,matchSession}));}
    catch(e){message("Storage unavailable; progress cannot be saved.");}
  }
  function restore(){
    try {
      const raw=localStorage.getItem(KEY);if(!raw)return;
      const data=JSON.parse(raw);
      language=["ru","en","az"].includes(data.language)?data.language:"ru";
      side=["w","b"].includes(data.side)?data.side:"w";
      difficulty=ENGINE.ids.includes(data.difficulty)?data.difficulty:"beginner";
      const m=data.matchSession;
      const matchValid=data.matchMode==="independent"&&m&&typeof m.id==="string"&&/^g-[a-z0-9-]{6,60}$/.test(m.id)&&m.mode==="independent"&&m.side===side&&m.level===difficulty;
      matchMode=matchValid?"independent":"practice";
      matchSession=matchValid?{id:m.id,mode:"independent",side,level:difficulty,assisted:Boolean(m.assisted),undone:Boolean(m.undone),restarted:Boolean(m.restarted),fallback:Boolean(m.fallback)}:null;
      completed=Array.isArray(data.completed)?[...new Set(data.completed.filter(x=>Boolean(ACADEMY.byId[x])))]:[];
      academyTrack=data.academyTrack==="all"||ACADEMY.tracks.some(x=>x.id===data.academyTrack)?data.academyTrack:"all";
      stats=data.stats&&["wins","losses","draws"].every(k=>Number.isInteger(data.stats[k])&&data.stats[k]>=0)?data.stats:stats;
      if(typeof data.pgn==="string"&&data.pgn.trim()){const test=new Chess();if(test.load_pgn(data.pgn))game=test;}
      finalized=Boolean(data.finalized);
      const savedHistory=game.history();
      notes=Array.isArray(data.notes)?data.notes.filter(x=>x&&Number.isInteger(x.ply)&&x.ply>0&&x.ply<=savedHistory.length&&savedHistory[x.ply-1]===x.san&&typeof x.best==="string"&&Number.isFinite(x.drop)&&["fine","warning","major"].includes(x.severity)).slice(-160):[];
      showReview=finalized&&game.game_over()&&notes.length>0;
      // A lesson may be continued across reload, while the original practice PGN stays parked.
      if(data.academy&&ACADEMY.byId[data.academy.id]){
        const task=ACADEMY.byId[data.academy.id],step=data.academy.step;
        if(Number.isInteger(step)&&step>=0&&step<task.steps.length){
          const staged=ACADEMY.createPosition(task,Chess);
          let valid=true;
          for(let i=0;i<step;i++){
            const turn=task.steps[i];
            if(!staged.move(turn.san)||(turn.reply&&!staged.move(turn.reply))){valid=false;break;}
          }
          if(valid){
            parked={pgn:game.pgn(),side,difficulty,flipped:Boolean(data.flipped),finalized,notes:notes.slice()};
            game=staged;side=game.turn();lesson=task.id;lessonStep=step;finalized=false;
            showReview=false;
          }
        }
      }
      $("flip").checked=Boolean(data.flipped);
      $("lang").value=language;$("side").value=side;$("level").value=difficulty;
      $("academy-track").value=academyTrack;$("lesson").value=lesson||"";
      $("match-mode").value=matchMode;
      if(lesson){matchMode="practice";matchSession=null;$("match-mode").value="practice";}
      if(game.history().length)last=game.history({verbose:true}).slice(-1).map(x=>[x.from,x.to])[0]||null;
      restoreMatchNotice();message(tr("restored"));
    }catch(e){message("Saved state is invalid; a fresh game was started.");}
  }
  function newGame(){
    clearTimeout(aiTimer);++epoch;engine.cancel();game=new Chess();lesson=null;lessonStep=0;lastLessonId=null;parked=null;selected=null;last=null;finalized=false;notes=[];showReview=false;clearHints();renderReview();
    $("lesson").value="";
    side=$("side").value;difficulty=$("level").value;language=$("lang").value;
    matchMode=$("match-mode").value==="independent"?"independent":"practice";
    matchSession=matchMode==="independent"?{id:matchId(),mode:"independent",side,level:difficulty,assisted:false,undone:false,restarted:false,fallback:false}:null;
    if(matchSession&&(!PROGRESS||!window.ChessProgress?.recordGame))matchSession.assisted=true;
    if(matchSession&&ENGINE.profile(difficulty).mode!=="local"&&!canRunStockfish())matchSession.fallback=true;
    updateEngineAvailability();restoreMatchNotice();
    learnMessage("");message(tr("newGame")+" "+(currentMatch()?prog("loading"):tr("notRated")));render();renderAcademy();persist();
    if(side==="b")scheduleBot();
  }
  function undo(){
    if(currentMatch())return message(prog("assistBlocked"));
    if(lesson||parked||!game.history().length)return message(tr("noUndo"));
    clearTimeout(aiTimer);++epoch;engine.cancel();
    if(finalized&&game.game_over()){
      const outcome=game.in_checkmate()?(game.turn()===side?"losses":"wins"):"draws";
      stats[outcome]=Math.max(0,stats[outcome]-1);
    }
    game.undo();
    if(game.history().length&&game.turn()!==side) game.undo();
    notes=notes.filter(x=>x.ply<=game.history().length);showReview=false;clearHints();renderReview();
    selected=null;last=null;finalized=false;
    message(tr("undo"));render();persist();
    if(game.turn()!==side)scheduleBot();
  }
  function startLesson(id){
    if(currentMatch()&&!finalized){$("lesson").value="";return message(prog("assistBlocked"));}
    const task=ACADEMY.byId[id];if(!task)return;
    if(!parked)parked={pgn:game.pgn(),side,difficulty,flipped:$("flip").checked,finalized,notes:notes.slice()};
    clearHints();showReview=false;renderReview();
    clearTimeout(aiTimer);++epoch;engine.cancel();
    game=ACADEMY.createPosition(task,Chess);
    lesson=id;lessonStep=0;lastLessonId=null;side=game.turn();selected=null;last=null;finalized=false;
    $("side").value=side;$("lesson").value=id;
    render();renderAcademy();
    message(task.intro[language]);learnMessage(lessonPrompt(task));
    persist();
  }
  function nextLesson(){
    if(!lastLessonId||!parked)return;
    const i=LESSONS.findIndex(x=>x.id===lastLessonId);
    if(i<0)return;
    const next=LESSONS[(i+1)%LESSONS.length];
    academyTrack=next.track;$("academy-track").value=academyTrack;
    startLesson(next.id);
  }
    function resumeGame(){
    if(!parked)return;
    const previous=parked, restored=new Chess();
    if(previous.pgn && !restored.load_pgn(previous.pgn))return message("Cannot restore saved PGN.");
    clearTimeout(aiTimer);++epoch;engine.cancel();game=restored;parked=null;lesson=null;lessonStep=0;lastLessonId=null;selected=null;
    side=previous.side;difficulty=previous.difficulty;finalized=previous.finalized;notes=previous.notes||[];
    clearHints();showReview=finalized&&game.game_over();renderReview();
    $("side").value=side;$("level").value=difficulty;$("flip").checked=previous.flipped;$("lesson").value="";
    updateEngineAvailability();
    learnMessage("");message(tr("restored"));render();renderAcademy();persist();
    if(!finalized&&!game.game_over()&&game.turn()!==side)scheduleBot();
  }
  function refreshLabels(){
    document.documentElement.lang=language;
    for(const node of document.querySelectorAll("[data-i18n]")){
      const name=node.getAttribute("data-i18n");
      node.textContent=LABELS[language][name]||LABELS.ru[name]||name;
    }
    const task=lessonTask();
    if(task){learnMessage(lessonPrompt(task));message(task.intro[language]);}
    else if(lastLessonId&&parked)learnMessage(at("completed"));
    else learnMessage("");
    if(!task){
      if(hintState&&hintState.fen===game.fen())message(ct("hintIntro"));
      else if(game.game_over())message(status()+" — "+(currentMatch()?prog("independentResult"):tr("notRated")));
      else if(currentMatch())message(prog("loading"));
      else if(notes.length)message(assessmentMessage(notes[notes.length-1]));
      else message(tr("select"));
    }
    renderAcademy();showHints();renderReview();render();
    showEngineStatus(lastEngineKind);restoreMatchNotice();
  }
    const LABELS={
    ru:{title:"Chess Odyssey",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Учимся играя",newGame:"Новая партия",undo:"Отменить ход",hint:"Подсказка",game:"Тренировочная партия",level:"Сложность AI",side:"Мои фигуры",language:"Язык",flip:"Повернуть доску",lessons:"Академия",chooseLesson:"Выбрать урок…",resume:"Вернуться к партии",academyTrack:"Раздел обучения",allTracks:"Все разделы",trackBasics:"Основы и правила",trackTactics:"Тактика и комбинации",trackOpenings:"Дебютные идеи",trackEndgames:"Эндшпиль",academyLesson:"Урок или задача",nextLesson:"Следующий урок",reviewButton:"Разобрать ходы",reviewTitle:"Ключевые моменты",record:"Победы / поражения / ничьи",done:"Пройдено уроков",moves:"История ходов",about:"Рейтинг отключён в тренировке; без таймера",white:"Белые",black:"Чёрные",beginner:"Начинающий",novice:"Любитель",intermediate:"Средний",advanced:"Продвинутый",expert:"Эксперт",grandmaster:"Гроссмейстерский вызов"},
    en:{title:"Chess Odyssey",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Learn by playing",newGame:"New game",undo:"Undo move",hint:"Hint",game:"Practice game",level:"AI difficulty",side:"My pieces",language:"Language",flip:"Flip board",lessons:"Academy",chooseLesson:"Choose a lesson…",resume:"Return to game",academyTrack:"Learning track",allTracks:"All tracks",trackBasics:"Rules and essentials",trackTactics:"Tactics and combinations",trackOpenings:"Opening ideas",trackEndgames:"Endgame",academyLesson:"Lesson or challenge",nextLesson:"Next lesson",reviewButton:"Review moves",reviewTitle:"Key moments",record:"Wins / losses / draws",done:"Lessons completed",moves:"Move history",about:"No rating in practice; no chess clock",white:"White",black:"Black",beginner:"Beginner",novice:"Novice",intermediate:"Intermediate",advanced:"Advanced",expert:"Expert",grandmaster:"Grandmaster Challenge"},
    az:{title:"Chess Odyssey",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Oynayaraq öyrənin",newGame:"Yeni oyun",undo:"Gedişi ləğv et",hint:"İpucu",game:"Məşq oyunu",level:"AI çətinliyi",side:"Mənim fiqurlarım",language:"Dil",flip:"Taxtanı çevir",lessons:"Akademiya",chooseLesson:"Dərs seçin…",resume:"Oyuna qayıt",academyTrack:"Təlim bölməsi",allTracks:"Bütün bölmələr",trackBasics:"Qaydalar və əsaslar",trackTactics:"Taktika və kombinasiyalar",trackOpenings:"Debüt ideyaları",trackEndgames:"Endşpil",academyLesson:"Dərs və ya tapşırıq",nextLesson:"Növbəti dərs",reviewButton:"Gedişləri təhlil et",reviewTitle:"Əsas məqamlar",record:"Qələbə / məğlubiyyət / heç-heçə",done:"Tamamlanmış dərslər",moves:"Gedişlərin tarixçəsi",about:"Məşqdə reytinq yoxdur; vaxt limiti yoxdur",white:"Ağlar",black:"Qaralar",beginner:"Başlanğıc",novice:"Həvəskar",intermediate:"Orta",advanced:"İrəliləmiş",expert:"Ekspert",grandmaster:"Qrossmeyster sınağı"}
  };
  function init(){
    if(typeof Chess!=="function")throw new Error("Rules Engine missing");
    if(!COACH||typeof COACH.analyze!=="function")throw new Error("Chess Coach Engine missing");
    if(!ENGINE||typeof ENGINE.legalUci!=="function")throw new Error("Chess Engine Bridge missing");
    restore();
    $("new-game").addEventListener("click",newGame);
    $("undo").addEventListener("click",undo);
    $("resume-game").addEventListener("click",resumeGame);
    $("next-lesson").addEventListener("click",nextLesson);
    $("academy-track").addEventListener("change",()=>{academyTrack=$("academy-track").value;renderAcademy();});
    $("hint").addEventListener("click",hint);
    $("review-button").addEventListener("click",()=>{
      if(currentMatch()&&!finalized)return;
      if(currentMatch()&&finalized&&!showReview)gradeCompletedIndependentGame();
      showReview=!showReview;renderReview();
    });
    $("flip").addEventListener("change",()=>{render();persist();});
    $("lang").addEventListener("change",()=>{language=$("lang").value;refreshLabels();persist();});
    $("side").addEventListener("change",newGame);
    $("level").addEventListener("change",newGame);
    $("match-mode").addEventListener("change",newGame);
    $("lesson").addEventListener("change",()=>{if($("lesson").value)startLesson($("lesson").value);});
    for(const btn of document.querySelectorAll("[data-promote]"))btn.addEventListener("click",()=>{if(pendingPromotion)doMove(pendingPromotion.from,pendingPromotion.to,btn.dataset.promote);});
    $("promotion-close").addEventListener("click",()=>{pendingPromotion=null;$("promotion").hidden=true;});
    updateEngineAvailability();
    refreshLabels();restoreMatchNotice();
    if(showReview)renderReview();
    if(game.turn()!==side && !game.game_over() && !finalized)scheduleBot();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
  // Stable test surface without providing a user-facing debug console.
  window.ChessOdysseyQA={academy:()=>({total:LESSONS.length,tracks:ACADEMY.tracks.map(x=>x.id),active:lesson,step:lessonStep}),levels:()=>ENGINE.ids.slice(),engineStatus:()=>lastEngineKind,legalUci:(fen,uci)=>{const c=new Chess(fen);return ENGINE.legalUci(c,uci);},legalCount:(fen)=>{const c=new Chess();if(fen&&!c.load(fen))throw new Error("invalid FEN");return c.moves().length;},lessonIds:()=>LESSONS.map(x=>x.id),evaluate:()=>scorePosition(),coach:()=>COACH.version,notes:()=>notes.length,match:()=>({mode:matchMode,session:matchSession&&{...matchSession},finalized}),progress:()=>window.ChessProgress.snapshot().summary};
})();