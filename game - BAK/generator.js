var fishObj = require("./fish");
var bulletObj = require("./bullet");
var Global = require('../globals');
//var util = require("util");
//var EventEmitter = require("events").EventEmitter;

var birthTimeout;
var levelTimer;
var i;
var isIdle = false;

var gameEngineTimeInterval = null;

var resetDuration = Global.resetDuration*Global.minute; 
var margin = 40;

var maxFishIndex = 1000;


// constructor
function Generator(totalfish, w, h, cannonlist)
{
    //console.log("NEW GENERATOR");
    //EventEmitter.call(this);
    //util.inherits(Generator, EventEmitter);

    this.totalFishType = Global.fishTypeList.length;
    this.minY = 0;
    this.maxY = h;
    this.minX = 0;
    this.maxX = w;
    this.totalfish = totalfish;
    this.w = w; // screen width
    this.h = h; // screen height
    this.resetClip = [];
    this.fishes = [];
    this.bullets = [];
    this.player = [];
    this.cannon = cannonlist;
    this.fishindex = 0;

    var i;
    
    this.bulkProduceFish(totalfish);
    
    //this.startBirthControl();
    //this.startLevelTimer();
    //this.testDispatch();
  return;
}

//util.inherits(Generator, EventEmitter);

Generator.prototype.getRawFishes = function(){
    return this.fishes;
}

Generator.prototype.testDispatch = function(){
    console.log("--- Dispatch event from inside generator");
    //this.emit("dispatch_test", "From Generator");
}

Generator.prototype.startGameEngine = function(){
    var context = this;
    
    gameEngineTimeInterval = setTimeout(function(){
        context.update();    
    }, Global.gDuration);
}

Generator.prototype.startLevelTimer = function(){
    var context = this;
    levelTimer = setInterval(function(){
        context.reset();
    },resetDuration*1000);
    return;
}

Generator.prototype.reset = function(){
    console.log("---- RESET");
    isIdle = true;
    this.fishes = [];
    this.bullets = [];
    this.setIdle();
    this.clearBirthControl();
    this.stopLevelTimer();

    //this.bulkProduceFish(this.totalfish);
}

Generator.prototype.setIdle = function(){
    var context = this;
    setTimeout(function(){
        context.createNewLevel();    
    }, Global.idleDuration*1000);

    return;
}

Generator.prototype.createNewLevel = function(){
    this.bulkProduceFish(this.totalfish);
    
    this.startBirthControl();
    this.startLevelTimer();
    isIdle = false;
}


Generator.prototype.stopLevelTimer = function(){
    if(levelTimer){
        clearInterval(levelTimer);
        levelTimer = null;
    }   
}
               
Generator.prototype.startBirthControl = function(){
    this.clearBirthControl();
    var min = 20;
    var max = 40;
    
    var randControlTimer = Math.floor((Math.random()*(max-min)))+min;
   // console.log("~~~~~~ INIT BIRTH CONTROL "+randControlTimer);
    
    var context = this;
    
    birthTimeout = setTimeout(function(){
        context.produceNewFish()
    }, randControlTimer*1000);
    return;
}

Generator.prototype.clearBirthControl = function(){
    if(birthTimeout){
        clearTimeout(birthTimeout);
    }
    return;
}

Generator.prototype.produceNewFish = function(){
    this.clearBirthControl();
    var min = 1;
    var max = 3;
    var totalFish = Math.floor((Math.random()*(max-min)))+min;
   // console.log('***** PRODUCE NEW FISH '+totalFish)
    
    this.bulkProduceFish(totalFish);
    this.startBirthControl();
    return;
}

Generator.prototype.bulkProduceFish = function(totalFish){
    for(i=0; i<totalFish;i++){
        this.fishes.push({fish:this.makeFish()});
    }
    return;
}

Generator.prototype.regenerate = function(){
    this.fishes.push({fish:this.makeFish()});
}

Generator.prototype.makeFish = function(){
    //random fish type
    var area_margin = 100;
	var minX = 50;
    var maxX = 600;
    var minY = 50;
    var maxY = this.h;

    var randomX = (minX + Math.round(Math.random()*(maxX - minX)));
    var randomY = minY + Math.round(Math.random()*(maxY - minY));

    var randomDir = Math.round(Math.random());
    var flip = false;
    if(randomDir == 1){
        randomX += this.w;
        flip = true;
    }else{
        randomX *= -1;
        randomX -= area_margin;
    }

    var min = 0;
    var max = Global.fishTypeList.length-1;

    var randId = min + Math.round(Math.random()*(max - min));
    var fName = "fish"+this.fishindex;
    this.fishindex ++;
    if(this.fishindex > maxFishIndex){
        this.fishindex = 0;
    }

    var type = Global.fishTypeList[randId];
    var typename = type.id;
    var typesize = type.size;
    //var totalFrame = type.totalFrame;
    //var totalFrameActive = type.totalActiveFrame;
    var score = type.score;
    var life = type.life;
    var speed = type.speed;

    //id, flip, x, y, name, angle

    var fish = new fishObj(typename, randomX, randomY, speed, typesize, score, life, fName, type.w, type.h, flip, this);

    //fish.sizeW = type.w;
    //fish.sizeH = type.h;
    //fish.totalFrame = totalFrame;
    //fish.totalActiveFrame = totalFrameActive;
    fish.moving = true;
    fish.captured = false;
    //fish.isFlip = flip;
    //fish.changeDirection(degree);

    //this.fishes.push(fish);


    /*
	var chance = Math.random() * len >> 0;
	var index = Math.random() * chance + 1 >> 0;
	var type = Global.fishTypeList[index];
    var typename = type.id;
    var typesize = type.size;
    var totalFrame = type.totalFrame;
    var totalFrameActive = type.totalActiveFrame;
    var score = type.score;
    var life = type.life;

    var name = "fish"+this.index;
    this.index ++;
	
    var typeWidth = type.size;

	var randomx = Math.round(Math.random());// Math.random() > 0.5 ? -typeWidth : this.w + typeWidth;
	var randomy = Math.random()*(this.maxY - this.minY) + this.minY;//Math.random()* 200 + (this.h >> 1) - 100 >> 0;

	var speed = Global.fishTypeList[randId].speed;// type.speed;//Math.random()*(Global.maxSpeed - Global.minSpeed) +Global.minSpeed;
    var degree = (Math.random() * 20 - 10 >> 0);
    var isflip = false;
	if(randomx > 0){
      degree += 180;
      randomx = this.w + type.w;
      isflip = true;
    }else{
      randomx = - type.w;
    }
     */
    // console.log("&&&& SPEED "+fish.speed)
	//console.log("make fish "+i+" - type of:"+fish.type+" totalframe: "+fish.totalFrame);
    
    return fish;
}

Generator.prototype.convertSpeedToFPS = function(speed){
    var _speed = speed;
    var perframe = (1/Global.fps)*1000; // mSec
    var duration = Global.gDuration;
    
    var factor = perframe/duration;
    return (factor*_speed);    
}

Generator.prototype.getUpdate = function(){
    var result = [];
    result = this.getFishes().concat(this.getBullet());
    return result;
}

Generator.prototype.getCannon = function(){
    var i;
    for(i=0; i < this.cannon.length; i++){
        //console.log(this.cannon[i].id+" - "+this.cannon[i].bulletType);
    }
    
    
    return this.cannon;
}




Generator.prototype.getBullet = function(){
    var result = [];
    var _total  = this.bullets.length;
    for(var i=0; i< _total; i++){
        var item = this.bullets[i];
        var theItem = item.bullet;//.getBullet();
        //x:this.x, y:this.y, active:this.active, angle:this.angle, frame:this.frame, hit:this.hit, id:this.id, cannonid:this.cannonid, roomid:this.roomid, score:this.score, speed:this.clientSpeed
        
        var obj = {};
        obj.item = theItem;
        obj.type = "bullet";
        obj.name = item.name;
        obj.x = theItem.x;
        obj.y = theItem.y;
        obj.angle = theItem.angle;
        obj.active = theItem.active;
        obj.hit = theItem.hit;
        obj.frame = theItem.frame;
        obj.totalFrame = theItem.totalFrame;
        obj.totalActiveFrame = theItem.totalActiveFrame;
        obj.cannonid = theItem.cannonid;
        obj.userid = theItem.id;
        obj.score = theItem.getScore();
        obj.pickUpScore = theItem.getPickUpScore();
        obj.bulletType = theItem.getType();
        obj.isflip = theItem.getIsFlip();
        obj.fishX = theItem.fishX;
        obj.fishY = theItem.fishY;
        obj.fishW = theItem.fishW;
        obj.fishH = theItem.fishH;
        obj.speed = theItem.getSpeed();
        obj.accelerate = theItem.accelerate;
        result.push(obj);
    }
    return result;
}

Generator.prototype.setBulletPickupScore = function(bullet, status){
    bullet.setPickUpScore(status);
}

/*
Generator.prototype.setPlayerList = function(data){
    this.player = data;
}

Generator.prototype.getPlayerList = function(){
    return this.player;
}


Generator.prototype.getPlayerById = function(id){
    console.log("--- GET PLAYER BY ID: "+id);
    var _total = this.player.length;
    //console.log("total player: "+_total);
    for(var i=0; i < _total; i++){
        var _player = this.player[i];
        console.log(_player.id+" of "+id);
        if(_player.id == id){
            return _player;
        }
    }
    return null;
}
*/

Generator.prototype.getFishes = function(){
    var result = [];
    var _total = this.fishes.length;
    for(i=0; i< _total; i++){
        var item = this.fishes[i];
        var theItem = item.fish.getFish();
        var obj = {};
        obj.type = theItem.type;
        obj.name = theItem.name;
        obj.x = theItem.x;
        obj.y = theItem.y;
        obj.angle = theItem.angle;
        //obj.rot = theItem.rotation;
        obj.active = theItem.active;
        obj.captured = theItem.captured;
        obj.frame = theItem.frame;
        obj.totalFrame = theItem.totalFrame;
        obj.isFlip = theItem.isFlip;
        obj.speed = theItem.speed;
        //obj.speedX = this.convertSpeedToFPS(theItem.speedX);
        //obj.speedY = this.convertSpeedToFPS(theItem.speedY);
        result.push(theItem);
        //console.log(i+'**** GET FISHES  '+theItem.captured);
    }
    
    return result;
}


Generator.prototype.newbullet = function(data, socketid){
    /*
    type:bullet_type,
              roomname:roomname,
              playerid:playerid,
              socketid:playerSId,
              cannonid:cannonData.id,//selectedCannon,
              finalX:x-posX,
              finalY:y,
              originX:cannonX - posX,
              originY:cannonY,
              angle:finalAngle //radian
    */
    
    //console.log("***** CREATE BULLET "+(this.bullets.length+1)+" X0, y0: "+data.originX+" , "+data.originY+" X1, y1: "+data.finalX+" , "+data.finalY);
    if(!isIdle){
        var _speed = Globals.bulletspeed;
        var _convSpeed = this.convertSpeedToFPS(_speed);
        
        this.bullets.push({bullet:new bulletObj(data.originX, data.originY, data.finalX, data.finalY, data.angle, socketid, data.cannonid, data.roomname, data.type, _speed, _convSpeed)});
    }
}
/*
Generator.prototype.checkCoinAvailable = function(sid, bulletType){
    console.log("--- CHECK COIN AVAILABLE "+sid);
    var _player = this.getPlayerById(sid);
    
    var totalType = coinCostList.length;
    var _coin = coinCostList[totalType - 1];
    
    if(_player != null){
        if(bulletType < totalType){
            _coin = coinCostList[bulletType];
        }

        _player.coin -= _coin;

        if(_player.coin <= 0 ){
            _player.coin = 0;
        }
    }
    
    return true;
}
*/
Generator.prototype.setCannon = function(angle, cannonId, bulletType){
    var i;
    for(i=0; i < this.cannon.length;i++){
        var cCannon = this.cannon[i];
        if(cCannon.id == cannonId){
            cCannon.angle = angle;
            cCannon.bulletType = bulletType;
            break;
        }
    }
    return;
}

Generator.prototype.setIndividualCannon = function(cannonId, bulletType){
    for(var i=0; i < this.cannon.length;i++){
        var cCannon = this.cannon[i];
        if(cCannon.id == cannonId){
            cCannon.bulletType = bulletType;
            break;
        }
    }
    return;
}

Generator.prototype.update = function(){
    if(!isIdle){
        var _totalfish = this.fishes.length;
        var j;
        var i;
        for(i=0; i< _totalfish; i++){
            j = (_totalfish - 1) - i;
            var cfish = this.fishes[j];
            var thefish = cfish.fish;
            if(!thefish.active){
                this.fishes.splice(j,1);
                this.regenerate();
            }else{
                thefish.update();
                if(!thefish.captured){
                     if(this.isOutOfScreen(thefish, "fish")){
                         this.fishes.splice(j,1);
                         this.regenerate();
                     }
                }
            }
        }

        var totalbullet = this.bullets.length;

       // console.log("***************** UPDATE BULLET ******************** "+ this.bullets.length);
        i = 0;

        for(i=0; i < totalbullet; i++){
            j = (totalbullet - 1) - i;
            var cbullet = this.bullets[j];
            var thebullet = cbullet.bullet;
            if(!thebullet.active){
                this.bullets.splice(j,1);
            }else{
                thebullet.update();
                if(!thebullet.hit){               
                    if(this.isOutOfScreen(thebullet, "bullet")){
                        this.bullets.splice(j,1);
                    }else{
                        var _checkHit = this.checkBullet(thebullet);
                        thebullet.setIsHit(_checkHit.isHit);
                        thebullet.setIsScore(_checkHit.isScore);
                        if(_checkHit.isHit){
                            thebullet.setIsFlip(_checkHit.isFlip);
                            thebullet.fishX = _checkHit.fishX;
                            thebullet.fishY = _checkHit.fishY;
                            thebullet.fishW = _checkHit.fishW;
                            thebullet.fishH = _checkHit.fishH;
                        }
                    }
                }else{
                    // hit, have to retrieve which socket id is this
                    
                    /*
                    var playerid = thebullet.playerid;
                    console.log("_____ UPDATE of "+thebullet.playerid);
                    var _player = this.getPlayerById(playerid);
                    if(_player !== null){
                        _player.score += thebullet.score;
                    }
                    */
                }
            }
        }
    }
    
    return;
}

Generator.prototype.isOutOfScreen = function(item, type){
    var tweakX = 0;
    var tweakY = 0;
    
    if(type == "bullet"){
        
    }
    
    
    var t = 0;
    var b = this.h;
    var l = -item.sizeW;
    var r = this.w + item.sizeW;
    
    
    
    if(item.isFlip){
        l -= item.sizeW;
        
    }else{
        //r += item.sizeW;
    }
    
    /*if(item.x < -item.size ||
	   item.x > this.w + item.size ||
       item.y > this.h)
	{*/
    if(item.x < l ||
	   item.x > r ||
       item.y > b || 
       item.y < t)
	{
		return true;
	}/*else if(item.x > 100 && item.x < this.w - 100 && item.y > 100 && item.y < this.h - 100)
	{
        item.canTurning = true;
	}*/
    return false;
}

Generator.prototype.checkBullet = function(item){
    // hitted fish need to have flag active = false & captured = true
    var _totalfish = this.fishes.length;
    var j;
    var i;
    
    //var isHit = false;
    //var isActive = true;
    
    var t = 0 + margin;
    var b = this.h - margin;
    var l = -item.sizeW+margin;
    var r = this.w + item.sizeW-margin;
    
    if(item.x < l ||
	   item.x > r ||
       item.y > b || 
       item.y < t)
	{
        //nothing happens
    }else{
    
        for(i=0; i< _totalfish; i++){
        //for(i=0; i< 10; i++){
             j = (_totalfish - 1) - i;

            var cfish = this.fishes[j];
            var thefish = cfish.fish;
            var fishx = thefish.x;
            var fishH = thefish.sizeH/thefish.totalFrame;
            var fishy = thefish.y - fishH;
            
            var isFlip = thefish.isFlip;

           if(isFlip){
                fishx += 1*thefish.sizeW;
            }else{
                fishx += thefish.sizeW/2;
            }
            
            var addRadius =0;// cannonTypeList[item.type].radius;
            
            var circle1 = {radius: thefish.sizeH, x: fishx, y: fishy};
            var circle2 = {radius: item.sizeH, x: item.x, y: item.y}; // add more radius on this

            var dx = circle1.x - circle2.x;
            var dy = circle1.y - circle2.y;

            var distance = Math.sqrt(dx * dx + dy * dy);
            var radiusCompare = circle1.radius;// + circle2.radius;
            
            if (distance < radiusCompare) {
                // collision detected!
                //console.log("--- CHECK BUMP bullet x: "+circle2.x+" y: "+circle2.y+" fish x: "+circle1.x+" y: "+circle1.y);
                //console.log("--- COLLIDE dx: "+dx+" dy: "+dy+" distance: "+distance+" of "+(circle1.radius + circle2.radius));

                //isHit = true;
                    
                if(!this.checkGoldenTicket(thefish.type)){
                    
                    item.x = thefish.x + (thefish.sizeW/2);
                    item.y = thefish.y - (item.sizeH/2) + ((thefish.sizeH/this.totalFrame));
                    
                    // check life here
                    var _lifeTaken = Global.cannonSizeList[item.type].life;
                    //console.log(_lifeTaken);
                    var _life = thefish.getLife(thefish.setLife(_lifeTaken));
                    if(_life <= 0){
                        item.setScore(thefish.getScore());
                        thefish.captured = true;
                        return {isHit:true, isScore:true, isFlip:isFlip, fishX:fishx, fishY:fishy, fishW:thefish.sizeW, fishH:thefish.sizeH};
                    }else{
                        return {isHit:true, isScore:false, isFlip:isFlip, fishX:fishx, fishY:fishy, fishW:thefish.sizeW, fishH:thefish.sizeH};            
                    }
                }else{
                    return {isHit:true, isScore:false, isFlip:isFlip, fishX:fishx, fishY:fishy, fishW:thefish.sizeW, fishH:thefish.sizeH};  
                }

                //return true;
                //this.regenerate();

            }
        }
    }
    
    return {isHit:false, isScore:false};
}

Generator.prototype.checkGoldenTicket = function(type){
    var i;
    var _totalGoldenType = Global.goldenTicket.length;
    for(i=0; i < _totalGoldenType; i++){
        if(Global.goldenTicket[i].id == type){
            return true;
        }
    }
    
    return false;
}


Generator.prototype.destroy = function(){
    this.clearBirthControl();
    this.stopLevelTimer();
    this.fishes = [];
    this.bullets = [];
}

module.exports = Generator;
