// ======================== SETUP ========================
const C = document.getElementById('g'), X = C.getContext('2d');
const W = 832, H = 480;
C.width = W; C.height = H;
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);C.style.width=W*s+'px';C.style.height=H*s+'px'}
fit(); addEventListener('resize',fit);

// ======================== AUDIO ========================
let ac;
function initAudio(){if(!ac)ac=new(AudioContext||webkitAudioContext)()}
function tone(f,d,t='square',v=.1){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function sfxStep(){tone(150,.05,'triangle',.04)}
function sfxJump(){tone(400,.08);setTimeout(()=>tone(580,.1),40)}
function sfxPortal(){[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,.18,'sine',.08),i*120))}
function sfxChat(){tone(800,.04,'sine',.05)}
function sfxUnlock(){[440,554,659].forEach((f,i)=>setTimeout(()=>tone(f,.15),i*120))}
function sfxKiss(){tone(600,.1,'sine',.06);setTimeout(()=>tone(750,.15,'sine',.06),100);setTimeout(()=>tone(900,.2,'sine',.06),220)}
function sfxCar(){tone(80,.1,'sawtooth',.03)}
function sfxSelect(){tone(660,.06,'square',.06)}
function sfxPurr(){tone(90,.3,'sine',.04);setTimeout(()=>tone(95,.3,'sine',.04),150);setTimeout(()=>tone(85,.3,'sine',.04),300)}
function sfxMeow(){tone(700,.1,'sine',.06);setTimeout(()=>tone(500,.15,'sine',.05),100)}

// ======================== INPUT ========================
const K={};
addEventListener('keydown',e=>{K[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});
addEventListener('keyup',e=>{K[e.code]=false});
let kTap={};
function wasTapped(code){if(K[code]&&!kTap[code]){kTap[code]=true;return true}if(!K[code])kTap[code]=false;return false}

// ======================== STATE ========================
let state='map';
let curLevel=-1, phase='', phaseT=0;
const levels=[];
const levelHandlers=[];

const HIDDEN_LEVELS=new Set(['The Gas War']);

function registerLevel(name,handler){
  if(HIDDEN_LEVELS.has(name))return;
  const idx=levels.length;
  levels.push({name,unlocked:idx===0,completed:false});
  levelHandlers.push(handler);
}

function save(){localStorage.setItem('hq_save',JSON.stringify(levels.map(l=>({u:l.unlocked,c:l.completed}))))}
function load(){try{const d=JSON.parse(localStorage.getItem('hq_save'));if(d)d.forEach((s,i)=>{if(levels[i]){levels[i].unlocked=s.u;levels[i].completed=s.c}})}catch(e){}}

let sel=0;
let player={x:0,y:0,vx:0,vy:0,w:20,h:36,facing:1,frame:0,ft:0,onG:false};
let cam={x:0};
let particles=[];
let portalPos={x:0,y:0,active:false};
let lvlWidth=0;
const GRAV=.5, JUMP=-9, SPD=6, ACC=.9, FRIC=.85;
const GND=H-96;

// ======================== GRADIENT CACHE ========================
const _gc={};
function cachedGrad(key,x1,y1,x2,y2,stops){
  if(_gc[key])return _gc[key];
  const g=X.createLinearGradient(x1,y1,x2,y2);
  stops.forEach(s=>g.addColorStop(s[0],s[1]));
  _gc[key]=g;return g;
}

// ======================== PARTICLES ========================
function spark(x,y,col,n=6){if(particles.length>80)return;for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*4,vy:-Math.random()*3-1,life:25+Math.random()*15,col,sz:2+Math.random()*2})}
function updPart(){let j=0;for(let i=0;i<particles.length;i++){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.1;if(--p.life>0)particles[j++]=p}particles.length=j}
function drwPart(){particles.forEach(p=>{X.globalAlpha=Math.max(0,p.life/40);X.fillStyle=p.col;X.fillRect(p.x-(cam.x||0),p.y,p.sz,p.sz)});X.globalAlpha=1}

// ======================== CHARACTER DRAWING ========================
function drawGirl(px,py,facing,frame,outfit,sitting){
  X.save();
  if(facing<0){X.translate(px+20,py);X.scale(-1,1)}else{X.translate(px,py)}
  const b=(!sitting&&(frame===1||frame===3))?-1:0;
  X.fillStyle='#F0C840';
  X.fillRect(3,b,14,10);
  X.fillRect(1,b+3,3,12);
  X.fillRect(16,b+3,3,12);
  X.fillStyle='#D4A030';
  X.fillRect(3,b,14,2);
  X.fillStyle='#FFCC99';
  X.fillRect(4,b+6,12,9);
  X.fillStyle='#6B8A9E';
  X.fillRect(6,b+9,3,2);X.fillRect(11,b+9,3,2);
  X.fillStyle='#FFF';
  X.fillRect(7,b+9,1,1);X.fillRect(12,b+9,1,1);
  X.fillStyle='#46342E';
  X.fillRect(6,b+8,3,1);X.fillRect(11,b+8,3,1);
  X.fillStyle='#E87070';
  X.fillRect(8,b+13,4,1);
  X.fillStyle='rgba(255,150,150,.35)';
  X.fillRect(4,b+11,3,2);X.fillRect(13,b+11,3,2);

  if(outfit==='dress'){
    X.fillStyle='#FAFAFA';
    X.fillRect(3,b+15,14,9);
    X.fillStyle='#E8E8E8';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,5);X.fillRect(16,b+15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+20,3,2);X.fillRect(16,b+20,3,2);
    if(!sitting){
      X.fillStyle='#1A1A1A';
      X.fillRect(2,b+24,16,5);
      X.fillStyle='#111';
      X.fillRect(3,b+28,14,2);
      X.fillStyle='#FFCC99';
      const lx=frame===1?-2:frame===3?2:0;
      X.fillRect(5+lx,b+29,4,4);X.fillRect(11-lx,b+29,4,4);
      X.fillStyle='#222';
      X.fillRect(4+lx,b+33,5,3);X.fillRect(11-lx,b+33,5,3);
    }
  }else if(outfit==='casual'){
    X.fillStyle='#5DADE2';
    X.fillRect(3,b+15,14,8);
    X.fillStyle='#3498DB';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,5);X.fillRect(16,b+15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+20,3,2);X.fillRect(16,b+20,3,2);
    if(!sitting){
      X.fillStyle='#2C3E80';
      X.fillRect(4,b+23,5,8);X.fillRect(11,b+23,5,8);
      const lx=frame===1?-1:frame===3?1:0;
      X.fillStyle='#1A1A5C';
      X.fillRect(4+lx,b+23,5,8);X.fillRect(11-lx,b+23,5,8);
      X.fillStyle='#F5F5F5';
      X.fillRect(4+lx,b+31,5,3);X.fillRect(11-lx,b+31,5,3);
    }
  }else if(outfit==='sporty'){
    X.fillStyle='#1A1A1A';
    X.fillRect(3,b+15,14,10);
    X.fillStyle='#111';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,7);X.fillRect(16,b+15,3,7);
    X.fillStyle='#222';
    X.fillRect(2,b+3,2,12);X.fillRect(16,b+3,2,12);
    X.fillStyle='#555';
    X.fillRect(8,b+17,1,4);X.fillRect(11,b+17,1,4);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+22,3,2);X.fillRect(16,b+22,3,2);
    if(!sitting){
      X.fillStyle='#1A1A1A';
      X.fillRect(4,b+25,5,8);X.fillRect(11,b+25,5,8);
      const lx=frame===1?-1:frame===3?1:0;
      X.fillStyle='#111';
      X.fillRect(4+lx,b+25,5,8);X.fillRect(11-lx,b+25,5,8);
      X.fillStyle='#F5F5F5';
      X.fillRect(3+lx,b+33,6,3);X.fillRect(11-lx,b+33,6,3);
    }
  }else if(outfit==='whitesleeve'){
    // White long-sleeve top
    X.fillStyle='#FAFAFA';
    X.fillRect(3,b+15,14,9);
    X.fillStyle='#E8E8E8';
    X.fillRect(3,b+15,14,2);
    // Long sleeves (cover arms)
    X.fillStyle='#FAFAFA';
    X.fillRect(1,b+15,3,7);X.fillRect(16,b+15,3,7);
    X.fillStyle='#E8E8E8';
    X.fillRect(1,b+15,3,2);X.fillRect(16,b+15,3,2);
    if(!sitting){
      // Black pants
      X.fillStyle='#1A1A1A';
      X.fillRect(4,b+24,5,8);X.fillRect(11,b+24,5,8);
      const lx=frame===1?-1:frame===3?1:0;
      X.fillStyle='#111';
      X.fillRect(4+lx,b+24,5,8);X.fillRect(11-lx,b+24,5,8);
      // Shoes
      X.fillStyle='#F5F5F5';
      X.fillRect(3+lx,b+32,6,3);X.fillRect(11-lx,b+32,6,3);
    }
  }else if(outfit==='blackdress'){
    // Black dress
    X.fillStyle='#1A1A1A';
    X.fillRect(3,b+15,14,14);
    X.fillStyle='#111';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,5);X.fillRect(16,b+15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+20,3,2);X.fillRect(16,b+20,3,2);
    if(!sitting){
      // Dress bottom flares slightly
      X.fillStyle='#1A1A1A';
      X.fillRect(1,b+28,18,3);
      // Legs
      X.fillStyle='#FFCC99';
      const lx=frame===1?-1:frame===3?1:0;
      X.fillRect(6+lx,b+30,3,3);X.fillRect(11-lx,b+30,3,3);
      // Heels
      X.fillStyle='#1A1A1A';
      X.fillRect(5+lx,b+33,5,3);X.fillRect(10-lx,b+33,5,3);
      X.fillStyle='#111';
      X.fillRect(6+lx,b+35,2,1);X.fillRect(12-lx,b+35,2,1);
    }
  }else if(outfit==='swimwhite'){
    // White one-piece swimwear
    X.fillStyle='#F5F5F5';
    X.fillRect(4,b+15,12,12);
    X.fillStyle='#E8E8E8';
    X.fillRect(4,b+15,12,2);
    // Straps
    X.fillStyle='#F5F5F5';
    X.fillRect(5,b+12,2,4);X.fillRect(13,b+12,2,4);
    // Bare arms
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+15,3,6);X.fillRect(16,b+15,3,6);
    if(!sitting){
      // Legs
      X.fillStyle='#FFCC99';
      const lx=frame===1?-1:frame===3?1:0;
      X.fillRect(5+lx,b+27,4,6);X.fillRect(11-lx,b+27,4,6);
      // Sandals
      X.fillStyle='#C8A878';
      X.fillRect(4+lx,b+33,5,2);X.fillRect(11-lx,b+33,5,2);
    }
  }else if(outfit==='lounge'){
    X.fillStyle='#F0A0B0';
    X.fillRect(3,b+15,14,9);
    X.fillStyle='#E890A0';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,6);X.fillRect(16,b+15,3,6);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+21,3,2);X.fillRect(16,b+21,3,2);
    if(!sitting){
      X.fillStyle='#E890A0';
      X.fillRect(4,b+24,5,8);X.fillRect(11,b+24,5,8);
      const lx=frame===1?-1:frame===3?1:0;
      X.fillStyle='#D8809A';
      X.fillRect(4+lx,b+24,5,8);X.fillRect(11-lx,b+24,5,8);
      X.fillStyle='#F5E0E8';
      X.fillRect(4+lx,b+32,5,4);X.fillRect(11-lx,b+32,5,4);
    }
  }else if(outfit==='beigesweater'){
    // Beige sweater + blue jeans
    X.fillStyle='#D4C4A0';
    X.fillRect(3,b+15,14,10);
    X.fillStyle='#C8B890';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,7);X.fillRect(16,b+15,3,7);
    X.fillStyle='#C0B080';
    X.fillRect(7,b+15,6,3);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+22,3,2);X.fillRect(16,b+22,3,2);
    if(!sitting){
      X.fillStyle='#3A5A8A';
      X.fillRect(4,b+25,5,8);X.fillRect(11,b+25,5,8);
      const lx=frame===1?-1:frame===3?1:0;
      X.fillStyle='#2E4E7A';
      X.fillRect(4+lx,b+25,5,8);X.fillRect(11-lx,b+25,5,8);
      X.fillStyle='#F5F5F5';
      X.fillRect(4+lx,b+33,5,3);X.fillRect(11-lx,b+33,5,3);
    }
  }else if(outfit==='bluejeans'){
    // White t-shirt + blue jeans
    X.fillStyle='#FAFAFA';
    X.fillRect(3,b+15,14,9);
    X.fillStyle='#E0E0E0';
    X.fillRect(3,b+15,14,2);
    X.fillRect(1,b+15,3,5);X.fillRect(16,b+15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,b+20,3,2);X.fillRect(16,b+20,3,2);
    if(!sitting){
      X.fillStyle='#3A5A8A';
      X.fillRect(4,b+24,5,8);X.fillRect(11,b+24,5,8);
      const lx=frame===1?-1:frame===3?1:0;
      X.fillStyle='#2E4E7A';
      X.fillRect(4+lx,b+24,5,8);X.fillRect(11-lx,b+24,5,8);
      X.fillStyle='#F5F5F5';
      X.fillRect(4+lx,b+32,5,4);X.fillRect(11-lx,b+32,5,4);
    }
  }
  X.restore();
}

function drawBoy(px,py,facing,sitting,outfit){
  X.save();
  outfit=outfit||'default';
  if(facing<0){X.translate(px+20,py);X.scale(-1,1)}else{X.translate(px,py)}
  X.fillStyle='#D4A030';
  X.fillRect(4,0,12,7);
  X.fillStyle='#C09020';
  X.fillRect(4,0,12,2);
  X.fillStyle='#FFCC99';
  X.fillRect(4,5,12,10);
  X.fillStyle='#46342E';
  X.fillRect(6,8,3,2);X.fillRect(11,8,3,2);
  X.fillStyle='#FFF';
  X.fillRect(7,8,1,1);X.fillRect(12,8,1,1);
  X.fillStyle='#D4886A';
  X.fillRect(8,12,4,1);

  if(outfit==='swimgreen'){
    // Bare chest
    X.fillStyle='#FFCC99';
    X.fillRect(3,15,14,9);
    X.fillRect(1,15,3,6);X.fillRect(16,15,3,6);
    if(!sitting){
      // Green swim shorts
      X.fillStyle='#3A8A3A';
      X.fillRect(3,24,14,7);
      X.fillStyle='#2E7A2E';
      X.fillRect(3,24,14,2);
      // Legs
      X.fillStyle='#FFCC99';
      X.fillRect(5,31,4,4);X.fillRect(11,31,4,4);
      // Sandals
      X.fillStyle='#8B6B4A';
      X.fillRect(4,35,5,2);X.fillRect(11,35,5,2);
    }else{
      // Sitting: shorts visible
      X.fillStyle='#3A8A3A';
      X.fillRect(3,24,14,5);
    }
  }else if(outfit==='beigesweater'){
    // Beige sweater + blue jeans
    X.fillStyle='#D4C4A0';
    X.fillRect(3,15,14,10);
    X.fillStyle='#C8B890';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,7);X.fillRect(16,15,3,7);
    // Collar detail
    X.fillStyle='#C0B080';
    X.fillRect(7,15,6,3);
    X.fillStyle='#FFCC99';
    X.fillRect(1,22,3,2);X.fillRect(16,22,3,2);
    if(!sitting){
      // Blue jeans
      X.fillStyle='#3A5A8A';
      X.fillRect(4,25,5,8);X.fillRect(11,25,5,8);
      X.fillStyle='#2E4E7A';
      X.fillRect(4,31,5,2);X.fillRect(11,31,5,2);
      X.fillStyle='#F5F5F5';
      X.fillRect(3,33,6,3);X.fillRect(11,33,6,3);
    }
  }else if(outfit==='beige'){
    // White t-shirt + beige pants
    X.fillStyle='#FAFAFA';
    X.fillRect(3,15,14,9);
    X.fillStyle='#E0E0E0';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,5);X.fillRect(16,15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,20,3,2);X.fillRect(16,20,3,2);
    if(!sitting){
      X.fillStyle='#C8B898';
      X.fillRect(4,24,5,8);X.fillRect(11,24,5,8);
      X.fillStyle='#B8A888';
      X.fillRect(4,30,5,2);X.fillRect(11,30,5,2);
      X.fillStyle='#F5F5F5';
      X.fillRect(3,32,6,3);X.fillRect(11,32,6,3);
    }
  }else if(outfit==='cozy'){
    X.fillStyle='#6B6B6B';
    X.fillRect(3,15,14,10);
    X.fillStyle='#5A5A5A';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,7);X.fillRect(16,15,3,7);
    X.fillStyle='#777';
    X.fillRect(2,3,2,12);X.fillRect(16,3,2,12);
    X.fillStyle='#888';
    X.fillRect(8,17,1,4);X.fillRect(11,17,1,4);
    X.fillStyle='#FFCC99';
    X.fillRect(1,22,3,2);X.fillRect(16,22,3,2);
    if(!sitting){
      X.fillStyle='#555';
      X.fillRect(4,25,5,8);X.fillRect(11,25,5,8);
      X.fillStyle='#4A4A4A';
      X.fillRect(4,31,5,2);X.fillRect(11,31,5,2);
      X.fillStyle='#E8E8E8';
      X.fillRect(3,33,6,3);X.fillRect(11,33,6,3);
    }
  }else if(outfit==='clean'){
    // White t-shirt + clean black pants
    X.fillStyle='#FAFAFA';
    X.fillRect(3,15,14,9);
    X.fillStyle='#E0E0E0';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,5);X.fillRect(16,15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,20,3,2);X.fillRect(16,20,3,2);
    if(!sitting){
      X.fillStyle='#1A1A1A';
      X.fillRect(4,24,5,8);X.fillRect(11,24,5,8);
      X.fillStyle='#111';
      X.fillRect(4,30,5,2);X.fillRect(11,30,5,2);
      X.fillStyle='#3A2510';
      X.fillRect(3,32,6,3);X.fillRect(11,32,6,3);
    }
  }else if(outfit==='bluetshirt'){
    // Blue t-shirt + dark blue pants
    X.fillStyle='#4A8ABF';
    X.fillRect(3,15,14,9);
    X.fillStyle='#3A7AAF';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,5);X.fillRect(16,15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,20,3,2);X.fillRect(16,20,3,2);
    if(!sitting){
      X.fillStyle='#1A2A4A';
      X.fillRect(4,24,5,8);X.fillRect(11,24,5,8);
      X.fillStyle='#0F1F3F';
      X.fillRect(4,30,5,2);X.fillRect(11,30,5,2);
      X.fillStyle='#F5F5F5';
      X.fillRect(3,32,6,3);X.fillRect(11,32,6,3);
    }
  }else if(outfit==='greypants'){
    // White t-shirt + grey pants
    X.fillStyle='#FAFAFA';
    X.fillRect(3,15,14,9);
    X.fillStyle='#E0E0E0';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,5);X.fillRect(16,15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,20,3,2);X.fillRect(16,20,3,2);
    if(!sitting){
      X.fillStyle='#6A6A6A';
      X.fillRect(4,24,5,8);X.fillRect(11,24,5,8);
      X.fillStyle='#5A5A5A';
      X.fillRect(4,30,5,2);X.fillRect(11,30,5,2);
      X.fillStyle='#555';
      X.fillRect(3,32,6,3);X.fillRect(11,32,6,3);
    }
  }else{
    // Default: white t-shirt + black jeans with hole & dirt
    X.fillStyle='#FAFAFA';
    X.fillRect(3,15,14,9);
    X.fillStyle='#E0E0E0';
    X.fillRect(3,15,14,2);
    X.fillRect(1,15,3,5);X.fillRect(16,15,3,5);
    X.fillStyle='#FFCC99';
    X.fillRect(1,20,3,2);X.fillRect(16,20,3,2);
    if(!sitting){
      X.fillStyle='#1A1A1A';
      X.fillRect(4,24,5,8);X.fillRect(11,24,5,8);
      X.fillStyle='#111';
      X.fillRect(4,30,5,2);X.fillRect(11,30,5,2);
      X.fillStyle='#FFCC99';
      X.fillRect(12,27,3,2);
      X.fillStyle='#2A2A1A';
      X.fillRect(5,26,3,2);
      X.fillStyle='#3A2510';
      X.fillRect(3,32,6,3);X.fillRect(11,32,6,3);
    }
  }
  X.restore();
}

function drawCat(px,py,facing,lying){
  X.save();
  if(facing<0){X.translate(px+24,py);X.scale(-1,1)}else{X.translate(px,py)}
  if(lying){
    X.fillStyle='#888';X.fillRect(2,6,20,8);
    X.fillStyle='#777';X.fillRect(4,4,6,4);
    X.fillStyle='#999';X.fillRect(4,2,3,3);X.fillRect(8,2,3,3);
    X.fillStyle='#D4887A';X.fillRect(5,3,1,1);X.fillRect(9,3,1,1);
    X.fillStyle='#3A3';X.fillRect(5,6,2,1);X.fillRect(8,6,2,1);
    X.fillStyle='#D4887A';X.fillRect(7,7,1,1);
    X.fillStyle='#777';X.fillRect(20,6,4,3);X.fillRect(23,4,3,3);
    X.fillStyle='#666';X.fillRect(10,6,2,6);X.fillRect(15,6,2,6);
  }else{
    X.fillStyle='#888';X.fillRect(4,2,14,10);X.fillRect(0,0,8,8);
    X.fillStyle='#999';X.fillRect(0,-2,3,3);X.fillRect(5,-2,3,3);
    X.fillStyle='#D4887A';X.fillRect(1,-1,1,1);X.fillRect(6,-1,1,1);
    X.fillStyle='#3A3';X.fillRect(1,2,2,2);X.fillRect(5,2,2,2);
    X.fillStyle='#D4887A';X.fillRect(3,4,1,1);
    const t=Date.now()/150,lo=Math.sin(t)*2;
    X.fillStyle='#777';X.fillRect(5+lo,12,3,4);X.fillRect(14-lo,12,3,4);
    X.fillRect(17,0,3,4);X.fillRect(19,-2,3,3);
    X.fillStyle='#666';X.fillRect(8,3,2,7);X.fillRect(13,3,2,7);
  }
  X.restore();
}

// ======================== UI HELPERS ========================
function bubble(x,y,text,tailSide,speaker){
  X.font='bold 13px monospace';
  const m=X.measureText(text);
  const bw=m.width+16,bh=24;
  const bx=x-bw/2,by=y-bh-8;
  if(speaker){
    const nc=speaker==='Olya'?'#E94560':speaker==='Leo'?'#3A3':'#3498DB';
    X.fillStyle=nc;X.font='bold 11px monospace';
    X.fillText(speaker,bx+4,by-4);
    X.font='bold 13px monospace';
  }
  X.fillStyle='#FFF';
  X.fillRect(bx,by,bw,bh);
  X.fillStyle='#333';
  X.fillRect(bx,by,bw,1);X.fillRect(bx,by+bh-1,bw,1);
  X.fillRect(bx,by,1,bh);X.fillRect(bx+bw-1,by,1,bh);
  X.fillStyle='#FFF';
  const tx=tailSide==='left'?bx+12:bx+bw-16;
  X.fillRect(tx,by+bh,8,4);X.fillRect(tx+2,by+bh+4,4,3);
  X.fillStyle='#333';
  X.fillText(text,bx+8,by+16);
}

function label(text,y,size,col){
  X.textAlign='center';X.fillStyle=col||'#FFF';
  X.font='bold '+size+'px monospace';
  X.fillText(text,W/2,y);
  X.textAlign='left';
}

function drawPortal(px,py){
  const t=Date.now()/500;
  for(let i=0;i<12;i++){
    const a=t+i*Math.PI/6;
    const r=20+Math.sin(t*2+i)*4;
    const sx=px+Math.cos(a)*r*0.6;
    const sy=py-20+Math.sin(a)*r;
    X.globalAlpha=.5+.3*Math.sin(t*3+i);
    X.fillStyle=['#9B59B6','#E94560','#3498DB','#F39C12'][i%4];
    X.fillRect(sx-2,sy-2,5,5);
  }
  X.globalAlpha=.15+.05*Math.sin(t*2);
  X.fillStyle='#9B59B6';
  X.beginPath();X.ellipse(px,py-20,22,32,0,0,Math.PI*2);X.fill();
  X.globalAlpha=1;
}

function drawCar(cx,cy,progress){
  X.fillStyle='#F5F5F5';
  X.fillRect(cx,cy,160,30);
  X.fillRect(cx+15,cy-22,120,24);
  X.fillStyle='#E8E8E8';
  X.fillRect(cx+20,cy-24,110,4);
  X.fillStyle=`rgb(${lerp(160,200,progress)|0},${lerp(200,160,progress)|0},${lerp(230,180,progress)|0})`;
  X.fillRect(cx+22,cy-20,42,18);
  X.fillRect(cx+68,cy-20,42,18);
  X.fillStyle='#CCC';X.fillRect(cx+64,cy-20,4,18);
  X.fillStyle='#222';
  X.fillRect(cx+18,cy+26,24,12);X.fillRect(cx+110,cy+26,24,12);
  X.fillStyle='#555';
  X.fillRect(cx+22,cy+28,16,8);X.fillRect(cx+114,cy+28,16,8);
  X.fillStyle='#FFE4A0';X.fillRect(cx+155,cy+8,6,8);
  X.fillStyle='#E94560';X.fillRect(cx-1,cy+8,4,8);
  X.fillStyle='#DDD';X.fillRect(cx,cy+14,160,2);
}

function lerp(a,b,t){return a+(b-a)*t}

// ======================== WORLD MAP ========================
const starField=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H*.7,s:Math.random()*1.5+.5,p:Math.random()*6.28}));

function getMapNodes(){
  const n=levels.length;
  const nodes=[];
  for(let i=0;i<n;i++){
    const t=i/(Math.max(n,2)-1);
    const x=W*.08+t*(W*.82);
    const y=H*(.38+(i%2)*.2);
    nodes.push({x,y});
  }
  return nodes;
}

function updateMap(){
  if(wasTapped('ArrowRight')||wasTapped('KeyD')){sel=Math.min(sel+1,levels.length-1);sfxSelect()}
  if(wasTapped('ArrowLeft')||wasTapped('KeyA')){sel=Math.max(sel-1,0);sfxSelect()}
  if(wasTapped('Space')||wasTapped('Enter')){
    if(levels[sel].unlocked){initAudio();startLevel(sel)}
  }
}

function drawMap(){
  const mapNodes=getMapNodes();
  X.fillStyle=cachedGrad('mapSky',0,0,0,H,[[0,'#0e0b1a'],[1,'#1a1040']]);
  X.fillRect(0,0,W,H);
  const t=Date.now()/1000;
  starField.forEach(s=>{X.globalAlpha=.4+.4*Math.sin(t+s.p);X.fillStyle='#FFD';X.fillRect(s.x,s.y,s.s,s.s)});
  X.globalAlpha=1;
  X.fillStyle='#1a2a15';
  X.fillRect(0,H*.75,W,H*.25);
  X.fillStyle='#243a1d';
  X.fillRect(0,H*.75,W,4);

  X.strokeStyle='#8B7355';X.lineWidth=4;X.setLineDash([8,8]);
  X.beginPath();X.moveTo(mapNodes[0].x,mapNodes[0].y);
  for(let i=1;i<mapNodes.length;i++){
    const prev=mapNodes[i-1],cur=mapNodes[i];
    const mx=(prev.x+cur.x)/2, my=Math.max(prev.y,cur.y)+40;
    X.quadraticCurveTo(mx,my,cur.x,cur.y);
  }
  const last=mapNodes[mapNodes.length-1];
  X.lineTo(last.x+W*.1,last.y+(last.y<H*.5?1:-1)*15);
  X.stroke();X.setLineDash([]);

  levels.forEach((lv,i)=>{
    const n=mapNodes[i];if(!n)return;
    const isSel=i===sel;
    const r=isSel?28:22;
    if(isSel&&lv.unlocked){
      X.fillStyle='rgba(233,69,96,.15)';
      X.beginPath();X.arc(n.x,n.y,r+10,0,Math.PI*2);X.fill();
    }
    X.fillStyle=lv.unlocked?(lv.completed?'#2ECC71':'#E94560'):'#444';
    X.beginPath();X.arc(n.x,n.y,r,0,Math.PI*2);X.fill();
    X.strokeStyle=isSel?'#FFF':'#888';X.lineWidth=isSel?3:2;
    X.beginPath();X.arc(n.x,n.y,r,0,Math.PI*2);X.stroke();
    X.textAlign='center';X.fillStyle='#FFF';
    X.font='bold '+(isSel?20:16)+'px monospace';
    X.fillText(lv.unlocked?(lv.completed?'✓':''+(i+1)):'🔒',n.x,n.y+6);
    X.fillStyle=lv.unlocked?'#FFF':'#666';
    X.font='bold 13px monospace';
    X.fillText(lv.name,n.x,n.y+r+18);
  });

  const futureX=last.x+W*.1,futureY=last.y+(last.y<H*.5?1:-1)*15;
  X.fillStyle='#333';
  X.beginPath();X.arc(futureX,futureY,16,0,Math.PI*2);X.fill();
  X.fillStyle='#555';X.font='bold 14px monospace';
  X.fillText('?',futureX,futureY+5);

  X.fillStyle='#E94560';X.font='bold 38px monospace';
  X.fillText('HEART QUEST',W/2,60);
  X.fillStyle='#D4A030';X.font='bold 16px monospace';
  X.fillText('Our Story',W/2,84);

  X.fillStyle=levels[sel].unlocked?'#FFF':'#666';
  X.font='bold 15px monospace';
  const txt=levels[sel].unlocked?(levels[sel].completed?'Press SPACE to replay':'Press SPACE to play'):'Complete previous level to unlock';
  X.fillText(txt,W/2,H-30);

  X.fillStyle='#555';X.font='12px monospace';
  X.fillText('← → to select',W/2,H-12);
  X.textAlign='left';
}

// ======================== LEVEL MANAGEMENT ========================
function startLevel(idx){
  curLevel=idx;state='playing';phase='intro';phaseT=0;
  particles=[];portalPos.active=false;cam.x=0;
  player.vx=0;player.vy=0;player.frame=0;player.ft=0;player.onG=false;
  levelHandlers[idx].init();
}
function completeLevel(){
  levels[curLevel].completed=true;
  if(curLevel+1<levels.length&&!levels[curLevel+1].unlocked){
    levels[curLevel+1].unlocked=true;
  }
  save();
  state='map';sel=Math.min(curLevel+1,levels.length-1);
}

// ======================== PLAYER PHYSICS ========================
function movePlayer(canJump){
  if(K['ArrowLeft']||K['KeyA']){player.vx-=ACC;if(player.vx<-SPD)player.vx=-SPD;player.facing=-1}
  else if(K['ArrowRight']||K['KeyD']){player.vx+=ACC;if(player.vx>SPD)player.vx=SPD;player.facing=1}
  else{player.vx*=FRIC;if(Math.abs(player.vx)<.2)player.vx=0}
  if(canJump&&(wasTapped('Space')||wasTapped('ArrowUp')||wasTapped('KeyW'))&&player.onG){
    player.vy=JUMP;player.onG=false;sfxJump();
  }
  player.vy+=GRAV;if(player.vy>10)player.vy=10;
  player.x+=player.vx;player.y+=player.vy;
  if(player.x<0)player.x=0;
  if(player.x>lvlWidth-player.w)player.x=lvlWidth-player.w;
  if(player.y+player.h>=GND){player.y=GND-player.h;player.vy=0;player.onG=true}
  player.ft++;
  if(Math.abs(player.vx)>1&&player.onG){if(player.ft%7===0)player.frame=(player.frame+1)%4}
  else if(!player.onG)player.frame=2;
  else player.frame=0;
  const tx=player.x-W/2+player.w/2;
  cam.x+=(tx-cam.x)*.1;
  if(cam.x<0)cam.x=0;
  if(cam.x>lvlWidth-W)cam.x=Math.max(0,lvlWidth-W);
}

function checkPortal(){
  if(!portalPos.active)return false;
  const dx=player.x+player.w/2-portalPos.x;
  const dy=player.y+player.h/2-(portalPos.y-20);
  if(Math.abs(dx)<25&&Math.abs(dy)<35){
    sfxPortal();phase='complete';phaseT=0;
    spark(portalPos.x,portalPos.y-20,'#9B59B6',15);
    spark(portalPos.x,portalPos.y-20,'#E94560',10);
    return true;
  }
  return false;
}

// ======================== SHARED UI ========================
function drawLevelHUD(){
  X.fillStyle='rgba(0,0,0,.35)';X.fillRect(0,0,W,30);
  X.textAlign='center';X.fillStyle='#FFF';X.font='bold 14px monospace';
  X.fillText(levels[curLevel].name,W/2,20);
  X.textAlign='left';
}

function drawIntro(idx){
  const a=phaseT<20?phaseT/20:phaseT>80?(100-phaseT)/20:1;
  X.globalAlpha=Math.max(0,Math.min(1,a));
  X.fillStyle='rgba(0,0,0,.75)';X.fillRect(0,0,W,H);
  X.textAlign='center';
  X.fillStyle='#E94560';X.font='bold 18px monospace';
  X.fillText('Level '+(idx+1),W/2,H/2-20);
  X.fillStyle='#FFF';X.font='bold 28px monospace';
  X.fillText(levels[idx].name,W/2,H/2+15);
  X.textAlign='left';
  X.globalAlpha=1;
}

function drawComplete(){
  const a=Math.min(1,phaseT/30);
  X.globalAlpha=a;
  X.fillStyle='rgba(0,0,0,.6)';X.fillRect(0,0,W,H);
  X.textAlign='center';
  X.fillStyle='#FFD700';X.font='bold 36px monospace';
  X.fillText('Level Complete!',W/2,H/2-10);
  if(curLevel+1<levels.length){
    X.fillStyle='#FFF';X.font='16px monospace';
    X.fillText('Next: '+levels[curLevel+1].name,W/2,H/2+30);
  }
  X.textAlign='left';
  X.globalAlpha=1;
}

// ======================== MAIN LOOP ========================
function bootGame(){
  load();
  function update(){
    updPart();
    if(state==='map')updateMap();
    else if(state==='playing')levelHandlers[curLevel].update();
  }
  function draw(){
    X.clearRect(0,0,W,H);
    if(state==='map')drawMap();
    else if(state==='playing')levelHandlers[curLevel].draw();
  }
  (function loop(){update();draw();requestAnimationFrame(loop)})();
}
