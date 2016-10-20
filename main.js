  cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(screen_width, screen_height, cc.ResolutionPolicy.SHOW_ALL);
    //cc.view.setTargetDensityDPI(cc.DENSITYDPI_LOW);
    cc.LoaderScene.preload(gameResources, function () { // for preloading assets
      cc.director.runScene(new gameScene());
    }, this);

    windowsSetup();
  };
  cc.game.run();

$(document).ready(function() {
  /*$('#popup').popup({
    escape: false,
    blur:false,
    opacity:0.5
  });
  */
});


var roomname;
window.onload = function(){
  //roomname = roomId;
  roomname = $("#roomid").val();
}

function windowsSetup(){
  $('#popup').popup({
    escape: false,
    blur:false,
    opacity:0.5
  });
}