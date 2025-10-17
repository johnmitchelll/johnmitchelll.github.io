function Vec(x, y){
    this.x = x;
    this.y = y;
}

function decideToDrawTwoPoints(leftI, rightI, graph, leftRealY, rightRealY){
    if(graph.domain[rightI].y >= 0 && graph.domain[leftI].y >= 0 || graph.domain[rightI].y < 0 && graph.domain[leftI].y < 0){
        return true;
    }

    let outPutAfterLeft = graph.func(graph.domain[leftI].x + 0.00001);
    let outPutBeforeRight = graph.func(graph.domain[rightI].x - 0.00001);

    let midpoint = (graph.domain[rightI].x + graph.domain[leftI].x) / 2
    let xOfMidpointInRealSpace = (midpoint / zoom) * canvas.width + offX * canvas.width/zoom;
    
    if(graph.domain[leftI].y > 0){
        if(outPutAfterLeft < graph.domain[leftI].y && outPutBeforeRight > graph.domain[rightI].y){
            return true;
        }else if(funcPassesGraphCases(graph, leftI, rightI, 3)){
            drawLine(xOfMidpointInRealSpace,leftRealY,xOfMidpointInRealSpace,canvas.height/2,4,graph.color);
            drawLine(xOfMidpointInRealSpace,rightRealY,xOfMidpointInRealSpace,-canvas.height/2,4,graph.color);
        }
    }

    if(graph.domain[leftI].y < 0){
        if(outPutAfterLeft > graph.domain[leftI].y && outPutBeforeRight < graph.domain[rightI].y){
            return true;
        }else if(funcPassesGraphCases(graph, leftI, rightI, 3)){
            drawLine(xOfMidpointInRealSpace,leftRealY,xOfMidpointInRealSpace,-canvas.height/2,4,graph.color);
            drawLine(xOfMidpointInRealSpace,rightRealY,xOfMidpointInRealSpace,canvas.height/2,4,graph.color);
        }
    }
}

function funcPassesGraphCases(graph, leftI, rightI, accuracy){
    let beforeLeftLimit = [];
    let afterLeftLimit = [];

    let beforeRightLimit = [];
    let afterRightLimit = [];

    let cases = [true, true, true, true];
    let withinLimit = false;

    for (var i = 1; i < accuracy+2; i += 1) {
        let outPutBeforeLeft = graph.func(graph.domain[leftI].x-1/(Math.pow(10, i)));
        let outPutAfterRight = graph.func(graph.domain[rightI].x+1/(Math.pow(10, i)));

        let outPutBeforeRight = graph.func(graph.domain[rightI].x-1/(Math.pow(10, i)));
        let outPutAfterLeft = graph.func(graph.domain[leftI].x+1/(Math.pow(10, i)));

        beforeLeftLimit.push(outPutBeforeLeft);
        afterRightLimit.push(outPutAfterRight);

        beforeRightLimit.push(outPutBeforeRight);
        afterLeftLimit.push(outPutAfterLeft);

         if(outputAtPointsHaveSameSign(outPutBeforeLeft, graph.domain[leftI].y) == false ||
            outputAtPointsHaveSameSign(outPutAfterRight, graph.domain[rightI].y) == false ||
            outputAtPointsHaveSameSign(outPutAfterLeft, graph.domain[leftI].y) == false ||
            outputAtPointsHaveSameSign(outPutBeforeRight, graph.domain[rightI].y) == false){
            return false;
        }
    }

    // check again but more thouroughly
    for (var i = accuracy+2; i < accuracy*5+2; i += 1) {
        let outPutBeforeLeft = graph.func(graph.domain[leftI].x-1/(Math.pow(10, i)));
        let outPutAfterRight = graph.func(graph.domain[rightI].x+1/(Math.pow(10, i)));

        let outPutBeforeRight = graph.func(graph.domain[rightI].x-1/(Math.pow(10, i)));
        let outPutAfterLeft = graph.func(graph.domain[leftI].x+1/(Math.pow(10, i)));

        beforeLeftLimit.push(outPutBeforeLeft);
        afterRightLimit.push(outPutAfterRight);

        beforeRightLimit.push(outPutBeforeRight);
        afterLeftLimit.push(outPutAfterLeft);

         if(outputAtPointsHaveSameSign(outPutBeforeLeft, graph.domain[leftI].y) == false ||
            outputAtPointsHaveSameSign(outPutAfterRight, graph.domain[rightI].y) == false ||
            outputAtPointsHaveSameSign(outPutAfterLeft, graph.domain[leftI].y) == false ||
            outputAtPointsHaveSameSign(outPutBeforeRight, graph.domain[rightI].y) == false){
            return false;
        }
    }

    //indication as to up and down is switched but the math works the same
    for (var i = 0; i < accuracy; i++) {
        if(graph.domain[leftI].y > 0){
            //case one left is "up" and right is "down"
            if(afterLeftLimit[i] < graph.domain[leftI].y || beforeLeftLimit[i] > graph.domain[leftI].y || 
               afterRightLimit[i] < graph.domain[rightI].y || beforeRightLimit[i] > graph.domain[leftI].y){
                cases[0] = false;
            }
            //case one left is "up" and right is "up"
            // if(afterLeftLimit[i] < graph.domain[leftI].y || beforeLeftLimit[i] > graph.domain[leftI].y ||
            //    afterRightLimit[i] > graph.domain[rightI].y || beforeRightLimit[i] < graph.domain[leftI].y){
                cases[1] = false;
            // }

            cases[2] = false;
            cases[3] = false;
        }

        if(graph.domain[leftI].y < 0){
            //case one left is "down" and right is "up"
            if(afterLeftLimit[i] > graph.domain[leftI].y || beforeLeftLimit[i] < graph.domain[leftI].y || 
               afterRightLimit[i] > graph.domain[rightI].y|| beforeRightLimit[i] < graph.domain[leftI].y){
                cases[2] = false;
            }
            //case one left is "down" and right is "down"
            // if(afterLeftLimit[i] > graph.domain[leftI].y || beforeLeftLimit[i] < graph.domain[leftI].y ||
            //    afterRightLimit[i] < graph.domain[rightI].y || beforeRightLimit[i] > graph.domain[leftI].y){
                cases[3] = false;
            // }

            cases[0] = false;
            cases[1] = false;
        }
    } 

    for (var i = 0; i < cases.length; i++) {
        if(cases[i] == true){
          withinLimit = i;
        } 
    }  

    return withinLimit;
}

function outputAtPointsHaveSameSign(y1, y2){
    return (y1 > 0 && y2 > 0) || (y1 < 0 && y2 < 0);
}

function calculateAreaUnderCurve(c, dx, graph){
  let outPutsAtC = [];
  let area = 0;

    for (var i = 0; i < c.length; i++) {

        let outputAtC = graph.func(c[i]);

        outPutsAtC.push(outputAtC);
    }

    for (var i = 0; i < outPutsAtC.length; i++) {
      let a = dx * -outPutsAtC[i];
      area += a;
    }
    
    return area;
}

function aproxFuncDerivitive(x, set, index){
    let xAfterZoom = (x / canvas.width) * zoom;

    let h = (zoom / canvas.width);

    let riseRight = set[index + 1].y - set[index].y;
    let runRight = (xAfterZoom + h) - xAfterZoom;

    let riseLeft = set[index - 1].y - set[index].y;
    let runLeft = (xAfterZoom - h) - xAfterZoom;

    let avgRise = riseRight + riseLeft / 2;
    let avgRun = runRight + runLeft / 2;

  return {d:avgRise, dx:avgRun};
}

function accurateFuncDerivitive(x, graph){
    let xAfterZoom = (x / canvas.width) * zoom;

    let h = 0.0000001;

    let outPutAtX = graph.func(xAfterZoom);

    let riseRight = graph.func(xAfterZoom+h) - outPutAtX;
    let runRight = (xAfterZoom + h) - xAfterZoom;

    let riseLeft = graph.func(xAfterZoom-h) - outPutAtX;
    let runLeft = (xAfterZoom - h) - xAfterZoom;

    let avgRise = riseRight + riseLeft / 2;
    let avgRun = runRight + runLeft / 2;

    // console.log(runRight + runLeft)

  return {d:avgRise, dx:avgRun};
}

function getLinearDomain(fa, fpa, a){
    let linearDomain = [];
    let len = TAN_LINE_LENGTH;

    let aAfterZoom =(a / canvas.width) * zoom;

    for (var x = a - len/2; x < a + len/2; x++) {
        let xAfterZoom = (x / canvas.width) * zoom;
        let outPutAtTanLineX = fa + fpa * (xAfterZoom - aAfterZoom);

        linearDomain.push(outPutAtTanLineX)
    }

    linearDomain = getTrunkcatedDomainBasedOnLen(linearDomain, len, a)

    return linearDomain;
}

function getTrunkcatedDomainBasedOnLen(domain, len, a){
    let i = Math.floor(len/2 - 1);
    let j = Math.floor(len/2);

    let startingPoint = a - len/2;
    let trunkcatedDomain = [];

    while(i > 0 && j < len){
        let yOfIInRealSpace = (domain[i] / zoom) * canvas.height;
        let yOfJInRealSpace = (domain[j] / zoom) * canvas.height;

        if(distanceOfTwoPoints(i, yOfIInRealSpace, j, yOfJInRealSpace) > len){
            break;
        }

        i--; j++;
    }

    for(u = i; u < j; u++){
        trunkcatedDomain.push(domain[u]);
    }

    return trunkcatedDomain;
}

function getPosOfMarkers(len, real_len, off){
    let posMarkers = [];

    let a = -off - len/2;
    let b = -off + len/2;

    let deltaX = 2;

    let numMarks = Math.floor(zoom / deltaX)

    while(numMarks < NUM_MARKS){
        deltaX /= 2;

        numMarks = Math.floor(zoom / deltaX);
    }


    while(numMarks > NUM_MARKS){
        deltaX *= 2;

        numMarks = Math.floor(zoom / deltaX);
    }

    let firstX = undefined;
    let j = Math.floor(a / deltaX) * deltaX;

    if(a < 0){
        while(j > a){
            j -= deltaX;
        }
        firstX = j + deltaX;
    }

    if(a > 0){
        j = 0;
        while(j < a){
            j += deltaX;
        }
        firstX = j;
    }


    j = 1;
    posMarkers.push(firstX);
    while(firstX + j * deltaX < b){
        posMarkers.push(firstX + j * deltaX);
        j++;
    }

    return posMarkers;
}

function getRGB(){
    if(graphs.length == 2){
        return 'rgb('+ 0 +','+ 255 +','+ 0 +')'
    }
    if(graphs.length == 1){
        return 'rgb('+ 255 +','+ 0 +','+ 0 +')'
    }
    if(graphs.length == 0){
        return 'rgb('+ 0 +','+ 0 +','+ 255 +')'
    }
    if(graphs.length == 3){
        return 'rgb('+ 255 +','+ 255 +','+ 0 +')'
    }
    if(graphs.length == 4){
        return 'rgb('+ 0 +','+ 255 +','+ 255 +')'
    }
    if(graphs.length == 5){
        return 'rgb('+ 255 +','+ 0 +','+ 255 +')'
    }
    if(graphs.length > 5){
        return 'rgb('+ 255*Math.random() +','+ 255*Math.random() +','+ 255*Math.random() +')'
    }
}

function circlePointColision(x1,y1,r, x2,y2){
  let dist = distanceOfTwoPoints(x1, y1, x2, y2);

  return dist < r;
}

function getMousePosRelativeToWindowAndCanvas(){
    return {x: mouseX + canvasOffSets.left + canvas.width/2, y: mouseY + canvasOffSets.top + canvas.height/2}
}

function distanceOfTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}


function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function drawText(color, words, X, Y){
    canvasContext.fillStyle = color;
    canvasContext.fillText(words, X, Y);
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

function countDecimalPlaces(value){
    if(Math.floor(value) === value){
        return 0;
    } 

    return value.toString().split(".")[1].length || 0;
}

function removeFromArray(array,index){
    for(i = array.length - 1; i >= 0; i--){
        if(i == index){
            array.splice(index, 1);
        }
    }
}

function insertAt(array, index, elementsArray) {
    for(i = elementsArray.length - 1; i >= 0; i--){
        array.splice(index, 0, elementsArray[i]);
    }
}

function insertStringAt(index, string, newString) {
  if (index > 0) {
    return string.substring(0, index) + newString + string.substring(index);
  }

  return newString + string;
};

function addStrToOtherStr(str, index, stringToAdd){
  return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function removeCharFromSrting(str, i){
    return str.slice(0, i-1) + str.slice(i);
}

function detectMouseWheelDirection( e ){
    var delta = null;
    var direction = false;

    if ( e.wheelDelta ) { // will work in most cases
        delta = e.wheelDelta / 60;
    } else if ( e.detail ) { // fallback for Firefox
        delta = -e.detail / 2;
    }
    if ( delta !== null ) {
        direction = delta > 0 ? 'up' : 'down';
    }

    return direction;
}

function updateTimeSteps(){
    currentTime = Date.now();

    totalTime = (currentTime - startTime)/1000;

    elaspedTime = totalTime - prevTotalTime;

    if(Math.floor(totalTime*2) > Math.floor(prevTotalTime*2)){
        FPS = 1 / elaspedTime;
    }

     prevTotalTime = totalTime;
}


function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}
// Helper function to deal with Objects
function deepCopyObject(obj){
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}

//////////
//this is a "failed" attept at making the resolution of the graph become more precise at va's

var highSlopePoints = [];
var highVa = [];
var lowVa = [];

//resolution is the number of how many times more you want to raise the resolution of a function
function upFunctionsResolution(graph, resolution){
    let derivitives = [];
    let sumSlopes = 0;

    for (var i = 1; i < graph.domain.length-1; i++) {
        let d_dx = aproxFuncDerivitive(graph.domain[i].x, graph.domain, i);
        let derivitive = d_dx.d / d_dx.dx;
        derivitives.push(derivitive);

        // if(i == Math.floor(graph.domain.length/2)){
        //     console.log(derivitive);
        //     let xOfTempInRealSpace = (graph.domain[i].x / zoom) * canvas.width + offX * canvas.width/zoom;
        //     colorCircle(xOfTempInRealSpace, 0, 5, "green");
        // }

        sumSlopes += derivitive;
    }

    let avgSlope = sumSlopes / (graph.domain.length-2);
    avgSlope = Math.max(1, Math.abs(avgSlope));

    let streaksOfHighSlope = [];
    let streak = [];

    for (var i = 0; i < derivitives.length; i++) {
        if((graph.domain[i].y > 0 && Math.abs(derivitives[i]) > 30) || 
           (graph.domain[i].y < 0 && Math.abs(derivitives[i]) > 30)){

            streak.push({i:i, x:graph.domain[i].x, d:derivitives[i]});

            if(i != derivitives.length-1){ continue; }
        }

        if(streak.length > 0){
            streaksOfHighSlope.push(streak);
            streak = [];
        }
    }

    highSlopePoints = streaksOfHighSlope;

    // addResolutionToHighSlopeAreas(graph.domain, streaksOfHighSlope, resolution, graph);

    // highVa = [];
    // lowVa = [];
    // let highHighVa;
    // let lowHighVa;

    // for (var i = 0; i < streaksOfHighSlope.length; i++) {
    //     highHighVa = undefined;
    //     lowHighVa = undefined;

    //     for (var j = 0; j < streaksOfHighSlope[i].length; j++) {
    //         let outputAtX = graph.func(streaksOfHighSlope[i][j].x);

    //         if((outputAtX < 0 && highHighVa == undefined) ||
    //            (outputAtX < 0 && Math.abs(streaksOfHighSlope[i][j].d) > Math.abs(highHighVa.d))){
    //             highHighVa = streaksOfHighSlope[i][j];
    //         }

    //         if((outputAtX >= 0 && lowHighVa == undefined) || 
    //            (outputAtX >= 0 && Math.abs(streaksOfHighSlope[i][j].d) > Math.abs(lowHighVa.d))){
    //             lowHighVa = streaksOfHighSlope[i][j];
    //         }
    //     }

    //     if(highHighVa){
    //         highVa.push(highHighVa);
    //     }

    //     if(lowHighVa){
    //         lowVa.push(lowHighVa);
    //     }
    // }
}

function addResolutionToHighSlopeAreas(domain, highSlopeAreas, resolution, graph){
    //this is where u need to do some array manipulation and go through increaing the resolution 
    for (var i = domain.length - 1; i >= 0; i--) {

        for (var j = 0; j < highSlopeAreas.length; j++) {

           for (var e = 0; e < highSlopeAreas[j].length; e++) {
                //if we found a match of a point with a high slope
                if(i == highSlopeAreas[j][e].i){
                    removeFromArray(domain,i);

                    //if weve delted an area of high slope then we go through and add a more concentrated batch of points
                    if(e == 0){
                        let deltaX = graph.deltaX / resolution;
                        let higherResolutionArea = [];

                        for (var u = highSlopeAreas[j][0].x; 
                            u < highSlopeAreas[j][highSlopeAreas[j].length-1].x; 
                            u += (deltaX / canvas.width) * zoom)
                        {
                            higherResolutionArea.push(new Vec(u, graph.func(u)));
                        }

                        insertAt(domain, highSlopeAreas[j][0].i, higherResolutionArea);
                    }
                }
            }
        } 

    } 
}



