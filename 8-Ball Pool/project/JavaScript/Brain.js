// this is dope keep it up :)

function Brain(refTable, numAngles, numSpeeds, speed){
	this.shots = [];
	this.aiming = false;

	this.numAngles = numAngles;
	this.numSpeeds = numSpeeds;

	this.angMeasure = (2*Math.PI) / this.numAngles;

	this.shotMeasure = speed / numSpeeds; //(refTable.ballRadius*1.5/3);
	this.numShots = this.numAngles * this.numSpeeds;
	this.refTable = refTable;

	this.angIndex = 0;
	this.speedIndex = 1;

	this.shotAngs = [];

	this.findShotsScore = function(){
		if(this.aiming) return;

		let tempTable = new Table();

		tempTable.balls = deepCopy(this.refTable.balls);
		tempTable.prevBalls = deepCopy(this.refTable.prevBalls);
		tempTable.currentTurn = this.refTable.currentTurn;

		tempTable.shotMeter.shotPower = this.shotMeasure * this.speedIndex;
		tempTable.shotAng = this.angMeasure * this.angIndex;
		tempTable.shoot();

		while(tempTable.allBallsAtRest() == false){
			handleBallBallCollision(this.refTable.pockets, tempTable.balls, this.refTable.innerLines, true, 2, "CPU");
		}

		let score = getScoreFromTable(tempTable, tempTable.shotAng, refTable.currentTurn.ballType);

		if(refTable.currentTurn.ballType == undefined){
			let s1 = getScoreFromTable(tempTable, tempTable.shotAng, YELLOW);
			let s2 = getScoreFromTable(tempTable, tempTable.shotAng, RED);

			score = Math.max(s1, s2);
		}

		this.shots.push({ang:tempTable.shotAng, p:tempTable.shotMeter.shotPower, s:score, t:tempTable});

		this.speedIndex++;

		if(this.speedIndex >= this.numSpeeds+1){
			this.angIndex++;
			this.speedIndex = 1;
		}
	}

	this.draw = function(){
		if(this.aiming) return;
		colorRect(0, 0, canvas.width, canvas.height, 'rgba(18,18,18,0.75)');
		let textWidth = measureText("COMPUTER IS FINDING BEST MOVE", largeFont, "monospace").width;
		colorNoFillRect(canvas.width/2-textWidth/2, canvas.height/2+3, textWidth, largeFont/2, "white");
		colorRect(canvas.width/2-textWidth/2, canvas.height/2+3, (this.shots.length / this.numShots)*textWidth, largeFont/2, "white")
		drawText("rgb(255,255,255)", largeFont + "px monospace", "COMPUTER IS FINDING BEST MOVE", canvas.width/2-textWidth/2, canvas.height/2-largeFont);
	}

	this.shoot = async function(){
		
		if(this.shots.length >= this.numShots){
			this.shots.sort(function(a, b){return b.s - a.s});
			let shot = this.shots[0];
			this.refTable.shotAng = shot.ang;
			this.refTable.getPathOfCurrentAng();
			this.aiming = true;

			await new Promise(res => setTimeout(res, 500));

			this.aiming = false;
			this.refTable.shootNow = true;
			this.refTable.shotMeter.shotPower = shot.p;
			this.refTable.shotMeter.pullBack = 500;
			// this.nextTurn = true;
			this.angIndex = 0;
			this.speedIndex = 1;
			this.shots = [];
		}
	}

}


function getScoreFromTable(refTable, ang, colorToPick){
	let sunkBalls = getBallsSunk(refTable.prevBalls, refTable.balls);
	let score = 0;
	// let numOfRefTableBallsLeft;
	let prevNumOfRefTableBallsLeft;
	let oponentColor;

	// console.log("ANG " + ang)

	if(refTable.currentTurn.ballType == RED){
		// numOfRefTableBallsLeft = refTable.redBallsLeft();
		prevNumOfRefTableBallsLeft = refTable.redBallsLeft(refTable.prevBalls);
		oponentColor = YELLOW;
	}

	if(refTable.currentTurn.ballType == YELLOW){
		// numOfRefTableBallsLeft = refTable.yellowBallsLeft();
		prevNumOfRefTableBallsLeft = refTable.yellowBallsLeft(refTable.prevBalls);
		oponentColor == RED;
	}

	for (var i = 0; i < sunkBalls.length; i++) {
		if(sunkBalls[i].color == colorToPick){
			score += 100;
		}

		if(sunkBalls[i].color == oponentColor){
			score -= 200;
		}

		if(prevNumOfRefTableBallsLeft > 0 && sunkBalls[i].color == "black"){
			score -= Infinity;
		}

		if(sunkBalls[i].color == "black" && prevNumOfRefTableBallsLeft == 0){
			score += 1000;
		}

		if(sunkBalls[i].color == "white"){
			score -= 5000;
		}	
	}


	for (var j = 0; j < refTable.pockets.length; j++) {
		for (var i = 0; i < refTable.balls.length; i++) {
			if(refTable.balls[i].color == colorToPick){
				score +=  1 / distanceOfTwoPoints(refTable.pockets[j].pos.x, refTable.pockets[j].pos.y,
												  refTable.balls[i].pos.x, refTable.balls[i].pos.y);
			}

			if(refTable.balls[i].color == "black" && prevNumOfRefTableBallsLeft == 0){
				score +=  1 / distanceOfTwoPoints(refTable.pockets[j].pos.x, refTable.pockets[j].pos.y,
												  refTable.balls[i].pos.x, refTable.balls[i].pos.y);
			}

			if(refTable.balls[i].color == oponentColor){
				score -=  1 / distanceOfTwoPoints(refTable.pockets[j].pos.x, refTable.pockets[j].pos.y,
												  refTable.balls[i].pos.x, refTable.balls[i].pos.y);
			}
		}
	}

	return score;

}

// so what I want to do is see if I made the 8 ball in in one shot
// so what I have to see is if the prev number of balls is zero or 


