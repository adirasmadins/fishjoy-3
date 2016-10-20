var Globals = {
    authorname:"Enrico",
    domain:"www.digi-can.com",
    cannonSizeList:[
        {coin:10, radius:0, life:1},
        {coin:20, radius:10, life:5},
        {coin:30, radius:20, life:10},
        {coin:40, radius:30, life:15},
        {coin:50, radius:40, life:20},
        {coin:100, radius:60, life:40}
    ],    
    fishTypeList:[
        {id:"fish1", size:6, totalFrame:8, totalActiveFrame:4, w:55, h:296, speed:4, score:10, life:5},
        {id:"fish2", size:16, totalFrame:8, totalActiveFrame:4, w:78, h:512, speed:2.5, score:20, life:5},
        {id:"fish3", size:11, totalFrame:8, totalActiveFrame:4, w:72, h:448, speed:3.8, score:25, life:10},
        {id:"fish4", size:15, totalFrame:8, totalActiveFrame:4, w:77, h:472, speed:3.3, score:30, life:10},
        {id:"fish5", size:43, totalFrame:8, totalActiveFrame:4, w:107, h:976, speed:3, score:40, life:10},
        {id:"fish6", size:45, totalFrame:12, totalActiveFrame:8, w:105, h:948, speed:4.3, score:50, life:10},
        {id:"fish7", size:80, totalFrame:10, totalActiveFrame:6, w:92, h:1510, speed:2, score:60, life:20},
        {id:"fish8", size:100, totalFrame:12, totalActiveFrame:12, w:174, h:1512, speed:2.5, score:70, life:20},
        {id:"fish9", size:104, totalFrame:12, totalActiveFrame:8, w:166, h:2196, speed:4.6, score:80, life:20},
        {id:"fish10", size:121, totalFrame:10, totalActiveFrame:5, w:178, h:1870, speed:1.2, score:90, life:100},//turtle
        {id:"shark1", size:287, totalFrame:12, totalActiveFrame:8, w:509, h:3240, speed:5, score:300, life:1000}//,
        //{id:"shark2", size:382, totalFrame:12, totalActiveFrame:8, w:516, h:3276, speed:7}
    ],
    goldenTicket:[
        {id:"fish7"},
        {id:"fish8"},
        {id:"fish9"},
        {id:"fish10"},
        {id:"shark2"},
        {id:"shark2"}
    ],
    defaultRoomList:[
        {id:"room1", roomname:"Room 1", w:1024, h:768, cannon:4, minBuy:1000000, maxBuy:2000000, player:[], game:null, cannonList:[], active:false, player_driver:null},
        {id:"room2", roomname:"Room 2", w:1366, h:768, cannon:6, minBuy:200, maxBuy:300, player:[], game:null, cannonList:[], active:false, player_driver:null},
        {id:"room3", roomname:"Room 3", w:1280, h:800, cannon:8, minBuy:300, maxBuy:400, player:[], game:null, cannonList:[], active:false, player_driver:null}
    ],
    displayList:[
        {w:1024, h:768},
        {w:1366, h:768},
        {w:1280, h:800}
    ],
    minBuyList:[
        100,
        150,
        200
    ],
    maxBuyList:[
        250,
        300,
        400,
        450,
        500
    ],
    maxCannonList:[
        4,
        6,
        8
    ],
    cannon:[
        {id:"BL", angle:0, bulletType:0, type:[6,8]},
        {id:"BC", angle:0, bulletType:0, type:[4]},
        {id:"BR", angle:0, bulletType:0, type:[6,8]},
        {id:"TL", angle:180, bulletType:0, type:[6,8]},
        {id:"TC", angle:180, bulletType:0, type:[4]},
        {id:"TR", angle:180, bulletType:0, type:[6,8]},
        {id:"LT", angle:90, bulletType:0, type:[8]},
        {id:"LC", angle:90, bulletType:0, type:[4,6]},
        {id:"LB", angle:90, bulletType:0, type:[8]},
        {id:"RT", angle:-90, bulletType:0, type:[8]},
        {id:"RC", angle:-90, bulletType:0, type:[4,6]},
        {id:"RB", angle:-90, bulletType:0, type:[8]}


        /*
        {id:"BL", angle:0, bulletType:0, type:[6,8]},
        {id:"BC", angle:0, bulletType:0, type:[4]},
        {id:"BR", angle:0, bulletType:0, type:[6,8]},
        {id:"TL", angle:180, bulletType:0, type:[6,8]},
        {id:"TC", angle:180, bulletType:0, type:[4]},
        {id:"TR", angle:180, bulletType:0, type:[6,8]},
        {id:"LT", angle:90, bulletType:0, type:[8]},
        {id:"LC", angle:90, bulletType:0, type:[4,6]},
        {id:"LB", angle:90, bulletType:0, type:[8]},
        {id:"RT", angle:-90, bulletType:0, type:[8]},
        {id:"RC", angle:-90, bulletType:0, type:[4,6]},
        {id:"RB", angle:-90, bulletType:0, type:[8]}
        */
    ],
    sWidth:1000,
    sHeight:700,
    duration:0.25,
    initialFishNo:30,
    bulletSpeed:4,
    bulletAcc:0.3,
    minSpeed:1,
    maxSpeed:4,
    minute:60,
    seconds:1000,
    maxPlayer:8,
    idleDuration:3,
    gDuration:0.1*1000,//0.25,
    resetDuration:10,
    DEG_TO_RAD:Math.PI/180,
    RAD_TO_DEG:180/Math.PI,
    fps:60,
    connectionTimeoutDuration:2
}

/*
function Globals(){
    
}
*/
module.exports = Globals;