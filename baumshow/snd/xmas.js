// Weihnachtslieder (gemeinfreie Melodien) als Spielmusik: Melodie, Bass, Akkorde, Schlagzeug, Schellen.
(function(){
  const SONGS=[
   {m:"E4 E4 E4:2 E4 E4 E4:2 E4 G4 C4:1.5 D4:.5 E4:4 F4 F4 F4:1.5 F4:.5 F4 E4 E4 E4:.5 E4:.5 E4 D4 D4 E4 D4:2 G4:2 E4 E4 E4:2 E4 E4 E4:2 E4 G4 C4:1.5 D4:.5 E4:4 F4 F4 F4:1.5 F4:.5 F4 E4 E4 E4:.5 E4:.5 G4 G4 F4 D4 C4:4",
    c:"C C C C C C C C F F C C D G G G C C C C C C C C F F C C G G C C"},
   {m:"G4:1.5 F4:.5 E4 D4 C4 D4 E4 C4 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4 B3 C4:2 G4:1.5 F4:.5 E4 D4 C4 D4 E4 C4 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4 B3 C4:2 D4:1.5 E4:.5 F4 D4 E4:1.5 F4:.5 G4 D4 E4:.5 F#4:.5 G4 A4:.5 B4:.5 C5 B4 A4 G4:2 G4:1.5 F4:.5 E4 D4 C4 D4 E4 C4 A4:.5 A4:.5 A4:.5 A4:.5 G4:1.5 F4:.5 E4 D4 C4:2",
    c:"C C C C G G C C C C C C G G C C G G C G C D G G C C C C F C G C"},
   {m:"C4 C4 G4 G4 A4 A4 G4:2 F4 F4 E4 E4 D4 D4 C4:2 G4 G4 F4 F4 E4 E4 D4:2 G4 G4 F4 F4 E4 E4 D4:2 C4 C4 G4 G4 A4 A4 G4:2 F4 F4 E4 E4 D4 D4 C4:2",
    c:"C C F C F C G C C F C G C F C G C C F C F C G C"},
   {m:"G4:2 A4:2 G4:1.5 F4:.5 E4 F4 G4:2 A4:2 G4:1.5 F4:.5 E4 F4 G4:2 G4:2 A4:2 B4 C5 B4:2 A4:2 G4:4 D4:1.5 E4:.5 D4 E4 F4:1.5 G4:.5 F4:2 E4:1.5 F4:.5 E4 F4 G4:1.5 A4:.5 G4:2 C5 B4 A4 G4 C5 A4 G4 F4 E4:2 D4:2 C4:4",
    c:"C F C C C F C C C C F G G D G G G G G G C C C C C G F F C G C C"}
  ];
  const SEMI={C:0,D:2,E:4,F:5,G:7,A:9,B:11},CH={C:[0,4,7],F:[5,9,12],G:[7,11,14],D:[2,6,9]};
  const fq=n=>{const m=n.match(/^([A-G])(#?)(\d)$/);return 261.63*Math.pow(2,(SEMI[m[1]]+(m[2]?1:0))/12+(+m[3]-4))};
  const parsed=SONGS.map(s=>{let t=0;const ev=[];for(const tok of s.m.split(' ')){const [n,d]=tok.split(':');const dur=d?parseFloat(d):1;ev.push({t,f:fq(n),d:dur});t+=dur}return {ev,len:Math.ceil(t/4)*4,ch:s.c.split(' ')}});
  let AC=null,out=null,nb=null,timer=null,on=false,rate=1,song=0,step=0,nextT=0,fill=0,oct=1;
  function env(node,t,a,d,v){const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);node.connect(g);g.connect(out);return g}
  function osc(type,f,t,a,d,v,slide){const o=AC.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);env(o,t,a,d,v);o.start(t);o.stop(t+a+d+.05)}
  function nz(t,d,v,type,f){const s=AC.createBufferSource();s.buffer=nb;const fl=AC.createBiquadFilter();fl.type=type;fl.frequency.value=f;s.connect(fl);env(fl,t,.002,d,v);s.start(t,Math.random()*.3);s.stop(t+d+.05)}
  function lead(f,t,d){const dd=Math.max(.12,d*.9);osc('square',f*oct,t,.008,dd,.075);osc('sawtooth',f*oct*1.004,t,.008,dd,.05);osc('sine',f*oct*2,t,.004,Math.min(.5,dd),.06)}
  function sched(){
    if(!on||!AC)return;const spb=60/(132*rate),e8=spb/2;if(nextT<AC.currentTime)nextT=AC.currentTime+.05;
    while(nextT<AC.currentTime+.22){const S=parsed[song],b=step*.5,t=nextT,inFill=fill>0;
      const bar=step%8;
      if(bar===0||bar===4||(inFill&&bar%2===0))osc('sine',150,t,.002,.16,.5,45);
      if(bar===2||bar===6)nz(t,.13,.22,'bandpass',1900);
      if(inFill&&step%8>=4)nz(t,.07,.16,'bandpass',1400+bar*150);
      nz(t,.035,bar%2?.05:.08,'highpass',7500);nz(t,.06,.045,'bandpass',5200);
      if(!inFill){const cn=S.ch[Math.floor(b/2)%S.ch.length]||'C',c=CH[cn],root=65.41*Math.pow(2,c[0]/12);
        osc('triangle',bar%2?root*1.5:root,t,.005,e8*.85,.2);
        if(bar%2===1)for(const k of c)osc('sine',261.63*Math.pow(2,k/12),t,.005,e8*.7,.035);
        for(const n of S.ev)if(n.t>=b&&n.t<b+.5)lead(n.f,t+(n.t-b)*spb,n.d*spb)}
      step++;nextT+=e8;
      if(fill>0){fill--;if(fill===0){step=0}}
      else if(step*.5>=S.len){fill=8;step=0;song=(song+1)%parsed.length;oct=oct===1?2:1}
    }
  }
  window.Xmas={
    start(first){try{if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();out=AC.createGain();out.gain.value=.34;const cp=AC.createDynamicsCompressor();out.connect(cp);cp.connect(AC.destination);
        nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
      if(AC.state==='suspended')AC.resume();if(on)return;on=true;if(first!=null)song=first%parsed.length;step=0;fill=0;nextT=AC.currentTime+.08;out.gain.setTargetAtTime(.34,AC.currentTime,.05);timer=setInterval(sched,45);sched()}catch(e){}},
    stop(){on=false;clearInterval(timer);if(AC)try{out.gain.setTargetAtTime(.0001,AC.currentTime,.08)}catch(e){}},
    rate(r){rate=Math.max(.8,Math.min(1.5,r))},
    get on(){return on}
  };
  document.addEventListener('visibilitychange',()=>{if(AC)try{document.hidden?AC.suspend():(on&&AC.resume())}catch(e){}});
})();
