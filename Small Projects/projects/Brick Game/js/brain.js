let brain = new Board(brickGrid, -Infinity, usablePieces);
let count = 0;
let debug = false;

function Board(grid, score, usablePieces){
    this.grid = grid;
    this.score = score;
    this.usablePieces = usablePieces;
    this.move = [0, 0, 0];

    this.findBestMove = function(depth){

        // base case of the recursion is when there is no more to place
        if(depth > 2) return;

        // if the board state is a loose then return score
        if(checkForGameOver(this.grid, this.usablePieces)){
            this.score = -10000;
            this.move[depth] = "GAME OVER";
            return;
        }

        let touched = false;

        // loop through each of the possible places that each of the pieces can be placed recursivly, take the highest score
        for (let u = 0; u < this.usablePieces.length; u++) {
            let piece = this.usablePieces[u][0];
            if(!piece) continue;

            for (let i = 0; i <= this.grid.length - piece.length; i++) {
                for (let j = 0; j <= this.grid[i].length - piece[0].length; j++) {
                    if(isPieceIndexValid(j, i, piece[0].length, piece.length, piece, this.grid) == false){
                        continue;
                    }

                    let ij = [j, i];
                        
                    let possibleGrid = this.assignGridtoGrid();
                    let possibleUsablePieces = this.assignUsablePieces();
                    possibleUsablePieces[u] = "";

                    inputPiece(possibleGrid, piece, 1, ij);
                    
                    let clearedRowCols = clearRowCols(possibleGrid, false);

                    let possibleBoard
                    if(depth == 2){
                        possibleBoard = new Board(possibleGrid, determineGridScore(possibleGrid) + clearedRowCols, possibleUsablePieces);
                    }else{
                        possibleBoard = new Board(possibleGrid, -Infinity, possibleUsablePieces);
                    }
                        
                    possibleBoard.findBestMove(depth+1);

                    if(possibleBoard.score >= this.score){
                        this.move = deepCopy(possibleBoard.move);
                        this.move[depth] = new Move(possibleGrid, piece, 1, ij, u);
                        this.score = possibleBoard.score;
                    }
                }
            }
        }
    }

    this.assignGridtoGrid = function(){
        let possibleGrid = []

        for (let gi = 0; gi < this.grid.length; gi++) {
            possibleGrid[gi] = [];
            for (let i = 0; i < this.grid[gi].length; i++) {
                possibleGrid[gi][i] = this.grid[gi][i];
            }
        }

        return possibleGrid;
    }

    // grab usablePieces from this board and give it to the next board
    this.assignUsablePieces = function(){
        let possibleUsablePieces = [];
        for (let ui = 0; ui < this.usablePieces.length; ui++) {
            
            if(this.usablePieces[ui] == ""){
                possibleUsablePieces[ui] = "";
                continue;
            }

            possibleUsablePieces[ui] = [];
            for (let uj = 0; uj < this.usablePieces[ui].length; uj++) {
                if(Array.isArray(this.usablePieces[ui][uj])){
                    possibleUsablePieces[ui][uj] = deepCopy(this.usablePieces[ui][uj]);
                }else{
                    possibleUsablePieces[ui][uj] = this.usablePieces[ui][uj];
                }
            }
        }

        return possibleUsablePieces;
    }
}

function Move(grid, piece, pieceColor, ij, usableIndex){
    this.grid = grid;
    this.piece = piece;
    this.pieceColor = pieceColor;
    this.ij = ij
    this.usableIndex = usableIndex;
}

// look through grid pieces and add up all the empty spaces around its edges
function determineGridScore(grid){
    let score = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] != -1){
                if(i == 0 || grid[i-1][j] != -1) score += 1;
                if(i == ROW_COL_NUM-1 || grid[i+1][j] != -1) score += 1;
                if(j == 0 || grid[i][j-1] != -1) score += 1;
                if(j == ROW_COL_NUM-1 || grid[i][j+1] != -1) score += 1;
            }

            if(grid[i][j] == -1){
                if(i != 0 && grid[i-1][j] == -1) score += 4;
                if(i != ROW_COL_NUM-1 && grid[i+1][j] == -1) score += 4;
                if(j != 0 && grid[i][j-1] == -1) score += 4;
                if(j != ROW_COL_NUM-1 && grid[i][j+1] == -1) score += 4;
            }
        }
    }

    return score;
}

async function playHand(){
    brain = new Board(brickGrid, -Infinity, usablePieces);
    brain.findBestMove(0);

    // console.log("BEST MOVE",  brain.move, brain.score);

    for (let i = 0; i < 3; i++) {
        if(brain.move[i] == "GAME OVER" && areTherePiecesLeft()){
            gameOver = true;
            return;
        }
        if(!brainActivated) return;
        if(brain.move[i] == "GAME OVER") break;

        inputPiece(brickGrid, brain.move[i].piece, usablePieces[brain.move[i].usableIndex][1], [brain.move[i].ij[0], brain.move[i].ij[1]]);
        usablePieces[brain.move[i].usableIndex] = "";
        score++;
        await new Promise(res => setTimeout(res, 300));
        clearRowCols(brickGrid, true);
        await new Promise(res => setTimeout(res, Math.min(1000 / brainSpeed * 5, 3000)));
    }

    usablePieces = [[PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0], 
    [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0], 
    [PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)], Math.floor(Math.random() * BRICK_COLORS.length), Math.floor(Math.random()*4), 0]];

    for (let i = 0; i < usablePieces.length; i++) {
        usablePieces[i][0] = flipPiecesToOrientation(usablePieces[i][0], usablePieces[i][2]);
    }

    gameOver = checkForGameOver(brickGrid, usablePieces);
    if(!gameOver) setTimeout(playHand, 250);
}