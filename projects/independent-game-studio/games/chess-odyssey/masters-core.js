/* Chess Odyssey Masters B5 — original replay/QA engine.
 * chess.js is the only authority for chess legality, game-over and SAN.
 * No chess evaluations, fake Elo, third-party annotations or external APIs.
 */
(function(root,factory){
 "use strict";const output=factory();
 if(typeof module==="object"&&module.exports)module.exports=output;
 else root.ChessMastersCore=output;
})(typeof window!=="undefined"?window:this,function(){
"use strict";
const languages=Object.freeze(["ru","en","az"]);
const category={
 development:"attack",sacrifice:"attack",attack:"attack",tactics:"attack",combination:"attack",
 strategy:"strategy",positional:"strategy",defence:"strategy",opening:"strategy",zugzwang:"strategy",
 pawn:"endgame",endgame:"endgame",king:"endgame",machine:"machine"
};
function referencePly(anchor){
 const m=/^(\d{1,3})([wb]):([a-hKQRBNO0][a-zA-Z0-9=+#x-]*)$/.exec(anchor);
 if(!m)return null;
 const full=Number(m[1]),side=m[2],san=m[3];
 if(!Number.isInteger(full)||full<1||full>300)return null;
 return {ply:(full-1)*2+(side==="b"?2:1),san,moveNumber:full,side};
}
function compile(Chess,source,commentaries){
 if(typeof Chess!=="function")throw new Error("chess.js constructor required");
 const failures=[],library=source&&Array.isArray(source.games)?source.games:[];
 const all=Array.isArray(commentaries)?commentaries.flat():[];
 const byId=new Map(all.map(n=>[n.id,n]));
 const games=[];const totalSet=new Set(),scoreSet=new Set();
 for(const g of library){
   if(!g||typeof g.id!=="string"||totalSet.has(g.id)){failures.push("Duplicate/empty game ID");continue;}
   totalSet.add(g.id);
   const note=byId.get(g.id);
   const expanded=g.collection==="championship-score";
   if(!note&&!expanded){failures.push(g.id+": missing original annotated lesson");continue;}
   if(note&&expanded)failures.push(g.id+": candidate must not masquerade as authored annotation");
   if(!["1-0","0-1","1/2-1/2"].includes(g.result))failures.push(g.id+": invalid recorded result");
   const provenance=expanded?
     g.source==="https://raw.githubusercontent.com/bgard68/ClaudeChessApp/main/public/games/world-championship-title-matches.pgn"&&
       Number.isSafeInteger(g.sourceIndex)&&g.sourceIndex>=0&&g.sourceIndex<1164&&/^wcc-/.test(g.id):
     /^https:\/\/chessgator\.com\/games\/[a-z0-9-]+$/.test(g.source);
   if(!provenance)failures.push(g.id+": invalid score provenance");
   const year=Number(g.year),match=g.id.match(/(\d{4})$/);
   if(!Number.isInteger(year)||year<1800||year>2026||(match&&Number(match[1])!==year))failures.push(g.id+": date mismatch");
   if(!g.white||!g.black||!g.event||!Array.isArray(g.moves)||g.moves.length<12||g.plies!==g.moves.length)failures.push(g.id+": incomplete source record");
   const display=note||g;
   if(!languages.every(k=>display.title&&display.title[k]&&display.summary&&display.summary[k]&&display.title[k].length>=12&&display.summary[k].length>=60))
     failures.push(g.id+": incomplete RU/EN/AZ title/summary");
   const key=g.moves.join(" ");
   if(scoreSet.has(key))failures.push(g.id+": duplicate full game moves");
   scoreSet.add(key);
   const board=new Chess(),positions=[board.fen()],moves=[];
   let broken=false;
   for(let i=0;i<g.moves.length;i++){
     const san=g.moves[i],move=board.move(san);
     if(!move){failures.push(g.id+": illegal move "+(i+1)+" "+san);broken=true;break;}
     if(move.san!==san)failures.push(g.id+": SAN normalisation mismatch "+(i+1));
     moves.push(Object.freeze({...move,ply:i+1}));
     positions.push(board.fen());
   }
   if(broken)continue;
   if(board.in_checkmate()){
     const win=board.turn()==="w"?"0-1":"1-0";
     if(win!==g.result)failures.push(g.id+": impossible recorded checkmate winner");
   }
   if(g.moves[g.moves.length-1].includes("#")&&!board.in_checkmate())failures.push(g.id+": # without checkmate");
   const selected=[];
   const seen=new Set();
   for(const m of note?.moments||[]){
     const a=referencePly(m.anchor);
     if(!a||a.ply>g.moves.length||g.moves[a.ply-1]!==a.san){failures.push(g.id+": wrong annotated move "+m.anchor);continue;}
     if(seen.has(a.ply))failures.push(g.id+": duplicate annotation ply "+a.ply);
     seen.add(a.ply);
     if(!languages.every(k=>m.explain&&typeof m.explain[k]==="string"&&m.explain[k].length>=40))failures.push(g.id+": missing/inadequate translation at "+m.anchor);
     selected.push(Object.freeze({ply:a.ply,san:a.san,anchor:m.anchor,explain:m.explain}));
   }
   if(!expanded&&selected.length<3)failures.push(g.id+": fewer than three original critical-move lessons");
   selected.sort((a,b)=>a.ply-b.ply);
   const group=expanded?"championship":category[note.theme];
   if(!group)failures.push(g.id+": unknown pedagogical theme "+note.theme);
   if(!expanded&&!["beginner","intermediate","advanced"].includes(note.difficulty))failures.push(g.id+": unknown teaching level");
   games.push(Object.freeze({
     id:g.id,title:display.title,summary:display.summary,theme:expanded?"championship":note.theme,category:group,
     difficulty:expanded?"intermediate":note.difficulty,collection:expanded?"champions":"legends",
     white:g.white,black:g.black,event:g.event,year:g.year,result:g.result,source:g.source,
     totalPlies:g.plies,moves:Object.freeze(moves),positions:Object.freeze(positions),
     moments:Object.freeze(selected),isCheckmate:board.in_checkmate(),endFen:board.fen()
   }));
 }
 if(all.length!==library.filter(x=>x.collection!=="championship-score").length||byId.size!==all.length)
   failures.push("Curated lesson/annotation count mismatch or duplicate annotation IDs");
 if(library.length<20)failures.push("Under-curated master games library");
 const totalPlies=games.reduce((sum,g)=>sum+g.totalPlies,0),moments=games.reduce((sum,g)=>sum+g.moments.length,0);
 return Object.freeze({ok:failures.length===0,games:Object.freeze(games),byId:Object.freeze(Object.fromEntries(games.map(g=>[g.id,g]))),problems:Object.freeze(failures),totalPlies,moments,checkmates:games.filter(g=>g.isCheckmate).length,version:games.length===31?"B5-31-v1":"B5-300-v2"});
}
function exerciseChoices(Chess,game,moment){
 if(!game||!moment||moment.ply<1||moment.ply>game.totalPlies)throw new Error("Invalid historic exercise");
 const board=new Chess(game.positions[moment.ply-1]),legal=board.moves({verbose:true});
 const actual=legal.find(m=>m.san===moment.san);
 if(!actual)throw new Error("Source replay produced an illegal master move");
 // Wrong options are real legal moves, NEVER fabricated legal or strategic evaluations.
 const alternatives=legal.filter(m=>m.san!==moment.san).sort((a,b)=>{
   const sameA=a.piece===actual.piece?1:0,sameB=b.piece===actual.piece?1:0;
   return sameB-sameA||a.san.localeCompare(b.san,"en");
 }).slice(0,3);
 const candidates=[actual,...alternatives];
 // Deterministic, stable placement across renders; no false random "best" choices.
 const rotate=(moment.ply*7+game.year)%candidates.length;
 return candidates.map((_,i)=>candidates[(i+rotate)%candidates.length].san);
}
function pgn(game){
 if(!game||!Array.isArray(game.moves))throw new Error("Game must be verified");
 const tag=(v)=>String(v).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/[\r\n]/g," ");
 const date=String(game.year).padStart(4,"0")+".??.??";
 const headers=[
  ["Event",game.event],["Site","?"],["Date",date],["Round","?"],["White",game.white],
  ["Black",game.black],["Result",game.result],["Source",game.source]
 ].map(([key,val])=>'['+key+' "'+tag(val)+'"]').join("\n");
 const turns=[];
 for(let i=0;i<game.moves.length;i+=2){
   turns.push(Math.floor(i/2)+1+". "+game.moves[i].san+(game.moves[i+1]?" "+game.moves[i+1].san:""));
 }
 const chunks=[];let line="";
 for(const turn of [...turns,game.result]){
   if(line.length+turn.length+1>78){chunks.push(line);line=turn;}
   else line+=(line?" ":"")+turn;
 }
 if(line)chunks.push(line);
 return headers+"\n\n"+chunks.join("\n")+"\n";
}
return Object.freeze({compile,referencePly,exerciseChoices,pgn,languages,category});
});