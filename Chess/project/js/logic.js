
function get_valid_moves(board, i, query, game){
    let i_1d = i_1D(i[0], i[1]);

    let piece_full = board[i_1d];
    let color = (piece_full[0] == 'b') ? 0 : 1;
    let piece = piece_full.slice(1);

    if(!piece) return [];

    // console.log(piece)
    let valid_moves
    try {
        valid_moves = MOVE_DATA[piece](board, i, color, game);
    } catch(err) {
        console.log(err, piece, board, i, color, game)
        return;
    }

    if(query) return valid_moves;

    for (let j = valid_moves.length-1; j >= 0; j--) {
        if(will_move_put_king_in_check(board, i, valid_moves[j], game) != false){
            valid_moves.splice(j, 1);
        }
    }

    return valid_moves;
}

function tile_in_check(board, tile, hero, game){
    hero = (hero == 1) ? "w" : "b";
    let villan = (hero == "b") ? "w" : "b";
    let villan_side = (villan == "w") ? game.white_side : game.black_side;

    for (let i = 0; i < board.length; i++) {
        if(board[i] == villan + "k" && i_2D(i)[0] == villan_side) continue; // edge case, infinite loop of checking for other kings castle ability
        if(board[i][0] == hero || board[i][0] == "e" || board[i].slice(1) == "enp") continue;

        let possible_move_locations = [];
        if(board[i][0] == villan) possible_move_locations = get_valid_moves(board, i_2D(i), true, game);

        for (let j = 0; j < possible_move_locations.length; j++) {
            if(possible_move_locations[j][0] == tile[0] && possible_move_locations[j][1] == tile[1]) return i_2D(i); // from what piece
        }
    }

    return false;
}

function move_piece_on_board(board, from, to, query, game, audio){
    let from_1d = i_1D(from[0], from[1]);
    let to_1d = i_1D(to[0], to[1]);

    if(!audio){
        set_move_indicators(board, from_1d, to_1d, query, game);
        return board.join('/');
    } 
    
    if(board[to_1d] == "e"){
        move_sound_fx.play();
    }else if(board[from_1d].slice(1) != "p" && board[to_1d].slice(1) == "enp"){
        move_sound_fx.play();
    }else{
        capture_sound_fx.play();
    }

    set_move_indicators(board, from_1d, to_1d, query, game);

    return board.join('/');
}

function set_move_indicators(board, from, to, query, game){
    let from_2d = i_2D(from);
    let to_2d = i_2D(to);

    if(board[from].slice(1) == "k"){
        [board[from], board[to]] = ["e", board[from][0] + "km"]; // we haved moved the knight

        if(Math.abs(from_2d[1] - to_2d[1]) == 2){
            let rook_from_index = (to_2d[1] > 4) ? 7 : 0;
            let rook_to_index = (to_2d[1] > 4) ? to_2d[1]-1 : to_2d[1]+1;

            rook_from_index = i_1D(from_2d[0], rook_from_index);
            rook_to_index = i_1D(to_2d[0], rook_to_index);

            [board[rook_from_index], board[rook_to_index]] = [board[rook_to_index], board[rook_from_index]];
        }

        clear_en_passants(board);

        return;
    }

    if(board[from].slice(1) == "r"){
        [board[from], board[to]] = ["e", board[from][0] + "rm"]; // we haved moved the knight
        clear_en_passants(board);
        return;
    }

    if(board[from].slice(1) == "p"){ // acknoladge the en passant once piece has gone out two tiles, once it moves again remove it
        if(Math.abs(from_2d[0] - to_2d[0]) == 2){
            clear_en_passants(board);
            board[i_1D((from_2d[0] + to_2d[0]) / 2, from_2d[1])] = board[from][0] + "enp";
            [board[from], board[to]] = ["e", board[from]];
            return;
        }
        
        if(board[to].slice(1) == "enp"){
            [board[from], board[to]] = ["e", board[from]];
            board[i_1D(from_2d[0], to_2d[1])] = "e";
            clear_en_passants(board);
            return;
        }
    }

    clear_en_passants(board);
    [board[from], board[to]] = ["e", board[from]];

    if(!query && board[to].slice(1) == "p" && (to_2d[0] == 0 || to_2d[0] == 7)) game.pawn_upgrade = to_2d;
}

function clear_en_passants(board){
    for (let i = 0; i < 8; i++) { // clear all en passants, only get one chance to do it
        if(board[i_1D(2, i)].slice(1) == "enp") board[i_1D(2, i)] = "e";
        if(board[i_1D(5, i)].slice(1) == "enp") board[i_1D(5, i)] = "e";
    }
}

function will_move_put_king_in_check(board, from, to, game){
    let board_copy = deepCopy(board);
    let color = board[i_1D(from[0], from[1])][0];

    move_piece_on_board(board_copy, from, to, true, game);

    return is_king_in_check(board_copy, color, game);
}

function is_king_in_check(board, color, game){
    let king_tile;
    for (let i = 0; i < board.length; i++) {
        if(board[i] == color + "k" || board[i] == color + "km") king_tile = i_2D(i);
    }

    if(tile_in_check(board, king_tile, (color == "w") ? 1 : 0, game) == false) return false;
    return king_tile;
}

function check_for_game_over(board, turn, game){
    let color = (turn == 0) ? "b" : "w";

    if(is_king_in_check(board, color, game) && are_moves_availible(board, color, game) == false) game.game_over = (turn+1)%2;
    else if(are_moves_availible(board, color, game) == false) game.game_over = 2;
    else return false;

    return true;
}

function are_moves_availible(board, color, game){
    for (let i = 0; i < board.length; i++) {
        if(board[i] == "e" || board[i].slice(1) == "enp" || board[i][0] != color) continue;
        if(get_valid_moves(board, i_2D(i), false, game).length > 0) return true;
    }

    return false;
}

function select_pawn_upgrade(board, tile, type){
    board[i_1D(tile[0], tile[1])] = board[i_1D(tile[0], tile[1])][0] + type;
    return board.join("/");
}

function is_board_quiet(board, color, game){
    for (let i = 0; i < board.length; i++) {
        if(board[i][0] != color || board[i] == "e" || board[i].slice(1) == "enp" || board[i].slice(1) == "p") continue;
        if(tile_in_check(board, i_2D(i), (color == "b") ? 0 : 1, game)) return false;
    }

    return true;
}

// helper for the logic

function i_1D(i, j){ // go from 2d to 1d
    return i * 8 + j;
}

function i_2D(i){ // go from 1d to 2d
    return [Math.floor(i / 8), i % 8];
}

function extend_compressed_board_string(str) {
    return str.replace(/\/s\/(\d+)\b/g, (_, count) => {
        return '/' + Array.from({ length: parseInt(count) }, () => 'e').join('/');
    });
}

function compress_extended_board_string(str) {
    const parts = str.split('/');
    let result = [];
    let eCount = 0;

    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'e') {
            eCount++;
        } else {
            if (eCount > 2) {
                result.push(`s/${eCount}`);
            } else {
                for (let j = 0; j < eCount; j++) {
                    result.push('e');
                }
            }
            eCount = 0;
            result.push(parts[i]);
        }
    }

    // Handle trailing e's
    if (eCount > 2) {
        result.push(`s/${eCount}`);
    } else {
        for (let j = 0; j < eCount; j++) {
            result.push('e');
        }
    }

    return result.join('/');
}