var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var view = '/view/';

var userPerRoom = 4;
var currentRoom = 0;
var Generator = require('./game/generator');
var Rooms = require('./game/rooms');
var Global = require('./globals');

var rooms = new Rooms();

process.env.PWD = process.cwd();
//app.use(express.static(process.env.PWD));
//app.engine('.html', require('ejs').__express);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', __dirname + view);

app.get('/', function (req, res) {
    console.log("+++ GET");
    console.log("-- Author: "+Global.authorname+" - "+Global.domain);
    checkRoomId(req, res);
});

app.post('/game', function (req, res) {
   console.log("+++ POST ");
   checkRoomId(req, res);
});


function checkRoomId(req, res){
    res.header("CacheControl", "no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0");    
    //console.log("--- body room id: "+req.body.roomId);
    if(req.body.roomId == null){
        //console.log("--- no room id yet");
        res.render('index');
    }else{
        //console.log('Start the game of '+req.body.roomId);
        selectRoom(req.body.roomId);
        res.render('fishgame', {roomId:req.body.roomId});
    }
}

function selectRoom(roomid){
    var selectedRoom = rooms.getRoomById(roomid);
    var _cannon = getCannonListByNumber(selectedRoom.cannon);
        
    //console.log("-- total cannon: "+selectedRoom.cannon+" from "+roomid);
    
    var _cannonList = rooms.getCannonList(roomid);
    if(_cannonList.length < 1){
        rooms.setCannonListByRoomId(roomid, _cannon);
    }
    return;
}

io.on('connection', function (socket){
    console.log('----- user connects');
    
    //setInterval(generateAllEngine, Global.duration*1000);
    //setTimeout(generateAllEngine, GLobal.duration*1000);
    
    socket.on('test', function(){
       console.log("-- after change pageid on server "+socket.id); 
    });
    
    socket.on('createroom', function(data){
        console.log("CREATE ROOM REQUEST");
        var clientdata = data;
        var selectedDisplay = data.display;
        var selectedW = Global.displayList[selectedDisplay].w;
        var selectedH = Global.displayList[selectedDisplay].h;
        var selectedCannon =  Global.maxCannonList[data.cannon];
        var selectedMinBuy = Global.minBuyList[data.minBuy];
        var selectedMaxBuy = Global.maxBuyList[data.maxBuy];
        //console.log("-- selected Min: "+selectedMinBuy+" - Max: "+selectedMaxBuy+" -- Cannon: "+selectedCannon);
        var _cannon = getCannonListByNumber(selectedCannon);
        
        var game = null;//setGame(Global.initialFishNo, selectedW, selectedH, _cannon);
        var socketid = socket.id;
        var playerid = clientdata.playerid;
        var newRoom = rooms.addRoom(clientdata.name, game, selectedW, selectedH, selectedCannon, selectedMinBuy, selectedMaxBuy);
        //rooms.addPlayer(newRoom, socketid, playerid, 0);
        
        // move to game page
        
        var _obj = rooms.getRoomById(newRoom);
        console.log("---- "+_obj.roomname+"("+_obj.id+") W: "+ _obj.w+" H: "+ _obj.h+" Min: "+_obj.minBuy+" Max: "+_obj.maxBuy+" Cannon: "+_obj.cannon);

        //io.to(socketid).emit('enter_room', _obj);
        io.emit('new_room_item',  _obj);
    });
    
    /*
    socket.on('selectroom', function(data){
        var clientdata = data;
        var socketid = socket.id;
        console.log("-- id on server "+socketid);
        
        //rooms.addPlayer(clientdata.id, socketid, clientdata.playerid, 0);
        var selectedRoom = rooms.getRoomById(clientdata.id);
        var _cannon = getCannonListByNumber(selectedRoom.cannon);
        
        console.log("-- total cannon: "+selectedRoom.cannon+" from "+clientdata.id);
        
        var _cannonList = rooms.getCannonList(clientdata.id);
        if(_cannonList.length < 1){
            rooms.setCannonListByRoomId(clientdata.id, _cannon);
        }
        io.to(socketid).emit('enter_room', selectedRoom);
    });
    */
    
    socket.on('initiate', function(data){
        var clientdata = data;
        var playerid = clientdata.playerid;
        var socketid = socket.id;
        socket.room = clientdata.id;
        var selectedRoom = rooms.getRoomById(clientdata.id);
        
        var _g = selectedRoom.game;
        //console.log("---- SOCKET INITIATE "+socketid);
        if(_g == null){             
            _g = selectedRoom.game = setGame(Global.initialFishNo, selectedRoom.w, selectedRoom.h, selectedRoom.cannonList);
            //console.log("--- GAME is Set "+selectedRoom.game);
        }
        
        var _cannonList = selectedRoom.cannonList;
        //console.log("Cannon List ", _cannonList+" -- "+_cannonList.length);
        for(var i=0; i < _cannonList.length; i++){
            //console.log(_cannonList[i].id+" - "+_cannonList[i].player);
        }
        
        rooms.addPlayer(selectedRoom.id, socketid, clientdata.playerid, 0, 0, 0, null);
        
        var _passdata = selectedRoom;
        _passdata.sid = socketid;
        _passdata.fps = (1/Global.fps)*1000;
        io.to(socket.id).emit('prepare', selectedRoom);
    });
    
    socket.on('getroomlist', function(){
        io.to(socket.id).emit('getroomlist', rooms.getRoomList());
    });
    
    socket.on('getcannonpos', function(roomid){
        io.to(socket.id).emit('getcannonpos', rooms.getCannonList(roomid));
    });
    
    socket.on('checkin', function(data){
        //console.log("---- CHECKIN");
        var clientdata = data;
       
        // CHECK PLAYER COIN IS AVAILABLE
        var isAvailable = checkPlayerCoinAvaialable(clientdata.playerid, clientdata.coin);
        
        if(isAvailable){
            // console.log("---- position: "+clientdata.position);
            rooms.changePlayerStatus(clientdata.roomid, socket.id, 1, clientdata.position, clientdata.score, clientdata.coin, clientdata.playerid);

            //updatePlayerListInGenerator(clientdata.roomid);

            socket.room = clientdata.roomid;
            socket.join(clientdata.roomid);
            //io.to(socket.id).emit('initiate', getGameData(socket.room).getUpdate(), newPlayerId);

            var _outputdata = {};
            _outputdata.position = clientdata.position;
            _outputdata.score = clientdata.score;
            _outputdata.coin = clientdata.coin;

            io.to(socket.id).emit('checkin', _outputdata);

            broadcastMessage('new_join', clientdata.roomid, rooms.getCannonList(clientdata.roomid));
        }else{
            io.to(socket.id).emit('not_available_coin');
        }
        
    });

    socket.on('topup', function(data){
        // CHECK PLAYER COIN IS AVAILABLE
        var clientdata = data;
        var isAvailable = checkPlayerCoinAvaialable(clientdata.playerid, clientdata.coin);
        console.log("---- LISTEN TO TOPUP "+clientdata.coin);
        if(isAvailable){
            rooms.changePlayerCoin(socket.id, clientdata.roomid, clientdata.coin);
        }
        
        var _outputdata = {};
        _outputdata.pass = isAvailable;
        
        io.to(socket.id).emit('topup', _outputdata);
    });
    
        
    socket.on('standout', function(data){
        // save coin/score first
        var clientdata = data;
        console.log("--- Get Standout from "+clientdata.roomid+" -- id: "+clientdata.id+ " coin: "+clientdata.coin+" playerid: "+clientdata.playerid);
        rooms.changePlayerStatus(clientdata.roomid, clientdata.id, 0, 0, clientdata.coin, clientdata.playerid);
        //updatePlayerListInGenerator(clientdata.roomid);
        
        var _list = rooms.getCannonList(clientdata.roomid);
        var _data = {};
        _data.cannonList = _list;
        
         io.to(socket.id).emit('standout');
         broadcastMessage('new_join', clientdata.roomid, _list);
    });
    
    
    socket.on('shot', function(data){
        var _g = getGameData(data.roomname);
        if(rooms.checkCoinAvailable(data.roomname, socket.id, data.type)){
            _g.newbullet(data, socket.id);
        }else{
            console.log(" NOT ENOUGH COIN FOR SHOT");
            io.to(socket.id).emit("not_enough_coin");
        }
    });
    
    socket.on('cannon', function(data){
        //var _g = getGameData(socket.room);
        var _g = getGameData(data.roomname);
        _g.setCannon(data.angle, data.id, data.type);
    });
    
    socket.on('change_cannon_type', function(data){
        var _g = getGameData(data.roomname); 
        if(_g !== null){
            _g.setIndividualCannon(data.id, data.type);
        }
    });
        
    socket.on('checkout', function(data){
        // save coin/score first
        var clientdata = data;
        removePlayer(clientdata.roomid, clientdata.sid);
                
        console.log("--- CHECK OUT FROM "+clientdata.roomid);
        
        if(clientdata.roomid){
            console.log("---- AFTER CHECKOUT");
            rooms.showCannonList(clientdata.roomid);
            broadcastMessage('new_join', clientdata.roomid, rooms.getCannonList(clientdata.roomid));
            //io.to(sid).emit('new_join', rooms.getCannonList(clientdata.roomid));
        }
        
        io.to(socket.id).emit('checkout');
        socket.leave(socket.room);

    });
    
    socket.on('disconnect', function(){
        console.log('user disconnect id: '+socket.id+" -- room: "+socket.room);
       
        removePlayer(socket.id, socket.room);
        
        console.log("--- DISCONNECT FROM "+socket.room);
        
        if(socket.room){
            console.log("---- AFTER DISCONNECT");
            rooms.showCannonList(socket.room);
            broadcastMessage('new_join', socket.room, rooms.getCannonList(socket.room));
            //io.to(sid).emit('new_join', rooms.getCannonList(clientdata.roomid));
        }
        
        
        socket.leave(socket.room);
    });
    
    socket.on('check_connection', function(){
        io.to(socket.id).emit('check_connection');
    });
});


// ++++++++ FUNCTIONS ++++++++++++

//setInterval(generateAllEngine, Global.duration*1000);
setTimeout(generateAllEngine, Global.gDuration);

function checkPlayerCoinAvaialable(playerid){
    // some check here
    return true;
}

function broadcastMessage(emitKey, roomid, param){
    //console.log("BROADCAST MESSAGE "+emitKey+" TO "+roomid);
    var _players = rooms.getRoomById(roomid).player;
    //console.log("total player: "+_players.length);
    for(var i=0; i<_players.length; i++){
        var sid = _players[i].socketid;
        io.to(sid).emit(emitKey, param);
    }
}


function generateAllEngine(){
    var _rooms = rooms.getRoomList();
    var totalroom = _rooms.length;
    for(i=0; i < totalroom; i++){
        var _g = _rooms[i].game;

        if(_g !== null){
            _g.update();
        }
    }
    
    update();
    return;
}

function update(){
   // console.log("########## UPDATE")
    var _rooms = rooms.getRoomList();
    var totalroom = _rooms.length;
    for(var i=0; i < totalroom; i++){
        var _g = _rooms[i].game;
        if(_g !== null){
            var _players = _rooms[i].player;
            synchPlayerScore(_players, _g.getBullet());
            _players = _rooms[i].player; 
            
            /*var roomname = _rooms[i].id;
            //console.log("_---- ROOM "+roomname);
            io.to(roomname).emit('update', _g.getUpdate(), _g.getCannon());
            */
            
            for(var j=0; j<_players.length; j++){
                var sid = _players[j].socketid;
                
                io.to(sid).emit('update', _g.getUpdate(), _g.getCannon(), _players);
            }
        }
    }
    setTimeout(generateAllEngine, Global.gDuration);
    return;
}

function synchPlayerScore(playerlist, bulletlist){
    for(var i = 0; i < bulletlist.length; i++){
        var _bullet = bulletlist[i];
        var _bItem = _bullet.item;
        var _id = _bullet.userid;
        for(var j=0; j < playerlist.length; j++){
            var _player = playerlist[j];
            if(_player.socketid == _id){
                if(!_bullet.pickUpScore && _bullet.hit){
                    _bItem.setPickUpScore(true);
                    _player.score += _bullet.score;
                }
                break;
            }
        }
    }
    
    return;
}

function removePlayer(id, rname){
    if(rname){
        rooms.removePlayer(rname, id);
        rooms.removePlayerToCannonlist(rname, id);
        
    }
    
    return;
}

    
function removeRoom(roomid){
    var _g = rooms.getGame(roomid);
    _g.destroy();
    rooms.removeRoom(roomid);
    
}

function setGame(totalFish, w, h, _cannon){
    
    //console.log('+++++ create new game, total fish:', totalFish);
    var _total = totalFish;
    
    //var _cannon = getCannonListByNumber(noOfCannon);
    
    var _engine = new Generator(_total, w, h, _cannon); 
    return _engine;
   // return  gengine.initiate();
}


function getCannonListByNumber(noOfCannon){
    var _cannon = [];
    for(var i=0; i < Global.cannon.length;i++){
        var _cCannon = Global.cannon[i].type;
        for(var j=0; j<_cCannon.length;j++){
            var _type = _cCannon[j];
            if(_type == noOfCannon){
                _cannon.push(Global.cannon[i]);
                break;
            }
        }
    }
    
    return _cannon;
}

function getGameData(rname){
    var data = [];
    var _list = rooms.getRoomList();
    for(var i=0; i < _list.length; i++){
        if(_list[i].id == rname){
            return _list[i].game;
        }
    }
    return data;
}

function saveGameData(rname, data){
    var _list = rooms.getRoomList();
    for(i=0; i < _list.length; i++){
        if(_list[i].id == rname){
            _list[i].game = data;
            break;
        }
    }
    
    return;
}

http.listen(3300, function(){
    console.log('listening on -- Port 3300');
});