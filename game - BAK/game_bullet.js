var bullet_type = 0;
var max_bullet_type = 3;

function initiateBullet(ev){
      if(!isClick){
           var gCanvas = document.getElementById('cannoncanvas');
          //var rect = gCanvas.getBoundingClientRect();
          //var x = ev.clientX - rect.left;
          //var y = ev.clientY - rect.top;
           var x = ev.clientX - gCanvas.offsetLeft;// - posX;
           var y = ev.clientY - gCanvas.offsetTop;
           //console.log("CLICK @ x: "+(x+posX)+" y: "+y);

          var cannonData = cannonList[selectedCannon];
          var cannonX = cannonData.cannonX;
          var cannonY = cannonData.cannonY;
          
          var deltaX = x - (cannonX);
          var deltaY = cannonY - y;
          
          var angle = Math.atan2(deltaY, deltaX)*radToDegree;
          var degree = 90 - angle;
          var finalAngle = degree*degreeToRad;

          //console.log('x1: '+(x+posX)+" x0: "+cannonX);
          //console.log('y1: '+y+" y0: "+cannonY);
          //console.log('--- turn cannon deltaX: '+deltaX+' deltaY: '+deltaY+" angle: "+angle+" degree: "+degree);
          //console.log('converted angle: '+degree*degreeToRad);

          // posisi akhir, posisi cannon, angle
          var data = {
              type:bullet_type,
              roomname:roomname,
              playerid:playerid,
              socketid:playerSId,
              cannonid:cannonData.id,//selectedCannon,
              finalX:x-posX,
              finalY:y,
              originX:cannonX - posX,
              originY:cannonY,
              angle:finalAngle // radian
          }
          socket.emit('shot', data);
          socket.emit('cannon', {id:cannonData.id,angle:finalAngle*radToDegree, roomname:roomname, type:bullet_type});
          //turnCannon(finalAngle);
                
          isClick = true;
          setTimeout(releaseClick, 300);
      }
  }
        
function releaseClick(){
   isClick = false;
}

function changeBulletType(dir){
    bullet_type += dir*1;
    if(bullet_type < 0){
        bullet_type = 0;
    }
    
    if(bullet_type > max_bullet_type){
        bullet_type = max_bullet_type;
    }
    
    
    console.log("=== TO "+bullet_type);
    
     var cannonData = cannonList[selectedCannon];
    var data = {
          type:bullet_type,
          roomname:roomname,
          playerid:playerid,
          socketid:playerSId,
          id:cannonData.id
    }
    
    sendBulletChanges(data);
    
}
        
 function turnCannon(angle){
         
    var _image = assets['cannon1'];
    var segment = _image.height/5;
            
    var gCanvas = document.getElementById('cannoncanvas');
    var ctx = gCanvas.getContext('2d');
    ctx.clearRect(0,0,gCanvas.width, gCanvas.height)
    ctx.save();
    //ctx.translate(posX, posY);
    ctx.translate(cannonX, cannonY);
    //ctx.translate(window.innerWidth/2 +_image.width/2, window.innerHeight);
    ctx.rotate(angle);
    ctx.translate(-_image.width/2, -segment);
                
    ctx.drawImage(
        _image,
        0,
        segment,
        _image.width,
        segment,
        //cannonX,
        //cannonY,
        0,
        0,
        _image.width,
       segment
    );
                
     ctx.restore();
            
}
        