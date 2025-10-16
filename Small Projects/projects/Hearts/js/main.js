var canvas;
var canvasContext;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    setUp();

    setInterval(() => {
        draw();
        canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, 1000/60);
});

function setUp(){
    points = [0,0,0,0];
    scores = [0,0,0,0];

    players = [[],[],[],[]];
    playedCards = [];

    handPassType = 0;
    preDealPass = true;
    
    document.getElementById("pass").style.display = "inline";
    document.getElementById("num_cards").style.display = "inline";
    scoresButton.style.display = "inline";

    playerPassCards = [];
    collectCards = [];
    collector;

    heartsBroken = false;
    turn = 0;

    scorePage = false;
    gameOver = false;

    deal();
    orderHands();

    brains = [];
    brains.push(new Brain(1));
    brains.push(new Brain(2));
    brains.push(new Brain(3));

    playAgainButton.style.display = "none";
}