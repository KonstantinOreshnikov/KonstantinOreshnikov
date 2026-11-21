/* B2 postgame end-state smoke: real chess.js board + synthetic DOM */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {Chess}=require("../vendor/chess.js");
const Coach=require("../coach-engine.js");
const Engine=require("../engine-bridge.js");
const Academy=require("../academy.js");
const app=fs.readFileSync(path.join(__dirname,"../app.js"),"utf8");
const prefix=["e4","e5","Bc4","Nc6","Qh5","Nf6"];
class TacticalChess extends Chess{
 constructor(fen){
   super(fen);
   if(!fen)for(const san of prefix)assert.ok(this.move(san));
 }
}
class Element{
 constructor(id){
  this.id=id;this.children=[];this.listeners={};this.attrs={};this.textContent="";this.className="";
  this.value="";this.hidden=false;this.checked=false;this.dataset={};this.options=Array.from({length:4},()=>({textContent:""}));
  this.set=new Set();this.classList={add:(name)=>this.set.add(name)};
 }
 setAttribute(k,v){this.attrs[k]=v;}addEventListener(name,fn){this.listeners[name]=fn;}
 appendChild(x){this.children.push(x);}replaceChildren(x){this.children=x?(x.id==="fragment"?[...x.children]:[x]):[];}
}
const storage=new Map();
const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
function mount(){
 const elements={};const el=k=>elements[k]||(elements[k]=new Element(k));
 el("side").value="w";el("level").value="beginner";el("lang").value="ru";
 el("lesson").options=Array.from({length:Academy.lessons.length+1},()=>({textContent:"",hidden:false,disabled:false}));
 const document={readyState:"complete",documentElement:{lang:"ru"},getElementById:el,
  createElement:tag=>new Element(tag),createDocumentFragment:()=>new Element("fragment"),querySelectorAll:()=>[]};
 const window={ChessCoachEngine:Coach,ChessEngineBridge:Engine,ChessAcademy:Academy};
 const timers=[],setTimeout=fn=>{timers.push(fn);return timers.length;};
 vm.runInNewContext(app,{Chess:TacticalChess,window,document,localStorage,setTimeout,clearTimeout:()=>{},console},{timeout:5000});
 return {el,square:s=>el("board").children.find(x=>(x.attrs["aria-label"]||"").startsWith(s+" "))};
}
let count=0;function test(label,fn){fn();count++;console.log("PASS "+label);}
const ui=mount();
test("one-move tactical mate starts as a legal position",()=>{
 assert.equal(ui.el("board").children.length,64);
 assert.ok(ui.square("h5"));
 assert.match(ui.el("game-status").textContent,/Ваш ход/);
});
ui.square("h5").listeners.click();
ui.square("f7").listeners.click();
test("checkmate results in a win and automatic three-item review",()=>{
 assert.match(ui.el("game-status").textContent,/Мат/);
 assert.equal(ui.el("record").textContent,"1 / 0 / 0");
 assert.equal(ui.el("coach-review").hidden,false);
 assert.ok(ui.el("review-list").children.length>=3);
});
test("PGN and note are persisted",()=>{
 const d=JSON.parse(storage.get("chess-odyssey-v01"));
 assert.match(d.pgn,/Qxf7#/);
 assert.equal(d.notes.length,1);
 assert.equal(d.notes[0].san,"Qxf7#");
 assert.equal(d.finalized,true);
});
const restored=mount();
test("reload restores terminal result and review without double-counting",()=>{
 assert.equal(restored.el("record").textContent,"1 / 0 / 0");
 assert.equal(restored.el("coach-review").hidden,false);
 assert.ok(restored.el("review-list").children.length>=3);
});
restored.el("undo").listeners.click();
test("undo reverses terminal stats and removes stale note",()=>{
 assert.equal(restored.el("record").textContent,"0 / 0 / 0");
 const d=JSON.parse(storage.get("chess-odyssey-v01"));
 assert.equal(d.notes.length,0);
 assert.equal(d.finalized,false);
});
console.log("PASS B2 postgame "+count+" / "+count);
