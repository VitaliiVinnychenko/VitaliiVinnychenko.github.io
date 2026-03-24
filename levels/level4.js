// Level 4: Official
(function(){

const CHAT=[
  {s:'g',t:"That was such a fun trip!"},
  {s:'b',t:"Even without the banosh"},
  {s:'g',t:"Ugh, that roadblock... I was SO hungry"},
  {s:'b',t:"Slavske owes us a proper meal"},
  {s:'g',t:"We're definitely going back!"},
  {s:'b',t:"Deal. Next time we make it"},
  {s:'c',t:"*purrrrrr*"},
  {s:'g',t:"Hey... can I ask you something?"},
  {s:'b',t:"Sure, what's up?"},
  {s:'g',t:"Are we... dating?"},
  {s:'b',t:"I thought that was obvious?"},
  {s:'g',t:"Well you never actually said it!"},
  {s:'b',t:"Fair enough. Olya..."},
  {s:'b',t:"Do you want to be my girlfriend?"},
  {s:'g',t:"...yes! Obviously yes!"},
  {s:'c',t:"*meow*"},
  {s:'g',t:"Even Leo approves!"},
];

let sofaX,tvX,catX,catLying,chatIdx,chatTimer,purrTimer;
let girlSitX,girlSitY,boySitX,boySitY;
let boyWalkX,boyWalkFrame,boyWalkFT;

registerLevel('Official',{
  init(){
    lvlWidth=W;
    sofaX=W/2-70;tvX=sofaX-70;
    girlSitX=sofaX+10;girlSitY=GND-50;
    boySitX=sofaX+80;boySitY=GND-50;
    catX=sofaX+55;catLying=true;
    chatIdx=-1;chatTimer=0;purrTimer=0;
    player.x=girlSitX;player.y=GND-player.h;player.facing=1;
    boyWalkX=boySitX;boyWalkFrame=0;boyWalkFT=0;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;purrTimer++;
      if(purrTimer%180===0)sfxPurr();
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='pet';phaseT=0}
      return;
    }
    if(phase==='pet'){
      phaseT++;purrTimer++;
      if(purrTimer%120===0)sfxPurr();
      if(wasTapped('Space')||wasTapped('Enter')){
        phase='petting';phaseT=0;
        sfxPurr();spark(catX+12,GND-20,'#E94560',8);
      }
      return;
    }
    if(phase==='petting'){
      phaseT++;
      if(phaseT%20===0)spark(catX+12,GND-20,'#E94560',3);
      if(phaseT>80){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=W-80;portalPos.y=GND;portalPos.active=true;
        sfxPortal();
        player.x=girlSitX;player.y=GND-player.h;
        boyWalkX=boySitX;
      }
      if(phaseT>40){phase='portal';phaseT=0}
      return;
    }
    if(phase==='portal'){
      movePlayer(true);cam.x=0;
      // Vitalik follows slightly behind
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
      // Vitalik catches up to portal
      const target=portalPos.x-30;
      if(boyWalkX<target-2)boyWalkX+=SPD*.8;
      spark(portalPos.x,portalPos.y-20,['#E94560','#9B59B6','#FFD700'][Math.floor(Math.random()*3)],1);
      if(phaseT>120)completeLevel();
    }
  },
  draw(){
    const sitting=phase!=='portal'&&phase!=='complete';

    // Apartment walls (same as Level 3)
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
    [80,650].forEach(wx=>{
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
    const tc=Date.now()/2000;
    X.fillStyle=`hsl(${(tc*60)%360},40%,50%)`;X.fillRect(tvsx+4,124,92,52);
    X.fillStyle='#555';X.fillRect(tvsx+20,180,60,6);
    X.fillRect(tvsx+30,186,4,30);X.fillRect(tvsx+66,186,4,30);

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

    // Coffee table
    X.fillStyle='#AAA';X.fillRect(ssx+30,GND-20,120,6);
    X.fillStyle='#999';X.fillRect(ssx+40,GND-14,4,14);X.fillRect(ssx+136,GND-14,4,14);

    // Rug
    X.fillStyle='rgba(180,160,140,.25)';X.fillRect(ssx-30,GND,240,H-GND);

    // Characters on sofa
    if(phase!=='intro'){
      if(sitting){
        drawGirl(girlSitX,girlSitY-2,1,0,'sporty',true);
        drawBoy(boySitX,boySitY-2,-1,true,'cozy');
      }else{
        drawGirl(player.x,player.y,player.facing,player.frame,'sporty',false);
        const boyFacing=portalPos.x>boyWalkX?1:-1;
        drawBoy(boyWalkX,GND-player.h,boyFacing,false,'cozy');
      }
    }

    // Leo lying near the sofa (in front, on the floor)
    if(phase!=='intro'){
      drawCat(catX,GND-16,1,catLying);
      if(phase==='chat'||phase==='pet'||phase==='petting'){
        X.fillStyle='#888';X.font='bold 10px monospace';X.textAlign='center';
        const purAlpha=.4+.3*Math.sin(Date.now()/300);
        X.globalAlpha=purAlpha;
        X.fillText('~purr~',catX+12,GND-22);
        X.globalAlpha=1;X.textAlign='left';
      }
    }

    // Pet prompt
    if(phase==='pet'){
      const blink=Math.sin(Date.now()/300)>.2;
      if(blink){
        X.fillStyle='rgba(0,0,0,.5)';X.fillRect(W/2-140,H*.18,280,32);
        X.fillStyle='#FFD700';X.textAlign='center';X.font='bold 16px monospace';
        X.fillText('Press SPACE to pet Leo',W/2,H*.18+22);
        X.textAlign='left';
      }
    }

    // Petting hearts
    if(phase==='petting'){
      X.textAlign='center';X.fillStyle='#E94560';X.font='bold 14px monospace';
      X.fillText('♥ ♥ ♥',catX+12,GND-30-Math.sin(Date.now()/200)*4);
      X.textAlign='left';
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      let bx,by,speaker;
      if(line.s==='g'){bx=girlSitX+10;by=girlSitY-40;speaker='Olya'}
      else if(line.s==='b'){bx=boySitX+10;by=boySitY-40;speaker='Vitalik'}
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
