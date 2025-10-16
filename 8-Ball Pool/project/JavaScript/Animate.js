function STRIPED(){
	 this.north_perp = new BallImage(1, Math.PI/2, new Vector(0,16), 0);
	 this.south_perp = new BallImage(1, 3*Math.PI/2, new Vector(0,48), 0);
	 this.east_perp = new BallImage(1, 0, new Vector(0,16), Math.PI/2);
	 this.west_perp = new BallImage(1, Math.PI, new Vector(0,48), Math.PI/2);

	 this.horizontal = new BallImage(0, Infinity, new Vector(0,32), 0);
	 this.vertical = new BallImage(0, Infinity, new Vector(0,32), -Math.PI/2);

	 this.diagonalLeft = new BallImage(0, Infinity, new Vector(16,32), -Math.PI/2);
	 this.diagonalRight = new BallImage(0, Infinity, new Vector(16,32), 0);

	 this.northWest = new BallImage(0, 3*Math.PI/4, new Vector(16,16), 0);
	 this.northEast = new BallImage(0, Math.PI/4, new Vector(16,16), Math.PI/2);
	 this.southEast = new BallImage(0, 7*Math.PI/4, new Vector(16,48), 0);
	 this.southWest = new BallImage(0, 5*Math.PI/4, new Vector(16,48), Math.PI/2);

	 this.blank = new BallImage(2, Infinity, new Vector(0,0), 0);

	 this.NORTH_ANIMATION = {a:[this.horizontal, this.north_perp, this.south_perp], ang:3*Math.PI/2};
	 this.SOUTH_ANIMATION = {a:[this.horizontal, this.south_perp, this.north_perp], ang:Math.PI/2};
	 this.EAST_ANIMATION = {a:[this.vertical, this.east_perp, this.west_perp], ang:0};
	 this.WEST_ANIMATION = {a:[this.vertical, this.west_perp, this.east_perp], ang:Math.PI};

	 this.NORTHWEST_ANIMATION = {a:[this.diagonalRight, this.northWest, this.southEast], ang:5*Math.PI/4};
	 this.NORTHEAST_ANIMATION = {a:[this.diagonalLeft, this.northEast, this.southWest], ang:7*Math.PI/4};
	 this.SOUTHEAST_ANIMATION = {a:[this.diagonalRight, this.southEast, this.northWest], ang:Math.PI/4};
	 this.SOUTHWEST_ANIMATION = {a:[this.diagonalLeft, this.southWest, this.northEast], ang:3*Math.PI/4};

	 this.ANIMATIONS = [this.NORTH_ANIMATION, this.SOUTH_ANIMATION, 
	 					this.EAST_ANIMATION, this.WEST_ANIMATION,
						this.NORTHWEST_ANIMATION, this.NORTHEAST_ANIMATION, 
						this.SOUTHEAST_ANIMATION, this.SOUTHWEST_ANIMATION];
}

function SOLID(){
	 this.north_perp = new BallImage(1, Math.PI/2, new Vector(16,0), Math.PI/2);
	 this.south_perp = new BallImage(1, 3*Math.PI/2, new Vector(16,0), -Math.PI/2);
	 this.east_perp = new BallImage(1, 0, new Vector(16,0), Math.PI);
	 this.west_perp = new BallImage(1, Math.PI, new Vector(16,0), 0);

	 this.center = new BallImage(0, Infinity, new Vector(32,32), 0);

	 this.northWest = new BallImage(0, 3*Math.PI/4, new Vector(32,0), -Math.PI/2);
	 this.northEast = new BallImage(0, Math.PI/4, new Vector(32,0), 0);
	 this.southEast = new BallImage(0, 7*Math.PI/4, new Vector(32,0), Math.PI/2);
	 this.southWest = new BallImage(0, 5*Math.PI/4, new Vector(32,0), Math.PI);

	 this.NORTH_ANIMATION = {a:[this.center, this.north_perp, this.south_perp], ang:3*Math.PI/2};
	 this.SOUTH_ANIMATION = {a:[this.center, this.south_perp, this.north_perp], ang:Math.PI/2};
	 this.EAST_ANIMATION = {a:[this.center, this.east_perp, this.west_perp], ang:0};
	 this.WEST_ANIMATION = {a:[this.center, this.west_perp, this.east_perp], ang:Math.PI};

	 this.NORTHWEST_ANIMATION = {a:[this.center, this.northWest, this.southEast], ang:5*Math.PI/4};
	 this.NORTHEAST_ANIMATION = {a:[this.center, this.northEast, this.southWest], ang:7*Math.PI/4};
	 this.SOUTHEAST_ANIMATION = {a:[this.center, this.southEast, this.northWest], ang:Math.PI/4};
	 this.SOUTHWEST_ANIMATION = {a:[this.center, this.southWest, this.northEast], ang:3*Math.PI/4};

	 this.ANIMATIONS = [this.NORTH_ANIMATION, this.SOUTH_ANIMATION, 
	 					this.EAST_ANIMATION, this.WEST_ANIMATION,
						this.NORTHWEST_ANIMATION, this.NORTHEAST_ANIMATION, 
						this.SOUTHEAST_ANIMATION, this.SOUTHWEST_ANIMATION];
}

function BLACK(){
	 this.north_perp = new BallImage(1, Math.PI/2, new Vector(16,64), Math.PI/2);
	 this.south_perp = new BallImage(1, 3*Math.PI/2, new Vector(16,64), -Math.PI/2);
	 this.east_perp = new BallImage(1, 0, new Vector(16,64), Math.PI);
	 this.west_perp = new BallImage(1, Math.PI, new Vector(16,64), 0);

	 this.center = new BallImage(0, Infinity, new Vector(0,64), 0);

	 this.northWest = new BallImage(0, 3*Math.PI/4, new Vector(48,0), -Math.PI/2);
	 this.northEast = new BallImage(0, Math.PI/4, new Vector(48,0), 0);
	 this.southEast = new BallImage(0, 7*Math.PI/4, new Vector(48,0), Math.PI/2);
	 this.southWest = new BallImage(0, 5*Math.PI/4, new Vector(48,0), Math.PI);

	 this.NORTH_ANIMATION = {a:[this.center, this.north_perp, this.south_perp], ang:3*Math.PI/2};
	 this.SOUTH_ANIMATION = {a:[this.center, this.south_perp, this.north_perp], ang:Math.PI/2};
	 this.EAST_ANIMATION = {a:[this.center, this.east_perp, this.west_perp], ang:0};
	 this.WEST_ANIMATION = {a:[this.center, this.west_perp, this.east_perp], ang:Math.PI};

	 this.NORTHWEST_ANIMATION = {a:[this.center, this.northWest, this.southEast], ang:5*Math.PI/4};
	 this.NORTHEAST_ANIMATION = {a:[this.center, this.northEast, this.southWest], ang:7*Math.PI/4};
	 this.SOUTHEAST_ANIMATION = {a:[this.center, this.southEast, this.northWest], ang:Math.PI/4};
	 this.SOUTHWEST_ANIMATION = {a:[this.center, this.southWest, this.northEast], ang:3*Math.PI/4};

	 this.ANIMATIONS = [this.NORTH_ANIMATION, this.SOUTH_ANIMATION, 
	 					this.EAST_ANIMATION, this.WEST_ANIMATION,
						this.NORTHWEST_ANIMATION, this.NORTHEAST_ANIMATION, 
						this.SOUTHEAST_ANIMATION, this.SOUTHWEST_ANIMATION];
}

var striped = new STRIPED();
var solid = new SOLID();
var black = new BLACK();


function animateBalls(balls){
	for (var i = 0; i < balls.length; i++) {
			if(balls[i].color == "white"){ continue; }

			let ang = Math.atan2(balls[i].vel.y, balls[i].vel.x);
			ang = getTerminalAngle(ang);
			let dir = getDirFromAng(ang);

			if(balls[i].timeLeftTillNextImage > 0 && dir == balls[i].prevDir){
				balls[i].timeLeftTillNextImage -= elaspedTime;
				continue;
			}

			balls[i].prevDir = dir;

			//the faster the ball is going the quicker we need to change images
			let velMag = distanceOfTwoPoints(balls[i].vel.x, balls[i].vel.y, 0,0);

			if(table.currentTurn.id == 1 && gameType == "PVC"){
				balls[i].timeLeftTillNextImage = 0.05*(1/velMag);
			}else{
				balls[i].timeLeftTillNextImage = 5*(1/velMag);
			}


			if(velMag == 0){
				//there is nothing to animate
				balls[i].timeLeftTillNextImage = 0;
				continue;
			}

			balls[i].img = getNextBallImage(dir, balls[i]);

			balls[i].animationIndex++;
			if(balls[i].animationIndex > striped.ANIMATIONS[0].a.length-1){
				balls[i].animationIndex = 0;
			}
	}
}

function getNextBallImage(ang, ball){
	let animation = undefined;

	if(ball.color == RED){
		for (var i = 0; i < striped.ANIMATIONS.length; i++) {
			if(striped.ANIMATIONS[i].ang == ang){
				animation = striped.ANIMATIONS[i];
			}
		}
	}

	if(ball.color == YELLOW){
		for (var i = 0; i < solid.ANIMATIONS.length; i++) {
			if(solid.ANIMATIONS[i].ang == ang){
				animation = solid.ANIMATIONS[i];
			}
		}
	}

	if(ball.color == "black"){
		for (var i = 0; i < black.ANIMATIONS.length; i++) {
			if(black.ANIMATIONS[i].ang == ang){
				animation = black.ANIMATIONS[i];
			}
		}
	}

	if(animation){
		return animation.a[ball.animationIndex];
	}
}


function getTerminalAngle(ang){
	while(ang > 2*Math.PI){
		ang -= 2*Math.PI;
	}
	while(ang < 0){
		ang += 2*Math.PI;
	}
	return ang;
}


function getDirFromAng(ang){
	//East
	if(ang <= Math.PI/12 || ang >= 23*Math.PI/12){
		return 0;
	}
	//West
	if(ang <= Math.PI+Math.PI/12 && ang >= Math.PI-Math.PI/12){
		return Math.PI;
	}
	//North
	if(ang <= Math.PI/2+Math.PI/12 && ang >= Math.PI/2-Math.PI/12){
		return Math.PI/2;
	}
	//South
	if(ang <= 3*Math.PI/2+Math.PI/12 && ang >= 3*Math.PI/2-Math.PI/12){
		return 3*Math.PI/2;
	}
	//North East
	if(ang < Math.PI/2-Math.PI/12 && ang > Math.PI/12){
		return Math.PI/4;
	}
	//North West
	if(ang < Math.PI-Math.PI/12 && ang > Math.PI/2+Math.PI/12){
		return 3*Math.PI/4;
	}
	//South West
	if(ang < 3*Math.PI/2-Math.PI/12 && ang > Math.PI+Math.PI/12){
		return 5*Math.PI/4;
	}
	//South East
	if(ang < 23*Math.PI/12 && ang > 3*Math.PI/2+Math.PI/12){
		return 7*Math.PI/4;
	}
}


