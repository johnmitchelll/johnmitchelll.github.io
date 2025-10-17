var canvas;
var canvasContext;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	// canvas.width  = window.innerWidth;
	// canvas.height = window.innerHeight;

	start();
	InitHTML();

    var framesPerSecond = 100;
	setInterval(function(){handleScenes();},1000/framesPerSecond);
}

function start(){
	cpuWordle = new WordGrid();
	
	test = new TestBrain();

	currentScene = 0;
	winner = undefined;

	// console.log(getAllPosibleGames([words[0]], cpuWordle, 0))

	// test.playNextWord();

	// for (var i = 0; i < words.length; i++) {
	// 	if(words[i] == "hatch"){
	// 		console.log(i)
	// 	}
	// }
}



