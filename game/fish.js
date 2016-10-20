var Global = require('../globals');
var util = require("util");
var EventEmitter = require("events").EventEmitter;

var scheduledUpdate;

// Constructor
function Fish(typeid, x, y, speed, size, score, life, name, w, h, flip, sWidth, sHeight)
{
    //console.log('NEW FISH of type '+typeid+" x: "+x+" y: "+y);
    EventEmitter.call(this);

    this.idle = 20;
    this.timetick = 0;
    this.type = typeid;
    this.name = name;
	this.speed = speed;
    this.angle = 0;
    this.updateduration = (1/Global.fps)*1000;
    this.size = size;

	this.moving = true;
	this.canTurning = false;
	this.hasShown = false;
	this.captured = false;
    this.active = true;
    this.frame = 1;
    this.totalFrame = 1;
    this.totalActiveFrame = 1;
    this.rotation = 0;
    this.isFlip = flip;
    this.capturingCounter = 4;
    this.score = score;
    this.life = life;
    this.dir = 1;
    this.width = w;
    this.height = h;
    this.screen_width = sWidth;
    this.screen_height = sHeight;

    var posX = x;
    var posY = y;
    if(this.isFlip){
        this.dir = -1;
        posX += this.width/2;
        //this.flippedX = true;
    }else{
        posX -= this.width/2
    }

    this.x = posX;
    this.y = posY;

    //scheduledUpdate = setTimeout(this.update.bind(this), this.updateduration);// setInterval(this.update.bind(this), this.updateduration);
    return;
}

util.inherits(Fish, EventEmitter);

Fish.prototype.getFishType = function(typeid){
    return this.type;
}

Fish.prototype.loseLife = function(){
    this.life --;
    if(this.life < 0){
        this.life = 0;
    }
}

Fish.prototype.clearScheduledUpdate = function () {
    if(scheduledUpdate){
        clearTimeout(scheduledUpdate);
    }
    return;
}

Fish.prototype.update = function()
{
    //this.clearScheduledUpdate();
    if(this.active){
        //be captured
        if(this.captured)
        {
            //if(this.life <= 0){
                this.frame = this.totalActiveFrame - (this.capturingCounter-1);

                //this.active = false;
                if(this.capturingCounter < 0)
                {
                    this.active = false;
                }

                this.capturingCounter --;

            return;
           //}
        }


        this.timetick += 1;
        if (this.timetick >= this.idle) {

            this.timetick = 0;
            //console.log("OLD ANGLE"+this.angle);
            var min = 0;
            var max = 1;
            //var randomAngle = min + (Math.random(max-min)*max);
            var randAngle = Math.round(Math.random());
            var randDir = Math.round(Math.random());

            var randomAngle = 0;
            var randomDir = 1;

            if (randAngle == 0) {
                randomAngle = 10;
            }

            if (randDir == 0) {
                randomDir = -1;
            }

            this.angle += randomDir * randomAngle;

            var datasend = {};
            datasend.name = this.name;
            datasend.angle = this.angle;

            //console.log("1. --- FISH EMIT");
            this.emit("angle_change", datasend);
            //spreadToOther("change_angle", datasend);
            //console.log("add angle: "+datasend+" -- dir: "+this.angle);
        }

        var speedX = this.speed * Math.cos(this.angle * Global.DEG_TO_RAD);
        var speedY = this.speed * Math.sin(this.angle * Global.DEG_TO_RAD);

        var posX = this.x + this.dir * speedX;
        var posY = this.y - this.dir * speedY;

        if (this.checkBorder(posX, posY)) {
            this.x = posX;
            this.y = posY;
        } else {
            //console.log("***  "+this.name+" out of area");
            this.emit("new_fish", this);
            this.destroy();
        }

        //scheduledUpdate = setTimeout(this.update.bind(this), this.updateduration);
    }

    return;
};


Fish.prototype.checkBorder = function(x,y){
    if(this.isFlip){
        if(x > -this.width  && y > -this.height && y < this.screen_height + this.height){
            return true;
        }
    }else{
        if(x < this.screen_width + this.width  && y > -this.height && y < this.screen_height + this.height){
            return true;
        }
    }

    return false;
}

Fish.prototype.getLife = function(){
    return this.life;
}

Fish.prototype.setLife = function(value){
    this.life -= value;
}

Fish.prototype.getScore = function(){
    return this.score;
}

Fish.prototype.getFish = function(){
    return {type:this.type, x:this.x, y:this.y, angle:this.angle, active:this.active, frame:this.frame, totalFrame:this.totalFrame, totalActiveFrame:this.totalActiveFrame, isFlip:this.isFlip, score:this.score, life:this.life, captured:this.captured, speed:this.speed, name:this.name}
}

Fish.prototype.getName = function(){
    return this.name;
}

Fish.prototype.destroy = function () {
    //console.log("^^^ "+this.name+" - Destroy");

    this.active = false;
    //this.clearScheduledUpdate();
    //clearTimeout(this.scheduledUpdate);
    //clearInterval(this.scheduledUpdate);
}

module.exports = Fish;
