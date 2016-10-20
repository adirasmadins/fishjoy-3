var bttn_close_str = "<button id='popup_close' class='close_bttn'>X</button>";

var add_room_str = bttn_close_str;
add_room_str += "<div id='title_popup'><h1>CREATE NEW ROOM</h1></div>";
add_room_str += "<div id='form'>";
add_room_str += "<li>Room Name:  <input type='text' id='input_room_name' class='pagedisplay'/></li>";
add_room_str += "<li>Display:  <select id='input_room_display' class='pagesize'>";
add_room_str += "<option selected='selected' value='0'>1024x768</option>";
add_room_str += "<option value='1'>1366x768</option>";
add_room_str += "<option value='2'>1280x800</option></select></li>";
add_room_str += "<li>Total Cannon:  <select id='input_total_cannon' class='pagesize'>";
add_room_str += "<option selected='selected' value='0'>4</option>";
add_room_str += "<option value='1'>6</option>";
add_room_str += "<option value='2'>8</option></select></li>";
add_room_str += "<li>Min Buy:  <select id='input_min_buy' class='pagesize'>";
add_room_str += "<option selected='selected' value='0'>100</option>";
add_room_str += "<option value='1'>150</option>";
add_room_str += "<option value='2'>200</option></select></li>";
add_room_str += "<li>Max Buy:  <select id='input_max_buy' class='pagesize'>";
add_room_str += "<option selected='selected' value='0'>250</option>";
add_room_str += "<option value='1'>300</option>";
add_room_str += "<option value='2'>400</option>";
add_room_str += "<option value='3'>450</option>";
add_room_str += "<option value='4'>500</option></select></li>";
add_room_str += "</div>";
add_room_str += "<div id='error_mssg' class='red'></div>"
add_room_str += "<button id='room_submit' class='submit_bttn'>Submit</button>";

var loading_str = "<div style='position:relative;'><img style='display: block;margin-left: auto;margin-right: auto' src='/images/preloader.gif' /></div>";

var buy_str = bttn_close_str;
buy_str += "<div id='title_popup'><h1>JOIN ROOM</h1></div>";
buy_str += "<div id='notes'></div>"
buy_str += "<div><input id='range_slider' type='range' min='0' max='50' value='0' step='1' class='center' oninput='showBuyValue(this.value)' /></div>";
buy_str += "<div id='mssg'></div>"
buy_str += "<button id='buy_submit' class='submit_bttn'>Join</button>";

var signout_str = "<div id='title_popup'><h1>WARNING</h1></div>";
signout_str += "<div id='notes'><h2>Are you sure want to leave room?</h2></div>"
signout_str += "<button id='confirmation_ok' class='submit_bttn'>YES</button><button id='confirmation_cancel' class='submit_bttn'>NO</button>";

var standout_str = "<div id='title_popup'><h1>WARNING</h1></div>";
standout_str += "<div id='notes'><h2>Are you sure want to stop play?</h2></div>"
standout_str += "<button id='confirmation_ok' class='submit_bttn'>YES</button><button id='confirmation_cancel' class='submit_bttn'>NO</button>";

var notification_no_coin_str = "<div id='title_popup'><h1>WARNING</h1></div>";
notification_no_coin_str += "<div id='notes'><h2>You have no more coin. You have to top up coin, to be able to continue play.<br/>Do you want to top up?</h2></div>";
notification_no_coin_str += "<button id='confirmation_ok' class='submit_bttn'>YES</button><button id='confirmation_cancel' class='submit_bttn'>NO</button>";

var notification_no_enough_coin = "<div id='title_popup'><h1>WARNING</h1></div>";
notification_no_enough_coin += "<div id='countdown'></div>"
notification_no_enough_coin += "<div id='notes_title'><h2>You do not have enough coin to shot. You have to top up coin, to be able to continue shot.<br/>Do you want to top up?</h2></div>";
notification_no_enough_coin += "<div id='notes'></div>"
notification_no_enough_coin += "<div><input id='range_slider' type='range' min='0' max='50' value='0' step='1' class='center' oninput='showBuyValue(this.value)' /></div>";
notification_no_enough_coin += "<div id='mssg'></div>"
notification_no_enough_coin += "<button id='confirmation_ok' class='submit_bttn'>YES</button><button id='confirmation_cancel' class='submit_bttn'>NO</button>";

var notification_coin_not_available =  "<div id='title_popup'><h1>WARNING</h1></div>";
notification_coin_not_available += "<div id='notes'><h2>You do not have enough coin to topup/play.</div>";
notification_coin_not_available += "<button id='confirmation_ok' class='submit_bttn'>OK</button>";

var notification_wait = "<div id='notes'><h2>Please wait.</h2></div>";

var notification_connection_lost = "<div id='title_popup'><h1>CONNECTION LOST</h1></div>";
notification_connection_lost += "<div id='notes'><h2>Connection lost, please refresh when connection ready...</h2></div>";
