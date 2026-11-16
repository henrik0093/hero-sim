// Gemeinsamer Abschluss: Wochen-Rangliste und Pokal-Wertung
window.BB={html(b,me,P,game){const nm=id=>(P.find(p=>p.id===id)||{}).name||id,f=s=>game==='loch'||game==='run'?s.toLocaleString('de-DE'):(s/10).toLocaleString('de-DE')+' %';
  const l=(b.best||[]).slice(0,5);let h='<div style="margin-top:6px;padding:10px 14px;border-radius:14px;background:rgba(255,255,255,.1);text-align:left;font-size:15px;font-weight:500;width:300px;max-width:100%;color:#fff"><b style="color:#ffd54a">Rangliste dieser Woche</b>';
  l.forEach((x,i)=>{h+='<div style="display:flex;justify-content:space-between;'+(x.player===me?'color:#ffd54a;font-weight:700':'')+'"><span>'+(i+1)+'. '+nm(x.player)+'</span><span>'+f(x.score)+'</span></div>'});
  const W=b.weeks||{},pt={};for(const w in W)(W[w]||[]).slice(0,3).forEach((x,i)=>pt[x.player]=(pt[x.player]||0)+3-i);const pr=Object.keys(pt).sort((a,c)=>pt[c]-pt[a]);
  h+=pr.length?'<b style="color:#ffd54a;display:block;margin-top:8px">Pokal-Wertung</b>'+pr.slice(0,4).map((id,i)=>'<div style="display:flex;justify-content:space-between"><span>'+(i?(i+1)+'.':'🏆')+' '+nm(id)+'</span><span>'+pt[id]+' P.</span></div>').join(''):'<div style="opacity:.8;margin-top:6px;font-size:13px">Pokal-Punkte gibt es ab dem 29.11.: Platz 1 = 3, Platz 2 = 2, Platz 3 = 1.</div>';
  return h+'</div>'}};
