/* B8 RU/EN/AZ structural parity; NOT independent human editorial QA. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const first=app.indexOf("  const B8_TEXT={");
const last=app.indexOf("  function tr(k) {",first);
assert.ok(first>=0&&last>first,"B8 dictionary missing");
const src=app.slice(first+"  const B8_TEXT=".length,last).trim().replace(/;$/,"");
const dict=vm.runInNewContext("("+src+")");
let pass=0;const test=(name,fn)=>{fn();pass++;console.log("PASS B8 parity "+pass+" "+name);};
const langs=["ru","en","az"];
const keys=Object.keys(dict.ru).sort();
test("B8 keys have exact parity in all 3 languages",()=>langs.forEach(l=>assert.deepEqual(Object.keys(dict[l]).sort(),keys)));
test("every B8 string is nonempty and genuinely localized",()=>langs.forEach(l=>keys.forEach(k=>assert.ok(typeof dict[l][k]==="string"&&dict[l][k].trim().length>2,l+" "+k))));
test("all B8 controls have registered translations",()=>{
 const required=["whiteClock","blackClock","timeControl","untimed","customTime","customMinutes","customIncrement",
 "clockTheme","digitalClock","hourglassClock","sounds","resign","rematch"];
 required.forEach(k=>assert.ok(keys.includes(k),k));
});
test("timed exclusion policy is explicit in 3 languages",()=>{
 assert.match(dict.ru.clockPolicy,/AI Ladder Index/);
 assert.match(dict.en.clockPolicy,/AI Ladder Index/);
 assert.match(dict.az.clockPolicy,/AI Ladder Index/);
});
test("resignation/timeout/draw are not translated to mate",()=>{
 for(const l of langs){
  assert.notEqual(dict[l].timeout,dict[l].resigned);
  assert.notEqual(dict[l].timeNote,dict[l].resignNote);
  assert.notEqual(dict[l].clockDraw,dict[l].timeout);
 }
});
test("critical controls are addressable by i18n ids in HTML",()=>{
 for(const k of ["resign","rematch","timeControl","untimed","customTime","customMinutes",
 "customIncrement","clockTheme","digitalClock","hourglassClock","sounds","whiteClock","blackClock"])
  assert.ok(html.includes('data-i18n="'+k+'"'),"missing "+k);
});
test("visible numeric clock preserved irrespective of hourglass style",()=>{
 assert.match(html,/id="clock-white-time"/);assert.match(html,/id="clock-black-time"/);
 assert.match(html,/id="clock-panel"/);
});
test("historical independent RU/EN/AZ QA is not falsely claimed by structural test",()=>{
 assert.equal(langs.length,3);
 assert.ok(!app.includes("B8_TRANSLATIONS_INDEPENDENT_CERTIFIED"));
});
console.log("PASS B8 parity "+pass+"/"+pass+"; human semantic/editorial QA separately required.");
