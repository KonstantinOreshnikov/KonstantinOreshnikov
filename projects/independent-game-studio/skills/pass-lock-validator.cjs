"use strict";
function decide(row,current,event=null){
 const keys=["objectId","gateId","scopeHash","dependencyHash","environment","contractVersion"];
 const complete=o=>o&&keys.every(k=>typeof o[k]==="string"&&o[k].trim().length>0)&&["scopeHash","dependencyHash"].every(k=>/^[a-f0-9]{64}$/.test(o[k]));
 if(!complete(row)||!complete(current))return "INVESTIGATE_IDENTITY";
 if(row.status!=="PASS"||!row.evidence||!row.reviewer||typeof row.independentRequired!=="boolean"||typeof current.independentRequired!=="boolean"||((row.independentRequired||current.independentRequired)&&row.independentVerified!==true))return "QA_REQUIRED";
 if(keys.some(k=>row[k]!==current[k]))return "DELTA_QA";
 if(event&&event.objectId===current.objectId&&event.gateId===current.gateId&&["CRITICAL_DEFECT","INTEGRITY_MISMATCH","BINDING_SOURCE_CHANGE","AFFECTED_DEPENDENCY"].includes(event.reason)&&typeof event.evidence==="string"&&event.evidence.trim()&&event.verified===true)return "TARGETED_REOPEN";
 if(event&&event.objectId===current.objectId&&event.gateId===current.gateId)return "INVESTIGATE_EVENT";
 return "REUSE_PASS";
}
function selfTest(){const r={objectId:"q1",gateId:"language",scopeHash:"a".repeat(64),dependencyHash:"b".repeat(64),environment:"content",contractVersion:"1",status:"PASS",evidence:"ledger#1",reviewer:"checker",independentRequired:true,independentVerified:true};const cases=[[r,r,null,"REUSE_PASS"],[r,{...r,scopeHash:"c".repeat(64)},null,"DELTA_QA"],[r,{...r,environment:"production"},null,"DELTA_QA"],[r,{...r,dependencyHash:"d".repeat(64)},null,"DELTA_QA"],[{...r,independentVerified:false},r,null,"QA_REQUIRED"],[{...r,status:"BLOCKED"},r,null,"QA_REQUIRED"],[r,r,{objectId:"q1",gateId:"language",reason:"CRITICAL_DEFECT",evidence:"issue",verified:true},"TARGETED_REOPEN"],[r,r,{objectId:"q2",gateId:"language",reason:"CRITICAL_DEFECT",evidence:"issue",verified:true},"REUSE_PASS"],[r,r,{objectId:"q1",gateId:"language",reason:"CRITICAL_DEFECT"},"INVESTIGATE_EVENT"],[r,{...r,scopeHash:""},null,"INVESTIGATE_IDENTITY"],[r,{...r,contractVersion:"2"},null,"DELTA_QA"],[{...r,evidence:""},r,null,"QA_REQUIRED"]];return cases.map(([a,b,c,w],i)=>({case:i+1,expected:w,actual:decide(a,b,c)}))}
module.exports={decide,selfTest};
if(require.main===module){const results=selfTest();console.log(JSON.stringify(results,null,2));if(results.some(x=>x.actual!==x.expected))process.exitCode=1;}
