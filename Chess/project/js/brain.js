
function Brain(hero, game){
    this.hero = hero;
    this.game = game;
    this.MAX_DEPTH = 4;

    this.get_best_move = async function(){
        this.game = deepCopyObject(game_ref);
        let best_move = await this.mini_max(this.game.board.split("/"), this.game, 0, this.hero, -Infinity, Infinity);

        let board_expanded = game_ref.board.split("/");

        game_history.update_data(board_expanded, best_move.move.from, best_move.move.to);
        game_ref.board = move_piece_on_board(board_expanded, best_move.move.from, best_move.move.to, false, game_ref, true);

        if(game_ref.pawn_upgrade[0] != -1){
            game_ref.board = best_move.board.join("/");

            // what did we upgrade to?
            let upgraded_piece = best_move.board[i_1D(best_move.move.to[0], best_move.move.to[1])];
            let pawn_upgrade_index = PAWN_UPGRADE_TYPES.indexOf(upgraded_piece.slice(1)); 
            
            game_history.add_upgrade_to_formatted(pawn_upgrade_index);
            game_history.format_data();
            
            game_ref.pawn_upgrade = [-1, -1];
        }

        game_history.add_check_to_formatted();

        game_ref.turn = (game_ref.turn+1)%2;

        check_for_game_over(board_expanded, game_ref.turn, game_ref);
		if(game_ref.game_over != -1) rematch_button.visible = true;
		game_ref.king_in_check = is_king_in_check(board_expanded, (game_ref.turn == 1) ? "w" : "b", game_ref);
		game_history.boards.push(game_ref.board);
    }

    this.mini_max = function(board, game, depth, turn, alpha, beta){

        try{
            if(check_for_game_over(board, turn, game) || depth >= this.MAX_DEPTH) return this.evaluate(board, turn, game);
        } catch(err){
            console.log(check_for_game_over(board, turn, game), depth, board, turn, game);
        }
        
        
        let valid_moves = [];
        let min_max_score = (turn == this.hero) ?  -Infinity : Infinity;
        let best_move;
        
        for (let i = 0; i < board.length; i++) {
            if((turn == 0 && board[i][0] == "b" || turn == 1 && board[i][0] == "w") && board[i].slice(1) != "enp"){

                let valid_moves_for_piece = get_valid_moves(board, i_2D(i), false, game);
                if(valid_moves_for_piece.length == 0) continue;

                for (let j = 0; j < valid_moves_for_piece.length; j++) {
                    valid_moves.push({ from: i_2D(i), to: valid_moves_for_piece[j] });
                }
            }
        }

        let sorted_boards = this.sort_boards(valid_moves, board, game, depth, turn);

        for (let i = 0; i < sorted_boards.length; i++) {
            if(turn == this.hero){
                let score = this.mini_max(sorted_boards[i].board, game, depth+1, (turn+1)%2, alpha, beta)
                
                if(depth == 0 && score > min_max_score) best_move = { board: sorted_boards[i].board, move: sorted_boards[i].move };

                min_max_score = Math.max(min_max_score, score);
                if(min_max_score >= beta) break;
                alpha = Math.max(alpha, min_max_score);
            }else{
                let score = this.mini_max(sorted_boards[i].board, game, depth+1, (turn+1)%2, alpha, beta)
                min_max_score = Math.min(min_max_score, score);
                if(min_max_score <= alpha) break; 
                beta = Math.min(beta, min_max_score);
            }
        }

        if(depth == 0) return best_move;
        return min_max_score;
    }

    this.sort_boards = function(valid_moves, board, game, depth, turn){
        let sorted_boards = [];

        for (let i = 0; i < valid_moves.length; i++) {
            let board_copy = deepCopy(board);
            board_copy = move_piece_on_board(board_copy, valid_moves[i].from, valid_moves[i].to, false, game);
            clear_en_passants(board_copy);

            if(game.pawn_upgrade[0] != -1){
                for (let j = 0; j < 4; j++) {
                    board_copy = select_pawn_upgrade(board_copy.split("/"), game.pawn_upgrade, PAWN_UPGRADE_TYPES[j], game);
                    
                    let board_info_to_push = { score: this.evaluate(board_copy.split("/"), turn, game), board: board_copy.split("/") };
                    if(depth == 0) board_info_to_push.move = valid_moves[i];
                    sorted_boards.push(board_info_to_push);
                }

                game.pawn_upgrade = [-1, -1];
                continue;
            }
            
            let board_info_to_push = { score: this.evaluate(board_copy.split("/"), turn, game), board: board_copy.split("/") };
            if(depth == 0) board_info_to_push.move = valid_moves[i];
            sorted_boards.push(board_info_to_push);
        }

        if(turn == this.hero) sorted_boards.sort((a, b) => b.score - a.score);
        else sorted_boards.sort((a, b) => a.score - b.score);

        return sorted_boards;
    }

    this.evaluate = function(board, turn, game){
        let score = 0;
        let color = (this.hero == 0) ? "b" : "w";

        let game_copy = deepCopyObject(game);
        check_for_game_over(board, turn, game_copy);
        if(game_copy.game_over == this.hero) score += 1000;
        else if(game_copy.game_over == (this.hero+1)%2) score -= 1000;

        for (let i = 0; i < board.length; i++) {
            if(board[i] == "e" || board[i].slice(1) == "enp") continue;

            if(board[i][0] == color){
                let piece_score = PIECE_SCORE[board[i].slice(1)] + PIECE_EVAL_TABLE[board[i].slice(1)][63-i];
                score += piece_score;
            } else{
                let piece_score = PIECE_SCORE[board[i].slice(1)] + PIECE_EVAL_TABLE[board[i].slice(1)][i];
                score -= piece_score;
            } 
        }

        return score;
    }
}

function play_brain(){
    if(game_ref.game_over != -1) return;
    if(game_ref.black_side == 0 && game_ref.turn ==  1 || game_ref.white_side == 0 && game_ref.turn ==  0 || cpu_turn_to_think) return;

    cpu_turn_to_think = true;

    if(game_history.boards[game_history.current_move+2]){
        setTimeout(() => {
            cpu_turn_to_think = false;
            game_history.move(false);
        }, 1000);

        return;
    }

    setTimeout(() => {
        cpu_turn_to_think = false;
        brain.get_best_move();
    }, 500);
}