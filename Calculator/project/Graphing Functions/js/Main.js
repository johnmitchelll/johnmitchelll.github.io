var canvas;
var canvasContext;
var canvasOffSets;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth-document.getElementById("sidenav").offsetWidth;
	canvas.height = window.innerHeight;
	canvasOffSets = document.getElementById('gameCanvas').getBoundingClientRect();

	start();

	//start of program drawing
  var framesPerSecond = 60;
	setInterval(function(){update();},1000/framesPerSecond);
}

function update(){
	drawGraph();
}

function start(){
	startTime = Date.now();
  canvasContext.translate(canvas.width/2, canvas.height/2);

  graphs.push(new Graph());

  // getGraphs();
  // document.getElementById("graph0form").value = "tanx";
  // getGraphs();
  // upFunctionsResolution(graphs[0], 4);
  // document.getElementById("cursorX_equals").value = "sin(j)";

//   let outputQueue = parse("sin(2x) - 1");
//   console.log(eval(outputQueue, 1));
}

