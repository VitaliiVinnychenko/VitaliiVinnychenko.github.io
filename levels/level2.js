// Level 2: The Drive
(function(){

let driveT,carX,sceneryOff,stopped,questionT,kissT,girlExited,scenery;

registerLevel('The Drive',{
  init(){
    lvlWidth=800;
    player.x=200;player.y=GND-player.h;player.facing=1;
    driveT=0;carX=W/2-80;sceneryOff=0;stopped=false;
    questionT=0;kissT=0;girlExited=false;
    scenery=[];
    for(let i=0;i<30;i++){
      scenery.push({
        x:i*120+Math.random()*60,
        type:Math.random()>.4?'tree':'lamp',
        h:40+Math.random()*30
      });
    }
  },
  update(){
    if(phase==='intro'){phaseT++;if(phaseT>100){phase='drive';phaseT=0}return}
    if(phase==='drive'){
      driveT++;sceneryOff+=4;
      if(driveT%15===0)sfxCar();
      if(driveT>=15*60){phase='decel';phaseT=0}
      return;
    }
    if(phase==='decel'){
      phaseT++;
      sceneryOff+=Math.max(0,4-phaseT*.08);
      if(phaseT>50){phase='question';phaseT=0}
      return;
    }
    if(phase==='question'){
      phaseT++;
      if(phaseT>150){phase='answer';phaseT=0;sfxChat()}
      return;
    }
    if(phase==='answer'){
      phaseT++;
      if(phaseT>150){phase='kiss';phaseT=0;sfxKiss()}
      return;
    }
    if(phase==='kiss'){
      phaseT++;
      if(phaseT>120){phase='exit';phaseT=0}
      return;
    }
    if(phase==='exit'){
      phaseT++;
      if(phaseT===1){
        girlExited=true;
        player.x=carX+100;player.y=GND-player.h;player.facing=1;player.vx=0;
      }
      if(phaseT>30){
        portalPos.x=carX+300;portalPos.y=GND;portalPos.active=true;
        sfxPortal();phase='portal';phaseT=0;
      }
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
    const progress=Math.min(1,driveT/(15*60));
    const g=X.createLinearGradient(0,0,0,GND);
    const r1=lerp(135,255,progress),g1=lerp(206,127,progress),b1=lerp(235,80,progress);
    const r2=lerp(80,255,progress),g2=lerp(140,99,progress),b2=lerp(200,71,progress);
    g.addColorStop(0,`rgb(${r1|0},${g1|0},${b1|0})`);
    g.addColorStop(1,`rgb(${r2|0},${g2|0},${b2|0})`);
    X.fillStyle=g;X.fillRect(0,0,W,GND);

    if(progress>.3){
      X.fillStyle=`rgba(255,140,50,${(progress-.3)*.15})`;
      X.beginPath();X.arc(W*.8,GND-40,80,0,Math.PI*2);X.fill();
    }

    X.fillStyle=`rgba(${lerp(80,120,progress)|0},${lerp(120,60,progress)|0},${lerp(80,60,progress)|0},.4)`;
    X.beginPath();X.moveTo(0,GND);
    for(let x=0;x<=W;x+=60){
      X.lineTo(x,GND-60-30*Math.sin((x+sceneryOff*.2)*.008));
    }
    X.lineTo(W,GND);X.fill();

    X.fillStyle='#555';X.fillRect(0,GND,W,H-GND);
    X.fillStyle='#444';X.fillRect(0,GND,W,3);
    X.fillStyle='#FFD';
    for(let dx=-40;dx<W+40;dx+=60){
      const rx=(dx-sceneryOff%60+60)%W-20;
      X.fillRect(rx,GND+(H-GND)/2-1,30,3);
    }

    scenery.forEach(s=>{
      let sx=(s.x-sceneryOff%3600+3600)%(W+200)-100;
      if(s.type==='tree'){
        X.fillStyle='#3A2510';X.fillRect(sx+8,GND-s.h,6,s.h);
        X.fillStyle=`rgb(${lerp(60,80,progress)|0},${lerp(140,80,progress)|0},${lerp(60,50,progress)|0})`;
        X.beginPath();X.arc(sx+11,GND-s.h-12,16,0,Math.PI*2);X.fill();
      }else{
        X.fillStyle='#888';X.fillRect(sx+4,GND-50,3,50);
        X.fillStyle='#FFE4A0';X.fillRect(sx,GND-52,10,6);
        if(progress>.2){
          X.fillStyle=`rgba(255,220,140,${progress*.06})`;
          X.beginPath();X.arc(sx+5,GND-49,20,0,Math.PI*2);X.fill();
        }
      }
    });

    const carY=GND-40;
    const bounce=phase==='drive'?Math.sin(Date.now()*.01)*1.5:0;
    drawCar(carX,carY+bounce,progress);

    if(!girlExited){
      drawBoy(carX+22,carY+bounce-4,1,true);
      drawGirl(carX+85,carY+bounce-4,-1,0,'dress',true);
    }else{
      drawBoy(carX+22,carY-4,1,true);
      drawGirl(player.x,player.y,player.facing,player.frame,'dress',false);
    }

    if(phase==='question'){
      const alpha=Math.min(1,phaseT/40);
      X.globalAlpha=alpha;
      X.fillStyle='rgba(0,0,0,.4)';X.fillRect(0,H*.25-18,W,100);
      X.textAlign='center';X.fillStyle='#E94560';X.font='bold 13px monospace';
      X.fillText('Olya',W/2,H*.25);
      label('"Are you going to kiss me?"',H*.25+48,22,'#FFF');
      X.globalAlpha=1;
    }
    if(phase==='answer'){
      const alpha=Math.min(1,phaseT/40);
      X.globalAlpha=alpha;
      X.fillStyle='rgba(0,0,0,.4)';X.fillRect(0,H*.25-18,W,100);
      X.textAlign='center';X.fillStyle='#3498DB';X.font='bold 13px monospace';
      X.fillText('Vitalik',W/2,H*.25);
      label('"I was going to..."',H*.25+48,22,'#FFF');
      X.globalAlpha=1;
    }
    if(phase==='kiss'){
      const alpha=Math.min(1,phaseT/30);
      X.globalAlpha=alpha;
      X.fillStyle='rgba(0,0,0,.4)';X.fillRect(0,H*.25-18,W,100);
      X.textAlign='center';X.fillStyle='#E94560';X.font='bold 13px monospace';
      X.fillText('Olya',W/2,H*.25);
      label('Kiss',H*.25+45,28,'#E94560');
      if(phaseT%8===0)spark(W/2+Math.random()*100-50,H*.3,'#E94560',3);
      X.globalAlpha=1;
    }

    if(portalPos.active)drawPortal(portalPos.x,portalPos.y);
    drwPart();
    drawLevelHUD();
    if(phase==='intro')drawIntro(curLevel);
    if(phase==='complete')drawComplete();
  }
});

})();
