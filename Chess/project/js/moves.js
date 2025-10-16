pawn_move = (board, i, color, game) => {
    let valid_tiles = [];

    let starting_side = (color == 0) ? game.black_side : game.white_side;
    let starting_row = (starting_side == 7) ? 6 : 1;
    let first_move = (i[0] == starting_row) ? true : false;
    let dir = (starting_side == 7) ? -1 : 1;

    if(first_move && board[i_1D(i[0] + 2*dir, i[1])] == "e" && board[i_1D(i[0] + 1*dir, i[1])] == "e") valid_tiles.push([i[0] + 2*dir, i[1]]);

    let friendly_color = (color == 0) ? "b" : "w";

    if(i[0] - 1 < 0 || i[0] + 1 > 7) return valid_tiles;

    if(board[i_1D(i[0] + 1*dir, i[1])] == "e") valid_tiles.push([i[0] + 1*dir, i[1]]); // strait

    // left right
    if(i[1] - 1 >= 0 && board[i_1D(i[0] + 1*dir, i[1] - 1)] != "e" && board[i_1D(i[0] + 1*dir, i[1] - 1)][0] != friendly_color) valid_tiles.push([i[0] + 1*dir, i[1] - 1]);
    if(i[1] + 1 <= 7 && board[i_1D(i[0] + 1*dir, i[1] + 1)] != "e" && board[i_1D(i[0] + 1*dir, i[1] + 1)][0] != friendly_color) valid_tiles.push([i[0] + 1*dir, i[1] + 1]);

    return valid_tiles;
};

rook_move = (board, i, color) => {
    const valid_tiles = [];
    const friendly_color = color === 0 ? "b" : "w";
    const directions = [
        [-1, 0], // north
        [1, 0],  // south
        [0, 1],  // east
        [0, -1]  // west
    ];

    for (const [dy, dx] of directions) {
        let y = i[0] + dy;
        let x = i[1] + dx;

        while (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
            const idx = i_1D(y, x);
            const tile = board[idx];

            if (tile === "e" || tile.slice(1) == "enp") {
                valid_tiles.push([y, x]);
            } else if (tile[0] !== friendly_color) {
                valid_tiles.push([y, x]);
                break;
            } else {
                break;
            }

            y += dy;
            x += dx;
        }
    }

    return valid_tiles;
};

knight_move  = (board, i, color) => {
    const valid_tiles = [];
    const friendly_color = color === 0 ? "b" : "w";
    const knight_moves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dy, dx] of knight_moves) {
        const y = i[0] + dy;
        const x = i[1] + dx;

        if (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
            const tile = board[i_1D(y, x)];
            if ((tile === "e" || tile[0] !== friendly_color)) {
                valid_tiles.push([y, x]);
            }
        }
    }

    return valid_tiles;
};

bishop_move = (board, i, color) => {
    const valid_tiles = [];
    const friendly_color = color === 0 ? "b" : "w";
    const directions = [
        [-1, -1], // northwest
        [-1, 1],  // northeast
        [1, -1],  // southwest
        [1, 1]    // southeast
    ];

    for (const [dy, dx] of directions) {
        let y = i[0] + dy;
        let x = i[1] + dx;

        while (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
            const idx = i_1D(y, x);
            const tile = board[idx];

            if (tile === "e" || tile.slice(1) == "enp") {
                valid_tiles.push([y, x]);
            } else if (tile[0] !== friendly_color) {
                valid_tiles.push([y, x]);
                break;
            } else {
                break;
            }

            y += dy;
            x += dx;
        }
    }

    return valid_tiles;
};

queen_move = (board, i, color) => {
    const valid_tiles = [];
    const friendly_color = color === 0 ? "b" : "w";
    const directions = [
        [-1, 0], [1, 0], [0, 1], [0, -1],    // rook directions (N, S, E, W)
        [-1, -1], [-1, 1], [1, -1], [1, 1]   // bishop directions (NW, NE, SW, SE)
    ];

    for (const [dy, dx] of directions) {
        let y = i[0] + dy;
        let x = i[1] + dx;

        while (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
            const idx = i_1D(y, x);
            const tile = board[idx];

            if (tile === "e" || tile.slice(1) == "enp") {
                valid_tiles.push([y, x]);
            } else if (tile[0] !== friendly_color) {
                valid_tiles.push([y, x]);
                break;
            } else {
                break;
            }

            y += dy;
            x += dx;
        }
    }

    return valid_tiles;
};

king_move = (board, i, color, game) => {
    const valid_tiles = [];
    const friendly_color = color === 0 ? "b" : "w";
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],     // vertical and horizontal
        [-1, -1], [-1, 1], [1, -1], [1, 1]    // diagonals
    ];

    for (const [dy, dx] of directions) {
        const y = i[0] + dy;
        const x = i[1] + dx;

        if (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
            const tile = board[i_1D(y, x)];
            if (tile === "e" || tile[0] !== friendly_color) {
                valid_tiles.push([y, x]);
            }
        }
    }

    // check for castling, k and r are in og spots, no pieces between them, no spaces are in check the king has to move in
    let starting_board = (game.white_side == 7) ? HERO_WHITE_STARTING_BOARD : HERO_BLACK_STARTING_BOARD;
    starting_board = extend_compressed_board_string(starting_board).split("/");

    if(board[i_1D(i[0], i[1])] != starting_board[i_1D(i[0], i[1])]) return valid_tiles; // if not in og
    if(tile_in_check(board, i, color, game)) return valid_tiles;

    // left castle
    let clear_left = true;

    if(board[i_1D(i[0], 0)] != starting_board[i_1D(i[0], 0)]) clear_left = false;
    
    for (let col_between = i[1]-2; col_between < i[1]; col_between++) {
        if(board[i_1D(i[0], col_between)] != "e" || tile_in_check(board, [i[0], col_between], color, game) == true) clear_left = false;
    }

    if(clear_left) valid_tiles.push([i[0], i[1] - 2]);

    // right castle
    let clear_right = true;

    if(board[i_1D(i[0], 7)] != starting_board[i_1D(i[0], 7)]) clear_right = false;
    
    for (let col_between = i[1]+2; col_between > i[1]; col_between--) {
        if(board[i_1D(i[0], col_between)] != "e" || tile_in_check(board, [i[0], col_between], color, game) == true) clear_right = false;
    }

    if(clear_right) valid_tiles.push([i[0], i[1] + 2]);

    return valid_tiles;
};

const MOVE_DATA = { p: pawn_move, r: rook_move, kn: knight_move, b: bishop_move, q: queen_move, k: king_move, km: king_move, rm: rook_move };