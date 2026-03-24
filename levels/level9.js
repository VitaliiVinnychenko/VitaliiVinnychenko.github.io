// Level 9: New Year
(function(){

const CHAT=[
  {s:'g',t:"Our first New Year together!"},
  {s:'b',t:"I can't believe it's already here"},
  {s:'g',t:"The tree looks amazing"},
  {s:'b',t:"You spent three hours decorating it"},
  {s:'g',t:"And it was worth every minute!"},
  {s:'c',t:"*bats an ornament*"},
  {s:'b',t:"LIONYA NO!"},
  {s:'g',t:"He's been eyeing that star all day"},
  {s:'b',t:"He thinks it's a toy"},
  {s:'c',t:"*innocent stare*"},
  {s:'g',t:"Don't fall for it. He's plotting"},
  {s:'b',t:"The food smells incredible btw"},
  {s:'g',t:"Olivier is almost ready!"},
  {s:'b',t:"And the champagne is chilling"},
  {s:'g',t:"Midnight countdown soon!"},
  {s:'b',t:"Best New Year's ever"},
  {s:'g',t:"Because we're finally together?"},
  {s:'b',t:"Because we're home"},
  {s:'g',t:"...that's so sweet"},
  {s:'c',t:"*knocks ornament off the tree*"},
  {s:'g',t:"LEONID!!!"},
  {s:'b',t:"Called it"},
  {s:'g',t:"Happy New Year, love"},
  {s:'b',t:"Happy New Year, Olya"},
];

let sofaX,tvX,treeX,tableX,catX,chatIdx,chatTimer,purrTimer;
let girlSitX,girlSitY,boySitX,boySitY;
let boyWalkX,boyWalkFrame,boyWalkFT;

registerLevel('New Year',{
  init(){
    lvlWidth=W;
    sofaX=W/2-70;tvX=sofaX-70;
    treeX=W-160;tableX=60;
    catX=treeX+20;
    girlSitX=sofaX+10;girlSitY=GND-50;
    boySitX=sofaX+80;boySitY=GND-50;
    chatIdx=-1;chatTimer=0;purrTimer=0;
    player.x=girlSitX;player.y=GND-player.h;player.facing=1;
    boyWalkX=boySitX;boyWalkFrame=0;boyWalkFT=0;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;purrTimer++;
      if(purrTimer%200===0)sfxPurr();
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
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

    // Apartment walls (same as level 4)
    X.fillStyle='#E8E8E8';X.fillRect(0,0,W,GND);
    X.fillStyle='#D8D8D8';X.fillRect(0,GND-8,W,8);
    X.fillStyle='#BBB';X.fillRect(0,GND-10,W,3);

    // Floor
    for(let fx=0;fx<W+50;fx+=50){
      X.fillStyle=(Math.floor(fx/50)%2)?'#D4BFA0':'#C8B090';
      X.fillRect(fx,GND,50,H-GND);
      X.fillStyle='rgba(0,0,0,.04)';X.fillRect(fx,GND,50,1);
    }

    // Windows (with snow outside)
    [50,650].forEach(wx=>{
      X.fillStyle='#CCC';X.fillRect(wx-2,40-2,84,124);
      X.fillStyle='rgba(40,50,80,.5)';X.fillRect(wx,40,80,120);
      X.fillStyle='rgba(60,70,100,.3)';X.fillRect(wx,40,80,60);
      // Snow on windowsill
      X.fillStyle='#F0F0FF';X.fillRect(wx-4,158,88,8);
      X.fillStyle='#CCC';X.fillRect(wx+38,40,4,120);X.fillRect(wx,98,80,4);
      // Curtains
      X.fillStyle='rgba(200,200,210,.4)';X.fillRect(wx-8,36,18,130);X.fillRect(wx+70,36,18,130);
      // Snowflakes outside
      const st=Date.now()/600;
      X.fillStyle='rgba(255,255,255,.5)';
      for(let si=0;si<6;si++){
        const sx=wx+10+si*12+Math.sin(st+si*1.5)*6;
        const sy=40+((st*20+si*25)%120);
        X.fillRect(sx,sy,2,2);
      }
    });

    // TV
    const tvsx=tvX;
    X.fillStyle='#222';X.fillRect(tvsx,120,100,60);
    X.fillStyle='#333';X.fillRect(tvsx+2,122,96,56);
    const tc=Date.now()/2000;
    X.fillStyle=`hsl(${(tc*60)%360},40%,50%)`;X.fillRect(tvsx+4,124,92,52);
    X.fillStyle='#555';X.fillRect(tvsx+20,180,60,6);
    X.fillRect(tvsx+30,186,4,30);X.fillRect(tvsx+66,186,4,30);

    // Blue sofa (same as level 4)
    const ssx=sofaX;
    X.fillStyle='#3A6FA5';X.fillRect(ssx,GND-50,180,42);
    X.fillStyle='#4A7FB5';X.fillRect(ssx+4,GND-48,172,36);
    X.fillStyle='#3A6FA5';X.fillRect(ssx,GND-90,180,44);
    X.fillStyle='#4A7FB5';X.fillRect(ssx+4,GND-86,172,36);
    X.fillStyle='#3468A0';X.fillRect(ssx-8,GND-70,14,62);X.fillRect(ssx+174,GND-70,14,62);
    X.fillStyle='#3468A0';X.fillRect(ssx+60,GND-48,3,36);X.fillRect(ssx+120,GND-48,3,36);
    X.fillStyle='#555';X.fillRect(ssx+8,GND-8,6,8);X.fillRect(ssx+166,GND-8,6,8);
    X.fillStyle='#5A9FD5';X.fillRect(ssx+8,GND-80,24,18);X.fillRect(ssx+148,GND-80,24,18);

    // === Red table with food (left side) ===
    const ttx=tableX;
    // Table
    X.fillStyle='#B82020';X.fillRect(ttx,GND-38,120,6);
    X.fillStyle='#A01818';X.fillRect(ttx,GND-40,120,3);
    X.fillStyle='#B82020';X.fillRect(ttx+8,GND-32,4,32);X.fillRect(ttx+108,GND-32,4,32);
    // Tablecloth drape
    X.fillStyle='#C82828';X.fillRect(ttx,GND-38,120,2);

    // Food on table
    // Olivier salad bowl
    X.fillStyle='#F5F0E0';X.fillRect(ttx+10,GND-50,24,12);
    X.fillStyle='#8AB060';X.fillRect(ttx+12,GND-50,20,6);
    // Plate with slices
    X.fillStyle='#FFF';X.fillRect(ttx+42,GND-48,20,10);
    X.fillStyle='#D4886A';X.fillRect(ttx+44,GND-46,7,6);X.fillRect(ttx+53,GND-46,7,6);
    // Bread basket
    X.fillStyle='#C8A870';X.fillRect(ttx+70,GND-48,18,10);
    X.fillStyle='#D4B880';X.fillRect(ttx+72,GND-50,5,6);X.fillRect(ttx+78,GND-52,5,6);X.fillRect(ttx+84,GND-50,4,6);
    // Champagne bottle
    X.fillStyle='#2A5A2A';X.fillRect(ttx+96,GND-56,8,18);
    X.fillStyle='#1A4A1A';X.fillRect(ttx+97,GND-56,6,4);
    X.fillStyle='#D4A030';X.fillRect(ttx+97,GND-60,6,5);
    // Two champagne glasses
    X.fillStyle='rgba(255,255,255,.4)';
    [ttx+16,ttx+50].forEach(gx=>{
      X.fillRect(gx,GND-62,5,10);X.fillRect(gx,GND-52,5,2);
      X.fillRect(gx+1,GND-50,3,4);X.fillRect(gx-1,GND-46,7,2);
    });

    // Garland on wall (string lights)
    X.fillStyle='#2D5A25';
    X.beginPath();X.moveTo(20,70);
    for(let gx=20;gx<W-20;gx+=5){
      X.lineTo(gx,70+12*Math.sin(gx*.015));
    }
    X.lineTo(W-20,70);X.lineWidth=3;X.strokeStyle='#2D5A25';X.stroke();
    // Bulbs
    const bulbCols=['#E94560','#FFD700','#3498DB','#2ECC71','#E94560','#FFD700','#3498DB','#2ECC71'];
    for(let gi=0;gi<16;gi++){
      const gx=40+gi*50;
      const gy=70+12*Math.sin(gx*.015)+6;
      const blink=Math.sin(Date.now()/300+gi*1.2)>.0;
      X.fillStyle=blink?bulbCols[gi%bulbCols.length]:'#555';
      X.fillRect(gx-2,gy,5,5);
      if(blink){
        X.fillStyle=bulbCols[gi%bulbCols.length].replace(')',',0.08)').replace('rgb','rgba');
        X.beginPath();X.arc(gx,gy+2,10,0,Math.PI*2);X.fill();
      }
    }

    // === Christmas tree (right side) ===
    const trx=treeX;
    // Trunk
    X.fillStyle='#5A3A1A';X.fillRect(trx+30,GND-20,15,20);
    // Tree layers (bottom to top)
    X.fillStyle='#1B5A20';
    X.beginPath();X.moveTo(trx-5,GND-20);X.lineTo(trx+38,GND-100);X.lineTo(trx+80,GND-20);X.fill();
    X.fillStyle='#1E6A24';
    X.beginPath();X.moveTo(trx+5,GND-60);X.lineTo(trx+38,GND-130);X.lineTo(trx+70,GND-60);X.fill();
    X.fillStyle='#228B2A';
    X.beginPath();X.moveTo(trx+12,GND-95);X.lineTo(trx+38,GND-160);X.lineTo(trx+63,GND-95);X.fill();
    // Star on top
    const starGlow=.7+.3*Math.sin(Date.now()/400);
    X.fillStyle=`rgba(255,215,0,${starGlow})`;
    X.fillRect(trx+33,GND-170,9,9);
    X.fillRect(trx+35,GND-173,5,3);X.fillRect(trx+35,GND-161,5,3);
    X.fillRect(trx+30,GND-168,3,5);X.fillRect(trx+42,GND-168,3,5);
    // Glow
    X.fillStyle=`rgba(255,215,0,${starGlow*.1})`;
    X.beginPath();X.arc(trx+37,GND-166,18,0,Math.PI*2);X.fill();

    // Ornaments
    const ornCols=['#E94560','#FFD700','#3498DB','#9B59B6','#2ECC71','#FF6B35'];
    [[trx+20,GND-40],[trx+55,GND-45],[trx+30,GND-70],[trx+50,GND-75],
     [trx+25,GND-55],[trx+48,GND-60],[trx+35,GND-100],[trx+42,GND-110],
     [trx+33,GND-125],[trx+45,GND-90],[trx+38,GND-140]].forEach(([ox,oy],i)=>{
      X.fillStyle=ornCols[i%ornCols.length];
      X.beginPath();X.arc(ox,oy,4,0,Math.PI*2);X.fill();
      X.fillStyle='rgba(255,255,255,.3)';
      X.fillRect(ox-1,oy-2,2,2);
    });

    // Tinsel/garland on tree
    X.strokeStyle='rgba(255,215,0,.2)';X.lineWidth=1;
    X.beginPath();X.moveTo(trx+15,GND-35);
    X.quadraticCurveTo(trx+50,GND-55,trx+25,GND-75);
    X.quadraticCurveTo(trx+55,GND-95,trx+30,GND-115);
    X.quadraticCurveTo(trx+50,GND-135,trx+38,GND-155);
    X.stroke();

    // Presents under tree
    X.fillStyle='#E94560';X.fillRect(trx+5,GND-14,18,14);
    X.fillStyle='#FFD700';X.fillRect(trx+12,GND-14,4,14);X.fillRect(trx+5,GND-8,18,3);
    X.fillStyle='#3498DB';X.fillRect(trx+55,GND-12,16,12);
    X.fillStyle='#FFF';X.fillRect(trx+62,GND-12,3,12);X.fillRect(trx+55,GND-7,16,3);
    X.fillStyle='#2ECC71';X.fillRect(trx+28,GND-10,14,10);
    X.fillStyle='#E94560';X.fillRect(trx+34,GND-10,3,10);X.fillRect(trx+28,GND-6,14,3);

    // Leo under the tree
    if(phase!=='intro'){
      drawCat(catX,GND-16,1,true);
      if(phase==='chat'){
        X.fillStyle='#888';X.font='bold 10px monospace';X.textAlign='center';
        const pa=.4+.3*Math.sin(Date.now()/300);
        X.globalAlpha=pa;
        X.fillText('~purr~',catX+12,GND-22);
        X.globalAlpha=1;X.textAlign='left';
      }
    }

    // Characters on sofa
    if(phase!=='intro'){
      if(sitting){
        drawGirl(girlSitX,girlSitY-2,1,0,'blackdress',true);
        drawBoy(boySitX,boySitY-2,-1,true,'beigesweater');
      }else{
        drawGirl(player.x,player.y,player.facing,player.frame,'blackdress',false);
        const bf=portalPos.x>boyWalkX?1:-1;
        drawBoy(boyWalkX,GND-player.h,bf,false,'beigesweater');
      }
    }

    // Snowfall overlay (subtle, inside from windows)
    const st=Date.now()/500;
    X.fillStyle='rgba(255,255,255,.03)';
    for(let si=0;si<8;si++){
      const sx=50+si*100+Math.sin(st+si)*15;
      const sy=((st*10+si*40)%H);
      X.fillRect(sx,sy,2,2);
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
