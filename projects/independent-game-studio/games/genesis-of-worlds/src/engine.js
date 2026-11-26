const clamp=(v,a=0,z=1)=>Math.min(z,Math.max(a,v));
function start(){return {version:1,year:0,t:-59,p:.636,o:.0008,w:0,b:0,controls:[0,0,0,0,0]}}
function valid(s){return !!s&&s.version===1&&Number.isSafeInteger(s.year)&&s.year>=0&&s.year<=1000000&&["t","p","o","w","b"].every(k=>Number.isFinite(s[k]))&&s.t>=-100&&s.t<=70&&s.p>=.01&&s.p<=180&&s.o>=0&&s.o<=s.p&&s.w>=0&&s.w<=100&&s.b>=0&&s.b<=100&&Array.isArray(s.controls)&&s.controls.length===5&&s.controls.every(v=>Number.isFinite(v)&&v>=-1&&v<=1)}
function liquid(s){return clamp((s.t+12)/28)*clamp((s.p-.61)/12)*s.w}
function suitability(s){return clamp(1-Math.abs(s.t-15)/45)*clamp(1-Math.abs(s.p-100)/85)*clamp(1-Math.abs(s.o-21)/21)*clamp(liquid(s)/25)}
function step(s){if(!valid(s))throw Error("invalid state");if(s.year===1000000)return {...s,controls:[...s.controls]};let [heat,air,oxy,water,seed]=s.controls;let t=clamp(s.t+heat*1.8+clamp(s.p/100)*.12,-100,70);let p=clamp(s.p+air*2.1-.001*s.p,.01,180);let o=clamp(s.o+oxy*.65+s.b*.003,0,p);let w=clamp(s.w+water*1.4-Math.max(0,t-45)*.008,0,100);let n={...s,t,p,o,w,year:s.year+1,controls:[...s.controls]};let f=suitability(n);n.b=clamp(s.b+Math.max(0,seed)*f*2.2+s.b*.015*(2*f-1)+Math.min(0,seed)*2,0,100);return n}
function preset(i){let s=start();if(i===1)Object.assign(s,{t:-4,p:42,o:7,w:40,b:8});if(i===2)Object.assign(s,{t:15,p:101.3,o:21.2,w:78,b:92});return s}
let molaGrid=null;
function installMola(data){if(!data||data.length!==360*180||!Array.from(data).every(v=>Number.isInteger(v)&&v>=-10000&&v<=25000))throw Error("invalid MOLA grid");molaGrid=data}
function elevation(x,y,z){
 if(!molaGrid)return null;
 const lon=(Math.atan2(x,z)*180/Math.PI+360)%360,lat=Math.asin(clamp(y,-1,1))*180/Math.PI;
 const u=lon-.5,v=clamp(89.5-lat,0,179),j=Math.floor(v),k=(j+1<180?j+1:j),i=Math.floor(u),f=u-i,t=v-j;
 const at=(row,col)=>molaGrid[row*360+(col+360)%360];
 return (at(j,i)*(1-f)+at(j,i+1)*f)*(1-t)+(at(k,i)*(1-f)+at(k,i+1)*f)*t
}
function terrain(x,y,z){const m=elevation(x,y,z);if(m!==null)return clamp((m+8500)/30000);return .49+.20*Math.sin(3.7*x+2.1*z)*Math.cos(3.9*y-1.7*z)+.12*Math.sin(9*x+4*y)*Math.cos(7*z-4*y)+.07*Math.sin(19*x-8*z+4*y)*Math.cos(13*y+7*z)+.035*Math.sin(41*x+31*y-19*z)*Math.cos(39*z+11*y)-.14*y}
function pixel(x,y,z,angle,s){let u=x*Math.cos(angle)+z*Math.sin(angle),v=-x*Math.sin(angle)+z*Math.cos(angle);let e=terrain(u,y,v),wet=liquid(s)/100,level=molaGrid?clamp((-8500+wet*12000+8500)/30000):.12+wet*.82;let noise=.5+.5*Math.sin(61*u+23*y)*Math.cos(47*v-11*y);let ice=Math.abs(y)>.84+clamp((s.t+59)/130)*.14;let green=clamp(s.b/100)*clamp((s.t+12)/22);let c;if(ice)c=[202,211,208];else if(wet>.001&&e<level)c=[20+30*e,68+65*e,107+85*e];else{let desert=[154+73*e,70+75*e,41+47*e];let life=[61+78*e,105+69*e,48+35*e];let blend=clamp(green*(.6+.65*Math.sin(6*u+5*y)**2));c=desert.map((q,i)=>q*(1-blend)+life[i]*blend)}let lighting=.16+.84*clamp(-.42*x+.39*y+.82*z);let detail=.81+.27*noise;let cloud=clamp(s.p/100)*wet*clamp((Math.sin(11*u+7*y+Math.sin(v*12))+Math.sin(16*v-5*y)-1.35)*.8);return c.map(q=>Math.round(clamp((q*(1-cloud)+225*cloud)*lighting*detail,0,255)))}
