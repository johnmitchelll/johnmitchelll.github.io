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

	if(mouseDown == true && prevMouseDown == true && 
	   tile_selected[0] == Math.floor((mouseY - BOARD_DIM[1]) / INDIVIDUAL_DIM[1]) &&
	   tile_selected[1] == Math.floor((mouseX - BOARD_DIM[0]) / INDIVIDUAL_DIM[0])){
			piece_in_hand = tile_selected;
	}
}

function handleMouseUp(evt) {
	// evt.preventDefault();
	mouseDown = false;
	handle_tile_input(true);
}

function handleMouseDown(evt){
	// evt.preventDefault();
	mouseDown = true;
	handle_buttons();
	handle_board_click();
	handle_pawn_upgrade();
	game_history.handle_buttons_input();
	game_history.handle_mouse_down();
	prevMouseDown = true;
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
	if(prevMouseDown == true || game_ref.game_over != -1 || game_ref.pawn_upgrade[0] != -1) return;
	if(cpu_turn_to_think) return;

	if(mouseX < BOARD_DIM[0] || mouseX > BOARD_DIM[0] + BOARD_DIM[2] || mouseY < BOARD_DIM[1] || mouseY > BOARD_DIM[1] + BOARD_DIM[3]){
		tile_selected = [-1, -1];
		movable_tiles = [];
		return;
	}

	handle_tile_input(false)
}

function handle_tile_input(mouse_up){
	let mouse_i = Math.floor((mouseY - BOARD_DIM[1]) / INDIVIDUAL_DIM[1]);
	let mouse_j = Math.floor((mouseX - BOARD_DIM[0]) / INDIVIDUAL_DIM[0]);
	board_expanded = game_ref.board.split("/");
	piece_in_hand = [-1, -1]; 
	
	for (let i = 0; i < movable_tiles.length; i++) {
		if(movable_tiles[i][0] == mouse_i && movable_tiles[i][1] == mouse_j){

			game_history.update_data(board_expanded, tile_selected, [mouse_i, mouse_j]);
			game_ref.board = move_piece_on_board(board_expanded, tile_selected, [mouse_i, mouse_j], false, game_ref, true);
			tile_selected = [-1, -1];
			movable_tiles = [];

			if(game_ref.pawn_upgrade[0] != -1){
				return;
			}

			game_history.add_check_to_formatted();
			game_ref.turn = (game_ref.turn+1)%2;
			check_for_game_over(board_expanded, game_ref.turn, game_ref);
			game_ref.king_in_check = is_king_in_check(board_expanded, (game_ref.turn == 1) ? "w" : "b", game_ref);
			game_history.boards.push(game_ref.board);

			return;
		}
	}

	if(mouse_up) return;

	let friendly_color = (game_ref.turn == 1) ? "w" : "b";
	if(board_expanded[i_1D(mouse_i, mouse_j)][0] != friendly_color){
		tile_selected = [-1, -1];
		movable_tiles = [];
		return;
	}

	tile_selected[0] = mouse_i;
	tile_selected[1] = mouse_j;
	
	movable_tiles = get_valid_moves(board_expanded, tile_selected, false, game_ref);
}

function handle_pawn_upgrade(){
	if(game_ref.pawn_upgrade[0] == -1) return;

	let x = BOARD_DIM[0]+INDIVIDUAL_DIM[0]*game_ref.pawn_upgrade[1]+INDIVIDUAL_DIM[0]/2-PAWN_UPGRADE_DIM[0]/2;
    let y = BOARD_DIM[1]+INDIVIDUAL_DIM[1]*game_ref.pawn_upgrade[0]-PAWN_UPGRADE_DIM[1]-30;
	if(game_ref.pawn_upgrade[0] == 7) y = BOARD_DIM[1]+INDIVIDUAL_DIM[1]*game_ref.pawn_upgrade[0]+INDIVIDUAL_DIM[1]+30;

	if(mouseX >= x && mouseX <= x + PAWN_UPGRADE_DIM[0] && mouseY >= y && mouseY <= y + PAWN_UPGRADE_DIM[1]){
		let pawn_upgrade_index = Math.floor((mouseX - x) / (PAWN_UPGRADE_DIM[0]/4));

		game_ref.board = select_pawn_upgrade(game_ref.board.split("/"), game_ref.pawn_upgrade, PAWN_UPGRADE_TYPES[pawn_upgrade_index], game_ref);
		game_ref.pawn_upgrade = [-1, -1];

		game_history.add_upgrade_to_formatted(pawn_upgrade_index);
		game_history.format_data();
		game_history.add_check_to_formatted();

		game_ref.turn = (game_ref.turn+1)%2;
		check_for_game_over(game_ref.board.split("/"), game_ref.turn, game_ref);
		if(game_ref.game_over != -1) rematch_button.visible = true;
		game_ref.king_in_check = is_king_in_check(game_ref.board.split("/"), (game_ref.turn == 1) ? "w" : "b", game_ref);
		game_history.boards.push(game_ref.board);
	}
}

function handle_key_input(key){
	if(key == "ArrowLeft") game_history.move(true);
	if(key == "ArrowRight") game_history.move(false);
	
	if(key == "ArrowUp") game_history.scroll(true);
	if(key == "ArrowDown") game_history.scroll(false);
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
