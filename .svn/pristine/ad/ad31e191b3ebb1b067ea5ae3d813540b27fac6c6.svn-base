var gameLayer;
var backgroundLayer;
var fishLayer;
var commonButtonLayer;
var cannonLayer;
var cannonBGLayer;
var buttonLayer;
var bulletLayer;
var netLayer;

var fishList = [];
var bulletList = [];

var isBulletIdle = false;
var bulletIdleTimeout = null;

var gameScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
  }
});

var game = cc.Layer.extend({
  init:function () {
      this._super();

      // === Chipmunks ====
      world = new cp.Space();
      world.gravity = cp.v(0,0);

      backgroundLayer = new bg_layer();
      backgroundLayer.init();
      this.addChild(backgroundLayer);

      //fishLayer = new cc.Layer();
      fishLayer = new fish_layer();
      fishLayer.init();
      this.addChild(fishLayer);

      netLayer = new cc.Layer();
      netLayer.init();
      this.addChild(netLayer);

      cannonBGLayer = new cc.Layer();
      cannonBGLayer.init();
      this.addChild(cannonBGLayer);

      bulletLayer = new cc.Layer();
      bulletLayer.init();
      this.addChild(bulletLayer);

      cannonLayer = new cc.Layer();
      cannonLayer.init();
      this.addChild(cannonLayer);

      buttonLayer = new cc.Layer();
      buttonLayer.init();
      this.addChild(buttonLayer);


      commonButtonLayer = new cc.Layer();
      commonButtonLayer.init();
      this.addChild(commonButtonLayer);
      this.debugDraw();

      world.setDefaultCollisionHandler(this.collisionBegin, null, null, null);

      initCannons();
      startGame();
      this.scheduleUpdate();
  },
    addBody:function(posX,posY,width,height, angle, isDynamic,spriteImage,type, life){
        var body;
        if(isDynamic){
            body = new cp.Body(1,cp.momentForBox(1,width,height));
        }else{
            body = new cp.Body(Infinity,Infinity);
        }

        body.setPos(cp.v(posX, posY));

        if(isDynamic){
            world.addBody(body);
        }

        var shape = new cp.BoxShape(body, width, height);
        shape.setFriction(1);
        shape.setElasticity(0);
        shape.name=type;
        //shape.type = type;
        shape.image = spriteImage;
        world.addShape(shape);

        if(type == "fish"){
            shapeFishArray.push(shape);
        }else if(type == "bullet"){
            shapeBulletArray.push(shape);
        }

        //console.log("FISH length "+shapeFishArray.length);
        //console.log("BULLET length "+shapeBulletArray.length);

    },
    update: function () {

    },
    debugDraw: function () {
        _debugDraw = new cc.PhysicsDebugNode(world);
        _debugDraw.setVisible(true);
        this.addChild(_debugDraw);
    },
    collisionBegin: function(arbiter, space){
        console.log("---- collision begin -----");
        if((arbiter.a.name == "fish" && arbiter.b.name == "bullet") || (arbiter.b.name == "fish" && arbiter.a.name == "bullet")){
            console.log("COLLIDE")
            return true;
        }
        return false;
    }
});

// ==== BOX2D ======
function getSpriteBody(asset, type){
    //console.log("sprite: "+asset);
    var _src;
    if(type == "fish"){
        _src = shapeFishArray;
    }else{
        _src = shapeBulletArray;
    }
    for (var i = _src.length - 1; i>-0; i--) {
        if(_src[i].image !== null && _src[i].image == asset){
            return _src[i];
        }
    }

    return null;
}


function getSpriteBodyIndex(asset, type){
    var _src = [];
    if(type == "fish"){
        _src = shapeFishArray;
    }else{
        _src = shapeBulletArray;
    }
    for (var i = _src.length - 1; i>-0; i--) {
        if(_src[i].image !== null && _src[i].image == asset){
            return i;
        }
    }

    return null;
}

 function removeShapeBody(asset, type){
     var b = getSpriteBodyIndex(asset, type);
     var _src = [];
     if(type == "fish"){
         _src = shapeFishArray;
     }else{
         _src = shapeBulletArray;
     }
     if(b !== null){
        world.removeBody(_src[b].getBody());
        world.removeShape(_src[b]);
        _src.splice(b,1);
     }
 }

function updateShapeBody(asset, type){
    var b = getSpriteBodyIndex(asset, type);
    var _src = [];
    if(type == "fish"){
        _src = shapeFishArray;
    }else{
        _src = shapeBulletArray;
    }

    //console.log("Asset: "+asset+" - result: "+b);

    if(b !== null){
        _src[b].body.p.x = _src[b].image.x;
        _src[b].body.p.y = _src[b].image.y;
        _src[b].body.rotation = -1 * (57.2957795*(_src[b].image.getRotation()));
        //var angle = Math.atan2(-shapeArray[i].body.rot.y,shapeArray[i].body.rot.x);
        //shapeArray[i].image.rotation= angle*57.2957795;
    }

}


// ++++++++++ LAYERS +++++++++++++++++

function removeLayerChild(layer){
    layer.removeAllChildren();
}

// FISH LAYER
var fish_layer = cc.Layer.extend({
   init: function () {
       this._super();
       initFishes(total_fish);
       //this.scheduleUpdate();
   },
    update: function () {
        updateFishes();//console.log("UPDATE");
    }
});
// BACKGROUND LAYER
var bg_layer = cc.Layer.extend({
   init:function(){
       this._super();
       var target = new cc.Sprite(asset_folder+"game_bg_2_hd.jpg");
       var scaleFactor = resize(target.width, target.height);
       //console.log("W: "+target.width+" H: "+target.height+" -- "+scaleFactor);
       target.setScale(scaleFactor);
       target.setAnchorPoint(0,0);
       this.addChild(target);
   }
});
// +++++++++++++++++++++++++++++++++++++

// CANNONS
var cannon_layer = cc.Layer.extend({
    init:function(){
        this._super();
    }
});

function initCannons(){
    initCannonList();
    for(var i=0; i < cannon_list.length; i++) {
        var _current = cannon_list[i];

        if(isPlayer){
            var CannonBG = new cannonItemBG(_current.id, _current.pos,  _current.x, _current.y, _current.addRot);
            cannonBGLayer.addChild(CannonBG);
            initScreenListener();
        }

        var Cannon = new cannonItem(_current.id, _current.pos,  _current.x, _current.y, _current.addRot);
        cannonLayer.addChild(Cannon);
    }
}

function setPlayer(id){
    isPlayer = true;
    cannonType = id;
    removeLayerChild(cannonLayer);
    initCannons();
}

function initScreenListener(){
    cc.eventManager.addListener(shot_click_listener.clone(),cannonLayer);
}

var shot_click_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch
    onTouchBegan:function(touch, event){
        if(!isBulletIdle){
            var target = event.getCurrentTarget();
            //getLocation -- coordinates of the touch or click inside the game
            //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
            var location = target.convertToNodeSpace(touch.getLocation());
            //var targetSize = target.getContentSize();
            //var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
            setPlayerCannon(location.x, location.y);

            isBulletIdle = true;
            bulletIdleTimeout = setTimeout(removeBulletIdle, bulletIdleTime*1000);
        }
    }
});


function removeBulletIdle(){
    if(bulletIdleTimeout){
        clearTimeout(bulletIdleTimeout);
        bulletIdleTimeout = null;
    }
    isBulletIdle = false;
}

// BULLETS
function initBullet(x, y, rot){
    var Bullet = new bulletItem(x,y,rot,cannonSize);
    bulletLayer.addChild(Bullet);

    bulletList.push(Bullet);
}

function removeFromBulletList(obj){
    var i = bulletList.length;
    while(i > 0){
        var j = i -1;
        var _bullet = bulletList[j];
        if(_bullet == obj){
            bulletList.splice(j,1);
            break;
        }
        i--;
    }

    return;
}

// BUTTONS

// FISHES
function initFishes(totalFish){
    for(var i=0; i < totalFish; i++){
        createNewFish();
    }
}


function createNewFish(){
    var minX = 50;
    var maxX = 600;
    var minY = 50;
    var maxY = screen_height;

    var randomX = (minX + Math.round(Math.random()*(maxX - minX)));
    var randomY = minY + Math.round(Math.random()*(maxY - minY));

    var randomDir = Math.round(Math.random());
    var flip = false;
    if(randomDir == 1){
        randomX += screen_width ;
        flip = true;
    }else{
        randomX *= -1;
        randomX -= area_margin;
    }

    var min = 0;
    var max = fishassets.length-1;

    var randId = min + Math.round(Math.random()*(max - min));
    var Fish = new fish(randId, flip, randomX, randomY);
    fishLayer.addChild(Fish);

   // game.addBody(Fish.getPositionX(), Fish.getPositionY(), Fish._getWidth(), Fish._getHeight(), true, Fish, "fish", Fish.life);

    fishList.push(Fish);
}

function removeFromFishList(obj){
    var i = fishList.length;
    while(i > 0){
        var j = i -1;
        var _fish = fishList[j];
        if(_fish == obj){
            fishList.splice(j,1);
            break;
        }
        i--;
    }

    return;
}


// ++++ COMMON FUNCTION ++++++
function resize(w, h){
    var widthRatio = w/screen_width;
    var heightRatio = h /screen_height;
    var refRatio = 1;

    if (widthRatio > heightRatio) {
        refRatio = 1/heightRatio;
    }else if(widthRatio < heightRatio){
        refRatio = 1/widthRatio;
    }else{
        refRatio = 1/widthRatio;
    }

    return refRatio;
}