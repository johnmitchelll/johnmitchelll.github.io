var canvas;
var canvasContext;

var perlinInterval;

document.addEventListener('DOMContentLoaded', function() {
	canvas = document.getElementById('flow_canvas');
	canvasContext = canvas.getContext('2d');

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    canvas.width = screen.width;
    canvas.height = screen.height;

    // colorRect(0,0,canvas.width,canvas.height,'rgb(253,251,248)');

	start();

    // drawFlowGrid();

	var framesPerSecond = 60;
	perlinInterval = setInterval(function(){drawEverything();},1000/framesPerSecond);

    setTimeout(() => {
        clearInterval(perlinInterval);
        console.log("HELLO")
    }, 30000);
});


function start(){

    cols = Math.ceil(canvas.width / SCALE)+2;
    rows = Math.ceil(canvas.height / SCALE)+2;

    flowFeild = new Array(cols * rows);

    var yOff = 0;
    
    for (var j = 0; j < rows; j++) {
      var xOff = 0;

        for (var i = 0; i < cols; i++) {

            xOff += 0.03;
            var index = j * cols + i;
            var angle = (0.5 + perlin.get(xOff, yOff)) * 2*Math.PI;
            flowFeild[index] = angle;
        }

        yOff += 0.027;
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i] = new Particle();
    }
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

