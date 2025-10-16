

function History(){
    this.data = []; // "from/to/from_piece/to_piece/special" (special is for pawn upgrades, enp, and castleing); 
    this.formatted = [];
    this.boards = [game_ref.board];
    this.pieces_captured = [[[], []]];
    this.DIM = [BOARD_DIM[0]+BOARD_DIM[2]+25, BOARD_DIM[1], CANVAS_WIDTH - (BOARD_DIM[0]+BOARD_DIM[2]) - 50, BOARD_DIM[3]];
    this.current_move = -1;
    this.scroll_top = 0;

    this.update_data = function(board, from, to){
        let from_1D = i_1D(from[0], from[1]);
        let to_1D = i_1D(to[0], to[1]);
        let output = from_1D + "/" + to_1D + "/" + board[from_1D] + "/" + board[to_1D];

        if(board[to_1D] != "e" && board[to_1D].slice(1) != "enp") pieces_captured[game_ref.turn].push(board[to_1D]);
        this.pieces_captured.push(deepCopy(pieces_captured));
        
        if(board[from_1D].slice(1) == "k" && Math.abs(from_1D - to_1D) == 2){
            output += "/castle/";

            let rook_from_index = (to[1] > 4) ? 7 : 0;
            let rook_to_index = (to[1] > 4) ? to[1]-1 : to[1]+1;

            output += rook_from_index + "/" + rook_to_index; // we know the row from the prev info
        }

        if(board[to_1D].slice(1) == "enp") output += "/enp/" + to[1]; // if there is an enp we want to keep track of the row that the taken piece is from.

        for (let i = this.data.length-1; i > this.current_move; i--) {
            this.data.splice(i, 1);
            this.boards.splice(i+1, 1);
            this.formatted.splice(i, 1);
            this.pieces_captured.splice(i+1, 1);
        }

        this.data.push(output);
        this.format_data();
        this.scroll_top = Math.max(0, Math.ceil(this.formatted.length/2)-11);
        this.current_move = this.data.length-1;

        if(this.boards.length < 6) return;
        if(this.boards[this.boards.length-8] == this.boards[this.boards.length-4] && this.boards[this.boards.length-6] == this.boards[this.boards.length-2] &&
           this.boards[this.boards.length-7] == this.boards[this.boards.length-3] && this.boards[this.boards.length-1] == this.boards[this.boards.length-5]){
            game_ref.game_over = 2;
        }
    }

    this.move = function(backwards){
        if(backwards && this.current_move == -1 || !backwards && this.current_move == this.data.length-1) return;

        game_ref.game_over = -1;
        
        let split_board;
        if(backwards){
            this.current_move--;
            split_board = this.boards[this.current_move+1].split("/");
            move_sound_fx.play();
        }else{
            this.current_move++;
            split_board = this.boards[this.current_move+1].split("/");

            if(this.data[this.current_move].split("/")[3] != "e") capture_sound_fx.play();
            else move_sound_fx.play();
        } 

        if(Math.floor(this.current_move/2) < this.scroll_top && this.current_move != -1) this.scroll_top = Math.floor(this.current_move/2);
        if(Math.floor(this.current_move/2) > this.scroll_top+10) this.scroll_top = Math.floor(this.current_move/2)-10;

        game_ref.board = split_board.join("/");
        game_ref.turn = (game_ref.turn+1)%2;
        pieces_captured = this.pieces_captured[this.current_move+1];
        tile_selected = [-1, -1];
        movable_tiles = [];
        check_for_game_over(split_board, game_ref.turn, game_ref);
        game_ref.king_in_check = is_king_in_check(split_board, (game_ref.turn == 1) ? "w" : "b", game_ref);
    }

    this.scroll = function(up){
        if(up && this.scroll_top != 0) this.scroll_top--;
        if(!up && this.scroll_top != Math.max(0, Math.ceil(this.formatted.length/2)-11)) this.scroll_top++;
    }

    this.draw = function(){
        colorRect(this.DIM[0], this.DIM[1], this.DIM[2], this.DIM[3], "rgba(0,0,0,0.2)");
        let running_row = 0;
        let bottom_row = Math.min(Math.ceil(this.formatted.length/2), this.scroll_top+11);

        for (let i = this.scroll_top; i < Math.max(bottom_row, 1); i++) {
            if(i % 2 == 1) colorRect(this.DIM[0], this.DIM[1]+60*running_row+5, this.DIM[2], 60, "rgba(0,0,0,0.25)");
            drawText("grey", "36px pixel_font", (i+1) + ".", this.DIM[0]+20, this.DIM[1]+60*running_row+40);

            for (let j = 0; j < 2; j++) {
                if(!this.formatted[i*2+j]) break;

                if(i*2+j == this.current_move){
                    let width = measureText(this.formatted[i*2+j], 36, "pixel_font").width;
                    colorRect(this.DIM[0]+60+100*j-10, this.DIM[1]+60*running_row+15, width+20, 36, "rgba(255, 255, 255, 0.25)");
                }

                drawText("white", "36px pixel_font", this.formatted[i*2+j], this.DIM[0]+60+100*j, this.DIM[1]+60*running_row+40);
            }
            
            running_row++;
        }

        this.draw_history_buttons();
    }

    this.format_data = function(){
        let i = this.data.length-1;
        let split_data = this.data[i].split("/");

        if(split_data[4] == "castle"){
            this.add_castle_to_formatted(split_data);
            return;
        }

        let to_index = i_2D(parseInt(split_data[1]));
        let file = FILES[to_index[1]];
        let rank = 8-to_index[0];
        
        if(game_ref.white_side == 0){
            file = FILES[7-to_index[1]];
            rank = to_index[0]+1;
        }

        let piece_type = split_data[2].slice(1)
        
        this.formatted[i] = piece_type.toUpperCase();

        if(piece_type == "kn") this.formatted[i] = "N";
        if(piece_type == "km") this.formatted[i] = "K";
        if(piece_type == "rm") this.formatted[i] = "R";
        else if(piece_type == "p"){
            this.formatted[i] = "";
            let from_file = FILES[i_2D(parseInt(split_data[0]))[1]]
            if(game_ref.white_side == 0) from_file = FILES[7-i_2D(parseInt(split_data[0]))[1]];

            if(split_data[3] != "e") this.formatted[i] = from_file; // file from where pawn was
        }

        if(split_data[3] != "e") this.formatted[i] += "x";
        
        this.formatted[i] += file + "" + rank;

        if(split_data[4] == "upgrade") this.formatted[i] += "=" + split_data[5].toUpperCase();
    }

    this.add_upgrade_to_formatted = function(pawn_upgrade_index){
        this.data[game_history.data.length-1] += "/upgrade/";
        if(PAWN_UPGRADE_TYPES[pawn_upgrade_index] == "kn") this.data[game_history.data.length-1] += "N";
        else this.data[game_history.data.length-1] += PAWN_UPGRADE_TYPES[pawn_upgrade_index];
    }

    this.add_castle_to_formatted = function(split_data){
        if(Math.abs(parseInt(split_data[5]) - parseInt(split_data[6])) == 3) this.formatted.push("O-O-O");
        else this.formatted.push("O-O");
    }

    this.add_check_to_formatted = function(){
        let split_data = this.data[this.data.length-1].split("/");
        let enemy_color = (split_data[2][0] == "w") ? "b" : "w";

        if(is_king_in_check(game_ref.board.split("/"), enemy_color, game_ref) && are_moves_availible(game_ref.board.split("/"), enemy_color, game_ref) == false){
            this.formatted[this.formatted.length-1] += "#"
        }else if(is_king_in_check(game_ref.board.split("/"), enemy_color, game_ref)){
            this.formatted[this.formatted.length-1] += "+"
        }
    }

    const LEFT_DIM = [this.DIM[0]+this.DIM[2]/2-90, this.DIM[1] + this.DIM[3] + 35, 54, 50];
    const RIGHT_DIM = [this.DIM[0]+this.DIM[2]/2+90, this.DIM[1] + this.DIM[3] + 35, 54, 50];
    const UP_DIM = [this.DIM[0]+this.DIM[2]/2-30, this.DIM[1] + this.DIM[3] + 35, 54, 50];
    const DOWN_DIM = [this.DIM[0]+this.DIM[2]/2+30, this.DIM[1] + this.DIM[3] + 35, 54, 50];
    this.BUTTON_DIM = [LEFT_DIM, RIGHT_DIM, UP_DIM, DOWN_DIM];

    this.draw_history_buttons = function(){
        if(this.data.length == 0) return;

        if(this.data.length <= 22){
            drawImageFromSpriteSheetWithRotation(left_img, 0, 0, 54, 50, this.BUTTON_DIM[2][0], this.BUTTON_DIM[2][1], this.BUTTON_DIM[2][2], this.BUTTON_DIM[2][3], 0, false)
            drawImageFromSpriteSheetWithRotation(right_img, 0, 0, 54, 50, this.BUTTON_DIM[3][0], this.BUTTON_DIM[3][1], this.BUTTON_DIM[3][2], this.BUTTON_DIM[3][3], 0, false)
            return;
        }

        drawImageFromSpriteSheetWithRotation(left_img, 0, 0, 54, 50, this.BUTTON_DIM[0][0], this.BUTTON_DIM[0][1], this.BUTTON_DIM[0][2], this.BUTTON_DIM[0][3], 0, false)
        drawImageFromSpriteSheetWithRotation(right_img, 0, 0, 54, 50, this.BUTTON_DIM[1][0], this.BUTTON_DIM[1][1], this.BUTTON_DIM[1][2], this.BUTTON_DIM[1][3], 0, false)
        drawImageFromSpriteSheetWithRotation(up_img, 0, 0, 54, 50, this.BUTTON_DIM[2][0], this.BUTTON_DIM[2][1], this.BUTTON_DIM[2][2], this.BUTTON_DIM[2][3], 0, false)
        drawImageFromSpriteSheetWithRotation(down_img, 0, 0, 54, 50, this.BUTTON_DIM[3][0], this.BUTTON_DIM[3][1], this.BUTTON_DIM[3][2], this.BUTTON_DIM[3][3], 0, false)
    }

    this.handle_buttons_input = function(){
        if(mouseDown == false || prevMouseDown == true || game_ref.pawn_upgrade[0] != -1) return;

        if(this.data.length <= 22){
            if(mouseX > this.BUTTON_DIM[2][0] - this.BUTTON_DIM[2][2]/2 && mouseX < this.BUTTON_DIM[2][0] + this.BUTTON_DIM[2][2]/2 && 
               mouseY > this.BUTTON_DIM[2][1] - this.BUTTON_DIM[2][3]/2 && mouseY < this.BUTTON_DIM[2][1] + this.BUTTON_DIM[2][3]/2) this.move(true);

            if(mouseX > this.BUTTON_DIM[3][0] - this.BUTTON_DIM[3][2]/2 && mouseX < this.BUTTON_DIM[3][0] + this.BUTTON_DIM[3][2]/2 && 
               mouseY > this.BUTTON_DIM[3][1] - this.BUTTON_DIM[3][3]/2 && mouseY < this.BUTTON_DIM[3][1] + this.BUTTON_DIM[3][3]/2) this.move(false);

            return;
        }

        if(mouseX > this.BUTTON_DIM[0][0] - this.BUTTON_DIM[0][2]/2 && mouseX < this.BUTTON_DIM[0][0] + this.BUTTON_DIM[0][2]/2 && 
        mouseY > this.BUTTON_DIM[0][1] - this.BUTTON_DIM[0][3]/2 && mouseY < this.BUTTON_DIM[0][1] + this.BUTTON_DIM[0][3]/2) this.move(true);

        if(mouseX > this.BUTTON_DIM[1][0] - this.BUTTON_DIM[1][2]/2 && mouseX < this.BUTTON_DIM[1][0] + this.BUTTON_DIM[1][2]/2 && 
        mouseY > this.BUTTON_DIM[1][1] - this.BUTTON_DIM[1][3]/2 && mouseY < this.BUTTON_DIM[1][1] + this.BUTTON_DIM[1][3]/2) this.move(false);
        
        if(mouseX > this.BUTTON_DIM[2][0] - this.BUTTON_DIM[2][2]/2 && mouseX < this.BUTTON_DIM[2][0] + this.BUTTON_DIM[2][2]/2 && 
        mouseY > this.BUTTON_DIM[2][1] - this.BUTTON_DIM[2][3]/2 && mouseY < this.BUTTON_DIM[2][1] + this.BUTTON_DIM[2][3]/2) this.scroll(true);

        if(mouseX > this.BUTTON_DIM[3][0] - this.BUTTON_DIM[3][2]/2 && mouseX < this.BUTTON_DIM[3][0] + this.BUTTON_DIM[3][2]/2 && 
        mouseY > this.BUTTON_DIM[3][1] - this.BUTTON_DIM[3][3]/2 && mouseY < this.BUTTON_DIM[3][1] + this.BUTTON_DIM[3][3]/2) this.scroll(false);
    }
    
    this.handle_mouse_down = function(){
        if(mouseX < this.DIM[0] || mouseX > this.DIM[0] + this.DIM[2] || mouseY < this.DIM[1] || mouseY > this.DIM[1] + this.DIM[3]) return;

        game_ref.game_over = -1;

        let index_2D = [Math.floor((mouseY - this.DIM[1]) / (this.DIM[3] / 11)) + this.scroll_top, (mouseX - this.DIM[0] < this.DIM[2] / 2) ? 0 : 1];
        index = index_2D[0] * 2 + index_2D[1];

        if(index == this.current_move) return;

        this.current_move = index;
        if(!this.boards[this.current_move+1]) return;

        let split_board = this.boards[this.current_move+1].split("/");
        move_sound_fx.play();

        game_ref.board = split_board.join("/");
        game_ref.turn = index_2D[1];
        pieces_captured = this.pieces_captured[this.current_move+1];
        tile_selected = [-1, -1];
        movable_tiles = [];
        check_for_game_over(split_board, game_ref.turn, game_ref);
        game_ref.king_in_check = is_king_in_check(split_board, (game_ref.turn == 1) ? "w" : "b", game_ref);
    }
}