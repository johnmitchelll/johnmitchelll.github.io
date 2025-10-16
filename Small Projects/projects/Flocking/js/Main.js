
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;


	start();

	var framesPerSecond = 60;
	setInterval(drawAll, 1000/framesPerSecond);

}

function start(){
	boundary = new Rectangle(canvas.width/2,canvas.height/2,canvas.width/2,canvas.height/2);

	for (var i = 0; i < boids.length; i++) {
		boids[i] = new Boid(i);
	}
	
}
