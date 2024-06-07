
var SCALE = 4;
var cols, rows;
var particles = new Array(200);

var flowFeild;

var timer = 1000;
var respawnNum = 1;


var prevWindowDimentions = {width:0, height:0};

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

      if(i < particles.length/2){
        particles[i].show();
      }else{
        particles[i].show(true);
      }
    }

    canvasAlign();

    // var style = getComputedStyle(document.body)
    // console.log( style.getPropertyValue('--small4-width') )
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

function canvasAlign(){
	if(prevWindowDimentions.width == window.innerWidth && prevWindowDimentions.height == window.innerHeight){
    return;
	}

  clearInterval(perlinInterval);

  var framesPerSecond = 60;
	perlinInterval = setInterval(function(){drawEverything();},1000/framesPerSecond);

    setTimeout(() => {
        clearInterval(perlinInterval);
    }, 30000);

  colorRect(0, 0, canvas.width, canvas.height, "rgb(18,18,18)");

  document.documentElement.style.setProperty('--small4-width', document.getElementById("small_4").offsetWidth + "px");

  start();
}