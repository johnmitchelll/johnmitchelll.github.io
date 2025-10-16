
// graphics
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;

var cards_pic = document.createElement("img");
cards_pic.src = "./content/cards.png";

var chips_pic = document.createElement("img");
chips_pic.src = "./content/chips.png";
var chips_pic_2 = document.createElement("img");
chips_pic_2.src = "./content/chips2.png";

const CARD_PIC_WIDTH = 73;
const CARD_PIC_HEIGHT = 105;
const CARD_WIDTH = 500/8;
const CARD_HEIGHT = 500/5;

const CHIP_PIC_REF = [chips_pic, chips_pic_2, chips_pic, chips_pic, chips_pic_2];
const CHIP_SOURCE_X_REF = [60, 60, 0, 30, 0];

const PLAYER_CIRCLE_POS = [
    [CANVAS_WIDTH-50, CANVAS_HEIGHT-400], [CANVAS_WIDTH-CANVAS_WIDTH/5, CANVAS_HEIGHT-170], 
    [CANVAS_WIDTH/2, CANVAS_HEIGHT-120], [CANVAS_WIDTH/5, CANVAS_HEIGHT-170], [50, CANVAS_HEIGHT-400]
];

const RANDOM_CHIP_VALUES = [
    Math.floor(Math.random()*120), Math.floor(Math.random()*120), Math.floor(Math.random()*120),
    Math.floor(Math.random()*120), Math.floor(Math.random()*120)
];

// 0: main, 1: stats, 2: controls
var current_screen = 0;

var cards = [
    {"card":"As","sx":7,"sy":7},{"card":"Ah","sx":7,"sy":115},{"card":"Ac","sx":7,"sy":222},{"card":"Ad","sx":7,"sy":329},
    {"card":"2s","sx":84,"sy":7},{"card":"2h","sx":84,"sy":115},{"card":"2c","sx":84,"sy":222},{"card":"2d","sx":84,"sy":329},
    {"card":"3s","sx":160,"sy":7},{"card":"3h","sx":160,"sy":115},{"card":"3c","sx":160,"sy":222},{"card":"3d","sx":160,"sy":329},
    {"card":"4s","sx":236,"sy":7},{"card":"4h","sx":236,"sy":115},{"card":"4c","sx":236,"sy":222},{"card":"4d","sx":236,"sy":329},
    {"card":"5s","sx":313,"sy":7},{"card":"5h","sx":313,"sy":115},{"card":"5c","sx":313,"sy":222},{"card":"5d","sx":313,"sy":329},
    {"card":"6s","sx":389,"sy":7},{"card":"6h","sx":389,"sy":115},{"card":"6c","sx":389,"sy":222},{"card":"6d","sx":389,"sy":329},
    {"card":"7s","sx":465,"sy":7},{"card":"7h","sx":465,"sy":115},{"card":"7c","sx":465,"sy":222},{"card":"7d","sx":465,"sy":329},
    {"card":"8s","sx":542,"sy":7},{"card":"8h","sx":542,"sy":115},{"card":"8c","sx":542,"sy":222},{"card":"8d","sx":542,"sy":329},
    {"card":"9s","sx":618,"sy":7},{"card":"9h","sx":618,"sy":115},{"card":"9c","sx":618,"sy":222},{"card":"9d","sx":618,"sy":329},
    {"card":"10s","sx":694,"sy":7},{"card":"10h","sx":694,"sy":115},{"card":"10c","sx":694,"sy":222},{"card":"10d","sx":694,"sy":329},
    {"card":"Js","sx":771,"sy":7},{"card":"Jh","sx":771,"sy":115},{"card":"Jc","sx":771,"sy":222},{"card":"Jd","sx":771,"sy":329},
    {"card":"Qs","sx":847,"sy":7},{"card":"Qh","sx":847,"sy":115},{"card":"Qc","sx":847,"sy":222},{"card":"Qd","sx":847,"sy":329},
    {"card":"Ks","sx":923,"sy":7},{"card":"Kh","sx":923,"sy":115},{"card":"Kc","sx":923,"sy":222},{"card":"Kd","sx":923,"sy":329}
];

// game
var shoe = [];
var tray = [];

var players = [];

var dealer;

const BET_SIZES = [1, 5, 25, 100, 500];
const CARD_VALUE = {"K": 10, "Q": 10, "J": 10, "10": 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2};

const ERROR_CODE = ["LOW BALANCE", "PLACE BET", "MAX SPLITS"];
var error_timer = -1;
var error = 0;
const ERROR_MESSAGE_TIME_LENGTH = 750;

// 0: bet, 1: dealing out cards, 2: play, 3: after played
var game_state = 0;
var turn = 2;

var deal_button;
var hit_button;
var stand_button;
var double_button;
var split_button;
var stats_button;
var back_button;
var buttons = [];

var hand_history = [0];