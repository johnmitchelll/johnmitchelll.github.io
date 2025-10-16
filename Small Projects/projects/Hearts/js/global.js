const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

var deckOrder = ["Ah", "Kh", "Qh", "Jh", "10h", "9h", "8h", "7h", "6h", "5h", "4h", "3h", "2h",
                 "As", "Ks", "Qs", "Js", "10s", "9s", "8s", "7s", "6s", "5s", "4s", "3s", "2s",
                 "Ad", "Kd", "Qd", "Jd", "10d", "9d", "8d", "7d", "6d", "5d", "4d", "3d", "2d",
                 "Ac", "Kc", "Qc", "Jc", "10c", "9c", "8c", "7c", "6c", "5c", "4c", "3c", "2c"];

const SUIT_ORDER = {'h': 0, 's': 1, 'd': 2, 'c': 3};
var points = [0,0,0,0];
var scores = [0,0,0,0];

var players = [[],[],[],[]];
var playedCards = [];

// left, right, across, hold: 0, 1, 2, 3
var handPassType = 0;
var preDealPass = true;
var playerPassCards = [];
var collectCards = [];
var collector;

var heartsBroken = false;
var turn = 0;
var suitLed;
var startingPlayer;

var highCard;

const PASS_DIR_ORDER = [[1, 3, 2], [2, 0, 3], [3, 1, 0], [0, 2, 1]];
const CARD_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

var cardsPic = document.createElement("img");
cardsPic.src = "./cards.png";

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