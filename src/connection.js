var lastConnectioncheck = 0;
var tick = 0;
var seconds = 1000;
var checkduration = 1*seconds;
var idleLimit = 3*seconds;
var isConnectionLost = false;
var checkerTimeout = null;
var nocoinTimeout = null;
var nocoinduration = 15;
var countdownTimer = null;

var isConnect = true;

var counter = 0;

// +++++++++++++++ FUNCTION +++++++++++++++++++

function startNoCoinTimer(){
    counter = 1;
    nocoinTimeout = setTimeout(setStandout, nocoinduration*1000);
    countdownTimer = setInterval(function(){
        var dCounter = nocoinduration - counter;
        showCountdown(dCounter);
        if(dCounter <= 0){
            removeCountdownTimer();
        }
        counter++;
    }, 1000);
    showCountdown(nocoinduration);
}

function removeCountdownTimer(){
    if(countdownTimer){
        clearInterval(countdownTimer);
    }
}

function removeNoCoinTimer(){
    if(nocoinTimeout){
        clearTimeout(nocoinTimeout);
    }
}

function sendAllData(data){
    socket.emit('update_all_data', data);
}

function sendBulletChanges(data){
    socket.emit('change_cannon_type', data); 
}

function standout(data){
    console.log("---- STANDOUT ----");
    socket.emit("standout", data);
}

function signout(data){
    console.log("----- SIGN OUT -----");
    socket.emit("checkout", data);
}

function topup(data){
    console.log("--- TOPUP "+data.coin);
    removeNoCoinTimer();
    socket.emit("topup",data);
}


function sendJoinRequest(data){
    socket.emit('checkin', data);
}


function tester(){
    socket.emit("test");
}

function readyToGo(data){
    console.log("===== READY TO GO");
    socket.emit('join', data);
}

function startCounter(){
    setTimeout(tickRecord, checkduration);
}

function tickRecord(){
    var d = new Date();
    lastConnectioncheck = d.getTime();
    checkerTimeout = setTimeout(checkConnectionStatus, idleLimit+seconds);
    sendCheckConnection();
}

function checkConnectionStatus(){
    clearTimeout(checkerTimeout);
    var d = new Date();
    var delta = d.getTime() - lastConnectioncheck;
    //console.log(delta+" of "+idleLimit);
    //console.log(delta+" of "+idleLimit);
    if(delta >= idleLimit){
        // connection lost
        console.log("+++ OUT --> "+delta+" of "+idleLimit);
        isConnect = false;
        outOfRoom();
    }else{
        isConnect = true;
        startCounter();
    }
}

