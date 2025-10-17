function getSubShapes(graph){
    if(graph.prevEquation != graph.equation || graph.prevN != n || graph.prevArea != graph.area){
      graph.prevEquation = graph.equation;
      graph.prevN = n;
      graph.prevArea = graph.area;
      graph.outputQueue = parse(graph.equation, n);
    }else{
      return;
    }

    graph.subShapes = [];
    graph.subShapes.push(graph.shape);


    if(graph.shape.type == "rect"){
      
      for (var i = 1; i < n+1; i++) {
        let areaOfShapeAtN = graph.func(i);
        let shapes = getSubShapesRect(areaOfShapeAtN, graph.subShapes, graph);

        if(shapes == 1){
          graph.full = true;
          break;
        }
        graph.full = false;

        for (var j = 0; j < shapes.length; j++) {
          graph.subShapes.push(shapes[0]);
        }
        
      }
    }
}


//getting the subshape is going to tell us if we are over the limit 
//area or give us a shape that is going to fit inside the graph of shapes laid previosly
function getSubShapesRect(area, subShapes, graph){
  let shape = subShapes[0];
  let outcome = [];

  if(subShapes.length == 1){
    outcome = getShapeFromEmptyRects(area, subShapes, graph);
    return outcome;
  }

  let shapesToAnalyse = deepCopy(subShapes);

  for (var i = 1; i < subShapes.length; i++) {
    
    let scanArea;
    let shapesInScanArea;
    let linesToAnalyseX = [];
    let linesToAnalyseY = [];

    //S /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    scanArea = new Rectangle(subShapes[i].x1, subShapes[i].y2, subShapes[i].x2, subShapes[i].y2+graph.area);
    shapesInScanArea = getSquaresInSquare(subShapes[i], shapesToAnalyse, scanArea, 1);

    linesToAnalyseY = [];

    for (var j = 0; j < shapesInScanArea.length; j++) {
      //south line
      linesToAnalyseY.push(
      new LineSegment(scanArea.x1, shapesInScanArea[j].y2,scanArea.x2, shapesInScanArea[j].y2));

        if(j != 0){
          //north line
          linesToAnalyseY.push(
            new LineSegment(scanArea.x1,shapesInScanArea[j].y1, scanArea.x2,shapesInScanArea[j].y1));
        }
    }

    linesToAnalyseY.sort(function(a, b){return a.y1 - b.y1});
    scanArea.y2 = linesToAnalyseY[0].y1;

    if(scanArea.y2 != subShapes[i].y2){
      outcome.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
      shapesToAnalyse.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
    }

    // //E /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    scanArea = new Rectangle(subShapes[i].x2, subShapes[i].y1, subShapes[i].x2+graph.area, subShapes[i].y2);
    shapesInScanArea = getSquaresInSquare(subShapes[i], shapesToAnalyse, scanArea, 0);

    linesToAnalyseX = [];

    for (var j = 0; j < shapesInScanArea.length; j++) {
        //east line
          linesToAnalyseX.push(
          new LineSegment(shapesInScanArea[j].x2, scanArea.y1,shapesInScanArea[j].x2, scanArea.y2));

        if(j != 0){
          //west line
          linesToAnalyseX.push(
            new LineSegment(shapesInScanArea[j].x1,scanArea.y1, shapesInScanArea[j].x1,scanArea.y2));
        }
    }   

    linesToAnalyseX.sort(function(a, b){return a.x1 - b.x1});
    scanArea.x2 = linesToAnalyseX[0].x1;

    if(scanArea.x2 != subShapes[i].x2){
      outcome.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
      shapesToAnalyse.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
    }


    // // N /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    scanArea = new Rectangle(subShapes[i].x1, subShapes[i].y1-graph.area, subShapes[i].x2, subShapes[i].y1);
    shapesInScanArea = getSquaresInSquare(subShapes[i], shapesToAnalyse, scanArea, 1);


    linesToAnalyseY = [];

    for (var j = 0; j < shapesInScanArea.length; j++) {
      //north line
      linesToAnalyseY.push(
        new LineSegment(scanArea.x1,shapesInScanArea[j].y1, scanArea.x2,shapesInScanArea[j].y1));

        if(j != 0){
          //south line
           linesToAnalyseY.push(
           new LineSegment(scanArea.x1, shapesInScanArea[j].y2,scanArea.x2, shapesInScanArea[j].y2));
        }
    }

    linesToAnalyseY.sort(function(a, b){return b.y1 - a.y1});
    scanArea.y1 = linesToAnalyseY[0].y1;

    if(scanArea.y1 != subShapes[i].y1){
      outcome.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
      shapesToAnalyse.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
    }

    //  //W /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    scanArea = new Rectangle(subShapes[i].x1-graph.area, subShapes[i].y1, subShapes[i].x1, subShapes[i].y2);
    shapesInScanArea = getSquaresInSquare(subShapes[i], shapesToAnalyse, scanArea, 0);

    linesToAnalyseX = [];

    for (var j = 0; j < shapesInScanArea.length; j++) {
        //west line
          linesToAnalyseX.push(
            new LineSegment(shapesInScanArea[j].x1,scanArea.y1, shapesInScanArea[j].x1,scanArea.y2));

        if(j != 0){
          //east line
          linesToAnalyseX.push(
          new LineSegment(shapesInScanArea[j].x2, scanArea.y1,shapesInScanArea[j].x2, scanArea.y2));
        }
    }   


    linesToAnalyseX.sort(function(a, b){return b.x1 - a.x1});
    scanArea.x1 = linesToAnalyseX[0].x1;

    if(scanArea.x1 != subShapes[i].x1){
      outcome.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
      shapesToAnalyse.push(new Rectangle(scanArea.x1, scanArea.y1, scanArea.x2, scanArea.y2))
    }
  }

  outcome = getShapeFromEmptyRects(area, outcome, graph);

  return outcome;
}


function getShapeFromEmptyRects(area, empySubShapes, graph){
  //go through shapes and fill them until the 

  let areaOfShapes = 0;

  for (var i = 0; i < empySubShapes.length; i++) {
    areaOfShapes += empySubShapes[i].a;
  }


  if(area > areaOfShapes){
    // console.log("FULL")
    return 1;
  }

  let runningArea = area;
  let shapes = [];


  for (var i = 0; i < empySubShapes.length; i++) {

    if(empySubShapes[i].a < runningArea){
      shapes.push(empySubShapes[i]);
      runningArea -= empySubShapes[i].a;
      continue;
    }

    if(graph.subShapes.length % 4 == 2){
      shapes.push(new Rectangle(empySubShapes[i].x2-(runningArea/empySubShapes[i].h), empySubShapes[i].y1, empySubShapes[i].x2, empySubShapes[i].y2, graph.secondaryColor));
    }else if(graph.subShapes.length % 4 == 3){
      shapes.push(new Rectangle(empySubShapes[i].x1, empySubShapes[i].y2-(runningArea/empySubShapes[i].w), empySubShapes[i].x2, empySubShapes[i].y2, graph.secondaryColor));
    }else if(graph.subShapes.length % 4 == 0){
      shapes.push(new Rectangle(empySubShapes[i].x1, empySubShapes[i].y1, empySubShapes[i].x1+(runningArea/empySubShapes[i].h), empySubShapes[i].y2, graph.secondaryColor));
    }else{
      shapes.push(new Rectangle(empySubShapes[i].x1, empySubShapes[i].y1, empySubShapes[i].x2, empySubShapes[i].y1+(runningArea/empySubShapes[i].w), graph.secondaryColor));
    }

    break;
  }

  return shapes;

}


function getSquaresInSquare(square, squares, scanArea, type){
  let intersectingSquares = [];

  for (var j = 0; j < squares.length; j++) {
    if(square.id == squares[j].id){
      continue; 
    }

    if(scanArea.intersectionRect(squares[j], type)){
      intersectingSquares.push(squares[j]);
    }
  }

  return intersectingSquares;
}


// or (var j = 0; j < shapesInScanArea.length; j++) {
    //     //west line
    //     linesToAnalyseX.push(
    //       new LineSegment(shapesInScanArea[j].x,scanArea.y, shapesInScanArea[j].x,scanArea.y+scanArea.h));

    //     if(j != 0){
    //       //east line
    //       linesToAnalyseX.push(
    //       new LineSegment(shapesInScanArea[j].x+shapesInScanArea[j].w, scanArea.y,
    //                       shapesInScanArea[j].x+shapesInScanArea[j].w, scanArea.y+scanArea.h));
    //     }
    // }   

    // linesToAnalyseX.sort(function(a, b){return b.x1 - a.x1});
    // scanArea.x = linesToAnalyseX[0].x1;
    // scanArea.w = scanArea.x - subShapes[i].x;
    // shapesInScanArea = getSquaresInSquareY(subShapes[i], shapesToAnalyse, scanArea);

    // if(scanArea.w == 0){
    //   shapesInScanArea = [];
    // }

