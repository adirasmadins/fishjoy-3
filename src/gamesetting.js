var screen_width = 1024;
var screen_height = 768;

var total_fish = 30;
var area_margin = 100;

var asset_folder = "assets/";
var isPlayer = false;
var isDriver = false;

// ===== CANNON ======

var cannon_base_list =[
    {id:"BL", pos:"B", x:1/4, y:0, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false, type:[6,8]},
    {id:"BC", pos:"B", x:1/2, y:0, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false, type:[4]},
    {id:"BR", pos:"B", x:3/4, y:0, addRot:0, ori:"horizontal", cannonX:0, cannonY:0, active:false, type:[6,8]},
    {id:"TL", pos:"T", x:1/4, y:1, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false, type:[6,8]},
    {id:"TC", pos:"T", x:1/2, y:1, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false, type:[4]},
    {id:"TR", pos:"T", x:3/4, y:1, addRot:180, ori:"horizontal", cannonX:0, cannonY:0, active:false, type:[6,8]},
    {id:"LT", pos:"L", x:0, y:1/4, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false, type:[8]},
    {id:"LC", pos:"L", x:0, y:1/2, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false, type:[4,6]},
    {id:"LB", pos:"L", x:0, y:3/4, addRot:90, ori:"vertical", cannonX:0, cannonY:0, active:false, type:[8]},
    {id:"RT", pos:"R", x:1, y:1/4, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false, type:[8]},
    {id:"RC", pos:"R", x:1, y:1/2, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false, type:[4,6]},
    {id:"RB", pos:"R", x:1, y:3/4, addRot:-90, ori:"vertical", cannonX:0, cannonY:0, active:false, type:[8]}
];

var cannonSizeList = [
    {coin:10, radius:0, life:5},
    {coin:20, radius:10, life:10},
    {coin:30, radius:20, life:20},
    {coin:40, radius:30, life:45},
    {coin:50, radius:40, life:100}
]

var totalCannon = 4;
var cannonSize = 1;
var cannonType = null;

var cannonSegment = 5;

var maxCannonSize = cannonSizeList.length;

// ==== BULLET =====
var bulletSpeed = 4;
var bulletAcc = 0.3;
var captureSegment = 4;

var bulletIdleTime = 0.2;


// ===== BOX2D Stuff =====
var meter = 30; // 1 meter = 30 pixels for box2d purposes
var world = null;
var _debugDraw = null;
var shapeFishArray = [];
var shapeBulletArray = [];

// ====== PLAYER ========
var playerid = "12345";
var playerSId = "";
var playername = "";

// ======= SCORE & COIN ======
var scoreList = [];
var coinList = [];
var minBuy = 0;
var maxBuy = 0;

// ===== OTHER ========
var noOfSlide = 5;
var isIdleOnPopUp = false;
var playerScore = 0;
var playerCoin = 0;

var lastConnectioncheck = 0;
var tick = 0;
var seconds = 1000;
var checkduration = 1*seconds;
var idleLimit = 3*seconds;
var isConnectionLost = false;
var checkerTimeout = null;
var nocoinTimeout = null;
var nocoinduration = 5;
var countdownTimer = null;

// ====== AUTO FEATURE ======
var isAutoLock = false;
var isAutoShoot = false;
var targetLock = null;



function setInitialParameter(data){
    console.log("SET INITIAL PARAMETER "+data.cannonList);
    totalCannon = data.cannon;
    screen_width = data.w;
    screen_height = data.h;
    minBuy = data.minBuy;
    maxBuy = data.maxBuy;
    //cannonTypeList = data.cannonList;
    playerSId = data.sid;
    //fps = data.fps;

    //console.log("Is Driver? "+data.isDriver)

    //if(data.isDriver){
        //isDriver = true;
    //}
    cc.view.setDesignResolutionSize(screen_width, screen_height, cc.ResolutionPolicy.SHOW_ALL);

    //isReady = true;
    return;
}

function setupJoinRequest(data){
    setPlayer(data.position);
    /*
    var _joinCannon = getCannonIndex(data.position);

    if(_joinCannon !== null){
        this.cannonList[_joinCannon].active = true;
        setSelectedCannon(_joinCannon);
        setCommonButton();
    }
    score = data.score;
    coin = data.coin;
    */
}