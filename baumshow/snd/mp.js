// Mehrspieler: Online-Liste, Einladungen und Spielräume über Supabase Realtime (Projekt "Testumgebung").
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const SB=createClient('https://qkhtgqiqctndckvomzrz.supabase.co','sb_publishable_VGk3romqRke14Xef0-F54A_hBbUNJsp',{auth:{persistSession:false,autoRefreshToken:false},realtime:{params:{eventsPerSecond:40}}});
const GN={paint:'Farbschlacht',loch:'Schneeloch',arena:'Delbrück erobern'};
let me=null,lobby=null,online=[];const names={},status={game:null,room:null,playing:false},cbs=[];
function showInvite(p){if(document.getElementById('mpInv'))return;const d=document.createElement('div');d.id='mpInv';
  d.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom) + 14px);z-index:99;background:#12285c;border:3px solid #ffd54a;border-radius:18px;padding:14px;color:#fff;font-family:Fredoka,system-ui,sans-serif;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.5)';
  d.innerHTML='<div style="font-weight:700;font-size:18px">🎮 '+(names[p.from]||p.from)+' lädt dich ein</div><div style="opacity:.9;margin:4px 0 12px">'+(GN[p.game]||p.game)+', die Runde läuft schon.</div><button id="mpYes" style="border:none;border-radius:12px;padding:12px 22px;font:inherit;font-weight:700;font-size:18px;background:#ffd54a;color:#5a3500;margin-right:8px">Annehmen</button><button id="mpNo" style="border:none;border-radius:12px;padding:12px 18px;font:inherit;font-weight:600;font-size:16px;background:rgba(255,255,255,.18);color:#fff">Später</button>';
  document.body.appendChild(d);d.querySelector('#mpYes').onclick=()=>{location.href=p.game+'.html?room='+encodeURIComponent(p.room)};d.querySelector('#mpNo').onclick=()=>d.remove();setTimeout(()=>d.remove(),30000)}
const MP={ready:false,
  init(id,people){if(lobby)return;me=id;people.forEach(p=>names[p.id]=p.name);
    lobby=SB.channel('bb-lobby',{config:{presence:{key:id},broadcast:{self:false}}});
    lobby.on('presence',{event:'sync'},()=>{const st=lobby.presenceState();online=Object.keys(st).map(k=>Object.assign({},st[k][st[k].length-1],{id:k}));cbs.forEach(f=>{try{f(online)}catch(e){}})})
      .on('broadcast',{event:'invite'},({payload})=>{if(payload&&payload.to===me)showInvite(payload)})
      .subscribe(s=>{if(s==='SUBSCRIBED'){MP.ready=true;lobby.track(Object.assign({t:Date.now()},status))}})},
  setStatus(s){Object.assign(status,s);if(MP.ready)lobby.track(Object.assign({t:Date.now()},status))},
  get online(){return online},get me(){return me},
  onLobby(f){cbs.push(f);f(online)},
  invite(to,game,room){if(lobby)lobby.send({type:'broadcast',event:'invite',payload:{to,from:me,game,room}})},
  room(code,h){const ch=SB.channel('bb-room-'+code,{config:{presence:{key:me},broadcast:{self:false}}});let mem=[];
    ch.on('broadcast',{event:'m'},({payload})=>{const f=h[payload.k];if(f){try{f(payload.d,payload.f)}catch(e){console.error(e)}}})
      .on('presence',{event:'sync'},()=>{mem=Object.keys(ch.presenceState());if(h.members)h.members(mem)})
      .subscribe(s=>{if(s==='SUBSCRIBED'){ch.track({id:me});if(h.ready)h.ready()}});
    return {send(k,d){ch.send({type:'broadcast',event:'m',payload:{k,d,f:me}})},get members(){return mem},leave(){try{SB.removeChannel(ch)}catch(e){}}}},
  mount(el,game,opt){if(!el)return;opt=opt||{};MP.onLobby(list=>{const o=list.filter(x=>x.id!==me&&names[x.id]);
      let h='<div style="font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.85;margin-bottom:6px;display:flex;justify-content:space-between"><span>Mehrspieler</span><span>'+(o.length?o.length+' online':'')+'</span></div>';
      if(!o.length)h+='<div style="font-size:14px;opacity:.8">Gerade ist sonst niemand online. Sobald jemand die Seite offen hat, steht er hier.</div>';
      for(const x of o){const pl=x.playing&&x.room&&GN[x.game],can=pl&&(!game||x.game===game);
        h+='<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:16px"><span style="width:10px;height:10px;border-radius:50%;background:#3ddc84;flex:none"></span><span style="flex:1;text-align:left"><b>'+names[x.id]+'</b><br><small style="opacity:.8">'+(pl?'spielt '+GN[x.game]:'online')+'</small></span>'+
          (can?'<button data-join="'+x.game+'|'+x.room+'" style="border:none;border-radius:10px;padding:9px 12px;font:inherit;font-weight:700;background:#ffd54a;color:#5a3500">Beitreten</button>':game&&opt.invite?'<button data-inv="'+x.id+'" style="border:none;border-radius:10px;padding:9px 12px;font:inherit;font-weight:700;background:rgba(255,255,255,.2);color:#fff">Einladen</button>':'')+'</div>'}
      el.innerHTML=h;el.querySelectorAll('[data-join]').forEach(b=>b.onclick=()=>{const [g,r]=b.dataset.join.split('|');if(opt.join&&g===game)opt.join(r);else location.href=g+'.html?room='+encodeURIComponent(r)});
      el.querySelectorAll('[data-inv]').forEach(b=>b.onclick=()=>{b.textContent='Eingeladen ✓';b.disabled=true;opt.invite(b.dataset.inv)})})}
};
window.MP=MP;
