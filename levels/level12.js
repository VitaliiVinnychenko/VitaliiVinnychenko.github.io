// Level 12: Anniversary (April 13th)
(function(){

const CHAT=[
  {s:'b',t:"Hey... can I say something?"},
  {s:'b',t:"I just want you to know..."},
  {s:'b',t:"I'm so incredibly lucky to have you"},
  {s:'b',t:"Every single day with you is a gift"},
  {s:'b',t:"Thank you for being here, Olya"},
  {s:'b',t:"Thank you for choosing me"},
  {s:'b',t:"A whole year together..."},
  {s:'b',t:"And it still feels like the beginning"},
  {s:'b',t:"I want this forever"},
  {s:'b',t:"I want us to grow old together"},
  {s:'b',t:"Till our very last breath"},
  {s:'b',t:"I love you more than I can ever say"},
  {s:'b',t:"Happy anniversary, my love"},
];

let bedX,chatIdx,chatTimer;
let girlLX,girlLY,boyLX,boyLY;

registerLevel('Anniversary',{
  init(){
    lvlWidth=W;
    bedX=W/2-100;
    boyLX=bedX+30;boyLY=GND-68;
    girlLX=bedX+130;girlLY=GND-68;
    chatIdx=-1;chatTimer=0;
    player.x=girlLX;player.y=GND-player.h;player.facing=1;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='end';phaseT=0}
      return;
    }
    if(phase==='end'){
      phaseT++;
      if(phaseT===1){
        levels[curLevel].completed=true;save();
      }
    }
  },
  draw(){
    // Bedroom walls (pale peach)
    X.fillStyle='#F5DDD0';X.fillRect(0,0,W,GND);
    X.fillStyle='#EDD0C0';X.fillRect(0,GND-8,W,8);
    X.fillStyle='#E0C0B0';X.fillRect(0,GND-10,W,3);

    // Floor (warm wood)
    for(let fx=0;fx<W+50;fx+=50){
      X.fillStyle=(Math.floor(fx/50)%2)?'#D4BFA0':'#C8B090';
      X.fillRect(fx,GND,50,H-GND);
      X.fillStyle='rgba(0,0,0,.04)';X.fillRect(fx,GND,50,1);
    }

    // Window (center, above bed)
    const wx=W/2-40;
    X.fillStyle='#E0C0B0';X.fillRect(wx-2,20-2,84,104);
    X.fillStyle='rgba(200,220,240,.5)';X.fillRect(wx,20,80,100);
    X.fillStyle='rgba(220,235,250,.2)';X.fillRect(wx,20,80,50);
    X.fillStyle='#E0C0B0';X.fillRect(wx+38,20,4,100);X.fillRect(wx,68,80,4);
    // Curtains (sheer)
    X.fillStyle='rgba(245,230,220,.5)';X.fillRect(wx-14,16,18,110);X.fillRect(wx+76,16,18,110);

    // === Left side: nightstand (flush against bed) ===
    const lnX=bedX-42;

    // Nightstand
    X.fillStyle='#FFF';X.fillRect(lnX,GND-40,40,40);
    X.fillStyle='#F0F0F0';X.fillRect(lnX+1,GND-39,38,18);
    X.fillStyle='#F0F0F0';X.fillRect(lnX+1,GND-20,38,18);
    X.fillStyle='#CCC';X.fillRect(lnX+15,GND-31,10,3);
    X.fillStyle='#CCC';X.fillRect(lnX+15,GND-12,10,3);

    // === Right side: nightstand + makeup table ===
    const rnX=bedX+202;

    // Nightstand
    X.fillStyle='#FFF';X.fillRect(rnX,GND-40,40,40);
    X.fillStyle='#F0F0F0';X.fillRect(rnX+1,GND-39,38,18);
    X.fillStyle='#F0F0F0';X.fillRect(rnX+1,GND-20,38,18);
    X.fillStyle='#CCC';X.fillRect(rnX+15,GND-31,10,3);
    X.fillStyle='#CCC';X.fillRect(rnX+15,GND-12,10,3);
    // Ceiling light hanging down to nightstand
    const clX=rnX+20;
    const shadeY=GND-120;
    // Cord from ceiling to shade
    X.fillStyle='#D4C4A0';X.fillRect(clX-1,0,2,shadeY);
    // Shade
    X.fillStyle='#F5E8D0';X.fillRect(clX-12,shadeY,24,10);
    X.fillStyle='#FFF8E8';X.fillRect(clX-10,shadeY+2,20,6);
    // Bulb
    X.fillStyle='#FFFAE0';X.fillRect(clX-3,shadeY+10,6,6);
    // Warm glow
    X.fillStyle='rgba(255,240,200,.06)';
    X.beginPath();X.arc(clX,shadeY+12,30,0,Math.PI*2);X.fill();

    // Makeup table (to the right of nightstand)
    const mtX=rnX+44;
    X.fillStyle='#C8BAA8';X.fillRect(mtX,GND-50,90,6);
    X.fillStyle='#B8AA98';X.fillRect(mtX,GND-52,90,3);
    X.fillStyle='#C8BAA8';X.fillRect(mtX+6,GND-44,4,44);X.fillRect(mtX+80,GND-44,4,44);
    X.fillStyle='#D0C2B0';X.fillRect(mtX+16,GND-44,58,18);
    X.fillStyle='#B8AA98';X.fillRect(mtX+42,GND-38,8,3);
    // Perfume
    X.fillStyle='rgba(200,180,220,.5)';X.fillRect(mtX+10,GND-60,8,10);
    X.fillStyle='rgba(180,160,200,.3)';X.fillRect(mtX+12,GND-63,4,4);
    // Lipstick
    X.fillStyle='#C84040';X.fillRect(mtX+25,GND-58,4,8);
    X.fillStyle='#A03030';X.fillRect(mtX+25,GND-62,4,4);
    // Brush
    X.fillStyle='#222';X.fillRect(mtX+36,GND-62,10,4);
    X.fillStyle='#555';X.fillRect(mtX+38,GND-58,6,8);
    // Small plant
    X.fillStyle='#C8A870';X.fillRect(mtX+62,GND-58,12,8);
    X.fillStyle='#4A8A4A';X.fillRect(mtX+64,GND-66,3,10);X.fillRect(mtX+68,GND-70,3,14);X.fillRect(mtX+72,GND-64,3,8);

    // Round mirror on wall just above makeup table
    const mirX=mtX+45,mirY=GND-100;
    X.fillStyle='#D4C4A0';
    X.beginPath();X.arc(mirX,mirY,34,0,Math.PI*2);X.fill();
    X.fillStyle='rgba(210,225,240,.35)';
    X.beginPath();X.arc(mirX,mirY,31,0,Math.PI*2);X.fill();
    X.fillStyle='rgba(255,255,255,.15)';
    X.beginPath();X.arc(mirX-10,mirY-10,12,0,Math.PI*2);X.fill();

    // === Bed (grey-beige) ===
    const bx=bedX;
    // Bed frame
    X.fillStyle='#C8BAA8';X.fillRect(bx,GND-30,200,30);
    X.fillStyle='#B8AA98';X.fillRect(bx,GND-32,200,4);
    // Headboard
    X.fillStyle='#C8BAA8';X.fillRect(bx,GND-80,200,50);
    X.fillStyle='#D0C2B0';X.fillRect(bx+4,GND-78,192,46);
    // Tufting on headboard
    X.fillStyle='#C0B2A0';
    X.fillRect(bx+50,GND-78,2,46);X.fillRect(bx+100,GND-78,2,46);X.fillRect(bx+150,GND-78,2,46);
    // Mattress
    X.fillStyle='#E8E0D8';X.fillRect(bx+4,GND-30,192,6);
    // Blanket
    X.fillStyle='#D8D0C4';X.fillRect(bx+4,GND-24,192,20);
    X.fillStyle='#CCC4B8';X.fillRect(bx+4,GND-24,192,4);
    // Pillows
    X.fillStyle='#F0EAE0';X.fillRect(bx+15,GND-42,40,14);X.fillRect(bx+145,GND-42,40,14);
    X.fillStyle='#E8E2D8';X.fillRect(bx+17,GND-40,36,10);X.fillRect(bx+147,GND-40,36,10);
    // Blanket fold over characters
    X.fillStyle='#D8D0C4';X.fillRect(bx+20,GND-52,160,10);

    // Characters lying in bed (sitting mode hides legs, blanket covers rest)
    if(phase!=='intro'){
      drawBoy(boyLX,boyLY,1,true,'bluetshirt');
      drawGirl(girlLX,girlLY,-1,0,'lounge',true);

      // MacBook on Olya's lap (on top of blanket)
      const lx=girlLX+2,ly=girlLY+20;
      // Base
      X.fillStyle='#C0C0C0';X.fillRect(lx-2,ly,26,2);
      // Screen
      X.fillStyle='#C0C0C0';X.fillRect(lx-2,ly-16,26,16);
      X.fillStyle='#222';X.fillRect(lx,ly-14,22,12);
      // Screen glow
      const st=Date.now()/2000;
      X.fillStyle=`hsl(${(st*30)%360},30%,60%)`;X.fillRect(lx+1,ly-13,20,10);
      // Apple logo hint
      X.fillStyle='rgba(255,255,255,.15)';X.fillRect(lx+9,ly-10,4,4);
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      let bxx,by,speaker;
      if(line.s==='g'){bxx=girlLX+10;by=girlLY-40;speaker='Olya'}
      else if(line.s==='b'){bxx=boyLX+10;by=boyLY-40;speaker='Vitalik'}
      else{bxx=W/2;by=GND-90;speaker='Leo'}
      bubble(bxx,by,line.t,line.s==='g'?'left':'right',speaker);
    }

    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='end'){
      X.fillStyle='rgba(0,0,0,.5)';X.fillRect(0,0,W,H);
      X.textAlign='center';X.fillStyle='#FFD700';X.font='bold 28px monospace';
      X.fillText('Happy Anniversary!',W/2,H/2-20);
      X.fillStyle='#E94560';X.font='bold 18px monospace';
      X.fillText('April 13th',W/2,H/2+15);
      X.fillStyle='#FFF';X.font='16px monospace';
      X.fillText('I love you, Olya',W/2,H/2+45);
      X.textAlign='left';

      // Floating hearts
      const ht=Date.now()/500;
      X.fillStyle='rgba(233,69,96,.4)';
      for(let i=0;i<8;i++){
        const hx=W*.1+i*(W*.1)+Math.sin(ht+i*1.3)*20;
        const hy=H*.3+Math.sin(ht*.7+i*.9)*40;
        X.font='20px monospace';X.textAlign='center';
        X.fillText('\u2665',hx,hy);
      }
      X.textAlign='left';
    }
  }
});

})();
