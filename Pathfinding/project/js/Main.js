var canvas;
var canvasContext;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	start();
	setUp();

	var framesPerSecond = 90;
	setInterval(function(){update();},1000/framesPerSecond);

}

function update(){
	drawEverything();

	scanForAll();

}

	function start(){
        BRICK_W = (canvas.width-1)/BRICK_COLS;
        BRICK_H = (canvas.height-1)/BRICK_ROWS;

		for(i = 0; i < BRICK_COLS; i++){
			brickGrid[i] = new Array(BRICK_ROWS)
	   	}

	   	for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
		     brickGrid[i][j] = new nodeClass(i, j)
          }
    	}
    	for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
    	 brickGrid[i][j].addNeighbors(brickGrid);
    	}
    	}

        document.getElementById("block").innerHTML = "Wall";
}


function setUp(){
		for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
    	 brickGrid[i][j].wall = false;
    	 brickGrid[i][j].door = false;
    	 brickGrid[i][j].parent = undefined;
    	 brickGrid[i][j].tooSmall = false;
    	 brickGrid[i][j].value = 1000000;
    	 notIncluded.push(brickGrid[i][j])
    	}
    	}

    	openList = [];
		closedList = [];
		path = [];
		shortestPathSet = [];

		readyForMaze = false;
		readyForAStar = false;
		readyForDijkstra = false;

		doneWithAStar = false;
		doneWithMaze = false;
        doneWithDijkstra = false;

		doorsList = [];

		mazecalculations = 0;
	 	aStarCalcs = 0;
        dijkstrasCalcs = 0;

		if(startingNode == undefined){
            current = brickGrid[0][0];
        }else{
            current = startingNode;
        }
        if(endingNode == undefined){
            apple = brickGrid[BRICK_COLS-1][BRICK_ROWS-1]
        }else{
            apple = endingNode;
        }

    	current.wall = false;
    	apple.wall = false;
    	current.value = 0;
    	removeFromArray(notIncluded,current)
    	shortestPathSet.push(current)

    	openList.push(current);
}

function AStarSetUp(){
        for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
    	 brickGrid[i][j].parent = undefined;
    	}
    	}

    	openList = [];
		closedList = [];
		path = [];

		doneWithAStar = false;
	 	aStarCalcs = 0;
        readyForAStar = false;

		if(startingNode == undefined){
            current = brickGrid[0][0];
        }else{
            current = startingNode;
        }
        if(endingNode == undefined){
            apple = brickGrid[BRICK_COLS-1][BRICK_ROWS-1]
        }else{
            apple = endingNode;
        }
    	current.wall = false;
    	apple.wall = false;

    	openList.push(current);
}

function DijkstrasSetUp(){
        for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
         brickGrid[i][j].parent = undefined;
         brickGrid[i][j].value = Infinity;
         notIncluded.push(brickGrid[i][j])
        }
        }

        path = [];
        shortestPathSet = [];

        readyForDijkstra = false;
        dijkstrasCalcs = 0;
        doneWithDijkstra = false;

        if(startingNode == undefined){
            current = brickGrid[0][0];
        }else{
            current = startingNode;
        }
        if(endingNode == undefined){
            apple = brickGrid[BRICK_COLS-1][BRICK_ROWS-1]
        }else{
            apple = endingNode;
        }

        current.wall = false;
        apple.wall = false;
        current.value = 0;
        removeFromArray(notIncluded,current)
        shortestPathSet.push(current)
}


