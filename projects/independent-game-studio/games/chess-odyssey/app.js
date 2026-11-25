/* Chess Odyssey v0.1 | Custom game, AI and coach logic | chess.js supplies legal rules */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const KEY = "chess-odyssey-v01";
  const PIECES = {wk:"♔",wq:"♕",wr:"♖",wb:"♗",wn:"♘",wp:"♙",bk:"♚",bq:"♛",br:"♜",bb:"♝",bn:"♞",bp:"♟"};
  const VALUES = {p:100,n:320,b:330,r:500,q:900,k:0};
  const FILES = "abcdefgh";
  const BOARD_NAMES={
    ru:{empty:"пустая клетка",wk:"белый король",wq:"белый ферзь",wr:"белая ладья",wb:"белый слон",wn:"белый конь",wp:"белая пешка",bk:"чёрный король",bq:"чёрный ферзь",br:"чёрная ладья",bb:"чёрный слон",bn:"чёрный конь",bp:"чёрная пешка"},
    en:{empty:"empty square",wk:"white king",wq:"white queen",wr:"white rook",wb:"white bishop",wn:"white knight",wp:"white pawn",bk:"black king",bq:"black queen",br:"black rook",bb:"black bishop",bn:"black knight",bp:"black pawn"},
    az:{empty:"boş xana",wk:"ağ şah",wq:"ağ vəzir",wr:"ağ top",wb:"ağ fil",wn:"ağ at",wp:"ağ piyada",bk:"qara şah",bq:"qara vəzir",br:"qara top",bb:"qara fil",bn:"qara at",bp:"qara piyada"}
  };
  const PROMOTE_NAMES={ru:{q:"Ферзь",r:"Ладья",b:"Слон",n:"Конь",close:"Отменить"},en:{q:"Queen",r:"Rook",b:"Bishop",n:"Knight",close:"Cancel"},az:{q:"Vəzir",r:"Top",b:"Fil",n:"At",close:"Ləğv et"}};
  const COACH = window.ChessCoachEngine;
  const ENGINE = window.ChessEngineBridge;
  const PROGRESS = window.ChessProgressCore;
  const CLOCK = window.ChessClock || null;
  const APPEARANCE = window.ChessAppearance;
  const REVIEW = window.ChessGameReview;
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
  let keyboardSquare="e2";
  let matchMode="practice",matchSession=null;
  let clockState=CLOCK?CLOCK.start(CLOCK.config("none"),Date.now()):null;
  let clockTheme="digital",soundEnabled=false,endedBy=null,lowAlerted=null,audioContext=null;
  // Review is strictly read-only: the canonical game/clock never follow this cursor.
  let reviewCursor=null,lessonHintMove=null,analysisResult=null,analysisWorker=null,analysisGeneration=0,analysisRunning=false;
  const UX_TEXT={
    ru:{returnLive:"К партии",wide:"Широкая доска",fullReview:"Полный разбор партии",analysisQuality:"Глубина анализа",analysisQuick:"Быстрый",analysisBalanced:"Сбалансированный",analysisDeep:"Глубокий",reviewStart:"Анализировать ходы",reviewCancel:"Отменить анализ",moveLegend:"Что означают оценки ходов?",reviewOffline:"В одиночном HTML глубокий Stockfish-анализ недоступен. Для него откройте ZIP через localhost или сайт HTTPS. История ходов доступна.",reviewReady:"Выберите глубину и запустите разбор.",reviewWait:"Анализ: {done}/{total} позиций",reviewDone:"Разбор завершён: {count} из {total} полуходов оценено.",reviewError:"Движок анализа недоступен. Численные оценки не рассчитаны.",reviewFairPlay:"Полный анализ появится после окончания самостоятельной партии.",reviewNoMoves:"Сначала сыграйте хотя бы один ход.",reviewPosition:"Просмотр позиции {ply}/{total} — партия продолжает идти отдельно.",reviewWhite:"Белые",reviewBlack:"Чёрные",reviewAccuracy:"Точность (оценка модели)",reviewAnalyzed:"Оценено полуходов",reviewBest:"Рекомендованный ход",reviewCurrent:"Сыграно",reviewLimited:"Не оценено движком",reviewUnknown:"Нет оценки",reviewBrilliant:"Блестящий — исключительно сильный ход; отдельная методика, пока не присваивается",reviewBestTag:"Лучший",reviewExcellent:"Отличный",reviewGood:"Хороший",reviewOrdinary:"Обычный",reviewInaccuracy:"Неточность",reviewMistake:"Ошибка",reviewBlunder:"Грубая ошибка",reviewBook:"Дебютный ход (только при подтверждённой базе)",reviewSource:"Модель изменения ожидаемых очков, не рейтинг Elo."},
    en:{returnLive:"Return to live",wide:"Wide board",fullReview:"Full Game Review",analysisQuality:"Analysis depth",analysisQuick:"Quick",analysisBalanced:"Balanced",analysisDeep:"Deep",reviewStart:"Analyze moves",reviewCancel:"Cancel analysis",moveLegend:"What do the move symbols mean?",reviewOffline:"Stockfish deep analysis is unavailable in a standalone HTML file. Open the ZIP over localhost or use the HTTPS site. Move replay still works.",reviewReady:"Choose quality and start analysis.",reviewWait:"Analyzing: {done}/{total} positions",reviewDone:"Review complete: {count} of {total} half-moves evaluated.",reviewError:"Analysis engine unavailable. No numeric accuracy was calculated.",reviewFairPlay:"Full review is available only after the independent game ends.",reviewNoMoves:"Play at least one move first.",reviewPosition:"Viewing position {ply}/{total}; the actual game keeps running separately.",reviewWhite:"White",reviewBlack:"Black",reviewAccuracy:"Accuracy (model estimate)",reviewAnalyzed:"Half-moves analyzed",reviewBest:"Recommended move",reviewCurrent:"Played",reviewLimited:"Not engine-evaluated",reviewUnknown:"Not evaluated",reviewBrilliant:"Brilliant — exceptional strong move; method not validated, so not assigned",reviewBestTag:"Best",reviewExcellent:"Excellent",reviewGood:"Good",reviewOrdinary:"Ordinary",reviewInaccuracy:"Inaccuracy",reviewMistake:"Mistake",reviewBlunder:"Blunder",reviewBook:"Book move (verified opening only)",reviewSource:"Expected-points change model, not an Elo rating."},
    az:{returnLive:"Oyuna qayıt",wide:"Geniş taxta",fullReview:"Partiyanın tam təhlili",analysisQuality:"Təhlil dərinliyi",analysisQuick:"Sürətli",analysisBalanced:"Balanslı",analysisDeep:"Dərin",reviewStart:"Gedişləri təhlil et",reviewCancel:"Təhlili dayandır",moveLegend:"Gediş qiymətləndirmələri nə deməkdir?",reviewOffline:"Tək HTML faylında Stockfish dərin təhlili mövcud deyil. ZIP-i localhost ilə və ya HTTPS saytında açın. Gedişlərə baxmaq mümkündür.",reviewReady:"Dərinliyi seçib təhlilə başlayın.",reviewWait:"Təhlil: {done}/{total} mövqe",reviewDone:"Təhlil tamamlandı: {count}/{total} yarımgediş qiymətləndirilib.",reviewError:"Təhlil mühərriki mövcud deyil. Rəqəmsal dəqiqlik hesablanmayıb.",reviewFairPlay:"Tam təhlil yalnız müstəqil oyun bitdikdən sonra mümkündür.",reviewNoMoves:"Əvvəlcə ən azı bir gediş edin.",reviewPosition:"{ply}/{total} mövqeyinə baxış — əsl oyun ayrıca davam edir.",reviewWhite:"Ağlar",reviewBlack:"Qaralar",reviewAccuracy:"Dəqiqlik (modelin qiyməti)",reviewAnalyzed:"Qiymətləndirilən yarımgedişlər",reviewBest:"Tövsiyə olunan gediş",reviewCurrent:"Oynanılıb",reviewLimited:"Mühərrik tərəfindən qiymətləndirilməyib",reviewUnknown:"Qiymətləndirilməyib",reviewBrilliant:"Parlaq — müstəsna güclü gediş; ayrıca meyar təsdiqlənməyib, buna görə verilməyib",reviewBestTag:"Ən yaxşı",reviewExcellent:"Əla",reviewGood:"Yaxşı",reviewOrdinary:"Adi",reviewInaccuracy:"Qeyri-dəqiqlik",reviewMistake:"Səhv",reviewBlunder:"Kobud səhv",reviewBook:"Debüt gedişi (yalnız təsdiqlənmiş baza)",reviewSource:"Gözlənilən xal dəyişməsi modeli, Elo reytinqi deyil."}
  };
  const UX_ICONS={best:"★",excellent:"!",good:"✓",ordinary:"—",inaccuracy:"?!",mistake:"?",blunder:"??",unknown:"—",brilliant:"!!",book:"⌂"};
  const POSTGAME_LABELS={
    ru:{skills:"Разбор по пяти критериям",criterion:"Критерий",white:"Белые",black:"Чёрные",opening:"Дебют",tactics:"Тактическая игра",coordination:"Координация фигур",conversion:"Реализация преимущества",endgame:"Эндшпиль",noData:"Н/Д",method:"Оценка 0–10: сохранение ожидаемых очков по анализу Stockfish для ходов каждой категории. Минимум 2 оценённых хода; иначе Н/Д. Это приближённая метрика, не экспертный рейтинг.",start:"Начальная позиция",winnerW:"Победили белые",winnerB:"Победили чёрные",winnerDraw:"Ничья",youWon:"Вы победили",youLost:"Вы проиграли",youDraw:"Партия завершилась вничью",seeReview:"Разбор партии",close:"Закрыть",reasonMate:"мат",reasonTimeout:"время",reasonResign:"сдача",reasonDraw:"ничья"},
    en:{skills:"Five-part game assessment",criterion:"Criterion",white:"White",black:"Black",opening:"Opening",tactics:"Tactical play",coordination:"Piece coordination",conversion:"Converting an advantage",endgame:"Endgame",noData:"N/A",method:"0–10 proxy: expected-points retained in Stockfish-evaluated moves of each category. At least 2 assessed moves required; otherwise N/A. Not an expert rating.",start:"Starting position",winnerW:"White won",winnerB:"Black won",winnerDraw:"Draw",youWon:"You won",youLost:"You lost",youDraw:"The game was drawn",seeReview:"Review game",close:"Dismiss",reasonMate:"checkmate",reasonTimeout:"time",reasonResign:"resignation",reasonDraw:"draw"},
    az:{skills:"Beş meyar üzrə oyun təhlili",criterion:"Meyar",white:"Ağlar",black:"Qaralar",opening:"Açılış",tactics:"Taktiki oyun",coordination:"Fiqur koordinasiyası",conversion:"Üstünlüyü reallaşdırma",endgame:"Endşpil",noData:"M/D",method:"0–10 təxmini bal: Stockfish təhlilində hər meyara aid gedişlər üzrə gözlənilən xalın qorunması. Ən azı 2 qiymətləndirilmiş gediş lazımdır; əks halda M/D. Ekspert reytinqi deyil.",start:"Başlanğıc mövqe",winnerW:"Ağlar qalib gəldi",winnerB:"Qaralar qalib gəldi",winnerDraw:"Heç-heçə",youWon:"Siz qalib gəldiniz",youLost:"Siz məğlub oldunuz",youDraw:"Oyun heç-heçə bitdi",seeReview:"Oyunu təhlil et",close:"Bağla",reasonMate:"mat",reasonTimeout:"vaxt",reasonResign:"təslim olma",reasonDraw:"heç-heçə"}
  };
  const MOBILE_SETTINGS_TEXT={
    ru:{mobileSettings:"Настройки партии",mobileSettingsDone:"Готово — свернуть настройки"},
    en:{mobileSettings:"Game settings",mobileSettingsDone:"Done — collapse settings"},
    az:{mobileSettings:"Partiya ayarları",mobileSettingsDone:"Hazırdır — ayarları yığ"}
  };
  const ACADEMY_DOCK_TEXT={
    ru:{heading:"Академия · выбрать урок",previous:"Предыдущий урок",choose:"Выберите урок — доска и подсказки рядом"},
    en:{heading:"Academy · choose a lesson",previous:"Previous lesson",choose:"Choose a lesson — controls and hints stay by the board"},
    az:{heading:"Akademiya · dərs seçin",previous:"Əvvəlki dərs",choose:"Dərs seçin — idarəetmə və ipucları lövhənin yanındadır"}
  };
  const academyDockText=key=>(ACADEMY_DOCK_TEXT[language]||ACADEMY_DOCK_TEXT.ru)[key]||key;
  const pl=(key)=>(POSTGAME_LABELS[language]||POSTGAME_LABELS.ru)[key]||key;
  const GRADE_KEYS={best:"reviewBestTag",excellent:"reviewExcellent",good:"reviewGood",ordinary:"reviewOrdinary",inaccuracy:"reviewInaccuracy",mistake:"reviewMistake",blunder:"reviewBlunder",unknown:"reviewUnknown"};
  function ux(key,values){return (UX_TEXT[language]||UX_TEXT.ru)[key]?.replace(/\{(\w+)\}/g,(_,k)=>values&&values[k]!==undefined?String(values[k]):"?")||key;}

  const engine = ENGINE && new ENGINE.Bridge();
  let lastEngineKind="local";
  const B8_TEXT={
    ru:{whiteClock:"Белые",blackClock:"Чёрные",timeControl:"Контроль времени",untimed:"Без времени",customTime:"Своё время",customMinutes:"Минуты",customIncrement:"Добавление, секунд",clockTheme:"Вид часов",digitalClock:"Электронные",hourglassClock:"Песочные + цифры",sounds:"Звуки партии",resign:"Сдаться",rematch:"Реванш",timeout:"Время вышло",resigned:"Партия сдана",clockDraw:"Ничья: недостаточно материала для мата",clockPolicy:"Игры с часами пока не входят в AI Ladder Index.",confirmResign:"Сдаться в текущей партии?",resignNote:"Партия завершена сдачей; AI Ladder Index не изменён.",timeNote:"Партия завершена по времени; AI Ladder Index не изменён."},
    en:{whiteClock:"White",blackClock:"Black",timeControl:"Time control",untimed:"Untimed",customTime:"Custom",customMinutes:"Minutes",customIncrement:"Increment, seconds",clockTheme:"Clock display",digitalClock:"Digital",hourglassClock:"Hourglass + digits",sounds:"Game sounds",resign:"Resign",rematch:"Rematch",timeout:"Time out",resigned:"Resigned",clockDraw:"Draw: insufficient mating material",clockPolicy:"Timed games are not yet in the AI Ladder Index.",confirmResign:"Resign this game?",resignNote:"Resignation recorded; AI Ladder Index unchanged.",timeNote:"Clock result recorded; AI Ladder Index unchanged."},
    az:{whiteClock:"Ağlar",blackClock:"Qaralar",timeControl:"Vaxt nəzarəti",untimed:"Vaxtsız",customTime:"Xüsusi vaxt",customMinutes:"Dəqiqə",customIncrement:"Əlavə saniyə",clockTheme:"Saat görünüşü",digitalClock:"Rəqəmsal",hourglassClock:"Qum saatı + rəqəmlər",sounds:"Oyun səsləri",resign:"Təslim ol",rematch:"Təkrar oyun",timeout:"Vaxt bitdi",resigned:"Təslim oldu",clockDraw:"Heç-heçə: mat üçün fiqur kifayət etmir",clockPolicy:"Vaxtlı oyunlar hələ AI Ladder Index-ə daxil edilmir.",confirmResign:"Bu oyunda təslim olmaq istəyirsiniz?",resignNote:"Təslim nəticəsi qeyd edildi; AI Ladder Index dəyişmədi.",timeNote:"Vaxt nəticəsi qeyd edildi; AI Ladder Index dəyişmədi."}
  };
  function tr(k) {return (I18N[language] || I18N.ru)[k]||(B8_TEXT[language]||B8_TEXT.ru)[k]||(UX_TEXT[language]||UX_TEXT.ru)[k]||k;}
  function text(k, val){return $(k) && ($(k).textContent=val);}
  function message(str){text("coach-message",str);}
  function learnMessage(str){text("lesson-status",str);}
  function playSound(kind) {
    if(!soundEnabled||typeof window.AudioContext!=="function")return;
    try{
      audioContext=audioContext||new window.AudioContext();
      if(audioContext.state==="suspended")audioContext.resume().catch(()=>{});
      (kind==="check"?[740,920]:kind==="low"?[620]:[600,440,780]).forEach((frequency,i)=>{
        const osc=audioContext.createOscillator(),gain=audioContext.createGain(),at=audioContext.currentTime+i*.13;
        osc.type="sine";osc.frequency.value=frequency;
        gain.gain.setValueAtTime(.0001,at);
        gain.gain.exponentialRampToValueAtTime(.07,at+.015);
        gain.gain.exponentialRampToValueAtTime(.0001,at+.105);
        osc.connect(gain);gain.connect(audioContext.destination);osc.start(at);osc.stop(at+.12);
      });
    }catch{/* optional audio cannot prevent legal chess */}
  }
  function opponentCannotMate(winner){
    return CLOCK.cannotMate(winner,game.board());
  }
  function clockTick(){
    if(!CLOCK||!clockState)return;
    if(!lesson&&!parked&&!finalized&&clockState.baseMs){
      clockState=CLOCK.settle(clockState,Date.now());
      if(clockState.flagged&&!endedBy){
        const loser=clockState.flagged,winner=loser==="w"?"b":"w";
        endedBy={type:"timeout",loser,draw:opponentCannotMate(winner)};
        clearTimeout(aiTimer);++epoch;engine?.cancel();finish();
      }
    }
    const panel=$("clock-panel");if(!panel)return;
    panel.hidden=!clockState.baseMs||Boolean(lesson);
    panel.classList.toggle("hourglass-mode",clockTheme==="hourglass");
    for(const color of ["w","b"]){
      const name=color==="w"?"white":"black",card=$("clock-"+name),ms=clockState.remaining[color];
      text("clock-"+name+"-time",CLOCK.format(ms));
      card.dataset.active=String(!finalized&&!clockState.paused&&clockState.active===color);
      card.dataset.low=String(!finalized&&ms<=10000);
      card.dataset.flip=String(game.history().length%2===1);
    }
    if(!finalized&&clockState.active===side&&clockState.remaining[side]<=10000&&lowAlerted!==side){
      lowAlerted=side;playSound("low");
    }
  }
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
    // One canonical Academy control set: fields are physically moved to the board dock.
    const dock=$("academy-dock");
    if(dock){
      const active=Boolean(lesson||lastLessonId&&parked);
      dock.hidden=matchMode==="independent"&&!active;
      const heading=task?.title?.[language]||lastLessonId&&ACADEMY.byId[lastLessonId]?.title?.[language]||academyDockText("heading");
      text("academy-dock-heading",heading);
      text("academy-dock-count",completed.length+"/"+LESSONS.length);
      text("academy-dock-instruction",task?lessonPrompt(task):lastLessonId&&parked?at("completed"):academyDockText("choose"));
      $("academy-dock-prev").disabled=!task&&!lastLessonId||LESSONS.findIndex(x=>x.id===(lesson||lastLessonId))<=0;
      $("academy-dock-next").disabled=!lastLessonId||!parked||Boolean(lesson);
      $("academy-dock-hint").hidden=!Boolean(task);
      $("academy-dock-resume").hidden=!parked;
      const root=$("practice-view");
      if(typeof root?.classList?.toggle==="function"){
        root.classList.toggle("academy-active",active);
        root.classList.toggle("independent-mode",matchMode==="independent"&&!finalized&&!active);
      }
    }
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
  function clearHints(){hintState=null;lessonHintMove=null;$("coach-variations").replaceChildren();$("coach-variations").hidden=true;}
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
    if(!currentMatch()||!finalized||(!game.game_over()&&!endedBy)||notes.length)return;
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
    if(!choice||game.game_over()||finalized||lesson||game.turn()===side)return false;
    const moveAt=Date.now();
    if(CLOCK&&clockState?.baseMs){clockState=CLOCK.settle(clockState,moveAt);if(clockState.flagged){clockTick();return false;}}
    const moved=game.move(choice);
    if(!moved)return false;
    if(CLOCK&&clockState?.baseMs){
      const transition=CLOCK.move(clockState,moved.color,moveAt);
      if(!transition.ok){game.undo();clockState=transition.state;clockTick();return false;}
      clockState=transition.state;
    }
    if(game.in_check())playSound("check");
    clearHints();last=[moved.from,moved.to];finalized=false;selected=null;
    if(currentMatch()&&ENGINE.profile(difficulty).mode!=="local"&&lastEngineKind!=="stockfish")matchSession.fallback=true;
    render();persist();
    if(game.game_over())finish();else message(currentMatch()?prog("loading"):explain(moved));
    return true;
  }
  function fallbackBotMove(){
    if(game.game_over()||finalized||lesson||game.turn()===side)return;
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
      selected=expected.from;lessonHintMove={from:expected.from,to:expected.to};
      message(at("hint",{move:san})+" "+task.steps[lessonStep].prompt[language]);
      render();return;
    }
    const analysis=COACH.analyze(game,{limit:3});
    hintState={fen:analysis.fen,lines:analysis.lines};
    message(ct("hintIntro"));showHints();
  }
  function boardFocus(square){
    keyboardSquare=square;
    const board=$("board"),button=Array.from(board.children).find(x=>x.dataset?.square===square);
    if(button&&typeof button.focus==="function"){for(const x of board.children)x.tabIndex=x===button?0:-1;button.focus();}
  }
  function closePromotion(){
    const original=pendingPromotion;
    pendingPromotion=null;$("promotion").hidden=true;
    // Escape genuinely cancels the pending move. Do not leave the origin selected:
    // otherwise the next click deselects it and makes a second promotion attempt fail.
    selected=null;render();
    if(original)boardFocus(original.from);
  }
  function doMove(from,to,promotion){
    const completedBefore=completed.length;
    const matches=game.moves({square:from,verbose:true}).filter(x=>x.to===to);
    if(!matches.length) return message(tr("illegal"));
    if(matches.some(m=>m.promotion) && !promotion) {
      pendingPromotion={from,to}; $("promotion").hidden=false; text("promotion-label",tr("promo"));
      const first=typeof document.querySelector==="function"?document.querySelector("#promotion [data-promote=q]"):null;
      if(first&&typeof first.focus==="function")first.focus();
      return;
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
    const moveAt=Date.now();
    if(!lesson&&CLOCK&&clockState?.baseMs){clockState=CLOCK.settle(clockState,moveAt);if(clockState.flagged){clockTick();return;}}
    const fromPromotion=Boolean(pendingPromotion&&promotion);
    const move=game.move({from,to,promotion:promotion||"q"});
    if(!move) return message(tr("illegal"));
    if(!lesson&&CLOCK&&clockState?.baseMs){
      const transition=CLOCK.move(clockState,move.color,moveAt);
      if(!transition.ok){game.undo();clockState=transition.state;clockTick();return;}
      clockState=transition.state;
    }
    if(!lesson&&game.in_check())playSound("check");
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
    if(completed.length>completedBefore)notifyCloudProgress();
    if(fromPromotion)boardFocus(to);
    if(game.game_over()) finish();
    else if(!lesson && !finalized && game.turn()!==side) scheduleBot();
  }
  function clickSquare(square){
    if(reviewCursor!==null||pendingPromotion||game.game_over() || finalized || (!lesson && game.turn()!==side)) return;
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
  function jumpHistory(ply){
    const n=game.history().length;
    if(!Number.isInteger(ply))return;
    reviewCursor=Math.max(0,Math.min(n,ply));
    if(reviewCursor===n)reviewCursor=null; // the last position is always LIVE
    selected=null;render();renderFullReview();
    if(reviewCursor!==null)message(ux("reviewPosition",{ply:reviewCursor,total:n}));
  }
  function displayBoard(){
    if(reviewCursor===null)return game;
    try{return REVIEW.atPly(Chess,game.pgn(),reviewCursor,game.fen());}
    catch(_err){reviewCursor=null;return game;}
  }
  let arrowHintFen=null,arrowHint=null;
  function drawArrows(element,flipped){
    if(typeof document.createElementNS!=="function")return; // legacy synthetic DOM test fixture
    // Render only derived information; SVG has no event listeners and cannot make moves.
    const candidates=[];
    if(reviewCursor!==null){
      const move=game.history({verbose:true})[reviewCursor-1];
      if(move)candidates.push({from:move.from,to:move.to,kind:"played"});
      const best=analysisResult?.entries?.[reviewCursor-1]?.bestUci;
      if(best&&/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(best)&&move&&best.slice(0,4)!==move.from+move.to)
        candidates.push({from:best.slice(0,2),to:best.slice(2,4),kind:"suggested"});
    }else if(!currentMatch()&&!finalized){
      if(lessonHintMove)candidates.push({...lessonHintMove,kind:"suggested"});
      else if(hintState?.fen===game.fen()&&hintState.lines.length)candidates.push({...hintState.lines[0],kind:"suggested"});
      else if(!lesson&&game.turn()===side&&game.history().length<180){
        if(arrowHintFen!==game.fen()){
          arrowHintFen=game.fen();
          try{arrowHint=COACH.analyze(game,{limit:1}).lines[0]||null;}
          catch(_e){arrowHint=null;}
        }
        if(arrowHint)candidates.push({...arrowHint,kind:"suggested"});
      }
    }
    if(!candidates.length)return;
    const ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");
    svg.setAttribute("viewBox","0 0 800 800");svg.setAttribute("aria-hidden","true");svg.classList.add("move-arrows");
    const point=square=>{
      const f=FILES.indexOf(square[0]),r=Number(square[1])-1;
      return [50+(flipped?7-f:f)*100,50+(flipped?r:7-r)*100];
    };
    for(const data of candidates){
      if(!/^[a-h][1-8]$/.test(data.from)||!/^[a-h][1-8]$/.test(data.to))continue;
      const a=point(data.from),b=point(data.to),angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
      const end=[b[0]-19*Math.cos(angle),b[1]-19*Math.sin(angle)];
      const start=[a[0]+14*Math.cos(angle),a[1]+14*Math.sin(angle)];
      const path=document.createElementNS(ns,"path");path.classList.add(data.kind);
      path.setAttribute("d","M"+start.join(" ")+" L"+end.join(" "));
      const color=data.kind==="played"?"#e5ad3e":"#49d6ad";
      const head=document.createElementNS(ns,"polygon");
      const wings=[[-17,-10],[-17,10]].map(([dx,dy])=>[
        b[0]+dx*Math.cos(angle)-dy*Math.sin(angle),
        b[1]+dx*Math.sin(angle)+dy*Math.cos(angle)
      ]);
      head.setAttribute("points",[b,...wings].map(x=>x.join(",")).join(" "));
      head.setAttribute("fill",color);head.setAttribute("opacity",".9");
      svg.append(path,head);
    }
    element.appendChild(svg);
  }
  function showMoves(){
    const moves=game.history(),holder=$("moves"),frag=document.createDocumentFragment();
    if(!moves.length){holder.textContent="—";}
    else {
      for(let i=0;i<moves.length;i++){
        if(i%2===0){const turn=document.createElement("span");turn.className="move-no";turn.textContent=(Math.floor(i/2)+1)+".";frag.appendChild(turn);}
        const button=document.createElement("button");button.type="button";button.textContent=moves[i];
        button.dataset.ply=String(i+1);
        button.setAttribute("aria-current",String((reviewCursor===null?moves.length:reviewCursor)===i+1));
        button.addEventListener("click",()=>jumpHistory(i+1));frag.appendChild(button);
      }
      holder.replaceChildren(frag);
    }
    const at=reviewCursor===null?moves.length:reviewCursor;
    text("h-progress",at+" / "+moves.length);
    const current=at?game.history({verbose:true})[at-1]:null;
    const evaluated=analysisResult?.pgn===game.pgn()?analysisResult.entries?.[at-1]:null;
    const display=current?(Math.floor((at-1)/2)+1)+(at%2?"...":".")+" "+current.san:"";
    text("h-current-san",display+(evaluated&&evaluated.tag!=="unknown"?"  "+UX_ICONS[evaluated.tag]:"")||pl("start"));
    $("h-first").disabled=!moves.length||at===0;
    $("h-prev").disabled=!moves.length||at===0;
    $("h-next").disabled=!moves.length||at===moves.length;
    $("h-last").disabled=!moves.length||at===moves.length;
    $("h-return").hidden=reviewCursor===null;
  }
  function cancelFullAnalysis(){
    analysisGeneration++;analysisRunning=false;
    if(analysisWorker){analysisWorker.dispose();analysisWorker=null;}
    $("cancel-review").hidden=true;
  }
  function renderLegend(){
    const holder=$("move-legend-list"),keys=["brilliant","best","excellent","good","ordinary","inaccuracy","mistake","blunder","unknown"];
    const ids={brilliant:"reviewBrilliant",best:"reviewBestTag",excellent:"reviewExcellent",
      good:"reviewGood",ordinary:"reviewOrdinary",inaccuracy:"reviewInaccuracy",
      mistake:"reviewMistake",blunder:"reviewBlunder",unknown:"reviewUnknown"};
    const frag=document.createDocumentFragment();
    for(const key of keys){
      const entry=document.createElement("div"),strong=document.createElement("strong");
      strong.textContent=UX_ICONS[key]+" — "+ux(ids[key]);
      entry.appendChild(strong);frag.appendChild(entry);
    }
    holder.replaceChildren(frag);
  }
  function renderReviewChart(records){
    const holder=$("review-chart");holder.replaceChildren();
    if(!records?.length)return;
    const ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");
    svg.setAttribute("viewBox","0 0 500 105");svg.setAttribute("role","img");
    svg.setAttribute("aria-label",ux("reviewSource"));
    const base=document.createElementNS(ns,"line");
    for(const [key,value]of Object.entries({x1:"0",x2:"500",y1:"52",y2:"52",stroke:"#889aa9","stroke-dasharray":"3 4"}))base.setAttribute(key,value);
    svg.appendChild(base);
    const known=records.filter(x=>Number.isFinite(x.cpAfter));
    let previous=null;
    for(const e of known){
      const x=8+484*e.ply/records.length;
      const y=52-42*Math.tanh(e.cpAfter/500);
      if(previous){
        const line=document.createElementNS(ns,"line");
        for(const [key,value]of Object.entries({x1:previous[0],y1:previous[1],x2:x,y2:y,stroke:"#e6c583","stroke-width":2}))line.setAttribute(key,String(value));
        svg.appendChild(line);
      }
      const dot=document.createElementNS(ns,"circle");
      for(const [key,value]of Object.entries({cx:x,cy:y,r:4,fill:"#78d5b4",tabindex:"0",role:"button","aria-label":e.ply+" "+e.san}))dot.setAttribute(key,String(value));
      dot.style.cursor="pointer";
      dot.addEventListener("click",()=>jumpHistory(e.ply));
      dot.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();jumpHistory(e.ply);}});
      svg.appendChild(dot);previous=[x,y];
    }
    holder.appendChild(svg);
  }
  function renderSkillTable(report){
    const holder=$("review-skills");
    if(!holder)return;
    holder.replaceChildren();
    holder.hidden=!report||!REVIEW?.skillReport;
    if(holder.hidden)return;
    const data=REVIEW.skillReport(report);
    const heading=document.createElement("h4");heading.textContent=pl("skills");
    const table=document.createElement("table");table.className="skills-table";
    const head=document.createElement("thead"),hrow=document.createElement("tr");
    for(const name of ["criterion","white","black"]){
      const th=document.createElement("th");th.scope="col";th.textContent=pl(name);hrow.appendChild(th);
    }
    head.appendChild(hrow);table.appendChild(head);
    const body=document.createElement("tbody");
    for(const key of REVIEW.SKILL_KEYS){
      const tr=document.createElement("tr"),label=document.createElement("th");
      label.scope="row";label.textContent=pl(key);tr.appendChild(label);
      for(const color of ["w","b"]){
        const item=data.rows[key][color],cell=document.createElement("td");
        cell.textContent=item.value===null?pl("noData"):item.value.toFixed(1)+"/10";
        cell.title=String(item.analyzed)+" / "+String(item.eligible);
        cell.dataset.skill=key;cell.dataset.side=color;tr.appendChild(cell);
      }
      body.appendChild(tr);
    }
    table.appendChild(body);
    const note=document.createElement("p");note.className="skills-method";note.textContent=pl("method");
    holder.append(heading,table,note);
  }
  function renderFullReview(){
    const all=game.history({verbose:true}),pgn=game.pgn();
    if(analysisResult?.pgn!==pgn)analysisResult=null;
    const denied=Boolean(lesson||(currentMatch()&&!finalized));
    $("start-review").disabled=denied||!all.length||analysisRunning;
    $("cancel-review").hidden=!analysisRunning;
    renderLegend();
    const sum=$("review-summary");sum.replaceChildren();
    const report=analysisResult;
    if(report){
      for(const color of ["w","b"]){
        const s=report.summary[color],card=document.createElement("div");
        card.className="side-report";
        const title=document.createElement("b"),grade=document.createElement("strong"),count=document.createElement("p");
        title.textContent=ux(color==="w"?"reviewWhite":"reviewBlack");
        grade.textContent=s.accuracy===null?"—":s.accuracy.toFixed(1)+"%";
        count.textContent=ux("reviewAnalyzed")+": "+s.analyzed+" / "+s.total;
        card.appendChild(title);card.appendChild(grade);card.appendChild(count);sum.appendChild(card);
      }
    }
    renderSkillTable(report);
    const entries=$("review-entries"),frag=document.createDocumentFragment();
    for(let i=0;i<all.length;i++){
      const move=all[i],entry=report?.entries?.[i];
      const button=document.createElement("button");button.type="button";button.className="review-entry";
      button.dataset.ply=String(i+1);button.dataset.tag=entry?.tag||"unknown";
      button.setAttribute("aria-current",String((reviewCursor===null?all.length:reviewCursor)===i+1));
      const line=document.createElement("span");
      line.textContent=(Math.floor(i/2)+1)+(i%2?"...":".")+" "+move.san;
      const grade=document.createElement("span");grade.className="grade";grade.textContent=UX_ICONS[entry?.tag||"unknown"];
      grade.title=ux(({best:"reviewBestTag",excellent:"reviewExcellent",good:"reviewGood",ordinary:"reviewOrdinary",inaccuracy:"reviewInaccuracy",mistake:"reviewMistake",blunder:"reviewBlunder"})[entry?.tag]||"reviewUnknown");
      const best=document.createElement("small");
      best.textContent=entry?.bestUci?ux("reviewBest")+": "+entry.bestUci:ux("reviewLimited");
      button.appendChild(line);button.appendChild(grade);button.appendChild(best);
      button.addEventListener("click",()=>jumpHistory(i+1));frag.appendChild(button);
    }
    entries.replaceChildren(frag);
    renderReviewChart(report?.entries);
    if(!analysisRunning&&!$("review-progress").textContent&&all.length)text("review-progress",denied?ux("reviewFairPlay"):ux("reviewReady"));
  }
  async function startFullAnalysis(){
    if(analysisRunning)return;
    if(lesson||(currentMatch()&&!finalized)){text("review-progress",ux("reviewFairPlay"));return;}
    if(!game.history().length){text("review-progress",ux("reviewNoMoves"));return;}
    if(location.protocol==="file:"||typeof Worker!=="function"){
      text("review-progress",ux("reviewOffline"));renderFullReview();return;
    }
    cancelFullAnalysis();const token=analysisGeneration,pgn=game.pgn();
    analysisResult=null;analysisRunning=true;
    $("cancel-review").hidden=false;
    $("start-review").disabled=true;
    text("review-progress",ux("reviewWait",{done:0,total:game.history().length+1}));
    const worker=new REVIEW.UciAnalyzer();analysisWorker=worker;
    try{
      const result=await REVIEW.analyzeGame(Chess,pgn,{quality:$("review-quality").value,worker,
        onProgress:state=>{if(token===analysisGeneration)text("review-progress",ux("reviewWait",state));}});
      if(token!==analysisGeneration||game.pgn()!==pgn)return;
      analysisResult={...result,pgn};
      text("review-progress",ux("reviewDone",{count:result.analyzed,total:result.total}));
    }catch(error){if(token===analysisGeneration)text("review-progress",ux("reviewError"));}
    finally{
      worker.dispose();
      if(analysisWorker===worker)analysisWorker=null;
      if(token===analysisGeneration){analysisRunning=false;render();}
    }
  }
  function status(){
    if(endedBy){
      if(endedBy.draw)return tr("clockDraw");
      return tr(endedBy.type==="timeout"?"timeout":"resigned")+" — "+(endedBy.loser===side?tr("loss"):tr("win"));
    }
    if(game.in_checkmate()) return tr("mate") + " — " + (game.turn()===side?tr("loss"):tr("win"));
    if(game.in_draw()) return tr("draw");
    if(game.in_check()) return tr("check") + " " + (game.turn()===side?tr("turn"):tr("bot"));
    return lesson?tr("lesson"):game.turn()===side?tr("turn"):tr("thinking");
  }
  function hideGameResult(){const toast=$("game-result-toast");if(toast)toast.hidden=true;}
  function showGameResult(){
    const toast=$("game-result-toast");if(!toast)return;
    const winner=endedBy?(endedBy.draw?null:endedBy.loser==="w"?"b":"w"):
      game.in_checkmate()?(game.turn()==="w"?"b":"w"):null;
    const title=winner?(winner==="w"?pl("winnerW"):pl("winnerB")):pl("winnerDraw");
    const mine=winner?(winner===side?pl("youWon"):pl("youLost")):pl("youDraw");
    const why=endedBy?.type==="timeout"?pl("reasonTimeout"):
      endedBy?.type==="resign"?pl("reasonResign"):game.in_checkmate()?pl("reasonMate"):pl("reasonDraw");
    text("game-result-title",title);
    text("game-result-detail",mine+" · "+why);
    text("game-result-review",pl("seeReview"));
    text("game-result-close",pl("close"));
    toast.hidden=false;
  }
  function render(){
    const boardElement=$("board");
    const shown=displayBoard(),readOnly=reviewCursor!==null;
    const currentPly=reviewCursor===null?game.history().length:reviewCursor;
    const assessed=analysisResult?.pgn===game.pgn()?analysisResult.entries?.[currentPly-1]:null;
    const assessedMove=assessed&&assessed.tag!=="unknown"?game.history({verbose:true})[currentPly-1]:null;
    const wasFocused=Boolean(document.activeElement&&typeof boardElement.contains==="function"&&boardElement.contains(document.activeElement));
    // Independent games do not reveal candidate destinations before the move.
    const legal=!readOnly&&selected&&!(currentMatch()&&!finalized)?game.moves({square:selected,verbose:true}).map(m=>m.to):[];
    const flipped=$("flip").checked; const order=boardSquares();
    if(flipped) order.reverse();
    const frag=document.createDocumentFragment();
    for(const square of order){
      const p=shown.get(square), [f,r]=fileRank(square);
      const b=document.createElement("button");
      b.type="button"; b.className="square "+((f+r)%2===0?"dark":"light");
      if(p)b.classList.add(p.color==="w"?"white-piece":"black-piece");
      if(!readOnly&&selected===square)b.classList.add("selected");
      if(legal.includes(square))b.classList.add("legal");
      const viewedMove=readOnly?game.history({verbose:true})[reviewCursor-1]:null;
      if((readOnly&&viewedMove&&[viewedMove.from,viewedMove.to].includes(square))||(!readOnly&&last&&last.includes(square)))b.classList.add("last");
      if(p && p.type==="k" && p.color===shown.turn() && shown.in_check())b.classList.add("checked");
      b.dataset.square=square;
      b.tabIndex=square===keyboardSquare?0:-1;
      b.setAttribute("aria-label",square+" — "+(BOARD_NAMES[language]||BOARD_NAMES.ru)[p?p.color+p.type:"empty"]);
      b.setAttribute("aria-pressed",!readOnly&&selected===square?"true":"false");
      const mark=document.createElement("span");mark.className="piece";mark.textContent=p?PIECES[p.color+p.type]:"";if(p)mark.dataset.code=p.color+p.type.toUpperCase();b.appendChild(mark);
      if(p&&assessedMove&&assessedMove.to===square&&assessed?.to===square&&UX_ICONS[assessed.tag]){
        const badge=document.createElement("span");badge.className="move-grade-badge";badge.dataset.tag=assessed.tag;
        badge.dataset.ply=String(currentPly);badge.textContent=UX_ICONS[assessed.tag];
        badge.setAttribute("aria-hidden","true");badge.title=ux(GRADE_KEYS[assessed.tag]||"reviewUnknown");
        b.appendChild(badge);
        b.setAttribute("aria-label",b.getAttribute("aria-label")+" — "+badge.title);
      }
      if((flipped?r===7:r===0)) {const c=document.createElement("small");c.className="file";c.textContent=square[0];b.appendChild(c);}
      if((flipped?f===7:f===0)) {const c=document.createElement("small");c.className="rank";c.textContent=square[1];b.appendChild(c);}
      b.addEventListener("focus",()=>{keyboardSquare=square;});
      b.addEventListener("click",()=>{keyboardSquare=square;if(!readOnly)clickSquare(square);});
      b.addEventListener("keydown",e=>{
        const steps={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
        if(steps[e.key]){
          e.preventDefault();
          const [df,dr]=steps[e.key],direction=flipped?-1:1;
          const file=FILES.indexOf(square[0])+df*direction;
          const rank=Number(square[1])+dr*direction;
          if(file>=0&&file<8&&rank>=1&&rank<=8)boardFocus(FILES[file]+rank);
        }else if(e.key==="Enter"||e.key===" "){
          e.preventDefault();keyboardSquare=square;if(!readOnly)clickSquare(square);
        }
      });
      frag.appendChild(b);
    }
    boardElement.replaceChildren(frag);
    drawArrows(boardElement,flipped);
    if(wasFocused)boardFocus(keyboardSquare);
    text("game-status",status());showMoves();
    text("record",stats.wins+" / "+stats.losses+" / "+stats.draws);
    text("completed",completed.length+"/"+LESSONS.length);
    $("undo").disabled=!!parked||reviewCursor!==null||!game.history().length||currentMatch();
    $("hint").disabled=reviewCursor!==null||(currentMatch()&&!finalized);
    $("review-button").disabled=currentMatch()&&!finalized;
    $("lesson").disabled=currentMatch()&&!finalized;
    $("academy-track").disabled=currentMatch()&&!finalized;
    $("resume-game").hidden=!parked;
    if($("resign"))$("resign").disabled=Boolean(lesson||parked||finalized||game.game_over());
    clockTick();renderFullReview();
  }
  function finish(){
    if(finalized||lesson||(!game.game_over()&&!endedBy))return;
    if(CLOCK&&clockState?.baseMs)clockState=CLOCK.stop(clockState,Date.now());
    if(endedBy){
      if(endedBy.draw)stats.draws++;
      else if(endedBy.loser===side)stats.losses++;
      else stats.wins++;
    }else if(game.in_checkmate()){
      if(game.turn()===side)stats.losses++;
      else stats.wins++;
    } else stats.draws++;
    finalized=true;showReview=!currentMatch();
    let ratedMessage=tr("notRated");
    if(currentMatch()&&!endedBy&&!(clockState&&clockState.baseMs)){
      const result=game.in_checkmate()?(game.turn()===side?"loss":"win"):"draw";
      const tier=ENGINE.profile(difficulty);
      const method=tier.mode==="local"?"local":lastEngineKind==="stockfish"&&!matchSession.fallback?"stockfish":"fallback";
      const receipt=window.ChessProgress.recordGame({...matchSession,pgn:game.pgn(),result,engine:method,level:difficulty,side,date:new Date().toISOString()});
      ratedMessage=receipt.accepted?prog("independentResult"):prog("invalidRating");
      matchNotice(receipt.accepted?"independentResult":"ineligible");
    }
    if(endedBy)ratedMessage=tr(endedBy.type==="resign"?"resignNote":"timeNote");
    else if(clockState?.baseMs)ratedMessage=tr("clockPolicy");
    // Finalizing a no-help game unlocks postgame analysis; refresh mode classes before rendering.
    playSound("end");persist();renderAcademy();render();renderReview();
    message(status()+" — "+ratedMessage);
    showGameResult();
    notifyCloudProgress();
  }
  function notifyCloudProgress(){
    if(typeof window.dispatchEvent==="function"&&typeof Event==="function")window.dispatchEvent(new Event("chess-progress-commit"));
  }
  function persist(){
    const session=parked||{pgn:lesson?null:game.pgn(),side,difficulty,flipped:$("flip").checked,finalized:finalized&&!lesson,notes};
    try{localStorage.setItem(KEY,JSON.stringify({pgn:session.pgn,side:session.side,difficulty:session.difficulty,language,completed,stats,flipped:session.flipped,finalized:session.finalized,notes:session.notes||[],academy:lesson?{id:lesson,step:lessonStep}:null,academyTrack,matchMode,matchSession,clockState,clockTheme,soundEnabled,endedBy,reviewCursor}));}
    catch(e){message("Storage unavailable; progress cannot be saved.");}
  }
  function restore(){
    try {
      // A prior signed-in account is never inferred from stale offline browser storage.
      if(localStorage.getItem("chess-odyssey-cloud-owner-v1"))return;
      const raw=localStorage.getItem(KEY);if(!raw)return;
      const data=JSON.parse(raw);
      language=["ru","en","az"].includes(data.language)?data.language:"ru";
      side=["w","b"].includes(data.side)?data.side:"w";
      difficulty=ENGINE.ids.includes(data.difficulty)?data.difficulty:"beginner";
      if(CLOCK){
        clockState=CLOCK.restore(data.clockState,Date.now())||CLOCK.start(CLOCK.config("none"),Date.now());
        clockTheme=data.clockTheme==="hourglass"?"hourglass":"digital";
      }
      soundEnabled=data.soundEnabled===true;
      endedBy=data.endedBy&&["timeout","resign"].includes(data.endedBy.type)&&["w","b"].includes(data.endedBy.loser)
        ?{type:data.endedBy.type,loser:data.endedBy.loser,draw:data.endedBy.draw===true}:null;
      const m=data.matchSession;
      const matchValid=data.matchMode==="independent"&&m&&typeof m.id==="string"&&/^g-[a-z0-9-]{6,60}$/.test(m.id)&&m.mode==="independent"&&m.side===side&&m.level===difficulty;
      matchMode=matchValid?"independent":"practice";
      matchSession=matchValid?{id:m.id,mode:"independent",side,level:difficulty,assisted:Boolean(m.assisted)||Boolean(clockState?.baseMs),undone:Boolean(m.undone),restarted:Boolean(m.restarted),fallback:Boolean(m.fallback)}:null;
      completed=Array.isArray(data.completed)?[...new Set(data.completed.filter(x=>Boolean(ACADEMY.byId[x])))]:[];
      academyTrack=data.academyTrack==="all"||ACADEMY.tracks.some(x=>x.id===data.academyTrack)?data.academyTrack:"all";
      stats=data.stats&&["wins","losses","draws"].every(k=>Number.isInteger(data.stats[k])&&data.stats[k]>=0)?data.stats:stats;
      if(typeof data.pgn==="string"&&data.pgn.trim()){const test=new Chess();if(test.load_pgn(data.pgn))game=test;}
      finalized=Boolean(data.finalized);
      const savedHistory=game.history();
      notes=Array.isArray(data.notes)?data.notes.filter(x=>x&&Number.isInteger(x.ply)&&x.ply>0&&x.ply<=savedHistory.length&&savedHistory[x.ply-1]===x.san&&typeof x.best==="string"&&Number.isFinite(x.drop)&&["fine","warning","major"].includes(x.severity)).slice(-160):[];
      showReview=finalized&&(game.game_over()||Boolean(endedBy))&&notes.length>0;
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
      if(CLOCK){
        $("time-control").value=clockState.preset||"none";
        $("clock-style").value=clockTheme;
        $("sound-enabled").checked=soundEnabled;
        if(clockState.preset==="custom"){
          $("custom-minutes").value=String(clockState.baseMs/60000);
          $("custom-increment").value=String(clockState.incrementMs/1000);
        }
        $("custom-clock").hidden=clockState.preset!=="custom";
      }
      if(lesson){matchMode="practice";matchSession=null;$("match-mode").value="practice";if(CLOCK&&clockState?.baseMs&&!clockState.paused)clockState=CLOCK.pause(clockState,Date.now());}
      if(game.history().length)last=game.history({verbose:true}).slice(-1).map(x=>[x.from,x.to])[0]||null;
      reviewCursor=!lesson&&Number.isInteger(data.reviewCursor)&&data.reviewCursor>=0&&data.reviewCursor<game.history().length?data.reviewCursor:null;
      restoreMatchNotice();message(tr("restored"));
    }catch(e){message("Saved state is invalid; a fresh game was started.");}
  }
  function applyCloudAccount(doc){
    // Authenticated, server-owned data only. Never import pre-registration local test results.
    const known=new Set(LESSONS.map(x=>x.id));
    const nextCompleted=Array.isArray(doc?.practiceCompleted)
      ?[...new Set(doc.practiceCompleted.filter(id=>typeof id==="string"&&known.has(id)))]:[];
    const rawStats=doc?.practiceStats;
    const nextStats=rawStats&&["wins","losses","draws"].every(k=>Number.isSafeInteger(rawStats[k])&&rawStats[k]>=0&&rawStats[k]<=100000)
      ?{wins:rawStats.wins,losses:rawStats.losses,draws:rawStats.draws}:{wins:0,losses:0,draws:0};
    clearTimeout(aiTimer);++epoch;engine.cancel();cancelFullAnalysis();clearHints();hideGameResult();
    game=new Chess();completed=nextCompleted;stats=nextStats;lesson=null;lessonStep=0;lastLessonId=null;parked=null;
    selected=null;last=null;pendingPromotion=null;finalized=false;notes=[];showReview=false;reviewCursor=null;endedBy=null;matchSession=null;
    matchMode="practice";academyTrack="all";
    $("lesson").value="";$("academy-track").value="all";$("match-mode").value="practice";
    if($("academy-dock"))$("academy-dock").open=typeof window.matchMedia==="function"&&!window.matchMedia("(max-width: 720px)").matches;
    if(CLOCK)clockState=CLOCK.start(CLOCK.config("none"),Date.now());
    if($("time-control"))$("time-control").value="none";
    if($("custom-clock"))$("custom-clock").hidden=true;
    if($("promotion"))$("promotion").hidden=true;
    render();renderReview();renderAcademy();persist();
    if(typeof document.dispatchEvent==="function"&&typeof Event==="function")document.dispatchEvent(new Event("chess-progress-change"));
    return {completed:completed.length,stats:{...stats}};
  }
  function newGame(){
    hideGameResult();cancelFullAnalysis();analysisResult=null;reviewCursor=null;clearTimeout(aiTimer);++epoch;engine.cancel();game=new Chess();endedBy=null;lowAlerted=null;lesson=null;lessonStep=0;lastLessonId=null;parked=null;selected=null;last=null;finalized=false;notes=[];showReview=false;clearHints();renderReview();
    $("lesson").value="";
    if($("academy-dock")&&typeof window.matchMedia==="function"&&window.matchMedia("(max-width: 720px)").matches)$("academy-dock").open=false;
    side=$("side").value;difficulty=$("level").value;language=$("lang").value;
    matchMode=$("match-mode").value==="independent"?"independent":"practice";
    if(CLOCK){
      try{clockState=CLOCK.start(CLOCK.config($("time-control").value,$("custom-minutes").value,$("custom-increment").value),Date.now());}
      catch{clockState=CLOCK.start(CLOCK.config("none"),Date.now());$("time-control").value="none";}
      $("custom-clock").hidden=$("time-control").value!=="custom";
      clockTheme=$("clock-style").value==="hourglass"?"hourglass":"digital";
      soundEnabled=$("sound-enabled").checked;
    }
    matchSession=matchMode==="independent"?{id:matchId(),mode:"independent",side,level:difficulty,assisted:false,undone:false,restarted:false,fallback:false}:null;
    if(matchSession&&(!PROGRESS||!window.ChessProgress?.recordGame||Boolean(clockState?.baseMs)))matchSession.assisted=true;
    if(matchSession&&ENGINE.profile(difficulty).mode!=="local"&&!canRunStockfish())matchSession.fallback=true;
    updateEngineAvailability();restoreMatchNotice();
    text("clock-policy",clockState?.baseMs?tr("clockPolicy"):"");
    learnMessage("");message(tr("newGame")+" "+(currentMatch()?prog("loading"):tr("notRated")));render();renderAcademy();persist();
    if(side==="b")scheduleBot();
  }
  function undo(){
    hideGameResult();
    if(currentMatch())return message(prog("assistBlocked"));
    if(reviewCursor!==null)return message(ux("returnLive"));
    if(endedBy)return message(tr("gameOver"));
    if(lesson||parked||!game.history().length)return message(tr("noUndo"));
    clearTimeout(aiTimer);++epoch;engine.cancel();
    if(finalized&&game.game_over()){
      const outcome=game.in_checkmate()?(game.turn()===side?"losses":"wins"):"draws";
      stats[outcome]=Math.max(0,stats[outcome]-1);
    }
    cancelFullAnalysis();analysisResult=null;reviewCursor=null;
    game.undo();
    if(game.history().length&&game.turn()!==side) game.undo();
    notes=notes.filter(x=>x.ply<=game.history().length);showReview=false;clearHints();renderReview();
    selected=null;last=null;finalized=false;
    if(CLOCK&&clockState?.baseMs)clockState={...clockState,remaining:{...clockState.remaining},active:game.turn(),at:Date.now(),done:false,paused:false,flagged:null};
    message(tr("undo"));render();persist();
    if(game.turn()!==side)scheduleBot();
  }
  function startLesson(id){
    hideGameResult();
    if(currentMatch()&&!finalized){$("lesson").value="";return message(prog("assistBlocked"));}
    const task=ACADEMY.byId[id];if(!task)return;
    cancelFullAnalysis();analysisResult=null;reviewCursor=null;
    if(!parked)parked={pgn:game.pgn(),side,difficulty,flipped:$("flip").checked,finalized,notes:notes.slice()};
    if(CLOCK&&clockState?.baseMs&&!clockState.done)clockState=CLOCK.pause(clockState,Date.now());
    clearHints();showReview=false;renderReview();
    clearTimeout(aiTimer);++epoch;engine.cancel();
    game=ACADEMY.createPosition(task,Chess);
    lesson=id;lessonStep=0;lastLessonId=null;side=game.turn();selected=null;last=null;finalized=false;
    $("side").value=side;$("lesson").value=id;
    if($("academy-dock"))$("academy-dock").open=true;
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
    hideGameResult();
    if(!parked)return;
    const previous=parked, restored=new Chess();
    if(previous.pgn && !restored.load_pgn(previous.pgn))return message("Cannot restore saved PGN.");
    cancelFullAnalysis();analysisResult=null;reviewCursor=null;
    clearTimeout(aiTimer);++epoch;engine.cancel();game=restored;parked=null;lesson=null;lessonStep=0;lastLessonId=null;selected=null;
    side=previous.side;difficulty=previous.difficulty;finalized=previous.finalized;notes=previous.notes||[];
    clearHints();showReview=finalized&&(game.game_over()||Boolean(endedBy));renderReview();
    if(CLOCK&&clockState?.baseMs&&clockState.paused)clockState=CLOCK.resume(clockState,Date.now());
    $("side").value=side;$("level").value=difficulty;$("flip").checked=previous.flipped;$("lesson").value="";
    if($("academy-dock")&&typeof window.matchMedia==="function"&&window.matchMedia("(max-width: 720px)").matches)$("academy-dock").open=false;
    updateEngineAvailability();
    learnMessage("");message(tr("restored"));render();renderAcademy();persist();
    if(!finalized&&!game.game_over()&&game.turn()!==side)scheduleBot();
  }
  function refreshLabels(){
    document.documentElement.lang=language;
    const staticUi={"s0":["Язык сайта","Site language","Saytın dili"],"s1":["Масштаб текста","Text zoom","Mətnin miqyası"],"s2":["Сбросить","Reset","Sıfırla"],"s3":["Разделы Chess Odyssey","Chess Odyssey sections","Chess Odyssey bölmələri"],"s4":["Шахматная игра и тренер","Chess game and coach","Şahmat oyunu və məşqçi"],"s5":["Управление уроками Академии","Academy lesson controls","Akademiya dərslərinin idarə edilməsi"],"s6":["Широкая доска","Wide board view","Geniş lövhə"],"s7":["Шахматная доска","Chessboard","Şahmat lövhəsi"],"s8":["Навигация и запись ходов","Move navigation and notation","Gedişlərin naviqasiyası və notasiyası"],"s9":["Управление повтором ходов","Move replay controls","Gedişlərin təkrarına nəzarət"],"s10":["Начальная позиция","First position","Başlanğıc mövqe"],"s11":["Предыдущий ход","Previous move","Əvvəlki gediş"],"s12":["Следующий ход","Next move","Növbəti gediş"],"s13":["Последняя / текущая позиция","Last / live position","Son / cari mövqe"],"s14":["Закрыть уведомление","Close notification","Bildirişi bağla"],"s15":["Записанные ходы","Recorded chess moves","Qeydə alınmış gedişlər"],"s16":["Допустимые ходы","Legal move choices","Mümkün gedişlər"],"s17":["Оценка партии по пяти категориям","Five-category game assessment","Oyunun beş kateqoriya üzrə qiymətləndirilməsi"],"s18":["Преимущество позиции после каждого хода","Position advantage after each move","Hər gedişdən sonra mövqe üstünlüyü"],"s19":["Разбор каждого хода","Move-by-move review","Hər gedişin təhlili"],"s20":["Цветовые темы доски","Board palettes","Lövhənin rəng palitraları"],"s21":["Стили фигур","Piece styles","Fiqur üslubları"],"s22":["Тип партии","Match type","Oyun növü"],"s23":["Раздел Академии","Academy track","Akademiya bölməsi"],"s24":["Выбрать урок","Choose lesson","Dərs seçin"],"s25":["Управление ходами исторической партии","Historical game move controls","Tarixi oyunun gedişlərinin idarə edilməsi"],"s26":["Первый ход","First move","İlk gediş"],"s27":["Последний ход","Last move","Son gediş"],"s28":["Перейти к записанному ходу","Go to recorded move","Qeydə alınmış gedişə keç"],"s29":["Ходы исторической партии","Historical moves","Tarixi oyunun gedişləri"],"s30":["Коллекция исторических партий","Historical game collection","Tarixi oyunlar kolleksiyası"],"s31":["Поиск партий мастеров","Search master games","Ustadların oyunlarını axtar"],"s32":["Выбрать историческую партию мастера","Select historical master game","Ustadın tarixi oyununu seç"],"s33":["Допустимые варианты ходов","Legal historical move options","Mümkün tarixi gediş variantları"],"s34":["Ключевые моменты с комментариями","Annotated key moments","Şərhli əsas məqamlar"],"s35":["Язык прогресса","Progress language","İnkişaf dili"],"s36":["Облачный аккаунт Chess Odyssey","Chess Odyssey cloud account","Chess Odyssey bulud hesabı"]};
    const langIndex={ru:0,en:1,az:2}[language]??0;
    for(const attr of ["aria","title"]){
      for(const node of document.querySelectorAll("[data-ui-"+attr+"]")){
        const label=staticUi[node.getAttribute("data-ui-"+attr)];
        if(label)node.setAttribute(attr==="aria"?"aria-label":"title",label[langIndex]);
      }
    }
    if($("version-label"))$("version-label").textContent={ru:"v1.1.1 · КАНДИДАТ В РЕЛИЗ",en:"v1.1.1 · RELEASE CANDIDATE",az:"v1.1.1 · BURAXILIŞ NAMİZƏDİ"}[language];
    const speed={ru:{bullet:"Пуля",blitz:"Блиц",rapid:"Рапид"},en:{bullet:"Bullet",blitz:"Blitz",rapid:"Rapid"},az:{bullet:"Güllə",blitz:"Blits",rapid:"Rapid"}}[language];
    const presets={bullet1:"1+0",blitz3:"3+0",blitz5:"5+0",rapid10:"10+0",rapid15:"15+0",rapid1510:"15+10",rapid20:"20+0",rapid30:"30+0"};
    for(const o of $("time-control")?.options||[]){if(presets[o.value])o.textContent=speed[o.value.match(/^[a-z]+/)[0]]+" · "+presets[o.value];}
    if($("version-summary"))$("version-summary").textContent={ru:"300 исторических партий · 33 урока Академии",en:"300 historical games · 33 Academy lessons",az:"300 tarixi oyun · 33 Akademiya dərsi"}[language];
    if(APPEARANCE)APPEARANCE.setLanguage(language,document);
    if($("academy-dock-prev"))text("academy-dock-prev",academyDockText("previous"));
    for(const node of document.querySelectorAll("[data-i18n]")){
      const name=node.getAttribute("data-i18n");
      node.textContent=(MOBILE_SETTINGS_TEXT[language]||MOBILE_SETTINGS_TEXT.ru)[name]||LABELS[language][name]||(B8_TEXT[language]||B8_TEXT.ru)[name]||(UX_TEXT[language]||UX_TEXT.ru)[name]||LABELS.ru[name]||B8_TEXT.ru[name]||UX_TEXT.ru[name]||name;
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
    renderAcademy();showHints();renderReview();render();renderFullReview();
    if($("game-result-toast")&&!$("game-result-toast").hidden)showGameResult();
    if($("clock-policy"))text("clock-policy",clockState?.baseMs?tr("clockPolicy"):"");
    if($("sound-enabled"))$("sound-enabled").checked=soundEnabled;
    if($("clock-panel")){
      const spoken={
        ru:["Шахматные часы","Осталось времени у белых","Осталось времени у чёрных"],
        en:["Chess game clocks","White time remaining","Black time remaining"],
        az:["Şahmat saatları","Ağların qalan vaxtı","Qaraların qalan vaxtı"]
      }[language]||["Chess game clocks","White time remaining","Black time remaining"];
      $("clock-panel").setAttribute("aria-label",spoken[0]);
      $("clock-white-time").setAttribute("aria-label",spoken[1]);
      $("clock-black-time").setAttribute("aria-label",spoken[2]);
    }
    const names=PROMOTE_NAMES[language]||PROMOTE_NAMES.ru;
    for(const button of document.querySelectorAll("[data-promote]")){
      button.setAttribute("aria-label",names[button.dataset.promote]);
      button.title=names[button.dataset.promote];
    }
    $("promotion-close").setAttribute("aria-label",names.close);
    if($("promotion-label"))text("promotion-label",tr("promo"));
    showEngineStatus(lastEngineKind);restoreMatchNotice();
  }
    const LABELS={
    ru:{title:"Chess Odyssey",boardHelp:"Клавиши со стрелками — перемещение по доске; Enter или пробел — выбрать клетку.",promotionHelp:"Выберите фигуру для превращения пешки. Escape — отменить.",subtitle:"АКАДЕМИЯ И АРЕНА",coach:"AI-тренер · Учимся играя",newGame:"Новая партия",undo:"Отменить ход",hint:"Подсказка",game:"Тренировочная партия",level:"Сложность AI",side:"Мои фигуры",language:"Язык",flip:"Повернуть доску",lessons:"Академия",chooseLesson:"Выбрать урок…",resume:"Вернуться к партии",academyTrack:"Раздел обучения",allTracks:"Все разделы",trackBasics:"Основы и правила",trackTactics:"Тактика и комбинации",trackOpenings:"Дебютные идеи",trackEndgames:"Эндшпиль",academyLesson:"Урок или задача",nextLesson:"Следующий урок",reviewButton:"Разобрать ходы",reviewTitle:"Ключевые моменты",record:"Победы / поражения / ничьи",done:"Пройдено уроков",moves:"История ходов",about:"В тренировке рейтинг не меняется; часы настраиваются перед партией",white:"Белые",black:"Чёрные",beginner:"Начинающий",novice:"Любитель",intermediate:"Средний",advanced:"Продвинутый",expert:"Эксперт",grandmaster:"Гроссмейстерский вызов"},
    en:{title:"Chess Odyssey",boardHelp:"Use arrow keys to move focus across the board. Enter or Space selects a square.",promotionHelp:"Choose the new piece for the pawn. Press Escape to cancel.",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Learn by playing",newGame:"New game",undo:"Undo move",hint:"Hint",game:"Practice game",level:"AI difficulty",side:"My pieces",language:"Language",flip:"Flip board",lessons:"Academy",chooseLesson:"Choose a lesson…",resume:"Return to game",academyTrack:"Learning track",allTracks:"All tracks",trackBasics:"Rules and essentials",trackTactics:"Tactics and combinations",trackOpenings:"Opening ideas",trackEndgames:"Endgame",academyLesson:"Lesson or challenge",nextLesson:"Next lesson",reviewButton:"Review moves",reviewTitle:"Key moments",record:"Wins / losses / draws",done:"Lessons completed",moves:"Move history",about:"Practice does not affect rating; set clocks before playing",white:"White",black:"Black",beginner:"Beginner",novice:"Novice",intermediate:"Intermediate",advanced:"Advanced",expert:"Expert",grandmaster:"Grandmaster Challenge"},
    az:{title:"Chess Odyssey",boardHelp:"Ox düymələri ilə taxtada hərəkət edin. Xanəni seçmək üçün Enter və ya boşluq basın.",promotionHelp:"Piyadanın çevriləcəyi fiquru seçin. Ləğv etmək üçün Escape basın.",subtitle:"AKADEMİYA VƏ ARENA",coach:"AI məşqçi · Oynayaraq öyrənin",newGame:"Yeni oyun",undo:"Gedişi ləğv et",hint:"İpucu",game:"Məşq oyunu",level:"AI çətinliyi",side:"Mənim fiqurlarım",language:"Dil",flip:"Taxtanı çevir",lessons:"Akademiya",chooseLesson:"Dərs seçin…",resume:"Oyuna qayıt",academyTrack:"Təlim bölməsi",allTracks:"Bütün bölmələr",trackBasics:"Qaydalar və əsaslar",trackTactics:"Taktika və kombinasiyalar",trackOpenings:"Debüt ideyaları",trackEndgames:"Endşpil",academyLesson:"Dərs və ya tapşırıq",nextLesson:"Növbəti dərs",reviewButton:"Gedişləri təhlil et",reviewTitle:"Əsas məqamlar",record:"Qələbə / məğlubiyyət / heç-heçə",done:"Tamamlanmış dərslər",moves:"Gedişlərin tarixçəsi",about:"Məşq reytinqə təsir etmir; saatı oyundan əvvəl seçin",white:"Ağlar",black:"Qaralar",beginner:"Başlanğıc",novice:"Həvəskar",intermediate:"Orta",advanced:"İrəliləmiş",expert:"Ekspert",grandmaster:"Qrossmeyster sınağı"}
  };
  function setupAcademyDock(){
    if(typeof document.querySelector!=="function")return; // Node synthetic fixture
    const dock=$("academy-dock"),host=$("academy-dock-fields");
    const panel=document.querySelector("#practice-view .academy-panel");
    const track=panel?.querySelector(".academy-filter-label");
    const select=panel?.querySelector(".academy-lesson-label");
    if(!dock||!host||!track||!select)return;
    // Reparent existing native selects and labels: no duplicated IDs or progress state.
    host.append(track,select);
    $("academy-dock-next").addEventListener("click",nextLesson);
    $("academy-dock-hint").addEventListener("click",hint);
    $("academy-dock-resume").addEventListener("click",resumeGame);
    $("academy-dock-prev").addEventListener("click",()=>{
      const id=lesson||lastLessonId,index=LESSONS.findIndex(x=>x.id===id);
      if(index<=0)return;
      const previous=LESSONS[index-1];
      academyTrack=previous.track;$("academy-track").value=academyTrack;
      startLesson(previous.id);
    });
    // Desktop retains visible selectors for legacy keyboard workflows; phone stays compact.
    if(lesson||lastLessonId&&parked||typeof window.matchMedia==="function"&&!window.matchMedia("(max-width: 720px)").matches)dock.open=true;
  }
  function setupMobileSettings(){
    // Headless chess-rule fixtures may supply a minimal document without DOM query APIs.
    if(typeof document.querySelector!=="function"||typeof window.matchMedia!=="function")return;
    const panel=$("mobile-game-settings"),host=$("mobile-settings-fields"),done=$("mobile-settings-done");
    const sidebar=document.querySelector("#practice-view > .sidebar");
    const appearance=sidebar?.querySelector(":scope > .appearance-panel");
    const settings=sidebar?.querySelector(":scope > .settings-panel");
    if(!panel||!host||!done||!appearance||!settings||typeof window.matchMedia!=="function")return;
    // Move the original controls instead of creating duplicate IDs or parallel state.
    const appearanceAnchor=document.createComment("appearance desktop position");
    const settingsAnchor=document.createComment("settings desktop position");
    sidebar.insertBefore(appearanceAnchor,appearance);
    sidebar.insertBefore(settingsAnchor,settings);
    const viewport=window.matchMedia("(max-width: 720px)");
    const relocate=()=>{
      if(viewport.matches){
        host.append(appearance,settings);
      }else{
        sidebar.insertBefore(appearance,appearanceAnchor.nextSibling);
        sidebar.insertBefore(settings,settingsAnchor.nextSibling);
        panel.open=false;
      }
    };
    relocate();
    if(typeof viewport.addEventListener==="function")viewport.addEventListener("change",relocate);
    else if(typeof viewport.addListener==="function")viewport.addListener(relocate);
    done.addEventListener("click",()=>{
      panel.open=false;
      const summary=panel.querySelector("summary");
      if(summary)summary.focus({preventScroll:true});
    });
    document.body.classList.add("mobile-settings-ready");
  }
  function init(){
    if(typeof Chess!=="function")throw new Error("Rules Engine missing");
    if(!COACH||typeof COACH.analyze!=="function")throw new Error("Chess Coach Engine missing");
    if(!ENGINE||typeof ENGINE.legalUci!=="function")throw new Error("Chess Engine Bridge missing");
    restore();
    if(APPEARANCE?.init)APPEARANCE.init(document,{languageChanged:(lang)=>{
      if(!["ru","en","az"].includes(lang))return;
      $("lang").value=lang;$("lang").dispatchEvent(new Event("change",{bubbles:true}));
    }});
    setupMobileSettings();
    setupAcademyDock();
    if($("game-result-close"))$("game-result-close").addEventListener("click",hideGameResult);
    if($("game-result-review"))$("game-result-review").addEventListener("click",()=>{
      hideGameResult();$("full-review-details").open=true;
      if(typeof $("full-review-details").scrollIntoView==="function")$("full-review-details").scrollIntoView({block:"start",behavior:"smooth"});
    });
    $("h-first").addEventListener("click",()=>jumpHistory(0));
    $("h-prev").addEventListener("click",()=>jumpHistory((reviewCursor===null?game.history().length:reviewCursor)-1));
    $("h-next").addEventListener("click",()=>jumpHistory((reviewCursor===null?game.history().length:reviewCursor)+1));
    $("h-last").addEventListener("click",()=>jumpHistory(game.history().length));
    $("h-return").addEventListener("click",()=>jumpHistory(game.history().length));
    $("start-review").addEventListener("click",startFullAnalysis);
    $("cancel-review").addEventListener("click",()=>{cancelFullAnalysis();text("review-progress",ux("reviewReady"));renderFullReview();});
    $("full-review-details").addEventListener("toggle",renderFullReview);
    $("new-game").addEventListener("click",newGame);
    if($("rematch"))$("rematch").addEventListener("click",newGame);
    if($("resign"))$("resign").addEventListener("click",()=>{
      if(finalized||lesson||parked||game.game_over())return;
      if(typeof window.confirm==="function"&&!window.confirm(tr("confirmResign")))return;
      endedBy={type:"resign",loser:side,draw:false};clearTimeout(aiTimer);++epoch;engine.cancel();finish();
    });
    if(CLOCK){
      $("time-control").addEventListener("change",newGame);
      $("custom-minutes").addEventListener("change",()=>{if($("time-control").value==="custom")newGame();});
      $("custom-increment").addEventListener("change",()=>{if($("time-control").value==="custom")newGame();});
      $("clock-style").addEventListener("change",()=>{clockTheme=$("clock-style").value;clockTick();persist();});
      $("sound-enabled").addEventListener("change",()=>{soundEnabled=$("sound-enabled").checked;persist();});
      if(typeof setInterval==="function")setInterval(clockTick,250);
    }
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
    $("promotion-close").addEventListener("click",closePromotion);
    $("promotion").addEventListener("keydown",event=>{
      if($("promotion").hidden)return;
      if(event.key==="Escape"){event.preventDefault();closePromotion();return;}
      if(event.key!=="Tab")return;
      const focusable=[$("promotion-close"),...document.querySelectorAll("#promotion [data-promote]")];
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    $("nav-masters").addEventListener("click",()=>{if(pendingPromotion)closePromotion();});
    $("nav-progress").addEventListener("click",()=>{if(pendingPromotion)closePromotion();});
    updateEngineAvailability();
    refreshLabels();restoreMatchNotice();
    if(showReview)renderReview();
    if(game.turn()!==side && !game.game_over() && !finalized)scheduleBot();
    clockTick();render();
  }
  window.ChessOdysseyAccount=Object.freeze({apply:applyCloudAccount,summary:()=>({completed:completed.length,stats:{...stats}})});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
  // Stable test surface without providing a user-facing debug console.
  window.ChessOdysseyQA={academy:()=>({total:LESSONS.length,tracks:ACADEMY.tracks.map(x=>x.id),active:lesson,step:lessonStep}),levels:()=>ENGINE.ids.slice(),engineStatus:()=>lastEngineKind,legalUci:(fen,uci)=>{const c=new Chess(fen);return ENGINE.legalUci(c,uci);},legalCount:(fen)=>{const c=new Chess();if(fen&&!c.load(fen))throw new Error("invalid FEN");return c.moves().length;},lessonIds:()=>LESSONS.map(x=>x.id),evaluate:()=>scorePosition(),coach:()=>COACH.version,notes:()=>notes.length,clock:()=>({clockState,endedBy}),match:()=>({mode:matchMode,session:matchSession&&{...matchSession},finalized}),ux:()=>({cursor:reviewCursor,ply:game.history().length,lang:language,appearance:APPEARANCE?.snapshot(),analysisReady:Boolean(analysisResult),analysisRunning}),progress:()=>window.ChessProgress.snapshot().summary};
})();