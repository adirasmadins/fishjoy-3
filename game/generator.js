var fishObj = require("./fish");
var bulletObj = require("./bullet");
var Global = require('../globals');
var util = require("util");
var EventEmitter = require("events").EventEmitter;

var birthTimeout;
var levelTimer;
var i;
var isIdle = false;

var gameEngineTimeInterval = null;

var resetDuration = Global.resetDuration*Global.minute; 
var margin = 40;

var maxFishIndex = 1000;

var minFishNo = 10;

var updateDuration = (1/Global.fps)*1000;


// constructor
function Generator(totalfish, w, h, cannonlist, roomname)
{
    //console.log("NEW GENERATOR of "+roomname);
    EventEmitter.call(this);
    //util.inherits(Generator, EventEmitter);

    this.roomid = roomname;
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

    this.bulkProduceFish(totalfish, false);
    this.setScheduledUpdate();

    //this.startBirthControl();
    //this.startLevelTimer();
    //this.testDispatch();
  return;
}

util.inherits(Generator, EventEmitter);

Generator.prototype.update = function () {
    this.cleanScheduledUpdate();
    var i;
    for(i=0; i < this.fishes.length; i++){
        this.fishes[i].update();
    }

    for(i=0; i < this.bullets.length; i++){
        this.bullets[i].update();
    }

    if(this.fishes.length < minFishNo){
        console.log("--- Bottom quota");
        this.bulkProduceFish(10, true);
    }
    this.setScheduledUpdate();
    return;
}

Generator.prototype.setScheduledUpdate = function () {
    this.scheduledUpdate = setTimeout(this.update.bind(this), updateDuration);
    return;
}

Generator.prototype.cleanScheduledUpdate = function () {
    if(this.scheduledUpdate){
        clearTimeout(this.scheduledUpdate);
    }
}

Generator.prototype.bulkProduceFish = function(totalfish, isBroadcast){
    for(var i=0; i<totalfish;i++){
        var thefish = this.makeFish(isBroadcast);
        this.fishes.push(thefish);
    }
}

Generator.prototype.regenerateFish = function () {
    var thefish = this.makeFish(true);
    this.fishes.push(thefish);

    //this.bulkProduceFish(3, true);

    /*thefish.on("angle_change", function (data) {
     console.log("2. --- GENERATOR EMIT");
     var _data = data;
     _data.roomname = this.roomid;
     this.emit("angle_change", _data);
     });
     */

}

Generator.prototype.removeFishFromList = function(obj){
    var i = this.fishes.length - 1;
    while(i>0){
        var _fish = this.fishes[i];
        if(_fish == obj){
            this.dispatchMessage("remove_fish", {name:_fish.getName()});
            this.fishes.splice(i,1);
            break;
        }
        i--;
    }
}

Generator.prototype.removeBulletByNameFromList = function(name){
    var i = this.bullets.length - 1;
    while(i>0){
        var _bullet = this.bullets[i];
        if(_bullet.getName() == name){
            this.dispatchMessage("remove_bullet", {name:name});
            this.bullets.splice(i,1);
            break;
        }
        i--;
    }
}

Generator.prototype.removeBulletFromList = function(obj){
    var i = this.bullets.length - 1;
    while(i>0){
        var _bullet = this.bullets[i];
        if(_bullet == obj){
            this.dispatchMessage("remove_bullet", {name:_bullet.getName()});
            this.bullets.splice(i,1);
            break;
        }
        i--;
    }
}




Generator.prototype.makeFish = function(isBroadcast){
    //random fish type
    var isBroadcast = isBroadcast;
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

    //console.log("1. fish name "+fName);

    var type = Global.fishTypeList[randId];
    var typename = type.id;
    var typesize = type.size;
    //var totalFrame = type.totalFrame;
    //var totalFrameActive = type.totalActiveFrame;
    var score = type.score;
    var life = type.life;
    var speed = type.speed;

    var fish = new fishObj(typename, randomX, randomY, speed, typesize, score, life, fName, type.w, type.h, flip, this.w, this.h);
    var that = this;
    fish.on("angle_change", function (data) {
        that.dispatchMessage("angle_change", data);
        //that.emit("angle_change", _data);
    });

    fish.on("new_fish", function (thefish) {
        that.removeFishFromList(thefish);
        that.regenerateFish();
        //that.emit("angle_change", _data);
    });

    if(isBroadcast){
        var obj = {};
        obj.type = fish.type;
        obj.name = fish.name;
        obj.x = fish.x;
        obj.y = fish.y;
        obj.angle = fish.angle;
        //obj.rot = theItem.rotation;
        obj.active = fish.active;
        obj.captured = fish.captured;
        obj.frame = fish.frame;
        obj.totalFrame = fish.totalFrame;
        obj.isFlip = fish.isFlip;
        obj.speed = fish.speed;
        this.dispatchMessage("new_fish", obj);
    }

    return fish;
}

Generator.prototype.dispatchMessage = function (keyword, data) {
    var _data = data;
    _data.roomid = this.roomid;
    this.emit(keyword, _data);
}

Generator.prototype.getUpdate = function(){
    var result = [];
    result = this.getFishes();//.concat(this.getBullet());
    return result;
}

Generator.prototype.getBullet = function(){
    var result = [];
    var _total  = this.bullets.length;
    for(var i=0; i< _total; i++){
        var theItem = this.bullets[i];
        //var theItem = item.bullet;//.getBullet();
        //x:this.x, y:this.y, active:this.active, angle:this.angle, frame:this.frame, hit:this.hit, id:this.id, cannonid:this.cannonid, roomid:this.roomid, score:this.score, speed:this.clientSpeed
        
        var obj = {};
        //obj.item = theItem;
        //obj.type = "bullet";
        obj.name = theItem.name;
        obj.x = theItem.x;
        obj.y = theItem.y;
        obj.angle = theItem.angle;
        obj.active = theItem.active;
        obj.hit = theItem.hit;
        //obj.frame = theItem.frame;
        //obj.totalFrame = theItem.totalFrame;
        //obj.totalActiveFrame = theItem.totalActiveFrame;
        //obj.cannonid = theItem.cannonid;
        //obj.userid = theItem.id;
        obj.score = theItem.getScore();
        obj.pickUpScore = theItem.getPickUpScore();
        obj.size = theItem.getType();
        obj.isflip = theItem.getIsFlip();
        //obj.fishX = theItem.fishX;
        //obj.fishY = theItem.fishY;
        //obj.fishW = theItem.fishW;
        //obj.fishH = theItem.fishH;
        obj.speed = theItem.getSpeed();
        obj.accelerate = theItem.accelerate;
        obj.speedX = theItem.getSpeedX();
        obj.speedY = theItem.getSpeedY();

        result.push(obj);
    }
    return result;
}

Generator.prototype.setBulletPickupScore = function(bullet, status){
    bullet.setPickUpScore(status);
}

Generator.prototype.getFishes = function(){

    var result = [];
    var _total = this.fishes.length;
    for(i=0; i< _total; i++){
        var item = this.fishes[i];
        var theItem = item.getFish();
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


Generator.prototype.getFishByName = function (name) {
    var _total = this.fishes.length;
    for(i=0; i< _total; i++){
        var item = this.fishes[i];
        var theItem = item.getFish();
        if(theItem.name == name){
            return theItem
        }
    }
    return null;
}


Generator.prototype.newbullet = function(data, socketid){
    console.log("***** CREATE BULLET "+(this.bullets.length+1)+" X0, y0: "+data.x+" , "+data.y+" rot: "+data.angle+" , size: "+data.size);
    if(!isIdle){
        var _speed = Global.bulletSpeed;
        var _acc = Global.bulletAcc;
        //orix, oriy, angle, socketid, roomid, type, speed, acc, name, sWidth, sHeight, size
        var bullet = new bulletObj(data.x, data.y, data.angle, socketid, data.roomname, data.size, _speed, _acc, data.name, this.w, this.h, data.size);
        this.bullets.push(bullet);

        var that = this;
        bullet.on("remove_bullet", function (thebullet) {
            that.removeBulletFromList(thebullet);
            //that.emit("angle_change", _data);
        })
    }
    return bullet;
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


Generator.prototype.getCannon = function(cannonId){
    var i;
    for(i=0; i < this.cannon.length;i++){
        var cCannon = this.cannon[i];
        if(cCannon.id == cannonId){
            return cCannon;
        }
    }
    return null;
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
    console.log("----- GENERATOR DESTROY");
    this.cleanScheduledUpdate();
    //this.clearBirthControl();
    //this.stopLevelTimer();
    for(var i=0; i < this.fishes.length; i++){
        //this.fishes[i].removeListener("angle_change");
        // this.fishes[i].removeListener("new_fish");
        this.fishes[i].destroy();
        this.fishes[i] = null;
    }
    this.fishes = [];
    this.bullets = [];
}

module.exports = Generator;
