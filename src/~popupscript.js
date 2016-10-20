// POP UP FOR BUY/CHECKIN

function generatePopup(whichOne){
    if(!isIdleOnPopUp){
        console.log("--- GENERATE POPUP "+whichOne);
        var _popup = "";
        var isBG = true;
        switch(whichOne){
            case "buy":
                _popup = buy_str;
                break;

            case "standout":
                _popup = standout_str;
                break;

            case "signout":
                _popup = signout_str;
                break;

            case "no_coin":
                _popup = notification_no_coin_str;
                break;
            case "not_enough_coin":
                _popup = notification_no_enough_coin;
                break;
            case "no_available_coin":
                _popup = notification_coin_not_available;
                break;
            case "connection_lost":
                _popup = notification_connection_lost;
                break;
            case "loader":
                _popup = loading_str;
                //_popup = notification_wait;
                break;
            case "general_processing":
                _popup = notification_wait;
                break;
        }

        if(isBG){
            $('#popup').addClass("popup_background");
        }else{
            $('#popup').removeClass("popup_background");
        }
        $('#popup').html(_popup);

        switch(whichOne){
            case "buy":
            case "not_enough_coin":
                $("#range_slider").attr({
                    "min" : minBuy,
                    "max" : maxBuy
                });

                $("#notes").html("<h2>Buy from "+minBuy+" - "+maxBuy+" coins</h2>");

                showBuyValue(minBuy);
                break;
        }

        initiateButtonPopUp(whichOne);
    }
    return;
}

function showBuyValue(value){
    $("#mssg").html("<h2><B>Buy: "+value+" coins </B></h2>");
}

function initiateButtonPopUp(whichOne){
    switch(whichOne){
        case "buy":
            $("#buy_submit").click(function(){
                var data = {};
                data.playerid = playerid;
                data.roomid = roomname;
                data.position = posToJoin;
                data.score = 0;
                data.coin = $('#range_slider').val();

                //console.log("Buy for "+data.coin);
                sendJoinRequest(data);
                closePopup();

            });
            break;

        case "standout":

            $("#confirmation_ok").click(function(){

                setStandout();
                //closePopup();

            });

            $("#confirmation_cancel").click(function(){
                closePopup();

            });
            break;

        case "signout":

            $("#confirmation_ok").click(function(){
                setSignout();
                //closePopup();

            });

            $("#confirmation_cancel").click(function(){
                closePopup();

            });
            break;

        case "not_enough_coin":

            $("#confirmation_ok").click(function(){
                console.log("--- click ok no coin");
                var data = {};
                data.playerid = playerid;
                data.socketid = playerSId;
                data.roomid = roomname;
                data.position = posToJoin;
                //data.score = score;
                //data.coin = coin;
                data.coin = $('#range_slider').val();

                closePopup();
                //showProcessPreloader();
                topup(data);
            });

            $("#confirmation_cancel").click(function(){

                setStandout();
                //closePopup();

            });
            break;

        case "no_available_coin":

            $("#confirmation_ok").click(function(){
                closePopup();
            });

            break;

    }

    $("#popup_close").click(function(){
        closePopup();
    });
    return;
}


function initiatePopup(key){
    generatePopup(key);
    openPopup();
}

function openPopup(){
    console.log("---- POPUP "+$("#popup"));

    var _popup = "#popup";
    $(_popup).popup('show');
    //isIdleOnPopUp = true;
}

function closePopup(){
    console.log("===== CLOSE POPUP");
    var _popup = "#popup";
    $(_popup).popup('hide');
    //isIdleOnPopUp = false;
}

function topup(data){
    console.log("--- TOPUP "+data.coin);
    removeNoCoinTimer();
    sendTopup(data);
    initiatePopup("general_processing");
}

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