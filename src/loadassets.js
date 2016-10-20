var fishassets = [
     {id:"fish1", spritesheet:true, segment:8, lifesegment:4, w:55,h:296,speed:2,life:5},
     {id:"fish2", spritesheet:true, segment:8, lifesegment:4, w:78,h:512,speed:2.5,life:5},
     {id:"fish3", spritesheet:true, segment:8, lifesegment:4, w:72,h:448,speed:2.8,life:10},
     {id:"fish4", spritesheet:true, segment:8, lifesegment:4, w:77,h:472,speed:3.3,life:10},
     {id:"fish5", spritesheet:true, segment:8, lifesegment:4, w:107,h:976,speed:3,life:10},
     {id:"fish6", spritesheet:true, segment:12, lifesegment:8, w:105,h:948,speed:4.1,life:10},
     {id:"fish7", spritesheet:true, segment:10, lifesegment:6, w:92,h:1510,speed:2,life:20},
     {id:"fish8", spritesheet:true, segment:12, lifesegment:8, w:174,h:1512,speed:2.5,life:20},
     {id:"fish9", spritesheet:true, segment:12, lifesegment:4, w:166,h:2196,speed:3.6,life:20},
     {id:"fish10", spritesheet:true,segment:10, lifesegment:6, w:178,h:1870,speed:1.2,life:100},
     {id:"shark1", spritesheet:true, segment:12, lifesegment:8, w:509,h:3240,speed:5,life:1005}//,
     //{id:"shark2", spritesheet:true, segment:12, lifesegment:8, w:509,h:3240,speed:5,life:1005}
];

var goldenTicket = [
     {id:"fish7"},
     {id:"fish8"},
     {id:"fish9"},
     {id:"fish10"},
     {id:"shark1"},
     {id:"shark2"}
];

var commonassets = [
     {id: "mainbg", size: 456, src:"game_bg_2_hd.jpg", spritesheet:false },
     {id: "popupbg", size: 456, src:"popup_bg.jpg", spritesheet:false },
     {id: "bottom", size: 50, src:"cannonbg.png", spritesheet:false},
     {id: "cannon1", spritesheet:true,segment:5},
     {id: "cannon2", spritesheet:true,segment:5},
     {id: "cannon3", spritesheet:true,segment:5},
     {id: "cannon4", spritesheet:true,segment:5},
     {id: "cannon5",spritesheet:true,segment:5},
     {id: "cannon6", spritesheet:true,segment:5},
     {id: "cannon7", spritesheet:true,segment:5},
     {id: "bullet1", size: 8, src:"bullet_1.png", spritesheet:false},
     {id: "bullet2", size: 8, src:"bullet_2.png", spritesheet:false},
     {id: "bullet3", size: 8, src:"bullet_3.png", spritesheet:false},
     {id: "bullet4", size: 8, src:"bullet_4.png", spritesheet:false},
     {id: "bullet5", size: 8, src:"bullet_5.png", spritesheet:false},
     {id: "bullet6", size: 8, src:"bullet_6.png", spritesheet:false},
     {id: "bullet7", size: 8, src:"bullet_7.png", spritesheet:false},
     {id: "bullet8", size: 8, src:"bullet_8.png", spritesheet:false},
     {id: "web1", size: 93, src: "web1.png", spritesheet:false},
     {id: "web2", size: 93, src: "web2.png", spritesheet:false},
     {id: "web3", size: 93, src: "web3.png", spritesheet:false},
     {id: "web4", size: 93, src: "web4.png", spritesheet:false},
     {id: "web5", size: 93, src: "web5.png", spritesheet:false},
     {id: "web6", size: 93, src: "web6.png", spritesheet:false},
     {id: "web7", size: 93, src: "web7.png", spritesheet:false},
     {id: "numberBlack", spritesheet:true, segment:10},
     {id: "coinAni1", spritesheet:true,segment:10},
     {id: "coinAni2", spritesheet:true,segment:10},
     {id: "coinText", spritesheet:true,segment:11},
     {id: "icon_click", size: 100, src: "icon_click.png", spritesheet:false},
     {id: "icon_plus", size: 39, src: "bttn_plus.png", spritesheet:false},
     {id: "icon_min", size: 39, src: "bttn_min.png", spritesheet:false},
     {id: "bttn_auto_shot", size: 39, src: "bttn_auto_shot.png", spritesheet:false},
     {id: "bttn_auto_target", size: 39, src: "bttn_auto_target.png", spritesheet:false},
     {id: "bttn_leave", size: 39, src: "bttn_leave.png", spritesheet:false},
     {id: "bttn_standout", size: 39, src: "bttn_standout.png", spritesheet:false},
     {id: "bttn_ok", size: 39, src: "bttn_ok.png", spritesheet:false},
     {id: "bttn_ok_over", size: 39, src: "bttn_ok_over.png", spritesheet:false},
     {id: "bttn_cancel", size: 39, src: "bttn_cancel.png", spritesheet:false},
     {id: "bttn_cancel_over", size: 39, src: "bttn_cancel_over.png", spritesheet:false},
     {id: "bttn_yes", size: 39, src: "bttn_yes.png", spritesheet:false},
     {id: "bttn_yes_over", size: 39, src: "bttn_yes_over.png", spritesheet:false},
     {id: "bttn_no", size: 39, src: "bttn_no.png", spritesheet:false},
     {id: "bttn_no_over", size: 39, src: "bttn_no_over.png", spritesheet:false},
     {id: "slider_thumb", size: 39, src: "slider_thumb.png", spritesheet:false},
     {id: "slider_track", size: 39, src: "slider_track.png", spritesheet:false},
     {id: "slider_progress", size: 39, src: "slider_progress.png", spritesheet:false},
     {id: "target", size: 39, src: "target.png", spritesheet:false}
];

var map = [
    asset_folder+"map.plist",
    asset_folder+"map.png"
];

var fx = [
     asset_folder+"hit_sprites.plist",
     asset_folder+"hit_sprites.png",
     asset_folder+"bomb_sprites.plist",
     asset_folder+"bomb_sprites.png",
     asset_folder+"spark_sprites.plist",
     asset_folder+"spark_sprites.png"
]

var _allResources = fishassets.concat(commonassets);
var gameResources = extractSource(fishassets, "src").concat(extractSource(commonassets,"src")).concat(map).concat(fx);

function getSource(id){
     for(var i=0; i<_allResources.length; i++){
          if(_allResources[i].id == id){
               return _allResources[i].src;
          }
     }

     return null;
}

function extractSource(data, type){
     var _output = [];

     for(var i=0; i < data.length; i++){
          if(data[i].spritesheet == false) {
               var _str = "";
               if (type == "src") {
                    _str = asset_folder + data[i].src;
                    // _output.push(_str);
               } else if (type == "plist") {
                    if (data[i].spritesheet) {
                         _str = asset_folder + data[i].plist;
                         //_output.push(_str);
                    } else {
                         break;
                    }
               }
               _output.push(_str);
          }
     }
     return _output;
}

/*
 var fishassets = [
 {id:"fish1",src:"fish1.png", plist:"fish1.plist", spritesheet:true, segment:8, lifesegment:4, w:55,h:296,speed:4,life:5},
 {id:"fish2",src:"fish2.png", plist:"fish2.plist", spritesheet:true, segment:8, lifesegment:4, w:78,h:512,speed:2.5,life:5},
 {id:"fish3",src:"fish3.png", plist:"fish3.plist", spritesheet:true, segment:8, lifesegment:4, w:72,h:448,speed:3.8,life:10},
 {id:"fish4",src:"fish4.png", plist:"fish4.plist", spritesheet:true, segment:8, lifesegment:4, w:77,h:472,speed:3.3,life:10},
 {id:"fish5",src:"fish5.png", plist:"fish5.plist", spritesheet:true, segment:8, lifesegment:4, w:107,h:976,speed:3,life:10},
 {id:"fish6",src:"fish6.png", plist:"fish6.plist", spritesheet:true, segment:12, lifesegment:8, w:105,h:948,speed:4.3,life:10},
 {id:"fish7",src:"fish7.png", plist:"fish7.plist", spritesheet:true, segment:10, lifesegment:6, w:92,h:1510,speed:2,life:20},
 {id:"fish8",src:"fish8.png", plist:"fish8.plist", spritesheet:true, segment:12, lifesegment:8, w:174,h:1512,speed:2.5,life:20},
 {id:"fish9",src:"fish9.png", plist:"fish9.plist", spritesheet:true, segment:12, lifesegment:4, w:166,h:2196,speed:4.6,life:20},
 {id:"fish10",src:"fish10.png", plist:"fish10.plist", spritesheet:true,segment:10, lifesegment:6, w:178,h:1870,speed:1.2,life:100},
 {id:"shark1",src:"shark1.png", plist:"shark1.plist", spritesheet:true, segment:12, lifesegment:8, w:509,h:3240,speed:9,life:1005},
 {id:"shark2",src:"shark2.png", plist:"shark2.plist", spritesheet:true, segment:12, lifesegment:8, w:509,h:3240,speed:9,life:1005}
 ];
 */