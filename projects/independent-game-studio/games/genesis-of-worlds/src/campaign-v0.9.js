"use strict";
const WORLDS=[["mars",1,true],["mercury",2,true],["luna",3,true],["venus",4,true],["europa",4,true],["titan",4,true],["pluto",5,true],["earth",5,true]];
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
function makeCampaign(id,mode="normal",world="mars"){if(!own(MODES,mode)||!own(WORLD_DATA,world)||!/^c[0-9]+$/.test(id))throw Error("invalid campaign");let c={schemaVersion:6,scenarioVersion:1,campaignId:id,worldId:world,modeId:mode,planet:start(),credits:MODES[mode].budget,ore:40,food:40,water:40,cities:[newCity("ares")],legacyControls:null,progress:initProgress(id),advanced:initAdvanced(),last:{income:0,upkeep:0,power:0,demand:0,food:0,water:0,ore:0,shortage:false}};c.world=initWorld(world);if(world!=="mars"){let d=WORLD_DATA[world];c.planet={...start(),t:d.start[0],p:d.start[1],o:d.start[2],w:d.start[3],b:d.start[4]};c.credits+=d.grant;c.ore+=d.ore;c.food+=d.stock;c.water+=d.stock;if(world==="earth"){c.cities=Object.keys(SITES).map(site=>{let city=newCity(site);city.pop=80;city.buildings.push(building("mine"),building("lab"));return city});c.progress.tech=["climate","energy"];c.advanced.policy="conservation"}}c.civil=initCivil(c);return c}
function validCampaign(c){if(!c||c.schemaVersion!==6||c.scenarioVersion!==1||typeof c.campaignId!=="string"||!/^c[0-9]{1,12}$/.test(c.campaignId)||!own(WORLD_DATA,c.worldId)||!own(MODES,c.modeId)||!validPlanet(c.planet,c.worldId)||!["credits","ore","food","water"].every(k=>integer(c[k]))||!Array.isArray(c.cities)||c.cities.length<1||c.cities.length>3||!c.cities.every(city=>city&&own(SITES,city.site)&&integer(city.pop,0,10000)&&Array.isArray(city.buildings)&&city.buildings.length<=40&&city.buildings.every(x=>x&&own(CATALOG,x.type)&&integer(x.level,1,3)&&typeof x.on==="boolean")&&Array.isArray(city.queue)&&city.queue.length<=40&&city.buildings.length+city.queue.filter(x=>x.kind==="build").length<=40&&city.queue.every(x=>x&&own(CATALOG,x.type)&&integer(x.remaining,1,3)&&(x.kind==="build"&&x.index===-1||x.kind==="upgrade"&&integer(x.index,0,city.buildings.length-1)&&city.buildings[x.index].type===x.type&&city.buildings[x.index].level<3))&&new Set(city.queue.filter(x=>x.kind==="upgrade").map(x=>x.index)).size===city.queue.filter(x=>x.kind==="upgrade").length)||new Set(c.cities.map(x=>x.site)).size!==c.cities.length)return false;
return validCivil(c)&&validWorld(c.world,c.worldId,c.planet.year)&&validAdvanced(c.advanced,c.planet.year)&&validProgress(c.progress,c.planet.year)&& (c.legacyControls===null||Array.isArray(c.legacyControls)&&c.legacyControls.length===5&&c.legacyControls.every(x=>Number.isFinite(x)&&Math.abs(x)<=1))&&c.last&&["income","upkeep","power","demand","food","water","ore"].every(k=>integer(c.last[k],-1000000000,1000000000))&&typeof c.last.shortage==="boolean"}
function migrateV1(old,id){if(!valid(old))throw Error("bad legacy");let c=makeCampaign(id,"normal");c.planet=copy(old);c.legacyControls=[...old.controls];c.planet.controls=[0,0,0,0,0];c.progress=initProgress(id,c.planet.year);return c}
function blankBook(){return {version:6,next:1,active:null,campaigns:[],manual:{}}}
function validBook(b){return !!b&&b.version===6&&integer(b.next,1,999999999999)&&Array.isArray(b.campaigns)&&b.campaigns.length<=12&&b.campaigns.every(validCampaign)&&new Set(b.campaigns.map(x=>x.campaignId)).size===b.campaigns.length&&b.campaigns.every(x=>Number(x.campaignId.slice(1))<b.next)&&(b.active===null||b.campaigns.some(x=>x.campaignId===b.active))&&b.manual&&typeof b.manual==="object"&&!Array.isArray(b.manual)&&Object.entries(b.manual).every(([k,v])=>validCampaign(v)&&v.campaignId===k&&b.campaigns.some(c=>c.campaignId===k&&c.worldId===v.worldId&&c.modeId===v.modeId))}
function addCampaign(book,mode,world,imported=null){if(!validBook(book)||book.campaigns.length>=12)throw Error("campaignLimit");let next=copy(book),id="c"+next.next++;let c=imported===null?makeCampaign(id,mode,world):valid(imported)?migrateV1(imported,id):validV2(imported)?migrateV2(imported,id):validV3(imported)?migrateV3(imported,id):validV4(imported)?migrateV4(imported,id):validV5(imported)?migrateV5(imported,id):validCampaign(imported)?{...copy(imported),campaignId:id}:null;if(!c)throw Error("badSave");next.campaigns.push(c);next.active=id;return next}
function selectCampaign(book,id){if(!book.campaigns.some(c=>c.campaignId===id))throw Error("badSave");return {...book,active:id}}
const activeCampaign=b=>b.campaigns.find(c=>c.campaignId===b.active);
function replaceCampaign(b,c){if(!validCampaign(c)||c.campaignId!==b.active)throw Error("badSave");return {...b,campaigns:b.campaigns.map(x=>x.campaignId===c.campaignId?c:x)}}
function manualSave(b){let c=activeCampaign(b);if(!c)return b;return {...b,manual:{...b.manual,[c.campaignId]:copy(c)}}}
function manualLoad(b){let c=b.manual[b.active];if(!c)throw Error("noManual");return replaceCampaign(b,copy(c))}
function quote(c,type,level=1){if(!own(CATALOG,type)||!integer(level,1,3))throw Error("badBuild");let d=CATALOG[type];return {credits:Math.ceil(d.cost*level*MODES[c.modeId].cost/100),ore:d.ore*level,years:MODES[c.modeId].build}}
function order(c,site,type,index=-1){if(!validCampaign(c))throw Error("badSave");let n=copy(c),city=n.cities.find(x=>x.site===site);if(!city||!own(CATALOG,type)||city.queue.length>=40)throw Error("badBuild");let old=index===-1?null:city.buildings[index];if(CATALOG[type].tech&&!n.progress.tech.includes(CATALOG[type].tech))throw Error("lockedTech");if(index!==-1&&(!old||old.type!==type||old.level>=3||city.queue.some(x=>x.kind==="upgrade"&&x.index===index)))throw Error("badBuild");if(!old&&city.buildings.length+city.queue.filter(x=>x.kind==="build").length>=40)throw Error("badBuild");let q=quote(n,type,old?old.level+1:1);if(n.credits<q.credits||n.ore<q.ore)throw Error("notEnough");n.credits-=q.credits;n.ore-=q.ore;city.queue.push({kind:old?"upgrade":"build",type,index,remaining:q.years});return n}
function found(c,site){if(!own(SITES,site)||c.cities.some(x=>x.site===site)||c.cities.length>=3)throw Error("badBuild");let cost=Math.ceil(SITES[site].cost*MODES[c.modeId].cost/100);if(c.credits<cost||c.ore<25)throw Error("notEnough");let n=copy(c);n.credits-=cost;n.ore-=25;n.cities.push(newCity(site));n.civil.regions[site]=newSociety(n.worldId);return n}
function toggle(c,site,i){let n=copy(c),a=n.cities.find(x=>x.site===site)?.buildings[i];if(!a)throw Error("badBuild");a.on=!a.on;return n}
function trade(c,kind){let n=copy(c);if(kind==="sell"){if(n.ore<10)throw Error("notEnough");n.ore-=10;n.credits=Math.min(1000000000,n.credits+80)}else if(kind==="food"||kind==="water"||kind==="ore"){let cost=kind==="ore"?100:40;if(n.credits<cost)throw Error("notEnough");n.credits-=cost;n[kind]=Math.min(1000000000,n[kind]+10)}else throw Error("badBuild");return n}
function advanceCampaign(c){if(!validCampaign(c))throw Error("badSave");if(c.planet.year===1000000||c.progress.event||c.world.failed||c.civil.crisis)return copy(c);let n=copy(c),mode=MODES[n.modeId],creditsIn=n.worldId==="earth"?40:20,upkeep=0,power=0,demand=0,food=0,water=0,ore=0,need=0,shortage=false,effects=[0,0,0,0,0],capacity=[],science=0;const ctl=controller(n);const orbital=orbitTick(n,ctl);upkeep+=orbital.upkeep;shortage=orbital.shortage;effects[0]+=orbital.heat;food+=orbital.food;water+=orbital.water;
for(let city of n.cities){let next=[];for(let job of city.queue){job.remaining--;if(job.remaining>0)next.push(job);else if(job.kind==="build")city.buildings.push(building(job.type));else city.buildings[job.index].level++}city.queue=next;let localPower=0,localDemand=0,localHousing=0,operating=[];for(let x of city.buildings){if(!x.on)continue;let d=CATALOG[x.type];if(d.effect!==undefined&&!controlAllows(ctl,d.effect,d.sign||1))continue;let cost=Math.ceil(d.upkeep*x.level*mode.upkeep/100);if(d.effect!==undefined&&ctl.auto&&cost>ctl.budget)continue;if(n.credits<cost){shortage=true;continue}if(d.effect!==undefined&&ctl.auto)ctl.budget-=cost;n.credits-=cost;upkeep+=cost;operating.push(x);localPower+=Math.floor((d.power||0)*x.level*(x.type==="solar"?WORLD_DATA[n.worldId].solar:1));localDemand+=(d.load||0)*x.level}
let ratio=localDemand?Math.min(1,localPower/localDemand):1;if(ratio<1)shortage=true;power+=localPower;demand+=localDemand;for(let x of operating){let d=CATALOG[x.type],factor=x.level*((d.load||0)>0?ratio:1);localHousing+=Math.floor((d.housing||0)*factor);food+=Math.floor((d.food||0)*factor);water+=Math.floor((d.water||0)*factor);ore+=Math.floor((d.oreYield||0)*factor);if(d.effect!==undefined)effects[d.effect]+=factor*.55*(d.sign||1);science+=Math.floor((d.science||0)*factor)}capacity.push(localHousing);need+=Math.ceil(city.pop/10)}
n.food=Math.min(1000000000,n.food+food);n.water=Math.min(1000000000,n.water+water);n.ore=Math.min(1000000000,n.ore+ore);let supplied=n.food>=need&&n.water>=need;n.food=Math.max(0,n.food-need);n.water=Math.max(0,n.water-need);if(!supplied)shortage=true;
for(let i=0;i<n.cities.length;i++){let city=n.cities[i],cap=capacity[i];if(!supplied||city.pop>cap)city.pop=Math.max(0,city.pop-Math.max(1,Math.ceil(city.pop*.08)));else if(city.pop>0)city.pop=Math.min(cap,city.pop+Math.max(1,Math.floor(city.pop*.04)));creditsIn+=Math.floor(city.pop/10)}
n.credits=Math.min(1000000000,n.credits+creditsIn);n.planet=stepWorld({...n.planet,controls:effects.map(x=>clamp(x,-1,1))},n.worldId,n.world.hazard);n.last={income:creditsIn,upkeep,power,demand,food:food-need,water:water-need,ore,shortage};regionalTick(n);worldTick(n);civilTick(n);return progressTick(n,science)}

function recruit(c,site){let n=copy(c),city=n.cities.find(x=>x.site===site);if(!city)throw Error("badBuild");let cap=city.buildings.filter(x=>x.on).reduce((v,x)=>v+(CATALOG[x.type].housing||0)*x.level,0);if(city.pop+10>cap||n.credits<50||n.food<10||n.water<10)throw Error("notEnough");city.pop+=10;n.credits-=50;n.food-=10;n.water-=10;return n}

function validProgress(p,year){return !!p&&integer(p.points)&&Array.isArray(p.tech)&&new Set(p.tech).size===p.tech.length&&p.tech.every(k=>own(TECH,k)&&TECH[k].requires.every(x=>p.tech.includes(x)))&&(p.research===null||own(TECH,p.research)&&!p.tech.includes(p.research)&&TECH[p.research].requires.every(x=>p.tech.includes(x)))&&integer(p.seed,1,4294967295)&&(p.event===null||EVENTS.includes(p.event))&&integer(p.nextEvent,0,1000001)&&integer(p.eventsResolved)&&integer(p.stable,0,15)&&(p.wonAt===null||integer(p.wonAt,0,year))&&Array.isArray(p.awards)&&new Set(p.awards).size===p.awards.length&&p.awards.every(x=>AWARDS.includes(x))&&["barren","microbes","plants","ecosystem"].includes(p.stage)&&typeof p.recovery==="boolean"}
function validV2(c){if(!c||c.schemaVersion!==2||c.worldId!=="mars")return false;try{return validCampaign({...c,schemaVersion:6,world:initWorld("mars"),advanced:initAdvanced(),progress:initProgress(c.campaignId,c.planet.year),civil:initCivil(c)})&&c.cities.every(x=>[...x.buildings,...x.queue].every(z=>["habitat","solar","farm","ice","mine","heat","air","oxygen","hydro","bio"].includes(z.type)))}catch{return false}}
function migrateV2(old,id=old.campaignId){if(!validV2(old))throw Error("badSave");return {...copy(old),schemaVersion:6,campaignId:id,world:initWorld("mars"),advanced:initAdvanced(),progress:initProgress(id,old.planet.year),civil:initCivil(old)}}
function migrateBookV2(old){if(!old||old.version!==2||!Array.isArray(old.campaigns)||!old.manual)throw Error("badSave");let n={...copy(old),version:6,campaigns:old.campaigns.map(c=>migrateV2(c)),manual:Object.fromEntries(Object.entries(old.manual).map(([id,c])=>[id,migrateV2(c)]))};if(!validBook(n))throw Error("badSave");return n}
function research(c,k){if(!own(TECH,k)||c.progress.research!==null||c.progress.tech.includes(k)||!TECH[k].requires.every(x=>c.progress.tech.includes(x)))throw Error("lockedTech");let n=copy(c),cost=Math.ceil(TECH[k].cost*MODES[n.modeId].cost/100);if(n.credits<cost)throw Error("notEnough");n.credits-=cost;n.progress.research=k;return n}
function population(c){return c.cities.reduce((v,x)=>v+x.pop,0)}
function goals(c){let s=c.planet;let result={goalTemp:s.t>=5&&s.t<=25,goalPressure:s.p>=80&&s.p<=120,goalOxygen:s.o>=16&&s.o<=25,goalWater:liquid(s)>=30&&s.w<=85,goalBiomass:s.b>=55,goalPeople:population(c)>=100,goalEconomy:c.credits>=100&&c.food>=20&&c.water>=20&&!c.last.shortage&&c.last.income>=c.last.upkeep,goalTech:c.progress.tech.includes("resilience")};if(c.worldId!=="mars"){result.goalHazard=c.world.hazard<=WORLD_DATA[c.worldId].limit;result.goalPeople=population(c)>=WORLD_DATA[c.worldId].people;result.goalWater=liquid(s)>=30&&s.w<=85;if(c.worldId==="earth"){result.goalTemp=s.t>=12&&s.t<=19;result.goalBiomass=s.b>=70;result.goalPeople=population(c)>=270&&!c.world.failed;result.goalRegions=c.cities.every(x=>(c.advanced.regions[x.site]||0)>=2);result.goalEconomy=result.goalEconomy&&c.food>=60&&c.water>=60}}return result}
function ecologyStage(s){if(s.b>=55&&suitability(s)>=.3)return "ecosystem";if(s.b>=20&&liquid(s)>=10)return "plants";if(s.b>=1)return "microbes";return "barren"}
function progressTick(n,science){let p=n.progress;p.points=Math.min(1000000000,p.points+science);if(p.research!==null&&p.points>=TECH[p.research].points){p.points-=TECH[p.research].points;p.tech.push(p.research);p.research=null}
p.stage=ecologyStage(n.planet);p.recovery=population(n)===0;
let required=stableYears(n);p.stable=Object.values(goals(n)).every(Boolean)?Math.min(required,p.stable+1):0;if(p.stable===required&&p.wonAt===null)p.wonAt=n.planet.year;
const earned={firstMine:n.cities.some(c=>c.buildings.some(b=>b.type==="mine")),firstTech:p.tech.length>0,firstLife:n.planet.b>=1,threeCities:n.cities.length===3,stableWorld:p.wonAt!==null};for(let k of AWARDS)if(earned[k]&&!p.awards.includes(k))p.awards.push(k);
if(n.planet.year>=p.nextEvent&&p.wonAt===null){let seed=p.seed>>>0;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;p.seed=seed>>>0||1;let pool=n.modeId==="beginner"?["breakthrough","tradeOffer"]:EVENTS;p.event=pool[p.seed%pool.length];p.nextEvent=Math.min(1000001,n.planet.year+(n.modeId==="expert"?10:15))}
return n}
function resolveEvent(c,choice){if(!c.progress.event||!["accept","decline"].includes(choice))throw Error("badEvent");let n=copy(c),k=n.progress.event,accepted=choice==="accept";const pay=x=>{if(n.credits<x)throw Error("notEnough");n.credits-=x};const add=(key,v)=>{n[key]=Math.min(1000000000,Math.max(0,n[key]+v))};
if(k==="dust"){if(accepted)pay(40);else add("food",-20)}
if(k==="equipment"){if(accepted)pay(50);else add("ore",-15)}
if(k==="breakthrough"&&accepted){pay(30);n.progress.points=Math.min(1000000000,n.progress.points+10)}
if(k==="tradeOffer"&&accepted){if(n.ore<10)throw Error("notEnough");add("ore",-10);add("credits",100)}
n.progress.event=null;n.progress.eventsResolved=Math.min(1000000000,n.progress.eventsResolved+1);return n}

const ORBITS={mirror:{cost:450,ore:40,years:4,upkeep:12,tech:"energy",heat:.7},shade:{cost:450,ore:40,years:4,upkeep:12,tech:"climate",heat:-.7},station:{cost:600,ore:50,years:5,upkeep:15,tech:"resilience",food:16,water:16}};
const TARGETS=[[15,2,-70,50],[100,4,1,160],[21,2,0,35],[65,4,0,100],[75,5,0,100]];
const POLICIES=["balanced","conservation","industry"];
function initAdvanced(){return {orbit:[],auto:false,targets:TARGETS.map(x=>x[0]),directions:[0,0,0,0,0],budget:100,history:[],regions:{},policy:"balanced",lastOrbit:0,lastFlood:0}}
function validAdvanced(a,year){return !!a&&typeof a.auto==="boolean"&&integer(a.budget,0,1000000)&&Array.isArray(a.targets)&&a.targets.length===5&&a.targets.every((v,i)=>Number.isFinite(v)&&v>=TARGETS[i][2]&&v<=TARGETS[i][3])&&Array.isArray(a.directions)&&a.directions.length===5&&a.directions.every(v=>[-1,0,1].includes(v))&&Array.isArray(a.orbit)&&a.orbit.length<=3&&new Set(a.orbit.map(x=>x.type)).size===a.orbit.length&&a.orbit.every(x=>x&&own(ORBITS,x.type)&&integer(x.remaining,0,ORBITS[x.type].years)&&typeof x.on==="boolean")&&Array.isArray(a.history)&&a.history.length<=120&&a.history.every((x,i)=>Array.isArray(x)&&x.length===6&&integer(x[0],0,year)&&(i===0||x[0]>a.history[i-1][0])&&x.slice(1).every(Number.isFinite))&&a.regions&&typeof a.regions==="object"&&!Array.isArray(a.regions)&&Object.entries(a.regions).every(([k,v])=>own(SITES,k)&&integer(v,0,3))&&POLICIES.includes(a.policy)&&integer(a.lastOrbit)&&integer(a.lastFlood)}
function validV3(c){try{return c.schemaVersion===3&&c.worldId==="mars"&&validCampaign({...c,schemaVersion:6,world:initWorld("mars"),advanced:initAdvanced(),civil:initCivil(c)})}catch{return false}}
function migrateV3(c,id=c.campaignId){if(!validV3(c))throw Error("badSave");return {...copy(c),schemaVersion:6,campaignId:id,world:initWorld("mars"),advanced:initAdvanced(),civil:initCivil(c)}}
function migrateBookV3(old){if(!old||old.version!==3||!Array.isArray(old.campaigns)||!old.manual)throw Error("badSave");let n={...copy(old),version:6,campaigns:old.campaigns.map(c=>migrateV3(c)),manual:Object.fromEntries(Object.entries(old.manual).map(([id,c])=>[id,migrateV3(c)]))};if(!validBook(n))throw Error("badSave");return n}
function configureAuto(c,enabled,targets,budget){if(typeof enabled!=="boolean"||!integer(budget,0,1000000)||!Array.isArray(targets)||targets.length!==5||!targets.every((v,i)=>Number.isFinite(v)&&v>=TARGETS[i][2]&&v<=TARGETS[i][3]))throw Error("badTarget");let n=copy(c);n.advanced.auto=enabled;n.advanced.targets=[...targets];n.advanced.budget=budget;n.advanced.directions=[0,0,0,0,0];return n}
function controller(c){let a=c.advanced;if(!a.auto)return {auto:false,dirs:[0,0,0,0,0],budget:Infinity};let s=c.planet,values=[s.t,s.p,s.o,s.w,s.b],dirs=values.map((v,i)=>{let target=a.targets[i],band=TARGETS[i][1],prev=a.directions[i];if(v<target-band)return 1;if(v>target+band)return i===4?0:-1;if(prev===1&&v<target)return 1;if(prev===-1&&v>target)return -1;return 0});a.directions=dirs;return {auto:true,dirs,budget:a.budget}}
function controlAllows(c,i,sign){return !c.auto||c.dirs[i]===sign}
function orbitQuote(c,k){if(!own(ORBITS,k))throw Error("badBuild");let d=ORBITS[k];return {credits:Math.ceil(d.cost*MODES[c.modeId].cost/100),ore:d.ore,years:d.years}}
function orderOrbit(c,k){if(!own(ORBITS,k)||c.advanced.orbit.some(x=>x.type===k))throw Error("badBuild");if(!c.progress.tech.includes(ORBITS[k].tech))throw Error("lockedTech");let q=orbitQuote(c,k);if(c.credits<q.credits||c.ore<q.ore)throw Error("notEnough");let n=copy(c);n.credits-=q.credits;n.ore-=q.ore;n.advanced.orbit.push({type:k,remaining:q.years,on:true});return n}
function toggleOrbit(c,k){let n=copy(c),o=n.advanced.orbit.find(x=>x.type===k);if(!o||o.remaining)throw Error("badBuild");o.on=!o.on;return n}
function orbitTick(c,ctl){let heat=0,food=0,water=0,upkeep=0,shortage=false;for(let o of c.advanced.orbit){if(o.remaining)o.remaining--;if(o.remaining||!o.on)continue;let d=ORBITS[o.type];if(d.heat&&!controlAllows(ctl,0,Math.sign(d.heat)))continue;let cost=Math.ceil(d.upkeep*MODES[c.modeId].upkeep/100);if(d.heat&&ctl.auto&&cost>ctl.budget)continue;if(c.credits<cost){shortage=true;continue}if(d.heat&&ctl.auto)ctl.budget-=cost;c.credits-=cost;upkeep+=cost;heat+=d.heat||0;food+=d.food||0;water+=d.water||0}c.advanced.lastOrbit=upkeep;return {heat,food,water,upkeep,shortage}}
function seaLevel(s){return -8500+liquid(s)/100*12000}
function regionRisk(c,site){let loc=SITES[site],lat=loc.lat*Math.PI/180,lon=loc.lon*Math.PI/180;let z=c.worldId==="mars"?elevation(Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon)):WORLD_DATA[c.worldId].heights[Object.keys(SITES).indexOf(site)];if(z===null)return {height:null,water:worldSea(c.planet,c.worldId),depth:null,protected:false};let depth=Math.max(0,worldSea(c.planet,c.worldId)-z),level=c.advanced.regions[site]||0;return {height:z,water:worldSea(c.planet,c.worldId),depth,protected:depth<=level*(c.worldId==="earth"?20:1500)}}
function adapt(c,site){if(!c.cities.some(x=>x.site===site))throw Error("badBuild");let level=c.advanced.regions[site]||0;if(level>=3)throw Error("badBuild");let cost=Math.ceil(150*(level+1)*MODES[c.modeId].cost/100),ore=10*(level+1);if(c.credits<cost||c.ore<ore)throw Error("notEnough");let n=copy(c);n.credits-=cost;n.ore-=ore;n.advanced.regions[site]=level+1;return n}
function setPolicy(c,k){if(!POLICIES.includes(k))throw Error("badBuild");let n=copy(c);n.advanced.policy=k;return n}
function regionalTick(c){let a=c.advanced;a.lastFlood=0;for(let city of c.cities){let risk=regionRisk(c,city.site);if(risk.depth!==null&&risk.depth>0&&!risk.protected){let loss=Math.min(city.pop,Math.max(1,Math.ceil(city.pop*.03)));city.pop-=loss;a.lastFlood+=loss;c.last.shortage=true}}if(a.policy==="conservation"){let expense=Math.min(c.credits,5);c.credits-=expense;c.last.upkeep+=expense;if(expense===5)c.planet.b=clamp(c.planet.b+.08*suitability(c.planet),0,100)}if(a.policy==="industry"){let bonus=Math.min(1000000000-c.credits,Math.floor(population(c)/20));c.credits+=bonus;c.last.income+=bonus;c.planet.b=clamp(c.planet.b-.12,0,100)}let s=c.planet;a.history.push([s.year,s.t,s.p,s.o,s.w,s.b]);if(a.history.length>120)a.history.shift()}
function forecast(c,years=10){if(!integer(years,1,50))throw Error("badTarget");let n=copy(c),startYear=n.planet.year;for(let i=0;i<years&&!n.progress.event&&n.planet.year<1000000&&!n.world.failed&&!n.civil.crisis;i++)n=advanceCampaign(n);return {years:n.planet.year-startYear,planet:copy(n.planet),credits:n.credits,pop:population(n),event:n.progress.event,crisis:n.civil.crisis,risks:n.cities.map(x=>({site:x.site,...regionRisk(n,x.site)})),shortage:n.last.shortage}}

const WORLD_DATA={
 mars:{start:[-59,.636,.0008,0,0],solar:1,grant:0,ore:0,stock:0,heat:1,air:1,escape:0,drift:0,hazard:0,limit:100,people:100,heights:[0,0,0],color:[170,95,65],seed:1},
 mercury:{start:[167,0,0,0,0],solar:1.6,grant:300,ore:20,stock:20,heat:2,air:1.7,escape:.007,drift:.20,hazard:60,limit:20,people:100,heights:[4500,2700,1600],color:[145,143,136],seed:2},
 luna:{start:[-23,0,0,3,0],solar:1,grant:350,ore:30,stock:20,heat:1.4,air:1.8,escape:.014,drift:-.04,hazard:75,limit:20,people:120,heights:[4900,2900,1700],color:[154,154,163],seed:3},
 venus:{start:[464,9200,0,0,0],solar:1.4,grant:500,ore:40,stock:40,heat:4,air:2,escape:.001,drift:.10,hazard:95,limit:15,people:120,heights:[4200,3300,2000],color:[208,151,67],seed:4},
 europa:{start:[-160,0,0,90,0],solar:.55,grant:650,ore:40,stock:40,heat:3,air:1.5,escape:.009,drift:-.1,hazard:90,limit:15,people:120,heights:[4400,2600,1600],color:[193,213,229],seed:5},
 titan:{start:[-179,147,0,20,0],solar:.45,grant:750,ore:50,stock:50,heat:3.3,air:1.6,escape:.005,drift:-.13,hazard:80,limit:15,people:120,heights:[4500,2800,1900],color:[201,150,71],seed:6},
 pluto:{start:[-225,.001,0,35,0],solar:.45,grant:850,ore:60,stock:60,heat:3.5,air:2,escape:.018,drift:-.2,hazard:95,limit:10,people:150,heights:[4900,3100,1800],color:[185,169,158],seed:7},
 earth:{start:[27,101.3,19,85,30],solar:1,grant:1100,ore:80,stock:120,heat:1.5,air:1,escape:.001,drift:0,hazard:85,limit:10,people:270,heights:[5,25,110],color:[96,126,69],seed:8}};
function initWorld(id){return {hazard:WORLD_DATA[id].hazard,failed:false,lastLoss:0}}
function validWorld(w,id,year){return !!w&&Number.isFinite(w.hazard)&&w.hazard>=0&&w.hazard<=100&&typeof w.failed==="boolean"&&integer(w.lastLoss,0,30000)&&(id==="earth"||!w.failed)}
function validPlanet(s,id){if(id==="mars")return valid(s);return !!s&&s.version===1&&integer(s.year,0,1000000)&&["t","p","o","w","b"].every(k=>Number.isFinite(s[k]))&&s.t>=-250&&s.t<=500&&s.p>=0&&s.p<=10000&&s.o>=0&&s.o<=s.p&&s.w>=0&&s.w<=100&&s.b>=0&&s.b<=100&&Array.isArray(s.controls)&&s.controls.length===5&&s.controls.every(v=>Number.isFinite(v)&&Math.abs(v)<=1)}
function validV4(c){try{return c.schemaVersion===4&&c.worldId==="mars"&&validCampaign({...c,schemaVersion:6,world:initWorld("mars"),civil:initCivil(c)})}catch{return false}}
function migrateV4(c,id=c.campaignId){if(!validV4(c))throw Error("badSave");return {...copy(c),schemaVersion:6,campaignId:id,world:initWorld("mars"),civil:initCivil(c)}}
function migrateBookV4(old){if(!old||old.version!==4||!Array.isArray(old.campaigns)||!old.manual)throw Error("badSave");let n={...copy(old),version:6,campaigns:old.campaigns.map(c=>migrateV4(c)),manual:Object.fromEntries(Object.entries(old.manual).map(([id,c])=>[id,migrateV4(c)]))};if(!validBook(n))throw Error("badSave");return n}
function stepWorld(s,id,hazard){if(id==="mars")return step(s);if(!validPlanet(s,id))throw Error("badSave");let d=WORLD_DATA[id],[heat,air,oxy,water,seed]=s.controls;
let heatRate=1.8*d.heat*(Math.abs(s.t-15)>70?2:1),airRate=2.1*d.air+(s.p>180&&air<0?s.p*.045:0);
let t=clamp(s.t+heat*heatRate+d.drift+(id==="earth"?hazard*.005:0),-250,500);
let p=clamp(s.p+air*airRate-d.escape*s.p,0,10000);
let o=clamp(s.o+oxy*.85+s.b*.003,0,p);
let w=clamp(s.w+water*1.8-Math.max(0,t-45)*.0008,0,100);
let n={...s,t,p,o,w,year:s.year+1,controls:[...s.controls]};let f=suitability(n);n.b=clamp(s.b+Math.max(0,seed)*f*2.5+s.b*.01*(2*f-1)+Math.min(0,seed)*2,0,100);return n}
function worldSea(s,id){return id==="earth"?Math.max(0,(s.w-65)*1.5+(s.t-15)*1.2):seaLevel(s)}
function worldTick(c){let id=c.worldId,w=c.world;if(id==="mars")return;let d=WORLD_DATA[id],shield=c.cities.reduce((v,x)=>v+(c.advanced.regions[x.site]||0),0),s=c.planet,tech=c.progress.tech;let reduction=0;
if(id==="mercury")reduction=(s.t<60?1.8:0)+shield*.25;
if(id==="luna")reduction=(tech.includes("atmosphere")?1.0:0)+shield*.5;
if(id==="venus")reduction=(s.p<200?1.6:0)+(s.t<60?1:0);
if(id==="europa")reduction=shield*.7+(tech.includes("resilience")?1:0);
if(id==="titan")reduction=tech.includes("atmosphere")?1.2*Math.max(0,-s.controls[1])+ (tech.includes("ecology")?1:0):0;
if(id==="pluto")reduction=(tech.includes("energy")?1:0)+shield*.45+(s.t>-20?.4:0);
if(id==="earth")reduction=(c.advanced.policy==="conservation"?1.2:c.advanced.policy==="industry"?-.6:0)+(tech.includes("ecology")?.6:0)+Math.max(0,s.controls[4])*.7;
w.hazard=clamp(w.hazard-reduction,0,100);if(id!=="earth"){let cost=Math.min(c.credits,Math.max(0,Math.ceil(w.hazard/25)-shield));c.credits-=cost;c.last.upkeep+=cost}w.lastLoss=0;if(id==="earth"){if(w.hazard>50&&c.advanced.policy!=="conservation"){for(let city of c.cities){let loss=Math.min(city.pop,Math.ceil(city.pop*.02));city.pop-=loss;w.lastLoss+=loss}}if(population(c)<150)w.failed=true}}
function worldPixel(x,y,z,angle,s,id){if(id==="mars")return pixel(x,y,z,angle,s);let d=WORLD_DATA[id],u=x*Math.cos(angle)+z*Math.sin(angle),v=-x*Math.sin(angle)+z*Math.cos(angle),e=.5+.24*Math.sin((4+d.seed)*u+2*v)*Math.cos(4*y+v)+.12*Math.sin(17*u-7*y)*Math.cos(13*v+2*y),wet=liquid(s)/100,life=clamp(s.b/100)*clamp((s.t+12)/22),ice=s.t<-60&&Math.abs(y)>.42;let c=ice?[201,218,231]:wet>.005&&e<.18+wet*.63?[26,78+e*40,126+e*55]:d.color.map((q,i)=>q*(.68+e*.5)*(1-life)+[80,151,68][i]*life);let lighting=.18+.82*clamp(-.42*x+.39*y+.82*z);return c.map(q=>Math.round(clamp(q*lighting,0,255)))}

function stableYears(c){return c.worldId==="earth"?15:5}
function evacuate(c,from,to){if(c.world.failed||from===to)throw Error("badBuild");let n=copy(c),a=n.cities.find(x=>x.site===from),b=n.cities.find(x=>x.site===to);if(!a||!b)throw Error("badBuild");let capacity=b.buildings.filter(x=>x.on).reduce((v,x)=>v+(CATALOG[x.type].housing||0)*x.level,0);if(a.pop<10||b.pop+10>capacity||n.credits<10)throw Error("notEnough");a.pop-=10;b.pop+=10;n.credits-=10;return n}

const CRISIS_WORLD={mars:"dustEmergency",mercury:"solarFlare",luna:"meteorStrike",venus:"acidStorm",europa:"iceFracture",titan:"methaneStorm",pluto:"powerFreeze",earth:"floodEmergency"};
const CRISIS_TYPES=[...Object.values(CRISIS_WORLD),"fireEmergency","epidemic","unrest","earthquake","heatwave"];
const CIV_INTERVAL={beginner:30,normal:22,expert:16};
function newSociety(id){return {health:id==="earth"?65:85,morale:id==="earth"?60:80,jobless:0,services:id==="earth"?55:70}}
function initCivil(c){let y=c.planet.year;return {regions:Object.fromEntries(c.cities.map(x=>[x.site,newSociety(c.worldId)])),seed:(c.progress?.seed||1)>>>0||1,next:Math.min(1000001,y+(CIV_INTERVAL[c.modeId]||22)),crisis:null,resolved:0,last:null}}
function validCivil(c){let d=c.civil,y=c.planet.year;if(!d||!d.regions||typeof d.regions!=="object"||Array.isArray(d.regions)||Object.keys(d.regions).length!==c.cities.length||!c.cities.every(x=>{let a=d.regions[x.site];return a&&["health","morale","jobless","services"].every(k=>integer(a[k],0,100))})||!integer(d.seed,1,4294967295)||!integer(d.next,0,1000001)||!integer(d.resolved))return false;
const good=q=>q&&CRISIS_TYPES.includes(q.type)&&c.cities.some(x=>x.site===q.site)&&integer(q.year,0,y)&&integer(q.severity,1,3);
return (d.crisis===null||good(d.crisis))&&(d.last===null||good(d.last)&&["respond","defer"].includes(d.last.choice)&&integer(d.last.loss,0,10000))}
function validV5(c){try{return c.schemaVersion===5&&validCampaign({...c,schemaVersion:6,civil:initCivil(c)})}catch{return false}}
function migrateV5(c,id=c.campaignId){if(!validV5(c))throw Error("badSave");return {...copy(c),schemaVersion:6,campaignId:id,civil:initCivil(c)}}
function migrateBookV5(old){if(!old||old.version!==5||!Array.isArray(old.campaigns)||!old.manual)throw Error("badSave");let n={...copy(old),version:6,campaigns:old.campaigns.map(c=>migrateV5(c)),manual:Object.fromEntries(Object.entries(old.manual).map(([id,c])=>[id,migrateV5(c)]))};if(!validBook(n))throw Error("badSave");return n}
function civilTick(c){let d=c.civil,y=c.planet.year;for(let city of c.cities){let a=d.regions[city.site],workers=city.buildings.filter(x=>x.on).reduce((v,x)=>v+x.level*8,0),housing=city.buildings.filter(x=>x.on).reduce((v,x)=>v+(CATALOG[x.type].housing||0)*x.level,0),jobless=city.pop?Math.round(100*Math.max(0,city.pop-workers)/city.pop):0,protectedLevel=c.advanced.regions[city.site]||0;
a.jobless=jobless;a.services=clamp(Math.round(a.services*.8+.2*(45+protectedLevel*10+(housing>=city.pop?20:0)+(c.progress.tech.includes("resilience")?15:0)-(c.last.shortage?25:0))),0,100);
a.health=clamp(a.health+(c.last.shortage?-3:2)+(a.services>=80?1:0),0,100);a.morale=clamp(a.morale+(c.last.shortage?-4:2)-(jobless>50?1:0),0,100)}
if(c.world.failed||d.crisis||y<d.next)return;let seed=d.seed>>>0;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;d.seed=seed>>>0||1;let populated=c.cities.filter(x=>x.pop>0);d.next=Math.min(1000001,y+CIV_INTERVAL[c.modeId]);if(!populated.length)return;let city=populated[d.seed%populated.length],a=d.regions[city.site],pool=[CRISIS_WORLD[c.worldId],"fireEmergency",...(c.worldId==="earth"?["earthquake","heatwave"]:[])];if(a.health<55)pool.push("epidemic","epidemic");if(a.morale<50)pool.push("unrest","unrest");let type=pool[(d.seed>>>8)%pool.length],severity=c.modeId==="beginner"?1:c.modeId==="expert"?3:2;d.crisis={type,site:city.site,year:y,severity}}
function crisisQuote(c){let q=c.civil.crisis;if(!q)return null;return Math.ceil((20+q.severity*15)*MODES[c.modeId].cost/100)}
// v0.9: per-severity loss profiles; regional protection preserves population.
const CRISIS_IMPACTS={
 dustEmergency:{food:5,water:3,health:4,morale:5},solarFlare:{ore:7,services:5,health:3,morale:4},
 meteorStrike:{ore:9,services:8,health:4,morale:5},acidStorm:{water:9,ore:4,health:7,morale:4},
 iceFracture:{water:6,services:7,health:5,morale:4},methaneStorm:{food:5,water:7,health:6,morale:4},
 powerFreeze:{food:7,ore:3,services:9,morale:5},floodEmergency:{food:9,water:6,services:5,health:4,morale:5},
 fireEmergency:{ore:6,services:8,health:5,morale:5},epidemic:{food:3,health:12,morale:6},
 unrest:{credits:10,services:4,morale:12},earthquake:{ore:10,services:10,health:6,morale:6},
 heatwave:{water:12,food:4,health:8,morale:3}
};
function crisisImpact(c){
 const q=c.civil.crisis;if(!q)return null;
 const p=CRISIS_IMPACTS[q.type],a=c.civil.regions[q.site],city=c.cities.find(x=>x.site===q.site);
 const losses={population:Math.min(city.pop,Math.max(0,q.severity-(c.advanced.regions[q.site]||0)))};
 for(const k of ["credits","food","water","ore","health","morale","services"])losses[k]=Math.min(own(a,k)?a[k]:c[k],(p[k]||0)*q.severity);
 return losses;
}
function respondCrisis(c,choice){
 if(!validCampaign(c)||!c.civil.crisis||c.world.failed||!["respond","defer"].includes(choice))throw Error("badEvent");
 let n=copy(c),q=n.civil.crisis,a=n.civil.regions[q.site],city=n.cities.find(x=>x.site===q.site),loss=0;
 if(choice==="respond"){let cost=crisisQuote(n);if(n.credits<cost)throw Error("notEnough");n.credits-=cost;a.health=Math.min(100,a.health+3);a.morale=Math.min(100,a.morale+4)}
 else{const p=crisisImpact(n);loss=p.population;city.pop-=loss;
 for(const k of ["credits","food","water","ore"])n[k]-=p[k];
 for(const k of ["health","morale","services"])a[k]-=p[k];
 n.progress.stable=0;if(n.worldId==="earth"&&population(n)<150)n.world.failed=true;}
 n.civil.last={...q,choice,loss};n.civil.crisis=null;n.civil.resolved=Math.min(1000000000,n.civil.resolved+1);return n;
}
function investSociety(c,site,kind){if(c.world.failed||!["health","morale","services"].includes(kind)||!c.cities.some(x=>x.site===site))throw Error("badBuild");let cost=Math.ceil(40*MODES[c.modeId].cost/100);if(c.credits<cost)throw Error("notEnough");let n=copy(c),a=n.civil.regions[site];n.credits-=cost;a[kind]=Math.min(100,a[kind]+15);return n}
