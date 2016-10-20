var cannon_list = [];

function initCannonList(_data){
    cannon_list = [];
    for(var i=0; i < cannon_base_list.length; i++){
        var _current = cannon_base_list[i];
        var _type = _current.type;
        for(var j = 0; j<_type.length; j++){
            var _typeid = _type[j];
            if(_typeid == totalCannon){
                _current.active = checkCannonActive(_data, _current.id);
                 _current.angle = getCannonFromData(_data, "angle", _current.id);
                _current.size = getCannonFromData(_data, "size", _current.id);
                _current.oriRot = getCannonFromData(_data, "oriRot", _current.id);
                //console.log("---- Ori Rot: "+getCannonFromData(_data, "oriRot", _current.id));
                cannon_list.push(_current);
                break;
            }
        }
    }

    return;
}

function markCannonPlayer(id){
    for(var i=0; i < cannon_list.length; i++){
        var current = cannon_list[i];
        if(current.id == id){
            current.active = true;
            return;
        }
    }
    return;
}


function getCannonFromData(data, key, id){
    for(var i=0; i<data.length;i++){
        var current = data[i];
        if(current.id == id){
            switch (key){
                case "angle":
                    return current.angle;
                break;

                case "size":
                    return current.size;
                    break;

                case "oriRot":
                    return current.oriRot;
                    break;
            }

        }
    }
    return null;
}

function getCannonAngle(data, id){
    for(var i=0; i<data.length;i++){
        var current = data[i];
        if(current.id == id){
            return current.angle;
        }
    }
    return null;
}

function checkCannonActive(data, id){
    for(var i=0; i<data.length;i++){
        var current = data[i];
        if(current.id == id){
            if(current.player == null){
                return false;
            }else{
                return true;
            }
        }
    }
    return false;
}

var cannonItemBG = cc.Sprite.extend({
    ctor:function(id, pos, x, y, rot){
        this._super();
        this.name = "cannon_bg_"+id;
        this.id = id;
        this.rot = rot;

        //var _src = asset_folder+getSource("icon_click");
        var _src = asset_folder+getSource("bottom");

        //this.cache = cc.spriteFrameCache.addSpriteFrames(map[0], map[1]);
        //this.initWithSpriteFrameName(this.type+"-00"+".png");

        var posX = x*screen_width;
        var posY = y*screen_height;

        this.initWithFile(_src);

        switch (pos){
            case "B":
                posY += this._getHeight()/2;
                break;

            case "T":
                posY -= this._getHeight()/2;
                break;

            case "L":
                posX += this._getHeight()/2;
                break;

            case "R":
                posX -= this._getHeight()/2;
                break;
        }

        this.setPosition(cc.p(posX, posY));
        this.setRotation(this.rot);

        if(isPlayer){
            if(cannonType == this.id){
                this.setupButton();
            }
        }
    },
    setupButton: function () {

        //console.log("--- SETUP BUTTON");
        var margin = 20;
        var _src = asset_folder+getSource("icon_min");

        // bttn min
        var _bttnMin = new cc.Sprite(_src);
        this.addChild(_bttnMin);
        _bttnMin.setPosition(this.width/2 - (_bttnMin.width + margin), this.height/2);
        cc.eventManager.addListener(cannon_min_listener.clone(),_bttnMin);

        // bttn plus
        _src = asset_folder+getSource("icon_plus");
        var _bttnPlus = new cc.Sprite(_src);
        this.addChild(_bttnPlus);
        _bttnPlus.setPosition(this.width/2 + (_bttnMin.width + margin), this.height/2);
        cc.eventManager.addListener(cannon_plus_listener.clone(),_bttnPlus);
    }
});

var cannon_plus_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch

    onTouchBegan:function(touch, event){

        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(cc.rectContainsPoint(targetRect, location)){
            changeCannonSize(1);
            return true;
        }
        return false;
    }
});

var cannon_min_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(cc.rectContainsPoint(targetRect, location)){
            changeCannonSize(-1);
            return true;
        }
        return false;
    }
});

var cannonItem = cc.Sprite.extend({
    ctor:function(id, pos, x, y, rot, active, size){
        //console.log("SET Cannon Item: "+id+"- rot"+rot);
        this._super();
        this.active = active;
        this.name = "cannon_"+id;
        this.id = id;
        this.rot = rot;
        this.segment = cannonSegment;
        this.size = size;
        var _src = asset_folder+getSource("icon_click");

        if(this.active){
            /*
            if(cannonType == this.id){
                this.size = cannonSize;
                _src = "cannon"+this.size+"-01.png";
            }else{
                _src = "cannon1-01.png";
            }*/
            _src = "cannon"+this.size+"-01.png";
            this.cache = cc.spriteFrameCache.addSpriteFrames(map[0], map[1]);
            this.initWithSpriteFrameName(_src);
        }else{
            this.initWithFile(_src);
        }

        var posX = x*screen_width;
        var posY = y*screen_height;

        switch (pos){
            case "B":
                posY += this._getHeight()/2;
                break;

            case "T":
                posY -= this._getHeight()/2;
                break;

            case "L":
                posX += this._getHeight()/2;
                break;

            case "R":
                posX -= this._getHeight()/2;
                break;
        }

        this.setPosition(cc.p(posX, posY));
        this.setRotation(this.rot);
        //if(!isPlayer){

        if(!this.active){
            this.listener = cannon_click_listener.clone();
            cc.eventManager.addListener(this.listener,this);
        }else{
            this.setCannonAnimation();
        }
    },
    changeRotation:function(x,y){
        var deltaX = x - this.getPositionX();
        var deltaY = y - this.getPositionY();

        var rotation = RAD_TO_DEG*((Math.PI/2) - Math.atan2(deltaY,deltaX));
        //this.setRotation(rotation);

        var rotateAnimation = new cc.rotateTo(0.1, rotation);
        this.runAction(rotateAnimation);
        this.rot = rotation;

        /*
        var data = {};
        data.type = this.id;
        data.rot = this.rot;
        data.size = this.size;
        console.log("change rotation");
        spreadToOther("change_cannon_angle", data);
        */
        //initBullet(this.getPositionX(),this.getPositionY(),this.rot, this.size, null);
        return rotation;
    },
    setChangeRotation:function(rotation){
        var rotateAnimation = new cc.rotateTo(0.1, rotation);
        this.runAction(rotateAnimation);
        this.rot = rotation;
    },
    shot:function(){
        this.runAction(this.animate);
    },
    changeCannonSize: function (size) {
        //console.log("-- change cannon size to "+size);
        //this.stopAction(this.animate);
        this.size = size;

        var _src = "cannon"+this.size+"-01.png";
        this.initWithSpriteFrameName(_src);

        this.setCannonAnimation();
    },
    setCannonAnimation: function () {
        var animFrames = [];
        for(var i=0; i<this.segment; i++) {
            var j = i+1;
            str =  "cannon"+this.size+"-"+(j < 10 ? ("0" + j) : j)+".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(spriteFrame, 1, null);
            //animFrame.initWithSpriteFrameName(spriteFrame);
            animFrames.push(animFrame);
        }
        var animation = new cc.Animation(animFrames, 0.15);// cc.Animation.create(animFrames, 0.08, 100);
        this.animate   = new cc.Animate(animation);// cc.Animate.create(animation);
    },
    removeListener: function () {
        console.log("---- REMOVE LISTENER "+this);
        if(this.listener){
            console.log("---- REMOVE ALL ");
            cc.eventManager.removeAllListeners();
            //cc.eventManager.removeListener(this.listener);
            this.listener = null;
        }
    }
});

/*
var cannon_click_listener = cc.EventListener.create({
    event:cc.EventListener.MOUSE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch
    onMouseDown:function(event){
        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(event.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0, 0,target.width,target.height);

        if(cc.rectContainsPoint(targetRect, location)){
            console.log("CLICK ON CANNON");
            setPlayer(target.id);
            return true;
        }
        return false;
    }
});
*/

var posToJoin = null;

/*
var cannon_click_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(cc.rectContainsPoint(targetRect, location)){
            console.log("CLICK ON CANNON");
            //clientdata.roomid, socket.id, 1, clientdata.position, clientdata.score, clientdata.coin, clientdata.playerid
            var data = {};
            data.position = target.id;
            data.score = playerScore;
            data.coin = playerCoin;
            data.playerid = playerid;

            spreadToOther("checkin",data)
            setPlayer(target.id);

            posToJoin = target.id;
            initiatePopup("buy");
            //generatePopup("buy");
            //openPopup();
            return true;
        }
        return false;
    }
});
*/

var cannon_click_listener = cc.EventListener.create({
    event:cc.EventListener.MOUSE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch
    onMouseUp:function(event){
        var target = event.getCurrentTarget();
        var location = target.convertToNodeSpace(event.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(!isIdleOnPopUp) {
            if (cc.rectContainsPoint(targetRect, location)) {
                if(posToJoin == null){
                    posToJoin = target.id;
                    console.log("CLICK ON CANNON " + posToJoin);
                    //clientdata.roomid, socket.id, 1, clientdata.position, clientdata.score, clientdata.coin, clientdata.playerid
                    /*
                     var data = {};
                     data.position = target.id;
                     data.score = playerScore;
                     data.coin = playerCoin;
                     data.playerid = playerid;

                     spreadToOther("checkin",data);
                     setPlayer(target.id);
                     */

                    openPopup("join_room");
                    return true;
                }
            }
            return false;
        }
    }
});



function setPlayerCannon(x, y){
    var _children = cannonLayer.getChildren();
    var _rotation = 0;

    for(var i = 0; i < _children.length; i++){
        var _child = _children[i];
        if(_child.name == "cannon_"+cannonType){
            _rotation = _child.changeRotation(x,y);
            _child.shot();

            var data = {};
            data.type = _child.id;
            data.rot = _child.rot;
            data.size = _child.size;
            //console.log("change rotation");
            return data;//spreadToOther("change_cannon_angle", data);

            //initBullet(_child.getPositionX(),_child.getPositionY(),_rotation);
            //break;
        }
    }

    return null;
}
