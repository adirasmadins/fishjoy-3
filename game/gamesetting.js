var preloaderDiv;

var minWHeight = 640;
var maxWHeight = 768;
var cWidth = 1024;
var cHeight = maxWHeight;
var posX;// = window.innerWidth/2 - (cWidth/2);
var posY = 0;
var isClick = false;
var radToDegree = 180/Math.PI;
var degreeToRad = Math.PI/180;

var cannonX;
var cannonY;
var bgCannonList;
var cannonList;
var selectedCannon = null;

//var roomname = "";//room3"; // to be change when ready
var totalcannon = 1;// to be change when ready
var minBuy = 0;
var maxBuy = 0;
var cannonList = [];

var cannonListRep = [];
var cannonTypeList;

var bttnJoins = [];
var posToJoin = null;
var commonButton = [];

var score = 0;
var coin = 0;
var playerid = "12345";
var playerSId = "";
var playername = "";

var scoreList = [];
var coinList = [];

var noOfSlide = 5;

var isIdleOnPopUp = false;

var fps = 0;

$(document).ready(function() {
    $('#popup').popup({
        escape: false,
        blur:false,
        opacity:0.5
    });
});

window.onload = function(){
    //roomname = roomId;
    roomname = $("#roomid").val();    
    console.log("--- on load "+roomname);
   
    if(socket){
      //  console.log("emit initiate "+roomname);
        socket.emit("initiate", {id:roomname, playerid:playerid});
    }
}


function setInitialParameter(data){
    console.log("SET INITIAL PARAMETER "+data.cannonList);
    totalcannon = data.cannon;
    cWidth = data.w;
    cHeight = data.h;
    minBuy = data.minBuy;
    maxBuy = data.maxBuy;
    cannonTypeList = data.cannonList;
    playerSId = data.sid;
    fps = data.fps;

    /*
    cannonListRep = [
        {id:"BL", pos:"B", x:cWidth/4, y:cHeight, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"BC", pos:"B", x:cWidth/2, y:cHeight, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"BR", pos:"B", x:cWidth*(3/4), y:cHeight, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"TL", pos:"T", x:cWidth/4, y:0, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"TC", pos:"T", x:cWidth/2, y:0, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"TR", pos:"T", x:cWidth*(3/4), y:0, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"LT", pos:"L", x:0, y:cHeight/4, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"LC", pos:"L", x:0, y:cHeight/2, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"LB", pos:"L", x:0, y:cHeight*(3/4), addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"RT", pos:"R", x:cWidth, y:cHeight/4, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"RC", pos:"R", x:cWidth, y:cHeight/2, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"RB", pos:"R", x:cWidth, y:cHeight*(3/4), addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false}
    ];
    */

    cannonListRep = [
        {id:"BL", pos:"B", x:cWidth/4, y:0, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"BC", pos:"B", x:cWidth/2, y:0, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"BR", pos:"B", x:cWidth*(3/4), y:0, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"TL", pos:"T", x:cWidth/4, y:cHeight, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"TC", pos:"T", x:cWidth/2, y:cHeight, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"TR", pos:"T", x:cWidth*(3/4), y:cHeight, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false},
        {id:"LT", pos:"L", x:0, y:cHeight/4, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"LC", pos:"L", x:0, y:cHeight/2, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"LB", pos:"L", x:0, y:cHeight*(3/4), addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"RT", pos:"R", x:cWidth, y:cHeight/4, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"RC", pos:"R", x:cWidth, y:cHeight/2, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false},
        {id:"RB", pos:"R", x:cWidth, y:cHeight*(3/4), addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false}
    ];
    
    settingUp();
    
}

function settingUp(){    
    cannonList = setUpCannonList(cannonTypeList);

    /*
    bgCannonList = [
        {id:"T", x:cWidth/2, y:0, angle:180 }
        ,{id:"B", x:cWidth/2, y:cHeight, angle:0 }
        ,{id:"L", x:0, y:cHeight/2, angle:90 }
        ,{id:"R", x:cWidth, y:cHeight/2, angle:-90 }

    ];
    */

    bgCannonList = [
        {id:"T", x:cWidth/2, y:cHeight, angle:180 }
        ,{id:"B", x:cWidth/2, y:0, angle:0 }
        ,{id:"L", x:0, y:cHeight/2, angle:90 }
        ,{id:"R", x:cWidth, y:cHeight/2, angle:-90 }

    ];

    loadingAssets();
}
        

function setupJoinRequest(data){
    //console.log("++++ SETUP AFTER JOIN REQUEST");
    var _joinCannon = getCannonIndex(data.position);
    
    if(_joinCannon !== null){
        this.cannonList[_joinCannon].active = true;
        setSelectedCannon(_joinCannon);
        setCommonButton();
    }
    score = data.score;
    coin = data.coin;
    
    //console.log("-- Selected cannon: "+_joinCannon+" of "+data.position);
}

function updateCannonList(data){
    cannonList = setUpCannonList(data);
    createBGCannon();
}

function getCannonIndex(cannonId){
    var _list = this.cannonList;
    for(var i=0; i < _list.length; i++){
        var _item = _list[i];
        if(_item.id == cannonId){
            return i;
        }
    }
    
    return null;
}

function setUpCannonList(list){
    //console.log("---- SETUP CANNON LIST");
    var _result = [];
    for(var i=0; i < list.length; i++){
        var _temp = {};
        var _item = list[i];
        var _type = _item.id;
        var _active = _item.player;
        var _searchItem = getCannonItem(_type);
        
       // console.log(_type+" - "+_searchItem.addRot);
        if(_searchItem !== null){
            _temp = _searchItem;
            if(_active !== null){
                _temp.active = true;
            }else{
                _temp.active = false;
            }
            _result.push(_temp);
        }
    }
    
    return _result;
}

function getCannonItem(type){
    var result = null;
    for(var i=0; i < cannonListRep.length; i++){
        var _item = cannonListRep[i];
        var _type = _item.id;
        if(_type == type){
            //{id:"BL", pos:"B", x:cWidth/4, y:cHeight, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false},
            result = {};
            result.id = _item.id;
            result.pos = _item.ipos;
            result.x = _item.x;
            result.y = _item.y;
            result.addRot = _item.addRot;
            result.ori = _item.ori;
            result.cannonX = _item.cannonX;
            result.cannonY = _item.cannonY;
            result.active = _item.active;
            result.pos = _item.pos;
            break;
        }
    }
    return result;
}

function showPreloaderMessage(message){
    var _container = document.getElementById('preloader');
    _container.innerHTML = "";
    
    _container.innerHTML="<canvas id='common' style='z-index: 6; position:absolute; left:0px; top:0px;' height='640px' width='1024'></canvas>"
    
    var canvas = document.getElementById('common');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, cWidth, cHeight);
    context.save();
    context.translate(posX+cWidth / 2, cHeight / 2);
    
    context.font = '18pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#FFF';
    context.fillText(message, 0, 0);
    context.fill();
    context.restore;
}

function preloaderUpdate(percentage){
    showPreloaderMessage("Loading assets "+percentage+" %");
}
        
function loadAssetFinish(){
    showCommonCanvas(false);
    setup();
}

function showCommonCanvas(isShow){
    var canvas = document.getElementById('preloader');
    if(isShow){
        canvas.style.display = "initial";
    }else{
        canvas.style.display = "none";
    }
}
        
function loadingAssets(){
    //assets.load(assetlist).then(() => setup() );
    //assets.load(assetlist).then(function() {setup()} );
    console.log("----- loading assets ------");
    //assets.load(assetlist);
    preloadStart(assetlist);
}
        
function setup(){
     //alert('SETUP');
     createBackground();
     createBGCannon();
     createCannon();
     //createScore()
     readyToGo({fish:10, w:cWidth, h:cHeight});
    setMouseClickDetection();
}
        
function createBGCannon(){
    var canv = document.getElementById('bottomcanvas');
    var ctx = canv.getContext('2d');
    ctx.clearRect(0,0,canv.width, canv.height)
    var _image = assets['bottom'];
    
    var i;
    for(i=0;i<cannonList.length;i++){
        ctx.save();
        var tweakX = 0;
        var tweakY = 0;
        var prop = cannonList[i];
        
        //console.log("--- "+prop.id);
        if(prop.active){
            if(prop.pos == "L"){
                tweakX = _image.height/2;
                //tweakY = -(_image.width/2);
            }else if(prop.pos == "R"){
                tweakX = - _image.height/2;
                //tweakY = -(_image.width/2);
            }else if(prop.pos == "B"){
                tweakX = -(_image.width/2);
                tweakY = -_image.height;
            }else if(prop.pos == "T"){
                tweakY = _image.height/2;
            }

            var xPos = posX + prop.x + tweakX;
            var yPos = prop.y + tweakY;
            //console.log("Y: "+prop.y+"- Tweak: "+tweakY+" => y: "+yPos);
            var rot = getCannonItem(prop.id).addRot;
            
            if(rot == 0){
              ctx.drawImage(_image,xPos,yPos);  
            }else{

                ctx.translate(xPos, yPos);
                ctx.rotate(rot * degreeToRad);
                ctx.translate(-_image.width/2, -_image.height/2);

                ctx.drawImage(_image,0,0);

            }
            ctx.restore();
        }
    }
    
}

function createNotes(listdata){
    var canv = document.getElementById('score_canvas');
    var ctx = canv.getContext('2d');
    ctx.clearRect(0,0,canv.width, canv.height)
    var _image = assets['bottom'];
    
    var i;
    var margin = 20;
    for(var i=0;i<listdata.length;i++){
        
        var tweakX = 0;
        var tweakY = 0;
        var cannon_position = listdata[i].position;
        var prop = cannonList[getCannonIndex(cannon_position)];
        
        
        
        //console.log("--- "+prop.id);
        if(prop.active){
            ctx.save();
            
            if(prop.pos == "L"){
                tweakX = margin;
                tweakY = _image.width - margin;
            }else if(prop.pos == "R"){
                tweakX = - margin;
                tweakY = - (_image.width - margin);
            }else if(prop.pos == "B"){
                tweakX = _image.width/2 + (4*margin);
                tweakY = -_image.height/2;
            }else if(prop.pos == "T"){
                tweakX = - (_image.width/2 + (4*margin));
                tweakY = margin;
            }

            var xPos = posX + prop.x + tweakX;
            var yPos = prop.y + tweakY;
            
            var rot = getCannonItem(prop.id).addRot;
            //if(rot !== 0){
                ctx.translate(xPos, yPos);
                ctx.rotate(rot * degreeToRad);
                ctx.translate(-_image.width/2, -_image.height/2);
            //}
            
            var message = listdata[i].id;
            message += "\n";
            message += "Score: "+listdata[i].score;
            message += "\n ";
            message += "Coin: "+listdata[i].coin;
            
            
            
            ctx.font = '14pt Calibri';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#FFF';
            
            var lineheight = 16;
            var lines = message.split('\n');
            
            for(var j=0; j<lines.length; j++){
                ctx.fillText(lines[j], 0, j*lineheight);
            }
            ctx.fill();
            
            ctx.restore();
        }
    }
    
}

function setSelectedCannon(cannonid){
    //console.log(cannonid);
    selectedCannon = cannonid;
}

function setCommonButton(){
    //console.log("--- set common button ---");
    var canv = document.getElementById('common_button_canvas');
    var ctx = canv.getContext('2d');
    ctx.clearRect(0,0,canv.width, canv.height);
    
    var _image = assets['bottom'];
    
    var _image_plus = assets['icon_plus'];
    var _image_min = assets['icon_min'];
    
    
    var _tempCannon = assets['cannon1'];
    var _cannonH = _tempCannon.height/5;
    var _cannonW = _tempCannon.width;
    
    var i;
    
    var tweakX = 0;
    var tweakY = 0;
    
    var tweakXPlus = 0;
    var tweakXMin = 0;
    
    var tweakYPlus = 0;
    var tweakYMin = 0;
        
    var prop = cannonList[selectedCannon];
    //console.log("prop["+selectedCannon+"] active: "+prop.active+" -- pos: "+prop.pos);
        
    var fineTune = 20;
    //console.log("--- "+prop.id);
    if(prop.active){
        if(prop.pos == "L"){
            tweakX = _image.height/2;
            tweakYPlus = -(_image_plus.height + fineTune);
            tweakYMin =  _cannonW/2 + fineTune;
        }else if(prop.pos == "R"){
            tweakX = - _image.height/2;
            tweakYPlus = -(_image_plus.height + fineTune);
            tweakYMin =  _cannonW/2 + fineTune;
        }else if(prop.pos == "B"){
            tweakX = -(_image.width/2);
            tweakY = -_image.height;
            tweakXMin = (_image.width/2 - (_cannonW/2) - (2*fineTune));
            tweakXPlus =  _image.width/2 + (2*fineTune);
        }else if(prop.pos == "T"){
            tweakXPlus = -((_cannonW/2) + fineTune);
            tweakXMin =  _cannonW/2 + fineTune;
            
            tweakYPlus = _image_plus.height/2 + fineTune;
            tweakYMin = _image_plus.height/2 + fineTune;
        }

        var xPos = posX + prop.x + tweakX;
        var yPos = prop.y + tweakY;
                        
            
        var xPosPlus = xPos + tweakXPlus;
        var xPosMin = xPos + tweakXMin;
        
        var yPosPlus = yPos + tweakYPlus;
        var yPosMin = yPos + tweakYMin;
        
        var rot = getCannonItem(prop.id).addRot;
        var _xRefPlus = xPosPlus;
        var _xRefMin = xPosMin;
            
        var _yRefPlus = yPosPlus;
        var _yRefMin = yPosMin;
        
        if(rot == 0){
            ctx.save();
            ctx.drawImage(_image_plus,xPosPlus,yPosPlus);  
            ctx.drawImage(_image_min,xPosMin,yPosMin);  
            ctx.restore();
        }else{
            ctx.save();
            ctx.translate(xPosPlus, yPosPlus);
            ctx.rotate(rot * degreeToRad);
            
            ctx.translate(-_image_plus.width/2, -_image_plus.height/2);
            ctx.drawImage(_image_plus,0,0);
            
            ctx.restore();
                
            ctx.save();                
            ctx.translate(xPosMin, yPosMin);
            ctx.rotate(prop.addRot * degreeToRad);
                
            ctx.translate(-_image_min.width/2, -_image_min.height/2);
            ctx.drawImage(_image_min,0,0);
            ctx.restore();
            
            _xRefPlus -= _image_plus.width/2;
            _yRefPlus -= _image_plus.height/2;
            
            _xRefMin -= _image_min.width/2;
            _yRefMin -= _image_min.height/2;
            
                
        }
        
        commonButton.push({name:"plus", x:_xRefPlus, y:_yRefPlus, w:_image_plus.width, h:_image_plus.height});
        commonButton.push({name:"min", x:_xRefMin, y:_yRefMin, w:_image_min.width, h:_image_min.height});
            
    }
    
    // OTHER BUTTON
    var _commonButtonList = [
        {obj:assets['bttn_auto_shot'], name:"auto_shot", pos:"L"},
        {obj:assets['bttn_auto_target'], name:"auto_target", pos:"L"},
        {obj:assets['bttn_leave'], name:"leave", pos:"R"},
        {obj:assets['bttn_standout'], name:"standout", pos:"R"}
        
    ]
    
    
    var startX = posX + fineTune/2;
    var startY = posY + fineTune/2;
    
    ctx.save();
    
    var LCounter = 0;
    var RCounter = 1;
    
    for(i=0; i<_commonButtonList.length;i++){
        var _theCommonImage =_commonButtonList[i].obj; 
        var _thePosition = _commonButtonList[i].pos;
        
        if(_thePosition == "L"){
            startX = posX + (LCounter*(_theCommonImage.width + fineTune/2));
            LCounter++;
        }else if(_thePosition == "R"){
            startX = posX + cWidth - (RCounter* (_theCommonImage.width + fineTune/2));
            RCounter++;
        }
        
        ctx.drawImage(_theCommonImage,startX,startY);     
        commonButton.push({name:_commonButtonList[i].name, x:startX, y:startY, w:_theCommonImage.width, h:_theCommonImage.height});
        
        //startY += _theCommonImage.height;
        //startX += _theCommonImage.width + fineTune/2;
    }
    
    ctx.restore();
    
    //setCommonButtonClickDetection();
}

function removeCommonButton(){
    var canv = document.getElementById('common_button_canvas');
    var ctx = canv.getContext('2d');
    ctx.clearRect(0,0,canv.width, canv.height);
    canv.removeEventListener('click',false);
}

function createCannon(){
    //console.log('++++ CREATE CANNON')
    bttnJoins = [];
    
    var canv = document.getElementById('cannoncanvas');
    var ctx = canv.getContext('2d');
   // ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
    ctx.clearRect(0,0,canv.width, canv.height)
    var _image;// = assets['cannon1'];
    var segment;// = _image.height/5;
    
    var i;
    for(i=0;i<cannonList.length;i++){
        var prop = cannonList[i];

        if(!prop.active){
            _image = assets['icon_click'];
            segment = _image.width;
            
            var rot = getCannonItem(prop.id).addRot;
            prop.addRot = rot;
        }else{
            
            //_image = assets['cannon'+(i+1)];
            _image = assets['cannon'+(prop.bulletType+3)];
            segment = _image.height/noOfSlide;
            //((prop.bulletType + 1)*
        }
        
        
        var tweakX;
        var tweakY = 0;
        if(prop.ori == "vertical"){
            tweakX = 0;
        }else{
            tweakX = - _image.width;
        }
        
        if(prop.id == "BL" || prop.id == "BR"){
            tweakY = segment/2 - 15;
        }
        
        prop.cannonX = posX + prop.x;
        prop.cannonY = prop.y;// - tweakY;
        
        ctx.save();
        ctx.translate(prop.cannonX, prop.cannonY);
        ctx.rotate(prop.addRot * degreeToRad);
        ctx.translate(-_image.width/2, -segment);
        
        if(!prop.active){
            if(selectedCannon == null){
                ctx.drawImage(
                    _image,
                    0,
                    0
                );
                
                tweakX = 0;
                tweakY = 0;
                if(prop.pos == "L"){
                    tweakY = -_image.height/2;
                }else if(prop.pos == "R"){
                    tweakX = - _image.width;
                    tweakY = -_image.height/2;
                }else if(prop.pos == "B"){
                    tweakX = -(_image.width/2);
                    tweakY = - 2*_image.height;
                }else if(prop.pos == "T"){
                    tweakX =  - _image.width/2;              
                }

                bttnJoins.push({id:prop.id, x:prop.cannonX+tweakX, y:prop.cannonY+tweakY, w:_image.width, h:_image.height});
            }
        }else{
            ctx.drawImage(
                _image,
                0,
                (prop.bulletType + 1)*segment,
                _image.width,
                segment,
                //cannonX,
                //cannonY,
                0,
                0,
                _image.width,
               segment
            );
        }
        ctx.restore();

    }
    
    //cannonX = posX + (cWidth/2) + (_image.width/2) + 10;
    //cannonY = cHeight;
   //setMouseClickDetection();
}
        
function createBackground(){
    //console.log("Inner W: "+window.innerWidth+" H: "+window.innerHeight);
    var bgCanvas = document.getElementById('bgcanvas');// document.createElement('canvas');
    bgCanvas.style.backgroundColor = "black";
            
            
    var ratioW = window.innerWidth/1024;
    var ratioH = window.innerHeight/768;
    var ratio;
            
    if(ratioW >= ratioH){
        ratio = ratioW;
    }else{
        ratio = ratioH;
    }
        
    ratio = 1;
    
    var _w = cWidth;
    var _h = cHeight;
    
    if(window.innerWidth > cWidth){
        _w = window.innerWidth;
    }
    
    
    if(window.innerHeight > cHeight){
        _h = window.innerHeight;
    }
    
    console.log("_W: "+_w+" _H: "+_h);
    
    bgCanvas.width = _w;// window.innerWidth;
    bgCanvas.height = _h;//window.innerHeight;
            
    var _image = assets['mainbg'];
    var ctx = bgCanvas.getContext('2d');
    //ctx.translate(posX, posY);
    //ctx.drawImage(_image, posX,posY);
    
    
    var _iWidth = _image.width;
    var _iHeight = _image.height;
    
    
    ctx.drawImage(
        _image,
        0,
        0,
        _iWidth,
        _iHeight,
        posX,
        posY,
        cWidth,
        cHeight
    );
    
    // setup game canvas
    var gameCanvas = document.getElementById('gamecanvas');
            
    gameCanvas.width = cWidth + posX;//1024+posX;//cWidth;
    gameCanvas.height = cHeight;
            
   // gameCanvas.style.backgroundColor = "yellow";
    
    ctx = gameCanvas.getContext('2d');
    //ctx.translate(posX, posY);
    ctx.rect(posX,posY,cWidth,cHeight);
    ctx.clip();
            
            
    var bottomCanvas = document.getElementById('bottomcanvas');
     
    //bottomCanvas.width = 1024 + posX;
    //bottomCanvas.height = cHeight;
    bottomCanvas.width = _w;//window.innerWidth;// 1024 + posX;
    bottomCanvas.height = _h;//window.innerHeight;// cHeight;
    
    var cannonCanvas = document.getElementById('cannoncanvas');
    cannonCanvas.width = _w;// window.innerWidth;// 1024 + posX;
    cannonCanvas.height = _h;// window.innerHeight;// cHeight;
            
    var bulletCanvas = document.getElementById('bulletcanvas');
    bulletCanvas.width = _w;// window.innerWidth;// 1024 + posX;
    bulletCanvas.height = _h;// window.innerHeight;// cHeight;
            
    
    var commonbuttonCanvas = document.getElementById('common_button_canvas');
    commonbuttonCanvas.width = _w;// window.innerWidth;// 1024 + posX;
    commonbuttonCanvas.height = _h;// window.innerHeight;// cHeight;
    
    var scoreCanvas = document.getElementById('score_canvas');
    scoreCanvas.width = _w;// window.innerWidth;// 1024 + posX;
    scoreCanvas.height = _h;// window.innerHeight;// cHeight;
    
    return;
}

/*
function setCommonButtonClickDetection(){
     var gCanvas = document.getElementById('common_button_canvas');
    //gCanvas.addEventListener('click', initiateBullet, false);
    gCanvas.addEventListener('click', function(event){
        //console.log("CLICK");
        var x = event.pageX = posX;
        var y = event.pageY;
        
        checkCommonCollideButton(event);
    }, false);
    return;
}
*/

function checkCommonCollideButton(ev){
    
    var gCanvas = document.getElementById('common_button_canvas');
    var type = "";
    //var rect = gCanvas.getBoundingClientRect();
    //var x = ev.clientX - rect.left;
     //var y = ev.clientY - rect.top;
     var x = ev.clientX - gCanvas.offsetLeft;// - posX;
     var y = ev.clientY - gCanvas.offsetTop;
    for(var i=0; i < commonButton.length; i++){
        var _bttn = commonButton[i];
        var l = _bttn.x;
        var r = _bttn.x + _bttn.w;
        var t = _bttn.y;
        var b = _bttn.y + _bttn.h;
        
        if(x > l && x < r && y > t && y < b){
            // hit
           
            type = _bttn.name;
            // console.log("Common button HIT -- "+type);
            break;
        }
    }
    
    //console.log("-- Check common button of type "+type);
    
    switch(type){
        case "plus":
            changeBulletType(1);
            break;
            
        case "min":
            changeBulletType(-1);
            break;
            
        case "auto_shot":
            break;
            
        case "auto_target":
            break;
            
        case "standout":
            //generatePopup("standout");
            openPopup("standout");
            break;
            
        case "leave":
            //generatePopup("signout");
            openPopup("signout");
            break;
    }
    
    if(type !== ""){
        return true;
    }
    
    return false;
}

//clientdata.roomid, cliendata.id

function setMouseClickDetection(){
    //console.log("---- set mouse detection");
    var gCanvas = document.getElementById('cannoncanvas');
    var isJoinButton = false;
    var isCommonButton = false;
    //gCanvas.addEventListener('click', initiateBullet, false);
    gCanvas.addEventListener('click', function(event){
        //console.log("CLICK");
        isJoinButton = checkCollideButton(event);
        isCommonButton = checkCommonCollideButton(event);
        if(!isJoinButton && !isCommonButton){
            if(selectedCannon !== null){
                initiateBullet(event);
            }
        }
        
    }, false);
    return;
}

function checkCollideButton(ev){
    var gCanvas = document.getElementById('cannoncanvas');
    //var rect = gCanvas.getBoundingClientRect();
    //var x = ev.clientX - rect.left;
     //var y = ev.clientY - rect.top;
     var x = ev.clientX - gCanvas.offsetLeft;// - posX;
     var y = ev.clientY - gCanvas.offsetTop;
    for(var i=0; i < bttnJoins.length; i++){
        var _bttn = bttnJoins[i];
        var l = _bttn.x;
        var r = _bttn.x + _bttn.w;
        var t = _bttn.y;// - _bttn.h/2;
        var b = _bttn.y + _bttn.h;
        
        if(x > l && x < r && y > t && y < b){
            // hit
            //console.log("JOIN HIT -- "+_bttn.id);
            posToJoin = _bttn.id;
            //generatePopup("buy");
            openPopup("join_room");
            return true;
            //break;
        }
    }
    
    return false;
}

// POP UP FOR BUY/CHECKIN

function generatePopup(whichOne){
    if(!isIdleOnPopUp){
        console.log("--- GENERATE POPUP "+whichOne);
        var _popup = "";
        var isBG = true;
        switch(whichOne){
            case "buy":
                _popup = buy_str;            
                break;

            case "standout":
                _popup = standout_str;
                break;

            case "signout":
                _popup = signout_str;
                break;

            case "no_coin":
                _popup = notification_no_coin_str;
                break;
            case "not_enough_coin":
                _popup = notification_no_enough_coin;
                break;
            case "no_available_coin":
                _popup = notification_coin_not_available;
                break;
            case "loader":
                _popup = loading_str;
                //_popup = notification_wait;
                break;
        }

        if(isBG){
            $('#popup').addClass("popup_background");
        }else{
            $('#popup').removeClass("popup_background");
        }
        $('#popup').html(_popup);

        switch(whichOne){
            case "buy":
            case "not_enough_coin":
               $("#range_slider").attr({
                    "min" : minBuy,
                    "max" : maxBuy
                });

                $("#notes").html("<h2>Buy from "+minBuy+" - "+maxBuy+" coins</h2>");

                showBuyValue(minBuy);          
                break;
        }

        initiateButtonPopUp(whichOne);
    }
    return;
}
    
function showBuyValue(value){
    $("#mssg").html("<h2><B>Buy: "+value+" coins </B></h2>");
}

function initiateButtonPopUp(whichOne){
    switch(whichOne){
        case "buy":
               $("#buy_submit").click(function(){
                   var data = {};
                   data.playerid = playerid;
                   data.roomid = roomname;
                   data.position = posToJoin;
                   data.score = 0;
                   data.coin = $('#range_slider').val();

                   //console.log("Buy for "+data.coin);
                   sendJoinRequest(data);
                   closePopup();

               });
               break;

             case "standout":

                $("#confirmation_ok").click(function(){
                    /*
                    var data = {};
                    data.playerid = playerid;
                    data.id = playerSId;
                    data.roomid = roomname;
                    data.position = posToJoin;
                    data.score = score;
                    data.coin = coin;
                    
                    standout(data);
                    */
                    setStandout();
                    //closePopup();

                });

                $("#confirmation_cancel").click(function(){
                    closePopup();

                });
                break; 

            case "signout":

                $("#confirmation_ok").click(function(){
                    /*
                    var data = {};
                    data.playerid = playerid;
                    data.socketid = playerSId;
                    data.roomid = roomname;
                    data.position = posToJoin;
                    data.score = score;
                    data.coin = coin;

                    signout(data);
                    */
                    setSignout();
                    //closePopup();

                });

                $("#confirmation_cancel").click(function(){
                    closePopup();

                });
                break; 

            case "not_enough_coin":

                $("#confirmation_ok").click(function(){
                    console.log("--- click ok no coin");
                    var data = {};
                    data.playerid = playerid;
                    data.socketid = playerSId;
                    data.roomid = roomname;
                    data.position = posToJoin;
                    data.score = score;
                    //data.coin = coin;
                    data.coin = $('#range_slider').val();
                    
                    showProcessPreloader();
                    topup(data);
                    //closePopup();

                });

                $("#confirmation_cancel").click(function(){
                    /*var data = {};
                    data.playerid = playerid;
                    data.id = playerSId;
                    data.roomid = roomname;
                    data.position = posToJoin;
                    data.score = score;
                    data.coin = coin;
                    
                    standout(data);
                    */
                    setStandout();
                    //closePopup();

                });
                break; 

            case "no_available_coin":

                $("#confirmation_ok").click(function(){
                    closePopup();
                });

                break; 

        }

        $("#popup_close").click(function(){
            closePopup();
        });
    return;
}

function setStandout(){
    var data = {};
    data.playerid = playerid;
    data.id = playerSId;
    data.roomid = roomname;
    data.position = posToJoin;
    data.score = score;
    data.coin = coin;
    
    standout(data);
    closePopup();
}

function setSignout(){
    var data = {};
    data.playerid = playerid;
    data.id = playerSId;
    data.roomid = roomname;
    data.position = posToJoin;
    data.score = score;
    data.coin = coin;
    
    standout(data);
    closePopup();
}


function showCountdown(counter){
    $("#countdown").html("<h2><B>"+counter+" seconds left </B></h2>");
}

function showRunningOfCoinPopup(type){
    if(!isIdleOnPopUp){
        console.log("++++ SHOW RUNNING OF COIN POPUP "+type);
        //generatePopup(type);
        openPopup("not_enough_coin");
    }
}

function showProcessPreloader(){
    console.log("-- SHOW PROCESS PRELOADER");
    //closePopup();
    generatePopup("loader");
    openPopup();
    return;
}

/*
function openPopup(){
    var dn = new cc.DrawNode();
    popupLayer.addChild(dn);
    dn.drawRect(cc.p(0,0), cc.p(screen_width,screen_height), cc.color(0,0,0,200), 0, cc.color(0,255,0,255));


    var _src = asset_folder+getSource("popupbg");
    var target = new cc.Sprite(_src);
    target.setPosition(screen_width/2, screen_height/2);

    popupLayer.addChild(target);
    //popupLayer.setVisible(true);
    //var _popup = "#popup";
    //$(_popup).popup('show');
    //isIdleOnPopUp = true;
}
*/
function closePopup(){
    removeLayerChild(popupLayer);
    popupLayer.setVisible(false);
    console.log("===== CLOSE POPUP");
    //var _popup = "#popup";
    //$(_popup).popup('hide');
    //isIdleOnPopUp = false;
}