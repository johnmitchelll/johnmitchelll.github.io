//graph constants
const HEIGHT_OF_MARKS = 10;
const NUM_MARKS = 7;
const TAN_LINE_LENGTH = 275;

//graph vars
var zoom = 30;
var offX = 0;
var offY = 0;
var t = 0;
var n = 100;
var a = -Math.PI; 
var b = Math.PI; 
var deltaX = 0;
var xMarksPos;
var yMarksPos;
var FPS = 0;

function drawGraph(){   
    colorRect(-canvas.width, -canvas.height, canvas.width*2, canvas.height*2, 'rgb(18,18,18)');

    handleMouseInput();
    setValuesOfHTML();

    drawXYAxis();

    for (var i = 0; i < graphs.length; i++) {
        if(graphs[i].showAreaUnderCurve){ drawAreaUnderCurve(graphs[i]) };

        // upFunctionsResolution(graphs[i], 4);
        drawDomainOutput(graphs[i].domain, graphs[i].color, graphs[i]);

        if(graphs[i].showTangent) { drawTangentLine(graphs[i]) };
    }

    drawNumberMarks(xMarksPos, yMarksPos);

    drawCrosshair();

    t += 0.01;
    getGraphs();
    updateTimeSteps();

    // console.log(document.getElementById("canvas").getBoundingClientRect().left)
    // console.log(mousePosInWindow)

    // console.log(document.getElementById("keyboard").scrollHeight, document.getElementById("keyboard").scrollTop)
}

function drawDomainOutput(domain, color, graph){
    let temp = 0;

    for (var i = 0; i < domain.length; i++) {
        let yOfTempInRealSpace = (domain[temp].y / zoom) * canvas.height + offY * canvas.height/zoom;
        let yOfIInRealSpace = (domain[i].y / zoom) * canvas.height + offY * canvas.height/zoom;

        let xOfTempInRealSpace = (domain[temp].x / zoom) * canvas.width + offX * canvas.width/zoom;
        let xOfIInRealSpace = (domain[i].x / zoom) * canvas.width + offX * canvas.width/zoom;

        if((yOfIInRealSpace > canvas.height/2 && yOfTempInRealSpace > canvas.height/2) || 
           (yOfIInRealSpace < -canvas.height/2 && yOfTempInRealSpace < -canvas.height/2))
        {
            // decideToDrawTwoPoints(temp, i, graph, yOfTempInRealSpace, yOfIInRealSpace)
            if(i > 0){temp++;}
            continue;
        }

        if(decideToDrawTwoPoints(temp, i, graph, yOfTempInRealSpace, yOfIInRealSpace)){
            drawLine(xOfTempInRealSpace,yOfTempInRealSpace,xOfIInRealSpace,yOfIInRealSpace,4,color);
        }

        if(i > 0){temp++;}
        
    }
}

function drawXYAxis(){
    //X Markers
    xMarksPos = getPosOfMarkers(zoom, canvas.width, offX);
    for (var i = 0; i < xMarksPos.length; i++) {

        //draw graph mark
        drawLine(xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 -canvas.height,
                 xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 canvas.height, 2, 'rgba(18,18,100,0.5)');

        //draw hash mark
        drawLine(xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 HEIGHT_OF_MARKS + offY * canvas.height/zoom,
                 xMarksPos[i]/zoom * canvas.width + offX * canvas.width/zoom,
                 -HEIGHT_OF_MARKS + offY * canvas.height/zoom, 
                 2, 'rgba(255,255,255,0.5)');
    }

    // Y Markers
    yMarksPos = getPosOfMarkers(zoom, canvas.height, offY);
    for (var i = 0; i < yMarksPos.length; i++) {

        //draw graph mark
        drawLine(-canvas.width/2,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom,
                canvas.width/2,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom, 
                2, 'rgba(18,18,100,0.5)');

        //draw hash mark
        drawLine(HEIGHT_OF_MARKS + offX * canvas.width/zoom,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom,
                -HEIGHT_OF_MARKS + offX * canvas.width/zoom,
                yMarksPos[i]/zoom * canvas.height+offY * canvas.height/zoom, 
                2, 'rgba(255,255,255,0.5)');
    }


    //Axis
    drawLine(-canvas.width/2,offY * canvas.height/zoom,canvas.width/2,offY * canvas.height/zoom,2,'rgba(255,255,255,0.5)');
    drawLine(offX * canvas.width/zoom,-canvas.height/2,offX * canvas.width/zoom,canvas.height/2,2,'rgba(255,255,255,0.5)');

    //Border
    drawLine(-canvas.width/2,-canvas.height/2,canvas.width/2,-canvas.height/2,'rgba(255,255,255,0.5)');
    drawLine(canvas.width/2,-canvas.height/2,canvas.width/2,canvas.height/2,'rgba(255,255,255,0.5)');
    drawLine(canvas.width/2,canvas.height/2,-canvas.width/2,canvas.height/2,'rgba(255,255,255,0.5)');
    drawLine(-canvas.width/2,-canvas.height/2,-canvas.width/2,canvas.height/2,'rgba(255,255,255,0.5)');
}

function drawNumberMarks(xPos, yPos){
    for (var i = 0; i < yPos.length; i++) {
        let height = 6;
        // draw numbers 
        let yPosWriting = yPos[i];
        if(Math.abs(yPos[i]) > 100000 || countDecimalPlaces(yPos[i]) > 6){
            yPosWriting = yPosWriting.toExponential(4);
        }

        let width = canvasContext.measureText(yPosWriting).width;
        drawText("white", yPosWriting, -canvas.width/2+2, 
                    yPos[i]/zoom * canvas.height+offY * canvas.height/zoom+height/2)
        drawText("white", yPosWriting, canvas.width/2-width-2, 
                    yPos[i]/zoom * canvas.height+offY * canvas.height/zoom+height/2)
    }

    //Drawing X numbers here so that the graph makrks for the Y coords dont cross out the numbers
    for (var i = 0; i < xPos.length; i++) {
        // draw numbers 
        let xPosWriting = xPos[i];
        if(Math.abs(xPos[i]) > 100000 || countDecimalPlaces(xPos[i]) > 6){
            xPosWriting = xPosWriting.toExponential(4);
        }

        let width = canvasContext.measureText(xPosWriting).width;
        drawText("white", xPosWriting,xPos[i]/zoom * canvas.width + offX * canvas.width/zoom - width/2,
                    canvas.height/2-3)
        drawText("white", xPosWriting,xPos[i]/zoom * canvas.width + offX * canvas.width/zoom - width/2,
                    -canvas.height/2+9)
    }

    width = canvasContext.measureText("FPS:" + Math.floor(FPS)).width
    drawText("white", "FPS:" + Math.floor(FPS), canvas.width/2 - width, -canvas.height/2+9)
}


function drawTangentLine(graph){
    let cursorXAfterOffset = -offX * canvas.width/zoom;

    let outputAtCursorX = graph.func(-offX);
    // let dAtCursorX = FuncDerivitive(cursorXAfterOffset, graph.domain);
    let dAtCursorX = accurateFuncDerivitive(cursorXAfterOffset, graph);

    let linearDomain = getLinearDomain(outputAtCursorX, dAtCursorX.d / dAtCursorX.dx, -offX);

    //the three points that we need to make up the line
    let yOfFirstInRealSpace = (linearDomain[0] / zoom) * canvas.height + offY * canvas.height/zoom;
    let yOfLastInRealSpace = (linearDomain[linearDomain.length-1] / zoom) * canvas.height + offY * canvas.height/zoom;
    let yOfMiddleInRealSpace = (linearDomain[Math.floor(linearDomain.length/2)] / zoom) * canvas.height + offY * canvas.height/zoom;

    drawLine(-linearDomain.length/2, yOfFirstInRealSpace, linearDomain.length/2, yOfLastInRealSpace, 4,'white');

    slope = dAtCursorX.d / dAtCursorX.dx;
    colorCircle(-linearDomain.length/2, yOfFirstInRealSpace, 7, graph.color);
    colorCircle(linearDomain.length/2, yOfLastInRealSpace, 7, graph.color);
    colorCircle(0, yOfMiddleInRealSpace, 7, "white");

    graph.tanEquals.innerHTML = "= " + (-slope).toFixed(3);
}


function drawAreaUnderCurve(graph){
    let c = [];
    let outPutsAtC = [];
    deltaX = (b - a) / n;

    for (var i = 1; i <= n; i++) {
        let xVal = a + (i - 1/2) * deltaX;

        let indexAtC = Math.floor((xVal / zoom) * graph.domain.length + offX * graph.domain.length/zoom);
        c.push(xVal);

        if(graph.domain[indexAtC + Math.floor(graph.domain.length/2)]){
            outPutsAtC.push(graph.domain[indexAtC + Math.floor(graph.domain.length/2)].y);
            continue;
        }

         outPutsAtC.push(graph.func(indexAtC));
    }


    for (var i = 0; i < outPutsAtC.length; i++) {
        if((outPutsAtC[i] / zoom) * canvas.height < 0){
            colorRect(((c[i] - deltaX/2) / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 
            (deltaX / zoom) * canvas.width,(outPutsAtC[i] / zoom) * canvas.height, 'green');
        }
        if((outPutsAtC[i] / zoom) * canvas.height > 0){
            colorRect(((c[i] - deltaX/2) / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 
            (deltaX / zoom) * canvas.width,(outPutsAtC[i] / zoom) * canvas.height, 'red');
        }
    }

    drawLine((a / zoom) * canvas.width + offX * canvas.width/zoom,-canvas.height/2,
             (a / zoom) * canvas.width + offX * canvas.width/zoom,canvas.height/2,1,'white');
    drawLine((b / zoom) * canvas.width + offX * canvas.width/zoom,-canvas.height/2,
             (b / zoom) * canvas.width + offX * canvas.width/zoom,canvas.height/2,1,'white');

    colorCircle((a / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 10, 'white');
    colorCircle((b / zoom) * canvas.width + offX * canvas.width/zoom, offY * canvas.height/zoom, 10, 'white');

    drawText('black', "A", (a / zoom) * canvas.width-3 + offX * canvas.width/zoom, 2 + offY * canvas.height/zoom);
    drawText('black', "B", (b / zoom) * canvas.width-3 + offX * canvas.width/zoom, 2 + offY * canvas.height/zoom);

    graph.defIntegral.innerHTML = "= " + (calculateAreaUnderCurve(c, deltaX, graph)).toFixed(3);

}

function drawCrosshair(){
    drawLine(-HEIGHT_OF_MARKS/2,0,HEIGHT_OF_MARKS/2,0,2,'rgba(255,255,255,0.75)');
    drawLine(0,-HEIGHT_OF_MARKS/2,0,HEIGHT_OF_MARKS/2,2,'rgba(255,255,255,0.75)');
    drawText('yellow', (-offX).toFixed(3) + ", " + (offY).toFixed(3), 3, -4)
}


//(1/xx) * sin(5j) - sin(5x)

    // for (var i = 0; i < highSlopePoints.length; i++) {
    //     for (var j = 0; j < highSlopePoints[i].length; j++) {
    //         let xOfTempInRealSpace = (highSlopePoints[i][j].x / zoom) * canvas.width + offX * canvas.width/zoom;
    //         if(i % 2 == 0){
    //             drawLine(xOfTempInRealSpace,canvas.height/2,xOfTempInRealSpace,-canvas.height/2,1,"red");
    //         }else{
    //             drawLine(xOfTempInRealSpace,canvas.height/2,xOfTempInRealSpace,-canvas.height/2,1,"blue");
    //         }
    //     }
    // }

    // for (var i = 0; i < lowVa.length; i++) {
        // let xOfTempInRealSpace = (lowVa[i].x / zoom) * canvas.width + offX * canvas.width/zoom;
        // drawLine(xOfTempInRealSpace,canvas.height/2,xOfTempInRealSpace,-canvas.height/2,4,"yellow");

        // for (var j = 0; j < graphs[0].domain.length; j++) {
        //    if(graphs[0].domain[j].x == lowVa[i].x){
        //         let xOfTempInRealSpace = (lowVa[i].x / zoom) * canvas.width + offX * canvas.width/zoom;
        //         let yOfTempInRealSpace = (graphs[0].func(lowVa[i].x) / zoom) * canvas.height + offY * canvas.height/zoom;
        //         colorCircle(xOfTempInRealSpace, yOfTempInRealSpace, 5, "yellow");
        //    }
        // }
    // }

    // for (var i = 0; i < highVa.length; i++) {
        // let xOfTempInRealSpace = (highVa[i].x / zoom) * canvas.width + offX * canvas.width/zoom;
        // drawLine(xOfTempInRealSpace,canvas.height/2,xOfTempInRealSpace,-canvas.height/2,4,"green");

        // for (var j = 0; j < graphs[0].domain.length; j++) {
        //    if(graphs[0].domain[j].x == highVa[i].x){
        //         let xOfTempInRealSpace = (highVa[i].x / zoom) * canvas.width + offX * canvas.width/zoom;
        //         let yOfTempInRealSpace = (graphs[0].func(highVa[i].x) / zoom) * canvas.height + offY * canvas.height/zoom;
        //         colorCircle(xOfTempInRealSpace, yOfTempInRealSpace, 5, "green");
        //    }
        // }
    // }

