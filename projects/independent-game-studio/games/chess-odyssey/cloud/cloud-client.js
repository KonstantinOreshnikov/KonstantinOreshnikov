/* Chess Odyssey — opt-in cross-device progress; offline game never depends on cloud. */
(function(){
"use strict";
const AUTH_BASE="https://ep-dawn-fog-b9hs1qdd.neonauth.c-7.eu-central-1.aws.neon.tech/chess_odyssey/auth";
const API="https://br-still-credit-b9voxawu-chesscloud.compute.c-7.eu-central-1.aws.neon.tech";
const DB="https://ep-dawn-fog-b9hs1qdd.apirest.c-7.eu-central-1.aws.neon.tech/chess_odyssey/rest/v1";
const SDK="https://esm.sh/@neondatabase/neon-js@0.9.0-beta?bundle&target=es2022";
const KEY="chess-odyssey-progress-v1",PRACTICE="chess-odyssey-v01";
const OWNER_KEY="chess-odyssey-cloud-owner-v1",PENDING_PREFIX="chess-odyssey-pending-v1:";
const $=id=>document.getElementById(id);
const dict={
 ru:{heading:"Аккаунт и облачный прогресс",explanation:"После регистрации прогресс начинается с нуля и автоматически сохраняется в облаке. Предыдущие тестовые результаты не переносятся.",email:"Email",password:"Пароль",otp:"Код подтверждения из письма",login:"Войти",signup:"Регистрация",verify:"Подтвердить email",send:"Отправить код",upload:"Синхронизировать сейчас",download:"Загрузить сохранённое",logout:"Выйти",disabled:"Облако доступно только на защищённом сайте GitHub Pages.",unavailable:"Облачный сервис недоступен; локальная игра сохранена.",signed:"Аккаунт: {email}",await:"Войдите, чтобы сохранить или загрузить прогресс.",verified:"Email подтверждён. Теперь войдите.",verifyNeeded:"Проверьте почту и введите код подтверждения.",logged:"Аккаунт загружен. Дальнейший прогресс синхронизируется автоматически.",sent:"Код отправлен на email.",saved:"Прогресс сохранён в Neon (ревизия {rev}).",empty:"Новый аккаунт: прогресс начинается с нуля.",loaded:"Облачный прогресс загружен. Локальная копия сохранена для восстановления.",confirm:"Заменить текущие результаты аккаунта облачной копией? Локальная копия будет сохранена.",conflict:"Облако изменилось на другом устройстве. Сначала загрузите актуальные данные.",bad:"Ошибка облачной операции. Локальный прогресс не изменён.",bye:"Выход выполнен. Прогресс аккаунта хранится на сервере.",noProgress:"Данные прогресса ещё не сформированы."},
 en:{heading:"Account & cloud progress",explanation:"New accounts start at zero and sync progress to the cloud automatically. Prior device tests are not imported.",email:"Email",password:"Password",otp:"Email verification code",login:"Sign in",signup:"Sign up",verify:"Verify email",send:"Send code",upload:"Sync now",download:"Load saved progress",logout:"Sign out",disabled:"Cloud sync is available only on the secure GitHub Pages site.",unavailable:"Cloud service unavailable; local play is preserved.",signed:"Account: {email}",await:"Sign in to save or load progress.",verified:"Email confirmed. Please sign in.",verifyNeeded:"Check email and enter the verification code.",logged:"Account loaded. Future progress syncs automatically.",sent:"Verification code sent.",saved:"Progress saved in Neon (revision {rev}).",empty:"New account: progress starts at zero.",loaded:"Cloud progress loaded; a local backup was saved.",confirm:"Replace local progress with cloud copy? A backup will be created.",conflict:"Cloud data changed on another device. Load it first.",bad:"Cloud operation failed; local progress unchanged.",bye:"Signed out. Account progress remains on the server.",noProgress:"No progress data recorded yet."},
 az:{heading:"Hesab və bulud inkişafı",explanation:"Yeni hesabda inkişaf sıfırdan başlayır və avtomatik buludda saxlanılır. Əvvəlki sınaq nəticələri köçürülmür.",email:"Email",password:"Şifrə",otp:"Email təsdiq kodu",login:"Daxil ol",signup:"Qeydiyyat",verify:"Emaili təsdiqlə",send:"Kodu göndər",upload:"İndi sinxronlaşdır",download:"Yadda saxlanmış inkişafı yüklə",logout:"Çıxış",disabled:"Bulud yalnız təhlükəsiz GitHub Pages saytında aktivdir.",unavailable:"Bulud xidməti əlçatan deyil; lokal oyun saxlanılıb.",signed:"Hesab: {email}",await:"İnkişafı saxlamaq/yükləmək üçün daxil olun.",verified:"Email təsdiqləndi. İndi daxil olun.",verifyNeeded:"Emailinizi yoxlayıb təsdiq kodunu daxil edin.",logged:"Hesab yükləndi. Sonrakı inkişaf avtomatik sinxronlaşdırılır.",sent:"Kod emailə göndərildi.",saved:"İnkişaf Neon-da saxlanıldı (reviziya {rev}).",empty:"Yeni hesab: inkişaf sıfırdan başlayır.",loaded:"Bulud inkişafı yükləndi; lokal ehtiyat nüsxə yaradıldı.",confirm:"Lokal inkişaf bulud nüsxəsi ilə əvəz edilsin? Əvvəl ehtiyat nüsxə yaradılacaq.",conflict:"Başqa cihazda bulud dəyişib. Əvvəl cari məlumatı yükləyin.",bad:"Bulud əməliyyatı alınmadı; lokal nəticələr dəyişmədi.",bye:"Çıxış tamamlandı. Hesab inkişafı serverdə saxlanılır.",noProgress:"Hələ inkişaf məlumatı yoxdur."}
};
let neon=null,session=null,revision=0,busy=false,locale="ru";
let accountReady=false,syncBlocked=false,syncTimer=null,syncActive=false;
const t=(key,params={})=>((dict[locale]||dict.ru)[key]||key).replace(/\{(\w+)\}/g,(_,k)=>params[k]===undefined?"":String(params[k]));
let statusMemo=null;
function paintStatus(message,err=false){const p=$("cloud-status");if(p){p.textContent=message;p.dataset.error=String(err)}}
const show=(message,err=false)=>{
 const key=Object.keys(dict[locale]||dict.ru).find(k=>t(k)===message);
 statusMemo=key?{key,params:{},err}:message===t("saved",{rev:revision})?{key:"saved",params:{rev:revision},err}:null;
 paintStatus(message,err);
};
function translate(){
 locale=["ru","en","az"].includes($("global-language")?.value)?$("global-language").value:"ru";
 const pairs=[["cloud-heading","heading"],["cloud-explanation","explanation"],["cloud-email-label","email"],["cloud-password-label","password"],["cloud-otp-label","otp"],["cloud-login","login"],["cloud-signup","signup"],["cloud-verify","verify"],["cloud-send-otp","send"],["cloud-upload","upload"],["cloud-download","download"],["cloud-logout","logout"]];
 for(const [id,key] of pairs)if($(id))$(id).textContent=t(key);
 if(session)$("cloud-identity").textContent=t("signed",{email:session.user?.email||""});
 if(statusMemo)paintStatus(t(statusMemo.key,statusMemo.params),statusMemo.err);
}
function buttons(){
 for(const id of ["cloud-login","cloud-signup","cloud-verify","cloud-send-otp","cloud-upload","cloud-download","cloud-logout"]){
  if(!$(id))continue;
  $(id).disabled=busy||(!session&&["cloud-upload","cloud-download","cloud-logout"].includes(id))||
   (!accountReady&&["cloud-upload","cloud-download"].includes(id));
 }
}
async function updateSession(){
 const {data,error}=await neon.auth.getSession();if(error)throw Error(error.message||"SESSION_ERROR");
 session=data?.session?data:null;
 const signed=!!session;
 $("cloud-auth-form").hidden=signed;$("cloud-signed-in").hidden=!signed;
 if(signed)$("cloud-identity").textContent=t("signed",{email:session.user?.email||""});
 buttons();window.dispatchEvent(new Event("chess-cloud-session"));return signed;
}
async function run(work){if(busy||!neon)return;busy=true;buttons();try{await work()}catch(e){show(e?.status===409?t("conflict"):t("bad"),true)}finally{busy=false;buttons()}}
const email=()=>$("cloud-email").value.trim();
async function token(){
 const {data,error}=await neon.auth.getSession();
 if(error)throw Error("SESSION_EXPIRED");
 const jwt=data?.session?.token;
 const parts=typeof jwt==="string"?jwt.split("."):[];
 if(parts.length!==3||parts.some(part=>!part||!/^[A-Za-z0-9_-]+$/.test(part)))throw Error("SESSION_EXPIRED");
 return jwt;
}
async function refreshRevision(){
 const response=await api("/api/progress");
 if(!Number.isSafeInteger(response?.revision)||response.revision<0)throw Error("INVALID_CLOUD_REVISION");
 revision=response.revision;
 return response;
}
async function api(path,{method="GET",body}={}){
 const controller=new AbortController();
 let timer;
 const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error("REQUEST_TIMEOUT"))},10000)});
 try{
  return await Promise.race([deadline,(async()=>{
   const jwt=await token();
   if(controller.signal.aborted)throw Error("REQUEST_TIMEOUT");
   const response=await fetch(API+path,{method,headers:{Authorization:"Bearer "+jwt,...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined,cache:"no-store",credentials:"omit",signal:controller.signal});
   const data=await response.json().catch(()=>({}));
   if(!response.ok){
    if(response.status===409&&path==="/api/progress")throw Object.assign(Error("STALE_PROGRESS_REVISION"),{status:409});
    throw Object.assign(Error((data.error||"API_ERROR")+" ("+response.status+")"),{status:response.status});
   }
   return data;
  })()]);
 }catch(e){if(controller.signal.aborted)throw Error("REQUEST_TIMEOUT");throw e}finally{clearTimeout(timer)}
}
function snapshot(){
 if(!accountReady||!session?.user?.id||localStorage.getItem(OWNER_KEY)!==session.user.id)return null;
 const raw=localStorage.getItem(KEY);if(!raw)return null;
 const progress=JSON.parse(raw);
 const local=JSON.parse(localStorage.getItem(PRACTICE)||"{}");
 const stats=local.stats&&["wins","losses","draws"].every(k=>Number.isSafeInteger(local.stats[k])&&local.stats[k]>=0)
  ?{wins:local.stats.wins,losses:local.stats.losses,draws:local.stats.draws}:{wins:0,losses:0,draws:0};
 return {schema:1,ownerId:session.user.id,progress,practiceCompleted:Array.isArray(local.completed)?local.completed:[],practiceStats:stats};
}
function backup(){
 const stamp=new Date().toISOString().replace(/[:.]/g,"-");
 const local={progress:localStorage.getItem(KEY),practice:localStorage.getItem(PRACTICE)};
 const key="chess-odyssey-cloud-backup-"+stamp;
 localStorage.setItem(key,JSON.stringify(local));
 return key;
}
function requireOwner(){
 const id=session?.user?.id;
 if(typeof id!=="string"||!id||id.length>255)throw Error("MISSING_ACCOUNT_ID");
 return id;
}
function pendingKey(){return PENDING_PREFIX+requireOwner();}
function validateDoc(doc){
 if(!doc)return null;
 if(doc.schema!==1||typeof doc.progress!=="object"||!doc.progress||Array.isArray(doc.progress))
  throw Error("INVALID_CLOUD_DOCUMENT");
 if(doc.ownerId!==requireOwner())throw Error("CLOUD_OWNER_MISMATCH");
 return doc;
}
function applyAccountDocument(doc){
 // Always replace any pre-v1 local test data with server-owned state, even on first sign-in.
 const clean=validateDoc(doc);
 if(!window.ChessOdysseyAccount?.apply||!window.ChessProgress?.restoreCloudStore||!window.ChessProgressCore?.empty)
  throw Error("ACCOUNT_MODULE_NOT_READY");
 localStorage.setItem(OWNER_KEY,requireOwner());
 window.ChessOdysseyAccount.apply(clean);
 window.ChessProgress.restoreCloudStore(clean?clean.progress:window.ChessProgressCore.empty());
 document.dispatchEvent(new Event("chess-progress-change"));
}
async function activateAccount(){
 accountReady=false;syncBlocked=false;buttons();
 const remote=await refreshRevision();
 const oldPending=localStorage.getItem(pendingKey());
 if(oldPending){
  // Preserve the already-owned unsent work. Never silently overwrite the server after a conflict.
  const doc=validateDoc(JSON.parse(oldPending));
  applyAccountDocument(doc);syncBlocked=true;
  accountReady=true;buttons();document.dispatchEvent(new Event("chess-progress-change"));window.dispatchEvent(new Event("chess-cloud-session"));show(t("conflict"),true);return;
 }
 applyAccountDocument(remote.progressDoc||null);
 accountReady=true;buttons();document.dispatchEvent(new Event("chess-progress-change"));window.dispatchEvent(new Event("chess-cloud-session"));
 show(remote.progressDoc?t("loaded"):t("empty"));
}
function queueAutoSave(){
 if(!accountReady||syncBlocked||!session)return;
 const doc=snapshot();if(!doc)return;
 localStorage.setItem(pendingKey(),JSON.stringify(doc));
 if(syncTimer!==null)clearTimeout(syncTimer);
 syncTimer=setTimeout(()=>{syncTimer=null;void flushPending()},280);
}
async function flushPending(){
 if(syncActive||!accountReady||syncBlocked||!session)return;
 const key=pendingKey(),raw=localStorage.getItem(key);
 if(!raw)return;
 const doc=validateDoc(JSON.parse(raw));
 syncActive=true;
 try{
  const result=await api("/api/progress",{method:"PUT",body:{expectedRevision:revision,progressDoc:doc}});
  if(!Number.isSafeInteger(result?.revision)||result.revision<=revision)throw Error("INVALID_CLOUD_REVISION");
  revision=result.revision;
  if(localStorage.getItem(key)===raw)localStorage.removeItem(key);
  show(t("saved",{rev:revision}));
 }catch(error){
  if(error.status===409||error.message==="STALE_PROGRESS_REVISION")syncBlocked=true;
  show(syncBlocked?t("conflict"):t("bad"),true);
 }finally{
  syncActive=false;
  if(accountReady&&!syncBlocked&&localStorage.getItem(key)!==raw&&localStorage.getItem(key))
   queueAutoSave();
 }
}
async function upload(){
 if(!accountReady||syncBlocked){show(t("conflict"),true);return}
 queueAutoSave();
 if(syncTimer!==null){clearTimeout(syncTimer);syncTimer=null}
 await flushPending();
}
async function download(){
 if(!accountReady)return;
 const remote=await refreshRevision();
 const clean=validateDoc(remote.progressDoc);
 if(!clean){show(t("empty"));return}
 if(!window.confirm(t("confirm")))return;
 backup(); // backup only current authenticated account workspace; legacy test data never imports
 applyAccountDocument(clean);
 localStorage.removeItem(pendingKey());
 syncBlocked=false;buttons();show(t("loaded"));
}
async function clearAccount(){
 accountReady=false;syncBlocked=false;
 if(syncTimer!==null){clearTimeout(syncTimer);syncTimer=null}
 localStorage.removeItem(OWNER_KEY);
 if(window.ChessOdysseyAccount?.apply&&window.ChessProgress?.restoreCloudStore&&window.ChessProgressCore?.empty){
  window.ChessOdysseyAccount.apply(null);
  window.ChessProgress.restoreCloudStore(window.ChessProgressCore.empty());
 }
 revision=0;
 document.dispatchEvent(new Event("chess-progress-change"));
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
  window.ChessCloud=Object.freeze({api,authenticated:()=>accountReady,user:()=>accountReady?session?.user||null:null});
  if(await updateSession())await activateAccount();else show(t("await"));
 }catch(e){show(t("unavailable"),true);$("cloud-auth-form").hidden=true;return}
 const bind=(id,fn)=>$(id)?.addEventListener("click",()=>run(fn));
 bind("cloud-login",async()=>{const r=await neon.auth.signIn.email({email:email(),password:$("cloud-password").value});if(r.error)throw Error(r.error.message);await updateSession();await activateAccount();show(t("logged"))});
 bind("cloud-signup",async()=>{const r=await neon.auth.signUp.email({email:email(),password:$("cloud-password").value,name:email().split("@")[0]});if(r.error)throw Error(r.error.message);show(t("verifyNeeded"))});
 bind("cloud-send-otp",async()=>{const r=await neon.auth.emailOtp.sendVerificationOtp({email:email(),type:"email-verification"});if(r.error)throw Error(r.error.message);show(t("sent"))});
 bind("cloud-verify",async()=>{const r=await neon.auth.emailOtp.verifyEmail({email:email(),otp:$("cloud-otp").value.trim()});if(r.error)throw Error(r.error.message);if(await updateSession())await activateAccount();show(t("verified"))});
 bind("cloud-logout",async()=>{const r=await neon.auth.signOut();if(r.error)throw Error(r.error.message);session=null;await clearAccount();await updateSession();show(t("bye"))});
 bind("cloud-upload",upload);bind("cloud-download",download);
 window.addEventListener("chess-progress-commit",queueAutoSave);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
