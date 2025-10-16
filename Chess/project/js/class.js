function Piece(color, type, img_src, sx, sy, w, h){
    this.color = color; // 0 black, 1 white
    this.type = type; // 0 pawn, 1 rook, 2 knight, 3 bishop, 4 queen, 5 king

    this.img_src = document.createElement("img");
    this.img_src.src = img_src;

    this.sx = sx;
    this.sy = sy;
    this.w = w;
    this.h = h;

    this.dw = INDIVIDUAL_DIM[0]/2;
    this.dh = this.h * this.dw / this.w;

    this.draw = function(x, y){
        drawImageFromSpriteSheetWithRotation(this.img_src, this.sx, this.sy, this.w, this.h, x, y, this.dw, this.dh, 0, false);
    }
}

function Board(data){
    this.data = [];

    if(!data) return;
    let pieces = data.split("/");
    let skip_total = 0;
    let pieces_index = 0;

    for (let i = 0; i < 8; i++) {
        this.data[i] = new Array(8).fill("e");

        for (let j = 0; j < 8; j++) {
            if(pieces[pieces_index] == 's'){ 
                skip_total = parseInt(pieces[pieces_index+1]);
                pieces_index += 2;
            }

            if(skip_total > 0){
                skip_total--;
                continue;
            }
            
            this.data[i][j] = pieces[pieces_index];
            pieces_index++;
        }
    }
}

function Game(){
    this.board;
    this.white_side;
    this.black_side;
    this.turn = 1;
    this.pawn_upgrade = [-1, -1];
    this.king_in_check = -1;
    this.game_over = -1; // -1 game not over, 0 black win, 1 white_win, 2 draw

    if(Math.random() > 0.5){
        this.board = extend_compressed_board_string(HERO_WHITE_STARTING_BOARD);
        this.white_side = 7;
        this.black_side = 0;
    }else{
        this.board = extend_compressed_board_string(HERO_BLACK_STARTING_BOARD);;
        this.white_side = 0;
        this.black_side = 7;
    }
}

function Button(x, y, text, visible, callback){
    this.x = x;
    this.y = y;
    this.text = text;
    this.visible = visible;
    this.clickable = true;

    let dimensions = measureText(this.text, 19, "pixel_font");
    this.w = dimensions.width;
    this.h = dimensions.height;

    this.callback = callback;

    this.display = function(){
        if(!this.visible) return;

        colorRect(this.x - this.w/2 - 10, this.y - this.h/2 - 10, this.w+20, this.h+20, "white");
        colorNoFillRect(this.x - this.w/2 - 10, this.y - this.h/2 - 10, this.w+20, this.h+20, "black");

        drawText("black", "32px pixel_font", this.text, this.x-this.w/2+5, this.y+5);

        if(this.clickable == false) colorRect(this.x - this.w/2 - 10, this.y - this.h/2 - 10, this.w+20, this.h+20, "rgb(0,0,0,0.5)");
    }
}