// Level 7: Mountain Pool
(function(){

const CHAT=[
  {s:'g',t:"This pool is insane"},
  {s:'b',t:"Right? Look at those mountains"},
  {s:'g',t:"I could sit here forever honestly"},
  {s:'b',t:"Same. Also I can't stop thinking..."},
  {s:'g',t:"About what?"},
  {s:'b',t:"That food at Stara Vorokhta"},
  {s:'g',t:"OH MY GOD yes!!"},
  {s:'b',t:"Everything was SO good"},
  {s:'g',t:"The trout was unreal"},
  {s:'b',t:"And the deruny... perfection"},
  {s:'g',t:"We HAVE to go back there"},
  {s:'b',t:"One hundred percent"},
  {s:'g',t:"Oh look! Are those sheep?!"},
  {s:'b',t:"Haha yeah they're everywhere here"},
  {s:'g',t:"They're so fluffy! I love them"},
  {s:'b',t:"Don't get any ideas"},
  {s:'g',t:"Too late. I want one"},
  {s:'g',t:"Hey! I have an idea"},
  {s:'b',t:"Uh oh"},
  {s:'g',t:"Let's grill shrimps!"},
  {s:'b',t:"Now? We just ate like two hours ago"},
  {s:'g',t:"So? And I'll take a photo of you"},
  {s:'b',t:"Oh no not again..."},
  {s:'g',t:"With the shrimps! Like last time!"},
  {s:'b',t:"You'll send it to my friends again?"},
  {s:'g',t:"Obviously. They loved it"},
  {s:'b',t:"*sigh* ...fine. But then poker?"},
  {s:'g',t:"Deal! Poker on the terrace!"},
];

let poolX,poolW,cabinX,terraceX,grillX,chatIdx,chatTimer;
let boyWalkX,boyWalkFrame,boyWalkFT;
let girlSitX,boySitX,sitY;

registerLevel('Mountain Pool',{
  init(){
    lvlWidth=2200;
    cabinX=60;poolX=500;poolW=350;grillX=920;terraceX=1700;
    sitY=GND-10;
    girlSitX=poolX+100;boySitX=poolX+160;
    chatIdx=-1;chatTimer=0;
    player.x=girlSitX;player.y=GND-player.h;player.facing=1;
    boyWalkX=boySitX;boyWalkFrame=0;boyWalkFT=0;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='chat';phaseT=0}return}
    if(phase==='chat'){
      phaseT++;chatTimer--;
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='grill';phaseT=0}
      return;
    }
    if(phase==='grill'){
      phaseT++;
      // Walk to grill area
      if(player.x<grillX){
        player.x+=SPD*.6;player.facing=1;
        player.ft++;if(player.ft%7===0)player.frame=(player.frame+1)%4;
      }
      const bt=player.x-30;
      if(Math.abs(boyWalkX-bt)>2){
        boyWalkX+=(bt>boyWalkX?1:-1)*SPD*.5;
        boyWalkFT++;if(boyWalkFT%7===0)boyWalkFrame=(boyWalkFrame+1)%4;
      }else{boyWalkFrame=0}
      if(player.x>=grillX&&phaseT>60){phase='photo';phaseT=0;player.frame=0}
      return;
    }
    if(phase==='photo'){
      phaseT++;
      const bt=grillX-30;
      if(Math.abs(boyWalkX-bt)>2)boyWalkX+=(bt>boyWalkX?1:-1)*SPD*.5;
      if(phaseT===60)sfxChat();
      if(phaseT>120){phase='walkToTerrace';phaseT=0}
      return;
    }
    if(phase==='walkToTerrace'){
      movePlayer(true);
      const bt=player.x-30;
      if(Math.abs(boyWalkX-bt)>2){
        const dir=bt>boyWalkX?1:-1;
        boyWalkX+=dir*SPD*.8;
        boyWalkFT++;if(boyWalkFT%7===0)boyWalkFrame=(boyWalkFrame+1)%4;
      }else{boyWalkFrame=0}
      if(player.x>terraceX+40){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=terraceX+200;portalPos.y=GND;portalPos.active=true;
        sfxPortal();
      }
      if(phaseT>40){phase='portal';phaseT=0}
      return;
    }
    if(phase==='portal'){
      movePlayer(true);
      const bt=player.x-30;
      if(Math.abs(boyWalkX-bt)>2){
        const dir=bt>boyWalkX?1:-1;
        boyWalkX+=dir*SPD*.8;
        boyWalkFT++;if(boyWalkFT%7===0)boyWalkFrame=(boyWalkFrame+1)%4;
      }else{boyWalkFrame=0}
      checkPortal();return;
    }
    if(phase==='complete'){
      phaseT++;
      const bt=portalPos.x-30;
      if(boyWalkX<bt-2)boyWalkX+=SPD*.8;
      spark(portalPos.x,portalPos.y-20,['#E94560','#9B59B6','#FFD700'][Math.floor(Math.random()*3)],1);
      if(phaseT>120)completeLevel();
    }
  },
  draw(){
    const sitting=phase==='chat';

    // Sky
    X.fillStyle=cachedGrad('l7sky',0,0,0,GND,[[0,'#3A9AD9'],[.5,'#6BBCE8'],[1,'#90D4F0']]);
    X.fillRect(0,0,W,GND);

    // Sun
    X.fillStyle='rgba(255,245,200,.7)';
    X.beginPath();X.arc(200-cam.x*.03,45,40,0,Math.PI*2);X.fill();
    X.fillStyle='rgba(255,245,200,.1)';
    X.beginPath();X.arc(200-cam.x*.03,45,80,0,Math.PI*2);X.fill();

    // Two green mountains
    // Left mountain
    X.fillStyle='#4A8A40';
    X.beginPath();X.moveTo(0,GND);
    X.lineTo(50-cam.x*.15,280);X.lineTo(200-cam.x*.15,100);X.lineTo(400-cam.x*.15,250);
    X.lineTo(500-cam.x*.15,GND);X.lineTo(0,GND);X.fill();
    X.fillStyle='#5A9A50';
    X.beginPath();X.moveTo(100-cam.x*.15,280);X.lineTo(200-cam.x*.15,120);X.lineTo(350-cam.x*.15,260);X.fill();

    // Right mountain
    X.fillStyle='#3D7A35';
    X.beginPath();X.moveTo(350-cam.x*.12,GND);
    X.lineTo(500-cam.x*.12,220);X.lineTo(700-cam.x*.12,80);X.lineTo(900-cam.x*.12,200);
    X.lineTo(1000-cam.x*.12,GND);X.lineTo(350-cam.x*.12,GND);X.fill();
    X.fillStyle='#4D8A45';
    X.beginPath();X.moveTo(550-cam.x*.12,230);X.lineTo(700-cam.x*.12,100);X.lineTo(850-cam.x*.12,210);X.fill();

    // Treeline at base
    X.fillStyle='#2D5A25';
    X.beginPath();X.moveTo(0,GND);X.lineTo(0,GND-35);
    for(let tx=0;tx<=W;tx+=25){
      X.lineTo(tx,GND-35-10*Math.sin((tx+cam.x*.3)*.04)-6*Math.cos((tx+cam.x*.3)*.07));
    }
    X.lineTo(W,GND);X.fill();

    // Ground
    X.fillStyle='#4D8A38';X.fillRect(0,GND,W,H-GND);
    // Stone deck around pool
    X.fillStyle='#C0B8A8';
    const psx=poolX-cam.x;
    X.fillRect(psx-20,GND-4,poolW+40,H-GND+4);

    // Pool
    X.fillStyle='#1A80C8';X.fillRect(psx,GND-2,poolW,H-GND-10);
    X.fillStyle='#2090D8';X.fillRect(psx+4,GND,poolW-8,H-GND-14);
    X.fillStyle='#30A0E8';X.fillRect(psx+10,GND+4,poolW-20,H-GND-20);
    // Water shimmer
    const wt=Date.now()/800;
    X.fillStyle='rgba(255,255,255,.1)';
    X.fillRect(psx+20+Math.sin(wt)*10,GND+6,50,2);
    X.fillRect(psx+120+Math.sin(wt+2)*8,GND+10,40,2);
    X.fillRect(psx+200+Math.sin(wt+4)*12,GND+4,35,2);
    // Pool edge highlight
    X.fillStyle='#D0C8B8';X.fillRect(psx-20,GND-6,poolW+40,4);

    // Dark grey cabin (left side) with terrace
    const csx=cabinX-cam.x;
    if(csx>-250&&csx<W+50){
      // Cabin structure (dark grey, flat panels)
      X.fillStyle='#4A4A4A';X.fillRect(csx,GND-100,180,100);
      X.fillStyle='#424242';
      X.fillRect(csx,GND-100,180,50);
      X.fillStyle='#3E3E3E';
      X.fillRect(csx,GND-50,180,50);
      // Windows
      X.fillStyle='rgba(130,180,220,.25)';
      X.fillRect(csx+12,GND-85,45,40);X.fillRect(csx+68,GND-85,45,40);X.fillRect(csx+124,GND-85,45,40);
      // Mullions
      X.fillStyle='#4A4A4A';
      X.fillRect(csx+33,GND-85,2,40);X.fillRect(csx+89,GND-85,2,40);X.fillRect(csx+145,GND-85,2,40);
      // Door
      X.fillStyle='#3A3A3A';X.fillRect(csx+75,GND-65,28,65);
      X.fillStyle='rgba(130,180,220,.15)';X.fillRect(csx+79,GND-58,20,35);
      X.fillStyle='#999';X.fillRect(csx+96,GND-40,3,8);
      // Flat roof
      X.fillStyle='#444';X.fillRect(csx-8,GND-106,196,8);

      // Terrace (extends from cabin to the right)
      const ttx=csx+180,ttw=120;
      X.fillStyle='#666';X.fillRect(ttx,GND,ttw,H-GND);
      X.fillStyle='#5A5A5A';X.fillRect(ttx,GND,ttw,2);
      // Terrace railing
      X.fillStyle='#444';
      X.fillRect(ttx,GND-38,ttw,3);X.fillRect(ttx,GND-4,ttw,3);
      for(let rp=ttx+20;rp<ttx+ttw;rp+=30){
        X.fillRect(rp,GND-38,2,38);
      }
      // Terrace roof overhang
      X.fillStyle='#2A2A2A';X.fillRect(ttx-5,GND-80,ttw+10,6);
      X.fillRect(ttx+5,GND-74,3,36);X.fillRect(ttx+ttw-8,GND-74,3,36);
    }

    // Sheep on the right side
    [1200,1300,1420,1500,1560].forEach((sx,i)=>{
      const shx=sx-cam.x;
      if(shx>-30&&shx<W+30){
        const bob=Math.sin(Date.now()/600+i*2)*1.5;
        // Body (fluffy white)
        X.fillStyle='#F0EDE8';
        X.beginPath();X.arc(shx+10,GND-12+bob,10,0,Math.PI*2);X.fill();
        X.fillStyle='#E8E4DF';
        X.beginPath();X.arc(shx+8,GND-14+bob,8,0,Math.PI*2);X.fill();
        // Head
        X.fillStyle='#2A2A2A';
        X.fillRect(shx-2,GND-18+bob,8,8);
        // Eyes
        X.fillStyle='#FFF';
        X.fillRect(shx,GND-16+bob,2,2);X.fillRect(shx+3,GND-16+bob,2,2);
        // Ears
        X.fillStyle='#2A2A2A';
        X.fillRect(shx-3,GND-18+bob,3,4);X.fillRect(shx+6,GND-18+bob,3,4);
        // Legs
        X.fillStyle='#2A2A2A';
        X.fillRect(shx+2,GND-4+bob,2,6);X.fillRect(shx+8,GND-4+bob,2,6);
        X.fillRect(shx+14,GND-4+bob,2,6);X.fillRect(shx+18,GND-4+bob,2,6);
      }
    });

    // Grill
    const gsx=grillX-cam.x;
    if(gsx>-60&&gsx<W+40){
      // Grill body
      X.fillStyle='#333';X.fillRect(gsx,GND-30,30,20);
      X.fillStyle='#444';X.fillRect(gsx+2,GND-28,26,16);
      // Grill grate
      X.fillStyle='#888';
      for(let gr=gsx+4;gr<gsx+28;gr+=4){
        X.fillRect(gr,GND-28,1,16);
      }
      // Legs
      X.fillStyle='#333';X.fillRect(gsx+3,GND-10,3,10);X.fillRect(gsx+24,GND-10,3,10);
      // Smoke (when grilling phase)
      if(phase==='grill'||phase==='photo'){
        X.fillStyle='rgba(200,200,200,.15)';
        const st=Date.now()/400;
        for(let si=0;si<4;si++){
          X.beginPath();
          X.arc(gsx+15+Math.sin(st+si)*8,GND-40-si*15-Math.sin(st*.7)*5,6+si*2,0,Math.PI*2);
          X.fill();
        }
      }
      // Shrimps on grill (visible during photo)
      if(phase==='photo'||phase==='grill'){
        X.fillStyle='#E87050';
        X.fillRect(gsx+6,GND-26,5,3);X.fillRect(gsx+14,GND-26,5,3);X.fillRect(gsx+22,GND-26,5,3);
        X.fillRect(gsx+10,GND-22,5,3);X.fillRect(gsx+18,GND-22,5,3);
      }
    }

    // Poker terrace (right side)
    const tsx=terraceX-cam.x;
    if(tsx>-200&&tsx<W+50){
      // Terrace floor
      X.fillStyle='#666';X.fillRect(tsx,GND,200,H-GND);
      X.fillStyle='#5A5A5A';X.fillRect(tsx,GND,200,2);
      // Railing
      X.fillStyle='#444';
      X.fillRect(tsx,GND-38,200,3);X.fillRect(tsx,GND-4,200,3);
      for(let rp=tsx+25;rp<tsx+200;rp+=35){
        X.fillRect(rp,GND-38,2,38);
      }
      // Roof overhang
      X.fillStyle='#3A3A3A';X.fillRect(tsx-5,GND-80,210,6);
      X.fillRect(tsx+5,GND-74,3,36);X.fillRect(tsx+192,GND-74,3,36);
      // Poker table
      X.fillStyle='#2A6A30';X.fillRect(tsx+55,GND-28,90,6);
      X.fillStyle='#1A5A20';X.fillRect(tsx+57,GND-26,86,2);
      X.fillStyle='#444';X.fillRect(tsx+65,GND-22,4,22);X.fillRect(tsx+131,GND-22,4,22);
      // Cards
      X.fillStyle='#FFF';X.fillRect(tsx+78,GND-32,8,10);X.fillRect(tsx+90,GND-32,8,10);
      X.fillRect(tsx+102,GND-32,8,10);X.fillRect(tsx+114,GND-32,8,10);
      X.fillStyle='#E94560';X.fillRect(tsx+80,GND-30,4,6);
      X.fillStyle='#333';X.fillRect(tsx+92,GND-30,4,6);
      X.fillStyle='#E94560';X.fillRect(tsx+104,GND-30,4,6);
      X.fillStyle='#333';X.fillRect(tsx+116,GND-30,4,6);
      // Chips
      X.fillStyle='#E94560';X.fillRect(tsx+74,GND-34,6,4);
      X.fillStyle='#3498DB';X.fillRect(tsx+110,GND-34,6,4);
      // Chairs
      X.fillStyle='#444';
      X.fillRect(tsx+48,GND-16,10,16);X.fillRect(tsx+140,GND-16,10,16);
      X.fillRect(tsx+45,GND-30,16,4);X.fillRect(tsx+137,GND-30,16,4);
    }

    // Characters
    if(phase!=='intro'){
      if(sitting){
        // Sitting on pool edge, feet dangling
        drawGirl(girlSitX-cam.x,sitY-28,1,0,'swimwhite',true);
        drawBoy(boySitX-cam.x,sitY-28,-1,true,'swimgreen');
      }else if(phase==='photo'){
        // Vitalik posing by grill, Olya nearby
        drawBoy(boyWalkX-cam.x,GND-player.h,1,false,'swimgreen');
        drawGirl(player.x-cam.x,player.y,-1,0,'swimwhite',false);
      }else{
        drawGirl(player.x-cam.x,player.y,player.facing,player.frame,'swimwhite',false);
        const bf=player.x>boyWalkX?1:-1;
        drawBoy(boyWalkX-cam.x,GND-player.h,bf,false,'swimgreen');
      }
    }

    // Chat dialogue (pool edge)
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      const bx=line.s==='g'?girlSitX-cam.x+10:boySitX-cam.x+10;
      const by=sitY-60;
      bubble(bx,by,line.t,line.s==='g'?'left':'right',line.s==='g'?'Olya':'Vitalik');
    }

    // Photo moment
    if(phase==='photo'){
      const alpha=Math.min(1,phaseT/30);
      X.globalAlpha=alpha;
      X.fillStyle='rgba(0,0,0,.4)';X.fillRect(0,H*.15,W,40);
      X.fillStyle='#FFD700';X.textAlign='center';X.font='bold 18px monospace';
      X.fillText('📸  Shrimp photo for the boys!',W/2,H*.15+28);
      X.textAlign='left';
      X.globalAlpha=1;
      if(phaseT>60&&phaseT<80){
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
