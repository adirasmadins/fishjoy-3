var distanceY = 200;
var speedY = 7;
var margin = 20;

var bullethit = cc.Sprite.extend({
    ctor:function(x,y){
        this.totalframe = 3;
        this._super();
        this.initialY = y;
        this.index = 4;
        //this.templatename = "bullet_hit_";
        this.templatename = "spark_";
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
        var animation = new cc.Animation(animFrames, 0.08, 1);// cc.Animation.create(animFrames, 0.08, 100);
        this.animate   = new cc.Animate(animation);// cc.Animate.create(animation);

        //var animate = cc.RepeatForever.create(cc.Animate.create(animation));
        var animate = new cc.RepeatForever(this.animate);
        var actionMoveDone = cc.CallFunc.create(function(node) { this.stopAction(this.animate); }, this);
        //this.runAction(cc.Sequence.create(animation, actionMoveDone));

        /*
        this.seq =new cc.Sequence(animation,function(){
            this.stopAction(this.seq);
            removeBulletHit(this);
        });
        */



        //this.runAction(this.seq);
        this.runAction(this.animate);
        //this.runAction(this.animate, this.destroy());
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