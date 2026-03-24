// Level 0: The Match
(function(){

const CHAT=[
  {s:'b',t:"Hey! I see you're into manga?"},
  {s:'g',t:"Yesss! Soul Eater is my fav"},
  {s:'b',t:"Great taste! Into PopScience stuff?"},
  {s:'g',t:"OMG yes! Love those videos"},
  {s:'b',t:"Manga AND science videos? No way"},
  {s:'b',t:"And gorgeous too btw"},
  {s:'g',t:"Haha smooth talker!"},
  {s:'b',t:"So where are you from?"},
  {s:'g',t:"Sykhiv!"},
  {s:'b',t:"Oh so basically not Lviv then"},
  {s:'b',t:"More like a whole different city 😅"},
  {s:'g',t:"EXCUSE ME??"},
  {s:'g',t:"Sykhiv IS Lviv!!"},
  {s:'b',t:"Kidding kidding! 😂"},
  {s:'g',t:"Hmph. Not funny."},
];

let chatIdx=-1, sitting=true;

registerLevel('The Match',{
  init(){
    lvlWidth=W;
    player.x=W/2-40;player.y=GND-player.h;player.facing=1;
    chatIdx=-1;sitting=true;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;
      if(wasTapped('Space')||wasTapped('Enter')){
        if(chatIdx<CHAT.length-1){chatIdx++;sfxChat()}
        else{phase='portalAppear';phaseT=0}
      }
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=W-80;portalPos.y=GND;portalPos.active=true;
        sfxPortal();sitting=false;
        player.x=W/2-40;player.y=GND-player.h;
      }
      if(phaseT>40){phase='portal';phaseT=0}
      return;
    }
    if(phase==='portal'){movePlayer(true);cam.x=0;checkPortal();return}
    if(phase==='complete'){
      phaseT++;
      spark(portalPos.x,portalPos.y-20,['#E94560','#9B59B6','#FFD700'][Math.floor(Math.random()*3)],1);
      if(phaseT>120)completeLevel();
    }
  },
  draw(){
    X.fillStyle='#F2E6D6';X.fillRect(0,0,W,GND);
    X.fillStyle=cachedGrad('l0warm',0,0,0,GND,[[0,'rgba(255,240,220,.15)'],[1,'rgba(240,220,200,.08)']]);
    X.fillRect(0,0,W,GND);
    X.fillStyle='#E0D0C0';X.fillRect(0,GND-8,W,8);
    X.fillStyle='#D0C0B0';X.fillRect(0,GND-10,W,3);
    X.fillStyle='#D8C8B8';X.fillRect(0,GND,W,H-GND);
    X.fillStyle='#D0C0B0';X.fillRect(0,GND,W,2);

    // Window
    const wx=560;
    X.fillStyle='#CCC';X.fillRect(wx-2,60-2,94,104);
    X.fillStyle=cachedGrad('l0win',wx,60,wx,160,[[0,'rgba(180,210,240,.45)'],[1,'rgba(160,190,220,.3)']]);
    X.fillRect(wx,60,90,100);
    X.fillStyle='#CCC';X.fillRect(wx+43,60,4,100);X.fillRect(wx,108,90,4);
    X.fillStyle='rgba(240,220,230,.5)';
    X.fillRect(wx-10,56,16,112);X.fillRect(wx+84,56,16,112);

    // Nightstand
    X.fillStyle='#B8A898';X.fillRect(140,GND-40,50,40);
    X.fillStyle='#A89888';X.fillRect(140,GND-42,50,4);
    X.fillStyle='#F0D0A0';X.fillRect(155,GND-68,20,10);
    X.fillRect(160,GND-58,10,16);
    X.fillStyle='rgba(255,220,160,.06)';
    X.beginPath();X.arc(165,GND-63,35,0,Math.PI*2);X.fill();

    // Picture
    X.fillStyle='#C0A890';X.fillRect(420,80,50,40);
    X.fillStyle='#E8D8C8';X.fillRect(422,82,46,36);
    X.fillStyle='#E094A0';X.fillRect(432,90,12,8);X.fillRect(438,86,12,10);

    // Sofa
    const bx=220,by=GND-50;
    X.fillStyle='#D07020';X.fillRect(bx,by,170,42);
    X.fillStyle='#E88030';X.fillRect(bx+4,by+4,162,34);
    X.fillStyle='#D07020';X.fillRect(bx,by-45,170,48);
    X.fillStyle='#E88030';X.fillRect(bx+4,by-40,162,38);
    X.fillStyle='#C06018';X.fillRect(bx-10,by-30,14,72);X.fillRect(bx+166,by-30,14,72);
    X.fillStyle='#C06818';X.fillRect(bx+58,by+4,3,34);X.fillRect(bx+113,by+4,3,34);
    X.fillStyle='#555';X.fillRect(bx+8,by+38,6,12);X.fillRect(bx+156,by+38,6,12);
    X.fillStyle='#F0A040';X.fillRect(bx+10,by-35,28,22);X.fillRect(bx+132,by-35,28,22);

    // Goose
    const gx=bx+60,gy=by-55;
    X.fillStyle='#F5F5F0';
    X.fillRect(gx,gy+10,50,20);X.fillRect(gx-5,gy+14,60,14);
    X.fillRect(gx+42,gy+2,10,14);X.fillRect(gx+48,gy-6,8,12);
    X.fillRect(gx+52,gy-10,14,12);
    X.fillStyle='#F0A030';X.fillRect(gx+64,gy-8,10,5);
    X.fillStyle='#E09020';X.fillRect(gx+64,gy-4,10,3);
    X.fillStyle='#111';X.fillRect(gx+56,gy-7,3,3);
    X.fillStyle='#E8E8E0';X.fillRect(gx+8,gy+10,28,8);
    X.fillRect(gx-8,gy+12,8,10);X.fillRect(gx-12,gy+10,6,6);
    X.fillStyle='rgba(255,160,140,.3)';X.fillRect(gx+54,gy-3,6,4);

    // Olya on sofa
    if(sitting&&phase!=='intro'){
      drawGirl(bx+55,by-28,1,0,'lounge',true);
      X.fillStyle='#222';X.fillRect(bx+72,by-14,7,12);
      X.fillStyle='#4488FF';X.fillRect(bx+73,by-13,5,10);
    }

    // Olya standing
    if(!sitting){
      drawGirl(player.x,player.y,player.facing,player.frame,'lounge',false);
    }

    // Phone chat overlay
    if(phase==='chat'){
      const pw=240,ph=300;
      const px=W/2-pw/2+160,py=20;
      X.fillStyle='#1a1a1a';X.fillRect(px-4,py-4,pw+8,ph+8);
      X.fillStyle='#111';X.fillRect(px,py,pw,ph);
      X.fillStyle='#FD3A73';X.fillRect(px,py,pw,28);
      X.textAlign='center';X.fillStyle='#FFF';X.font='bold 13px monospace';
      X.fillText('Tinder',px+pw/2,py+19);
      X.fillStyle='#f5f5f5';X.fillRect(px+4,py+32,pw-8,ph-40);

      let my=py+38;
      const maxVis=Math.floor((ph-50)/24);
      const startI=Math.max(0,chatIdx-maxVis+1);
      X.font='11px monospace';
      for(let i=startI;i<=chatIdx&&i<CHAT.length;i++){
        const msg=CHAT[i];
        const tw=X.measureText(msg.t).width;
        const bw=Math.min(tw+12,pw-30);
        if(msg.s==='g'){
          X.fillStyle='#FD3A73';
          X.fillRect(px+pw-bw-10,my,bw,20);
          X.fillStyle='#FFF';X.textAlign='right';
          X.fillText(msg.t,px+pw-14,my+14);
        }else{
          X.fillStyle='#DDD';
          X.fillRect(px+10,my,bw,20);
          X.fillStyle='#333';X.textAlign='left';
          X.fillText(msg.t,px+16,my+14);
        }
        my+=24;
      }
      X.textAlign='left';

      const blink=Math.sin(Date.now()/300)>.1;
      if(blink){
        X.fillStyle='rgba(0,0,0,.5)';X.fillRect(px+10,py+ph-30,pw-20,24);
        X.fillStyle='#FFD700';X.textAlign='center';X.font='bold 12px monospace';
        const prompt=chatIdx>=CHAT.length-1?'Press SPACE to continue':'Press SPACE';
        X.fillText(prompt,px+pw/2,py+ph-14);
        X.textAlign='left';
      }
    }

    if(portalPos.active)drawPortal(portalPos.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
