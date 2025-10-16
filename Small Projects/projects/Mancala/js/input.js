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
	handle_board_click();
}


function handle_buttons(){
	if(prevMouseDown == true) return;

	for (let i = 0; i < buttons.length; i++) {
		if(buttons[i].visible == false || buttons[i].clickable == false) continue;
		if(mouseX > buttons[i].x-buttons[i].w/2-10 && mouseX < buttons[i].x+buttons[i].w/2+10 &&
		   mouseY > buttons[i].y-buttons[i].h/2-10 && mouseY < buttons[i].y+buttons[i].h/2+10){
				buttons[i].callback();
		}
	}
}

function handle_board_click(){
	if(prevMouseDown == true || board.turn == 1) return;

	for (let i = 0; i < 6; i++) {
		if(distanceOfTwoPoints(mouseX, mouseY, BOARD_DIM[0]+(i+1)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R) < BOARD_HOLE_R){
			select_hole(7 + (5-i));
		}

		if(distanceOfTwoPoints(mouseX, mouseY, BOARD_DIM[0]+(i+1)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING-BOARD_HOLE_R) < BOARD_HOLE_R){
			select_hole(i);
		}
	}
}

async function select_hole(hole){
	if(middle_of_turn) return;

	if((board.turn == 0 && hole > 5) || (board.turn == 1 && hole < 7)){
		show_helping_arrows = Date.now() + 1000;
		return;
	}	

	middle_of_turn = true;
	await board.play_hole(hole); // top
	middle_of_turn = false;
}

function handle_key_input(key){
	
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
