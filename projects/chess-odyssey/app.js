/* Chess Odyssey v0.1 | Custom game, AI and coach logic | chess.js supplies legal rules */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const KEY = "chess-odyssey-v01";
  const PIECES = {wk:"♔",wq:"♕",wr:"♖",wb:"♗",wn:"♘",wp:"♙",bk:"♚",bq:"♛",br:"♜",bb:"♝",bn:"♞",bp:"♟"};
  const VALUES = {p:100,n:320,b:330,r:500,q:900,k:0};
  const FILES = "abcdefgh";
  const I18N = {
    ru:{turn:"Ваш ход",thinking:"Противник выбирает ход",check:"Шах!",mate:"Мат",draw:"Ничья",win:"Победа",loss:"Поражение",select:"Выберите фигуру, затем доступную клетку.",illegal:"Недопустимый ход.",hint:"Возможные идеи",notRated:"Тренировочная игра: рейтинг не меняется.",safe:"Сейчас фигуру нельзя немедленно взять легальным ходом.",risk:"После этого хода соперник сможет взять фигуру на {square}. Подумайте о продолжении.",capture:"Взятие фигуры соперника",develop:"Развитие фигуры помогает включить её в игру.",center:"Ход влияет на борьбу за центр.",castle:"Рокировка помогает укрыть короля.",pawn:"Пешки помогают контролировать пространство.",quiet:"Спокойный ход: проверьте угрозы соперника.",lesson:"Учебная задача",lessonGood:"Верно! Продолжайте обучение.",lessonRetry:"Попробуйте выполнить показанную задачу.",lessonDone:"Урок пройден. Выберите следующий.",mateMove:"Этот ход завершает партию матом.",checkMove:"Вы даёте шах.",promo:"Выберите превращение пешки",restored:"Партия восстановлена.",newGame:"Новая тренировочная партия.",undo:"Последний ход отменён.",noUndo:"Нет ходов для отмены.",gameOver:"Партия окончена.",bot:"Компьютер",you:"Вы",beginner:"Начинающий",novice:"Любитель"},
    en:{turn:"Your turn",thinking:"Opponent is choosing a move",check:"Check!",mate:"Checkmate",draw:"Draw",win:"Victory",loss:"Defeat",select:"Select a piece, then a legal destination.",illegal:"Illegal move.",hint:"Possible ideas",notRated:"Practice game: no rating changes.",safe:"This piece cannot be captured by an immediate legal move.",risk:"After this move, your opponent can capture the piece on {square}. Consider the reply.",capture:"Captures an opposing piece.",develop:"Developing a piece brings it into play.",center:"This move contributes to control of the center.",castle:"Castling helps shelter your king.",pawn:"Pawns help claim space.",quiet:"A quiet move: check the opponent's threats.",lesson:"Training challenge",lessonGood:"Correct! Keep learning.",lessonRetry:"Try to complete the displayed challenge.",lessonDone:"Lesson complete. Choose the next one.",mateMove:"This move ends the game with checkmate.",checkMove:"This move gives check.",promo:"Choose pawn promotion",restored:"Game restored.",newGame:"New practice game.",undo:"Last turn undone.",noUndo:"No moves to undo.",gameOver:"The game has ended.",bot:"Computer",you:"You",beginner:"Beginner",novice:"Novice"},
    az:{turn:"Sizin gedişiniz",thinking:"Rəqib gedişi seçir",check:"Şah!",mate:"Mat",draw:"Heç-heçə",win:"Qələbə",loss:"Məğlubiyyət",select:"Fiquru, sonra mümkün xanəni seçin.",illegal:"Qeyri-qanuni gediş.",hint:"Mümkün ideyalar",notRated:"Məşq oyunu: reytinq dəyişmir.",safe:"Hazırda bu fiquru dərhal qanuni gedişlə almaq mümkün deyil.",risk:"Bu gedişdən sonra rəqib {square} xanəsindəki fiquru ala bilər. Cavabı nəzərdən keçirin.",capture:"Rəqib fiqurunu alır.",develop:"Fiquru inkişaf etdirmək onu oyuna qoşur.",center:"Bu gediş mərkəzə nəzarətə kömək edir.",castle:"Rokirovka şahı qorumağa kömək edir.",pawn:"Piyadalar sahəyə nəzarəti artırır.",quiet:"Sakit gediş: rəqibin təhdidlərini yoxlayın.",lesson:"Təlim tapşırığı",lessonGood:"Düzdür! Öyrənməyə davam edin.",lessonRetry:"Göstərilən tapşırığı yerinə yetirin.",lessonDone:"Dərs tamamlandı. Növbəti dərsi seçin.",mateMove:"Bu gediş oyunu mat ilə bitirir.",checkMove:"Bu gediş şah verir.",promo:"Piyadanın çevrilməsini seçin",restored:"Oyun bərpa edildi.",newGame:"Yeni məşq oyunu.",undo:"Son gediş ləğv edildi.",noUndo:"Ləğv ediləcək gediş yoxdur.",gameOver:"Oyun başa çatıb.",bot:"Kompüter",you:"Siz",beginner:"Başlanğıc",novice:"Həvəskar"}
  };
  const LESSONS = [
    {id:"pawn",pre:[],from:"e2",to:"e4",title:{ru:"1. Пешка берёт пространство",en:"1. Claim space with a pawn",az:"1. Piyada ilə sahə qazanın"},description:{ru:"Выберите пешку e2 и сделайте первый ход на e4. Из центра пешка будет контролировать d5 и f5.",en:"Move the pawn from e2 to e4. From there it controls d5 and f5.",az:"e2 piyadasını e4-ə aparın. Oradan d5 və f5 xanələrinə nəzarət edəcək."}},
    {id:"knight",pre:[],from:"g1",to:"f3",title:{ru:"2. Развиваем коня",en:"2. Develop your knight",az:"2. Atı inkişaf etdirin"},description:{ru:"Переведите коня с g1 на f3: конь прыгает буквой «Г» и не зависит от фигур между клетками.",en:"Move the knight from g1 to f3. Knights jump in an L shape, even over other pieces.",az:"Atı g1-dən f3-ə aparın. At «L» şəklində hərəkət edir və fiqurların üzərindən tullana bilir."}},
    {id:"mate",pre:["e4","e5","Bc4","Nc6","Qh5","Nf6"],from:"h5",to:"f7",title:{ru:"3. Находим мат в один",en:"3. Find checkmate in one",az:"3. Bir gedişdə mat tapın"},description:{ru:"Чёрные забыли о слабом поле f7. Белые могут закончить партию одним ходом ферзя. Найдите его.",en:"Black neglected the vulnerable f7 square. White can finish the game with one queen move.",az:"Qaralar zəif f7 xanəsini nəzərdən qaçırıb. Ağlar vəzirin bir gedişi ilə oyunu bitirə bilər."}}
  ];
  let game = new Chess();
  let language = "ru", side = "w", difficulty = "beginner", selected = null, last = null, lesson = null;
  let completed = [], stats = {wins:0,losses:0,draws:0}, epoch = 0, aiTimer = null, finalized = false, pendingPromotion = null, parked = null;
  function tr(k) {return (I18N[language] || I18N.ru)[k] || k;}
  function text(k, val){return $(k) && ($(k).textContent=val);}
  function message(str){text("coach-message",str);}
  function learnMessage(str){text("lesson-status",str);}
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
  function botMove(){
    if(game.game_over() || lesson || game.turn()===side) return;
    const ranked=candidates(difficulty==="novice"?2:1);
    if(!ranked.length) return;
    const max=ranked[0].score;
    // Reduced strength via near-best choice; every candidate is a legal chess.js move.
    const allowed=ranked.filter(x=>x.score >= max-(difficulty==="novice"?20:105)).slice(0,difficulty==="novice"?2:5);
    const choice=allowed[Math.floor(Math.random()*allowed.length)].move;
    const moved=game.move(choice);
    last=[moved.from,moved.to];
    finalized=false;
    selected=null;
    render();
    persist();
    if(game.game_over()) finish();
    else message(explain(moved));
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
  function dangerAfter(move){
    game.move(move);
    const reply=game.moves({verbose:true}).find(x=>x.to===move.to && (x.flags.includes("c")||x.flags.includes("e")));
    game.undo();
    return reply || null;
  }
  function hint(){
    if(game.game_over()) return message(tr("gameOver"));
    if(!lesson && game.turn()!==side) return;
    if(lesson){
      const target=LESSONS.find(x=>x.id===lesson);
      message(target.description[language]);
      selected=target.from; render(); return;
    }
    const ideas=candidates(1).slice(0,3).map(x=>x.move.san+": "+explainPreview(x.move));
    message(tr("hint")+": "+ideas.join(" • "));
  }
  function explainPreview(move){
    const atRisk=dangerAfter(move);
    if(atRisk) return tr("risk").replace("{square}",move.to);
    game.move(move);
    const msg=explain(move);
    game.undo();
    return msg;
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
      const task=LESSONS.find(x=>x.id===lesson);
      if(from!==task.from||to!==task.to) return learnMessage(tr("lessonRetry"));
    }
    const atRisk=dangerAfter(candidate);
    const move=game.move({from,to,promotion:promotion||"q"});
    if(!move) return message(tr("illegal"));
    last=[from,to]; selected=null;
    $("promotion").hidden=true; pendingPromotion=null;
    if(lesson){
      const solved=lesson;
      if(!completed.includes(solved)) completed.push(solved);
      learnMessage(tr("lessonDone"));
      message(tr("lessonGood")+" "+explain(move));
      lesson=null; finalized=true; $("lesson").value="";
    } else {
      message(atRisk?tr("risk").replace("{square}",to):explain(move));
    }
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
    const legal=selected?game.moves({square:selected,verbose:true}).map(m=>m.to):[];
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
    $("undo").disabled=!!parked || !game.history().length;
    $("resume-game").hidden=!parked;
  }
  function finish(){
    if(finalized || lesson || !game.game_over()) return;
    if(game.in_checkmate()) {
      if(game.turn()===side)stats.losses++;
      else stats.wins++;
    } else stats.draws++;
    finalized=true;persist();render();
    message(status()+" — "+tr("notRated"));
  }
  function persist(){
    const session=parked||{pgn:lesson?null:game.pgn(),side,difficulty,flipped:$("flip").checked,finalized:finalized&&!lesson};
    try{localStorage.setItem(KEY,JSON.stringify({pgn:session.pgn,side:session.side,difficulty:session.difficulty,language,completed,stats,flipped:session.flipped,finalized:session.finalized}));}
    catch(e){message("Storage unavailable; progress cannot be saved.");}
  }
  function restore(){
    try {
      const raw=localStorage.getItem(KEY);if(!raw)return;
      const data=JSON.parse(raw);
      language=["ru","en","az"].includes(data.language)?data.language:"ru";
      side=["w","b"].includes(data.side)?data.side:"w";
      difficulty=["beginner","novice"].includes(data.difficulty)?data.difficulty:"beginner";
      completed=Array.isArray(data.completed)?data.completed.filter(x=>LESSONS.some(y=>y.id===x)):[];
      stats=data.stats&&["wins","losses","draws"].every(k=>Number.isInteger(data.stats[k])&&data.stats[k]>=0)?data.stats:stats;
      if(typeof data.pgn==="string"&&data.pgn.trim()){const test=new Chess();if(test.load_pgn(data.pgn))game=test;}
      finalized=Boolean(data.finalized);
      $("flip").checked=Boolean(data.flipped);
      $("lang").value=language;$("side").value=side;$("level").value=difficulty;
      if(game.history().length)last=game.history({verbose:true}).slice(-1).map(x=>[x.from,x.to])[0]||null;
      message(tr("restored"));
    }catch(e){message("Saved state is invalid; a fresh game was started.");}
  }
  function newGame(){
    clearTimeout(aiTimer);++epoch;game=new Chess();lesson=null;parked=null;selected=null;last=null;finalized=false;
    side=$("side").value;difficulty=$("level").value;language=$("lang").value;
    learnMessage("");message(tr("newGame")+" "+tr("notRated"));render();persist();
    if(side==="b")scheduleBot();
  }
  function undo(){
    if(lesson||parked||!game.history().length)return message(tr("noUndo"));
    clearTimeout(aiTimer);++epoch;
    if(finalized&&game.game_over()){
      const outcome=game.in_checkmate()?(game.turn()===side?"losses":"wins"):"draws";
      stats[outcome]=Math.max(0,stats[outcome]-1);
    }
    game.undo();
    if(game.history().length&&game.turn()!==side) game.undo();
    selected=null;last=null;finalized=false;
    message(tr("undo"));render();persist();
    if(game.turn()!==side)scheduleBot();
  }
  function startLesson(id){
    const task=LESSONS.find(x=>x.id===id);if(!task)return;
    if(!parked)parked={pgn:game.pgn(),side,difficulty,flipped:$("flip").checked,finalized};
    clearTimeout(aiTimer);++epoch;game=new Chess();lesson=id;side="w";selected=null;last=null;finalized=false;
    for(const san of task.pre){if(!game.move(san))throw new Error("Invalid verified lesson sequence "+san);}
    $("side").value="w";render();message(task.description[language]);learnMessage(task.title[language]);persist();
  }
  function resumeGame(){
    if(!parked)return;
    const previous=parked, restored=new Chess();
    if(previous.pgn && !restored.load_pgn(previous.pgn))return message("Cannot restore saved PGN.");
    clearTimeout(aiTimer);++epoch;game=restored;parked=null;lesson=null;selected=null;last=null;
    side=previous.side;difficulty=previous.difficulty;finalized=previous.finalized;
    $("side").value=side;$("level").value=difficulty;$("flip").checked=previous.flipped;$("lesson").value="";
    learnMessage("");message(tr("restored"));render();persist();
    if(!finalized&&!game.game_over()&&game.turn()!==side)scheduleBot();
  }
  function refreshLabels(){
    document.documentElement.lang=language;
    for(const node of document.querySelectorAll("[data-i18n]")){
      const name=node.getAttribute("data-i18n");node.textContent=LABELS[language][name]||LABELS.ru[name]||name;
    }
    const lessonOptions=$("lesson").options;
    lessonOptions[0].textContent=LABELS[language].chooseLesson;
    LESSONS.forEach((task,i)=>{lessonOptions[i+1].textContent=task.title[language];});
    if(lesson) {const task=LESSONS.find(x=>x.id===lesson);learnMessage(task.title[language]);message(task.description[language]);}
    render();
  }
  const LABELS={
    ru:{title:"Chess Odyssey",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Учимся играя",newGame:"Новая партия",undo:"Отменить ход",hint:"Подсказка",game:"Тренировочная партия",level:"Сложность AI",side:"Мои фигуры",language:"Язык",flip:"Повернуть доску",lessons:"Академия",chooseLesson:"Выбрать урок…",resume:"Вернуться к партии",record:"Победы / поражения / ничьи",done:"Пройдено уроков",moves:"История ходов",about:"Рейтинг отключён в тренировке; без таймера",white:"Белые",black:"Чёрные",beginner:"Начинающий",novice:"Любитель"},
    en:{title:"Chess Odyssey",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Learn by playing",newGame:"New game",undo:"Undo move",hint:"Hint",game:"Practice game",level:"AI difficulty",side:"My pieces",language:"Language",flip:"Flip board",lessons:"Academy",chooseLesson:"Choose a lesson…",resume:"Return to game",record:"Wins / losses / draws",done:"Lessons completed",moves:"Move history",about:"No rating in practice; no chess clock",white:"White",black:"Black",beginner:"Beginner",novice:"Novice"},
    az:{title:"Chess Odyssey",subtitle:"ACADEMY & ARENA",coach:"AI Coach · Oynayaraq öyrənin",newGame:"Yeni oyun",undo:"Gedişi ləğv et",hint:"İpucu",game:"Məşq oyunu",level:"AI çətinliyi",side:"Mənim fiqurlarım",language:"Dil",flip:"Taxtanı çevir",lessons:"Akademiya",chooseLesson:"Dərs seçin…",resume:"Oyuna qayıt",record:"Qələbə / məğlubiyyət / heç-heçə",done:"Tamamlanmış dərslər",moves:"Gedişlərin tarixçəsi",about:"Məşqdə reytinq yoxdur; vaxt limiti yoxdur",white:"Ağlar",black:"Qaralar",beginner:"Başlanğıc",novice:"Həvəskar"}
  };
  function init(){
    if(typeof Chess!=="function")throw new Error("Rules Engine missing");
    restore();
    $("new-game").addEventListener("click",newGame);
    $("undo").addEventListener("click",undo);
    $("resume-game").addEventListener("click",resumeGame);
    $("hint").addEventListener("click",hint);
    $("flip").addEventListener("change",()=>{render();persist();});
    $("lang").addEventListener("change",()=>{language=$("lang").value;refreshLabels();persist();});
    $("side").addEventListener("change",newGame);
    $("level").addEventListener("change",newGame);
    $("lesson").addEventListener("change",()=>{if($("lesson").value)startLesson($("lesson").value);});
    for(const btn of document.querySelectorAll("[data-promote]"))btn.addEventListener("click",()=>{if(pendingPromotion)doMove(pendingPromotion.from,pendingPromotion.to,btn.dataset.promote);});
    $("promotion-close").addEventListener("click",()=>{pendingPromotion=null;$("promotion").hidden=true;});
    refreshLabels();
    if(game.turn()!==side && !game.game_over() && !finalized)scheduleBot();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
  // Stable test surface without providing a user-facing debug console.
  window.ChessOdysseyQA={legalCount:(fen)=>{const c=new Chess();if(fen&&!c.load(fen))throw new Error("invalid FEN");return c.moves().length;},lessonIds:()=>LESSONS.map(x=>x.id),evaluate:()=>scorePosition()};
})();