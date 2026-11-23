/* Chess Odyssey — opt-in cross-device progress; offline game never depends on cloud. */
(function(){
"use strict";
const AUTH_BASE="https://ep-dawn-fog-b9hs1qdd.neonauth.c-7.eu-central-1.aws.neon.tech/chess_odyssey/auth";
const API="https://br-still-credit-b9voxawu-chesscloud.compute.c-7.eu-central-1.aws.neon.tech";
const DB="https://ep-dawn-fog-b9hs1qdd.apirest.c-7.eu-central-1.aws.neon.tech/chess_odyssey/rest/v1";
const SDK="https://esm.sh/@neondatabase/neon-js@0.9.0-beta?bundle&target=es2022";
const KEY="chess-odyssey-progress-v1",PRACTICE="chess-odyssey-v01";
const $=id=>document.getElementById(id);
const dict={
 ru:{heading:"Аккаунт и облачный прогресс",explanation:"Локальная игра работает без аккаунта. Синхронизация только вручную: загрузка требует подтверждения.",email:"Email",password:"Пароль",otp:"Код подтверждения из письма",login:"Войти",signup:"Регистрация",verify:"Подтвердить email",send:"Отправить код",upload:"Сохранить локальный прогресс",download:"Загрузить из облака",logout:"Выйти",disabled:"Облако доступно только на защищённом сайте GitHub Pages.",unavailable:"Облачный сервис недоступен; локальная игра сохранена.",signed:"Аккаунт: {email}",await:"Войдите, чтобы сохранить или загрузить прогресс.",verified:"Email подтверждён. Теперь войдите.",verifyNeeded:"Проверьте почту и введите код подтверждения.",logged:"Вход выполнен. Локальная статистика пока не изменена.",sent:"Код отправлен на email.",saved:"Прогресс сохранён в Neon (ревизия {rev}).",empty:"Облачного прогресса пока нет. Локальные данные не изменены.",loaded:"Облачный прогресс загружен. Локальная копия сохранена для восстановления.",confirm:"Заменить локальную статистику облачной? Перед заменой будет создана резервная копия.",conflict:"Облако изменилось на другом устройстве. Сначала загрузите актуальные данные.",bad:"Ошибка облачной операции. Локальный прогресс не изменён.",bye:"Выход выполнен. Локальный прогресс сохранён.",noProgress:"Данные прогресса ещё не сформированы."},
 en:{heading:"Account & cloud progress",explanation:"Offline play never needs an account. Sync is manual; download requires confirmation.",email:"Email",password:"Password",otp:"Email verification code",login:"Sign in",signup:"Sign up",verify:"Verify email",send:"Send code",upload:"Save local progress",download:"Load from cloud",logout:"Sign out",disabled:"Cloud sync is available only on the secure GitHub Pages site.",unavailable:"Cloud service unavailable; local play is preserved.",signed:"Account: {email}",await:"Sign in to save or load progress.",verified:"Email confirmed. Please sign in.",verifyNeeded:"Check email and enter the verification code.",logged:"Signed in. Local progress is unchanged.",sent:"Verification code sent.",saved:"Progress saved in Neon (revision {rev}).",empty:"No cloud progress yet; local data unchanged.",loaded:"Cloud progress loaded; a local backup was saved.",confirm:"Replace local progress with cloud copy? A backup will be created.",conflict:"Cloud data changed on another device. Load it first.",bad:"Cloud operation failed; local progress unchanged.",bye:"Signed out. Local progress retained.",noProgress:"No progress data recorded yet."},
 az:{heading:"Hesab və bulud inkişafı",explanation:"Oflayn oyun üçün hesab lazım deyil. Sinxronizasiya əl ilə aparılır; yükləmə təsdiq tələb edir.",email:"Email",password:"Şifrə",otp:"Email təsdiq kodu",login:"Daxil ol",signup:"Qeydiyyat",verify:"Emaili təsdiqlə",send:"Kodu göndər",upload:"Lokal inkişafı saxla",download:"Buluddan yüklə",logout:"Çıxış",disabled:"Bulud yalnız təhlükəsiz GitHub Pages saytında aktivdir.",unavailable:"Bulud xidməti əlçatan deyil; lokal oyun saxlanılıb.",signed:"Hesab: {email}",await:"İnkişafı saxlamaq/yükləmək üçün daxil olun.",verified:"Email təsdiqləndi. İndi daxil olun.",verifyNeeded:"Emailinizi yoxlayıb təsdiq kodunu daxil edin.",logged:"Daxil oldunuz. Lokal nəticələr dəyişmədi.",sent:"Kod emailə göndərildi.",saved:"İnkişaf Neon-da saxlanıldı (reviziya {rev}).",empty:"Buludda məlumat yoxdur. Lokal nəticələr dəyişmədi.",loaded:"Bulud inkişafı yükləndi; lokal ehtiyat nüsxə yaradıldı.",confirm:"Lokal inkişaf bulud nüsxəsi ilə əvəz edilsin? Əvvəl ehtiyat nüsxə yaradılacaq.",conflict:"Başqa cihazda bulud dəyişib. Əvvəl cari məlumatı yükləyin.",bad:"Bulud əməliyyatı alınmadı; lokal nəticələr dəyişmədi.",bye:"Çıxış tamamlandı. Lokal inkişaf saxlanıldı.",noProgress:"Hələ inkişaf məlumatı yoxdur."}
};
let neon=null,session=null,revision=0,busy=false,locale="ru";
const t=(key,params={})=>((dict[locale]||dict.ru)[key]||key).replace(/\{(\w+)\}/g,(_,k)=>params[k]===undefined?"":String(params[k]));
const show=(message,err=false)=>{const p=$("cloud-status");if(p){p.textContent=message;p.dataset.error=String(err)}};
function translate(){
 locale=["ru","en","az"].includes($("global-language")?.value)?$("global-language").value:"ru";
 const pairs=[["cloud-heading","heading"],["cloud-explanation","explanation"],["cloud-email-label","email"],["cloud-password-label","password"],["cloud-otp-label","otp"],["cloud-login","login"],["cloud-signup","signup"],["cloud-verify","verify"],["cloud-send-otp","send"],["cloud-upload","upload"],["cloud-download","download"],["cloud-logout","logout"]];
 for(const [id,key] of pairs)if($(id))$(id).textContent=t(key);
 if(session)$("cloud-identity").textContent=t("signed",{email:session.user?.email||""});
}
function buttons(){for(const id of ["cloud-login","cloud-signup","cloud-verify","cloud-send-otp","cloud-upload","cloud-download","cloud-logout"])if($(id))$(id).disabled=busy||(!session&&["cloud-upload","cloud-download","cloud-logout"].includes(id));}
async function updateSession(){
 const {data,error}=await neon.auth.getSession();if(error)throw Error(error.message||"SESSION_ERROR");
 session=data?.session?data:null;
 const signed=!!session;
 $("cloud-auth-form").hidden=signed;$("cloud-signed-in").hidden=!signed;
 if(signed)$("cloud-identity").textContent=t("signed",{email:session.user?.email||""});
 buttons();window.dispatchEvent(new Event("chess-cloud-session"));return signed;
}
async function run(work){if(busy||!neon)return;busy=true;buttons();try{await work()}catch(e){show((e?.message&&e.message.length<160)?e.message:t("bad"),true)}finally{busy=false;buttons()}}
const email=()=>$("cloud-email").value.trim();
async function token(){
 if(typeof neon?.auth?.getJWTToken!=="function")throw Error("JWT_PROVIDER_UNAVAILABLE");
 const jwt=await neon.auth.getJWTToken();
 const parts=typeof jwt==="string"?jwt.split("."):[];
 if(parts.length!==3||parts.some(part=>!part||!/^[A-Za-z0-9_-]+$/.test(part)))throw Error("SESSION_EXPIRED");
 return jwt;
}
async function api(path,{method="GET",body}={}){
 const response=await fetch(API+path,{method,headers:{Authorization:"Bearer "+await token(),...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined,cache:"no-store",credentials:"omit"});
 const data=await response.json().catch(()=>({}));
 if(!response.ok){if(response.status===409)throw Error(t("conflict"));throw Error((data.error||"API_ERROR")+" ("+response.status+")");}
 return data;
}
function snapshot(){
 const raw=localStorage.getItem(KEY);if(!raw)return null;
 const progress=JSON.parse(raw);
 const local=JSON.parse(localStorage.getItem(PRACTICE)||"{}");
 return {schema:1,progress,practiceCompleted:Array.isArray(local.completed)?local.completed:[]};
}
function backup(){
 const stamp=new Date().toISOString().replace(/[:.]/g,"-");
 const local={progress:localStorage.getItem(KEY),practice:localStorage.getItem(PRACTICE)};
 const key="chess-odyssey-cloud-backup-"+stamp;
 localStorage.setItem(key,JSON.stringify(local));
 return key;
}
async function upload(){
 const doc=snapshot();if(!doc){show(t("noProgress"));return}
 const r=await api("/api/progress",{method:"PUT",body:{expectedRevision:revision,progressDoc:doc}});
 revision=r.revision;show(t("saved",{rev:revision}));
}
async function download(){
 const r=await api("/api/progress");revision=r.revision;
 if(!r.progressDoc){show(t("empty"));return}
 const doc=r.progressDoc;
 if(doc.schema!==1||typeof doc.progress!=="object"||!doc.progress||Array.isArray(doc.progress))throw Error("INVALID_CLOUD_DOCUMENT");
 if(!window.confirm(t("confirm")))return;
 const previous=backup();
 try{
  if(!window.ChessProgress?.restoreCloudStore)throw Error("PROGRESS_MODULE_NOT_READY");
  window.ChessProgress.restoreCloudStore(doc.progress);
  if(Array.isArray(doc.practiceCompleted)){
   const valid=new Set((window.ChessAcademy?.lessons||[]).map(x=>x.id));
   const clean=[...new Set(doc.practiceCompleted.filter(x=>typeof x==="string"&&valid.has(x)))];
   const practice=JSON.parse(localStorage.getItem(PRACTICE)||"{}");
   practice.completed=clean;localStorage.setItem(PRACTICE,JSON.stringify(practice));
  }
  document.dispatchEvent(new Event("chess-progress-change"));show(t("loaded"));
 }catch(e){
  const prior=JSON.parse(localStorage.getItem(previous)||"{}");
  if(prior.progress===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,prior.progress);
  if(prior.practice===null)localStorage.removeItem(PRACTICE);else localStorage.setItem(PRACTICE,prior.practice);
  throw e;
 }
}
async function init(){
 if(!$("cloud-account"))return;
 translate();buttons();
 $("global-language")?.addEventListener("change",translate);
 if(location.protocol!=="https:"||location.origin!=="https://konstantinoreshnikov.github.io"){
  show(t("disabled"));$("cloud-auth-form").hidden=true;return;
 }
 try{
  const m=await import(SDK);neon=m.createClient({auth:{url:AUTH_BASE},dataApi:{url:DB}});
  window.ChessCloud=Object.freeze({api,authenticated:()=>!!session,user:()=>session?.user||null});
  if(await updateSession())show(t("logged"));else show(t("await"));
 }catch(e){show(t("unavailable"),true);$("cloud-auth-form").hidden=true;return}
 const bind=(id,fn)=>$(id)?.addEventListener("click",()=>run(fn));
 bind("cloud-login",async()=>{const r=await neon.auth.signIn.email({email:email(),password:$("cloud-password").value});if(r.error)throw Error(r.error.message);await updateSession();show(t("logged"))});
 bind("cloud-signup",async()=>{const r=await neon.auth.signUp.email({email:email(),password:$("cloud-password").value,name:email().split("@")[0]});if(r.error)throw Error(r.error.message);show(t("verifyNeeded"))});
 bind("cloud-send-otp",async()=>{const r=await neon.auth.emailOtp.sendVerificationOtp({email:email(),type:"email-verification"});if(r.error)throw Error(r.error.message);show(t("sent"))});
 bind("cloud-verify",async()=>{const r=await neon.auth.emailOtp.verifyEmail({email:email(),otp:$("cloud-otp").value.trim()});if(r.error)throw Error(r.error.message);await updateSession();show(t("verified"))});
 bind("cloud-logout",async()=>{const r=await neon.auth.signOut();if(r.error)throw Error(r.error.message);session=null;revision=0;await updateSession();show(t("bye"))});
 bind("cloud-upload",upload);bind("cloud-download",download);
 if(session)try{revision=(await api("/api/progress")).revision}catch{show(t("unavailable"),true)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
