var Global = require('../globals');
var util = require("util");
var EventEmitter = require("events").EventEmitter;

function Bullet(orix, oriy, angle, socketid, roomid, type, speed, acc, name, sWidth, sHeight, size){

    EventEmitter.call(this);

    this.name = name;
    this.oriX = orix;
    this.oriY = oriy;
    //this.destX = finalx;
    //this.destY = finaly;
    this.angle = angle;
    this.frame = 0;
    this.active = true;
    this.hit = false;
    this.isscore = false;
    this.id = socketid;
    this.size = size;
    //this.cannonid = cannonid;
    this.roomid = roomid;
    this.startAnimate = false;
    this.speed = speed;
    this.accelerate = acc;
    this.totalFrame = 4;
    this.width = 24;
    this.height = 26;
    this.screen_width = sWidth;
    this.screen_height = sHeight;

    //this.speedx = this.speed*Math.sin(this.angle);
    //this.speedy = this.speed*Math.cos(this.angle);
    this.hitCounter = 4;
    this.score = 0;
    this.pickUpScore = false;
    this.isflip = false;
    this.type = type;
    this.fishX = null;
    this.fishY = null;
    this.fishW = null;
    this.fishH = null;
    this.active = true;


    this.x = this.oriX;// + this.speedx;
    this.y = this.oriY;// + this.speedy;
    if(this.angle < 0){
        this.dir = -1;
    }else{
        this.dir = 1;
    }

    this.speedX = this.speed * Math.cos(this.angle * Global.DEG_TO_RAD);
    this.speedY = this.speed * Math.sin(this.angle * Global.DEG_TO_RAD);

    this.accelerateX = this.accelerate * Math.cos(this.angle * Global.DEG_TO_RAD);
    this.accelerateY = this.accelerate * Math.sin(this.angle * Global.DEG_TO_RAD);

    console.log("New bullet -- SIZE "+this.size);
    //console.log("NEW BULLET - user socket id: "+this.id+" - cannon id: "+this.cannonid);
}

util.inherits(Bullet, EventEmitter);

Bullet.prototype.update = function(){
    //if(this.active){
        if(!this.hit){
            this.speedX += this.accelerateX;
            this.speedY += this.accelerateY;

            var posX = this.x + this.speedX;
            var posY = this.y + this.speedY;

            if(this.checkBorder(posX, posY)){
                this.x = posX
                this.y = posY;
            }else{
                this.emit("remove_bullet", this);
                this.destroy();
            }
        }else{
            this.emit("remove_bullet", this);
            this.destroy();
            // is hit
            //console.log("hit counter "+this.hitCounter);
            /*
            if(this.isscore){
                this.hitCounter --;
                if(this.hitCounter < 0){
                    this.active = false;
                }
            }else{
                this.active = false;
            }
            */
        }
    //}
    
    return;
}

Bullet.prototype.checkBorder = function(x,y){
    if(x > 0 && x < this.screen_width + this.width && y > 0 && y < this.screen_height){
        return true;
    }

    return false;
}


Bullet.prototype.setIsFlip = function(status){
    this.isflip = status;
}

Bullet.prototype.getIsFlip = function(){
    return this.isflip;
}

Bullet.prototype.setIsScore = function(status){
    this.isscore = status;
}

Bullet.prototype.getIsScore = function(){
    return this.isscore;
}

Bullet.prototype.setActive = function(status){
    this.active = status;
}

Bullet.prototype.getActive = function(){
    return this.active;
}

Bullet.prototype.setIsHit = function(status){
    this.hit = status;
}

Bullet.prototype.getIsHit = function(){
    return this.hit;
}

Bullet.prototype.setPickUpScore = function(status){
    this.pickUpScore = status;
}

Bullet.prototype.getPickUpScore = function(){
    return this.pickUpScore;
}

Bullet.prototype.setScore = function(score){
    this.score = score;
}

Bullet.prototype.getScore = function(){
    return this.score;
}

Bullet.prototype.getType = function(){
    return this.type;
}

Bullet.prototype.getSpeed = function(){
    return this.clientSpeed;
}

Bullet.prototype.getName = function(){
    return this.name;
}

Bullet.prototype.getSpeedX = function(){
    return this.speedX;
}

Bullet.prototype.getSpeedY = function(){
    return this.speedY;
}

Bullet.prototype.getBullet = function(){
    return {x:this.x, y:this.y, active:this.active, angle:this.angle, frame:this.frame, hit:this.hit, id:this.id, cannonid:this.cannonid, roomid:this.roomid, score:this.score, speed:this.clientSpeed, size:this.size, name:this.name, speedX:this.speedX, speedY:this.speedY}
}

Bullet.prototype.destroy = function () {
    //console.log("^^^ "+this.name+" - Destroy");

    this.active = false;
    //this.clearScheduledUpdate();
    //clearTimeout(this.scheduledUpdate);
    //clearInterval(this.scheduledUpdate);
}

module.exports = Bullet;