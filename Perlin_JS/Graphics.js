
var SCALE = 4;
var cols, rows;
var particles = new Array(200);

var flowFeild;

var timer = 1000;
var respawnNum = 1;

function drawEverything (){
  timer--;
  if(timer <= 0){
    for (var i = 0; i < particles.length; i++) {
       particles[i].randomize();
    }

    timer = 200//Math.max(1000 / respawnNum, 200);
    respawnNum++;
  }


    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowFeild);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
}


function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorNoFillRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
    canvasContext.beginPath();
    canvasContext.strokeStyle = fillColor;
    canvasContext.rect(topLeftX, topLeftY, boxWidth, boxHeight);
    canvasContext.stroke();
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill(); 
}