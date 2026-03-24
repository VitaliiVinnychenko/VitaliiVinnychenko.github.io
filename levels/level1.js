// Level 1: First Date
(function(){

const CHAT=[
  {s:'g',t:"Finally! I've been here forever!"},
  {s:'b',t:"I'm right on time! You're just early"},
  {s:'g',t:"...only by 10 minutes"},
  {s:'b',t:"See? That's on you!"},
  {s:'g',t:"Wait... is that a HOLE in your jeans?"},
  {s:'b',t:"Uhh... it's fashion?"},
  {s:'g',t:"And are they... dirty?!"},
  {s:'b',t:"...maybe a little"},
  {s:'g',t:"*laughs* Unbelievable!"},
  {s:'b',t:"I was in a rush to see you!"},
  {s:'g',t:"You're weird... but interesting"},
];

let boyX,tables,chatIdx,chatTimer,girlSitting,girlSitX,girlSitY,boySitX,boySitY;

registerLevel('First Date',{
  init(){
    lvlWidth=1400;
    player.x=60;player.y=GND-player.h;player.facing=1;
    boyX=1100;
    tables=[{x:250},{x:500},{x:750},{x:1050}];
    chatIdx=-1;chatTimer=0;girlSitting=false;
    boySitX=boyX+30;boySitY=GND-36;
    girlSitX=boyX-10;girlSitY=GND-36;
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='walk';phaseT=0}return}
    if(phase==='walk'){
      movePlayer(true);
      if(player.x+player.w>boyX-20){
        phase='chat';phaseT=0;chatIdx=-1;chatTimer=50;girlSitting=true;
      }
      return;
    }
    if(phase==='chat'){
      phaseT++;chatTimer--;
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){
        portalPos.x=boyX+160;portalPos.y=GND;portalPos.active=true;
        sfxPortal();girlSitting=false;
        player.x=girlSitX;player.y=GND-player.h;
      }
      if(phaseT>40){phase='portal';phaseT=0}
      return;
    }
    if(phase==='portal'){movePlayer(true);checkPortal();return}
    if(phase==='complete'){
      phaseT++;
      spark(portalPos.x,portalPos.y-20,['#E94560','#9B59B6','#FFD700'][Math.floor(Math.random()*3)],1);
      if(phaseT>120)completeLevel();
    }
  },
  draw(){
    X.fillStyle='#5C3A1E';X.fillRect(0,0,W,GND);
    X.fillStyle='#4A2E15';X.fillRect(0,GND-110,lvlWidth,110);
    X.fillStyle='#6B4226';X.fillRect(0,GND-112,lvlWidth,3);
    X.fillStyle=cachedGrad('l1warm',0,0,0,GND,[[0,'rgba(255,180,80,.08)'],[1,'rgba(255,120,40,.04)']]);
    X.fillRect(0,0,W,GND);

    for(let fx=Math.floor(cam.x/40)*40;fx<cam.x+W+40;fx+=40){
      const sx=fx-cam.x;
      X.fillStyle=(Math.floor(fx/40)%2)?'#A0722A':'#8B6318';
      X.fillRect(sx,GND,40,H-GND);
      X.fillStyle='rgba(0,0,0,.1)';X.fillRect(sx,GND,40,1);
    }

    [60,350,650,900,1180].forEach(wx=>{
      const sx=wx-cam.x;
      if(sx>-140&&sx<W+40){
        const ww=110,wh=180,wy=30;
        X.fillStyle='#3A2510';X.fillRect(sx-3,wy-3,ww+6,wh+6);
        X.fillStyle='rgba(160,195,230,.3)';X.fillRect(sx,wy,ww,wh);
        X.fillStyle='rgba(180,210,240,.1)';X.fillRect(sx,wy,ww,wh/2);
        X.fillStyle='#3A2510';
        X.fillRect(sx+ww/2-2,wy,4,wh);X.fillRect(sx,wy+wh/2-2,ww,4);
        X.fillStyle='rgba(160,200,240,.04)';X.fillRect(sx-15,wy,ww+30,wh+20);
        X.fillStyle='rgba(255,255,255,.08)';X.fillRect(sx+6,wy+6,ww/2-10,wh/2-10);
      }
    });

    [180,430,680,980,1200].forEach(lx=>{
      const sx=lx-cam.x;
      if(sx>-40&&sx<W+40){
        X.fillStyle='#333';X.fillRect(sx,0,2,50);
        X.fillStyle='#FFB347';X.fillRect(sx-8,48,18,10);
        X.fillStyle='rgba(255,180,80,.06)';
        X.beginPath();X.arc(sx+1,55,60,0,Math.PI*2);X.fill();
      }
    });

    [100,600].forEach(shx=>{
      const sx=shx-cam.x;
      if(sx>-120&&sx<W+40){
        X.fillStyle='#4A2E15';X.fillRect(sx,100,100,6);
        X.fillStyle='#3A1E10';X.fillRect(sx,106,100,3);
        ['#44AA77','#AA4444','#4477AA','#DDAA33','#44AA77'].forEach((c,i)=>{
          X.fillStyle=c;X.fillRect(sx+10+i*18,80,8,20);
          X.fillStyle='rgba(255,255,255,.2)';X.fillRect(sx+11+i*18,82,2,16);
        });
      }
    });

    tables.forEach(tb=>{
      const sx=tb.x-cam.x;
      if(sx>-100&&sx<W+100){
        X.fillStyle='#EEEEEE';X.fillRect(sx,GND-36,80,4);
        X.fillStyle='#DDD';X.fillRect(sx,GND-32,80,3);
        X.fillStyle='#3A2510';X.fillRect(sx+5,GND-32,4,32);X.fillRect(sx+71,GND-32,4,32);
        X.fillStyle='#FFF8DC';X.fillRect(sx+36,GND-44,6,8);
        X.fillStyle='#FF8C00';X.fillRect(sx+37,GND-47,4,4);
        X.fillStyle='rgba(255,160,60,.12)';
        X.beginPath();X.arc(sx+39,GND-45,15,0,Math.PI*2);X.fill();
        X.fillStyle='rgba(200,220,255,.3)';
        X.fillRect(sx+20,GND-44,5,8);X.fillRect(sx+55,GND-44,5,8);
        X.fillStyle='rgba(200,220,255,.15)';
        X.fillRect(sx+21,GND-42,2,5);X.fillRect(sx+56,GND-42,2,5);
      }
    });

    if(phase!=='intro'){
      const bsx=boySitX-cam.x;
      drawBoy(bsx,boySitY-2,-1,true);
    }

    if(phase==='walk'||phase==='portal'){
      drawGirl(player.x-cam.x,player.y,player.facing,player.frame,'dress',false);
    }
    if(girlSitting&&(phase==='chat'||phase==='portalAppear')){
      drawGirl(girlSitX-cam.x,girlSitY-2,1,0,'dress',true);
    }

    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      const bx=line.s==='g'?girlSitX-cam.x+10:boySitX-cam.x+10;
      const by=line.s==='g'?girlSitY-30:boySitY-30;
      bubble(bx,by,line.t,line.s==='g'?'left':'right',line.s==='g'?'Olya':'Vitalik');
    }

    if(portalPos.active)drawPortal(portalPos.x-cam.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
