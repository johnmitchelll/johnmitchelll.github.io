var canvas;
var canvasContext;

// not in reality but this scaled version
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    setInterval(() => {
        draw();
        canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, 1000/60);
});

function setUp(){
    usablePieces = [[PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0, [0,0]], 
                        [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0, [0,0]], 
                        [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0, [0,0]]];
    
    for (let i = 0; i < usablePieces.length; i++) {
        usablePieces[i][0] = flipPiecesToOrientation(usablePieces[i][0], usablePieces[i][2]);
    }

    brickGrid = [];
    for (let i = 0; i < ROW_COL_NUM; i++) {
        brickGrid[i] = new Array(ROW_COL_NUM);
    }

    for (let i = 0; i < brickGrid.length; i++) {
        for (let j = 0; j < brickGrid[i].length; j++) {
            brickGrid[i][j] = -1;
        }
    }

    score = 0;
    gameOver = false;
    handleStop();
}