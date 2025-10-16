function Player(id){
	this.id = id;
	this.ballType;
	this.pocket;
	this.ballsLeft = 8;
}

function HandleTurn(refTable){
	let ballsSunk = [];

	if(refTable.currentTurn == refTable.p1){
		ballsSunk = getBallsSunk(refTable.prevBalls, refTable.balls);
		handleBallInfoAfterShot(refTable.currentTurn, refTable.p2, ballsSunk, refTable);

	}else{
		
		ballsSunk = getBallsSunk(refTable.prevBalls, refTable.balls);
		handleBallInfoAfterShot(refTable.currentTurn, refTable.p1, ballsSunk, refTable);
	}


	refTable.prevBalls = deepCopy(refTable.balls);
	refTable.turn++;
}


function handleBallInfoAfterShot(player, oponent, ballsSunk, refTable){
	if(refTable.turn != 0 && refTable.currentTurn.ballType == undefined && 
		ballsSunk.length > 0 && ballsSunk[0].color != "white" && ballsSunk[0].color != "black"){

		refTable.currentTurn.ballType = ballsSunk[0].color;

		if(ballsSunk[0].color == "#900C3F"){
			oponent.ballType = "#FFC300";
		}else{
			oponent.ballType = "#900C3F"
		}
	}

	let hitBallOfSameColorIn = false;

	//how many balls r left for the player
	if(player.ballType){
		player.ballsLeft = 0;
		for (var i = 0; i < refTable.balls.length; i++) {
			if(refTable.balls[i].color == player.ballType){
				player.ballsLeft++;
			}

			if(refTable.balls[i].color == "black"){
				player.ballsLeft++;
			}
		}

		//if the player knocked in the 8 ball and another in one turn 
		if(player.ballsLeft == 0 && ballsSunk.length > 1){
			winner = oponent;
			currentScene = scenes[3];
			return;
		}

		if(player.ballsLeft == 0 && ballsSunk.length == 1){
			winner = player;
			currentScene = scenes[3];

			//if they scratched on the last shot
			for (var i = 0; i < ballsSunk.length; i++) {
				if(ballsSunk[i].color == "white"){
					winner = oponent;
					currentScene = scenes[3];
				}
			}

			return;
		}
	}

	
	for (var i = 0; i < ballsSunk.length; i++) {
		if(ballsSunk[i].color == player.ballType || 
		(ballsSunk[i].color != "black" && ballsSunk[i].color != "white" && player.ballType == undefined)){

			refTable.currentTurn = player;
			hitBallOfSameColorIn = true;
		}


		if(ballsSunk[i].color == "white"){
			//there is a scratch ball

			//places it where there are no balls
			let whiteBall = new Ball(canvas.width/2+refTable.il/4, canvas.height/2, refTable.ballRadius, 0, "white");
			
			while(isBallOverLapping(refTable.balls, whiteBall, refTable)){
				whiteBall.pos.x = Math.random()*refTable.il+refTable.sideGaps+refTable.inlet;
				whiteBall.pos.y = Math.random()*refTable.ih+canvas.height/2-refTable.ih/2;
			}

			insertAt(refTable.balls, 0, [whiteBall]);
			refTable.scratched = true;
		}

		if(ballsSunk[i].color == "black"){
			winner = oponent;
			currentScene = scenes[3];
			return;
		}
	}

	if(hitBallOfSameColorIn == false){
		refTable.currentTurn = oponent;
	}

	if(refTable.scratched == true){
		refTable.currentTurn = oponent;
	}

}	

function isBallOverLapping(balls, ball, refTable){
	let invalidSpot = false;

	for (var i = 0; i < balls.length; i++) {
		if(distanceOfTwoPoints(balls[i].pos.x, balls[i].pos.y, ball.pos.x, ball.pos.y) <= refTable.ballRadius*2.25
		   && ball.id != balls[i].id){
			invalidSpot = true;
		}
	}

	if(invalidSpot){
		return true;
	}

	return false;
}	

function getBallsSunk(prevBalls, balls){
	let ballsSunk = [];

	for (var i = 0; i < prevBalls.length; i++) {
		let sunk = true;

		for (var j = 0; j < balls.length; j++) {
			if(prevBalls[i].id == balls[j].id){
				sunk = false;
			}
		}

		if(sunk){
			ballsSunk.push(prevBalls[i]);
		}
	}

	return ballsSunk;
}


