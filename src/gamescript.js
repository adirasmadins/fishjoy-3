var gameLayer;
var backgroundLayer;
var fishLayer;
var commonButtonLayer;
var cannonLayer;
var cannonBGLayer;
var buttonLayer;
var bulletLayer;
var scoreLayer;
var netLayer;
var coinLayer;
var popupLayer;

var popup = null;

var fishList = [];
var fishPosList = [];

var bulletList = [];
var bulletPosList = [];

var buttonList = [];

var isBulletIdle = false;
var bulletIdleTimeout = null;
var autoShotTimeout = null;
var autoLockTimeout = null;

var activeCannon = null;

var isReady = false;

var fishIndex = 0;
var bulletIndex = 0;
var socket;

var maxFishIndex = 1000;
var maxBulletIndex = 1000;

var screenListener = null;

var gameScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
      socket = io();
      if(socket){
          socket.on('connect', function(){
              console.log('---- client connect');
          });


          /*
          socket.on('set_as_driver', function () {
              isDriver = true;
          });

          socket.on("checkin", function(data){
              setupJoinRequest(data);
          });

           socket.on('get_update', function(){
           // get current game status
           });

           socket.on('update', function(data, cannondata, playerdata){
           //console.log('UPDATE ');
           if(!isConnectionLost){
           game_data_render = [];
           //stopClockEngine();
           var _playerData = filterPlayer(playerdata);
           //checkOwnCoin(_playerData);
           render(data);
           renderCannon(cannondata);
           createNotes(_playerData);
           //renderScore(_playerdata);
           //renderCoin(_playerdata);

           game_data_render = data;
           //setClockEngine();
           }

           socket.on("standout",function(){
           setSelectedCannon(null);
           //updateCannonList(data);
           removeCommonButton();
           });

           socket.on("checkout",function(){
           //roomname = null;
           window.location.replace("/");
           });

           socket.on("topup",function(data){
           var clientdata = data;
           //closePopup();
           //console.log(" check on top up "+data.pass);
           if(data.pass){
           // continue playing
           //console.log("--- should continue playing");
           closePopup();
           //$('#popup').hide();
           //console.log("Visible?"+$('#popup').is(':visible'));
           }else{
           showRunningOfCoinPopup("no_available_coin");
           }

           });

           });
           */

          socket.on("not_enough_coin", function(){
              isAutoLock = false;
              isAutoShoot = false;
              targetLock = null;
              //initiatePopup("not_enough_coin");
              openPopup("not_enough_coin");
              startNoCoinTimer();
          });

          socket.on("not_available_coin", function(){
              //initiatePopup("no_available_coin");
              openPopup("no_available_coin");
          });


          socket.on('prepare',function(data){
              console.log("CATCH prepare "+data);
              setInitialParameter(data);
              settingUp(data);
              startCounter();
              //initScoreDisplay(data.playerList);
          });

          socket.on('checkin', function (data) {
              playerScore = data.score;
              playerCoin = data.coin;

              setPlayer(data.position);
              addScoreDisplay(data.position, data.score, data.coin);
              //setUpScore(data.position, data.score);
              //setUpCoin(data.position, data.coin);
          });


          socket.on("new_join", function(data){
              console.log("--- NEW JOIN");
              //setUpScore(data.playerList);
              //setUpScore(data.position, data.score);
              //setUpCoin(data.position, data.coin);
              initScoreDisplay(data.playerList);
              //addScoreDisplay(data.position, data.score, data.coin);
              setUpCannon(data.cannonList);
          });

          socket.on('check_connection', function(){
              checkConnectionStatus();
          });

          socket.on("change_fish_angle", function (data) {
              //checkConnectionStatus();
              changeFishAngle(data);
          });
          
          socket.on("new_fish", function (data) {
              //console.log("--- new fish");
              var _data = [];
              _data.push(data);
              initDrivenFishes(_data);
          });

          socket.on("new_bullet", function (data) {
              console.log("--- new bullet "+data.size);
              initBullet(data.x, data.y, data.angle, data.size, data.name, data.speedX, data.speedY);
          });

          socket.on("change_cannon_angle", function (data) {
              console.log("--- change cannon angle");
              changeCannonAngle(data);
          });

          socket.on("change_cannon_size", function (data) {
              console.log("--- change cannon size");
              setCannonSize(data);
          });

          socket.on("remove_bullet", function(data){
              console.log("--- remove bullet");
               removeBullet(data);
          });

          socket.on("remove_fish", function(data){
              removeFish(data);
          });

          socket.on("change_score", function(data){
              setUpScore(data.position, data.score);
          });

          socket.on("change_coin", function(data){
              setUpCoin(data.position, data.coin);
          });

          socket.on("standout", function(){
             resetPlayerStatus();
          });


          socket.on("topup", function (data) {
              console.log("TOP UP!"+data.pass);
              closePopup();
              if(!data.pass){
                  openPopup("coin_not_available");
                  //initiatePopup("no_available_coin");
              }
          });

          socket.on('signout',function(){
              /*
              var form = document.createElement("form");
             // var input = document.createElement('input');
              form.method = 'post';
              form.action = '/';
             // input.type = "hidden";

             // input.name = "roomId";
             // input.value = data.roomid;
              //form.appendChild(input);
              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
                */
              window.location.replace("./");
          });

          socket.emit("initiate", {id:roomname, playerid:playerid});
      }

    //console.log("-- "+roomname+" -- "+playerid);
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
  }
});

var game = cc.Layer.extend({
  init:function () {
      this._super();

      var gravity = new Box2D.Common.Math.b2Vec2(0,0);
      world = new Box2D.Dynamics.b2World(gravity, false);

      //backgroundLayer = new bg_layer();
      backgroundLayer = new cc.Layer();
      backgroundLayer.init();
      this.addChild(backgroundLayer);

      fishLayer = new cc.Layer();
      //fishLayer = new fish_layer();
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

      coinLayer = new cc.Layer();
      coinLayer.init();
      this.addChild(coinLayer);

      scoreLayer = new cc.Layer();
      scoreLayer.init();
      this.addChild(scoreLayer);

      popupLayer = new cc.Layer();
      popupLayer.init();
      this.addChild(popupLayer);
      //popupLayer.hide();


      //this.debugDraw();
      //initCannons();
      //startGame();
      //initScreenListener();
      this.scheduleUpdate();
  },
    addBody:function(posX,posY,width,height, angle, isDynamic,spriteImage, type, life){
        //this.addBody(240,10,480,20,false,"assets/ground.png","ground");
        var _posX = posX;
        var _posY = posY;
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef;
        fixtureDef.density = 0;
        fixtureDef.friction = 0;
        fixtureDef.restitution = 0;
        fixtureDef.isSensor = true;
        fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
        fixtureDef.shape.SetAsBox(0.5*width/meter,0.5*height/ meter);
        var bodyDef = new Box2D.Dynamics.b2BodyDef;
        if(isDynamic){
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        }
        else{
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        }
        bodyDef.position.Set(_posX/meter,_posY/meter);

        bodyDef.userData = {
            type: type,
            life:life,
            asset:spriteImage
        };

        var body = world.CreateBody(bodyDef)
        body.CreateFixture(fixtureDef);

        //console.log("BOX ATTACH "+bodyDef.GetPosition());
    },
    update: function () {
        if(isReady){
            //sendPositionToServer();
            //world.Step(dt,10,10);
            world.Step(1 / 60, 10, 10);
            updateWorldPosition();
            //world.DrawDebugData();
            checkCollide();
        }
    },
    debugDraw: function () {
        console.log("--- setup debug draw");
        _debugDraw = new Box2D.Dynamics.b2DebugDraw();
        _debugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d")); // test is the id of another canvas which debugdraw works on
        _debugDraw.SetDrawScale(30.0);
        _debugDraw.SetFillAlpha(0.3);
        //_debugDraw.SetLineThickness(1);
        //console.log("--- pass set line thickness");
        _debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
        world.SetDebugDraw(_debugDraw);
        //console.log("?? World "+world);
        //world.DrawDebugData();
    }

});

// ++++ NODE RELATED +++++

function topup(data){
    console.log("--- TOPUP "+data.coin);
    closePopup();
    sendTopup(data);
    openPopup("wait");
}

function sendTopup(data){
    socket.emit("topup",data);
}

function sendStandout(data){
    socket.emit("standout", data);
}

function sendSignout(data){
    socket.emit("signout", data);
}


function resetPlayerStatus(){
    console.log("+++++ RESET PLAYER STATUS");
    playerCoin = 0;
    playerScore = 0;
    posToJoin = null;

    isPlayer = false;
    activeCannon = null;
    cannonType = null;
    cannonSize = 1;

    removeLayerChild(commonButtonLayer);
    initCommonButtons(false);
    removeScreenListener();
}

function spreadToOther(type, object){
    var data = object;
    var broadcastType = "";
    switch (type){
        /*case "new_fish":
            broadcastType = "new_fish";
            break;

        case "change_angle":
            broadcastType = "change_fish_angle";
            break;
        */


        case "change_cannon_size":
            broadcastType = "change_cannon_size";
            break;

        case "change_cannon_angle":
            broadcastType = "change_cannon_angle";
            break;

        case "checkin":
            broadcastType = "checkin";
            break;

        case "new_bullet":
            broadcastType = "shot";
            break;

        case "hit":
            broadcastType = "hit";
            break;
    }
    data.roomid = roomname;
    socket.emit(broadcastType, data);
}

function sendCheckConnection(){
    socket.emit("check_connection");
}

function setCannonSize(data){
    var _id = data.type;
    var _cannon = getCannonLayerById(_id);
    if(_cannon){
        _cannon.changeCannonSize(data.size)
    }

    return;
}



function changeCannonAngle(data){
    var _id = data.type;
    var _cannon = getCannonLayerById(_id);
    //console.log("--- CHANGE ANGLE "+_name+" got it? "+_fish);
    //console.log("--- CHANGE ANGLE "+_name+"-- "+_fish);
    if(_cannon){
        _cannon.shot();
        _cannon.setChangeRotation(data.rot);
        //_cannon.changeCannonSize(data.size)
    }

    return;
}

function getCannonLayerById(id){
    var i = 0;
    var _children = cannonLayer.getChildren();

    while(i < _children.length){
        var _child = _children[i];
        if(_child.id == id){
            return _child;
        }
        //console.log(i+" -- "+_child.name);
        i++;
    }

    return null;
}

function destroyBullet(name){
    var data = {};
    data.name = name;
    spreadToOther("remove_bullet", data);
}

function removeBullet(data){
    var _name = data.name;
    var _bullet = getBulletLayerByName(_name);
    //console.log("--- REMOVE BULLET "+_name);
    if(_bullet){
        _bullet.destroy();
    }

    return;
}

function removeFish(data){
    var _name = data.name;
    var _fish = getFishLayerByName(_name);
    //console.log("--- CHANGE ANGLE "+_name+" got it? "+_fish);
    //console.log("--- CHANGE ANGLE "+_name+"-- "+_fish);
    if(_fish){
        _fish.destroy();
    }

    return;
}

function changeFishAngle(data){

    var _name = data.name;
    var _fish = getFishLayerByName(_name);
    if(_fish){
        _fish.angle = data.angle;
    }

    return;
}

function getBulletLayerByName(name){
    var i = 0;
    var _children = bulletLayer.getChildren();

    while(i < _children.length){
        var _child = _children[i];
        if(_child.name == name){
            return _child;
        }
        i++;
    }

    return null;
}

function getFishLayerByName(fishname){
    var i = 0;
    var _children = fishLayer.getChildren();

    while(i < _children.length){
        var _child = _children[i];
        if(_child.name == fishname){
            return _child;
        }
        //console.log(i+" -- "+_child.name);
        i++;
    }

    return null;
}

function sendPositionToServer(){
    var i;
    var currentObj;
    var data = {};
    var _obj;
    // FISH
    var _fishdata = [];
    for(i=0; i<fishList.length; i++){
        currentObj = fishList[i];
        _obj = {};
        _obj.name = currentObj.name;
        _obj.isFlip = currentObj.isFlip;
        _obj.angle = currentObj.angle;
        _obj.x = currentObj.x;
        _obj.y = currentObj.y;
        _obj.typeId = currentObj.typeId;
        _obj.score = currentObj.score;
        _obj.life = currentObj.life;

        _fishdata.push(_obj);
    }

    // BULLET
    var _bulletdata = [];
    for(i=0; i<bulletList.length; i++){
        currentObj = bulletList[i];
        _obj = {};
        _obj.name = currentObj.name;
        _obj.isFlip = currentObj.isFlip;
        _obj.angle = currentObj.angle;
        _obj.x = currentObj.x;
        _obj.y = currentObj.y;
        _obj.typeId = currentObj.typeId;
        _obj.score = currentObj.score;
        _obj.life = currentObj.life;

        _bulletdata.push(_obj);
    }

    data.roomid = roomname;
    data.fishdata = _fishdata;
    data.bulletdata = _bulletdata;

    //socket.emit("game_update", data);
    //sendAllData(data);
}

// ==== BOX2D ======
function checkCollide(){
    for (var b = world.GetBodyList(); b; b = b.GetNext()) {
        if(b!==null && b.GetUserData()){
            var userData = b.GetUserData().type;

             if(b.GetUserData()!== null && b.GetUserData().type == "bullet"){
                 for(var c = b.GetContactList(); c; c= c.m_next){
                     if(c.other.GetUserData() && c.other.GetUserData().type !== "bullet"){
                         var _bullet = b.GetUserData().asset;
                         var _fish = c.other.GetUserData().asset;
                         var _bulletLife = _bullet.getLife();
                         var isFromOrigin = _bullet.isFromOrigin();
                         var data = {};
                         data.bulletName = _bullet.getName();
                         data.bulletPosition = _bullet.getPosition();
                         //_bullet.destroy();
                         var isPass = true;//checkGoldenTicket(c.other.GetUserData().type);
                         if(isPass){
                             createFX("bullet", _fish.x, _fish.y);
                             if(_fish.hit(_bulletLife)){
                                 if(isFromOrigin){
                                     data.fishName = _fish.name;
                                     data.fishX = _fish.x;
                                     data.fishY = _fish.y;
                                     data.fishtype = _fish.getType();
                                     spreadToOther("hit", data);
                                    //createCoinAnimation(_fish.x, _fish.y);
                                 }
                                 //if(_fish.getType() == "fish4") {
                                    createFX("bomb", _fish.x, _fish.y);
                                 //}

                                 createCoinAnimation(_fish.x, _fish.y);
                                 removeShapeBody(_fish, "fish");
                             }else{
                                 //destroyBullet(data.bulletName);
                             }
                         }

                         destroyBullet(data.bulletName);
                         _bullet.destroy();
                     }
                 }
             }
        }
    }
}


function checkPointCollide(checkpoint){
    console.log("--- Check Point: "+checkpoint.x+" , "+checkpoint.y);
    for(var i=0; i < fishList.length; i++){
        var j = (fishList.length -1) - i;
        var _thefish = fishList[j];
        if(_thefish.checkPointCollide(checkpoint)){
            return _thefish.getName();
        }
    }

    return null;
}

/*
function checkPointCollide(checkpoint){
    console.log("--- Check Point: "+checkpoint.x+" , "+checkpoint.y);
    var tFish = 0;

    for (var b = world.GetBodyList(); b; b = b.GetNext()) {
        //console.log("-- body: "+b+" - userdata: "+ b.GetUserData());
        if(b!==null && b.GetUserData()){
            var userType = b.GetUserData().type;
            console.log("*** Name: "+b.GetUserData().asset.name);

            if(b.GetUserData()!== null && userType !== "bullet"){
                var fixture = b.GetFixtureList();
                var i = 0;
                //while(user){
                for (; fixture; fixture = fixture.GetNext()){
                    //var isHit = fixture.TestPoint(checkpoint);

                    if(fixture.TestPoint(checkpoint)){
                        console.log("++++ "+fixture+" -- check: "+fixture.TestPoint(checkpoint));
                        var fishAsset = b.GetUserData().asset;
                        return fishAsset.getName();
                    }

                    //user.GetNext();
                    i++;
                }

                console.log("Total fixture: "+i);

            }
        }
        tFish ++;

    }

    console.log("Total fish: "+tFish);

    return null;
}
*/

function updateWorldPosition(){
    for (var b = world.GetBodyList(); b; b = b.GetNext()) {
        if(b!==null && b.GetUserData()){
            var asset = b.GetUserData().asset;
            var b2Pos = new Box2D.Common.Math.b2Vec2(asset.getPositionX()/meter,asset.getPositionY()/meter);
            var b2Rot = -1 * (cc.degreesToRadians(asset.getRotation()));
            //b.SetTransform(b2Pos, b2Rot);
            b.SetPosition(b2Pos);
            b.SetAngle(b2Rot);
        }
    }
}
function getSpriteBody(asset, type){
    for (var b = world.GetBodyList(); b; b = b.GetNext()) {
        if(b.GetUserData()!== null && b.GetUserData().asset !== null && b.GetUserData().asset == asset){
            return b;
        }
    }

    return null;
}

function removeShapeBody(asset, type){
     var b = getSpriteBody(asset, type);
     if(b !== null){
        world.DestroyBody(b);
     }
 }

// ++++++++++ LAYERS +++++++++++++++++
function settingUp(data){
    initBackground();
    //if(isDriver) {
        //initFishes(total_fish);
   // }else{
    //this.fishes.push({fish:this.makeFish()});
        initDrivenFishes(data.fishdata);
    //}

    //showFishes()

    setUpCannon(data.cannonList);
    initScoreDisplay(data.playerList);
    //setUpScore(data.playerList);
    removeLayerChild(commonButtonLayer);
    initCommonButtons(false);

    isReady = true;

    //openPopup("connection_lost");

}

function setUpScore(position, score){
    var _score = getScoreLayerByPosition(position);
    if(_score !== null){
        _score.updateDisplay(score);
    }else{

    }

}

function setUpCoin(position, coin){
    var _coin = getCoinLayerByPosition(position);

    if(_coin !== null){
        _coin.updateDisplay(coin);
    }
}

function setUpCannon(data){
    removeLayerChild(cannonLayer);
    initCannonList(data);
    initCannons();
}

function showFishes(){
    //console.log("==== SHOW AFTER");
    for(var i=0; i < fishList.length; i++){
        //console.log(i+" - "+fishList[i].name);
    }
}

function removeLayerChild(layer){
    layer.removeAllChildren();
}

// FISH LAYER
var fish_layer = cc.Layer.extend({
   init: function () {
       this._super();
       if(isDriver) {
           initFishes(total_fish);
       }

   }
});

// POPUP LAYER
function openPopup(type){
    if(!isIdleOnPopUp) {
        closePopup();

        popup = new popupItem(type);
        popupLayer.addChild(popup);
    }
}

function closePopup(){
    //console.log("===== CLOSE POPUP");
    if(popup){
        popup.destroy();
        popup = null;
        isIdleOnPopUp = false;
    }
}


// BACKGROUND LAYER
function initBackground(){
    var target = new cc.Sprite(asset_folder+"game_bg_2_hd.jpg");
    //var target = new cc.Sprite(asset_folder+"popup_bg.jpg");
    var scaleFactor = resize(target.width, target.height);
    console.log("W: "+target.width+" H: "+target.height+" -- "+scaleFactor);
    //console.log("Screen W: "+screen_width+" h: "+screen_height)
    target.setScale(scaleFactor);
    target.setAnchorPoint(0,0);
    backgroundLayer.addChild(target);
}


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


// SCORING AND COINS

function getScoreLayerByPosition(position){
    var i = 0;
    var _children = scoreLayer.getChildren();

    while(i < _children.length){
        var _name = "score_"+position;
        var _child = _children[i];
        if(_child.name == _name){
            return _child;
        }
        i++;
    }

    return null;
}

function getCoinLayerByPosition(position){
    var i = 0;
    var _children = scoreLayer.getChildren();

    while(i < _children.length){
        var _name = "coin_"+position;
        var _child = _children[i];
        if(_child.name == _name){
            return _child;
        }
        i++;
    }

    return null;
}

function addScoreDisplay(position, score, coin){
    var _current = getPositionData(position);
   // console.log("ADD SCORE DISPLAY");
    if(_current !== null){
        //console.log("---- pos of :"+_current.pos);
        addScoreItem(_current.id, _current.pos, _current.x, _current.y, _current.oriRot,  score);
        addCoinItem(_current.id, _current.pos, _current.x, _current.y, _current.oriRot,  coin);
    }
}

function addScoreItem(id, pos, x, y, angle, score){
    var Score = new scoreItem(id, pos, x, y, angle,  score);
    scoreLayer.addChild(Score);

}

function addCoinItem(id, pos, x, y, angle, coin){
    var Coin = new coinItem(id, pos, x, y, angle,  coin);
    scoreLayer.addChild(Coin);

}


function initScoreDisplay(data){
    removeLayerChild(scoreLayer);

    //console.log("==== INIT SCORE DISPLAY");
    if(data.length > 0){
        for(var i=0; i < data.length; i++) {
            var _player = data[i];
            addScoreDisplay(_player.position, _player.score, _player.coin);
            /*
            var _current = getPositionData(_player.position);
            if(_current !== null){
                var Score = new scoreItem(_current.id, _current.pos, _current.x, _current.y, _current.angle,  _player.score);
                scoreLayer.addChild(Score);

                var Coin = new coinItem(_current.id, _current.pos,  _current.x, _current.y, _current.angle, _player.coin);
                scoreLayer.addChild(Coin);
            }
            */
        }
    }
}

function getPositionData(pos){
    for(var i=0; i < cannon_list.length; i++) {
        var _current = cannon_list[i];
        if(pos == _current.id){
            return _current;
        }
    }

    return null;
}

// ++++++++++++++++++++++++++++++++++++++


// CANNONS
var cannon_layer = cc.Layer.extend({
    init:function(){
        this._super();
    }
});

function initCannons(){
    removeLayerChild(cannonBGLayer);
    //removeLayerChild(cannon_layer);

    //console.log("++++ INIT CANNON");
    for(var i=0; i < cannon_list.length; i++) {
        var _current = cannon_list[i];
        //console.log("-- "+_current.pos+" - active? "+_current.active);
        var Cannon = new cannonItem(_current.id, _current.pos,  _current.x, _current.y, _current.angle, _current.active, _current.size);
        //cannonLayer.addChild(Cannon);

        if(_current.active){
            var CannonBG = new cannonItemBG(_current.id, _current.pos,  _current.x, _current.y, _current.addRot);
            cannonBGLayer.addChild(CannonBG);

            cannonLayer.addChild(Cannon);
            //isReady = true;
            //initScreenListener();
        }else{
            if(activeCannon == null){
                cannonLayer.addChild(Cannon);
            }
        }

        if(_current.id == cannonType){
            activeCannon = Cannon;
        }
    }
}

function changeCannonSize(value){
    var _size = cannonSize + value*1;
    if(_size > maxCannonSize){
        cannonSize = maxCannonSize;
    }else if(_size <= 1){
        cannonSize = 1;
    }else{
        cannonSize = _size;
    }

    activeCannon.changeCannonSize(cannonSize);

    var data = {};
    data.type = activeCannon.id;
    data.rot = activeCannon.rot;
    data.size = activeCannon.size;

    spreadToOther("change_cannon_size", data);
}

function setPlayer(id){
    isPlayer = true;
    cannonType = id;
    removeCannonListener();
    removeLayerChild(cannonLayer);
    markCannonPlayer(id);

    removeLayerChild(commonButtonLayer);
    initCommonButtons(true);
    initCannons();
    initScreenListener();
}

function removeCannonListener(){
    var _children = cannonLayer.getChildren();
    for(var i = 0; i < _children.length; i++){
        var _child = _children[i];
        _child.removeListener();
    }
}

function getPlayerCannon(){
    var _children = cannonLayer.getChildren();
    var _rotation = 0;

    for(var i = 0; i < _children.length; i++){
        var _child = _children[i];
        if(_child.name == "cannon_"+cannonType){
            return _child;
        }
    }

    return null;
}

function initScreenListener(){
    screenListener = shot_click_listener.clone();
    cc.eventManager.addListener(screenListener,fishLayer);
}

function removeScreenListener(){
    cc.eventManager.removeListener(screenListener);
    screenListener = null;
}


var shot_click_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();
        var location = target.convertToNodeSpace(touch.getLocation());
       // console.log("--- CLICK TO SHOT");
        if(!isIdleOnPopUp){
            if(isPlayer && isReady){
                isAutoShoot = false;

                var isRelease = true;

                if(isAutoLock){
                    isRelease = false;
                    if(targetLock == null){
                        targetLock = checkPointCollide(location);
                      //  console.log("TARGET LOCK "+targetLock);

                        if(targetLock != null){
                            removeBulletIdle();
                        }
                    }else{
                        isAutoLock = false;
                        targetLock = null;
                        isRelease = true;
                    }
                }

                if(!isBulletIdle && isRelease){

                    shotNewBullet(location.x, location.y, true);

                    //if(!checkButtonList(location)){
                    /*
                    var _cannon = getPlayerCannon();
                    if(_cannon !== null){
                        var _rotation = _cannon.changeRotation(location.x, location.y);
                        _cannon.shot();

                        //var data = setPlayerCannon(location.x, location.y);
                        var data = {};
                        data.type = _cannon.id;
                        data.rot = _cannon.rot;
                        data.size = _cannon.size;
                        spreadToOther("change_cannon_angle", data);

                        var bulletX = _cannon.getPositionX();
                        var bulletY = _cannon.getPositionY();
                        var bulletAngle = _cannon.rot;
                        var bulletSize = _cannon.size;

                        var bulletName = "bullet_"+cannonType+"_"+bulletIndex;
                        bulletIndex++;

                        if(bulletIndex > maxBulletIndex){
                            bulletIndex = 0;
                        }

                        var dataBullet = {};
                        dataBullet.type = _cannon.id;
                        dataBullet.x = bulletX;
                        dataBullet.y = bulletY;
                        dataBullet.angle = bulletAngle;
                        dataBullet.size = bulletSize;
                        dataBullet.name = bulletName;
                        spreadToOther("new_bullet", dataBullet);

                        initBullet(bulletX,bulletY,bulletAngle, bulletSize, bulletName, null, null);
                        isBulletIdle = true;
                        bulletIdleTimeout = setTimeout(removeBulletIdle, bulletIdleTime*1000);
                    }
                    */
                    //}
                   // console.log("--- CLICK TO SHOT");
                }
            }
        }
    }
});

function shotNewBullet(x,y, isRotate){
    var _cannon = getPlayerCannon();
    if(_cannon !== null){
        if(isRotate){
            var _rotation = _cannon.changeRotation(x, y);

            var data = {};
            data.type = _cannon.id;
            data.rot = _cannon.rot;
            data.size = _cannon.size;
            spreadToOther("change_cannon_angle", data);
        }

        _cannon.shot();

        var bulletX = _cannon.getPositionX();
        var bulletY = _cannon.getPositionY();
        var bulletAngle = _cannon.rot;
        var bulletSize = _cannon.size;

        var bulletName = "bullet_"+cannonType+"_"+bulletIndex;
        bulletIndex++;

        if(bulletIndex > maxBulletIndex){
            bulletIndex = 0;
        }

        var dataBullet = {};
        dataBullet.type = _cannon.id;
        dataBullet.x = bulletX;
        dataBullet.y = bulletY;
        dataBullet.angle = bulletAngle;
        dataBullet.size = bulletSize;
        dataBullet.name = bulletName;
        spreadToOther("new_bullet", dataBullet);

        initBullet(bulletX,bulletY,bulletAngle, bulletSize, bulletName, null, null);
        isBulletIdle = true;
        bulletIdleTimeout = setTimeout(removeBulletIdle, bulletIdleTime*1000);
    }
}

function checkButtonList(location){
    for(var i = 0; i<buttonList.length;i++){
        var target = buttonList[i];
        var targetLocation = target.convertToWorldSpace(target.getPosition());
       // console.log("--- Target X,Y: "+(targetLocation.x-target.width/2)+","+(targetLocation.y+target.height/2)+" of W,H: "+target.width+","+target.height);
        //console.log("--- Location X,Y: "+location.x+","+location.y);

        var targetSize = target.getContentSize();
        var targetRect = cc.rect(targetLocation.x-target.width/2,targetLocation.y+target.height/2,targetSize.width,targetSize.height);
        if(cc.rectContainsPoint(targetRect, location)){
           // console.log("CLIck on "+target);
            return true;
        }
    }
    return false;
}


function removeBulletIdle(){
    if(bulletIdleTimeout){
        clearTimeout(bulletIdleTimeout);
        bulletIdleTimeout = null;
    }

    isBulletIdle = false;

    if(isAutoLock){
        autoLockBullet();
    }

    if(isAutoShoot){
        autoShotBullet();
    }

}

// AUTO SHOT * LOCK
function autoLockBullet(){
    if(targetLock != null){
        var fish = getFishLayerByName(targetLock);
        if(fish == null){
            isAutoLock = false;
            targetLock = null;
        }else{
           //shotNewBullet(fish.x, fish.y, true);
            shotNewBullet(fish.getPositionX(), fish.getPositionY(), true);
        }

    }
}

function autoShotBullet(){
    shotNewBullet(0,0, false);
}


// BULLETS
function initBullet(x, y, rot, size, fname, speedX, speedY){
    //console.log("+++ INIT BULLET Name: "+fname+" x: "+x+" y: "+y+" rot: "+rot+" size: "+size);
    var bName = fname;
    /*if(bName == null){
        bName = "bullet_"+cannonType+"_"+bulletIndex;
        bulletIndex++;

        //broadcast here

        var data = {};
        data.x = x;
        data.y = y;
        data.angle = rot;
        data.size = size;
        data.name = bName;
        spreadToOther("new_bullet", data);

    }*/
    /*
    if(bulletIndex > maxBulletIndex){
        bulletIndex = 0;
    }*/

    var Bullet = new bulletItem(x,y,rot, size, bName, speedX, speedY);
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
function initCommonButtons(isAllVisible){
    var bttn;
    var src;
    var initX = 30;
    var initY = screen_height - 60;

    var spacing = 10;

    // auto shot
    src = asset_folder+getSource("bttn_auto_shot");
    bttn = new cc.Sprite(src);
    commonButtonLayer.addChild(bttn);
    initX += bttn.width/2;

    bttn.setPosition(initX, initY);
    initX += bttn.width + spacing;
    cc.eventManager.addListener(auto_shot_listener.clone(),bttn);

    bttn.visible = isAllVisible;

    // auto target
    src = asset_folder+getSource("bttn_auto_target");
    bttn = new cc.Sprite(src);
    commonButtonLayer.addChild(bttn);
    bttn.setPosition(initX, initY);

    initX = screen_width - bttn.width/2 - 30;
    cc.eventManager.addListener(auto_target_listener.clone(),bttn);

    bttn.visible = isAllVisible;

    // leave
    src = asset_folder+getSource("bttn_leave");
    bttn = new cc.Sprite(src);
    commonButtonLayer.addChild(bttn);
    bttn.setPosition(initX, initY);
    cc.eventManager.addListener(leave_listener.clone(),bttn);

    initX -= (bttn.width + spacing);
    bttn.visible = isAllVisible;

    if(!isAllVisible){
        bttn.visible = true;
    }else{
        //bttn.visible = isAllVisible;
    }

    // standout
    src = asset_folder+getSource("bttn_standout");
    bttn = new cc.Sprite(src);
    commonButtonLayer.addChild(bttn);
    bttn.setPosition(initX, initY);
    cc.eventManager.addListener(standout_listener.clone(),bttn);

    bttn.visible = isAllVisible;

}

var auto_shot_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch

    onTouchBegan:function(touch, event){

        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(!isIdleOnPopUp) {
            if (cc.rectContainsPoint(targetRect, location)) {
                // console.log("AUTO SHOT");
                if (!isAutoShoot) {
                    isAutoShoot = true;
                    isAutoLock = false;
                    removeBulletIdle();
                }

                return true;
            }
            return false;
        }
    }
});

var auto_target_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch

    onTouchBegan:function(touch, event){

        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(!isIdleOnPopUp) {
            if (cc.rectContainsPoint(targetRect, location)) {
                //console.log("AUTO TARGET");
                if (!isAutoLock) {
                    isAutoLock = true;
                    isAutoShoot = false;
                    removeBulletIdle();
                }

                return true;
            }
            return false;
        }
    }
});

var leave_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch

    onTouchBegan:function(touch, event){

        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(!isIdleOnPopUp) {
            if (cc.rectContainsPoint(targetRect, location)) {
                console.log("LEAVE");
                // popup confirmation
                //initiatePopup("signout");
                openPopup("signout");
                return true;
            }
            return false;
        }
    }
});

var standout_listener = cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,//tells the game that you are waiting for touches, but only one at a time
    swallowTouches:true, //ignore all touches when there's one active touch

    onTouchBegan:function(touch, event){

        var target = event.getCurrentTarget();
        //getLocation -- coordinates of the touch or click inside the game
        //convertToNodeSpace -- convert getLocation coordinates into the coordinates relative to the object itself
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRect = cc.rect(0,0,targetSize.width,targetSize.height);
        if(!isIdleOnPopUp) {
            if (cc.rectContainsPoint(targetRect, location)) {
                console.log("STANDOUT");
                //initiatePopup("standout");
                openPopup("standout");
                return true;
            }
            return false;
        }
    }
});

// FISHES
function checkGoldenTicket(type){
    for(var i=0; i < goldenTicket.length; i++){
        if(goldenTicket[i].id == type){
            return false;
        }
    }
    return true;
}

function initFishes(totalFish){
    for(var i=0; i < totalFish; i++){
        var newFish = createNewFish();
        if(isDriver){
            var datasend = {};
            //datasend.roomid = roomname;
            datasend.name = newFish.name;
            datasend.typeId = newFish.typeId;
            datasend.isFlip = newFish.isFlip;
            datasend.x = newFish.x;
            datasend.y = newFish.y;
            datasend.angle = newFish.angle;
            //spreadToOther("new_fish", datasend);
        }
    }
}

function initDrivenFishes(data){
    var _index = 0;
    //console.log("+== Init Driven Fishes "+data.length);
    for(var i = 0; i < data.length; i++){

        var current = data[i];
        var _typeid = getTypeId(current.type);
        var fName = current.name;
       // console.log(i+" - "+fName+" type: "+current.type+" typeId: "+_typeid+" x: "+current.x+" y: "+current.y+" flip: "+current.isFlip+" angle: "+current.angle);
        var Fish = new fish(_typeid, current.isFlip, current.x, current.y, fName, current.angle);
        Fish.name = fName;
        fishLayer.addChild(Fish);
        fishList.push(Fish);
    }
    //fishIndex = fishPosList.length;
    //checkInsideFishLayer();
    //checkInsideFishLayer();
}

function getTypeId(typeName){
    var i = 0;
    while(i < fishassets.length){
        if(typeName == fishassets[i].id){
            return i;
        }
        i++;
    }
    return 0;
}

function checkInsideFishLayer(){
    var i = 0;

    var _children = fishLayer.getChildren();

    while(i < _children.length){
        var _child = _children[i];
        //console.log(i+" -- "+_child.name);
        i++;
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
    var fName = "fish"+fishIndex;
    fishIndex++;

    if(fishIndex > maxFishIndex){
        fishIndex = 0;
    }

    var Fish = new fish(randId, flip, randomX, randomY, fName, 0);
    fishLayer.addChild(Fish);

   // game.addBody(Fish.getPositionX(), Fish.getPositionY(), Fish._getWidth(), Fish._getHeight(), true, Fish, "fish", Fish.life);

    fishList.push(Fish);

    return Fish;
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

// COINS
function createCoinAnimation(x,y){
    var Coin = new coin(x,y);
    coinLayer.addChild(Coin);
}

function removeCoin(sprite){
    if(sprite !== null){
        coinLayer.removeChild(sprite);
    }
}

// FX
function createFX(type, x,y){
    var hitFX;
    switch (type){
        case "bullet":
            hitFX = new bullethit(x,y);
            break;

        case "bomb":
            hitFX = new bombhit(x,y);
            break;
    }

    coinLayer.addChild(hitFX);
}

/*
function createBulletHit(x,y){
    var hitFX = new bullethit(x,y);
    coinLayer.addChild(hitFX);

}


function createBombAnimation(x,y){
    var hitFX = new bombhit(x,y);
    coinLayer.addChild(hitFX);

}
*/

function removeBulletHit(sprite){
    if(sprite !== null){
        coinLayer.removeChild(sprite);
    }
}

// ++++ ROOMS ++++++++++
function outOfRoom(){
    isConnect = false;
    //initiatePopup("connection_lost");
    openPopup("connection_lost");
    //showPreloaderMessage("Connection lost, please refresh when connection ready...");
    //showCommonCanvas(true);

}

function showPreloaderMessage(message){
    var _container = document.getElementById('preloader');
    _container.innerHTML = "";

    _container.innerHTML="<canvas id='common' style='z-index: 6; position:absolute; left:0px; top:0px;' height='640px' width='1024'></canvas>"

    var canvas = document.getElementById('common');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, cWidth, cHeight);
    context.save();
    context.translate(posX+cWidth / 2, cHeight / 2);

    context.font = '18pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#FFF';
    context.fillText(message, 0, 0);
    context.fill();
    context.restore;
}

function preloaderUpdate(percentage){
    showPreloaderMessage("Loading assets "+percentage+" %");
}

function showCommonCanvas(isShow){
    var canvas = document.getElementById('preloader');
    if(isShow){
        canvas.style.display = "initial";
    }else{
        canvas.style.display = "none";
    }
}

function setStandout(){ // LEAVE
    console.log("+++++ SEND STANDOUT");
    var data = {};

    data.playerid = playerid;
    //data.id = playerSId;
    data.roomid = roomname;
    data.position = cannonType;
    //data.score = score;
    //data.coin = coin;
    sendStandout(data);
    closePopup();
}

function setSignout(){
    var data = {};
    data.playerid = playerid;
    //data.id = playerSId;
    data.roomid = roomname;
    data.position = posToJoin;
    //data.score = score;
    //data.coin = coin;
    sendSignout(data);
    closePopup();
}


function showCountdown(counter){
    $("#countdown").html("<h2><B>"+counter+" seconds left </B></h2>");
}

function showRunningOfCoinPopup(type){
    if(!isIdleOnPopUp){
        console.log("++++ SHOW RUNNING OF COIN POPUP "+type);

        //generatePopup(type);
        openPopup("not_enough_coin");
    }
}

/*

function showProcessPreloader(){
    console.log("-- SHOW PROCESS PRELOADER");
    //closePopup();
    generatePopup("loader");
    openPopup();
    return;
}
*/

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