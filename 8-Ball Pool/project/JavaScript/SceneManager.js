function Scene(){
	this.list = [];
	this.ci = new Vector(0,0);
	this.nextScene;

	this.onAction = function(){};
	this.onMouseAction = function(){};
	this.draw = function(){};
	this.init = function(){};

	this.onMouseSelect = function(){
		for (var i = 0; i < this.list.length; i++) {
			if(mouseX > this.list[i].x - this.list[i].w/2 &&
			   mouseX < this.list[i].x + this.list[i].w/2 &&
			   mouseY > this.list[i].y - this.list[i].h*1.5 &&
			   mouseY < this.list[i].y - this.list[i].h/3){
				
				this.ci = this.list[i].index;
				if(mouseDown && mouseDisabled == false){
					currentScene = scenes[this.list[i].nextScene];

					//this is the special case when the user wants to go back to their current game
					if(this.list[i].nextScene == undefined){
						currentScene = prevScene;
					}

					if(this == scenes[0]){
						if(this.ci.y == 0){
							gameType = "PVP"
							mouseDisabled = true;
						}
						if(this.ci.y == 1){
							mouseDisabled = true;
						}
						if(this.ci.y == 2){
							mouseDisabled = true;
						}
					}

					if(this == scenes[3]){
						if(this.ci.y == 0){
							start();
							mouseDisabled = true;
						}
					}

					if(this == scenes[4]){
						if(this.ci.y == 0){
							brain = new Brain(table, 30, 1, (table.ballRadius/3));
							table.angMarkerLen = table.ballRadius*15;
							gameType = "PVC"
							mouseDisabled = true;
						}
						if(this.ci.y == 1){
							brain = new Brain(table, 100, 1, (table.ballRadius*1.25/3));
							table.angMarkerLen = table.ballRadius*10;
							gameType = "PVC"
							mouseDisabled = true;
						}
						if(this.ci.y == 2){
							brain = new Brain(table, 250, 1, (table.ballRadius*1.95/3));
							table.angMarkerLen = table.ballRadius*5;
							gameType = "PVC"
							mouseDisabled = true;
						}
						if(this.ci.y == 3){
							mouseDisabled = true;
						}
					}

					if(this == scenes[5]){
						if(this.ci.y == 0 || this.ci.y == 1){
							mouseDisabled = true;
						}
					}

					if(this == scenes[6]){
						if(this.ci.y == 0){
							start();
							mouseDisabled = true;
						}
						if(this.ci.y == 1){
							mouseDisabled = true;
						}
					}

					if(this == scenes[7]){
						if(this.ci.y == 0){
							mouseDisabled = true;
						}
					}
				}

				return;
			}
		}
	}
}

function Node(x,y,w,h, text, i, j, nextSceneIndex){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;
	this.index = new Vector(i, j);
	this.nextScene = nextSceneIndex;

	this.draw = function(color){
		drawText(color, this.h + "px monospace", text, this.x-this.w/2, this.y-this.h/2);
	}
}

function initScenes(){
	//////STARTING SCREEN
	scenes[0] = new Scene();

	scenes[0].list.push(new Node(canvas.width/2, canvas.height/2-largeFont/2, 
					 measureText("PLAY AGAINST A FRIEND", largeFont, "monospace").width, largeFont, 
					 "PLAY AGAINST A FRIEND", 0,0, 1));
	scenes[0].list.push(new Node(canvas.width/2, canvas.height/2+largeFont/2, 
					 measureText("PLAY AGAINST THE COMPUTER", largeFont, "monospace").width, largeFont, 
					 "PLAY AGAINST THE COMPUTER", 0,1, 4));
	scenes[0].list.push(new Node(canvas.width/2, canvas.height/2+largeFont+largeFont/2, 
					 measureText("GO BACK", largeFont, "monospace").width, largeFont, 
					 "GO BACK", 0,2, 5));


	scenes[0].draw = function(){
		scenes[0].onMouseSelect();

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}

		colorRect(0, 0, canvas.width, canvas.height, 'rgba(18,18,18,0.5)');

		for (var i = 0; i < scenes[0].list.length; i++) {
			scenes[0].list[i].draw("white");
		}

		drawFillTriangle(scenes[0].list[scenes[0].ci.y].x - scenes[0].list[scenes[0].ci.y].w/2 - 10,scenes[0].list[scenes[0].ci.y].y - largeFont,
						 scenes[0].list[scenes[0].ci.y].x - scenes[0].list[scenes[0].ci.y].w/2 - 10,scenes[0].list[scenes[0].ci.y].y - largeFont + 15, 
						 scenes[0].list[scenes[0].ci.y].x - scenes[0].list[scenes[0].ci.y].w/2 - 15,scenes[0].list[scenes[0].ci.y].y - largeFont + 15/2, 'yellow');
		drawFillTriangle(scenes[0].list[scenes[0].ci.y].x - scenes[0].list[scenes[0].ci.y].w/2 - 10, scenes[0].list[scenes[0].ci.y].y - largeFont,
						 scenes[0].list[scenes[0].ci.y].x - scenes[0].list[scenes[0].ci.y].w/2 - 10,scenes[0].list[scenes[0].ci.y].y - largeFont + 15, 
						 scenes[0].list[scenes[0].ci.y].x - scenes[0].list[scenes[0].ci.y].w/2 - 5,scenes[0].list[scenes[0].ci.y].y - largeFont + 15/2, 'yellow');
	}

	scenes[0].onAction = function(input){
		if(input == UP && scenes[0].ci.y > 0){
			scenes[0].ci.y--;
		}

		if(input == DOWN && scenes[0].ci.y < scenes[0].list.length-1){
			scenes[0].ci.y++;
		}

		if(input == ENTER ){
			if(scenes[0].ci.y == 0){
				gameType = "PVP"
				currentScene = scenes[1];
			}

			if(scenes[0].ci.y == 1){
				currentScene = scenes[4];
			}

			if(scenes[0].ci.y == 2){
				currentScene = scenes[5];
			}
		}
	}



	//////PLAYING AGAISNT A FRIEND
	scenes[1] = new Scene();

	scenes[1].draw = function(){
		table.draw();

		drawImageFromSpriteSheetWithRotation(houseImage,0,0,houseImage.width,houseImage.height, 
											canvas.width/2+table.ol/2+table.sideGaps/2, canvas.height/2, 
											table.sideGaps/3, table.sideGaps/3, 0, true);

		table.update();
	}

	scenes[1].onMouseAction = function(){
		//if we are over the home button and are not already moving the pool que
		if(IsPointInRect(new Vector(mouseX,mouseY),canvas.width/2+table.ol/2+table.sideGaps/3, canvas.height/2-houseImage.height/2, table.sideGaps/3,table.sideGaps/3) 
		  && mouseDown == true && prevMouseDown == false){

			currentScene = scenes[6];
			mouseDisabled = true;
		}


		if(table.choosePocket){
			for (var i = 0; i < table.pockets.length; i++) {
				if(distanceOfTwoPoints(table.pockets[i].pos.x,table.pockets[i].pos.y, mouseX,mouseY) < table.pockets[i].r
				   && mouseDown){
					table.currentTurn.pocket = table.pockets[i];
				}
			}
		}

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}

		if(table.choosePocket || mouseDisabled){
			return;
		}	

		if(mouseDown && table.shotMeter.mouseIsOver() == false && table.allBallsAtRest() && table.shotMeter.pullBack <= 0){
			table.shotAng = Math.atan2(mouseY - table.balls[0].pos.y, mouseX - table.balls[0].pos.x) - Math.PI;
			table.shotMeter.pullBack = 0;
			table.mouseMoving = true;
		}else if(mouseDown && table.mouseMoving && table.allBallsAtRest() && table.shotMeter.pullBack <= 0){
			table.shotAng = Math.atan2(mouseY - table.balls[0].pos.y, mouseX - table.balls[0].pos.x) - Math.PI;
			table.shotMeter.pullBack = 0;
		}else{
			table.mouseMoving = false;
		}

		if(mouseDown && table.shotMeter.mouseIsOver() && table.allBallsAtRest() && table.mouseMoving == false){
			table.shotMeter.pullBack = mouseY - table.shotMeter.y;
		}else if(table.shotMeter.pullBack > 0 && mouseDown && table.allBallsAtRest()){
			table.shotMeter.pullBack = mouseY - table.shotMeter.y;
		}

		if(table.shotMeter.pullBack > table.shotMeter.h){
			table.shotMeter.pullBack = table.shotMeter.h;
		}

		if(mouseDown == false && table.shotMeter.pullBack > 0 && table.allBallsAtRest()){
			if(table.shotMeter.shotPower == 0){
				table.shotMeter.shotPower = mapVal(0, table.shotMeter.h, 0, table.shotMeter.maxShot,
												   table.shotMeter.pullBack);
			}
			
			table.shootNow = true;
			table.shooting = true;
		}

		if(table.scratched && mouseDown && table.shotMeter.pullBack == 0){
			if(distanceOfTwoPoints(mouseX, mouseY, table.balls[0].pos.x, table.balls[0].pos.y) < table.ballRadius){
				table.pickedUp = true;
			}
		}else{
			table.pickedUp = false;
		}


		if(mouseDown && table.pickedUp){
			if(mouseX > table.sideGaps+table.inlet+table.ballRadius && mouseX < table.sideGaps+table.inlet+table.il-table.ballRadius &&
			   mouseY > canvas.height/2-table.ih/2+table.ballRadius && mouseY < canvas.height/2+table.ih/2-table.ballRadius){

				if(isBallOverLapping(table.balls, new Ball(mouseX, mouseY, table.ballRadius, 0, "white"), table) == false){
					table.pickedUp = true;
					table.balls[0].pos.x = mouseX;
					table.balls[0].pos.y = mouseY;
				}
			}
		}
	}

	//////PLAYING AGAISNT THE COMPUTER
	scenes[2] = deepCopyObject(scenes[1]);

	scenes[2].draw = function(){
		table.draw();
		table.update();

		if(table.currentTurn == table.p2 && table.nextTurn == false && table.shootNow == false){
			mouseDisabled = true;
			brain.findShotsScore();
			brain.draw();
			brain.shoot();
		}else if(table.shootNow == false && mouseDown == false){
			mouseDisabled = false;
		}

		drawImageFromSpriteSheetWithRotation(houseImage,0,0,houseImage.width,houseImage.height, 
											canvas.width/2+table.ol/2+table.sideGaps/2, canvas.height/2, 
											table.sideGaps/3, table.sideGaps/3, 0, true);
	}


	/////GAME OVER SCREEN
	scenes[3] = new Scene();

	scenes[3].list.push(new Node(canvas.width/2, canvas.height/2+largeFont/2, 
					 measureText("MAIN MENU", largeFont, "monospace").width, largeFont, 
					 "MAIN MENU", 0,0,0));

	scenes[3].draw = function(){
		scenes[3].onMouseSelect();

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}
		
		let textWidth;

		if(gameType == "PVP"){
			if(winner == table.p1){
				textWidth = measureText("PLAYER ONE WINS", largeFont, "monospace").width;
				drawText("white", largeFont + "px monospace", "PLAYER ONE WINS", canvas.width/2-textWidth/2, canvas.height/2-largeFont);
			}
			if(winner == table.p2){
				textWidth = measureText("PLAYER TWO WINS", largeFont, "monospace").width;
				drawText("white", largeFont + "px monospace", "PLAYER TWO WINS", canvas.width/2-textWidth/2, canvas.height/2-largeFont);
			}
		}

		if(gameType == "PVC"){
			if(winner == table.p1){
				textWidth = measureText("YOU WIN", largeFont, "monospace").width;
				drawText("white", largeFont + "px monospace", "YOU WIN", canvas.width/2-textWidth/2, canvas.height/2-largeFont);
			}
			if(winner == table.p2){
				textWidth = measureText("COMPUTER WINS", largeFont, "monospace").width;
				drawText("white", largeFont + "px monospace", "COMPUTER WINS", canvas.width/2-textWidth/2, canvas.height/2-largeFont);
			}
		}

		for (var i = 0; i < scenes[3].list.length; i++) {
			scenes[3].list[i].draw("white");
		}

		drawFillTriangle(scenes[3].list[scenes[3].ci.y].x - scenes[3].list[scenes[3].ci.y].w/2 - 10,scenes[3].list[scenes[3].ci.y].y - largeFont,
						 scenes[3].list[scenes[3].ci.y].x - scenes[3].list[scenes[3].ci.y].w/2 - 10,scenes[3].list[scenes[3].ci.y].y - largeFont + 15, 
						 scenes[3].list[scenes[3].ci.y].x - scenes[3].list[scenes[3].ci.y].w/2 - 15,scenes[3].list[scenes[3].ci.y].y - largeFont + 15/2, 'yellow');
		drawFillTriangle(scenes[3].list[scenes[3].ci.y].x - scenes[3].list[scenes[3].ci.y].w/2 - 10, scenes[3].list[scenes[3].ci.y].y - largeFont,
						 scenes[3].list[scenes[3].ci.y].x - scenes[3].list[scenes[3].ci.y].w/2 - 10,scenes[3].list[scenes[3].ci.y].y - largeFont + 15, 
						 scenes[3].list[scenes[3].ci.y].x - scenes[3].list[scenes[3].ci.y].w/2 - 5,scenes[3].list[scenes[3].ci.y].y - largeFont + 15/2, 'yellow');
	}

	scenes[3].onAction = function(input){
		if(input == ENTER ){
			if(scenes[3].ci.y == 0){
				start();
			}
		}
	}

	scenes[4] = new Scene();

	scenes[4].list.push(new Node(canvas.width/2, canvas.height/2-largeFont-largeFont/2, 
					 measureText("EASY", largeFont, "monospace").width, largeFont, 
					 "EASY", 0,0,2));
	scenes[4].list.push(new Node(canvas.width/2, canvas.height/2-largeFont/2, 
					 measureText("REGULAR", largeFont, "monospace").width, largeFont, 
					 "REGULAR", 0,1,2));
	scenes[4].list.push(new Node(canvas.width/2, canvas.height/2+largeFont/2, 
					 measureText("HARD", largeFont, "monospace").width, largeFont, 
					 "HARD", 0,2,2));
	scenes[4].list.push(new Node(canvas.width/2, canvas.height/2+largeFont+largeFont/2, 
					 measureText("GO BACK", largeFont, "monospace").width, largeFont, 
					 "GO BACK", 0,3,0));

	scenes[4].draw = function(){
		scenes[4].onMouseSelect();

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}

		for (var i = 0; i < scenes[4].list.length; i++) {
			scenes[4].list[i].draw("white");
		}

		drawFillTriangle(scenes[4].list[scenes[4].ci.y].x - scenes[4].list[scenes[4].ci.y].w/2 - 10,scenes[4].list[scenes[4].ci.y].y - largeFont,
						 scenes[4].list[scenes[4].ci.y].x - scenes[4].list[scenes[4].ci.y].w/2 - 10,scenes[4].list[scenes[4].ci.y].y - largeFont + 15, 
						 scenes[4].list[scenes[4].ci.y].x - scenes[4].list[scenes[4].ci.y].w/2 - 15,scenes[4].list[scenes[4].ci.y].y - largeFont + 15/2, 'yellow');
		drawFillTriangle(scenes[4].list[scenes[4].ci.y].x - scenes[4].list[scenes[4].ci.y].w/2 - 10, scenes[4].list[scenes[4].ci.y].y - largeFont,
						 scenes[4].list[scenes[4].ci.y].x - scenes[4].list[scenes[4].ci.y].w/2 - 10,scenes[4].list[scenes[4].ci.y].y - largeFont + 15, 
						 scenes[4].list[scenes[4].ci.y].x - scenes[4].list[scenes[4].ci.y].w/2 - 5,scenes[4].list[scenes[4].ci.y].y - largeFont + 15/2, 'yellow');
	}

	scenes[4].onAction = function(input){
		if(input == UP && scenes[4].ci.y > 0){
			scenes[4].ci.y--;
		}

		if(input == DOWN && scenes[4].ci.y < scenes[4].list.length-1){
			scenes[4].ci.y++;
		}

		if(input == ENTER ){
			if(scenes[4].ci.y == 0){
				brain = new Brain(table, 30, 1, (table.ballRadius/3));
				table.angMarkerLen = table.ballRadius*15;
				gameType = "PVC";
				currentScene = scenes[2];
			}
			if(scenes[4].ci.y == 1){
				brain = new Brain(table, 100, 1, (table.ballRadius*1.25/3));
				table.angMarkerLen = table.ballRadius*10;
				gameType = "PVC";
				currentScene = scenes[2];
			}
			if(scenes[4].ci.y == 2){
				brain = new Brain(table, 200, 1, (table.ballRadius*1.75/3));
				table.angMarkerLen = table.ballRadius*5;
				gameType = "PVC";
				currentScene = scenes[2];
			}
			if(scenes[4].ci.y == 3){
				currentScene = scenes[0];
			}
		}
	}

	//MAIN
	scenes[5] = new Scene();

	scenes[5].list.push(new Node(canvas.width/2, canvas.height/2-largeFont/2, 
				 measureText("PLAY", largeFont, "monospace").width, largeFont, 
				 "PLAY", 0,0,0));
	scenes[5].list.push(new Node(canvas.width/2, canvas.height/2+largeFont/2, 
				 measureText("CONTACT", largeFont, "monospace").width, largeFont, 
				 "CONTACT", 0,1,7));


	scenes[5].draw = function(){
		scenes[5].onMouseSelect();

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}

		textWidth = measureText("POOL", largeFont*3, "monospace").width;
		drawText("white", largeFont*3 + "px monospace", "POOL", canvas.width/2-textWidth/2.2, canvas.height/2-largeFont*3);

		for (var i = 0; i < scenes[5].list.length; i++) {
			scenes[5].list[i].draw("white");
		}

		drawFillTriangle(scenes[5].list[scenes[5].ci.y].x - scenes[5].list[scenes[5].ci.y].w/2 - 10,scenes[5].list[scenes[5].ci.y].y - largeFont,
						 scenes[5].list[scenes[5].ci.y].x - scenes[5].list[scenes[5].ci.y].w/2 - 10,scenes[5].list[scenes[5].ci.y].y - largeFont + 15, 
						 scenes[5].list[scenes[5].ci.y].x - scenes[5].list[scenes[5].ci.y].w/2 - 15,scenes[5].list[scenes[5].ci.y].y - largeFont + 15/2, 'yellow');
		drawFillTriangle(scenes[5].list[scenes[5].ci.y].x - scenes[5].list[scenes[5].ci.y].w/2 - 10, scenes[5].list[scenes[5].ci.y].y - largeFont,
						 scenes[5].list[scenes[5].ci.y].x - scenes[5].list[scenes[5].ci.y].w/2 - 10,scenes[5].list[scenes[5].ci.y].y - largeFont + 15, 
						 scenes[5].list[scenes[5].ci.y].x - scenes[5].list[scenes[5].ci.y].w/2 - 5,scenes[5].list[scenes[5].ci.y].y - largeFont + 15/2, 'yellow');
	}

	scenes[5].onAction = function(input){
		if(input == UP && scenes[5].ci.y > 0){
			scenes[5].ci.y--;
		}

		if(input == DOWN && scenes[5].ci.y < scenes[5].list.length-1){
			scenes[5].ci.y++;
		}

		if(input == ENTER ){
			if(scenes[5].ci.y == 0){
				currentScene = scenes[0];
			}
			if(scenes[5].ci.y == 1){
				currentScene = scenes[7];
			}
		}
	}

	//CONFIRMATION SCREEN TO GO BACK TO MAIN
	scenes[6] = new Scene();

	scenes[6].list.push(new Node(canvas.width/2, canvas.height/2+largeFont/2, 
				 measureText("YES", largeFont, "monospace").width, largeFont, 
				 "YES", 0,0,5));
	scenes[6].list.push(new Node(canvas.width/2, canvas.height/2+largeFont+largeFont/2, 
				 measureText("NO", largeFont, "monospace").width, largeFont, 
				 "NO", 0,1,undefined));


	scenes[6].draw = function(){
		scenes[6].onMouseSelect();

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}

		textWidth = measureText("ARE YOU SURE YOU WANT TO QUIT?", largeFont, "monospace").width;
		drawText("white", largeFont + "px monospace", "ARE YOU SURE YOU WANT TO QUIT?", canvas.width/2-textWidth/2, canvas.height/2-largeFont);

		for (var i = 0; i < scenes[6].list.length; i++) {
			scenes[6].list[i].draw("white");
		}

		drawFillTriangle(scenes[6].list[scenes[6].ci.y].x - scenes[6].list[scenes[6].ci.y].w/2 - 10,scenes[6].list[scenes[6].ci.y].y - largeFont,
						 scenes[6].list[scenes[6].ci.y].x - scenes[6].list[scenes[6].ci.y].w/2 - 10,scenes[6].list[scenes[6].ci.y].y - largeFont + 15, 
						 scenes[6].list[scenes[6].ci.y].x - scenes[6].list[scenes[6].ci.y].w/2 - 15,scenes[6].list[scenes[6].ci.y].y - largeFont + 15/2, 'yellow');
		drawFillTriangle(scenes[6].list[scenes[6].ci.y].x - scenes[6].list[scenes[6].ci.y].w/2 - 10, scenes[6].list[scenes[6].ci.y].y - largeFont,
						 scenes[6].list[scenes[6].ci.y].x - scenes[6].list[scenes[6].ci.y].w/2 - 10,scenes[6].list[scenes[6].ci.y].y - largeFont + 15, 
						 scenes[6].list[scenes[6].ci.y].x - scenes[6].list[scenes[6].ci.y].w/2 - 5,scenes[6].list[scenes[6].ci.y].y - largeFont + 15/2, 'yellow');
	}

	scenes[6].onAction = function(input){
		if(input == UP && scenes[6].ci.y > 0){
			scenes[6].ci.y--;
		}

		if(input == DOWN && scenes[6].ci.y < scenes[6].list.length-1){
			scenes[6].ci.y++;
		}

		if(input == ENTER ){
			if(scenes[6].ci.y == 0){
				currentScene = scenes[5];
				start();
			}
			if(scenes[6].ci.y == 1){
				currentScene = prevScene;
			}
		}
	}


	scenes[7] = new Scene();

	scenes[7].list.push(new Node(canvas.width/2, canvas.height/2+largeFont+largeFont/2, 
				 measureText("GO BACK", largeFont, "monospace").width, largeFont, 
				 "GO BACK", 0,0,5));


	scenes[7].draw = function(){
		scenes[7].onMouseSelect();

		if(mouseDisabled == true && mouseDown == false){
			mouseDisabled = false;
		}

		textWidth = measureText("EMAIL ANY FEEDBACK TO:", largeFont, "monospace").width;
		drawText("white", largeFont + "px monospace", "EMAIL ANY FEEDBACK TO:", canvas.width/2-textWidth/2, canvas.height/2-largeFont*2);

		textWidth = measureText("john.mitchell.web@gmail.com", largeFont, "monospace").width;
		drawText("white", largeFont + "px monospace", "john.mitchell.web@gmail.com", canvas.width/2-textWidth/1.5, canvas.height/2-largeFont);


		for (var i = 0; i < scenes[7].list.length; i++) {
			scenes[7].list[i].draw("white");
		}

		drawFillTriangle(scenes[7].list[scenes[7].ci.y].x - scenes[7].list[scenes[7].ci.y].w/2 - 10,scenes[7].list[scenes[7].ci.y].y - largeFont,
						 scenes[7].list[scenes[7].ci.y].x - scenes[7].list[scenes[7].ci.y].w/2 - 10,scenes[7].list[scenes[7].ci.y].y - largeFont + 15, 
						 scenes[7].list[scenes[7].ci.y].x - scenes[7].list[scenes[7].ci.y].w/2 - 15,scenes[7].list[scenes[7].ci.y].y - largeFont + 15/2, 'yellow');
		drawFillTriangle(scenes[7].list[scenes[7].ci.y].x - scenes[7].list[scenes[7].ci.y].w/2 - 10, scenes[7].list[scenes[7].ci.y].y - largeFont,
						 scenes[7].list[scenes[7].ci.y].x - scenes[7].list[scenes[7].ci.y].w/2 - 10,scenes[7].list[scenes[7].ci.y].y - largeFont + 15, 
						 scenes[7].list[scenes[7].ci.y].x - scenes[7].list[scenes[7].ci.y].w/2 - 5,scenes[7].list[scenes[7].ci.y].y - largeFont + 15/2, 'yellow');
	}

	scenes[7].onAction = function(input){
		if(input == UP && scenes[7].ci.y > 0){
			scenes[7].ci.y--;
		}

		if(input == DOWN && scenes[7].ci.y < scenes[7].list.length-1){
			scenes[7].ci.y++;
		}

		if(input == ENTER ){
			if(scenes[7].ci.y == 0){
				currentScene = scenes[5];
			}
		}
	}

}


