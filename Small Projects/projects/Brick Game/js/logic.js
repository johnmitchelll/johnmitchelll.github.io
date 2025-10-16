const PIECE_TYPES = [
    [[1,1,1],[1,1,1],[1,1,1]],
    [[1,1,1],[0,0,1]],
    [[0,1,1],[1,1,0]],
    [[1,1,1],[0,0,1],[0,0,1]],
    [[1,1,1],[0,1,0]],
    [[1,1,1],[1,1,1]],
    [[1,1], [0,1]],
    [[1,1,1,1,1]],
    [[1,1], [1,1]],
    [[1,1,1]],
    [[1,1,1,1]],
    [[1]]
];

const BRICK_COLORS = ["red", "green", "blue", "yellow", "orange", "purple"];

var usablePieces = [[PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0, [0,0]], 
                    [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0, [0,0]], 
                    [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0, [0,0]]];

let inGrid = false;

for (let i = 0; i < usablePieces.length; i++) {
    usablePieces[i][0] = flipPiecesToOrientation(usablePieces[i][0], usablePieces[i][2]);
}

function flipPiecesToOrientation(piece, orientation){
    if(orientation == 0) return piece;

    let newPiece = deepCopy(piece);

    for (let i = 0; i < orientation; i++) {
        newPiece = rotate90(newPiece);
    }

    return newPiece;
}


function rotate90(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const rotatedMatrix = Array.from({ length: cols }, () => Array(rows).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            rotatedMatrix[j][rows - i - 1] = matrix[i][j];
        }
    }

    return rotatedMatrix;
}


function assignToGrid(){
    if(!inGrid) return;

    let pickedPiece;
    let pickedPieceColor;
    let pieceIndex = 0;
    for (let i = 0; i < usablePieces.length; i++) {
        if(usablePieces[i][3] == 1){
            pickedPiece = usablePieces[i][0];
            pickedPieceColor = usablePieces[i][1];
            pieceIndex = i;
            break;
        }
    }

    // grab index of shape top left corner
    let ij = [Math.floor((mouseX - GRID_MARGIN) / BRICK_WIDTH_HEIGHT),
              Math.floor((mouseY - GRID_MARGIN/4) / BRICK_WIDTH_HEIGHT)];

    ij[0] -= Math.floor(pickedPiece[0].length/2);
    ij[1] -= Math.floor(pickedPiece.length/2);

    if(isPieceIndexValid(ij[0], ij[1], pickedPiece[0].length, pickedPiece.length, pickedPiece, brickGrid) == false){
        return;
    }

    inputPiece(brickGrid, pickedPiece, pickedPieceColor, [ij[0], ij[1]]);

    score++;

    clearRowCols(brickGrid, true);

    usablePieces[pieceIndex] = "";

    for (let i = 0; i < usablePieces.length; i++) {
        if(usablePieces[i] != ""){
            gameOver = checkForGameOver(brickGrid, usablePieces);
            return;
        }
    }

    usablePieces = [[PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0], 
                    [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0], 
                    [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0]];

    for (let i = 0; i < usablePieces.length; i++) {
        usablePieces[i][0] = flipPiecesToOrientation(usablePieces[i][0], usablePieces[i][2]);
    }

    gameOver = checkForGameOver(brickGrid, usablePieces);
}

function isPieceIndexValid(x, y, w, h, piece, grid){
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            // console.log(brickGrid[y + i][x + j], y + i, x + j)
            // if(!grid[y + i] || !grid[y + i][x + j]) console.log(grid[y + i], grid[y + i][x + j])
            if(grid[y + i][x + j] != -1 && piece[i][j] == 1) return false;
        }
    }

    return true;
}

function clearRowCols(grid, live){
    let clearedRowsandCols = 0;
    let colsToClear = new Array(ROW_COL_NUM);
    let rowsToClear = new Array(ROW_COL_NUM);
    
    for (let i = 0; i < grid.length; i++) {
        let clearRow = true;
        let clearCol = true;
        for (let j = 0; j < grid[i].length; j++) { 
            if(grid[j][i] == -1){
                clearCol = false;
            }

            if(grid[i][j] == -1){
                clearRow = false;
            }
        }

        if(clearCol) colsToClear[i] = 1;
        if(clearRow) rowsToClear[i] = 1;
    }

    // doing this in two passes because we need to record what to clear before we clear it. 
    // or there will be a case where we clear a row then check the col later and it has alr been cleared

    for (let i = 0; i < ROW_COL_NUM; i++) {
        if(rowsToClear[i] == 1){
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j] = -1;
            }
            if(live){
                score += 5;
            }else{
                clearedRowsandCols++;
            } 
        }

        if(colsToClear[i] == 1){
            for (let j = 0; j < grid[i].length; j++) {
                grid[j][i] = -1;
            }
            if(live){
                score += 5;
            }else{
                clearedRowsandCols++;
            }
        }
    }

    return clearedRowsandCols;
}

function checkForGameOver(grid, usablePiecesPointer){
    for (let u = 0; u < usablePiecesPointer.length; u++) {
        let piece = usablePiecesPointer[u][0];
        if(!piece) continue;

        for (let i = 0; i <= grid.length - piece.length; i++) {
            for (let j = 0; j <= grid[i].length - piece[0].length; j++) {
                if(isPieceIndexValid(j, i, piece[0].length, piece.length, piece, grid) == true){
                    return false;
                }
            }
        }
    }

    return true;
}

function inputPiece(grid, piece, pieceColor, ij){
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if(piece[i][j] == 0) continue;
            grid[ij[1] + i][ij[0] + j] = pieceColor;
        }
    }
}

function areTherePiecesLeft(){
    for (let i = 0; i < usablePieces.length; i++) {
        if(usablePieces[i] != ''){
            return true;
        }
    }

    return false;
}