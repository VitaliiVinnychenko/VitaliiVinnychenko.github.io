// Level 8: 9 Months
(function(){

const CHAT=[
  {s:'g',t:"Nine months already!"},
  {s:'b',t:"Time flies when you're happy"},
  {s:'g',t:"Aww, that was smooth"},
  {s:'b',t:"I have my moments"},
  {s:'g',t:"Should we light the candle?"},
  {s:'b',t:"Go for it!"},
  {s:'g',t:"Make a wish!"},
  {s:'b',t:"Done. Now champagne?"},
  {s:'g',t:"Obviously!"},
  {s:'c',t:"*meow*"},
  {s:'b',t:"Leonid wants some too"},
  {s:'g',t:"LIONYA! Oh my god that name"},
  {s:'b',t:"He answers to both now"},
  {s:'g',t:"He doesn't answer to either"},
  {s:'b',t:"Fair point"},
  {s:'c',t:"*stares judgmentally*"},
  {s:'g',t:"See? Classic Lionya move"},
  {s:'b',t:"He's plotting something"},
  {s:'g',t:"Probably wants cake"},
  {s:'b',t:"Absolutely not. Cats can't have cake"},
  {s:'c',t:"*knocks a crumb off the table*"},
  {s:'g',t:"LIONYA!!"},
  {s:'b',t:"And there it is"},
  {s:'g',t:"Cheers to us! And to Leonid"},
  {s:'b',t:"Cheers, love"},
];

let tableX,catX,chatIdx,chatTimer,purrTimer;
let girlStandX,boyStandX;
let boyWalkX,boyWalkFrame,boyWalkFT;
let popT;

registerLevel('Moving In',{
  init(){
    lvlWidth=W;
    tableX=W/2-30;
    girlStandX=tableX-40;
    boyStandX=tableX+70;
    catX=tableX+20;
    chatIdx=-1;chatTimer=0;purrTimer=0;popT=0;
    player.x=girlStandX;player.y=GND-player.h;player.facing=1;
    boyWalkX=boyStandX;boyWalkFrame=0;boyWalkFT=0;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;purrTimer++;
      if(purrTimer%200===0)sfxPurr();
      if(chatTimer<=0&&chatIdx<CHAT.length-1){
        chatIdx++;chatTimer=140;sfxChat();
        // Pop champagne at "Obviously!" line
        if(chatIdx===8){popT=1;sfxKiss();spark(tableX+30,GND-70,'#FFD700',12);spark(tableX+30,GND-70,'#FFF',8)}
      }
      if(popT>0)popT++;
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=W-70;portalPos.y=GND;portalPos.active=true;
        sfxPortal();
        player.x=girlStandX;player.y=GND-player.h;
        boyWalkX=boyStandX;
      }
      if(phaseT>40){phase='portal';phaseT=0}
      return;
    }
    if(phase==='portal'){
      movePlayer(true);cam.x=0;
      const target=player.x-30;
      if(Math.abs(boyWalkX-target)>2){
        const dir=target>boyWalkX?1:-1;
        boyWalkX+=dir*SPD*.8;
        boyWalkFT++;
        if(boyWalkFT%7===0)boyWalkFrame=(boyWalkFrame+1)%4;
      }else{boyWalkFrame=0}
      checkPortal();return;
    }
    if(phase==='complete'){
      phaseT++;
      const target=portalPos.x-30;
      if(boyWalkX<target-2)boyWalkX+=SPD*.8;
      spark(portalPos.x,portalPos.y-20,['#E94560','#9B59B6','#FFD700'][Math.floor(Math.random()*3)],1);
      if(phaseT>120)completeLevel();
    }
  },
  draw(){
    // Kitchen walls (white, minimalistic)
    X.fillStyle='#F5F5F5';X.fillRect(0,0,W,GND);
    // Subtle wall texture
    X.fillStyle='#F0F0F0';X.fillRect(0,GND-8,W,8);
    X.fillStyle='#E8E8E8';X.fillRect(0,GND-10,W,3);

    // Floor (light grey tiles)
    for(let fx=0;fx<W+60;fx+=60){
      X.fillStyle=(Math.floor(fx/60)%2)?'#E0E0E0':'#D8D8D8';
      X.fillRect(fx,GND,60,H-GND);
      X.fillStyle='rgba(0,0,0,.03)';X.fillRect(fx,GND,60,1);X.fillRect(fx,GND,1,H-GND);
    }

    // Kitchen cabinets (upper, along back wall)
    // White cabinets with black countertop style
    const cabY=50;
    // Upper cabinets
    [40,150,260,520,630].forEach(cx=>{
      X.fillStyle='#FFF';X.fillRect(cx,cabY,90,80);
      X.fillStyle='#E8E8E8';X.fillRect(cx+1,cabY+1,88,78);
      X.fillStyle='#FFF';X.fillRect(cx+4,cabY+4,82,72);
      // Handle
      X.fillStyle='#222';X.fillRect(cx+38,cabY+30,14,3);
      // Black bottom edge
      X.fillStyle='#1A1A1A';X.fillRect(cx,cabY+78,90,4);
    });

    // Lower cabinets / counter
    const counterY=GND-80;
    // Countertop (black)
    X.fillStyle='#1A1A1A';X.fillRect(20,counterY,W-40,6);
    // White cabinet bodies below
    [40,150,260,520,630].forEach(cx=>{
      X.fillStyle='#FFF';X.fillRect(cx,counterY+6,90,74);
      X.fillStyle='#E8E8E8';X.fillRect(cx+1,counterY+7,88,72);
      X.fillStyle='#FFF';X.fillRect(cx+4,counterY+10,82,66);
      // Handle
      X.fillStyle='#222';X.fillRect(cx+38,counterY+35,14,3);
    });

    // Backsplash (white tile between upper and lower)
    X.fillStyle='#FAFAFA';X.fillRect(20,cabY+82,W-40,counterY-cabY-82);
    X.fillStyle='#F0F0F0';
    for(let ty=cabY+82;ty<counterY;ty+=20){
      X.fillRect(20,ty,W-40,1);
    }
    for(let tx=20;tx<W-40;tx+=30){
      X.fillRect(tx,cabY+82,1,counterY-cabY-82);
    }

    // Sink area (center of counter)
    X.fillStyle='#CCC';X.fillRect(380,counterY-2,60,8);
    X.fillStyle='#AAA';X.fillRect(390,counterY-4,40,4);
    // Faucet
    X.fillStyle='#BBB';X.fillRect(408,counterY-20,4,18);X.fillRect(400,counterY-22,20,4);

    // Window (above sink)
    X.fillStyle='#DDD';X.fillRect(375,cabY+10,70,60);
    X.fillStyle='rgba(170,210,240,.4)';X.fillRect(378,cabY+13,64,54);
    X.fillStyle='#DDD';X.fillRect(409,cabY+10,2,60);X.fillRect(375,cabY+38,70,2);

    // Black table
    const tsx=tableX;
    X.fillStyle='#1A1A1A';X.fillRect(tsx,GND-38,60,6);
    X.fillStyle='#111';X.fillRect(tsx,GND-40,60,3);
    // Legs
    X.fillStyle='#1A1A1A';
    X.fillRect(tsx+5,GND-32,4,32);X.fillRect(tsx+51,GND-32,4,32);

    // White cake with candle
    X.fillStyle='#FFF';X.fillRect(tsx+18,GND-52,24,14);
    X.fillStyle='#F0F0F0';X.fillRect(tsx+18,GND-52,24,3);
    X.fillStyle='#E8E8E8';X.fillRect(tsx+20,GND-50,20,2);
    // Frosting detail
    X.fillStyle='#FFF';
    X.fillRect(tsx+18,GND-44,2,6);X.fillRect(tsx+23,GND-44,2,6);
    X.fillRect(tsx+28,GND-44,2,6);X.fillRect(tsx+33,GND-44,2,6);
    X.fillRect(tsx+38,GND-44,2,6);
    // Candle
    X.fillStyle='#E94560';X.fillRect(tsx+28,GND-60,4,8);
    // Flame
    const ft=Date.now()/200;
    X.fillStyle='#FF8C00';X.fillRect(tsx+28+Math.sin(ft)*.5,GND-64,4,4);
    X.fillStyle='#FFD700';X.fillRect(tsx+29,GND-63,2,2);

    // Champagne bottle (after pop)
    if(popT>0||chatIdx>=8){
      X.fillStyle='#2A5A2A';X.fillRect(tsx+2,GND-56,8,18);
      X.fillStyle='#1A4A1A';X.fillRect(tsx+3,GND-56,6,4);
      X.fillStyle='#D4A030';X.fillRect(tsx+3,GND-60,6,5);
      // Two glasses
      X.fillStyle='rgba(255,255,255,.4)';
      X.fillRect(tsx+44,GND-52,5,10);X.fillRect(tsx+44,GND-42,5,2);
      X.fillRect(tsx+45,GND-40,3,4);X.fillRect(tsx+43,GND-36,7,2);
      X.fillRect(tsx+52,GND-52,5,10);X.fillRect(tsx+52,GND-42,5,2);
      X.fillRect(tsx+53,GND-40,3,4);X.fillRect(tsx+51,GND-36,7,2);
      // Champagne in glasses
      X.fillStyle='rgba(240,220,120,.4)';
      X.fillRect(tsx+44,GND-48,5,6);X.fillRect(tsx+52,GND-48,5,6);
    }

    // Champagne pop particles
    if(popT>0&&popT<60){
      X.fillStyle='rgba(255,215,0,.3)';
      for(let i=0;i<5;i++){
        const a=popT*.1+i;
        const r=popT*.8;
        X.fillRect(tsx+30+Math.cos(a)*r,GND-65-Math.sin(a)*r*.5-popT*.3,3,3);
      }
    }

    // Characters (standing)
    if(phase!=='intro'){
      if(phase==='chat'){
        drawGirl(girlStandX,GND-player.h,1,0,'sporty',false);
        drawBoy(boyStandX,GND-player.h,-1,false,'cozy');
      }else{
        drawGirl(player.x,player.y,player.facing,player.frame,'sporty',false);
        const bf=portalPos.x>boyWalkX?1:-1;
        drawBoy(boyWalkX,GND-player.h,bf,false,'cozy');
      }
    }

    // Leo (near the table, on the floor)
    if(phase!=='intro'){
      drawCat(catX,GND-16,-1,true);
      if(phase==='chat'){
        X.fillStyle='#888';X.font='bold 10px monospace';X.textAlign='center';
        const pa=.4+.3*Math.sin(Date.now()/300);
        X.globalAlpha=pa;
        X.fillText('~purr~',catX+12,GND-22);
        X.globalAlpha=1;X.textAlign='left';
      }
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      let bx,by,speaker;
      if(line.s==='g'){bx=girlStandX+10;by=GND-player.h-50;speaker='Olya'}
      else if(line.s==='b'){bx=boyStandX+10;by=GND-player.h-50;speaker='Vitalik'}
      else{bx=catX+12;by=GND-38;speaker='Leo'}
      bubble(bx,by,line.t,line.s==='g'?'left':'right',speaker);
    }

    if(portalPos.active)drawPortal(portalPos.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
