var openList = [];
var closedList = [];
var path = [];
var current;
var apple;
var doneWithAStar = false;

function scanAStar(){
  aStarCalcs++;
  
if(current.index == apple.index){
    doneWithAStar = true;
    console.log("A* Calculations:"+aStarCalcs);
    return;
  }else if(current.index != apple.index && openList.length == 0){
    doneWithAStar = true;
    console.log("NO SOLUTION");
    return;
  }  

  var lowestOpenFNode = 0;

    for(var i = 0;i < openList.length; i++){
      if(openList[i].f < openList[lowestOpenFNode].f){
        lowestOpenFNode = i;
      }
    }

    current = openList[lowestOpenFNode];

    removeFromArray(openList, current);
    closedList.push(current);

    var neighbors;
    neighbors = current.neighbors

    for(var i = 0;i < neighbors.length; i++){
      var neighbor = neighbors[i];
      var tempG = current.g + 1;
      
      if(closedList.includes(neighbor) == false && neighbor.wall == false){

        var newPath = false;
        if(openList.includes(neighbor)){
          if(tempG < neighbor.g){
            neighbor.g = tempG;
            newPath = true;
          }
      }else{
        neighbor.g = tempG;
        openList.push(neighbor);
        newPath = true;
        }

        if(newPath){
          neighbor.h = heuristic(neighbor, apple);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
        }
        

      }
    }

      path = []
      var temp = current;
      path.push(temp)
        while(temp.parent){
          path.push(temp)
          temp = temp.parent
        }
}

function heuristic(a, b){
  var dist  = Math.sqrt( (a.i - b.i)*(a.i - b.i) +  (a.j - b.j)*(a.j - b.j))
  //var dist  = Math.abs((a.i - b.i)) + Math.abs(a.j - b.j);

  return dist;

}

function getRandomInt(max){
  return Math.floor(Math.random() * max)

}