
var lines = [[],[],[],[],[],[]];
var linesXs = [];
var linesAngs = [];
const R = 3;

function drawEverythingProjects (){
    colorRectProjects(0, 0, projectsCanvas.width, projectsCanvas.height, "rgb(18,18,18)")

    updateLines();

    updateColor();

    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {

            drawLineProjects(linesXs[i]+Math.cos(linesAngs[i])*R*j+lines[i][j]/10*j,
            canvas.height+Math.sin(linesAngs[i])*R*j,
            linesXs[i]+Math.cos(linesAngs[i])*R*j+lines[i][j]/10*j,
            canvas.height+Math.sin(linesAngs[i])*R*j+30,
            1,"rgba("+r+","+g+","+b+","+ (j/lines[i].length) +")");


            // drawLineProjects(linesXs[i]+Math.cos(linesAngs[i])*R*j+lines[i][j]/10*j,
            // -Math.sin(linesAngs[i])*R*j,
            // linesXs[i]+Math.cos(linesAngs[i])*R*j+lines[i][j]/10*j,
            // -Math.sin(linesAngs[i])*R*j+30,
            // 1,"rgba("+r+","+g+","+b+","+ (j/lines[i].length) +")");
        }
    }

    // drawLineProjects(projectsCanvas.width/2,0,projectsCanvas.width/2,projectsCanvas.height,2,"white")
}


function colorRectProjects(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    projectsCanvasContext.fillStyle = fillColor;
    projectsCanvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorNoFillRectProjects(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
    projectsCanvasContext.beginPath();
    projectsCanvasContext.strokeStyle = fillColor;
    projectsCanvasContext.rect(topLeftX, topLeftY, boxWidth, boxHeight);
    projectsCanvasContext.stroke();
}

function drawLineProjects(x1,y1,x2,y2,width,color){
    projectsCanvasContext.lineWidth = width;
    projectsCanvasContext.strokeStyle = color;
    projectsCanvasContext.beginPath()
    projectsCanvasContext.moveTo(x1, y1);
    projectsCanvasContext.lineTo(x2, y2);
    projectsCanvasContext.stroke();
}

function colorCircleProjects(centerX, centerY, radius, drawColor){
  projectsCanvasContext.fillStyle = drawColor;
  projectsCanvasContext.beginPath();
  projectsCanvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  projectsCanvasContext.fill(); 
}