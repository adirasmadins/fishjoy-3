var distanceY = 200;
var speedY = 7;
var margin = 20;

var coin = cc.Sprite.extend({
    ctor:function(x,y){
        this._super();
        this.initialY = y;
        this.index = 2;
        this.cache = cc.spriteFrameCache.addSpriteFrames(map[0], map[1]);
        this.initWithSpriteFrameName("coinAni"+this.index+"-01"+".png");
        this.setPosition(cc.p(x, y+margin));

        var animFrames = [];
        for (var i = 0; i < 10; i++) {
            var j = i+1;
            str = "coinAni"+this.index+"-"+(j < 10 ? ("0" + j) : j)+".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            animFrames.push(animFrame);
        }
        var animation = new cc.Animation(animFrames, 0.15, 20);// cc.Animation.create(animFrames, 0.08, 100);
        this.animate   = new cc.Animate(animation);// cc.Animate.create(animation);

        this.runAction(this.animate);

        this.scheduleUpdate();
    },
    update: function () {
        var nextY = this.y + speedY;
        this.setPositionY(nextY);

        if(!this.checkBorder()){
            this.destroy();
        }
    },
    checkBorder: function () {
        if(this.y < screen_height + this._getHeight()){
            return true;
        }
        return false;
    },
    destroy:function(){
        this.unscheduleUpdate();
        this.stopAction(this.animate);
        removeCoin(this);
    }
});