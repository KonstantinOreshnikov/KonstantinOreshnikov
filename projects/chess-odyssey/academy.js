/* Chess Odyssey B4 Academy — original RU/EN/AZ lessons.
 * All game positions/moves are checked against the existing chess.js rule engine.
 * Prompts are instructions; no copied proprietary opening databases.
 */
(function(root,make) {
  "use strict";
  const value=make();
  if(typeof module==="object"&&module.exports)module.exports=value;
  else root.ChessAcademy=value;
})(typeof window!=="undefined"?window:this,function(){
  "use strict";
  const langs=["ru","en","az"];
  const T=(ru,en,az)=>Object.freeze({ru,en,az});
  const S=(san,ru,en,az,reply)=>Object.freeze({san,prompt:T(ru,en,az),reply:reply||null});
  const L=(id,track,title,intro,setup,steps,goal)=>Object.freeze({
    id,track,title:T(...title),intro:T(...intro),setup:setup||{},
    steps:Object.freeze(steps),goal:goal||null
  });
  const tracks=Object.freeze([
    {id:"basics",label:T("Основы и правила","Rules and essentials","Qaydalar və əsaslar")},
    {id:"tactics",label:T("Тактика и комбинации","Tactics and combinations","Taktika və kombinasiyalar")},
    {id:"openings",label:T("Дебютные идеи","Opening ideas","Debüt ideyaları")},
    {id:"endgames",label:T("Эндшпиль","Endgame","Endşpil")}
  ]);
  const lessons=Object.freeze([
    // BASICS: explicit legal movement, check, special rules and game-ending notation.
    L("pawn","basics",
      ["1. Пешка занимает центр","1. Claim the centre with a pawn","1. Piyada ilə mərkəzi tutun"],
      ["Ход e2–e4 открывает линии слону и ферзю; пешка с e4 контролирует d5 и f5.","Moving e2–e4 frees the bishop and queen; from e4 your pawn attacks d5 and f5.","e2–e4 gedişi fil və vəzir üçün yol açır; e4 piyadası d5 və f5 xanələrini nəzarətdə saxlayır."],
      {},[S("e4","Выведите пешку с e2 на e4.","Push the pawn from e2 to e4.","e2 piyadasını e4-ə aparın.")],"pawn"),
    L("knight","basics",
      ["2. Конь перепрыгивает фигуры","2. Knights jump over pieces","2. At fiqurların üzərindən tullanır"],
      ["Конь ходит буквой «Г», может перепрыгивать фигуры и с f3 атакует e5 и d4.","A knight moves in an L shape, jumps over pieces, and from f3 attacks e5 and d4.","At «L» şəklində hərəkət edir, fiqurların üstündən tullanır və f3-dən e5, d4 xanələrini hədələyir."],
      {},[S("Nf3","Развивайте коня g1 на f3.","Develop the knight from g1 to f3.","g1 atını f3-ə inkişaf etdirin.")],"develop"),
    L("bishop","basics",
      ["3. Слон на длинной диагонали","3. The bishop's diagonal","3. Fil diaqonal üzrə"],
      ["Слон идёт по диагонали и не перепрыгивает фигуры. После e4 диагональ f1–c4 свободна.","Bishops move diagonally and cannot jump pieces. After e4, the f1–c4 diagonal is open.","Fil diaqonal üzrə gedir və fiqurların üzərindən tullanmır. e4-dən sonra f1–c4 diaqonalı açılır."],
      {pre:["e4","e5"]},[S("Bc4","Выведите белопольного слона на c4.","Develop the light-squared bishop to c4.","Ağxanalı fili c4-ə inkişaf etdirin.")],"develop"),
    L("rook","basics",
      ["4. Ладья идёт по прямой","4. Rooks move in straight lines","4. Top düz xətlə hərəkət edir"],
      ["Ладья ходит вдоль горизонталей и вертикалей. В этой учебной позиции путь a1–a4 свободен.","Rooks move along ranks and files. In this practice position a1–a4 is clear.","Top üfüqi və şaquli xətlər üzrə hərəkət edir. Bu mövqedə a1–a4 yolu açıqdır."],
      {fen:"4k3/8/8/8/8/8/8/R3K3 w - - 0 1"},[S("Ra4","Переведите ладью a1 на a4.","Move the rook from a1 to a4.","a1 topunu a4-ə aparın.")],"rook"),
    L("queen","basics",
      ["5. Ферзь соединяет ходы слона и ладьи","5. The queen combines bishop and rook moves","5. Vəzir fil və topun gedişlərini birləşdirir"],
      ["Ферзь движется по диагонали, горизонтали и вертикали, но не может перепрыгнуть занятую клетку.","A queen moves along diagonals, ranks and files, but cannot jump over pieces.","Vəzir diaqonal, üfüqi və şaquli xətlər üzrə gedir, lakin fiqurların üzərindən tullanmır."],
      {pre:["e4","e5"]},[S("Qh5","Переведите ферзя d1 на h5; это учебный ход, а не рекомендация для каждого дебюта.","Move your queen from d1 to h5; this is a movement drill, not universal opening advice.","Vəziri d1-dən h5-ə aparın; bu, hər debütdə tövsiyə edilən gediş deyil, hərəkət məşqidir.")],"queen"),
    L("castle","basics",
      ["6. Короткая рокировка","6. Kingside castling","6. Qısa rokirovka"],
      ["Король идёт на g1, ладья с h1 — на f1. Рокировка допустима, если король и ладья не ходили, путь свободен и король не проходит через атакованные поля.","The king moves to g1 and the h1 rook to f1. Both pieces must be unmoved, the path clear, and the king cannot castle through check.","Şah g1-ə, h1 topu f1-ə keçir. Hər iki fiqur əvvəl hərəkət etməməli, yol açıq olmalı və şah hücum altındakı xanədən keçməməlidir."],
      {pre:["Nf3","Nf6","g3","g6","Bg2","Bg7"]},[S("O-O","Сделайте короткую рокировку белых.","Castle kingside with White.","Ağlarla qısa rokirovka edin.")],"castle"),
    L("enpassant","basics",
      ["7. Взятие на проходе","7. En passant capture","7. Keçiddə alma"],
      ["Пешка d7 только что прошла d6 и остановилась на d5. Белая пешка e5 может немедленно взять её ходом exd6; позже это право исчезнет.","Black's d-pawn just advanced two squares to d5. The e5-pawn can capture it en passant on d6, but only immediately.","Qaraların d-piyadası iki xana irəliləyib d5-ə gəlib. e5 piyadası onu dərhal d6-da keçiddə ala bilər; sonra bu imkan itir."],
      {pre:["e4","a6","e5","d5"]},[S("exd6","Возьмите пешку на проходе: e5xd6.","Capture en passant: e5xd6.","Piyadanı keçiddə alın: e5xd6.")],"enpassant"),
    L("promotion","basics",
      ["8. Превращение пешки","8. Pawn promotion","8. Piyadanın çevrilməsi"],
      ["Пешка на последней горизонтали превращается в ферзя, ладью, слона или коня. Здесь выберите ферзя — это практичный стандартный выбор, но не обязательный.","A pawn reaching its last rank must promote to queen, rook, bishop or knight. Choose a queen here; it is a common, not compulsory, choice.","Sonuncu üfüqi xəttə çatan piyada vəzirə, topa, filə və ya ata çevrilir. Burada vəziri seçin: bu, adi seçimdir, məcburi deyil."],
      {fen:"8/P7/8/8/8/8/7k/2K5 w - - 0 1"},[S("a8=Q","Проведите пешку a7 на a8 и выберите ферзя.","Move a7 to a8 and choose Queen.","a7 piyadasını a8-ə aparıb vəziri seçin.")],"promotion"),
    L("check","basics",
      ["9. Шах: король под ударом","9. Check: the king is attacked","9. Şah: şah hücum altındadır"],
      ["Шах — это нападение на короля. Ответ должен устранить шах; самого короля нельзя захватить.","Check means a king is attacked. The reply must resolve the check; the king is never literally captured.","Şah vəziyyəti şahın hücum altında olmasıdır. Cavab şahı aradan qaldırmalıdır; şah fiquru götürülmür."],
      {fen:"4k3/8/8/8/8/8/5R2/4K3 w - - 0 1"},[S("Re2+","Дайте шах ладьёй: f2–e2.","Give check with the rook: f2–e2.","Topla şah verin: f2–e2.")],"check"),
    // TACTICS: real motifs; script validates legal move and final tactical feature.
    L("mate","tactics",
      ["10. Мат на f7","10. Checkmate on f7","10. f7 xanəsində mat"],
      ["Мат — шах без законного способа защиты. После неосторожного Nf6 белый ферзь может взять f7 под защитой слона c4.","Checkmate is check with no legal escape. After Black's careless Nf6, White's queen can capture f7 while supported by the bishop on c4.","Mat — müdafiəsi olmayan şahdır. Qaraların ehtiyatsız Nf6 gedişindən sonra ağ vəzir c4 filinin müdafiəsi ilə f7-ni ala bilər."],
      {pre:["e4","e5","Bc4","Nc6","Qh5","Nf6"]},[S("Qxf7#","Найдите мат в один ход.","Find mate in one move.","Bir gedişdə mat tapın.")],"mate"),
    L("fork","tactics",
      ["11. Вилка конём","11. Knight fork","11. At çəngəli"],
      ["Конь может одновременно атаковать несколько фигур. На c7 он даёт шах королю e8 и нападает на ладью a8.","A knight can attack two pieces at once. From c7 it checks the king on e8 and attacks the rook on a8.","At eyni anda bir neçə fiqura hücum edə bilər. c7-dən e8 şahına şah verir və a8 topuna hücum edir."],
      {fen:"r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1"},[S("Nc7+","Найдите шах с двойным нападением.","Find the checking move that attacks two pieces.","İki fiqura hücum edən şah gedişini tapın.")],"fork"),
    L("pin","tactics",
      ["12. Абсолютная связка","12. Absolute pin","12. Mütləq bağlama"],
      ["Слон на b5 атакует коня c6 по линии к королю e8. Конь не сможет легально уйти, если откроет шах своему королю.","A bishop on b5 attacks the c6 knight along the diagonal to king e8. The knight cannot legally move away and expose its king to check.","b5-dəki fil c6 atına e8 şahına gedən diaqonal üzrə hücum edir. At şahına hücum açacağı üçün uzaqlaşa bilməz."],
      {fen:"4k3/8/2n5/8/8/8/8/4KB2 w - - 0 1"},[S("Bb5","Создайте абсолютную связку слоном.","Create an absolute bishop pin.","Fillə mütləq bağlama yaradın.")],"pin"),
    L("skewer","tactics",
      ["13. Линейный удар: сквозная атака","13. Skewer: king in front of queen","13. Şahın arxasında vəzirə hücum"],
      ["Ладья с a6 приходит на g6 и шахует короля g7; за королём по линии стоит ферзь g8. Ладья защищена королём f5.","A rook on a6 checks the king on g7 from g6; the queen sits behind the king on g8. White's king on f5 protects the rook.","a6 topu g6-dan g7 şahına şah verir; g8-də şahın arxasında vəzir dayanır. f5-dəki ağ şah topu qoruyur."],
      {fen:"6q1/6k1/R7/5K2/8/8/8/8 w - - 0 1"},[S("Rg6+","Проведите ладью на линию король–ферзь.","Place the rook on the king–queen line.","Topu şah–vəzir xəttinə gətirin.")],"skewer"),
    L("discovery","tactics",
      ["14. Вскрытый шах","14. Discovered check","14. Açılmış şah"],
      ["Слон e2 перекрывает ладью e1. Когда слон уйдёт с вертикали e, ладья даст шах королю e8.","The bishop on e2 blocks the rook on e1. Moving the bishop off the e-file uncovers a rook check on the king at e8.","e2 fili e1 topunun yolunu bağlayır. Fil e-şaqulisindən çıxanda top e8 şahına şah verir."],
      {fen:"4k3/8/8/8/8/8/4B3/4R1K1 w - - 0 1"},[S("Bc4+","Уведите слона на c4, открыв линию ладье.","Move the bishop to c4, revealing the rook's line.","Fili c4-ə aparıb topun xəttini açın.")],"discovery"),
    L("pawnfork","tactics",
      ["15. Пешечная вилка","15. Pawn fork","15. Piyada çəngəli"],
      ["Пешка с e4 идёт на e5 и атакует сразу две фигуры: ладью d6 и коня f6. Учитесь замечать дешёвые угрозы дорогим фигурам.","From e4 a pawn advances to e5, attacking both the rook on d6 and knight on f6. A pawn can threaten more valuable pieces.","e4 piyadası e5-ə gedərək d6 topuna və f6 atına hücum edir. Piyada daha qiymətli fiqurları hədələyə bilər."],
      {fen:"4k3/8/3r1n2/8/4P3/8/8/4K3 w - - 0 1"},[S("e5","Поставьте пешку в вилку.","Create a pawn fork.","Piyada çəngəli yaradın.")],"pawnfork"),
    L("backrank","tactics",
      ["16. Мат по последней горизонтали","16. Back-rank mate","16. Son üfüqi xətdə mat"],
      ["Король g8 заперт своими пешками f7–h7. Ладья с e1 может пройти на e8 и перекрыть всю восьмую горизонталь.","The king on g8 is trapped behind its f7–h7 pawns. Moving the rook to e8 covers the back rank and delivers mate.","g8 şahı f7–h7 piyadalarının arxasında qalıb. e8-ə gələn top son üfüqi xətti nəzarətə götürərək mat edir."],
      {fen:"6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1"},[S("Re8#","Найдите мат ладьёй.","Find the back-rank rook mate.","Topla son xətt matını tapın.")],"mate"),
    L("winrook","tactics",
      ["17. Бесплатная фигура? Сначала проверьте","17. Capture an undefended rook","17. Müdafiəsiz topu alın"],
      ["Ферзь d2 может взять ладью d4. Проверяйте взятие на легальность и ответ соперника; не всякая «бесплатная» фигура действительно безопасна.","The queen on d2 can capture the rook on d4. Always check legality and the opponent's reply: not every loose piece is truly safe to take.","d2 vəziri d4 topunu ala bilər. Həmişə qanuniliyi və rəqibin cavabını yoxlayın: hər müdafiəsiz fiqur həmişə təhlükəsiz alınmır."],
      {fen:"4k3/8/8/8/3r4/8/3Q4/4K3 w - - 0 1"},[S("Qxd4","Возьмите незащищённую ладью.","Capture the unprotected rook.","Müdafiəsiz topu alın.")],"capture"),
    // OPENINGS: guided *multi-step* variations with scripted opponent replies, for both colors.
    L("italian","openings",
      ["18. Итальянская партия (белые)","18. Italian Game (White)","18. İtalyan oyunu (ağlar)"],
      ["Три принципа: бороться за центр, развивать коня и вывести слона на активную диагональ. Ходы соперника заранее заданы для обучения.","Three principles: claim the centre, develop a knight, and aim your bishop at an active diagonal. Opponent replies are scripted for practice.","Üç prinsip: mərkəzi tutmaq, atı inkişaf etdirmək və fili fəal diaqonala çıxarmaq. Rəqibin cavabları məşq üçün əvvəlcədən təyin olunub."],
      {},[
        S("e4","Начните с центральной пешки e.","Open with the central e-pawn.","Mərkəzi e-piyadası ilə başlayın.","e5"),
        S("Nf3","Развивайте коня и давите на e5.","Develop the knight and pressure e5.","Atı inkişaf etdirin və e5-ə təzyiq göstərin.","Nc6"),
        S("Bc4","Выведите слона к полю f7.","Develop the bishop toward f7.","Fili f7 xanəsinə yönəldin.")
      ],"opening"),
    L("spanish","openings",
      ["19. Испанская партия (белые)","19. Ruy Lopez (White)","19. İspan oyunu (ağlar)"],
      ["После e4, Nf3 белый слон идёт на b5 и оказывает давление на защитника пешки e5 — коня c6. Не путайте давление со связкой на короля в исходной расстановке.","After e4 and Nf3, the bishop goes to b5 to pressure the c6 knight defending e5. This is not an absolute pin to the king in the starting setup.","e4 və Nf3-dən sonra fil b5-ə gedərək e5-i qoruyan c6 atına təzyiq edir. İlkin mövqedə bu, şaha mütləq bağlama deyil."],
      {},[
        S("e4","Займите центр пешкой e.","Claim the centre with e4.","e4 ilə mərkəzi tutun.","e5"),
        S("Nf3","Выведите коня и атакуйте e5.","Develop the knight and attack e5.","Atı inkişaf etdirib e5-ə hücum edin.","Nc6"),
        S("Bb5","Создайте давление на коня c6.","Pressure the knight on c6.","c6 atına təzyiq göstərin.")
      ],"opening"),
    L("queens","openings",
      ["20. Ферзевый гамбит (белые)","20. Queen's Gambit (White)","20. Vəzir qambiti (ağlar)"],
      ["После d4 и ...d5 ход c4 атакует центр чёрных. Белые предлагают пешку ради центральной активности, а не пытаются гарантированно выиграть материал.","After d4 and ...d5, c4 challenges Black's centre. White offers a pawn for central play, not an immediate guaranteed material win.","d4 və ...d5-dən sonra c4 qaraların mərkəzinə təzyiq edir. Ağlar mərkəzdə fəallıq üçün piyada təklif edir; bu, dərhal material qazanmağa zəmanət vermir."],
      {},[
        S("d4","Начните с ферзевой пешки.","Start with the queen's pawn.","Vəzir piyadası ilə başlayın.","d5"),
        S("c4","Предложите гамбит пешкой c.","Offer the c-pawn gambit.","c-piyadası ilə qambit təklif edin.","e6"),
        S("Nc3","Развивайте коня, усиливая d5.","Develop the knight, increasing central pressure.","Atı inkişaf etdirərək mərkəzə təzyiqi artırın.")
      ],"opening"),
    L("london","openings",
      ["21. Лондонская система (белые)","21. London System (White)","21. London sistemi (ağlar)"],
      ["Лондонская система часто строится вокруг d4, Bf4 и e3. Это один учебный порядок ходов, а не обязательная схема против любой защиты.","The London System often begins d4, Bf4 and e3. This is one guided move order, not a compulsory response to every defence.","London sistemi çox vaxt d4, Bf4 və e3 üzərində qurulur. Bu, hər müdafiəyə qarşı məcburi deyil, öyrədici gediş ardıcıllığıdır."],
      {},[
        S("d4","Займите центр пешкой d.","Claim the centre with d4.","d4 ilə mərkəzi tutun.","d5"),
        S("Bf4","Выведите слона до закрытия цепи e3.","Develop the bishop before e3 closes its diagonal.","e3-dən öncə fili inkişaf etdirin.","Nf6"),
        S("e3","Поддержите пешку d4.","Support your d4 pawn.","d4 piyadasını dəstəkləyin.")
      ],"opening"),
    L("sicilian","openings",
      ["22. Сицилианская защита (чёрные)","22. Sicilian Defence (Black)","22. Siciliya müdafiəsi (qaralar)"],
      ["Против 1.e4 чёрные отвечают ...c5, создавая асимметрию и давление на d4. Отработайте три практических хода чёрными.","Against 1.e4, ...c5 creates an asymmetric pawn structure and pressure on d4. Practise three Black moves.","1.e4-ə qarşı ...c5 asimmetrik piyada quruluşu və d4-ə təzyiq yaradır. Qaralarla üç gedişi məşq edin."],
      {pre:["e4"]},[
        S("c5","Ответьте ...c5 против пешки e4.","Counter e4 with ...c5.","e4-ə ...c5 ilə cavab verin.","Nf3"),
        S("d6","Поддержите центр и подготовьте развитие.","Support the centre and prepare development.","Mərkəzi dəstəkləyib inkişafı hazırlayın.","d4"),
        S("cxd4","Возьмите пешку d4 пешкой c.","Capture on d4 with the c-pawn.","c-piyadası ilə d4-ü alın.")
      ],"opening"),
    L("kingsIndian","openings",
      ["23. Староиндийская защита (чёрные)","23. King's Indian Defence (Black)","23. Köhnə Hind müdafiəsi (qaralar)"],
      ["Чёрные допускают центр белых, развивают коня на f6 и фианкеттируют слона на g7. Это учебная схема против d4/c4.","Black allows White a broad centre, develops the knight to f6 and fianchettoes the bishop on g7. This is a training structure against d4/c4.","Qaralar ağların geniş mərkəzinə imkan verir, atı f6-ya çıxarır və fili g7-də fiançetto edir. Bu, d4/c4-ə qarşı öyrədici quruluşdur."],
      {pre:["d4"]},[
        S("Nf6","Развивайте королевского коня.","Develop your kingside knight.","Şah cinahı atını inkişaf etdirin.","c4"),
        S("g6","Подготовьте фианкетто слона.","Prepare to fianchetto the bishop.","Filin fiançettosunu hazırlayın.","Nc3"),
        S("Bg7","Разместите слона на длинной диагонали.","Place the bishop on the long diagonal.","Fili uzun diaqonala çıxarın.")
      ],"opening"),
    L("french","openings",
      ["24. Французская защита (чёрные)","24. French Defence (Black)","24. Fransız müdafiəsi (qaralar)"],
      ["Ответ ...e6 на 1.e4 готовит ...d5. Чёрные спорят с центром пешками, а затем развивают коня.","Reply ...e6 to 1.e4, preparing ...d5. Black challenges the pawn centre and then develops a knight.","1.e4-ə ...e6 cavabı ...d5-i hazırlayır. Qaralar mərkəzə piyadalarla təzyiq edir, sonra atı inkişaf etdirir."],
      {pre:["e4"]},[
        S("e6","Подготовьте продвижение d-пешки.","Prepare the central ...d5 pawn advance.","...d5-i hazırlayın.","d4"),
        S("d5","Атакуйте центральную пешку e4.","Challenge White's e4 pawn.","Ağların e4 piyadasına təzyiq edin.","Nc3"),
        S("Nf6","Развивайте коня и усиливайте давление.","Develop the knight and add pressure.","Atı inkişaf etdirib təzyiqi artırın.")
      ],"opening"),
    L("caro","openings",
      ["25. Защита Каро–Канн (чёрные)","25. Caro–Kann Defence (Black)","25. Karo–Kann müdafiəsi (qaralar)"],
      ["Ходы ...c6 и ...d5 формируют устойчивый пешечный центр. В этом упражнении чёрные затем берут пешку e4.","Moves ...c6 and ...d5 set up a sturdy central structure. In this drill Black then captures the e4 pawn.","...c6 və ...d5 möhkəm mərkəz qurur. Bu məşqdə qaralar daha sonra e4 piyadasını alır."],
      {pre:["e4"]},[
        S("c6","Поддержите будущий ход ...d5.","Support the planned ...d5.","Gələcək ...d5-i dəstəkləyin.","d4"),
        S("d5","Оспорьте центр пешкой d.","Challenge the centre with ...d5.","...d5 ilə mərkəzə təzyiq edin.","Nc3"),
        S("dxe4","Возьмите пешку e4 пешкой d.","Capture e4 with the d-pawn.","d-piyadası ilə e4-ü alın.")
      ],"opening"),
    // ENDGAMES: core king, pawn, rook, queen and underpromotion practice.
    L("end-queenmate","endgames",
      ["26. Мат ферзём и королём","26. Queen-and-king checkmate","26. Şah və vəzirlə mat"],
      ["Белый король f7 забирает поле g8, а ферзь может закрыть вертикаль h. Сочетайте фигуры: один ферзь не всегда справится без короля.","White's king controls g8; the queen can close the h-file. Coordinate king and queen to force mate.","Ağ şah g8-i nəzarətdə saxlayır, vəzir isə h-şaqulisini bağlayır. Mat üçün şah və vəzirin əməkdaşlığından istifadə edin."],
      {fen:"7k/5K2/8/6Q1/8/8/8/8 w - - 0 1"},[S("Qh5#","Найдите мат ферзём в один ход.","Find the queen mate in one.","Vəzirlə bir gedişdə mat tapın.")],"mate"),
    L("end-rookmate","endgames",
      ["27. Мат ладьёй","27. Rook mate","27. Topla mat"],
      ["Белый король f7 закрывает g8, а ладья a1 может занять вертикаль h. Вместе король и ладья создают матовую сеть.","White's king on f7 covers g8; the rook from a1 can control the h-file. The king and rook cooperate to deliver mate.","f7-dəki ağ şah g8-i nəzarətdə saxlayır; a1 topu h-şaqulisini tuta bilər. Şah və top birlikdə mat yaradır."],
      {fen:"7k/5K2/8/8/8/8/8/R7 w - - 0 1"},[S("Rh1#","Закройте вертикаль h ладьёй и поставьте мат.","Control the h-file with the rook and deliver mate.","Topla h-şaqulisini tutub mat edin.")],"mate"),
    L("end-opposition","endgames",
      ["28. Оппозиция королей","28. King opposition","28. Şahların oppozisiyası"],
      ["Когда короли стоят на одной вертикали через одно поле, сторона, которой ходить, часто должна уступить. Здесь белые могут занять оппозицию ходом Ke4.","When kings face each other with one square between, the side to move often yields ground. White can take the opposition with Ke4.","Şahlar aralarında bir xana olmaqla üz-üzə dayananda gediş edən tərəf çox vaxt geri çəkilməlidir. Ağlar Ke4 ilə oppozisiyanı tuta bilər."],
      {fen:"8/8/4k3/8/8/4K3/8/8 w - - 0 1"},[S("Ke4","Встаньте королём напротив чёрного с одной пустой клеткой между ними.","Face the black king with one empty square between.","Arada bir boş xana saxlayaraq şahınızı rəqib şahın qarşısına gətirin.")],"opposition"),
    L("end-underpromotion","endgames",
      ["29. Превращение не только в ферзя","29. Underpromotion to a knight","29. Piyadanın ata çevrilməsi"],
      ["Пешку можно превратить и в коня, ладью или слона. Здесь специально выберите коня — это знакомство с правилом, не утверждение, что конь сильнее ферзя.","You may promote to a knight, rook or bishop, not only a queen. Choose a knight for this drill; it does not claim a knight is stronger than a queen.","Piyadanı təkcə vəzirə deyil, ata, topa və ya filə də çevirmək olar. Qaydanı öyrənmək üçün burada atı seçin; atın vəzirdən güclü olması nəzərdə tutulmur."],
      {fen:"8/P7/8/8/8/8/7k/2K5 w - - 0 1"},[S("a8=N","Доведите пешку a7 до a8 и нажмите значок коня.","Move a7 to a8 and select the knight icon.","a7 piyadasını a8-ə çatdırıb at işarəsini seçin.")],"underpromotion"),
    L("end-rookbehind","endgames",
      ["30. Ладья позади проходной пешки","30. Rook behind a passed pawn","30. Topu keçər piyadanın arxasına qoyun"],
      ["Ладья позади своей проходной пешки обычно поддерживает её дальнейшее продвижение. Здесь ладья h1 может занять a1.","A rook behind its own passed pawn often supports the pawn's advance. From h1 the rook can move to a1.","Öz keçər piyadasının arxasındakı top onun irəliləməsini dəstəkləyə bilər. h1 topunu a1-ə keçirin."],
      {fen:"6k1/8/P7/8/8/8/4K3/7R w - - 0 1"},[S("Ra1","Поставьте ладью под пешку a6.","Place your rook behind the a6 pawn.","Topu a6 piyadasının arxasına qoyun.")],"rook"),
    L("end-king","endgames",
      ["31. Король активен в окончании","31. Activate the king in an endgame","31. Endşpildə şahı fəallaşdırın"],
      ["Когда ферзей и большинства фигур нет, король становится активной фигурой. Подведите его к собственной пешке c4.","With queens and most pieces gone, the king can safely become active. Bring it toward your pawn on c4.","Vəzirlər və fiqurların çoxu dəyişiləndə şah fəallaşa bilər. Onu c4 piyadasına yaxınlaşdırın."],
      {fen:"6k1/8/8/8/2P5/8/4K3/8 w - - 0 1"},[S("Kd3","Приблизьте короля e2 к пешке c4.","Bring your king from e2 closer to c4.","e2 şahını c4 piyadasına yaxınlaşdırın.")],"king"),
    L("end-race","endgames",
      ["32. Проходная пешка и правило квадрата","32. Passed pawn and the square rule","32. Keçər piyada və kvadrat qaydası"],
      ["Чёрный король на f5 далеко от пешки a5. Продвиньте её на a6. Правило квадрата помогает оценить, успеет ли вражеский король догнать пешку, если ничто другое не мешает.","Black's king on f5 is far from the pawn on a5. Push to a6. The square rule helps estimate whether the enemy king can catch an unopposed pawn.","Qara şah f5-də a5 piyadasından uzaqdır. a6-ya irəliləyin. Kvadrat qaydası rəqib şahın maneəsiz piyadaya çatıb-çatmayacağını qiymətləndirməyə kömək edir."],
      {fen:"8/8/8/P4k2/8/8/4K3/8 w - - 0 1"},[S("a6","Продвиньте проходную пешку.","Advance the passed pawn.","Keçər piyadanı irəli aparın.")],"pawn"),
    L("end-escort","endgames",
      ["33. Сопровождаем проходную пешку","33. Escort a passed pawn","33. Keçər piyadanı müşayiət edin"],
      ["Пешка c5 свободна от вражеских пешек на соседних вертикалях. Продвижение c6 приближает её к последней горизонтали; проверяйте активность королей.","The pawn on c5 has no enemy pawns ahead on neighbouring files. c6 advances its promotion prospects; always watch king activity.","c5 piyadasının qarşısında qonşu şaqulilərdə düşmən piyadası yoxdur. c6 çevrilməyə yaxınlaşdırır; şahların fəallığını da yoxlayın."],
      {fen:"6k1/8/8/2P5/8/8/4K3/8 w - - 0 1"},[S("c6","Продвиньте пешку c5 на c6.","Advance the pawn from c5 to c6.","c5 piyadasını c6-ya aparın.")],"pawn")
  ]);
  const byId=Object.freeze(Object.fromEntries(lessons.map(x=>[x.id,x])));
  function createPosition(task,Chess){
    const board=task.setup.fen?new Chess(task.setup.fen):new Chess();
    for(const san of task.setup.pre||[]){
      if(!board.move(san))throw new Error("Academy "+task.id+" has invalid setup SAN: "+san);
    }
    return board;
  }
  function validate(Chess){
    if(typeof Chess!=="function")throw new Error("chess.js missing");
    const errors=[],counts={};
    if(new Set(lessons.map(l=>l.id)).size!==lessons.length)errors.push("duplicate lesson id");
    for(const track of tracks)counts[track.id]=0;
    for(const task of lessons){
      counts[task.track]=(counts[task.track]||0)+1;
      if(!tracks.some(t=>t.id===task.track))errors.push(task.id+": unknown track");
      if(!task.steps.length)errors.push(task.id+": no steps");
      for(const lang of langs){
        if(!task.title[lang]||!task.intro[lang]||!task.steps.every(step=>step.prompt[lang]))errors.push(task.id+": missing "+lang);
      }
      try{
        const board=createPosition(task,Chess);
        for(let index=0;index<task.steps.length;index++){
          const step=task.steps[index],found=board.moves({verbose:true}).find(m=>m.san===step.san);
          if(!found)throw new Error("illegal step "+index+" "+step.san);
          const moved=board.move(step.san);
          if(!moved)throw new Error("failed "+step.san);
          if(index===task.steps.length-1){
            if(task.goal==="mate"&&!board.in_checkmate())throw new Error("goal is not checkmate");
            if(task.goal==="check"&&!board.in_check())throw new Error("goal is not check");
            if(task.goal==="castle"&&!/[kq]/.test(moved.flags))throw new Error("missing castling flag");
            if(task.goal==="enpassant"&&!moved.flags.includes("e"))throw new Error("missing en passant flag");
            if(task.goal==="promotion"&&moved.promotion!=="q")throw new Error("queen promotion mismatch");
            if(task.goal==="underpromotion"&&moved.promotion!=="n")throw new Error("underpromotion mismatch");
            if(task.goal==="capture"&&!moved.captured)throw new Error("capture goal mismatch");
          }
          if(step.reply&&!board.move(step.reply))throw new Error("illegal reply "+index+" "+step.reply);
        }
      }catch(err){errors.push(task.id+": "+err.message);}
    }
    for(const track of tracks)if(!counts[track.id])errors.push("empty "+track.id);
    return Object.freeze({ok:errors.length===0,total:lessons.length,counts,errors});
  }
  return Object.freeze({langs,tracks,lessons,byId,createPosition,validate,version:"B4-1"});
});