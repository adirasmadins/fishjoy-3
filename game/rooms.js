var Global = require('../globals');

// constructor
function Rooms()
{
  this.roomlist = Global.defaultRoomList.slice(0);
  this.currentRoom = this.roomlist.length;
    
  return;
}

// ROOMS - ADD/REMOVE/EDIT

Rooms.prototype.checkRoomName = function(name){
    var total = this.roomlist.length;
    var i=0;
    var testname = name.toLowerCase();
    while(i < total){
        var _availablename = this.roomlist[i].roomname.toLowerCase();
        
        if(_availablename == testname){
            return true;
        }
        
        i++;
    }
    
    return false;
} 

Rooms.prototype.addRoom = function(roomname, game, w, h, cannon, minBuy, maxBuy, cannonList){
    var newRoom = {};
    var player = [];
    var roomid = "room"+this.randomId();
    newRoom.id = roomid 
    newRoom.player = [];
    newRoom.roomname = roomname;
    newRoom.game = game;
    newRoom.cannon = cannon;
    newRoom.minBuy = minBuy;
    newRoom.maxBuy = maxBuy;
    newRoom.w = w;
    newRoom.h = h;
    newRoom.cannonList = [];//cannonList;
    newRoom.active = false;
    newRoom.player_driver = null;
    
    this.roomlist.push(newRoom);
    //this.addPlayer(roomid, playerid, 0);
    this.currentRoom ++;
    return roomid;
}

Rooms.prototype.removeRoom = function(roomid){
    this.roomlist.splice([this.getRoomIndeks()],1);
}
    
Rooms.prototype.randomId = function(){
    var randomId = Math.floor(Date.now() / 1000);
    return randomId;
}


// PLAYER
/*
Rooms.prototype.checkCoinAvailable = function(roomid, sid, bulletType){
   // console.log("--- CHECK COIN AVAILABLE "+sid);
    var _player = this.getPlayerById(roomid, sid);
    var totalType = Global.cannonSizeList.length;
    var _coin = Global.cannonSizeList[totalType - 1].coin;

    if(_player != null){
        if(bulletType < totalType){
            _coin = Global.cannonSizeList[bulletType].coin;
        }
        
        var sisa = _player.coin - _coin;
        //console.log("----- SISA: "+sisa);
        if(sisa < 0 ){
            return false;
        }else{
            _player.coin -= _coin;
            return true;
        }
    }
    
    
    return false;
}
*/

Rooms.prototype.checkCoinAvailable = function(roomid, sid, coinvalue){
    var _player = this.getPlayerById(roomid, sid);
    var pCoin = Number(_player.coin);
    console.log("--- CHECK COIN AVAILABLE "+sid+" coin: "+pCoin+" of value "+coinvalue);

    if(pCoin - Number(coinvalue) > 0){
        return true;
    }

    return false;
}

Rooms.prototype.getPlayerScore = function(sid, roomid){
    var _player = this.getPlayerById(roomid, sid);
    if(_player){
        return Number(_player.score);
    }else{
        return 0;
    }
}

Rooms.prototype.changePlayerScore = function(sid, roomid, score){
    var _player = this.getPlayerById(roomid, sid);
    _player.score = Number(score);
}


Rooms.prototype.getPlayerCoin = function(sid, roomid){
    var _player = this.getPlayerById(roomid, sid);
    if(_player){
        return Number(_player.coin);
    }else{
        return 0;
    }
}

Rooms.prototype.changePlayerCoin = function(sid, roomid, coin){
    var _player = this.getPlayerById(roomid, sid);
    //var pCoin = Number(_player.coin);
    _player.coin = coin;//pCoin + Number(coin);
    //console.log("PLAYER COIN:"+_player.coin);
}

Rooms.prototype.getPlayerById = function(roomid, id){
    //console.log("--- GET PLAYER BY ID: "+id);
    var _destRoom = this.getRoomById(roomid);
    var _player = _destRoom.player;
    var _total = _player.length;
    //console.log("total player: "+_total);
    for(var i=0; i < _total; i++){
        var _cPlayer = _player[i];
        if(_cPlayer.socketid == id){
            //console.log("Found player by id: "+_player.socketid);
            return _cPlayer;
        }
    }
    return null;
}



Rooms.prototype.changePlayerStatus = function(roomid, id, status, cannonpos, score, coin, playerid){
    var result = {};
    result.pass = true;
    result.message = "";
    
    var isPlayerAvaiable = this.getPlayer(roomid, id);
    if(!isPlayerAvaiable.pass){
        this.addPlayer(roomid, id, playerid, 0, score, coin, null);
    }else{
        isPlayerAvaiable.player.status = status;
        isPlayerAvaiable.player.position = cannonpos;
        isPlayerAvaiable.player.score = score;
        isPlayerAvaiable.player.coin = coin;
    }
    
    if(status == 1){
        this.addPlayerToCannonlist(roomid, id, cannonpos);
    }else if(status == 0){
        this.removePlayerToCannonlist(roomid, id);
    }
    return;
}

Rooms.prototype.addPlayer = function(roomid, sid, pid, status, score, coin, position){
    var result = {};
    result.pass = true;
    result.message = "";
    
    var _players = this.getRoomPlayers(roomid);
    if(status == 1){
        if(this.checkTotalPlayer(_players) >= Global.maxPlayer){
            result.pass = false;
            result.message = "There's no available seats in this room."
        }
    }else if(status == 0){
        _players.push({id:pid, socketid:sid, status:status, score:score, coin:coin, position:position})
    }
    
    console.log("ADD PLAYER WITH ID: "+sid+" - Total: "+_players.length);
    
    return result;
}

Rooms.prototype.removePlayer = function(roomid, sid){
   // console.log("REMOVE PLAYER");
    var _players = this.getRoomPlayers(roomid);
    var _rooms = this.getRoomIndeks(roomid);
    var total = _players.length;
    var i=total-1;
   // console.log("B: "+_players.length);
    while(i > -1){
        var playerid = _players[i].socketid;
       // console.log(i+". "+playerid);
        if(playerid == sid){
            _players.splice(i,1);
            // this.roomlist[_rooms].player.splice(i,1);
            //break;
        }
        
        i--;
    }
    
    //console.log("A: "+_players.length);
}

Rooms.prototype.checkTotalPlayer = function(list){
    var counter = 0;
    var total = list.length;
    var i=0;
    while(i < total){
        var playerstatus = list[i].status;
        
        if(playerstatus == 1){
            counter++;
            if(counter > Global.maxPlayer){
                return Global.maxPlayer;
            }
        }
        
        i++;
    }
    
    return counter;
}



// PLAYER TO CANNON - ADD/REMOVE

Rooms.prototype.addPlayerToCannonlist = function(roomid, playerid, cannonid){
    var selectedRoom = this.getRoomById(roomid);
    var _cannonList = selectedRoom.cannonList;
    for(var i=0; i < _cannonList.length; i++){
        var _item = _cannonList[i];
        if(_item.id == cannonid){
            
            _item.player = playerid;
            //console.log("FOUND: "+_item.id+" - player: "+_item.player);
        }
    }
    //console.log("AFTER ADD PLAYER TO CANNONLIST ------");
    //this.showCannonList(roomid);
    /*for(var j=0; j<_cannonList.length; j++){
        var _item = _cannonList[j];
        console.log("----: "+_item.id+" - player: "+_item.player);
    }*/
    return;
}

Rooms.prototype.removePlayerToCannonlist = function(roomid, playerid){
    console.log("==== REMOVE PLAYER "+playerid+" TO CANNON LIST from Room: "+roomid);
    var selectedRoom = this.getRoomById(roomid);
    //console.log("SELECTED ROOM: "+selectedRoom);
    var _cannonList = selectedRoom.cannonList;
    //console.log("CANNON LIST: "+_cannonList);
    for(var i=0; i < _cannonList.length; i++){
        var _item = _cannonList[i];
        if(_item.player == playerid){
            _item.player = null;
            _item.angle = _item.oriRot;
            console.log("REMOVE FOUND: "+_item.id+" - player: "+_item.player+" - ori rot: "+_item.oriRot);
            return;
        }
    }
    
    return;
}

// SETTER
Rooms.prototype.setGame = function(roomid, data){
    this.roomlist[this.getRoomIndeks(roomid)].game = data;
}

Rooms.prototype.removeGame = function(roomid){
    this.roomlist[this.getRoomIndeks(roomid)].game = null;
}

Rooms.prototype.setCannonListByRoomId = function(roomid, list){
    var selectedRoom = this.getRoomById(roomid);
    //var _cannonlist = selectedRoom.cannonList;
    var _cannonlist = [];
    for(var i=0; i<list.length;i++){
        var _cannonCode = list[i].id;
        var _angle = list[i].angle;
        var _oriRot = list[i].oriRot;
        var _bulletType = list[i].bulletType;
        _cannonlist.push({id:_cannonCode, angle:_angle, player:null, bulletType:_bulletType, size:1, oriRot:_oriRot});
    }
    
    selectedRoom.cannonList = _cannonlist;
}

Rooms.prototype.showCannonList = function(roomid){
   //console.log("-- SHOW CANNON LIST");
    var selectedRoom = this.getRoomById(roomid);
    var _list = selectedRoom.cannonList;
    for(var i=0; i<_list.length; i++){
        //console.log("-- "+_list[i].id+" - "+_list[i].player);
    }
}

Rooms.prototype.setPlayerDriver = function (roomid, playersocketid) {
    var selectedRoom = this.getRoomById(roomid);
    selectedRoom.player_driver = playersocketid;
}

// GETTER
Rooms.prototype.getPlayerDriver = function (roomid) {
    var selectedRoom = this.getRoomById(roomid);
    return selectedRoom.player_driver;
}

Rooms.prototype.getPlayer = function(roomid, id){
    var result = {};
    result.pass = false;
    result.player = {};
    result.message = "Player is not available on list";
    var players = this.roomlist[this.getRoomIndeks(roomid)].player;
    
    var total = players.length;
    var i=0;
    while(i < total){
        //var _available = this.roomlist[i].player;
        
        if(players[i].socketid == id){
            result.pass = true;
            result.player = players[i];
            break;
        }
        
        i++;
    }
    
    return result;
    
}

Rooms.prototype.getRoomPlayers = function(roomid){
    var total = this.roomlist.length;
    var i=0;
    while(i < total){
        var _availablename = this.roomlist[i].roomname.toLowerCase();

        if(this.roomlist[i].id == roomid){
            return this.roomlist[i].player;
        }

        i++;
    }
    
    return [];
    
}

Rooms.prototype.getActivePlayers = function(roomid){
    var players = this.roomlist[this.getRoomIndeks(roomid)].player;
    var total = players.length;
    var i=0;
    var result = [];
    while(i < total){
        //console.log(i+" - "+players[i].status+" - pos: "+players[i].position);
        if(players[i].status == 1){
            result.push(players[i]);
        }

        i++;
    }

    return result;

}

Rooms.prototype.getTotalCannon = function(roomid){
    var selectedRoom = this.getRoomById(roomid);
    return  selectedRoom.cannon;
}

Rooms.prototype.getCannonList = function(roomid){
    var selectedRoom = this.getRoomById(roomid);
    var _cannonList = selectedRoom.cannonList;
    
    return _cannonList;
}

Rooms.prototype.getPlayerByCannonPosition = function (roomid, socketid) {
    var _players = this.getRoomPlayers(roomid);
    for(var i=0; i < _players.length; i++){
        var _cPlayer = _players[i];
        if(_cPlayer.socketid == socketid){
            return _cPlayer.position;
        }
    }
    return null;
}

Rooms.prototype.getRoomList = function(){
    return this.roomlist;
}

Rooms.prototype.getRoomByName = function(roomname){
    var total = this.roomlist.length;
    var i=0;
    var testname = roomname.toLowerCase();
    while(i < total){
        var _availablename = this.roomlist[i].roomname.toLowerCase();
        
        if(_availablename == testname){
            return this.roomlist[i];
        }
        
        i++;
    }
    return {};
}

Rooms.prototype.getRoomById = function(roomid){
    var total = this.roomlist.length;
    var i=0;
    while(i < total){
        var _availablename = this.roomlist[i].id;
        
        if(_availablename == roomid){
            return this.roomlist[i];
        }
        
        i++;
    }
    return {};
}

Rooms.prototype.getGame = function(roomid){
    return this.roomlist[this.getRoomIndeks(roomid)].game;
}




Rooms.prototype.getRoomIndeks = function(roomid){
    var total = this.roomlist.length;
    var i=0;
    while(i < total){
        var _availablename = this.roomlist[i].roomname.toLowerCase();
        
        if(this.roomlist[i].id == roomid){
            return i;
        }
        
        i++;
    }
    
    return 0;
    
}

module.exports = Rooms;