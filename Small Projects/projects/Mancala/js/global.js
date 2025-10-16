
// graphics
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 500;

const BOARD_HOLE_PADDING = 25;
const BOARD_DIM = [CANVAS_WIDTH/16, CANVAS_HEIGHT/3-BOARD_HOLE_PADDING*1.5, 7*CANVAS_WIDTH/8, CANVAS_HEIGHT/3+BOARD_HOLE_PADDING*3];
const BOARD_HOLE_R = (BOARD_DIM[2]/8-BOARD_HOLE_PADDING*2)/2;

// game
var reset_button;
var buttons = [];

var board;

var middle_of_turn = false;

var scores = [0, 0];

var show_helping_arrows = Date.now();

var brain;