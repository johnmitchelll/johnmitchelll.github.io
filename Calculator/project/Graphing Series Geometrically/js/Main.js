var canvas;
var canvasContext;
var canvasOffSets;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth-document.getElementById("sidenav").offsetWidth;
	canvas.height = window.innerHeight;
	canvasOffSets = document.getElementById('gameCanvas').getBoundingClientRect();

	start();

	//start of program drawing
  	var framesPerSecond = 30;
	setInterval(function(){update();},1000/framesPerSecond);
}

function update(){
	drawGraph();
}

function start(){
	canvasContext.translate(canvas.width/2+offX, canvas.height/2+offY);

  graphs.push(new Graph());


  // let outputQueue = parse("n!", 52);
  // console.log(eval(outputQueue, 52));

  getGraphs();
  drawGraphs();
}

