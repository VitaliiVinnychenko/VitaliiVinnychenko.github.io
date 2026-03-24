// Level 6: The Statue
(function(){

const CHAT=[
  {s:'g',t:"That was THE BEST steak I've ever had"},
  {s:'b',t:"Right?! So juicy"},
  {s:'g',t:"I can still taste it honestly"},
  {s:'b',t:"The broccoli with popcorn was wild"},
  {s:'g',t:"Popcorn on broccoli?? Was it good?"},
  {s:'b',t:"Actually really unique. I liked it"},
  {s:'g',t:"You're so adventurous with food"},
  {s:'b',t:"Hey wait, look over there..."},
  {s:'g',t:"Oh wow, is that a wedding?"},
  {s:'b',t:"It's beautiful. Look at the flowers"},
  {s:'g',t:"Wait... is that PEDAN?!"},
  {s:'b',t:"The TV host? No way"},
  {s:'g',t:"It IS him! He's right there!"},
  {s:'b',t:"Wow, celebrity wedding guest"},
  {s:'g',t:"So cool! Hey let's take a photo"},
  {s:'b',t:"Where?"},
  {s:'g',t:"Near that statue! The emoji one!"},
  {s:'b',t:"Haha the Stonehenge moai? Let's go"},
];

let restaurantX,statueX,chatIdx,chatTimer,weddingX;
let boyWalkX,boyWalkFrame,boyWalkFT;
let photoPhase,photoTimer;

registerLevel('Birthday',{
  init(){
    lvlWidth=2200;
    restaurantX=250;statueX=1800;weddingX=1100;
    chatIdx=-1;chatTimer=0;
    photoPhase=false;photoTimer=0;
    player.x=320;player.y=GND-player.h;player.facing=1;
    boyWalkX=280;boyWalkFrame=0;boyWalkFT=0;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='walkToStatue';phaseT=0}
      return;
    }
    if(phase==='walkToStatue'){
      movePlayer(true);
      // Boy follows
      const target=player.x-30;
      if(Math.abs(boyWalkX-target)>2){
        const dir=target>boyWalkX?1:-1;
        boyWalkX+=dir*SPD*.8;
        boyWalkFT++;
        if(boyWalkFT%7===0)boyWalkFrame=(boyWalkFrame+1)%4;
      }else{boyWalkFrame=0}
      // Reach statue
      if(player.x>statueX-40){phase='photo';phaseT=0}
      return;
    }
    if(phase==='photo'){
      phaseT++;
      // Boy catches up
      const target=player.x-30;
      if(Math.abs(boyWalkX-target)>2){
        boyWalkX+=(target>boyWalkX?1:-1)*SPD*.6;
      }
      if(phaseT===60)sfxChat();
      if(phaseT>120){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=statueX+100;portalPos.y=GND;portalPos.active=true;
        sfxPortal();
      }
      if(phaseT>40){phase='portal';phaseT=0}
      return;
    }
    if(phase==='portal'){
      movePlayer(true);
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
    // Sky
    X.fillStyle=cachedGrad('l6sky',0,0,0,GND,[[0,'#4AA8D8'],[.5,'#7EC8E3'],[1,'#A8DCF0']]);
    X.fillRect(0,0,W,GND);

    // Sun
    X.fillStyle='rgba(255,245,200,.7)';
    X.beginPath();X.arc(650-cam.x*.05,50,45,0,Math.PI*2);X.fill();
    X.fillStyle='rgba(255,245,200,.12)';
    X.beginPath();X.arc(650-cam.x*.05,50,90,0,Math.PI*2);X.fill();

    // Fluffy clouds
    [[150,40],[400,65],[700,35],[1000,55],[1400,45],[1800,60]].forEach(([cx,cy])=>{
      const sx=cx-cam.x*.15;
      X.fillStyle='rgba(255,255,255,.6)';
      X.beginPath();X.arc(sx,cy,18,0,Math.PI*2);X.fill();
      X.beginPath();X.arc(sx+20,cy-6,22,0,Math.PI*2);X.fill();
      X.beginPath();X.arc(sx+40,cy,16,0,Math.PI*2);X.fill();
    });

    // Distant white buildings (parallax)
    [[300,GND-80,35,80],[380,GND-60,25,60]].forEach(([bx,by,bw,bh])=>{
      const sx=bx-cam.x*.2;
      X.fillStyle='#E8E8E8';X.fillRect(sx,by,bw,bh);
      X.fillStyle='#DDD';X.fillRect(sx,by,bw,4);
      // Windows
      X.fillStyle='rgba(160,200,230,.3)';
      for(let wy=by+10;wy<by+bh-10;wy+=14){
        for(let wx=sx+5;wx<sx+bw-5;wx+=10){
          X.fillRect(wx,wy,6,8);
        }
      }
    });

    // Rolling green hills (background)
    X.fillStyle='#6AAF50';
    X.beginPath();X.moveTo(-10,GND);
    for(let hx=-10;hx<=W+10;hx+=20){
      const wx=hx+cam.x;
      X.lineTo(hx,GND-30-15*Math.sin(wx*.005)-10*Math.cos(wx*.008));
    }
    X.lineTo(W+10,GND);X.fill();

    // Green fields (ground)
    X.fillStyle='#5CA040';X.fillRect(0,GND,W,H-GND);
    X.fillStyle='#68A848';
    for(let fx=Math.floor(cam.x/60)*60;fx<cam.x+W+60;fx+=60){
      const sx=fx-cam.x;
      if(Math.floor(fx/60)%2)X.fillRect(sx,GND,60,H-GND);
    }
    // Path/walkway
    X.fillStyle='#C8B898';X.fillRect(0,GND,W,8);
    X.fillStyle='#B8A888';X.fillRect(0,GND+8,W,2);

    // Pond & restaurant
    const rsx=restaurantX-cam.x;
    if(rsx>-400&&rsx<W+200){
      // Large pond behind the restaurant (at ground level, replacing grass)
      const pondCX=rsx+100,pondY=GND+20;
      // Shore/bank
      X.fillStyle='#3D7A30';
      X.beginPath();X.ellipse(pondCX,pondY,230,40,0,0,Math.PI*2);X.fill();
      // Main water
      X.fillStyle='#2A7ABB';
      X.beginPath();X.ellipse(pondCX,pondY,218,36,0,0,Math.PI*2);X.fill();
      X.fillStyle='#3090D0';
      X.beginPath();X.ellipse(pondCX,pondY-1,180,28,0,0,Math.PI*2);X.fill();
      X.fillStyle='#40A0E0';
      X.beginPath();X.ellipse(pondCX,pondY-2,130,18,0,0,Math.PI*2);X.fill();
      // Water reflections
      X.fillStyle='rgba(255,255,255,.12)';
      X.fillRect(pondCX-70,pondY-4,50,2);X.fillRect(pondCX+20,pondY,40,2);X.fillRect(pondCX-20,pondY+8,35,2);
      // Reeds
      X.fillStyle='#3D7A3D';
      [pondCX-210,pondCX-195,pondCX+195,pondCX+210].forEach(rx=>{
        X.fillRect(rx,pondY-18,2,14);X.fillRect(rx+5,pondY-20,2,16);X.fillRect(rx+9,pondY-16,2,12);
      });

      // Glass restaurant (wider, drawn on top of pond)
      const rw=280,rh=90;
      const ry=GND-rh;
      // Black frame
      X.fillStyle='#1A1A1A';X.fillRect(rsx-10,ry,rw,rh);
      // Glass panels
      X.fillStyle='rgba(160,200,230,.25)';X.fillRect(rsx-6,ry+4,rw-8,rh-8);
      // Mullions (vertical)
      X.fillStyle='#1A1A1A';
      X.fillRect(rsx+50,ry,3,rh);
      X.fillRect(rsx+105,ry,3,rh);
      X.fillRect(rsx+160,ry,3,rh);
      X.fillRect(rsx+215,ry,3,rh);
      // Horizontal mullion
      X.fillRect(rsx-10,ry+45,rw,3);
      // Glass reflections
      X.fillStyle='rgba(255,255,255,.06)';
      X.fillRect(rsx-2,ry+8,50,36);
      X.fillRect(rsx+55,ry+8,48,36);
      X.fillStyle='rgba(100,180,220,.06)';
      X.fillRect(rsx+110,ry+8,48,36);
      X.fillRect(rsx+165,ry+8,48,36);
      // Flat roof
      X.fillStyle='#222';X.fillRect(rsx-16,ry-6,rw+12,8);
      // Door (further right in the building)
      X.fillStyle='#111';X.fillRect(rsx+135,GND-60,28,60);
      X.fillStyle='rgba(160,200,230,.2)';X.fillRect(rsx+139,GND-56,20,40);
      X.fillStyle='#AAA';X.fillRect(rsx+153,GND-38,3,10);

      // Terrace (extending from restaurant towards pond)
      const tx=rsx-80,tw=rw+100;
      // Terrace floor
      X.fillStyle='#999';X.fillRect(tx,GND,tw,10);
      X.fillStyle='#888';X.fillRect(tx,GND,tw,2);
      // Terrace railing (glass)
      X.fillStyle='#333';X.fillRect(tx,GND-4,tw,3);
      for(let rp=tx+15;rp<tx+tw;rp+=45){
        X.fillStyle='#333';X.fillRect(rp,GND-35,2,35);
      }
      X.fillStyle='#333';X.fillRect(tx,GND-36,tw,2);
      X.fillStyle='rgba(200,220,240,.1)';
      for(let rp=tx+17;rp<tx+tw-45;rp+=45){
        X.fillRect(rp,GND-33,42,29);
      }
      // Small tables on terrace
      [tx+25,tx+100,tx+175].forEach(ttx=>{
        X.fillStyle='#555';X.fillRect(ttx,GND-18,20,4);
        X.fillRect(ttx+8,GND-14,4,14);
      });

      // Sign
      X.fillStyle='rgba(0,0,0,.5)';X.fillRect(rsx+80,ry+10,100,14);
      X.fillStyle='#FFF';X.font='bold 10px monospace';X.textAlign='center';
      X.fillText('EDEM',rsx+130,ry+21);X.textAlign='left';
    }

    // Wedding scene (mid area)
    const wsx=weddingX-cam.x;
    if(wsx>-200&&wsx<W+100){
      // Flower arch
      X.fillStyle='#3D7A3D';X.fillRect(wsx,GND-90,8,90);X.fillRect(wsx+80,GND-90,8,90);
      X.fillStyle='#3D7A3D';
      X.beginPath();X.arc(wsx+44,GND-88,46,Math.PI,0);X.fill();
      X.fillStyle='#4D8A4D';
      X.beginPath();X.arc(wsx+44,GND-88,40,Math.PI,0);X.fill();
      // Flowers on arch
      ['#E94560','#FF69B4','#FFF','#FFB6C1','#E94560','#FF69B4','#FFF'].forEach((c,i)=>{
        const a=Math.PI+i*(Math.PI/6);
        const fx=wsx+44+Math.cos(a)*43;
        const fy=GND-88+Math.sin(a)*43;
        X.fillStyle=c;X.fillRect(fx-3,fy-3,6,6);
      });
      // Guests (tiny figures)
      [wsx+20,wsx+35,wsx+55,wsx+70].forEach((gx,i)=>{
        X.fillStyle=['#446','#644','#464','#446'][i];
        X.fillRect(gx,GND-22,8,22);
        X.fillStyle='#FFCC99';X.fillRect(gx+1,GND-28,6,6);
      });
      // Pedan (taller, distinct)
      const px=wsx+100;
      X.fillStyle='#222';X.fillRect(px,GND-30,10,30);
      X.fillStyle='#FFCC99';X.fillRect(px+1,GND-38,8,8);
      X.fillStyle='#333';X.fillRect(px+1,GND-40,8,3);
      // Microphone
      X.fillStyle='#888';X.fillRect(px+9,GND-28,2,10);
      X.fillStyle='#333';X.fillRect(px+8,GND-30,4,3);
    }

    // 🗿 Moai statue
    const ssx=statueX-cam.x;
    if(ssx>-80&&ssx<W+40){
      // Base/platform
      X.fillStyle='#999';X.fillRect(ssx-15,GND-8,70,8);
      // Body
      X.fillStyle='#A0998A';X.fillRect(ssx,GND-70,40,62);
      X.fillStyle='#968F80';X.fillRect(ssx+5,GND-70,30,10);
      // Head
      X.fillStyle='#A0998A';X.fillRect(ssx-4,GND-120,48,55);
      X.fillStyle='#B0A898';X.fillRect(ssx,GND-118,40,50);
      // Brow ridge
      X.fillStyle='#8A8375';X.fillRect(ssx-2,GND-100,44,6);
      // Eyes (deep set)
      X.fillStyle='#706860';X.fillRect(ssx+6,GND-96,10,5);X.fillRect(ssx+24,GND-96,10,5);
      X.fillStyle='#F5F0E8';X.fillRect(ssx+8,GND-95,6,3);X.fillRect(ssx+26,GND-95,6,3);
      // Long nose
      X.fillStyle='#B0A898';X.fillRect(ssx+16,GND-94,8,18);
      X.fillStyle='#A0998A';X.fillRect(ssx+17,GND-94,6,18);
      // Thin lips
      X.fillStyle='#8A8375';X.fillRect(ssx+10,GND-74,20,3);
      // Chin
      X.fillStyle='#A0998A';X.fillRect(ssx+6,GND-72,28,8);
      // Top of head (flat)
      X.fillStyle='#8A8375';X.fillRect(ssx-4,GND-122,48,4);
    }

    // Some grass tufts
    for(let gx=Math.floor(cam.x/100)*100;gx<cam.x+W+100;gx+=100){
      const sx=gx-cam.x+Math.sin(gx)*20;
      X.fillStyle='#4D8A38';
      X.fillRect(sx,GND-3,3,5);X.fillRect(sx+6,GND-4,2,6);X.fillRect(sx+10,GND-2,3,4);
    }

    // Characters
    if(phase!=='intro'){
      if(phase==='chat'){
        // Standing outside restaurant
        drawGirl(player.x-cam.x,player.y,1,0,'blackdress',false);
        drawBoy(boyWalkX-cam.x,GND-player.h,-1,false,'beige');
      }else if(phase==='photo'){
        // Posing near statue
        drawGirl(player.x-cam.x,player.y,1,0,'blackdress',false);
        drawBoy(boyWalkX-cam.x,GND-player.h,-1,false,'beige');
      }else{
        drawGirl(player.x-cam.x,player.y,player.facing,player.frame,'blackdress',false);
        const boyFacing=player.x>boyWalkX?1:-1;
        drawBoy(boyWalkX-cam.x,GND-player.h,boyFacing,false,'beige');
      }
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      const bx=line.s==='g'?player.x-cam.x+10:boyWalkX-cam.x+10;
      const by=player.y-30;
      bubble(bx,by,line.t,line.s==='g'?'left':'right',line.s==='g'?'Olya':'Vitalik');
    }

    // Photo moment
    if(phase==='photo'){
      const alpha=Math.min(1,phaseT/30);
      X.globalAlpha=alpha;
      X.fillStyle='rgba(0,0,0,.4)';X.fillRect(0,H*.15,W,40);
      X.fillStyle='#FFD700';X.textAlign='center';X.font='bold 18px monospace';
      X.fillText('📸  Say cheese!',W/2,H*.15+28);
      X.textAlign='left';
      X.globalAlpha=1;
      if(phaseT>60&&phaseT<80){
        // Flash effect
        X.globalAlpha=Math.max(0,1-(phaseT-60)/20);
        X.fillStyle='#FFF';X.fillRect(0,0,W,H);
        X.globalAlpha=1;
      }
    }

    if(portalPos.active)drawPortal(portalPos.x-cam.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
