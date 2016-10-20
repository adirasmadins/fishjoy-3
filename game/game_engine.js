var isTicking = false;
var gameInterval = null;
var game_data_render = [];

function setClockEngine(){
    //console.log("+++++++ START SET");
    setInterval(moveIt, fps);
    isTicking = true;
}

function stopClockEngine(){
     //console.log("$$$$$$$$ STOPPP");
    if(gameInterval !== null){
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

function moveIt(){
    //console.log("--move it");
    var data = game_data_render;
    
    var gameCanvas = document.getElementById('gamecanvas');
    var ctx = gameCanvas.getContext('2d');
        
    var bulletCanvas = document.getElementById('bulletcanvas');
    var ctx_b = bulletCanvas.getContext('2d');
        
    for(i=0;i< data.length;i++){
        var _cdata = data[i];
        var _type = _cdata.type;
        
        if(_type == 'bullet'){
            //console.log("---bullet "+_cdata.hit);
            var _index = getCannonIndex(_cdata.cannonid);
            if(!_cdata.hit && !_cdata.pickUpScore){
                var speedx = _cdata.speed*Math.sin(_cdata.angle);
                var speedy = _cdata.speed*Math.cos(_cdata.angle);
                
                var accelerateX = _cdata.accelerate*Math.sin(_cdata.angle);
                var accelerateY = _cdata.accelerate*Math.cos(_cdata.angle);
                
                speedx += accelerateX;
                speedy += accelerateY;

                _cdata.x += speedx;
                _cdata.y -= speedy;
                
                
            }
         }else{
            _cdata.x += _cdata.speedX;
            _cdata.y += _cdata.speedY; 
        }
        
        //ctx.putImageData(_cdata.clip, _cdata.x, _cdata.y);
        
    }
    
    render(game_data_render);
    return;
}

function render(data){
    //console.log("-- RENDER");
    var gameCanvas = document.getElementById('gamecanvas');
    var ctx = gameCanvas.getContext('2d');
        
    var bulletCanvas = document.getElementById('bulletcanvas');
    var ctx_b = bulletCanvas.getContext('2d');
    
    
    var _iWidth = cWidth;
    var _iHeight = cHeight;
    
    if(_iWidth < window.innerWidth){
        _iWidth = window.innerWidth;
    }
    
    if(_iHeight < window.innerHeight){
        _iHeight = window.innerHeight;
    }

    ctx.clearRect(0,0, _iWidth, _iHeight);
    ctx_b.clearRect(0,0, _iWidth, _iHeight);
            
    var bulletNum = 0;
            
    for(i=0;i<data.length;i++){
        var _cdata = data[i];
        var _frame = _cdata.frame;
        var _tFrame = _cdata.totalFrame; 
        //console.log(_cdata.type+" x:"+_cdata.x+" y:"+_cdata.y,"frame:"+_cdata.frame+" of "+_tFrame+" - is flip: "+_cdata.isFlip);
        var _type = _cdata.type;
        var _image;// = assets[_type];
        //_image.rotation = _cdata.rot;
                
        var tPosX = _cdata.x;// + posX;
        var tPosY = _cdata.y;// + posY;
        var segment;// = _image.height/_tFrame;
        var frameSegment;
                
                
        ctx.save();
        ctx_b.save();
        
        if(_type == 'bullet'){
            //console.log("---bullet "+_cdata.hit);
            var _index = getCannonIndex(_cdata.cannonid);
            if(!_cdata.hit && !_cdata.pickUpScore){
                //console.log("-- not hit");
                //_image = assets[_type+(_cdata.cannonid+1)];
                //_image = assets[_type+(_index)];
                _image = assets[_type+(_cdata.bulletType + 3)];
                segment = _image.height/_tFrame;

                //console.log("BULLET - angle: "+_cdata.angle);
                tPosX = 0;
                tPosY = 0;

                ctx_b.translate(_cdata.x + posX, _cdata.y);
                ctx_b.rotate(_cdata.angle);
                ctx_b.translate(-_image.width/2, -_image.height/2);
                
                ctx_b.drawImage(
                    _image, //img Source image object	Sprite sheet
                    tPosX,//dx	Destination x
                    tPosY//dy	Destination y
                );
                
            }else{
                //if(_cdata.pickUpScore){
                    bulletNum ++;
                    
                    //tPosX = _cdata.fishX;
                    //tPosY = _cdata.fishY;
                    
                    //tPosX += posX;
                    //tPosY += posY;
                    
                    var isFlip = _cdata.isflip;
                    if(isFlip){
                        //tPosX += _cdata.fishW;
                        //tPosY += _cdata.fishY/2;
                    }
                
                
                     //_image = assets["web1"];
                //    _image = assets["web"+(_cdata.bulletType + 1)];
                
                    //tPosX = 0;
                    //tPosY = 0;

                    //ctx_b.translate(tPosX, tPosY);
                    //ctx_b.translate(-_image.width/2, -_image.height/2);
                
                   
                  //  ctx_b.drawImage(
                   //     _image, //img Source image object	Sprite sheet
                    //    tPosX,//dx	Destination x
                     //   tPosY//dy	Destination y
                   // );
                //}
            }
         }else{
             var _imageweb = assets["web2"];
            _image = assets[_type];
            segment = _image.height/_tFrame;
            
             
             
            frameSegment = (_frame-1)*segment;
            if(_cdata.isFlip == true){
                ctx.translate(gameCanvas.width + posX, 0);
                ctx.scale(-1,1);
                tPosX = cWidth - _cdata.x;
                //tPosX -= posX;
            }else{
                tPosX += posX;
            }
             
             //context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
            ctx.drawImage(
                _image,         //img Source image object	Sprite sheet
                0,              //sx	Source x	Frame index times frame width
                frameSegment,   //sy	Source y	
                _image.width,   //sw	Source width	Frame width
               segment,         //sh	Source height	Frame height
                tPosX,          //dx	Destination x
                tPosY,          //dy	Destination y
                _image.width,   //dw	Destination width	Frame width
               segment          //dh	Destination height	Frame height
            );
             
             //console.log("-- "+_type+" - "+_cdata.captured);
             
             if(_cdata.captured){
                //_frame += _cdata.totalActiveFrame;
                 ctx.drawImage(
                    _imageweb,         //img Source image object	Sprite sheet
                    0,              //sx	Source x	Frame index times frame width
                    0,              //sy	Source y	
                    _imageweb.width,   //sw	Source width	Frame width
                    _imageweb.height,         //sh	Source height	Frame height
                    tPosX,          //dx	Destination x
                    tPosY,          //dy	Destination y
                    _imageweb.width,   //dw	Destination width	Frame width
                    _imageweb.height          //dh	Destination height	Frame height
                );
            }
             
             
        }
        
        _cdata.clip = _image;
        game_data_render.push(_cdata);
                
        ctx_b.restore();
        ctx.restore();
    }
}

function renderCannon(_data){
    var i;
    for(i=0; i< _data.length;i++){
        var indeks = getCannonData(_data[i].id);
        //console.log(i+" cannon id: "+_data[i].id+" angle: "+_data[i].angle+" active: "+_data[i].active);
        cannonList[indeks].addRot = _data[i].angle;
        cannonList[indeks].bulletType = _data[i].bulletType;
        //turnCannon(data.angle, data.id);
    }
    
    createCannon();
}


function getCannonData(id){
    var i = 0;
    for(i=0; i<cannonList.length;i++){
        var cData = cannonList[i];
        if(cData.id == id){
            return i;
        }
    }
    return i;
}

function filterPlayer(data){
    var _result = [];
    for(var i=0; i < data.length; i++){
        var _player = data[i];
        if(_player.status == 1){
            _result.push(_player);
        }
    }
    return _result;
}

function checkOwnCoin(data){
    for(var i=0; i < data.length; i++){
        var _player = data[i];
        if(_player.socketid == playerSId){
            if(_player.coin <= 0){
                showRunningOfCoinPopup("no_coin");
                break;
            }
        }
    }
}

function outOfRoom(){
    showPreloaderMessage("Connection lost, please refresh when connection ready...");
    showCommonCanvas(true);

}