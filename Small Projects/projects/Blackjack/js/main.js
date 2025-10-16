var canvas;
var canvasContext;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    setUp();

    setInterval(update, 1000/60);
});

function setUp(){
    for (let i = 0; i < cards.length; i++) {
        shoe.push(new Card(cards[i].card, cards[i].sx, cards[i].sy, CANVAS_WIDTH-CARD_WIDTH-150-i, 100+i, 4*Math.PI/6));
        shoe[shoe.length-1].face_down = true;
    }

    players.push(new Player(CANVAS_WIDTH-75-CARD_WIDTH-15, CANVAS_HEIGHT-400, -Math.PI/2, 0));
    players.push(new Player(CANVAS_WIDTH-CANVAS_WIDTH/5-Math.cos(-Math.PI/4)*CARD_HEIGHT, CANVAS_HEIGHT-170+Math.sin(-Math.PI/4)*CARD_HEIGHT, -Math.PI/4, 1));
    players.push(new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT-120-CARD_HEIGHT, 0, 2));
    players.push(new Player(CANVAS_WIDTH/5-Math.cos(-3*Math.PI/4)*CARD_HEIGHT, CANVAS_HEIGHT-170+Math.sin(-3*Math.PI/4)*CARD_HEIGHT, Math.PI/4, 3));
    players.push(new Player(75+CARD_WIDTH+15, CANVAS_HEIGHT-400, Math.PI/2, 4));

    dealer = new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT/2-80, 0, 5);

    init_menu_items();

    shuffle();
}

function update(){
    draw();
    prevMouseDown = mouseDown;
    canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);

    if(error_timer != -1 && Date.now() >= error_timer){
        error_timer = -1;
    }
}