// graphics
var canvas;
var canvasContext;

var BACK_OF_CARD = document.createElement("img");
BACK_OF_CARD.src = "./imgs/back.png";

var SHIELD = document.createElement("img");
SHIELD.src = "./imgs/shield.png";

var KNIFE = document.createElement("img");
KNIFE.src = "./imgs/knife.png";


var BUTTON_START = document.createElement("img");
BUTTON_START.src = "./imgs/button_start.png";

var BUTTON_END = document.createElement("img");
BUTTON_END.src = "./imgs/button_end.png";

var BUTTON_MIDDLE = document.createElement("img");
BUTTON_MIDDLE.src = "./imgs/button_middle.png";

var SCROLL = document.createElement("img");
SCROLL.src = "./imgs/scroll.png";

var BASE_DECK = {
    "c1": document.createElement("img"), "c6": document.createElement("img"), "c7": document.createElement("img"), "c8": document.createElement("img"), "c9": document.createElement("img"), "c10": document.createElement("img"), "c11": document.createElement("img"), "c12": document.createElement("img"), "c13": document.createElement("img"), 
    "d1": document.createElement("img"), "d6": document.createElement("img"), "d7": document.createElement("img"), "d8": document.createElement("img"), "d9": document.createElement("img"), "d10": document.createElement("img"), "d11": document.createElement("img"), "d12": document.createElement("img"), "d13": document.createElement("img"),
    "h1": document.createElement("img"), "h6": document.createElement("img"), "h7": document.createElement("img"), "h8": document.createElement("img"), "h9": document.createElement("img"), "h10": document.createElement("img"), "h11": document.createElement("img"), "h12": document.createElement("img"), "h13": document.createElement("img"),
    "s1": document.createElement("img"), "s6": document.createElement("img"), "s7": document.createElement("img"), "s8": document.createElement("img"), "s9": document.createElement("img"), "s10": document.createElement("img"), "s11": document.createElement("img"), "s12": document.createElement("img"), "s13": document.createElement("img")
};

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000

const BACKGROUND_COLS = 25;
const BACKGROUND_ROWS = 25;

const BACKGROUND_COLS_WIDTH = CANVAS_WIDTH / BACKGROUND_COLS;
const BACKGROUND_ROWS_HEIGHT = CANVAS_HEIGHT / BACKGROUND_ROWS;

const CARD_PIC_WIDTH = 27;
const CARD_PIC_HEIGHT = 38;

const CARD_WIDTH = 120;
const CARD_HEIGHT = CARD_PIC_HEIGHT * CARD_WIDTH / CARD_PIC_WIDTH;

const LITTLE_CARD_WIDTH = 50;
const LITTLE_CARD_HEIGHT = CARD_PIC_HEIGHT * LITTLE_CARD_WIDTH / CARD_PIC_WIDTH;

const TRUMPH_CARD_HEIGHT = CARD_WIDTH;
const TRUMPH_CARD_WIDTH = CARD_PIC_WIDTH * TRUMPH_CARD_HEIGHT / CARD_PIC_HEIGHT;

const PLAYER_CARD_POS = [
    [CANVAS_WIDTH/2, CANVAS_HEIGHT - CARD_HEIGHT/2 - 20],
    [LITTLE_CARD_HEIGHT/2 + 20, CANVAS_HEIGHT/2],
    [CANVAS_WIDTH/2, LITTLE_CARD_HEIGHT/2 + 20],
    [CANVAS_WIDTH - LITTLE_CARD_HEIGHT/2 - 20, CANVAS_HEIGHT/2]
];

const PLAYER_SHIELD_POS = [
    [7*CANVAS_WIDTH/8, CANVAS_HEIGHT - CARD_HEIGHT/2 - 20, 0],
    [LITTLE_CARD_HEIGHT + 70, CANVAS_HEIGHT/2, Math.PI/2],
    [CANVAS_WIDTH/2, LITTLE_CARD_HEIGHT + 70, Math.PI],
    [CANVAS_WIDTH - LITTLE_CARD_HEIGHT - 70, CANVAS_HEIGHT/2, 3*Math.PI/2]
];

const ATTACKS_X = [
    [CANVAS_WIDTH/2],
    [CANVAS_WIDTH/2 - CARD_WIDTH, CANVAS_WIDTH/2 + CARD_WIDTH],
    [CANVAS_WIDTH/2 - 2*CARD_WIDTH, CANVAS_WIDTH/2, CANVAS_WIDTH/2 + 2*CARD_WIDTH],
    [CANVAS_WIDTH/2 - 2*CARD_WIDTH, CANVAS_WIDTH/2, CANVAS_WIDTH/2 + 2*CARD_WIDTH, CANVAS_WIDTH/2],
    [CANVAS_WIDTH/2 - 2*CARD_WIDTH, CANVAS_WIDTH/2, CANVAS_WIDTH/2 + 2*CARD_WIDTH, CANVAS_WIDTH/2 - CARD_WIDTH, CANVAS_WIDTH/2 + CARD_WIDTH],
    [CANVAS_WIDTH/2 - 2*CARD_WIDTH, CANVAS_WIDTH/2, CANVAS_WIDTH/2 + 2*CARD_WIDTH, CANVAS_WIDTH/2 - 2*CARD_WIDTH, CANVAS_WIDTH/2, CANVAS_WIDTH/2 + 2*CARD_WIDTH]
];

var language = 0; // 0 for russian, 1 for english

const DURAK = ["Дурак", "Durak"];
const BITA = ["Бита", "Pass"];
const SURRENDER = ["Сдаться", "Surrender"];
const NEW_GAME = ["Играть снова", "Play Again"];
const GAME_OVER = ["Игра закончена", "Game Over"];
const MENU = ["Меню", "Menu"];
const PLAY = ["Играть в игру", "Play Game"];
const ENGLISH_RUSSIAN = ["English", "Русский"];
const RESUME = ["Продолжить", "Resume"];
const RULES = ["Правила", "Rules"];


var playerHandCardGap = 3*CARD_WIDTH/4;

var pausableTimeouts = [];

var scene;
var game_scene;
var menu_scene;
var rules_scene;

//game
const CARD_RANKS = ["6", "7", "8", "9", "10", "11", "12", "13", "1"];
const SUIT_RANKINGS = ["d", "s", "h", "c"];

var game;

// brain
var brains = [];

// input
var inputAllowed = false;
var hover_index;
var prev_hover_index;

// audio
const CARD1 = new Audio('./audio/card1.wav');
CARD1.volume = 0.5;

const CARD2 = new Audio('./audio/card2.wav');
CARD2.volume = 0.1;

const CARD3 = new Audio('./audio/card3.wav');
CARD3.volume = 0.1;

const CARD4 = new Audio('./audio/card4.wav');
CARD4.volume = 0.05;

const DEAL = new Audio('./audio/deal.wav');
DEAL.volume = 0.1;

const GAMEOVER = new Audio('./audio/gameOver.wav');
GAMEOVER.volume = 0.5;

const HURT1 = new Audio('./audio/hurt1.wav');
HURT1.volume = 0.1;

const HURT2 = new Audio('./audio/hurt2.wav');
HURT2.volume = 0.05;

const LANGUAGE = new Audio('./audio/language.wav');
LANGUAGE.volume = 0.1;

const LAUGH = new Audio('./audio/laugh.wav');
LAUGH.volume = 0.05;

const SLIDE = new Audio('./audio/slide.wav');
SLIDE.volume = 0.3;

const DEFENDED = new Audio('./audio/defended.wav');
DEFENDED.volume = 0.05;

// rules
const SCROLL_BAR_DIM = [CANVAS_WIDTH-112.5, 200, 25, CANVAS_HEIGHT-300];

var scroll_bar_y = SCROLL_BAR_DIM[1];
var scroll_bar_held = false;

const PARAGRAPH_1 = [
    "In Durak, the player with the lowest trump card goes first as the game.attacker, though they do not have to use that card. The player to their left is always the game.defender. Play moves clockwise around the table after each round. If the attack works, the game.defender loses their turn and the next player to the left becomes the new game.defender. If the attack fails, the game.defender turns into the game.attacker for the next round.",
    "В игре Дурак игрок с наименьшим козырем ходит первым в качестве атакующего, хотя он не обязан использовать эту карту. Игрок слева от него всегда является защищающимся. Игра продолжается по часовой стрелке вокруг стола после каждого раунда. Если атака срабатывает,защищающийся теряет ход, и следующий игрок слева становится новым защищающимся.Если атака не срабатывает, защищающийся становится защищающимся в следующем раунде."
];

const PARAGRAPH_2 = [
    "Cards rank from six as the lowest up to ace as the highest. Trump cards beat any card from the other suits regardless of rank. The game.attacker begins by placing one card face up, and the defendermust try to beat it. They can do this by using a higher card of the same suit or any trump card. Cards are placed so that both the attack and defense cards are visible.",
    "Карты рангом от шестерки (наименьшая) до туза (старшая). Козыри бьют любую карту другой масти независимо от её достоинства. Атакующий начинает игру, кладя одну карту лицом вверх, а защищающийсядолжен попытаться её побить. Для этого он может использовать более высокую карту той же масти или любойкозырь. Карты размещаются таким образом, чтобы были видны как карты атаки, так и карты защиты."
];

const PARAGRAPH_3 = [
    "If the game.defender succeeds, the game.attacker or other players may continue attacking with new cards that match the rank of cards already played. The original game.attacker always gets the first chance, then it continues clockwise. No more than six attacks can happen in one round. Each new attack must be defended in the same way, with a higher card of the same suit or a trump card. If the game.defender cannot or will not beat the attack, they must pick up all the cards on the table, and the round ends.",
    "Если защищающийся успешно ходит, атакующий или другие игроки могут продолжить атаку новыми картами, соответствующими по рангу уже сыгранным картам.   Первоначальный атакующий всегда ходит первым, затем ход продолжается по часовой стрелке. За один раунд может быть проведено не более шести атак.Каждая новая атака должна быть отражена тем же способом, старшей картой той же масти или козырем.Если защищающийся не может или не хочет отбивать атаку, он должен забрать все карты со стола, и раунд заканчивается."
];

const PARAGRAPH_4 = [
    "When the game.defender picks up the cards, the other players can also toss in cards of the same rank asthose already played, up to the six card limit. The game.defender must then take these as well. If the game.defender successfully beats every attack or stops further attacks after the sixth card, they win theround. In that case, all the cards used are placed into the discard pile, and the game.defender becomesthe next game.attacker. No one is allowed to look through the discard pile at any time.",
    "Когда защищающийся забирает карты, другие игроки могут подбросить карты того же ранга, что и уже сыгранные, до лимита в шесть карт. Защищающийся должен забрать и их. Если защищающийся успешно отбиваетвсе атаки или останавливает дальнейшие атаки после шестой карты, он выигрывает раунд. В этом случае всеиспользованные карты отправляются в сброс, и защищающийся становится следующим атакующим. Никто не может просматривать сброс в любое время."
];


const PARAGRAPH_5 = [
    "At the end of each round, all players draw cards until they have six in their hands, unless the deck has run out. The main game.attacker draws first, then the other attackers in clockwise order, and the defenderlast. Once the deck is empty, players who run out of cards are out of the ",
    "В конце каждого раунда все игроки берут карты, пока у них не окажется шесть карт на руках, если только колода не закончилась. Первым берет карты основной атакующий, затем остальные атакующие по часовой стрелке,и последним защищающийся. Когда колода опустеет, игроки, у которых закончатся карты, выбывают из игры."
];


const PARAGRAPH_6 = [
    "The game continues until only one person has cards left. That person is the loser, or the “fool” (durak).In some versions, the fool becomes the dealer for the next game, and the player to their right starts as game.attacker. In other versions, the first person to get rid of all their cards is called the winner, while the last person with cards is still the fool.",
    "Игра продолжается до тех пор, пока карты не останутся только у одного игрока. Этот игрок считается проигравшим,или «дураком». В некоторых версиях игры дурак становится раздающим в следующей игре, а игрок справа от него начинает игру в качестве атакующего. В других версиях первый, кто избавится от всех своих карт, считается победителем, а последний, у кого остались карты, остаётся дураком."
];

const PARAGRAPHS = [PARAGRAPH_1, PARAGRAPH_2, PARAGRAPH_3, PARAGRAPH_4, PARAGRAPH_5, PARAGRAPH_6];