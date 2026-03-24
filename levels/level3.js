// Level 3: Meet Leo
(function(){

const CHAT=[
  {s:'g',t:"Aww, who's this little guy?"},
  {s:'b',t:"That's Leo. He owns the place"},
  {s:'c',t:"*purrrrrr*"},
  {s:'g',t:"He's SO soft!"},
  {s:'b',t:"Careful, he sheds like crazy"},
  {s:'g',t:"Come here Leo, come here!"},
  {s:'c',t:"*rolls over*"},
  {s:'g',t:"I could pet you all day"},
  {s:'b',t:"He'd let you, trust me"},
  {s:'g',t:"Wait... is that fur on my hoodie?!"},
  {s:'b',t:"Welcome to my world"},
  {s:'g',t:"I'm COVERED! My whole outfit!"},
];

let sofaX,tvX,boyX,catX,catTargetX,catLying,chatIdx,chatTimer,petted,purrTimer,greetLines;

registerLevel('Meet Leo',{
  init(){
    lvlWidth=1000;
    player.x=60;player.y=GND-player.h;player.facing=1;
    sofaX=450;tvX=380;boyX=500;
    catX=850;catTargetX=0;catLying=false;
    chatIdx=-1;chatTimer=0;petted=false;purrTimer=0;
    greetLines=[{s:'g',t:"Hey! Nice place"},{s:'b',t:"Make yourself at home"}];
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='walk';phaseT=0}return}
    if(phase==='walk'){
      movePlayer(true);
      if(player.x>sofaX-60){phase='greet';phaseT=0;chatIdx=-1;chatTimer=30}
      return;
    }
    if(phase==='greet'){
      phaseT++;chatTimer--;
      if(chatTimer<=0&&chatIdx<greetLines.length-1){chatIdx++;chatTimer=120;sfxChat()}
      if(chatIdx>=greetLines.length-1&&chatTimer<=0){phase='catAppear';phaseT=0;sfxMeow()}
      return;
    }
    if(phase==='catAppear'){
      phaseT++;
      catTargetX=player.x+30;
      if(catX>catTargetX+5){catX-=1.5}
      else{catLying=true;phase='pet';phaseT=0;sfxPurr()}
      return;
    }
    if(phase==='pet'){
      phaseT++;purrTimer++;
      if(purrTimer%120===0)sfxPurr();
      if(wasTapped('Space')||wasTapped('Enter')){
        petted=true;phase='petting';phaseT=0;
        sfxPurr();spark(catX+12,GND-20,'#E94560',8);
      }
      return;
    }
    if(phase==='petting'){
      phaseT++;
      if(phaseT%20===0)spark(catX+12,GND-20,'#E94560',3);
      if(phaseT>60){phase='chat';phaseT=0;chatIdx=-1;chatTimer=40}
      return;
    }
    if(phase==='chat'){
      phaseT++;chatTimer--;purrTimer++;
      if(purrTimer%180===0)sfxPurr();
      if(chatTimer<=0&&chatIdx<CHAT.length-1){chatIdx++;chatTimer=140;sfxChat()}
      if(chatIdx>=CHAT.length-1&&chatTimer<=0){phase='portalAppear';phaseT=0}
      return;
    }
    if(phase==='portalAppear'){
      phaseT++;
      if(phaseT===1){portalPos.x=880;portalPos.y=GND;portalPos.active=true;sfxPortal()}
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
    X.fillStyle='#E8E8E8';X.fillRect(0,0,W,GND);
    X.fillStyle='#D8D8D8';X.fillRect(0,GND-8,W,8);
    X.fillStyle='#BBB';X.fillRect(0,GND-10,W,3);

    for(let fx=Math.floor(cam.x/50)*50;fx<cam.x+W+50;fx+=50){
      const sx=fx-cam.x;
      X.fillStyle=(Math.floor(fx/50)%2)?'#D4BFA0':'#C8B090';
      X.fillRect(sx,GND,50,H-GND);
      X.fillStyle='rgba(0,0,0,.04)';X.fillRect(sx,GND,50,1);
    }

    [120,700].forEach(wx=>{
      const sx=wx-cam.x;
      if(sx>-100&&sx<W+40){
        X.fillStyle='#CCC';X.fillRect(sx-2,40-2,84,124);
        X.fillStyle='rgba(170,205,235,.4)';X.fillRect(sx,40,80,120);
        X.fillStyle='rgba(190,215,240,.1)';X.fillRect(sx,40,80,60);
        X.fillStyle='#CCC';X.fillRect(sx+38,40,4,120);X.fillRect(sx,98,80,4);
        X.fillStyle='rgba(200,200,210,.4)';X.fillRect(sx-8,36,18,130);X.fillRect(sx+70,36,18,130);
      }
    });

    // TV
    const tvsx=tvX-cam.x;
    X.fillStyle='#222';X.fillRect(tvsx,120,100,60);
    X.fillStyle='#333';X.fillRect(tvsx+2,122,96,56);
    const tc=Date.now()/2000;
    X.fillStyle=`hsl(${(tc*60)%360},40%,50%)`;X.fillRect(tvsx+4,124,92,52);
    X.fillStyle='#555';X.fillRect(tvsx+20,180,60,6);
    X.fillRect(tvsx+30,186,4,30);X.fillRect(tvsx+66,186,4,30);

    // Blue sofa
    const ssx=sofaX-cam.x;
    X.fillStyle='#3A6FA5';X.fillRect(ssx,GND-50,140,42);
    X.fillStyle='#4A7FB5';X.fillRect(ssx+4,GND-48,132,36);
    X.fillStyle='#3A6FA5';X.fillRect(ssx,GND-90,140,44);
    X.fillStyle='#4A7FB5';X.fillRect(ssx+4,GND-86,132,36);
    X.fillStyle='#3468A0';X.fillRect(ssx-8,GND-70,14,62);X.fillRect(ssx+134,GND-70,14,62);
    X.fillStyle='#3468A0';X.fillRect(ssx+48,GND-48,3,36);X.fillRect(ssx+93,GND-48,3,36);
    X.fillStyle='#555';X.fillRect(ssx+8,GND-8,6,8);X.fillRect(ssx+126,GND-8,6,8);
    X.fillStyle='#5A9FD5';X.fillRect(ssx+8,GND-80,24,18);X.fillRect(ssx+108,GND-80,24,18);

    // Coffee table
    X.fillStyle='#AAA';X.fillRect(ssx+20,GND-20,100,6);
    X.fillStyle='#999';X.fillRect(ssx+30,GND-14,4,14);X.fillRect(ssx+106,GND-14,4,14);

    // Rug
    X.fillStyle='rgba(180,160,140,.25)';X.fillRect(ssx-20,GND,180,H-GND);

    // Vitalik on sofa
    if(phase!=='intro'){
      drawBoy(boyX-cam.x,GND-72,1,true,'cozy');
    }

    // Cat
    if(phase==='catAppear'||phase==='pet'||phase==='petting'||phase==='chat'||phase==='portalAppear'||phase==='portal'||phase==='complete'){
      drawCat(catX-cam.x,GND-16,1,catLying);
      if(catLying&&(phase==='pet'||phase==='petting'||phase==='chat')){
        X.fillStyle='#888';X.font='bold 10px monospace';X.textAlign='center';
        const purAlpha=.4+.3*Math.sin(Date.now()/300);
        X.globalAlpha=purAlpha;
        X.fillText('~purr~',catX-cam.x+12,GND-22);
        X.globalAlpha=1;X.textAlign='left';
      }
    }

    // Girl
    if(phase==='walk'||phase==='portal'){
      drawGirl(player.x-cam.x,player.y,player.facing,player.frame,'sporty',false);
    }else if(phase!=='intro'&&phase!=='complete'){
      drawGirl(player.x-cam.x,player.y,player.facing,0,'sporty',false);
    }

    // Pet prompt
    if(phase==='pet'){
      const blink=Math.sin(Date.now()/300)>.2;
      if(blink){
        X.textAlign='center';X.fillStyle='#FFF';X.font='bold 16px monospace';
        X.fillStyle='rgba(0,0,0,.5)';X.fillRect(W/2-140,H*.18,280,32);
        X.fillStyle='#FFD700';
        X.fillText('Press SPACE to pet Leo',W/2,H*.18+22);
        X.textAlign='left';
      }
    }

    // Petting hearts
    if(phase==='petting'){
      X.textAlign='center';X.fillStyle='#E94560';X.font='bold 14px monospace';
      X.fillText('♥ ♥ ♥',catX-cam.x+12,GND-30-Math.sin(Date.now()/200)*4);
      X.textAlign='left';
    }

    // Greet dialogue
    if(phase==='greet'&&chatIdx>=0){
      const line=greetLines[chatIdx];
      const bx=line.s==='g'?player.x-cam.x+10:boyX-cam.x+10;
      const by=line.s==='g'?player.y-30:GND-100;
      bubble(bx,by,line.t,line.s==='g'?'left':'right',line.s==='g'?'Olya':'Vitalik');
    }

    // Chat dialogue
    if(phase==='chat'&&chatIdx>=0){
      const line=CHAT[chatIdx];
      let bx,by,speaker;
      if(line.s==='g'){bx=player.x-cam.x+10;by=player.y-30;speaker='Olya'}
      else if(line.s==='b'){bx=boyX-cam.x+10;by=GND-100;speaker='Vitalik'}
      else{bx=catX-cam.x+12;by=GND-38;speaker='Leo'}
      bubble(bx,by,line.t,line.s==='g'?'left':'right',speaker);
    }

    if(portalPos.active)drawPortal(portalPos.x-cam.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
