/* Chess Odyssey: accessible header Login and device-local text-only zoom. */
(function(root){
"use strict";
const $=id=>document.getElementById(id);
const KEY="chess-odyssey-text-zoom-v1",LEVELS=[90,100,110,120,130];
const labels={
 ru:{login:"Войти",account:"Аккаунт",zoomIn:"Увеличить текст",zoomOut:"Уменьшить текст",zoomReset:"Обычный размер текста",close:"Закрыть вход",dialog:"Вход в Chess Odyssey"},
 en:{login:"Login",account:"Account",zoomIn:"Increase text size",zoomOut:"Decrease text size",zoomReset:"Reset text size",close:"Close login",dialog:"Chess Odyssey sign in"},
 az:{login:"Daxil ol",account:"Hesab",zoomIn:"Mətni böyüt",zoomOut:"Mətni kiçilt",zoomReset:"Mətn ölçüsünü sıfırla",close:"Girişi bağla",dialog:"Chess Odyssey hesabına giriş"}
};
let level=100,lastFocused=null,origin=null,next=null,account=null;
const locale=()=>["ru","en","az"].includes($("global-language")?.value)?$("global-language").value:"ru";
function translation(){return labels[locale()]}
function applyZoom(value){
 const n=Number(value);level=LEVELS.includes(n)?n:100;
 document.documentElement.style.setProperty("--chess-reading-scale",String(level/100));
 if($("header-zoom-value"))$("header-zoom-value").textContent=level+"%";
 $("header-zoom-out").disabled=level===LEVELS[0];
 $("header-zoom-in").disabled=level===LEVELS[LEVELS.length-1];
 try{localStorage.setItem(KEY,String(level))}catch(_){}
 return level;
}
function update(){
 const d=translation(),signed=Boolean(root.ChessCloud?.authenticated?.());
 $("header-login").textContent=signed?d.account:d.login;
 $("header-login").setAttribute("aria-label",signed?d.account:d.login);
 $("header-zoom-in").setAttribute("aria-label",d.zoomIn);
 $("header-zoom-out").setAttribute("aria-label",d.zoomOut);
 $("header-zoom-value").setAttribute("aria-label",d.zoomReset);
 $("header-account-title").textContent=d.dialog;
 $("header-account-close").setAttribute("aria-label",d.close);
}
function openAccount(){
 const dialog=$("header-account-dialog"),panel=$("cloud-account");
 if(!dialog||!panel)return;
 if(!origin){origin=panel.parentNode;next=panel.nextSibling;account=panel}
 lastFocused=document.activeElement;
 dialog.querySelector(".header-dialog-content").appendChild(panel);
 if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
 update();
 if(!$("cloud-auth-form").hidden)$("cloud-email")?.focus();else $("header-account-close")?.focus();
}
function closeAccount(){
 const dialog=$("header-account-dialog");
 if(!dialog)return;
 if(dialog.open&&typeof dialog.close==="function")dialog.close();
 else {dialog.removeAttribute("open");restoreAccount()}
}
function restoreAccount(){
 if(account&&origin&&account.parentNode!==origin){
  if(next&&next.parentNode===origin)origin.insertBefore(account,next);
  else origin.appendChild(account);
 }
 lastFocused?.focus?.();lastFocused=null;
}
function init(){
 if(!$("header-login")||!$("cloud-account"))return;
 const dialog=$("header-account-dialog");
 try{const stored=Number(localStorage.getItem(KEY));applyZoom(LEVELS.includes(stored)?stored:100)}catch(_){applyZoom(100)}
 $("header-login").addEventListener("click",openAccount);
 $("header-account-close").addEventListener("click",closeAccount);
 dialog.addEventListener("close",restoreAccount);
 dialog.addEventListener("cancel",()=>{ /* native Esc closes and restores in close handler */ });
 dialog.addEventListener("click",event=>{if(event.target===dialog)closeAccount()});
 $("header-zoom-out").addEventListener("click",()=>applyZoom(LEVELS[Math.max(0,LEVELS.indexOf(level)-1)]));
 $("header-zoom-in").addEventListener("click",()=>applyZoom(LEVELS[Math.min(LEVELS.length-1,LEVELS.indexOf(level)+1)]));
 $("header-zoom-value").addEventListener("click",()=>applyZoom(100));
 $("global-language")?.addEventListener("change",update);
 root.addEventListener("chess-cloud-session",update);
 update();
 root.ChessHeader=Object.freeze({openAccount,closeAccount,zoom:()=>level});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})(window);
