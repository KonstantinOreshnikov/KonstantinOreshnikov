/* B7 real Chromium accessibility checks using axe-core WCAG 2.2 A/AA rules.
 * This is automated a11y evidence, NOT a substitute for screen-reader human QA.
 */
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const {chromium}=require("playwright");
const AxeBuilder=require("@axe-core/playwright").default;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CHESS_CHROME_CHANNEL||undefined,args:["--no-sandbox"]});
 const ctx=await browser.newContext({viewport:{width:1280,height:860}});
 const page=await ctx.newPage();let done=0;
 const URL_FOR=name=>"file://"+path.resolve(__dirname,"../"+name);
 const checked=[];
 try{
  await page.goto(URL_FOR("index.html"));
  await page.waitForFunction("window.ChessOdysseyQA && window.ChessMastersQA && window.ChessProgressQA");
  for(const width of [1280,390]){
   await page.setViewportSize({width,height:860});
   for(const [tab,label] of [["#nav-play","Practice"],["#nav-masters","Masters"],["#nav-progress","Progress"]]){
    await page.locator(tab).click();
    const r=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
    const serious=r.violations.filter(v=>v.impact==="critical"||v.impact==="serious").map(v=>({
      id:v.id,impact:v.impact,description:v.help,nodes:v.nodes.slice(0,6).map(n=>n.target)
    }));
    checked.push({width,label,violations:r.violations.length,serious});
    assert.deepEqual(serious,[],JSON.stringify({width,label,serious}));
    done++;console.log("PASS B7 accessibility "+width+"px "+label+" (0 serious/critical)");
   }
  }
  await page.locator("#nav-play").click();
  await page.selectOption("#lesson","promotion");
  await page.locator('#board button[aria-label^="a7 "]').click();
  await page.locator('#board button[aria-label^="a8 "]').click();
  assert.equal(await page.locator("#promotion").isVisible(),true);
  const dialog=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  const serious=dialog.violations.filter(v=>v.impact==="critical"||v.impact==="serious").map(v=>({
    id:v.id,impact:v.impact,nodes:v.nodes.slice(0,5).map(n=>n.target)
  }));
  checked.push({width:390,label:"Promotion dialog",violations:dialog.violations.length,serious});
  assert.deepEqual(serious,[],JSON.stringify(serious));done++;
  console.log("PASS B7 accessibility promotion dialog (0 serious/critical)");
  console.log("PASS B7 axe real Chrome "+done+" / "+done+"; audits="+JSON.stringify(checked.map(x=>({width:x.width,view:x.label,allSeverityViolations:x.violations}))));
 }finally{await browser.close();}
})().catch(e=>{console.error("FAIL B7 axe accessibility",e);process.exitCode=1;});
