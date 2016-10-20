var Global = require('../globals');

function Bullet(orix,oriy,finalx, finaly, angle, socketid, cannonid, roomid, type, speed, convSpeed){
    this.oriX = orix;
    this.oriY = oriy;
    this.destX = finalx;
    this.destY = finaly;
    this.angle = angle;
    this.frame = 0;
    this.active = true;
    this.hit = false;
    this.isscore = false;
    this.id = socketid;
    this.cannonid = cannonid;
    this.roomid = roomid;
    this.startAnimate = false;
    this.speed = speed;
    this.clientSpeed = convSpeed;
    this.accelerate = 4;
    this.totalFrame = 4;
    this.sizeW = 24;
    this.sizeH = 26;
    this.speedx = this.speed*Math.sin(this.angle);
    this.speedy = this.speed*Math.cos(this.angle);
    this.hitCounter = 4;
    this.score = 0;
    this.pickUpScore = false;
    this.isflip = false;
    this.type = type;
    this.fishX = null;
    this.fishY = null;
    this.fishW = null;
    this.fishH = null;
    
    
    this.accelerateX = this.accelerate*Math.sin(this.angle);
    this.accelerateY = this.accelerate*Math.cos(this.angle);
    
    this.x = this.oriX + this.speedx;
    this.y = this.oriY + this.speedy;
    if(this.angle < 0){
        this.dir = -1;
    }else{
        this.dir = 1;
    }
    
    //console.log("NEW BULLET - user socket id: "+this.id+" - cannon id: "+this.cannonid);
}

Bullet.prototype.update = function(){
    //if(this.active){
        if(!this.hit){
            this.speedx += this.accelerateX;
            this.speedy += this.accelerateY;
            
            this.x += this.speedx;
            this.y -= this.speedy;

            /*if(this.dir < 0){
                if(this.x <= this.destX || this.y <= this.destY){
                    this.active = false;
                }
            }else{
                if(this.x > this.destX || this.y <= this.destY){
                    this.active = false;
                }
            }*/
        }else{
            // is hit
            //console.log("hit counter "+this.hitCounter);
            if(this.isscore){
                this.hitCounter --;
                if(this.hitCounter < 0){
                    this.active = false;
                }
            }else{
                this.active = false;
            }
        }
    //}
    
    return;
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

Bullet.prototype.getBullet = function(){
    return {x:this.x, y:this.y, active:this.active, angle:this.angle, frame:this.frame, hit:this.hit, id:this.id, cannonid:this.cannonid, roomid:this.roomid, score:this.score, speed:this.clientSpeed}
}

module.exports = Bullet;