function nodeClass(col,row){
    this.i = col;
    this.j = row;
    this.index = col + BRICK_COLS * row;
    this.wall = false;
    this.door = false;
    this.tooSmall = false;
    this.parent = undefined;
    this.value = 1000000;
    this.g = 0;
    this.h = 0;
    this.f = 0;

    this.showNode = function(color){
                canvasContext.fillStyle = color;
                canvasContext.fillRect(this.i * BRICK_W +1 ,this.j * BRICK_H +1,
                                        BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP);
    }

    this.neighbors = [];
    this.addNeighbors = function(grid){
    var i = this.i;
    var j = this.j;
        if(i < BRICK_COLS-1 && grid[i+1][j].wall == false){
            this.neighbors.push(grid[i+1][j])
        }
        if(i > 0 && grid[i-1][j].wall == false){
            this.neighbors.push(grid[i-1][j]);
        }
        if(j < BRICK_ROWS - 1 && grid[i][j+1].wall == false){
            this.neighbors.push(grid[i][j+1]);
        }
        if(j > 0 && grid[i][j-1].wall == false){
            this.neighbors.push(grid[i][j-1]);
        }

        if(i < BRICK_COLS-1 && j < BRICK_ROWS - 1 && grid[i+1][j+1].wall == false){
            this.neighbors.push(grid[i+1][j+1]);
        }
        if(i < BRICK_COLS-1 && j > 0 && grid[i+1][j-1].wall == false){
            this.neighbors.push(grid[i+1][j-1]);
        }
        if(j > 0 && i > 0 && grid[i-1][j-1].wall == false){
            this.neighbors.push(grid[i-1][j-1]);
        }
        if(i > 0 && j < BRICK_ROWS - 1 && grid[i-1][j+1].wall == false){
            this.neighbors.push(grid[i-1][j+1]);
        }

    }
}