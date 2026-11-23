/* Chess Odyssey — P1 visual customization and P0 global language; no chess-state writes. */
(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.ChessAppearance=api;})(typeof window!=="undefined"?window:this,function(){
"use strict";
const host=typeof window!=="undefined"?window:{};
const KEY="chess-odyssey-appearance-v1";
const THEMES=Object.freeze([
{id:"walnut",name:["Классическое дерево","Walnut Classic","Klassik qoz"],light:"#F0D9B5",dark:"#B58863"},
{id:"graphite",name:["Тёмный графит","Deep Graphite","Tünd qrafit"],light:"#9CAAB6",dark:"#374757"},
{id:"blue",name:["Синяя сталь","Steel Blue","Polad mavisi"],light:"#DCE8F3",dark:"#6289B1"},
{id:"green",name:["Турнирная зелёная","Tournament Green","Turnir yaşılı"],light:"#EEEED2",dark:"#769656"},
{id:"sand",name:["Песочная","Sandstone","Qum daşı"],light:"#F4E9CE",dark:"#B59E78"},
{id:"silver",name:["Серебристая","Silver Minimal","Gümüşü"],light:"#E7ECEF",dark:"#747E87"},
{id:"bordeaux",name:["Бордовая","Bordeaux","Bordo"],light:"#F1E2DC",dark:"#974A60"},
{id:"amethyst",name:["Аметистовая","Amethyst","Ametist"],light:"#E9E0F4",dark:"#8063A4"},
{id:"sea",name:["Морской бриз","Sea Breeze","Dəniz mehi"],light:"#D8E9E7",dark:"#478B90"},
{id:"contrast",name:["Высокий контраст","High Contrast","Yüksək kontrast"],light:"#FAFAF7",dark:"#38414A"}
]);
const STYLES=Object.freeze([
{id:"staunton",name:["Королевская классика","Royal Classic","Kral klassikası"],source:"chessnut"},
{id:"tournament",name:["Турнирная резьба","Tournament Carved","Turnir oyma fiqurları"],source:"totoy"},
{id:"neo",name:["Современная скульптура","Neo Sculpt","Müasir heykəl üslubu"],source:"kiwen-suwi"},
{id:"minimal",name:["Выразительный контраст","Bold Contrast","Parlaq kontrast"],source:"rhosgfx"},
{id:"outline",name:["Серебряный объём","Silver Spatial","Gümüşü həcm"],source:"spatial"},
{id:"wood",name:["Кельтское дерево","Celtic Wood","Kelt ağacı"],source:"celtic"},
{id:"marble",name:["Мрамор Люкс","Marble Luxe","Lüks mərmər"],source:"papercut"},
{id:"metal",name:["Золотая элита","Golden Elite","Qızılı Elit"],source:"fantasy"},
{id:"soft3d",name:["Кристальная фантазия","Fantasy Crystal","Kristal fantaziya"],source:"fantasy"},
{id:"highcontrast",name:["Обсидиан Pro","Obsidian Pro","Obsidian Pro"],source:"rhosgfx"}
]);
const WORDS={
ru:{appearance:"Оформление доски",boardTheme:"Тема доски",pieces:"Набор фигур",wide:"Широкая доска",exitWide:"Выйти из широкого режима",language:"Язык",selected:"Выбрано"},
en:{appearance:"Board appearance",boardTheme:"Board theme",pieces:"Piece set",wide:"Wide board",exitWide:"Exit wide view",language:"Language",selected:"Selected"},
az:{appearance:"Taxtanın görünüşü",boardTheme:"Taxta mövzusu",pieces:"Fiqur dəsti",wide:"Geniş taxta",exitWide:"Geniş rejimdən çıx",language:"Dil",selected:"Seçilib"}
};
const langs=["ru","en","az"];
const safe=(id,items,fallback)=>items.some(x=>x.id===id)?id:fallback;
let state={theme:"walnut",pieces:"staunton",lang:"ru",wide:false},initialized=false;
function read(storage){
 try{const d=JSON.parse(storage.getItem(KEY)||"null");if(d&&typeof d==="object"){
  state.theme=safe(d.theme,THEMES,"walnut");
  state.pieces=safe(d.pieces,STYLES,"staunton");
 }}catch{/* browser settings never block play */}
}
function save(storage){try{storage.setItem(KEY,JSON.stringify({theme:state.theme,pieces:state.pieces}));}catch{}}
const name=(item)=>item.name[langs.indexOf(state.lang)]||item.name[0];
function apply(doc){
 const t=THEMES.find(x=>x.id===state.theme)||THEMES[0];
 for(const board of doc.querySelectorAll("#board,#m-board")){
   board.style.setProperty("--board-light",t.light);
   board.style.setProperty("--board-dark",t.dark);
   board.dataset.theme=t.id;board.dataset.pieces=state.pieces;
   board.style.setProperty("--piece-white",state.theme==="contrast"?"#FFFFFF":"#FDF8E9");
   board.style.setProperty("--piece-black",state.theme==="contrast"?"#111827":"#14232E");
 }
}
function option(doc,item,kind,details){
 const button=doc.createElement("button");button.type="button";button.className="appearance-option";button.dataset.option=kind;button.dataset.value=item.id;
 button.setAttribute("aria-pressed",String((kind==="theme"?state.theme:state.pieces)===item.id));
 const preview=doc.createElement("span");preview.className="appearance-preview";preview.setAttribute("aria-hidden","true");
 if(kind==="theme"){
   preview.style.setProperty("--preview-light",item.light);preview.style.setProperty("--preview-dark",item.dark);
   for(let i=0;i<4;i++){const sq=doc.createElement("span");sq.className="preview-cell "+(i===0||i===3?"light":"dark");preview.appendChild(sq);}
 }else{
   preview.classList.add("preview-pieces");preview.dataset.pieces=item.id;
   const w=doc.createElement("span"),b=doc.createElement("span");
   w.className="piece-preview white";b.className="piece-preview black";
   w.textContent="♘";b.textContent="♛";w.dataset.code="wN";b.dataset.code="bQ";preview.append(w,b);
 }
 const title=doc.createElement("span");title.textContent=name(item);
 button.append(preview,title);
 button.addEventListener("click",()=>{
   if(kind==="theme")state.theme=item.id;else state.pieces=item.id;
   apply(doc);save(host.localStorage);populate(doc);
   details.open=false;
 });
 return button;
}
function populate(doc){
 for(const kind of ["theme","pieces"]){
   const options=doc.getElementById(kind==="theme"?"theme-options":"piece-options");
   if(!options)continue;
   const collection=kind==="theme"?THEMES:STYLES;
   const details=doc.getElementById(kind==="theme"?"board-theme-details":"piece-style-details");
   const frag=doc.createDocumentFragment();
   for(const item of collection)frag.appendChild(option(doc,item,kind,details));
   options.replaceChildren(frag);
   const current=collection.find(x=>x.id===(kind==="theme"?state.theme:state.pieces));
   const value=doc.getElementById(kind==="theme"?"theme-current":"piece-current");
   if(value)value.textContent=name(current);
 }
 const phrases=WORDS[state.lang]||WORDS.ru;
 for(const e of doc.querySelectorAll("[data-appearance]"))e.textContent=phrases[e.dataset.appearance]||e.dataset.appearance;
 const wide=doc.getElementById("wide-view");
 if(wide)wide.textContent=state.wide?phrases.exitWide:phrases.wide;
}
function setLanguage(lang,doc){
 if(!langs.includes(lang))return;
 state.lang=lang;
 const langPicker=doc?.getElementById("global-language");
 if(langPicker&&langPicker.value!==lang)langPicker.value=lang;
 if(doc)populate(doc);
}
function toggleWide(doc){
 const workspace=doc.getElementById("practice-view");
 if(!workspace)return;
 state.wide=!state.wide;
 workspace.classList.toggle("wide-board-mode",state.wide);
 if(state.wide&&typeof workspace.requestFullscreen==="function"){
   try{const p=workspace.requestFullscreen();if(p&&typeof p.catch==="function")p.catch(()=>{});}catch{}
 }else if(!state.wide&&doc.fullscreenElement&&typeof doc.exitFullscreen==="function"){
   doc.exitFullscreen().catch(()=>{});
 }
 populate(doc);
}
function init(doc,callbacks){
 if(initialized)return;initialized=true;
 read(host.localStorage);
 const source=doc.getElementById("lang");
 state.lang=source&&langs.includes(source.value)?source.value:"ru";
 apply(doc);populate(doc);setLanguage(state.lang,doc);
 const global=doc.getElementById("global-language");
 if(global)global.addEventListener("change",()=>{if(langs.includes(global.value)&&callbacks&&callbacks.languageChanged)callbacks.languageChanged(global.value);});
 const wide=doc.getElementById("wide-view");if(wide)wide.addEventListener("click",()=>toggleWide(doc));
 doc.addEventListener("fullscreenchange",()=>{
   if(!doc.fullscreenElement&&state.wide){state.wide=false;doc.getElementById("practice-view").classList.remove("wide-board-mode");populate(doc);}
 });
 const first=doc.getElementById("board-theme-details"),second=doc.getElementById("piece-style-details");
 if(first&&second){
   first.addEventListener("toggle",()=>{if(first.open)second.open=false;});
   second.addEventListener("toggle",()=>{if(second.open)first.open=false;});
   doc.addEventListener("keydown",e=>{if(e.key==="Escape"){first.open=false;second.open=false;}});
 }
}
function snapshot(){return {...state};}
return Object.freeze({THEMES,STYLES,WORDS,init,setLanguage,apply,snapshot});
});
