// Knopf zum Beenden einer laufenden Runde (alle Spiele)
(function(){
  const css=document.createElement('style');
  css.textContent='#qBtn{position:fixed;right:10px;bottom:calc(env(safe-area-inset-bottom) + 10px);z-index:30;width:42px;height:42px;border-radius:50%;border:2px solid rgba(255,255,255,.55);background:rgba(10,22,58,.55);color:#fff;font:700 18px/1 system-ui,sans-serif;padding:0;display:none;-webkit-tap-highlight-color:transparent}'+
   '#qBtn.on{display:block}#qSheet{position:fixed;inset:0;z-index:60;background:rgba(6,12,34,.72);display:none;align-items:center;justify-content:center;padding:24px}#qSheet.on{display:flex}'+
   '#qSheet>div{background:#14224f;color:#fff;border-radius:22px;padding:22px 20px;width:100%;max-width:330px;text-align:center;font-family:Fredoka,system-ui,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.5)}'+
   '#qSheet h3{margin:0 0 6px;font-size:22px}#qSheet p{margin:0 0 16px;font-size:14px;opacity:.85}'+
   '#qSheet button{display:block;width:100%;margin:9px 0 0;padding:14px;border:0;border-radius:14px;font:700 17px Fredoka,system-ui,sans-serif;color:#fff;background:#2b3f86}#qSheet button.p{background:#ffd54a;color:#14224f}#qSheet button.r{background:#d8475a}';
  document.head.appendChild(css);
  function init(){
    const hud=document.getElementById('hud');if(!hud)return;
    const runner=!!document.getElementById('play');
    const b=document.createElement('button');b.id='qBtn';b.textContent='✕';b.setAttribute('aria-label','Runde beenden');document.body.appendChild(b);
    const s=document.createElement('div');s.id='qSheet';
    s.innerHTML='<div><h3>Runde beenden?</h3><p>Die laufende Runde zählt dann nicht.</p><button class="p" id="qGo">Weiterspielen</button>'+(runner?'':'<button class="r" id="qEnd">Runde abbrechen</button>')+'<button class="'+(runner?'r':'')+'" id="qHome">Zum Hauptmenü</button></div>';
    document.body.appendChild(s);
    const sync=()=>{const on=!hud.classList.contains('hidden');b.classList.toggle('on',on);if(!on&&s.classList.contains('on'))close()};
    function close(){s.classList.remove('on');window.__paused=false}
    new MutationObserver(sync).observe(hud,{attributes:true,attributeFilter:['class']});sync();
    b.addEventListener('pointerdown',e=>e.stopPropagation());
    b.onclick=()=>{s.classList.add('on');window.__paused=true};
    s.querySelector('#qGo').onclick=close;
    const e=s.querySelector('#qEnd');if(e)e.onclick=()=>{location.href=location.pathname};
    s.querySelector('#qHome').onclick=()=>{if(runner)location.reload();else location.href='index.html'};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
