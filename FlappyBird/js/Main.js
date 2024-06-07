var canvas;
var canvasContext;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	setUp();

	var framesPerSecond = 30;
	setInterval(update,1000/framesPerSecond);
	
}

function update(){
	drawEverything();
}

function setUp(){
	loadImages();

	for (var i = 0; i < walls.length; i++) {
		walls[i] = new Wall();
	}

	population = new Population(500);

	for (var i = 0; i < population.balls.length; i++) {
		population.balls[i].brain.randomlyMutate();
	}

	polesPassed = 0;
 	bestPolesPassed = 0;

}

