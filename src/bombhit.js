var distanceY = 200;
var speedY = 7;
var margin = 20;

var bombhit = cc.Sprite.extend({
    ctor:function(x,y){
        this.totalframe = 19;
        this._super();
        this.initialY = y;
        this.index = 2;
        this.templatename = "fx_";
        this.cache = cc.spriteFrameCache.addSpriteFrames(fx[this.index], fx[this.index + 1]);
        this.initWithSpriteFrameName(this.templatename+"0"+".png");
        this.setPosition(cc.p(x, y+margin));

        var animFrames = [];
        for (var i = 0; i < this.totalframe; i++) {
            var j = i+1;
            str = this.templatename+i+".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            animFrames.push(animFrame);
        }
        var animation = new cc.Animation(animFrames, 0.05, 1);// cc.Animation.create(animFrames, 0.08, 100);
        this.animate   = new cc.Animate(animation);// cc.Animate.create(animation);

        this.runAction(this.animate);
        this.scheduleUpdate();

    },
    update: function () {

        if(this.animate.isDone()){
            this.destroy();
        }

    },
    destroy:function(){
        this.unscheduleUpdate();
        this.stopAction(this.animate);
        removeBulletHit(this);
    }
});