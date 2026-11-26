"use strict";
const WORLDS=[["mars",1,true],["mercury",2,false],["luna",3,false],["venus",4,false],["europa",4,false],["titan",4,false],["pluto",5,false],["earth",5,false]];
const MODES={beginner:{budget:1500,cost:80,upkeep:50,build:1},normal:{budget:900,cost:100,upkeep:100,build:2},expert:{budget:550,cost:120,upkeep:150,build:3}};
const SITES={ares:{lat:18,lon:226,cost:0},elysium:{lat:25,lon:147,cost:220},noachis:{lat:-35,lon:24,cost:220}};
const CATALOG={
 habitat:{cost:120,ore:12,upkeep:4,load:2,housing:100},
 solar:{cost:100,ore:8,upkeep:2,power:18},
 farm:{cost:100,ore:8,upkeep:3,load:3,food:12},
 ice:{cost:100,ore:8,upkeep:3,load:3,water:12},
 mine:{cost:120,ore:10,upkeep:4,load:4,oreYield:10},
 heat:{cost:150,ore:12,upkeep:5,load:6,effect:0},
 air:{cost:150,ore:12,upkeep:5,load:6,effect:1},
 oxygen:{cost:150,ore:12,upkeep:5,load:6,effect:2},
 hydro:{cost:150,ore:12,upkeep:5,load:6,effect:3},
 bio:{cost:150,ore:12,upkeep:5,load:6,effect:4},
 lab:{cost:100,ore:8,upkeep:3,load:3,science:3},
 cooler:{cost:150,ore:12,upkeep:5,load:6,effect:0,sign:-1,tech:"climate"},
 vent:{cost:150,ore:12,upkeep:5,load:6,effect:1,sign:-1,tech:"atmosphere"},
 scrubber:{cost:150,ore:12,upkeep:5,load:6,effect:2,sign:-1,tech:"atmosphere"},
 drain:{cost:150,ore:12,upkeep:5,load:6,effect:3,sign:-1,tech:"hydrology"},
 reserve:{cost:120,ore:10,upkeep:3,load:3,effect:4,tech:"ecology"},
 reactor:{cost:240,ore:20,upkeep:6,power:60,tech:"energy"},
 recycler:{cost:180,ore:15,upkeep:4,load:4,food:20,water:20,tech:"ecology"}};
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const copy=x=>JSON.parse(JSON.stringify(x));
const integer=(n,min=0,max=1000000000)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const building=(type,level=1,on=true)=>({type,level,on});
function newCity(site){return {site,pop:40,buildings:[building("habitat"),building("solar"),building("farm"),building("ice")],queue:[]}}
const TECH={climate:{points:12,cost:80,requires:[]},atmosphere:{points:18,cost:100,requires:["climate"]},hydrology:{points:15,cost:90,requires:["climate"]},energy:{points:20,cost:150,requires:[]},ecology:{points:24,cost:120,requires:["hydrology","atmosphere"]},resilience:{points:24,cost:150,requires:["energy","ecology"]}};
const EVENTS=["dust","equipment","breakthrough","tradeOffer"];
const AWARDS=["firstMine","firstTech","firstLife","threeCities","stableWorld"];
function initProgress(id,year=0){return {points:0,tech:[],research:null,seed:(Number(id.slice(1))%4294967295||1),event:null,nextEvent:Math.min(1000001,year+15),eventsResolved:0,stable:0,wonAt:null,awards:[],stage:"barren",recovery:false}}
function makeCampaign(id,mode="normal",world="mars"){if(!own(MODES,mode)||world!=="mars"||!/^c[0-9]+$/.test(id))throw Error("invalid campaign");return {schemaVersion:3,scenarioVersion:1,campaignId:id,worldId:world,modeId:mode,planet:start(),credits:MODES[mode].budget,ore:40,food:40,water:40,cities:[newCity("ares")],legacyControls:null,progress:initProgress(id),last:{income:0,upkeep:0,power:0,demand:0,food:0,water:0,ore:0,shortage:false}}}
function validCampaign(c){if(!c||c.schemaVersion!==3||c.scenarioVersion!==1||typeof c.campaignId!=="string"||!/^c[0-9]{1,12}$/.test(c.campaignId)||c.worldId!=="mars"||!own(MODES,c.modeId)||!valid(c.planet)||!["credits","ore","food","water"].every(k=>integer(c[k]))||!Array.isArray(c.cities)||c.cities.length<1||c.cities.length>3||!c.cities.every(city=>city&&own(SITES,city.site)&&integer(city.pop,0,10000)&&Array.isArray(city.buildings)&&city.buildings.length<=40&&city.buildings.every(x=>x&&own(CATALOG,x.type)&&integer(x.level,1,3)&&typeof x.on==="boolean")&&Array.isArray(city.queue)&&city.queue.length<=40&&city.buildings.length+city.queue.filter(x=>x.kind==="build").length<=40&&city.queue.every(x=>x&&own(CATALOG,x.type)&&integer(x.remaining,1,3)&&(x.kind==="build"&&x.index===-1||x.kind==="upgrade"&&integer(x.index,0,city.buildings.length-1)&&city.buildings[x.index].type===x.type&&city.buildings[x.index].level<3))&&new Set(city.queue.filter(x=>x.kind==="upgrade").map(x=>x.index)).size===city.queue.filter(x=>x.kind==="upgrade").length)||new Set(c.cities.map(x=>x.site)).size!==c.cities.length)return false;
return validProgress(c.progress,c.planet.year)&& (c.legacyControls===null||Array.isArray(c.legacyControls)&&c.legacyControls.length===5&&c.legacyControls.every(x=>Number.isFinite(x)&&Math.abs(x)<=1))&&c.last&&["income","upkeep","power","demand","food","water","ore"].every(k=>integer(c.last[k],-1000000000,1000000000))&&typeof c.last.shortage==="boolean"}
function migrateV1(old,id){if(!valid(old))throw Error("bad legacy");let c=makeCampaign(id,"normal");c.planet=copy(old);c.legacyControls=[...old.controls];c.planet.controls=[0,0,0,0,0];c.progress=initProgress(id,c.planet.year);return c}
function blankBook(){return {version:3,next:1,active:null,campaigns:[],manual:{}}}
function validBook(b){return !!b&&b.version===3&&integer(b.next,1,999999999999)&&Array.isArray(b.campaigns)&&b.campaigns.length<=12&&b.campaigns.every(validCampaign)&&new Set(b.campaigns.map(x=>x.campaignId)).size===b.campaigns.length&&b.campaigns.every(x=>Number(x.campaignId.slice(1))<b.next)&&(b.active===null||b.campaigns.some(x=>x.campaignId===b.active))&&b.manual&&typeof b.manual==="object"&&!Array.isArray(b.manual)&&Object.entries(b.manual).every(([k,v])=>validCampaign(v)&&v.campaignId===k&&b.campaigns.some(c=>c.campaignId===k&&c.worldId===v.worldId&&c.modeId===v.modeId))}
function addCampaign(book,mode,world,imported=null){if(!validBook(book)||book.campaigns.length>=12)throw Error("campaignLimit");let next=copy(book),id="c"+next.next++;let c=imported===null?makeCampaign(id,mode,world):valid(imported)?migrateV1(imported,id):validV2(imported)?migrateV2(imported,id):validCampaign(imported)?{...copy(imported),campaignId:id}:null;if(!c)throw Error("badSave");next.campaigns.push(c);next.active=id;return next}
function selectCampaign(book,id){if(!book.campaigns.some(c=>c.campaignId===id))throw Error("badSave");return {...book,active:id}}
const activeCampaign=b=>b.campaigns.find(c=>c.campaignId===b.active);
function replaceCampaign(b,c){if(!validCampaign(c)||c.campaignId!==b.active)throw Error("badSave");return {...b,campaigns:b.campaigns.map(x=>x.campaignId===c.campaignId?c:x)}}
function manualSave(b){let c=activeCampaign(b);if(!c)return b;return {...b,manual:{...b.manual,[c.campaignId]:copy(c)}}}
function manualLoad(b){let c=b.manual[b.active];if(!c)throw Error("noManual");return replaceCampaign(b,copy(c))}
function quote(c,type,level=1){if(!own(CATALOG,type)||!integer(level,1,3))throw Error("badBuild");let d=CATALOG[type];return {credits:Math.ceil(d.cost*level*MODES[c.modeId].cost/100),ore:d.ore*level,years:MODES[c.modeId].build}}
function order(c,site,type,index=-1){if(!validCampaign(c))throw Error("badSave");let n=copy(c),city=n.cities.find(x=>x.site===site);if(!city||!own(CATALOG,type)||city.queue.length>=40)throw Error("badBuild");let old=index===-1?null:city.buildings[index];if(CATALOG[type].tech&&!n.progress.tech.includes(CATALOG[type].tech))throw Error("lockedTech");if(index!==-1&&(!old||old.type!==type||old.level>=3||city.queue.some(x=>x.kind==="upgrade"&&x.index===index)))throw Error("badBuild");if(!old&&city.buildings.length+city.queue.filter(x=>x.kind==="build").length>=40)throw Error("badBuild");let q=quote(n,type,old?old.level+1:1);if(n.credits<q.credits||n.ore<q.ore)throw Error("notEnough");n.credits-=q.credits;n.ore-=q.ore;city.queue.push({kind:old?"upgrade":"build",type,index,remaining:q.years});return n}
function found(c,site){if(!own(SITES,site)||c.cities.some(x=>x.site===site)||c.cities.length>=3)throw Error("badBuild");let cost=Math.ceil(SITES[site].cost*MODES[c.modeId].cost/100);if(c.credits<cost||c.ore<25)throw Error("notEnough");let n=copy(c);n.credits-=cost;n.ore-=25;n.cities.push(newCity(site));return n}
function toggle(c,site,i){let n=copy(c),a=n.cities.find(x=>x.site===site)?.buildings[i];if(!a)throw Error("badBuild");a.on=!a.on;return n}
function trade(c,kind){let n=copy(c);if(kind==="sell"){if(n.ore<10)throw Error("notEnough");n.ore-=10;n.credits=Math.min(1000000000,n.credits+80)}else if(kind==="food"||kind==="water"||kind==="ore"){let cost=kind==="ore"?100:40;if(n.credits<cost)throw Error("notEnough");n.credits-=cost;n[kind]=Math.min(1000000000,n[kind]+10)}else throw Error("badBuild");return n}
function advanceCampaign(c){if(!validCampaign(c))throw Error("badSave");if(c.planet.year===1000000||c.progress.event)return copy(c);let n=copy(c),mode=MODES[n.modeId],creditsIn=20,upkeep=0,power=0,demand=0,food=0,water=0,ore=0,need=0,shortage=false,effects=[0,0,0,0,0],capacity=[],science=0;
for(let city of n.cities){let next=[];for(let job of city.queue){job.remaining--;if(job.remaining>0)next.push(job);else if(job.kind==="build")city.buildings.push(building(job.type));else city.buildings[job.index].level++}city.queue=next;let localPower=0,localDemand=0,localHousing=0,operating=[];for(let x of city.buildings){if(!x.on)continue;let d=CATALOG[x.type],cost=Math.ceil(d.upkeep*x.level*mode.upkeep/100);if(n.credits<cost){shortage=true;continue}n.credits-=cost;upkeep+=cost;operating.push(x);localPower+=(d.power||0)*x.level;localDemand+=(d.load||0)*x.level}
let ratio=localDemand?Math.min(1,localPower/localDemand):1;if(ratio<1)shortage=true;power+=localPower;demand+=localDemand;for(let x of operating){let d=CATALOG[x.type],factor=x.level*((d.load||0)>0?ratio:1);localHousing+=Math.floor((d.housing||0)*factor);food+=Math.floor((d.food||0)*factor);water+=Math.floor((d.water||0)*factor);ore+=Math.floor((d.oreYield||0)*factor);if(d.effect!==undefined)effects[d.effect]+=factor*.55*(d.sign||1);science+=Math.floor((d.science||0)*factor)}capacity.push(localHousing);need+=Math.ceil(city.pop/10)}
n.food=Math.min(1000000000,n.food+food);n.water=Math.min(1000000000,n.water+water);n.ore=Math.min(1000000000,n.ore+ore);let supplied=n.food>=need&&n.water>=need;n.food=Math.max(0,n.food-need);n.water=Math.max(0,n.water-need);if(!supplied)shortage=true;
for(let i=0;i<n.cities.length;i++){let city=n.cities[i],cap=capacity[i];if(!supplied||city.pop>cap)city.pop=Math.max(0,city.pop-Math.max(1,Math.ceil(city.pop*.08)));else if(city.pop>0)city.pop=Math.min(cap,city.pop+Math.max(1,Math.floor(city.pop*.04)));creditsIn+=Math.floor(city.pop/10)}
n.credits=Math.min(1000000000,n.credits+creditsIn);n.planet=step({...n.planet,controls:effects.map(x=>clamp(x,-1,1))});n.last={income:creditsIn,upkeep,power,demand,food:food-need,water:water-need,ore,shortage};return progressTick(n,science)}

function recruit(c,site){let n=copy(c),city=n.cities.find(x=>x.site===site);if(!city)throw Error("badBuild");let cap=city.buildings.filter(x=>x.on).reduce((v,x)=>v+(CATALOG[x.type].housing||0)*x.level,0);if(city.pop+10>cap||n.credits<50||n.food<10||n.water<10)throw Error("notEnough");city.pop+=10;n.credits-=50;n.food-=10;n.water-=10;return n}

function validProgress(p,year){return !!p&&integer(p.points)&&Array.isArray(p.tech)&&new Set(p.tech).size===p.tech.length&&p.tech.every(k=>own(TECH,k)&&TECH[k].requires.every(x=>p.tech.includes(x)))&&(p.research===null||own(TECH,p.research)&&!p.tech.includes(p.research)&&TECH[p.research].requires.every(x=>p.tech.includes(x)))&&integer(p.seed,1,4294967295)&&(p.event===null||EVENTS.includes(p.event))&&integer(p.nextEvent,0,1000001)&&integer(p.eventsResolved)&&integer(p.stable,0,5)&&(p.wonAt===null||integer(p.wonAt,0,year))&&Array.isArray(p.awards)&&new Set(p.awards).size===p.awards.length&&p.awards.every(x=>AWARDS.includes(x))&&["barren","microbes","plants","ecosystem"].includes(p.stage)&&typeof p.recovery==="boolean"}
function validV2(c){if(!c||c.schemaVersion!==2)return false;try{return validCampaign({...c,schemaVersion:3,progress:initProgress(c.campaignId,c.planet.year)})&&c.cities.every(x=>[...x.buildings,...x.queue].every(z=>["habitat","solar","farm","ice","mine","heat","air","oxygen","hydro","bio"].includes(z.type)))}catch{return false}}
function migrateV2(old,id=old.campaignId){if(!validV2(old))throw Error("badSave");return {...copy(old),schemaVersion:3,campaignId:id,progress:initProgress(id,old.planet.year)}}
function migrateBookV2(old){if(!old||old.version!==2||!Array.isArray(old.campaigns)||!old.manual)throw Error("badSave");let n={...copy(old),version:3,campaigns:old.campaigns.map(c=>migrateV2(c)),manual:Object.fromEntries(Object.entries(old.manual).map(([id,c])=>[id,migrateV2(c)]))};if(!validBook(n))throw Error("badSave");return n}
function research(c,k){if(!own(TECH,k)||c.progress.research!==null||c.progress.tech.includes(k)||!TECH[k].requires.every(x=>c.progress.tech.includes(x)))throw Error("lockedTech");let n=copy(c),cost=Math.ceil(TECH[k].cost*MODES[n.modeId].cost/100);if(n.credits<cost)throw Error("notEnough");n.credits-=cost;n.progress.research=k;return n}
function population(c){return c.cities.reduce((v,x)=>v+x.pop,0)}
function goals(c){let s=c.planet;return {goalTemp:s.t>=5&&s.t<=25,goalPressure:s.p>=80&&s.p<=120,goalOxygen:s.o>=16&&s.o<=25,goalWater:liquid(s)>=30&&s.w<=85,goalBiomass:s.b>=55,goalPeople:population(c)>=100,goalEconomy:c.credits>=100&&c.food>=20&&c.water>=20&&!c.last.shortage&&c.last.income>=c.last.upkeep,goalTech:c.progress.tech.includes("resilience")}}
function ecologyStage(s){if(s.b>=55&&suitability(s)>=.3)return "ecosystem";if(s.b>=20&&liquid(s)>=10)return "plants";if(s.b>=1)return "microbes";return "barren"}
function progressTick(n,science){let p=n.progress;p.points=Math.min(1000000000,p.points+science);if(p.research!==null&&p.points>=TECH[p.research].points){p.points-=TECH[p.research].points;p.tech.push(p.research);p.research=null}
p.stage=ecologyStage(n.planet);p.recovery=population(n)===0;
p.stable=Object.values(goals(n)).every(Boolean)?Math.min(5,p.stable+1):0;if(p.stable===5&&p.wonAt===null)p.wonAt=n.planet.year;
const earned={firstMine:n.cities.some(c=>c.buildings.some(b=>b.type==="mine")),firstTech:p.tech.length>0,firstLife:n.planet.b>=1,threeCities:n.cities.length===3,stableWorld:p.wonAt!==null};for(let k of AWARDS)if(earned[k]&&!p.awards.includes(k))p.awards.push(k);
if(n.planet.year>=p.nextEvent&&p.wonAt===null){let seed=p.seed>>>0;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;p.seed=seed>>>0||1;let pool=n.modeId==="beginner"?["breakthrough","tradeOffer"]:EVENTS;p.event=pool[p.seed%pool.length];p.nextEvent=Math.min(1000001,n.planet.year+(n.modeId==="expert"?10:15))}
return n}
function resolveEvent(c,choice){if(!c.progress.event||!["accept","decline"].includes(choice))throw Error("badEvent");let n=copy(c),k=n.progress.event,accepted=choice==="accept";const pay=x=>{if(n.credits<x)throw Error("notEnough");n.credits-=x};const add=(key,v)=>{n[key]=Math.min(1000000000,Math.max(0,n[key]+v))};
if(k==="dust"){if(accepted)pay(40);else add("food",-20)}
if(k==="equipment"){if(accepted)pay(50);else add("ore",-15)}
if(k==="breakthrough"&&accepted){pay(30);n.progress.points=Math.min(1000000000,n.progress.points+10)}
if(k==="tradeOffer"&&accepted){if(n.ore<10)throw Error("notEnough");add("ore",-10);add("credits",100)}
n.progress.event=null;n.progress.eventsResolved=Math.min(1000000000,n.progress.eventsResolved+1);return n}
