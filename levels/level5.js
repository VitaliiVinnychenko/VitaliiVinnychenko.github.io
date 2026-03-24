// Level 5: Mountain Getaway
(function(){

const CHAT=[
  {s:'g',t:"This view is unreal..."},
  {s:'b',t:"Worth the drive, right?"},
  {s:'g',t:"Absolutely. Pass me the Corona"},
  {s:'b',t:"Cheers to our first trip together"},
  {s:'g',t:"Cheers! I wonder what Leo is doing"},
  {s:'b',t:"Probably sleeping on my hoodie"},
  {s:'g',t:"Or knocking things off the table"},
  {s:'b',t:"That's his favorite hobby"},
  {s:'g',t:"I miss that little furball already"},
  {s:'b',t:"We've been gone for two days"},
  {s:'g',t:"And? He's probably plotting revenge"},
  {s:'b',t:"Fair. He'll ignore us for a week"},
  {s:'g',t:"So dramatic. Just like his dad"},
  {s:'b',t:"Excuse me?!"},
  {s:'g',t:"*sips Corona innocently*"},
  {s:'b',t:"...anyway, this trip is perfect"},
  {s:'g',t:"It really is. Should we go inside?"},
  {s:'b',t:"Yeah... let's go"},
];

let chairLX,chairRX,chairY,tableX,doorX,chatIdx,chatTimer;
let boyWalkX,boyWalkFrame,boyWalkFT;

registerLevel('Mountain Getaway',{
  init(){
    lvlWidth=W;
    chairLX=W/2-100;chairRX=W/2+40;chairY=GND-42;
    tableX=W/2-20;doorX=W-120;
    chatIdx=-1;chatTimer=0;
    player.x=chairLX+5;player.y=GND-player.h;player.facing=1;
    boyWalkX=chairRX+5;boyWalkFrame=0;boyWalkFT=0;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=doorX+20;portalPos.y=GND;portalPos.active=true;
        sfxPortal();
        player.x=chairLX+5;player.y=GND-player.h;
        boyWalkX=chairRX+5;
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
    const sitting=phase==='chat';
    const cabinL=W*.58;

    // Sky
    X.fillStyle=cachedGrad('l5sky',0,0,0,GND,[[0,'#5EADD6'],[.6,'#87CEEB'],[1,'#B0D8F0']]);
    X.fillRect(0,0,W,GND);

    // Sun
    X.fillStyle='rgba(255,240,180,.6)';
    X.beginPath();X.arc(300,55,40,0,Math.PI*2);X.fill();
    X.fillStyle='rgba(255,240,180,.1)';
    X.beginPath();X.arc(300,55,80,0,Math.PI*2);X.fill();

    // Far mountains
    X.fillStyle='#6A8CAF';
    X.beginPath();X.moveTo(0,GND);
    X.lineTo(0,180);X.lineTo(80,120);X.lineTo(180,170);X.lineTo(280,90);
    X.lineTo(380,140);X.lineTo(500,70);X.lineTo(600,130);X.lineTo(720,80);
    X.lineTo(W,150);X.lineTo(W,GND);X.fill();

    // Mid mountains
    X.fillStyle='#5A7A5A';
    X.beginPath();X.moveTo(0,GND);
    X.lineTo(0,220);X.lineTo(120,180);X.lineTo(250,210);X.lineTo(380,160);
    X.lineTo(500,200);X.lineTo(650,170);X.lineTo(W,220);X.lineTo(W,GND);X.fill();

    // Near treeline
    X.fillStyle='#3D5C3D';
    X.beginPath();X.moveTo(0,GND);X.lineTo(0,260);
    for(let tx=0;tx<=W;tx+=30){
      X.lineTo(tx,260-12*Math.sin(tx*.04)-8*Math.cos(tx*.07));
    }
    X.lineTo(W,GND);X.fill();

    // Snow caps
    X.fillStyle='rgba(255,255,255,.6)';
    [[280,90,30],[500,70,35],[720,80,28]].forEach(([mx,my,s])=>{
      X.beginPath();X.moveTo(mx-s,my+15);X.lineTo(mx,my);X.lineTo(mx+s,my+15);X.fill();
    });

    // === Dark grey glass cabin (right side) ===
    const cabinTop=GND-110;
    const cabinW=W-cabinL;

    // Second floor (narrower, inset from both sides)
    const f2Inset=25;
    const f2Top=cabinTop-90;
    const f2L=cabinL+f2Inset;
    const f2W=cabinW-f2Inset*2;
    // Second floor structure
    X.fillStyle='#3A3A3A';X.fillRect(f2L,f2Top,f2W,90);
    // Second floor glass
    X.fillStyle='rgba(100,150,190,.2)';X.fillRect(f2L+4,f2Top+5,f2W-8,80);
    // Second floor mullions
    X.fillStyle='#3A3A3A';
    X.fillRect(f2L+Math.floor(f2W*.33),f2Top,3,90);
    X.fillRect(f2L+Math.floor(f2W*.66),f2Top,3,90);
    X.fillRect(f2L,f2Top+42,f2W,3);
    // Second floor reflections
    X.fillStyle='rgba(255,255,255,.05)';
    X.fillRect(f2L+8,f2Top+8,Math.floor(f2W*.33)-12,34);
    X.fillStyle='rgba(100,160,200,.06)';
    X.fillRect(f2L+Math.floor(f2W*.33)+7,f2Top+8,Math.floor(f2W*.33)-10,34);
    // Second floor flat roof
    X.fillStyle='#444';X.fillRect(f2L-6,f2Top-8,f2W+12,10);
    X.fillStyle='#3A3A3A';X.fillRect(f2L-6,f2Top+2,f2W+12,3);
    // Floor divider between 1st and 2nd
    X.fillStyle='#444';X.fillRect(cabinL,cabinTop-4,cabinW,6);

    // First floor structure
    X.fillStyle='#3A3A3A';X.fillRect(cabinL,cabinTop,cabinW,GND-cabinTop);
    // Glass walls
    X.fillStyle='rgba(120,170,210,.25)';X.fillRect(cabinL+4,cabinTop+6,cabinW-8,GND-cabinTop-10);
    // Glass panel dividers (dark grey mullions)
    X.fillStyle='#3A3A3A';
    X.fillRect(cabinL+70,cabinTop,3,GND-cabinTop);
    X.fillRect(cabinL+140,cabinTop,3,GND-cabinTop);
    X.fillRect(cabinL+210,cabinTop,3,GND-cabinTop);
    // Horizontal mullion
    X.fillRect(cabinL,cabinTop+55,cabinW,3);
    // Reflections on glass
    X.fillStyle='rgba(255,255,255,.06)';
    X.fillRect(cabinL+8,cabinTop+10,60,44);
    X.fillRect(cabinL+76,cabinTop+10,62,44);
    X.fillStyle='rgba(100,160,200,.08)';
    X.fillRect(cabinL+146,cabinTop+10,62,44);
    X.fillRect(cabinL+216,cabinTop+10,cabinW-224,44);

    // Door (dark grey, in the glass wall)
    X.fillStyle='#333';X.fillRect(doorX,GND-90,50,90);
    X.fillStyle='#3A3A3A';X.fillRect(doorX+2,GND-88,46,86);
    // Door glass panel
    X.fillStyle='rgba(100,150,190,.2)';X.fillRect(doorX+6,GND-82,38,50);
    // Door handle
    X.fillStyle='#AAA';X.fillRect(doorX+40,GND-50,4,12);

    // === Flat roof overhang above the deck ===
    const roofY=cabinTop-12;
    X.fillStyle='#444';X.fillRect(0,roofY,W,14);
    X.fillStyle='#3A3A3A';X.fillRect(0,roofY+14,W,3);
    // Roof support posts (dark grey)
    X.fillStyle='#3A3A3A';
    X.fillRect(20,roofY+14,4,GND-roofY-14);
    X.fillRect(W*.55-10,roofY+14,4,GND-roofY-14);

    // === Grey deck floor ===
    X.fillStyle='#888';X.fillRect(0,GND,W,H-GND);
    for(let px=0;px<W;px+=45){
      X.fillStyle=(Math.floor(px/45)%2)?'#888':'#7E7E7E';
      X.fillRect(px,GND,45,H-GND);
      X.fillStyle='rgba(0,0,0,.05)';X.fillRect(px,GND,45,1);
    }
    // Deck edge
    X.fillStyle='#666';X.fillRect(0,GND,W,2);

    // Deck railing (modern, dark)
    X.fillStyle='#333';X.fillRect(0,GND-4,cabinL,4);
    for(let rx=30;rx<cabinL;rx+=60){
      X.fillStyle='#333';X.fillRect(rx,GND-50,3,50);
    }
    X.fillStyle='#333';X.fillRect(0,GND-52,cabinL,3);
    // Glass railing panels
    X.fillStyle='rgba(200,220,240,.12)';
    for(let rx=0;rx<cabinL-60;rx+=60){
      X.fillRect(rx+33,GND-48,27,44);
    }

    // Table between chairs
    X.fillStyle='#333';X.fillRect(tableX,GND-30,40,6);
    X.fillRect(tableX+10,GND-24,4,24);X.fillRect(tableX+26,GND-24,4,24);

    // Corona bottles on table
    [tableX+10,tableX+24].forEach(bx=>{
      X.fillStyle='#F5E6A0';X.fillRect(bx,GND-48,8,18);
      X.fillStyle='#E8D890';X.fillRect(bx+1,GND-48,6,4);
      X.fillStyle='rgba(255,255,255,.2)';X.fillRect(bx+2,GND-44,2,12);
      X.fillStyle='#8BC34A';X.fillRect(bx+1,GND-50,6,4);
    });

    // Chairs (dark modern)
    [[chairLX,1],[chairRX,-1]].forEach(([cx,dir])=>{
      X.fillStyle='#333';X.fillRect(cx,chairY,40,6);
      X.fillStyle='#2A2A2A';X.fillRect(cx+(dir>0?0:30),chairY-30,10,30);
      X.fillRect(cx,chairY-32,40,5);
      X.fillStyle='#222';
      X.fillRect(cx+3,chairY+6,4,GND-chairY-6);
      X.fillRect(cx+33,chairY+6,4,GND-chairY-6);
    });

    // Characters
    if(phase!=='intro'){
      if(sitting){
        drawGirl(chairLX+8,chairY-20,1,0,'whitesleeve',true);
        drawBoy(chairRX+8,chairY-20,-1,true,'clean');
      }else{
        drawGirl(player.x,player.y,player.facing,player.frame,'whitesleeve',false);
        const boyFacing=portalPos.x>boyWalkX?1:-1;
        drawBoy(boyWalkX,GND-player.h,boyFacing,false,'clean');
      }
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      const bx=line.s==='g'?chairLX+20:chairRX+20;
      const by=chairY-55;
      bubble(bx,by,line.t,line.s==='g'?'left':'right',line.s==='g'?'Olya':'Vitalik');
    }

    if(portalPos.active)drawPortal(portalPos.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
