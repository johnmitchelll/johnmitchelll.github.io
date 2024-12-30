const BRICK_GAP = 1;
var BRICK_W;
var BRICK_H;
const BRICK_COLS = 50;
const BRICK_ROWS = 50;
var brickGrid = new Array(BRICK_COLS)

function drawEverything(){
    colorRect(0,0,canvas.width,canvas.height,'black');

    for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){

            
            if(brickGrid[i][j].wall == true){
              brickGrid[i][j].showNode('black');
            }else if(brickGrid[i][j].wall == false){
              brickGrid[i][j].showNode('white');
            }
            if(brickGrid[i][j].door){
              brickGrid[i][j].showNode('white');
            }
          }
        }

    
    for(i=0;i<shortestPathSet.length;i++){
        shortestPathSet[i].showNode("#73109E")
    }
    

    for(i=0;i<openList.length;i++){
        openList[i].showNode("#A500EA")
    }

    for(i=0;i<closedList.length;i++){
        closedList[i].showNode("#73109E")
    }

//#A3EB00
//#EBA617
    for(var i = 0; i < path.length; i++){
        path[i].showNode("#A3EB00")
    }
    if(startingNode){
        startingNode.showNode("#A3EB00")
    }else{
        brickGrid[0][0].showNode("#A3EB00")
    }

    current.showNode('blue')
    apple.showNode('#EBA617')


    apple.wall = false;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}


function drawText(color, words, X, Y){
    canvasContext.fillStyle = color;
    canvasContext.fillText(words, X, Y);
  }

function removeFromArray(array,index){
    for(i = array.length - 1; i >= 0; i--){
        if(array[i] == index){
            array.splice(i, 1);
        }
    }
}