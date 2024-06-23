var perlinCanvas = new DrawableSurface('flow_canvas');

var perlinInterval;
var perlinRefreshTimer;

var SCALE = 4;
var cols, rows;
var particles = new Array(100);

var flowFeild;

var timer = 1000;
var respawnNum = 1;

var prevWindowDimentions = {width:0, height:0};


function startPerlin(){
    prevWindowDimentions.width = window.innerWidth;
	prevWindowDimentions.height = window.innerHeight;

    perlinCanvas.canvas.style.width = window.innerWidth + "px";
    perlinCanvas.canvas.style.height = window.innerHeight + "px";

    perlinCanvas.canvas.width = window.innerWidth;
    perlinCanvas.canvas.height = window.innerHeight;

    cols = Math.ceil(perlinCanvas.canvas.width / SCALE)+2;
    rows = Math.ceil(perlinCanvas.canvas.height / SCALE)+2;

    flowFeild = new Array(cols * rows);

    var yOff = 0;
    
    for (var j = 0; j < rows; j++) {
      var xOff = 0;

        for (var i = 0; i < cols; i++) {

            xOff += 0.028;
            var index = j * cols + i;
            var angle = (0.5 + perlin.get(xOff, yOff)) * 2*Math.PI;
            flowFeild[index] = angle;
        }

        yOff += 0.028;
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i] = new Particle();
    }


    var framesPerSecond = 60;
	perlinInterval = setInterval(function(){drawEverything();},1000/framesPerSecond);
    setInterval(function(){canvasAlign();},1000/10);

    perlinRefreshTimer = setTimeout(() => {
        clearInterval(perlinInterval);
        // perlinRefreshTimer = undefined;
        // perlinInterval = undefined;
    }, 20000);
}



function drawFlowGrid(){
    for (var i = 0; i < flowFeild.length; i++) {
      var row = Math.floor(i / cols);
      var col = i - row * cols;
      var index = row * cols + col


      colorNoFillRect(col * SCALE-SCALE, row * SCALE-SCALE, SCALE, SCALE, "white");

      let x = col * SCALE+SCALE/2
      let y = row * SCALE+SCALE/2

      drawLine(x, y, x+Math.cos(flowFeild[index])*50, y+Math.sin(flowFeild[index])*50,2,"white")

    }
}

