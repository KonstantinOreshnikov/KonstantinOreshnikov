"use strict";
/* B10 release gate: all 10 board palettes × 10 SVG sets in Chromium (no accounts/network). */
const assert=require("node:assert/strict");
const path=require("node:path");
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 let count=0;
 const check=async(label,fn)=>{await fn();console.log("PASS Chess Appearance "+(++count)+" "+label)};
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  await page.goto("file://"+path.resolve(__dirname,"../index.html"));
  await page.waitForFunction(()=>document.querySelectorAll("#board .square").length===64&&
    document.querySelectorAll("#m-board .square").length===64&&
    document.querySelectorAll("#pvp-board .square").length===64);
  await check("10×10 combinations applied consistently to three 64-square boards",async()=>{
   const report=await page.evaluate(async()=>{
    const themes=window.ChessAppearance.THEMES,styles=window.ChessAppearance.STYLES;
    const boards=["board","m-board","pvp-board"].map(id=>document.getElementById(id));
    const failures=[];
    for(const theme of themes){
     document.getElementById("board-theme-details").open=true;
     document.querySelector('#theme-options [data-value="'+theme.id+'"]').click();
     for(const style of styles){
      document.getElementById("piece-style-details").open=true;
      document.querySelector('#piece-options [data-value="'+style.id+'"]').click();
      for(const board of boards){
       if(board.dataset.theme!==theme.id||board.dataset.pieces!==style.id)failures.push(theme.id+"/"+style.id+"/"+board.id+": dataset");
       if(board.style.getPropertyValue("--board-light")!==theme.light||board.style.getPropertyValue("--board-dark")!==theme.dark)
        failures.push(theme.id+"/"+style.id+"/"+board.id+": CSS palette");
       if(board.querySelectorAll(".square").length!==64)failures.push(theme.id+"/"+style.id+"/"+board.id+": squares");
      }
      for(const board of boards){
       const piece=board.querySelector(".piece[data-code=wN]");
       if(piece){
        const bg=getComputedStyle(piece).backgroundImage;
        if(!bg.includes("/"+style.source+"/wN.svg"))failures.push(theme.id+"/"+style.id+"/"+board.id+": piece "+bg);
       }
      }
     }
    }
    return {combinations:themes.length*styles.length,boards:boards.map(x=>x.id),failures};
   });
   assert.equal(report.combinations,100);
   assert.deepEqual(report.failures,[],JSON.stringify(report.failures.slice(0,8)));
   assert.deepEqual(report.boards,["board","m-board","pvp-board"]);
  });
  await check("each SVG set loads representative white/black pieces",async()=>{
   const result=await page.evaluate(async()=>{
    const failures=[];
    for(const style of window.ChessAppearance.STYLES){
     document.getElementById("piece-style-details").open=true;
     document.querySelector('#piece-options [data-value="'+style.id+'"]').click();
     for(const code of ["wN","bQ"]){
      const piece=document.querySelector("#board .piece[data-code="+code+"]");
      if(!piece){failures.push(style.id+"/"+code+": no piece");continue}
      const bg=getComputedStyle(piece).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);
      if(!bg){failures.push(style.id+"/"+code+": no SVG url");continue}
      const loaded=await new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0&&img.naturalHeight>0);img.onerror=()=>resolve(false);img.src=bg[1]});
      if(!loaded)failures.push(style.id+"/"+code+": SVG failed");
     }
    }
    return failures;
   });
   assert.deepEqual(result,[]);
  });
  await check("all three locales expose 10 localized theme and piece options",async()=>{
   const data=await page.evaluate(()=>{
    const failures=[],langs=["ru","en","az"];
    for(const lang of langs){
     window.ChessAppearance.setLanguage(lang,document);
     for(const kind of [["board-theme-details","theme-options","THEMES"],["piece-style-details","piece-options","STYLES"]]){
      document.getElementById(kind[0]).open=true;
      const options=[...document.querySelectorAll("#"+kind[1]+" button")];
      const expected=window.ChessAppearance[kind[2]];
      if(options.length!==10)failures.push(lang+"/"+kind[1]+": count");
      expected.forEach((item,i)=>{
       if(!options[i]?.textContent.includes(item.name[langs.indexOf(lang)]))
        failures.push(lang+"/"+kind[1]+"/"+item.id+": untranslated");
      });
     }
    }
    return failures;
   });
   assert.deepEqual(data,[]);
  });
  await check("last chosen palette and piece set persist through page reload",async()=>{
   await page.evaluate(()=>{
    document.getElementById("board-theme-details").open=true;
    document.querySelector('#theme-options [data-value="sea"]').click();
    document.getElementById("piece-style-details").open=true;
    document.querySelector('#piece-options [data-value="metal"]').click();
   });
   await page.reload();
   await page.waitForFunction(()=>document.querySelectorAll("#board .square").length===64);
   const state=await page.evaluate(()=>({theme:document.querySelector("#board").dataset.theme,pieces:document.querySelector("#board").dataset.pieces}));
   assert.deepEqual(state,{theme:"sea",pieces:"metal"});
  });
  await check("mobile 390px screen has no horizontal overflow",async()=>{
   await page.setViewportSize({width:390,height:844});
   const size=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.viewport+3,JSON.stringify(size));
  });
  await check("no JS runtime exceptions",async()=>assert.deepEqual(errors,[]));
  console.log("PASS Chess Appearance "+count+"/"+count);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
