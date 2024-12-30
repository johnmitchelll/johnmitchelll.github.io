var minimumCellSize = 3;
var doorsList = [];
var mazecalculations = 0;
var aStarCalcs = 0;
var total; 
var doneWithMaze = false;

function scanMaze(){
  mazecalculations++
  cavern = getCavern();
    if(cavern.length > 0 && cavern != "doneWithMaze"){

      var cavern = getCavern()
      var width = cavern.end["i"] - cavern.start["i"];
      var height = cavern.end["j"] - cavern.start["j"];
      var x = cavern.start["i"];
      var y = cavern.start["j"];
      var orientation = getOrientation(width,height);
      
      var randomX = setRandomCol(x,y,width,height,orientation);
      var randomY = setRandomRow(x,y,width,height,orientation);

    
      if(orientation == 1 && randomX != undefined){
        for(var row = 0; row < height+1; row++){
            brickGrid[randomX][row + y].wall = true;
            brickGrid[randomX][randomY].door = true;
            } 
          doorsList.push(brickGrid[randomX][randomY])
       }
       
      if(orientation == 0 && randomY != undefined){
        for(var col = 0; col < width+1; col++){
                  brickGrid[col + x][randomY].wall = true;
                  brickGrid[randomX][randomY].door = true;
            } 
          doorsList.push(brickGrid[randomX][randomY])
      }
}

}


function getOrientation(width, height){
      if(width < height){
            return 0
      }else if(width > height){
            return 1
      }else{
            if(Math.random() > 0.5){
                  return 0
            }else{
                  return 1
            }
      }
}

function getValidCols(x,y,w,h,dir){
  var validList = [];
  var topIsTop = false;
  var bottomIsBottom = false;

  if(y == 0){
    topIsTop = true;
  }
  if(y+h == BRICK_ROWS-1){
    bottomIsBottom = true;
  }

  if(dir == 1){
    for(i=x+1;i<x+w;i++){
      

      if(topIsTop == false && bottomIsBottom == false){
        if(brickGrid[i][y+h+1].door == false && brickGrid[i][y-1].door == false){
          validList.push(i)
        }
      }
      if(topIsTop == true && bottomIsBottom == false){
        if(brickGrid[i][y+h+1].door == false){
          validList.push(i)
        }
      }
      if(topIsTop == false && bottomIsBottom == true){
        if(brickGrid[i][y-1].door == false){
          validList.push(i)
        }
      }
      if(topIsTop == true && bottomIsBottom == true){
        validList.push(i)
      }
    }
    return validList;
  }else{
    for(i=x+1;i<x+w;i++){
      validList.push(i)
    }
    return validList;
  }

  
  
}

function setRandomCol(x,y,w,h,dir){
  var validList = getValidCols(x,y,w,h,dir)
  var randomX = validList[Math.floor(Math.random() * validList.length)]

  var invalid = false;

  if(randomX == undefined){
    invalid = true;
  }
    if(invalid){
        for (var i = x; i < w + x + 1; i++) {
          for (var j = y; j < h + y + 1; j++) {
          brickGrid[i][j].tooSmall = true;
        }
      }
    }

  return randomX;

}



function getValidRows(x,y,w,h,dir){
  var validList = [];
  var leftIsLeft = false;
  var rightIsRight = false;

  if(x == 0){
    leftIsLeft = true;
  }
  if(x+w == BRICK_COLS-1){
    rightIsRight = true;
  }

  if(dir == 0){
    for(i=y+1;i<y+h;i++){
      
      if(leftIsLeft == false && rightIsRight == false){
        if(brickGrid[x+w+1][i].door == false && brickGrid[x-1][i].door == false){
          validList.push(i)
        }
      }
      if(leftIsLeft == true && rightIsRight == false){
        if(brickGrid[x+w+1][i].door == false){
          validList.push(i)
        }
      }
      if(leftIsLeft == false && rightIsRight == true){
        if(brickGrid[x-1][i].door == false){
          validList.push(i)
        }
      }
      if(leftIsLeft == true && rightIsRight == true){
        validList.push(i)
      }
    }
    return validList;
  }else{
    for(i=y+1;i<y+h;i++){
      validList.push(i)
    }
    return validList;
  }
  


}

function setRandomRow(x,y,w,h,dir){
  var validList = getValidRows(x,y,w,h,dir)
  var randomY = validList[Math.floor(Math.random() * validList.length)]

  var invalid = false;

  if(randomY == undefined){
    invalid = true;
  }
    if(invalid){
        for (var i = x; i < w + x + 1; i++) {
          for (var j = y; j < h + y + 1; j++) {
          brickGrid[i][j].tooSmall = true;
        }
      }
    }

  return randomY;

}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getCavern(){
     var j = 0;
     var cavern = [];
     var looking = true;

  for(j = 0; j < BRICK_ROWS; j++){
      for(i = 0; i < BRICK_COLS; i++){
            if(brickGrid[i][j].wall == false && i != BRICK_COLS - 1 
              && brickGrid[i][j].tooSmall == false){
              if(brickGrid[i][j].wall == false){
                    cavern.push(brickGrid[i][j])
                    cavern.start = cavern[0];

                  }
            }else if(brickGrid[i][j].wall && cavern.length >= minimumCellSize 
                    && brickGrid[i-1][j].wall == false){
                  cavern.maxW = brickGrid[i-1][j].i
                  cavern.width = cavern.maxW - cavern.start.i;

                  
                  cavern = getCavernGrid(cavern.start.i,cavern.start.j,cavern.width);

                  for (var i = 0; i < cavern.length; i++) {
                      if(brickGrid[cavern[i].i][cavern[i].j].tooSmall == true){
                        cavern = [];

                      }
                  }
                    return cavern;
            }else if(i == BRICK_COLS - 1 && cavern.length >= minimumCellSize-1){
                  cavern.maxW = brickGrid[i][j].i
                  cavern.width = cavern.maxW - cavern.start.i;

                  cavern = getCavernGrid(cavern.start.i,cavern.start.j,cavern.width);

                  for (var i = 0; i < cavern.length; i++) {
                      if(brickGrid[cavern[i].i][cavern[i].j].tooSmall == true){
                        cavern = [];

                      }
                  }
                    return cavern;
            }else{

              if(i == BRICK_COLS - 1 && j == BRICK_ROWS -1){
                doneWithMaze = true;
                for (var i = 0; i < doorsList.length; i++) {
                  doorsList[i].wall = false;
                }
                console.log("Maze Calculations:"+mazecalculations)
                return "doneWithMaze";
              }
              cavern = [];
            }
      }
    }
}

function getCavernGrid(startX,startY,w){ 
      var cavern = [];
      for(j = startY; j < BRICK_ROWS; j++){
      for(var i = startX; i < w + startX + 1; i++){
        if(brickGrid[i][j].wall == false){
          cavern.push(brickGrid[i][j]);
        }else if(brickGrid[i][j].wall){
          cavern.start = cavern[0];
          cavern.end = cavern[cavern.length-1];
          if(j - cavern.start["j"] < minimumCellSize){
            for (var i = 0; i < cavern.length; i++) {
               brickGrid[cavern[i].i][cavern[i].j].tooSmall = true;
            }
            cavern = [];

          }
          return cavern;
          }
        }
      }     
          cavern.start = cavern[0];
          cavern.end = cavern[cavern.length-1];
          if(j - cavern.start["j"] < minimumCellSize){
            for (var i = 0; i < cavern.length; i++) {
               brickGrid[cavern[i].i][cavern[i].j].tooSmall = true;
            }
            cavern = [];

          }
          return cavern;
}