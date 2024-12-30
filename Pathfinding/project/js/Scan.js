var readyForMaze = false;
var readyForAStar = false;
var readyForDijkstra = false;
var mazeInProgress = false;
var pathfindingAInProgress = false;
var pathfindingDInProgress = false;

function scanForAll(){
  if(doneWithMaze == false && readyForMaze == true){
    scanMaze();
    mazeInProgress = true;
  }else{
    mazeInProgress = false;
    
  }
  if(doneWithAStar == false && readyForAStar == true){
    scanAStar();
    pathfindingAInProgress = true;
  }else{
    pathfindingAInProgress = false;
  }

  if(doneWithDijkstra == false && readyForDijkstra == true){
    scanDijkstras()
    pathfindingDInProgress = true;
  }else{
    pathfindingDInProgress = false;
  }
  
}

function initMaze(){
  if(doneWithMaze == false && pathfindingDInProgress == false && pathfindingAInProgress == false){
    setUp();
    readyForMaze = true;
  }
}

function initAStar(){
  if(doneWithAStar == false && mazeInProgress == false && pathfindingDInProgress == false){
    readyForAStar = true;
    if(doneWithDijkstra){
      DijkstrasSetUp();
    }
  }
}

function initDijkstra(){
  if(doneWithDijkstra == false && pathfindingAInProgress == false && mazeInProgress == false){
    readyForDijkstra = true;
    if(doneWithAStar){
      AStarSetUp();
    }
  }
}


function changeBlockType(){
  blockType++;
  if(blockType > 3){
    blockType = 1;
  }

  if(blockType == 1){
   document.getElementById("block").innerHTML = "Wall";
  }
  if(blockType == 2){
   document.getElementById("block").innerHTML = "Start";
  }
  if(blockType == 3){
   document.getElementById("block").innerHTML = "Goal";
  }
}

var blockType = 1;

var mouseCol;
var mouseRow;
var mouseX;
var mouseY;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
  mouseCol = Math.floor(mouseX/BRICK_W);
  mouseRow = Math.floor(mouseY/BRICK_H);

  if(mouseDown && pathfindingAInProgress == false && mazeInProgress == false && pathfindingDInProgress == false){

    if(mouseCol > BRICK_COLS-1 || mouseCol < 0 ||
        mouseRow > BRICK_ROWS-1 || mouseRow < 0){
    }else{
        if(brickGrid[mouseCol][mouseRow] != apple && 
            brickGrid[mouseCol][mouseRow] != start && 
            blockType != 2 && blockType != 3){
            placeCorrectTile(mouseCol,mouseRow);
        }
    }
    
  }
}

var startingNode;
var endingNode;

function placeCorrectTile(col,row){
  if(blockType == 1){
    brickGrid[col][row].wall = true;
  }
  if(blockType == 2){
     startingNode = brickGrid[col][row];
  }
  if(blockType == 3){
    endingNode = brickGrid[col][row];
  }

}

var mouseDown = false;

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', function(){
    mouseDown = true;
      if(mouseDown && pathfindingAInProgress == false && mazeInProgress == false && pathfindingDInProgress == false){

    if(mouseCol > BRICK_COLS-1 || mouseCol < 0 ||
        mouseRow > BRICK_ROWS-1 || mouseRow < 0){
    }else{
        if(brickGrid[mouseCol][mouseRow] != apple && 
            brickGrid[mouseCol][mouseRow] != start){
            placeCorrectTile(mouseCol,mouseRow);
          if(blockType == 2 || blockType == 3){
            AStarSetUp();
            DijkstrasSetUp();
            path = [];
          }
        }
    }
    
  }
});
document.addEventListener('mouseup', function(){mouseDown = false;});


