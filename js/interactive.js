var socket = io();
var minNameChar = 3;

socket.on('getroomlist', function(roomlist){
    listRoom(roomlist);
});

socket.on('new_room_item', function(data){
    closePopup();
    console.log("NEW ROOM BROADCAST")
    
    var str = "<tr>";
    str += "<td>"+data.roomname+"</td>";
    str += "<td>" +data.w+" x "+data.h+"</td>";
    str += "<td>"+data.cannon+"</td>";
    str += "<td>"+data.minBuy+"</td>";
    str += "<td>"+data.maxBuy+"</td>";
    //str += "<form action='/game' method='post'>";
    str += "<td>";
    //str += "<input type='hidden' name='roomId' value='"+data.id+"'>";
    //str += "<button id='send' type='submit'>JOIN</button>";
    str += "<button type='button' id='"+data.id+"' class='room_bttn'>JOIN</button>";
    str += "</td>";
    str += "</tr>";
    
    $("#tbl_room tbody").append(str); 
    
    $(".room_bttn").click(function(){
        rid = $(this).attr('id');
        submitJoinRoom({roomid:rid});
        /*var data = {};
        data.id = $(this).attr('id');
        data.playerid = "12345";
        
        socket.emit('selectroom', data);
        */
    });
    
    // let the plugin know that we made a update 
    
    $("#tbl_room").trigger("update"); 
    // set sorting column and direction, this will sort on the first and third column 
     var sorting = [[0,0]]; 
    // sort on the first column 
    $("#tbl_room").trigger("sorton",[sorting]); 
});

socket.on('enter_room',function(data){
    //clientdata.id, clientdata.w, clientdata.h
    console.log("--- Enter room "+data.id)
    $.post( "/game", { roomId: data.id } );
    //window.location.replace("./game");
});
        
$(document).ready(function() {
    socket.emit('getroomlist');
    
    $('#popup').popup({
        escape: false,
        blur:false,
        opacity:0.5
    });
    
    $("#button_select").click(function(){
        //window.location.replace("./fishgame.html");
    });
    
    $("#button_add_room").click(function(){ 
        generatePopup("new room");
        openPopup("new room");
    });
    
    $("#ajax-append").click(function() { 
         $.get("assets/ajax-content.html", function(html) { 
             // append the "ajax'd" data to the table body 
             $("table tbody").append(html); 
            // let the plugin know that we made a update 
            $("table").trigger("update"); 
            // set sorting column and direction, this will sort on the first and third column 
            var sorting = [[0,0]]; 
            // sort on the first column 
            $("table").trigger("sorton",[sorting]); 
        }); 
        return false; 
    }); 
});


function submitJoinRoom(data){
    console.log("--- CLICK Join room "+data.roomid);
    var form = document.createElement("form");
    var input = document.createElement('input');
    form.method = 'post';
    form.action = '/game';
    input.type = "hidden";

    input.name = "roomId";
    input.value = data.roomid;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
}

function generatePopup(whichOne){
    var _popup = "";
    var isBG = true;
    switch(whichOne){
        case "new room":
            _popup = add_room_str;
            break;
        case "preloader":
            _popup = loading_str;
            isBG = false;
            break;
    }

    if(isBG){
        $('#popup').addClass("popup_background");
    }else{
        $('#popup').removeClass("popup_background");
    }
    $('#popup').html(_popup);
    initiateButtonPopUp(whichOne);
    return;
}

function initiateButtonPopUp(whichOne){
    switch(whichOne){
        case "new room":
            $("#room_submit").click(function(){
                var rName = $("#input_room_name").val();
                var rDisplay = $("#input_room_display option:selected").val();
                var rCannon = $("#input_total_cannon option:selected").val();
                var rMin = $("#input_min_buy option:selected").val();
                var rMax = $("#input_max_buy option:selected").val();

                //closePopup();
                if(checkNewRoomForm(rName)){
                    $("#error_mssg").html("");
                    submitNewRoom(rName, rDisplay, rCannon, rMin, rMax);
                }else{
                    // write some error message here
                    $("#error_mssg").html("Please fill in room name with minimum of three character");
                }

                console.log("Submit new room");
            });
            break;
    }
    $("#popup_close").click(function(){
        closePopup();
    });

    return;
}


function checkNewRoomForm(rName){
    if(rName.length >= minNameChar){
        return true;
    }else{
        return false;
    }
}

function openPopup(whichOne){
    var _popup = "#popup";
    $(_popup).popup('show');
}
        
function closePopup(){
    var _popup = "#popup";
    $(_popup).popup('hide');
}

function submitNewRoom(rName, rDisplay, rCannon, rMin, rMax){
    console.log("CREATE NEW ROOM SUBMIT")
    generatePopup("preloader");
    var data = {};
    data.name = rName;
    data.display = rDisplay;
    data.cannon = rCannon;
    data.minBuy = rMin;
    data.maxBuy = rMax;
    data.playerid = "12345"; // playerid get from API
    socket.emit("createroom", data);
}

function listRoom(data){
    //{id:"room1", roomname:"Room 1", w:1024, h:768, player:[], game:null},
    //var str = "<ul>"; 
    var str = "<table cellspacing='1' id='tbl_room' class='tablesorter'>";
    str += "<thead>";
    str += "<tr>";
    str += "<th>Room Name</th>";
    str += "<th>Dimension</th>";
    str += "<th>Cannon</th>";
    str += "<th>Min Buy</th>";
    str += "<th>Max Buy</th>";
    str += "<th></th>";
    str += "</tr>";
    str += "</thead>";
    str += "<tbody>";
    for(var i=0; i < data.length; i++){
        var _rId = data[i].id;
        /*str += "<li>";
        str += data[i].roomname;
        str += " -- (" +data[i].w+" x "+data[i].h+")";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        str += "<button type='button' id='"+data[i].id+"' class='room_bttn'>JOIN</button>";
        str += "</li>";
        */
        str += "<tr>";
        str += "<td>"+data[i].roomname+"</td>";
        str += "<td>" +data[i].w+" x "+data[i].h+"</td>";
        str += "<td>"+data[i].cannon+"</td>";
        str += "<td>"+data[i].minBuy+"</td>";
        str += "<td>"+data[i].maxBuy+"</td>";
        //str += "<form action='/game' method='post'>";
        str += "<td>";
        //str += "<input type='hidden' name='roomId' value='"+data[i].id+"'>";
        str += "<button type='button' id='"+data[i].id+"' class='room_bttn'>JOIN</button>";
        str += "</td>";
       // str += "</form>";
        
        //str += "<td><button type='button' id='"+data[i].id+"' class='room_bttn'>JOIN</button></td>";
        str += "</tr>";
    }
            
    //str += "</ul>";
   
    str += "</tbody>";
    str += "</table>";
    $("#roomlist").append(str);
    
    $(".room_bttn").click(function(){
        rid = $(this).attr('id');
        submitJoinRoom({roomid:rid});
        /*var data = {};
        data.id = $(this).attr('id');
        data.playerid = "12345";
        
        socket.emit('selectroom', data);
        */
    });
    
    $("#tbl_room").tablesorter({ 
        // sort on the first column and third column, order asc 
       headers: { 
            5: { 
                // disable it by setting the property sorter to false 
                sorter: false 
            } 
        }  
    });
    
    /*$("#tbl_room").tablesorterPager({
        container: $("#pager")
    }); */
    
}

function tester(data){
    alert("--- CLICK "+data);
}