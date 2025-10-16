const ROW_COL_NUM = 8;
const GRID_WIDTH_HEIGHT = 300;
const GRID_MARGIN = 150;
const BRICK_WIDTH_HEIGHT = GRID_WIDTH_HEIGHT / ROW_COL_NUM;
var score = 0;
var gameOver = false;

var brickGrid = [];
for (let i = 0; i < ROW_COL_NUM; i++) {
    brickGrid[i] = new Array(ROW_COL_NUM);
}

for (let i = 0; i < brickGrid.length; i++) {
    for (let j = 0; j < brickGrid[i].length; j++) {
        brickGrid[i][j] = -1;
    }
}

function draw(){
    colorRect(0,0, canvas.width, canvas.height, "#0067d6");
    drawGrid();
    drawUsablePieces();

    let textDimentions = measureText(score, "65px", "pixel_font");
    drawText("white", "45px pixel_font", score, CANVAS_WIDTH/2 - textDimentions.width + 3, 31.5);

    if(gameOver){
        colorRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT, "rgb(18,18,18,0.5)");

        textDimentions = measureText("GAME OVER", "75px", "pixel_font");
        drawText("white", "75px pixel_font", "GAME OVER", CANVAS_WIDTH/2 - textDimentions.width - 35, CANVAS_HEIGHT/2 - textDimentions.height + 3);

        textDimentions = measureText(score, "45px", "pixel_font");
        drawText("white", "45px pixel_font", "CLICK TO TRY AGAIN", CANVAS_WIDTH/2 - textDimentions.width - 120, CANVAS_HEIGHT/2 + textDimentions.height);
    }
}

function drawGrid(){
    // draw brick colors
    for (let i = 0; i < brickGrid.length; i++) {
        for (let j = 0; j < brickGrid[i].length; j++) {
            if(brickGrid[i][j] != -1){
                colorRect(GRID_MARGIN + j * BRICK_WIDTH_HEIGHT, GRID_MARGIN/4 + i * BRICK_WIDTH_HEIGHT, BRICK_WIDTH_HEIGHT, BRICK_WIDTH_HEIGHT, BRICK_COLORS[brickGrid[i][j]]);
                continue;
            }

            colorRect(GRID_MARGIN + j * BRICK_WIDTH_HEIGHT, GRID_MARGIN/4 + i * BRICK_WIDTH_HEIGHT, BRICK_WIDTH_HEIGHT, BRICK_WIDTH_HEIGHT, "#002d5d");
        }
    }

    // cols then row lines
    for (let i = 0; i <= ROW_COL_NUM; i++) {
        drawLine(GRID_MARGIN + i * BRICK_WIDTH_HEIGHT, GRID_MARGIN/4, GRID_MARGIN + i * BRICK_WIDTH_HEIGHT, GRID_MARGIN/4 + GRID_WIDTH_HEIGHT, 1, "black");
    }

    for (let i = 0; i <= ROW_COL_NUM; i++) {
        drawLine(GRID_MARGIN, GRID_MARGIN/4 + i * BRICK_WIDTH_HEIGHT, GRID_MARGIN + GRID_WIDTH_HEIGHT, GRID_MARGIN/4 + i * BRICK_WIDTH_HEIGHT, 1, "black");
    }
}

function drawUsablePieces(){
    inGrid = false;

    for (let i = 0; i < usablePieces.length; i++) {
        if(usablePieces[i] == "") continue;
        drawPiece(CANVAS_WIDTH/6 + CANVAS_WIDTH/3 * i, CANVAS_HEIGHT - GRID_MARGIN, usablePieces[i], i);
    }
}

function drawPiece(x, y, piece, i){
    let shapeMatrix = piece[0];
    let height = shapeMatrix.length;
    let width = shapeMatrix[0].length;

    handlePieceClick(x - (width/2 * BRICK_WIDTH_HEIGHT), y - (height/2 * BRICK_WIDTH_HEIGHT), width * BRICK_WIDTH_HEIGHT, height * BRICK_WIDTH_HEIGHT, i);

    if(piece[3] == 1){
        x = mouseX;
        y = mouseY;
    }

    // snap piece to grid
    if(piece[3] == 1 && mouseX - width/2 * BRICK_WIDTH_HEIGHT > GRID_MARGIN && 
       mouseX + width/2 * BRICK_WIDTH_HEIGHT - BRICK_WIDTH_HEIGHT/2 < GRID_MARGIN + GRID_WIDTH_HEIGHT && 
       mouseY - height/2 * BRICK_WIDTH_HEIGHT > GRID_MARGIN/4 && 
       mouseY + height/2 * BRICK_WIDTH_HEIGHT - BRICK_WIDTH_HEIGHT/2 < GRID_MARGIN/4 + GRID_WIDTH_HEIGHT
    ){
        x = GRID_MARGIN + Math.floor((x - GRID_MARGIN) / BRICK_WIDTH_HEIGHT) * BRICK_WIDTH_HEIGHT;
        y = GRID_MARGIN/4 + Math.floor((y - GRID_MARGIN/4) / BRICK_WIDTH_HEIGHT) * BRICK_WIDTH_HEIGHT;

        if(width % 2 != 0) x += BRICK_WIDTH_HEIGHT/2;
        if(height % 2 != 0) y += BRICK_WIDTH_HEIGHT/2;

        inGrid = true;

        let ij = [Math.floor((mouseX - GRID_MARGIN) / BRICK_WIDTH_HEIGHT),
            Math.floor((mouseY - GRID_MARGIN/4) / BRICK_WIDTH_HEIGHT)];

        ij[0] -= Math.floor(shapeMatrix[0].length/2);
        ij[1] -= Math.floor(shapeMatrix.length/2);

        if(isPieceIndexValid(ij[0], ij[1], shapeMatrix[0].length, shapeMatrix.length, shapeMatrix, brickGrid) == false){
            x = mouseX;
            y = mouseY;
        }
    }

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if(shapeMatrix[i][j] == 0) continue;
            colorRect(x + j * BRICK_WIDTH_HEIGHT - (width/2 * BRICK_WIDTH_HEIGHT), y + i * BRICK_WIDTH_HEIGHT - (height/2 * BRICK_WIDTH_HEIGHT), BRICK_WIDTH_HEIGHT, BRICK_WIDTH_HEIGHT, BRICK_COLORS[piece[1]]);
            colorNoFillRect(x + j * BRICK_WIDTH_HEIGHT - (width/2 * BRICK_WIDTH_HEIGHT), y + i * BRICK_WIDTH_HEIGHT - (height/2 * BRICK_WIDTH_HEIGHT), BRICK_WIDTH_HEIGHT, BRICK_WIDTH_HEIGHT, "black");
        }
    }
}