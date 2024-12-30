var notIncluded = [];
var shortestPathSet = [];
var doneWithDijkstra = false;
var dijkstrasCalcs = 0;

function scanDijkstras(){
  dijkstrasCalcs++;
  var neighbors = current.neighbors;

  for (var i = 0; i < neighbors.length; i++) {
    var neighborsCenter = [neighbors[i].i * BRICK_W + BRICK_W/2,
                neighbors[i].j * BRICK_H + BRICK_H/2]
    var currentCenter = [current.i * BRICK_W + BRICK_W/2,
                current.j * BRICK_H + BRICK_H/2]

    var distFromCenterToCenter = Math.floor(current.value + getDistance(neighborsCenter[0],neighborsCenter[1], currentCenter[0],currentCenter[1]));

    if(distFromCenterToCenter < neighbors[i].value && neighbors[i].wall == false){
      neighbors[i].value = distFromCenterToCenter;
      neighbors[i].parent = current;
    }

  }

  var lowest = notIncluded[0];
  for (var i = 0; i < notIncluded.length; i++) {
    if(lowest.value > notIncluded[i].value){
      lowest = notIncluded[i];
    }
  }

  if(current == apple){
     doneWithDijkstra = true;
    console.log("Dijkstra's Calculations:" +dijkstrasCalcs)
    return;
  }else if(lowest.value == Infinity){
    console.log("NO SOLUTION");
    return;
  }
  
  current = lowest;
  removeFromArray(notIncluded,current);
  shortestPathSet.push(current)

      path = []
      var temp = current;
      path.push(temp)
        while(temp.parent){
          path.push(temp)
          temp = temp.parent
        }

}

function getDistance(x1,y1, x2,y2){
  var D = Math.sqrt( (x2 - x1)*(x2 - x1) + (y2-y1)*(y2-y1))

    return D;
}