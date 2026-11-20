/* Deterministic synthetic DOM smoke, Node 22, zero npm deps. Not a browser E2E. */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const {Chess}=require("../vendor/chess.js");
const Coach=require("../coach-engine.js");
const script=fs.readFileSync(path.join(__dirname,"../app.js"),"utf8");
class Element {
 constructor(id){
   this.id=id;this.listeners={};this.children=[];this.attrs={};this.textContent="";
   this.value="";this.checked=false;this.hidden=false;this.dataset={};
   this.options=Array.from({length:4},()=>({textContent:""}));
   this.flags=new Set();this.classList={add:(v)=>this.flags.add(v)};
 }
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,f){this.listeners[k]=f;}
 appendChild(x){this.children.push(x);}
 replaceChildren(x){this.children=[...x.children];}
}
const elements={};
function el(k){return elements[k]||(elements[k]=new Element(k));}
el("side").value="w";el("level").value="beginner";el("lang").value="ru";
const document={readyState:"complete",documentElement:{lang:"ru"},getElementById:el,createElement:(tag)=>new Element(tag),createDocumentFragment:()=>new Element("fragment"),querySelectorAll:()=>[]};
const storage=new Map();
const localStorage={getItem:(k)=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const timers=[];
const setTimeout=(f)=>{timers.push(f);return timers.length;};
const clearTimeout=()=>{};
const window={ChessCoachEngine:Coach};
vm.runInNewContext(script,{Chess,document,localStorage,window,setTimeout,clearTimeout,console},{timeout:5000});
function square(s){return el("board").children.find(x=>(x.attrs["aria-label"]||"").startsWith(s+" "));}
let pass=0;
function check(name,fn){fn();pass++;console.log("PASS "+name);}
check("64 squares, 32 pieces",()=>{assert.equal(el("board").children.length,64);assert.equal(el("board").children.filter(x=>x.children.some(y=>y.className==="piece" && Boolean(y.textContent))).length,32);});
check("legal e2 selection",()=>{square("e2").listeners.click();assert.equal(el("board").children.filter(x=>x.flags.has("legal")).length,2);});
check("B2 hint displays 3 legal lines with opponent responses",()=>{
 el("hint").listeners.click();
 assert.equal(el("coach-variations").hidden,false);
 assert.equal(el("coach-variations").children.length,3);
 assert.ok(el("coach-variations").children.every(x=>x.children.some(y=>y.textContent.includes("Nc6")||y.textContent.includes("ответ"))));
});
check("player move persisted",()=>{square("e4").listeners.click();assert.match(JSON.parse(storage.get("chess-odyssey-v01")).pgn,/e4/);});
check("B2 grades own move and stores review",()=>{
 const data=JSON.parse(storage.get("chess-odyssey-v01"));
 assert.equal(data.notes.length,1);
 assert.equal(data.notes[0].san,"e4");
 assert.ok(data.notes[0].best);
 el("review-button").listeners.click();
 assert.equal(el("coach-review").hidden,false);
 assert.ok(el("review-list").children.length>=3);
});
check("AI responds with a legal move",()=>{assert.ok(timers.length);timers[timers.length-1]();const pgn=JSON.parse(storage.get("chess-odyssey-v01")).pgn;assert.match(pgn,/1\. e4 [a-zA-Z]/);});
check("undo returns to initial board and clears B2 review",()=>{
 el("undo").listeners.click();assert.equal(el("moves").textContent,"—");
 assert.equal(JSON.parse(storage.get("chess-odyssey-v01")).notes.length,0);
});
check("lesson and no loss of parked game",()=>{
 el("lesson").value="pawn";el("lesson").listeners.change();
 square("e2").listeners.click();square("e4").listeners.click();
 assert.equal(el("completed").textContent,"1/3");
 assert.equal(el("resume-game").hidden,false);
 el("resume-game").listeners.click();
 assert.equal(el("moves").textContent,"—");
});
check("language and local achievement",()=>{
 el("lang").value="az";el("lang").listeners.change();
 assert.equal(document.documentElement.lang,"az");
 assert.deepEqual(JSON.parse(storage.get("chess-odyssey-v01")).completed,["pawn"]);
});
console.log("PASS synthetic DOM "+pass+" / "+pass);
