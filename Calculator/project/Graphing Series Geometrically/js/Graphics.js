//graph constants
const HEIGHT_OF_MARKS = 10;
const NUM_MARKS = 10;

//graph vars
var zoom = 0.001;
var offX = 0;
var offY = 0;
var t = 0;
var n = 0;
var globalIdCounter = 0;

var xMarksPos;
var yMarksPos;

function drawGraph(){   
    colorRect(-canvas.width, -canvas.height, canvas.width*2, canvas.height*2,  'rgb(18,18,18)');

    handleMouseInput();

    drawXYAxis();

    
    drawGraphs();
    getGraphs();

    drawNumberMarks(xMarksPos, yMarksPos);

    drawCrosshair();

    t += 0.01;
}

function drawXYAxis(){
    let zoom_rangeslider = document.getElementById("zoom");
    zoom = zoom_rangeslider.value;

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

    //Y Markers
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
            let width = canvasContext.measureText(-yPos[i].toFixed(3)).width;
            drawText("white", -yPos[i].toFixed(4), -canvas.width/2+width/2, 
                     yPos[i]/zoom * canvas.height+offY * canvas.height/zoom+height/2)
            drawText("white", -yPos[i].toFixed(4), canvas.width/2-width*1.5, 
                     yPos[i]/zoom * canvas.height+offY * canvas.height/zoom+height/2)
        }

        //Drawing X numbers here so that the graph makrks for the Y coords dont cross out the numbers
        for (var i = 0; i < xPos.length; i++) {
            // draw numbers 
            let width = canvasContext.measureText(xPos[i].toFixed(3)).width;
            drawText("white", (-xPos[i].toFixed(4)*-1),xPos[i]/zoom * canvas.width + offX * canvas.width/zoom - width/2,
                     canvas.height/2-3)
            drawText("white", (-xPos[i].toFixed(4)*-1),xPos[i]/zoom * canvas.width + offX * canvas.width/zoom - width/2,
                     -canvas.height/2+9)
        }
}


function drawCrosshair(){
    drawLine(-HEIGHT_OF_MARKS/2,0,HEIGHT_OF_MARKS/2,0,2,'rgba(255,255,255,0.75)');
    drawLine(0,-HEIGHT_OF_MARKS/2,0,HEIGHT_OF_MARKS/2,2,'rgba(255,255,255,0.75)');
    drawText('yellow', (-offX).toFixed(3) + ", " + (offY).toFixed(3), 3, -4)
}

