
// graphics
const CANVAS_WIDTH = 1300;
const CANVAS_HEIGHT = 1000;

const BOARD_DIM = [CANVAS_WIDTH/2-(2*CANVAS_HEIGHT/3)/2, CANVAS_HEIGHT/6, 2*CANVAS_HEIGHT/3, 2*CANVAS_HEIGHT/3];
const INDIVIDUAL_DIM = [BOARD_DIM[2]/8, BOARD_DIM[3]/8]; // width and height of the small black and white tiles

var pieces_img_data = []; // for drawing purposes of their image data
var left_img = document.createElement("img");
var up_img = document.createElement("img");
var down_img = document.createElement("img");
var right_img = document.createElement("img");

left_img.src = "./content/left.png";
up_img.src = "./content/up.png";
down_img.src = "./content/down.png";
right_img.src = "./content/right.png";

const PIECES_DATA = { bp: 0, br: 1, bkn: 2, bb: 3, bq: 4, bk: 5, bkm: 5, brm: 1, wp: 6, wr: 7, wkn: 8, wb: 9, wq: 10, wk: 11, wkm: 11, wrm: 7 };

const PAWN_UPGRADE_DIM = [INDIVIDUAL_DIM[0]/2*4+50, (23 * INDIVIDUAL_DIM[0]/2 / 10) + 5];
const WHITE_UPGRADE_DATA = [7, 8, 9, 10];
const BLACK_UPGRADE_DATA = [1, 2, 3, 4];
const PAWN_UPGRADE_TYPES = ["r", "kn", "b", "q"];

const GAME_OVER_DIM = [BOARD_DIM[0]+INDIVIDUAL_DIM[0]*2, BOARD_DIM[1]+INDIVIDUAL_DIM[1]*3, INDIVIDUAL_DIM[0]*4, INDIVIDUAL_DIM[0]*2];

var tile_selected = [-1, -1];

var movable_tiles = [];

var piece_in_hand = [-1, -1];

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

const PIECE_CAPTURE_DISPLAY_ORDER = ["p", "kn", "b", "r", "q"];

const WHITE_TILE_COLOR = "rgb(239, 238, 238)";
const BLACK_TILE_COLOR = "rgb(22, 22, 22)";

// audio
var capture_sound_fx = new Audio('./content/capture.mp3');
var move_sound_fx = new Audio('./content/move.mp3');

// game
var rematch_button;
var buttons = [];

const HERO_WHITE_STARTING_BOARD = "br/bkn/bb/bq/bk/bb/bkn/br/bp/bp/bp/bp/bp/bp/bp/bp/s/32/wp/wp/wp/wp/wp/wp/wp/wp/wr/wkn/wb/wq/wk/wb/wkn/wr";
const HERO_BLACK_STARTING_BOARD = "wr/wkn/wb/wk/wq/wb/wkn/wr/wp/wp/wp/wp/wp/wp/wp/wp/s/32/bp/bp/bp/bp/bp/bp/bp/bp/br/bkn/bb/bk/bq/bb/bkn/br";

var game_ref;
var game_history;

var pawn_move;
var rook_move;
var knight_move;
var bishop_move;
var queen_move;
var king_move;

var pieces_captured = [[], []];

var players_scores = [0, 0];

// brain
var brain;
var cpu_turn_to_think = false;

const PIECE_SCORE = { p: 100, r: 500, kn: 300, b: 300, q: 900, k: 0, rm: 500, km: 0 };

const PAWN_TABLE = [
    0,0,0,0,0,0,0,0,
    50,50,50,50,50,50,50,50,
    10,10,20,30,30,20,10,10,
    5,5,10,25,25,10,5,5,
    0,0,0,20,20,0,0,0,
    5,-5,-10,0,0,-10,-5,5,
    5,10,10,-20,-20,10,10,5,
    0,0,0,0,0,0,0,0
];

const ROOK_TABLE = [
    0,0,0,0,0,0,0,0,
    5,10,10,10,10,10,10,5,
    -5,0,0,0,0,0,0,-5,
    -5,0,0,0,0,0,0,-5,
    -5,0,0,0,0,0,0,-5,
    -5,0,0,0,0,0,0,-5,
    -5,0,0,0,0,0,0,-5,
    0,0,0,-5,-5,0,0,0,
];

const KNIGHT_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,0,0,0,0,-20,-40,
    -30,0,10,15,15,10,0,-30,
    -30,5,15,20,20,15,5,-30,
    -30,0,15,20,20,15,0,-30,
    -30,5,10,15,15,10,5,-30,
    -40,-20,0,5,5,0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,0,0,0,0,0,0,-10,
    -10,0,5,10,10,5,0,-10,
    -10,5,5,10,10,5,5,-10,
    -10,0,10,10,10,10,0,-10,
    -10,10,10,10,10,10,10,-10,
    -10,5,0,0,0,0,5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
];

const QUEEN_TABLE = [
    -20,-10,-10,-5,-5,-10,-10,-20,
    -10,0,0,0,0,0,0,-10,
    -10,0,5,5,5,5,0,-10,
    -5,0,5,5,5,5,0,-5,
    -5,0,5,5,5,5,0,-5,
    -10,0,5,5,5,5,0,-10,
    -10,0,0,0,0,0,0,-10,
    -20,-10,-10,-5,-5,-10,-10,-20,
];

const KING_TABLE = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    20,20,0,0,0,0,20,20,
    20,30,10,0,0,10,30,20,
];

const PIECE_EVAL_TABLE = { p: PAWN_TABLE, r: ROOK_TABLE, kn: KNIGHT_TABLE, b: BISHOP_TABLE, q: QUEEN_TABLE, k: KING_TABLE, km: KING_TABLE, rm: ROOK_TABLE};