var mouseX;
var mouseY;
var prevMouseDown = false;
var mouseDown = false;

const ENTER = 13;

function updateMousePos(evt) {
	// evt.preventDefault();
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = (evt.clientX - canvas.offsetLeft) / canvas.offsetWidth * CANVAS_WIDTH;
    mouseY = (evt.clientY - canvas.offsetTop) / canvas.offsetHeight * CANVAS_HEIGHT;
}

function handleMouseUp(evt) {
	// evt.preventDefault();
	mouseDown = false;
}

function handleMouseDown(evt){
	// evt.preventDefault();
	mouseDown = true;
	handle_buttons();
	if(game_state == 0) handle_bet_input();
}

function handle_bet_input(){
	for (let i = 0; i < BET_SIZES.length; i++) {
		if(distanceOfTwoPoints(CANVAS_WIDTH/2+i*70-140, CANVAS_HEIGHT/2, mouseX, mouseY) < 35) players[2].bet_size_index = i;
	}

	if(distanceOfTwoPoints(CANVAS_WIDTH/2, CANVAS_HEIGHT-120, mouseX, mouseY) < 45){
		if(players[2].balance < BET_SIZES[players[2].bet_size_index]){
			error = 0;
			error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
			return;
		}

		players[2].bet_chips.push(players[2].bet_size_index);
		players[2].bet += BET_SIZES[players[2].bet_size_index];
		players[2].balance -= BET_SIZES[players[2].bet_size_index];
	}

	if(distanceOfTwoPoints(CANVAS_WIDTH/2+2*70-140, CANVAS_HEIGHT/2+85, mouseX, mouseY) < 30){
		players[2].balance += players[2].bet;
		players[2].bet_chips = [];
		players[2].bet = 0;
	}
}

function handle_buttons(){
	if(prevMouseDown != false || mouseDown != true) return;

	for (let i = 0; i < buttons.length; i++) {
		if(buttons[i].visible == false || buttons[i].clickable == false) continue;
		if(mouseX > buttons[i].x-buttons[i].w/2-10 && mouseX < buttons[i].x+buttons[i].w/2+10 &&
		   mouseY > buttons[i].y-buttons[i].h/2-10 && mouseY < buttons[i].y+buttons[i].h/2+10){
				buttons[i].callback();
		}
	}
}

function handle_key_input(key){
	if(game_state == 0){
		if(key == "1" || key == "2" || key == "3" || key == "4" || key == "5"){
			players[2].bet_size_index = parseInt(key)-1;

			if(players[2].balance < BET_SIZES[players[2].bet_size_index]){
				error = 0;
				error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
				return;
			}

			players[2].bet_chips.push(parseInt(key)-1);
			players[2].bet += BET_SIZES[parseInt(key)-1];
			players[2].balance -= BET_SIZES[players[2].bet_size_index];
		} 

		if(key == "Enter"){
			if(players[2].bet == 0){
				error = 1;
				error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
				return;
			}
			
			place_bets();
		}

		if(key == "Backspace"){
			players[2].balance += players[2].bet;
			players[2].bet_chips = [];
			players[2].bet = 0;
		}
	}

	if(game_state == 2){
		if(key == "1" && double_button.visible){
			double_button.callback();
		}

		if(key == "2"){
			hit_button.callback();
		}

		if(key == "3" || key == "Enter"){
			stand_button.callback();
		}

		if(key == "4" && split_button.visible){
			split_button.callback();
		}
	}

	if(key == "m"){
		if(current_screen == 0){
			current_screen = 1;

			for (let i = 0; i < buttons.length; i++) {
				buttons[i].visible = false;
			}
	
			back_button.visible = true;
			return;
		}
		

		back_button.callback();
	}
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', handleMouseDown, false);
document.addEventListener('mouseup', handleMouseUp, false);

function keyPressed(evt){
	handle_key_input(evt.key);
}

function keyReleased(evt){
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);
