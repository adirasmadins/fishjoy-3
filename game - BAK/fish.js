var Global = require('../globals');

// Constructor
function Fish(typeid, x, y, speed, size, score, life, name, w, h, flip, generator)
{
    //console.log('NEW FISH of type '+typeid+" x: "+x+" y: "+y);
    this.idle = 20;
    this.timetick = 0;
    this.type = typeid;
    this.name = name;
	this.speed = speed;
    this.angle = 0;
    this.updateduration = (1/Global.fps)*1000;
    this.size = size;
    this.generator = generator;

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
    this.screen_width = this.generator.w;
    this.screen_height = this.generator.h;

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

    this.scheduledUpdate = setInterval(this.update.bind(this), this.updateduration);
    return;
}

Fish.prototype.getFishType = function(typeid){
    return this.type;
}

Fish.prototype.init = function(props)
{
	this.changeDirection(this.rotation);
};

Fish.prototype.createFish = function(typeid){
    return new Fish(typeid);
};

Fish.prototype.changeDirection = function(dir)
{
	if(dir != undefined)
	{
		this.setDirection(dir);
	}else
	{		
		var chance = Math.random() > 0.80;
	    if(chance)
	    {
	    	var dir = Math.random() > 0.5 ? 1 : -1;	    	
	    	var degree = Math.random()*10 + 20 >> 0;
	    	this._destRotation = this.rotation + degree * dir >> 0;
	    }
	}
    var fps = 20, min = fps * 5, max = fps * 10;
	this.changeDirCounter = Math.random()*(max - min + 1) + min >> 1;
};

Fish.prototype.setDirection = function(dir)
{
	if(this.rotation == dir && this.speedX != undefined) return;
	
	if(dir.degree == undefined)
	{
		var radian = dir * Global.DEG_TO_RAD;
		dir = {degree:dir, sin:Math.sin(radian), cos:Math.cos(radian)};		
	}
	
	this.rotation = dir.degree % 360;
	this.speedX = this.speed * dir.cos;
	this.speedY = this.speed * dir.sin;
    //console.log("dir: "+dir.cos)
   // console.log("speed: "+this.speed+" speedX: "+this.speedX+" speedY: "+this.speedY);
};


Fish.prototype.canBeCaptured = function(level)
{
	return this.captureRate * (1 + level*0.05) > Math.random();
};

Fish.prototype.loseLife = function(){
    this.life --;
    if(this.life < 0){
        this.life = 0;
    }
}

Fish.prototype.update = function()
{
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


    this.timetick++;
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
        //datasend.roomid = roomname;
        datasend.name = this.name;
        datasend.angle = this.angle;

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
        this.destroy();
    }

    //console.log('speedX: '+this.speedX+" speedY: "+this.speedY);
    return;
};


Fish.prototype.checkBorder = function(x,y){
    if(this.isFlip){
        if(x > -this.width  && y > 0 && y < this.screen_height){
            return true;
        }
    }else{
        if(x < this.screen_width + this.width  && y > 0 && y < this.screen_height){
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

Fish.prototype.destroy = function () {
    clearInterval(this.scheduledUpdate);
}

module.exports = Fish;
