var canvas;
var canvasContext;

window.onload = function() {
	canvas = document.getElementById('canvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	start();
	
	window.scrollTo(0,0);
	InitHTML();
}

function start(){

}


	// getData();
	// let dateString = new Date(Date.now()).toLocaleString()
	// console.log(dateString)
	// sendData({a:1001, b:1110});
	   // var framesPerSecond = 100;
	// setInterval(function(){handleScenes();},1000/framesPerSecond);


