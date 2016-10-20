var fontTitleSize = 26;
var fontSize = 16;
var fontName = "Helvetica";
var fontcolor = cc.color(0,0,0);
var bgColor = cc.color(0,0,0,200);

var popupProp = [
    {type:"join_room", title:"JOIN ROOM", content:["Buy from"], button:["join"],slider:[minBuy, maxBuy]},
    {type:"signout", title:"WARNING", content:["Are you sure you want to leave room?"], button:["yes","no"],slider:[]},
    {type:"standout", title:"WARNING", content:["Are you sure you want to stop playing?"], button:["yes","no"],slider:[]},
    {type:"topup", title:"WARNING", content:["You have no more coin. You have to top up coin, to be able to continue play.","Do you want to top up?"], button:["yes","no"],slider:[]},
    {type:"not_enough_coin", title:"WARNING", content:["You do not have enough coin to shot. You have to top up coin, to be able to continue to shot.","Do you want to top up?"], button:["yes","no"],slider:[minBuy, maxBuy]},
    {type:"coin_not_available", title:"WARNING", content:["You have no more coin to be able to topup or continue playing."], button:["ok"],slider:[]},
    {type:"wait", title:"", content:["Please wait..."], button:[],slider:[]},
    {type:"connection_lost", title:"CONNECTION LOST", content:["Please refresh when connection ready."], button:[],slider:[]}
];


var popupItem = cc.Sprite.extend({
    ctor:function(type){
        this._super();
        console.log("+++ CREATE POPUP ++++ "+ type);
        this.type = type;
        this.percent = 0;
        this.minBuy = minBuy;
        this.maxBuy = maxBuy;

        this.buy = this.minBuy;
        this.timerDisplay = null;
        this.buyvalue = null;

        this.nocoinTimeout = null;
        this.countdownTimer = null;

        // DATA
        this.data = this.getDataByType(type);

        if(this.data !== null){
            isIdleOnPopUp = true;

            // BACKGROUND
            this.background  = new cc.DrawNode();
            this.background.drawRect(cc.p(0,0), cc.p(screen_width,screen_height), bgColor, 0, bgColor);

            // BOX
            var _src = asset_folder+getSource("popupbg");
            this.box = new cc.Sprite(_src);
            this.box.setPosition(screen_width/2, screen_height/2);

            var title = this.data.title;
            var content = this.data.content;
            var button = this.data.button;
            var slider = this.data.slider;

            var contentHeight = 0;
            var display = "";
            var spasi = 10;

            // TEXT
            this.textLayer = new cc.Layer();
            this.textLayer.init();

            var yPos = 0;
            var posH = 0;
            var posW = 0;
            var tweakX = 0;
            var tweakY = 0;
            //-- Title
            if(title !== ""){
               // console.log("SHOW TITLE");
                display = title;
                this.title = new cc.LabelTTF(display,fontName, fontTitleSize);
                this.title.textAlign = cc.TEXT_ALIGNMENT_CENTER;
                this.title.setColor(fontcolor);

                this.title.setAnchorPoint(0,0);
                this.title.setPosition(0, 0);
                this.textLayer.addChild(this.title);
                yPos += this.title.height + 3*spasi;
                posH += this.title.height;
            }

            // CONTENT
            display = "";
            switch (this.type){
                case "join_room":
                    display = content[0]+" "+this.minBuy+" - "+this.maxBuy+" coins";
                    break;

                case "not_enough_coin" :
                    display = nocoinduration+ " seconds left";
                    this.timerDisplay = new cc.LabelTTF(display,fontName, fontSize);
                    this.timerDisplay.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                    this.timerDisplay.setColor(fontcolor);

                    this.timerDisplay.setAnchorPoint(0,0);
                    this.timerDisplay.setPosition(0, -yPos);
                    this.textLayer.addChild(this.timerDisplay);

                    yPos += this.timerDisplay.height + 2* spasi;
                    posH += this.timerDisplay.height;

                    display = "";
                    for(var c=0; c<content.length; c++){
                        display += content[i]+"\n";
                    }

                    display = "Buy from "+this.minBuy+" - "+this.maxBuy+" coins";
                    console.log("CREATE TIMER DISPLAY "+this.timerDisplay);
                    break;

                default :
                    for(var d=0; d<content.length; d++){
                        display += content[d]+"\n";
                    }
                    break;
            }

            this.content = new cc.LabelTTF(display,fontName, fontSize);
            this.content.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            this.content.setColor(fontcolor);
            this.content.setAnchorPoint(0,0);
            this.content.setPosition(0, -yPos);
            this.textLayer.addChild(this.content);

            yPos += this.content.height + spasi;
            posH += this.content.height;

            tweakX = this.content.width/2;

            // SLIDER if ANY
            if(slider.length > 0){
                this.min = slider[0];
                this.max = slider[1];
                this.buy = this.min;

                var slider_track = asset_folder+getSource("slider_track");
                var slider_thumb = asset_folder+getSource("slider_thumb");
                var slider_progress = asset_folder+getSource("slider_progress");

                this.slider = new ccui.Slider();
                this.slider.setTouchEnabled(true);
                this.slider.loadBarTexture(slider_track);
                this.slider.loadSlidBallTextures(slider_thumb, slider_thumb, "");
                this.slider.loadProgressBarTexture(slider_progress);

                this.textLayer.addChild(this.slider);
                this.slider.setAnchorPoint(0,0);
                this.slider.setPosition(0, -yPos);

                this.slider.addEventListenerSlider(this.sliderEvent, this);

                yPos += this.slider.height + 2*spasi;
                posH += this.slider.height;

                this.buyvalue = new cc.LabelTTF("Buy "+this.buy+" coins", fontName, fontSize);
                this.buyvalue.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                this.buyvalue.setColor(fontcolor);

                this.textLayer.addChild(this.buyvalue);
                this.buyvalue.setAnchorPoint(0,0);
                this.buyvalue.setPosition(0, -yPos);

                this.showPercentValue(0);

                yPos += this.buyvalue.height + spasi;
                posH += this.buyvalue.height;

                tweakX = this.slider.width/2;
            }

            //this.textLayer.setPosition(this.box.width/2 - this.textLayer.width/2, this.box.height/2 + this.textLayer.height/2);
            this.textLayer.setPosition(this.box.x - tweakX , this.box.y + posH);

            // BUTTONS
            this.buttons = new cc.Layer();
            this.buttons.init();

            var posX = 0;
            posH = 0;
            posW = 0;

            for(var b=0; b < button.length; b++){
                var _button = new ccui.Button();
                var bttnOut;
                var bttnOver;
                switch (button[b]){
                    case "join":
                        bttnOut = asset_folder+getSource("bttn_ok");
                        bttnOver = asset_folder+getSource("bttn_ok_over");
                        _button.addTouchEventListener(this.agreeTouchEvent, this);
                        break;

                    case "ok":
                        bttnOut = asset_folder+getSource("bttn_ok");
                        bttnOver = asset_folder+getSource("bttn_ok_over");
                        _button.addTouchEventListener(this.agreeTouchEvent, this);
                        break;

                    case "yes":
                        bttnOut = asset_folder+getSource("bttn_yes");
                        bttnOver = asset_folder+getSource("bttn_yes_over");
                        _button.addTouchEventListener(this.agreeTouchEvent, this);
                        break;

                    case "cancel":
                        bttnOut = asset_folder+getSource("bttn_cancel");
                        bttnOver = asset_folder+getSource("bttn_cancel_over");
                        _button.addTouchEventListener(this.cancelTouchEvent, this);
                        break;

                    case "no":
                        bttnOut = asset_folder+getSource("bttn_no");
                        bttnOver = asset_folder+getSource("bttn_no_over");
                        _button.addTouchEventListener(this.cancelTouchEvent, this);
                        break;
                }

                _button.loadTextures(bttnOut, bttnOver, bttnOver);
                this.buttons.addChild(_button);

                _button.setAnchorPoint(0,0);
                _button.setPosition(posX, 0);
                posH += _button.height;
                posW += _button.width;
                posX += _button.width + spasi;

            }


            tweakX = posW/2;// - (button.length * 2);

            this.buttons.setPosition(this.box.x - tweakX, this.box.y - (this.box.height/2 - posH/2 - spasi) );

            this.addChild(this.background);
            this.addChild(this.box);
            this.addChild(this.textLayer);
            this.addChild(this.buttons);

            if(this.type == "not_enough_coin"){
                this.counter = 1;
                //this.nocoinTimeout = setTimeout(setStandout, nocoinduration*1000);
                this.createCountdown();
                /*
                this.countdownTimer = setInterval((function(){

                    var dCounter = nocoinduration - this.counter;

                    if(dCounter <= 0){
                        this.removeCountdownTimer();
                    }
                    this.showCountdown(dCounter);
                    this.counter++;
                }).bind(this), 1000);
                */

            }

        }
    },
    createCountdown: function () {
        this.countdownTimer = setTimeout((function(){

            var dCounter = nocoinduration - this.counter;
            console.log("%%%%% countdown: "+dCounter);
            if(dCounter <= 0){
                this.counter = 0;
                this.removeCountdownTimer();
                setStandout();
            }else{
                this.showCountdown(dCounter);
                this.counter++;
                this.createCountdown();
            }
        }).bind(this), 1000);
    },
    showCountdown:function(counter){
        this.timerDisplay.setString(counter+" seconds left");
    },
    removeCountdownTimer:function(){
        console.log("##### REMOVE COUNTDOWN TIMER");
      if(this.countdownTimer){
          clearTimeout(this.countdownTimer);
          this.countdownTimer = null;
      }
        if(this.nocoinTimeout){
            clearTimeout(this.nocoinTimeout);
            this.nocoinTimeout = null;
        }
    },
    agreeTouchEvent: function (sender, type) {
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                switch (this.type){
                    case "join_room":
                        console.log("+++++ OK ON JOIN ROOM");
                        var data = {};
                        data.playerid = playerid;
                        data.roomid = roomname;
                        data.position = posToJoin;
                        data.score = 0;
                        data.coin = this.buy;
                        sendJoinRequest(data);
                        closePopup();
                        break;

                    case "standout":
                        console.log("+++++ OK ON STANDOUT");
                        setStandout();
                        break;

                    case "signout":
                        console.log("+++++ OK ON SIGNOUT");
                        setSignout();
                        break;

                    case "topup":
                        break;

                    case "not_enough_coin":
                        console.log("+++++ OK ON NOT ENOUGH COIN");
                        this.removeCountdownTimer();
                        var data = {};
                        data.playerid = playerid;
                        data.socketid = playerSId;
                        data.roomid = roomname;
                        data.position = posToJoin;
                        //data.score = score;
                        //data.coin = coin;
                        data.coin = this.buy;

                        topup(data);
                        closePopup();
                        break;

                    case "coin_not_available":
                        console.log("+++++ OK ON COIN NOT AVAILABLE");
                        closePopup();
                        break;
                }

                break;
        }

    },
    cancelTouchEvent: function (sender, type) {
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                switch (this.type){
                   case "not_enough_coin":
                        setStandout();
                        break;

                   default :
                        closePopup();
                        break;
                }
                break;
        }
    },
    sliderEvent:function(sender, type){
        //console.log("SLIDER TYPE: "+type+" of "+ccui.Slider.EVENT_PERCENT_CHANGED);
        switch (type){
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                this.percent = sender.getPercent().toFixed(0);
                this.showPercentValue(this.percent);
                break;
        }
    },
    showPercentValue:function(percent){
        this.buy = this.minBuy + ((this.percent/100)*(this.maxBuy - this.minBuy));
        this.buyvalue.setString("Buy "+this.buy+" coins");
    },
    getBuyValue:function(){
        return this.buy;
    },
    getDataByType:function(type){
        for(var i=0; i < popupProp.length; i++){
            if(popupProp[i].type == type){
                return popupProp[i];
            }
        }
        return null;
    },
    destroy:function(){
        console.log("======== DESTROY ============");
        this.removeCountdownTimer();
        popupLayer.removeChild(this);
    }
});
