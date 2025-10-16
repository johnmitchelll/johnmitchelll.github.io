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
    board = new Board();

    for (let i = 0; i < 14; i++) {
        board.data[i] = [];

        if(i == 6 || i == 13) continue;

        for (let j = 0; j < 4; j++) {
            board.data[i].push(new Stone(i));
        }
    }

    brain = new Brain(1);

    init_menu_items();
}

function update(){
    draw();
    prevMouseDown = mouseDown;
    canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
}

let exam_percentage = (39+31)/(40+40);
let edfinity_quizez_percentage = (9.6+22.4+20.8+15+12.37+13+8.8+9.6+14+8.4+22.5+9+8.88+6+20+20+7+7+5.75+9+3.94+11.5+10+4.8)/
                                 (8+19+18+15+14+13+9+8+16+7+21+12+9+10+20+21+7+11+6+12+6+18+12+4);

let matlab_percentage = (20+40+28+40+34+40+40)/(20+40+40+40+40+40+40);

console.log(exam_percentage, edfinity_quizez_percentage, matlab_percentage)
console.log(exam_percentage*0.45 + edfinity_quizez_percentage*0.125 + matlab_percentage*0.125 + 1*0.3);