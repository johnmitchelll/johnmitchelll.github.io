var BRICK_COLS = 7;
var BRICK_ROWS = 6;
var BRICK_W;
var BRICK_H;
var BRICK_GAP = 0;

var brickGrid = new Board(new Array(BRICK_COLS));

function Board(arr){
this.array = arr;
this.score = 0;
}

function NodeClass(col,row){
	this.i = col;
	this.j = row;
	this.w = 100;
	this.h = 100;
	this.index = col + BRICK_COLS * row;
	this.type = 0;

	this.showNode = function(type){
		canvasContext.fillStyle = 'blue';
        canvasContext.fillRect(this.i*BRICK_W+BRICK_GAP,this.j*BRICK_H+BRICK_GAP, 
        						BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP);
        if(type == 0){
       		 colorCircle(this.i*BRICK_W+BRICK_W/2,this.j*BRICK_H+BRICK_H/2, 40, 'rgb(18,18,18')
    	}

        if(type == 2){
       		 colorCircle(this.i*BRICK_W+BRICK_W/2,this.j*BRICK_H+BRICK_H/2, 40, 'red')
    	}

   	 	if(type == 1){
        	colorCircle(this.i*BRICK_W+BRICK_W/2,this.j*BRICK_H+BRICK_H/2, 40, '#ffdf00')
   		}
	}
}

var delay = ms => new Promise(res => setTimeout(res, ms));

function drawAll() {
	for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
        	if(brickGrid.array[i][j].type == 0){
              brickGrid.array[i][j].showNode(0);
        	}
        	if(brickGrid.array[i][j].type == 1){
              brickGrid.array[i][j].showNode(brickGrid.array[i][j].type);
        	}
        	if(brickGrid.array[i][j].type == 2){
              brickGrid.array[i][j].showNode(brickGrid.array[i][j].type);
        	}
        }
    }
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}
