var canvas;
var canvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	LoadingScreen();

	startTime = Date.now();

	loadImages();

	start();

	var framesPerSecond = 60;
	setInterval(function(){update();},1000/framesPerSecond);	
}

function update(){
	updateTimeSteps();
	drawEverything();
}

function start(){
	largeFont = Math.floor(canvas.width * 32/1000);
	winner = undefined;

	gameType = undefined;

	lineRadii = 3;

	table = new Table("Playable");

	initScenes();
	currentScene = scenes[5];

	prevTotalTime = 0;
}

//be able to call your pocket on the 8 ball shot
//proper spacing of balls


