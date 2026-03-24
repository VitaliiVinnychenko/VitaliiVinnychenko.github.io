// Level 11: The Gas War
(function(){

const CHAT=[
  {s:'g',t:"This is so cozy"},
  {s:'b',t:"Yeah, just us and—"},
  {s:'b',t:"...sorry"},
  {s:'g',t:"Did you just...?"},
  {s:'b',t:"Maybe"},
  {s:'g',t:"VITALII!"},
  {s:'b',t:"It slipped out!"},
  {s:'g',t:"Well... since we're being honest..."},
  {s:'b',t:"Wait, no—"},
  {s:'g',t:"Too late"},
  {s:'b',t:"OLYA!!"},
  {s:'g',t:"What? You started it!"},
  {s:'b',t:"Fair enough. We're even now"},
  {s:'c',t:"*shifts position*"},
  {s:'g',t:"Wait... do you smell that?"},
  {s:'b',t:"That's not me this time"},
  {s:'g',t:"LEO?!"},
  {s:'c',t:"*innocent face*"},
  {s:'b',t:"Oh my god"},
  {s:'g',t:"It's like a gas pipe exploded"},
  {s:'b',t:"Someone turned the vent on full blast"},
  {s:'g',t:"My eyes are watering!"},
  {s:'c',t:"*purrs proudly*"},
  {s:'b',t:"He's PROUD of it!"},
  {s:'g',t:"That's twice as toxic as both of us combined"},
  {s:'b',t:"I think he's been saving that one"},
  {s:'g',t:"How does something so small produce THAT"},
  {s:'c',t:"*THE FINAL FART*"},
  {s:'b',t:"EVACUATE!!! EVACUATE!!!"},
  {s:'g',t:"WE NEED TO LEAVE. NOW."},
];

let sofaX,tvX,catX,chatIdx,chatTimer,purrTimer;
let girlSitX,girlSitY,boySitX,boySitY;
let boyWalkX,boyWalkFrame,boyWalkFT;
let gasLevel,gasClouds;

function spawnCloud(cx,cy,size){
  gasClouds.push({x:cx,y:cy,s:size,t:0,dx:(Math.random()-.5)*1.2,dy:-Math.random()*.4-.1});
}

registerLevel('The Gas War',{
  init(){
    lvlWidth=W;
    sofaX=W/2-70;tvX=sofaX-70;
    catX=sofaX+60;
    girlSitX=sofaX+10;girlSitY=GND-50;
    boySitX=sofaX+90;boySitY=GND-50;
    chatIdx=-1;chatTimer=0;purrTimer=0;
    player.x=girlSitX;player.y=GND-player.h;player.facing=1;
    boyWalkX=boySitX;boyWalkFrame=0;boyWalkFT=0;
    gasLevel=0;gasClouds=[];
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;purrTimer++;
      if(purrTimer%200===0)sfxPurr();
      if(chatTimer<=0&&chatIdx<CHAT.length-1){
        chatIdx++;chatTimer=140;sfxChat();
        // Gas events
        if(chatIdx===2){spawnCloud(boySitX+10,GND-40,14);gasLevel=1}
        if(chatIdx===9){spawnCloud(girlSitX+10,GND-40,14);gasLevel=2}
        if(chatIdx===16){spawnCloud(catX+12,GND-55,18);gasLevel=4}
        if(chatIdx===22){spawnCloud(catX+12,GND-55,20);gasLevel=6}
        if(chatIdx===27){
          // THE FINAL FART
          for(let i=0;i<8;i++) spawnCloud(catX+12+Math.random()*20-10,GND-55-Math.random()*20,16+Math.random()*12);
          gasLevel=10;
        }
      }
      // Update clouds
      for(let i=gasClouds.length-1;i>=0;i--){
        const c=gasClouds[i];
        c.t++;c.x+=c.dx;c.y+=c.dy;
        if(c.t>300)gasClouds.splice(i,1);
      }
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=W-50;portalPos.y=GND;portalPos.active=true;
        sfxPortal();
        player.x=girlSitX;player.y=GND-player.h;
        boyWalkX=boySitX;
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
      for(let i=gasClouds.length-1;i>=0;i--){
        const c=gasClouds[i];c.t++;c.x+=c.dx;c.y+=c.dy;
        if(c.t>300)gasClouds.splice(i,1);
      }
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
    const sitting=phase==='chat';

    // Apartment walls
    X.fillStyle='#E8E8E8';X.fillRect(0,0,W,GND);
    X.fillStyle='#D8D8D8';X.fillRect(0,GND-8,W,8);
    X.fillStyle='#BBB';X.fillRect(0,GND-10,W,3);

    // Floor
    for(let fx=0;fx<W+50;fx+=50){
      X.fillStyle=(Math.floor(fx/50)%2)?'#D4BFA0':'#C8B090';
      X.fillRect(fx,GND,50,H-GND);
      X.fillStyle='rgba(0,0,0,.04)';X.fillRect(fx,GND,50,1);
    }

    // Windows
    [50,650].forEach(wx=>{
      X.fillStyle='#CCC';X.fillRect(wx-2,40-2,84,124);
      X.fillStyle='rgba(170,205,235,.4)';X.fillRect(wx,40,80,120);
      X.fillStyle='rgba(190,215,240,.1)';X.fillRect(wx,40,80,60);
      X.fillStyle='#CCC';X.fillRect(wx+38,40,4,120);X.fillRect(wx,98,80,4);
      X.fillStyle='rgba(200,200,210,.4)';X.fillRect(wx-8,36,18,130);X.fillRect(wx+70,36,18,130);
    });

    // TV
    const tvsx=tvX;
    X.fillStyle='#222';X.fillRect(tvsx,120,100,60);
    X.fillStyle='#333';X.fillRect(tvsx+2,122,96,56);
    const nfT=Date.now()/3000;
    X.fillStyle=`hsl(${5+Math.sin(nfT)*5},70%,${35+Math.sin(nfT*2)*5}%)`;
    X.fillRect(tvsx+4,124,92,52);
    X.fillStyle='rgba(229,9,20,.6)';X.fillRect(tvsx+38,132,6,36);X.fillRect(tvsx+52,132,6,36);
    X.beginPath();X.moveTo(tvsx+38,132);X.lineTo(tvsx+58,168);X.lineTo(tvsx+58,160);X.lineTo(tvsx+38,124);X.fill();
    X.fillStyle='#555';X.fillRect(tvsx+20,180,60,6);
    X.fillRect(tvsx+30,186,4,30);X.fillRect(tvsx+66,186,4,30);

    // PlayStation
    const psX=tvsx+30,psY=GND-14;
    X.fillStyle='#1A1A1A';X.fillRect(psX,psY,40,10);
    X.fillStyle='#111';X.fillRect(psX+2,psY+1,36,8);
    X.fillStyle='rgba(70,130,255,.6)';X.fillRect(psX+5,psY+4,30,2);
    X.fillStyle='#222';X.fillRect(psX-25,GND-6,22,6);
    X.fillStyle='#1A1A1A';X.fillRect(psX-24,GND-8,8,3);X.fillRect(psX-14,GND-8,8,3);
    X.fillStyle='rgba(70,130,255,.4)';X.fillRect(psX-22,GND-9,16,1);

    // Blue sofa
    const ssx=sofaX;
    X.fillStyle='#3A6FA5';X.fillRect(ssx,GND-50,180,42);
    X.fillStyle='#4A7FB5';X.fillRect(ssx+4,GND-48,172,36);
    X.fillStyle='#3A6FA5';X.fillRect(ssx,GND-90,180,44);
    X.fillStyle='#4A7FB5';X.fillRect(ssx+4,GND-86,172,36);
    X.fillStyle='#3468A0';X.fillRect(ssx-8,GND-70,14,62);X.fillRect(ssx+174,GND-70,14,62);
    X.fillStyle='#3468A0';X.fillRect(ssx+60,GND-48,3,36);X.fillRect(ssx+120,GND-48,3,36);
    X.fillStyle='#555';X.fillRect(ssx+8,GND-8,6,8);X.fillRect(ssx+166,GND-8,6,8);
    X.fillStyle='#5A9FD5';X.fillRect(ssx+8,GND-80,24,18);X.fillRect(ssx+148,GND-80,24,18);

    // Coffee table with snacks
    X.fillStyle='#AAA';X.fillRect(ssx+30,GND-20,120,6);
    X.fillStyle='#999';X.fillRect(ssx+40,GND-14,4,14);X.fillRect(ssx+136,GND-14,4,14);
    X.fillStyle='#D4886A';X.fillRect(ssx+50,GND-26,16,6);
    X.fillStyle='#FFF';X.fillRect(ssx+48,GND-26,20,2);
    X.fillStyle='#E8C840';X.fillRect(ssx+80,GND-28,18,8);
    X.fillStyle='#D4B030';X.fillRect(ssx+82,GND-30,5,4);X.fillRect(ssx+89,GND-30,5,4);

    // Rug
    X.fillStyle='rgba(180,160,140,.25)';X.fillRect(ssx-20,GND,220,H-GND);

    // Leo on the sofa
    if(phase!=='intro'){
      drawCat(catX,GND-60,1,true);
      if(phase==='chat'){
        X.fillStyle='#888';X.font='bold 10px monospace';X.textAlign='center';
        const pa=.4+.3*Math.sin(Date.now()/300);
        X.globalAlpha=pa;
        X.fillText('~purr~',catX+12,GND-66);
        X.globalAlpha=1;X.textAlign='left';
      }
    }

    // Characters
    if(phase!=='intro'){
      if(sitting){
        drawGirl(girlSitX,girlSitY-2,1,0,'lounge',true);
        drawBoy(boySitX,boySitY-2,-1,true,'bluetshirt');
      }else{
        drawGirl(player.x,player.y,player.facing,player.frame,'lounge',false);
        const bf=portalPos.x>boyWalkX?1:-1;
        drawBoy(boyWalkX,GND-player.h,bf,false,'bluetshirt');
      }
    }

    // Gas clouds
    const now=Date.now()/400;
    gasClouds.forEach(c=>{
      const alpha=Math.max(0,.35-c.t*.001);
      const sz=c.s+c.t*.04;
      X.fillStyle=`rgba(120,140,60,${alpha})`;
      X.beginPath();X.arc(c.x,c.y,sz,0,Math.PI*2);X.fill();
      X.fillStyle=`rgba(90,110,40,${alpha*.5})`;
      X.beginPath();X.arc(c.x+sz*.3,c.y-sz*.2,sz*.5,0,Math.PI*2);X.fill();
    });

    // Green tint overlay scales with gasLevel
    if(gasLevel>0){
      const ga=Math.min(gasLevel*.018,.18);
      X.fillStyle=`rgba(80,100,30,${ga})`;
      X.fillRect(0,0,W,H);
      // Stink lines near Leo when gas is high
      if(gasLevel>=4){
        X.strokeStyle=`rgba(100,120,40,${.15+.1*Math.sin(now)})`;
        X.lineWidth=2;
        for(let i=0;i<3;i++){
          const sx=catX+5+i*10;
          const sy=GND-70-i*5;
          X.beginPath();
          X.moveTo(sx,sy);
          X.quadraticCurveTo(sx+Math.sin(now+i)*6,sy-12,sx+Math.sin(now+i+1)*4,sy-24);
          X.stroke();
        }
      }
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      let bx,by,speaker;
      if(line.s==='g'){bx=girlSitX+10;by=girlSitY-40;speaker='Olya'}
      else if(line.s==='b'){bx=boySitX+10;by=boySitY-40;speaker='Vitalik'}
      else{bx=catX+12;by=GND-76;speaker='Leo'}
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
