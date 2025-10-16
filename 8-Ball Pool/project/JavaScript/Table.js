function Table(type){
	if(canvas.height > canvas.width){	this.orientation = 1;	};
	this.lines = [];
	this.innerLines = [];
	this.balls = [];
	this.prevBalls = [];
	this.pockets = [];

	this.p1 = new Player(0);
	this.p2 = new Player(1);
	this.currentTurn = this.p1;
	this.nextTurn;
	this.turn = 0;
	this.scratched = false;
	this.pickedUp = false;
	this.mouseMoving = false;
	this.winner = undefined;
	this.choosePocket = false;

	this.shotAng = 0;
	this.shotPath = [];
	this.shootNow = false;

	this.sideGaps = canvas.width/10;
	this.ol = canvas.width - this.sideGaps*2;
	this.oh = this.ol * 150 / 262;

	while(this.oh > canvas.height){
		this.ol--;
		this.oh = this.ol * 150 / 262;
	}


	while(this.sideGaps*2 + this.ol < canvas.width){
		this.sideGaps++;
	}

	this.inlet = this.ol * 19 / 262;
	this.il = this.ol - this.inlet*2;
	this.ih = this.oh - this.inlet*2;

	this.markerGapsX = this.il / 8;
	this.markerGapsY = this.ih / 4;
	this.markerWidth = 5;
	this.poolQueLen = this.ol / 1.75;

	this.cornerPockeyRadius = (this.ol / 2.54) * 4.5 / 79;
	this.ballRadius = this.ol * 3.15 / 262;

	this.angMarkerLen = this.ballRadius*10;

	this.shotMeter = new ShotMeter(this);
	this.playerMeters = new PlayerMeters(this);

	//outer lines
	this.lines.push(new LineSegment(this.sideGaps, canvas.height/2 - this.oh/2, this.ol+this.sideGaps, canvas.height/2 - this.oh/2, lineRadii));
	this.lines.push(new LineSegment(this.ol+this.sideGaps, canvas.height/2 - this.oh/2, this.ol+this.sideGaps, canvas.height/2 + this.oh/2, lineRadii));
	this.lines.push(new LineSegment(this.ol+this.sideGaps, canvas.height/2 + this.oh/2, this.sideGaps, canvas.height/2 + this.oh/2, lineRadii));
	this.lines.push(new LineSegment(this.sideGaps, canvas.height/2 + this.oh/2, this.sideGaps, canvas.height/2 - this.oh/2, lineRadii));

	//inner lines

	//top
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2, canvas.height/2-this.ih/2, this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2-this.ih/2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2-this.ih/2, this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2, canvas.height/2-this.ih/2, lineRadii));
	//right
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet, canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2, this.sideGaps+this.il+this.inlet, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2, lineRadii));
	//bottom
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2+this.ih/2, this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2, canvas.height/2 + this.ih/2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2, canvas.height/2+this.ih/2, this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2 + this.ih/2, lineRadii));
	//left
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2, this.sideGaps+this.inlet, canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2, lineRadii));
	// console.log(this.innerLines.length-1)

	//top left pocket
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2, canvas.height/2-this.ih/2,
		  			     this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2-this.ih/2-Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
		// console.log(this.innerLines.length-1)
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet, canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2,
		  			     this.sideGaps+this.inlet+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2-Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2-this.ih/2-Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2,
		  			     this.sideGaps+this.inlet+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2-Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));

	//top right pocket
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2, canvas.height/2-this.ih/2,
		  			     this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2-this.ih/2-Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
		
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet, canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2,
					     this.sideGaps+this.il+this.inlet+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2,canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2-Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2,canvas.height/2-this.ih/2+this.cornerPockeyRadius+lineRadii*2-Math.sin(Math.PI/4)*this.cornerPockeyRadius*2,
		  			     this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2-this.ih/2-Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));

	//bottom right pocket
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2, 
						 this.sideGaps+this.il+this.inlet+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2+Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));	
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2, canvas.height/2+this.ih/2, 
						 this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2+Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il+this.inlet+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2+Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, 
						 this.sideGaps+this.il+this.inlet-this.cornerPockeyRadius-lineRadii*2+Math.cos(Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2+Math.sin(Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));

	//bottom left pocket
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2, canvas.height/2+this.ih/2,
		  			     this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2+Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2,
		  			     this.sideGaps+this.inlet+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2+Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.inlet+this.cornerPockeyRadius+lineRadii*2+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2+Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2,
		  			     this.sideGaps+this.inlet+Math.cos(3*Math.PI/4)*this.cornerPockeyRadius*2, canvas.height/2+this.ih/2-this.cornerPockeyRadius-lineRadii*2+Math.sin(3*Math.PI/4)*this.cornerPockeyRadius*2, lineRadii));

	//top middle pocket
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2-this.ih/2, this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2-this.ih/2-this.cornerPockeyRadius-lineRadii*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2-this.ih/2, this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2-this.ih/2-this.cornerPockeyRadius-lineRadii*2, lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2-this.ih/2-this.cornerPockeyRadius-lineRadii*2, this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2-this.ih/2-this.cornerPockeyRadius-lineRadii*2, lineRadii));

	//bottom middle pocket
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2+this.ih/2+this.cornerPockeyRadius+lineRadii*2, this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2+this.ih/2,lineRadii));
	
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2+this.ih/2+this.cornerPockeyRadius+lineRadii*2, this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2+this.ih/2,lineRadii));
	this.innerLines.push(new LineSegment(this.sideGaps+this.il/2+this.inlet+this.cornerPockeyRadius, canvas.height/2+this.ih/2+this.cornerPockeyRadius+lineRadii*2, this.sideGaps+this.il/2+this.inlet-this.cornerPockeyRadius, canvas.height/2+this.ih/2+this.cornerPockeyRadius+lineRadii*2,lineRadii));

	//pockets
	this.pockets.push(new Ball(this.sideGaps+this.inlet,canvas.height/2-this.ih/2,this.cornerPockeyRadius));
	this.pockets.push(new Ball(this.sideGaps+this.inlet,canvas.height/2+this.ih/2,this.cornerPockeyRadius));
	this.pockets.push(new Ball(this.sideGaps+this.inlet+this.il,canvas.height/2-this.ih/2,this.cornerPockeyRadius));
	this.pockets.push(new Ball(this.sideGaps+this.inlet+this.il,canvas.height/2+this.ih/2,this.cornerPockeyRadius));

	this.pockets.push(new Ball(this.sideGaps+this.inlet+this.il/2,canvas.height/2-this.ih/2-this.cornerPockeyRadius*0.9/3,this.cornerPockeyRadius*0.9));
	this.pockets.push(new Ball(this.sideGaps+this.inlet+this.il/2,canvas.height/2+this.ih/2+this.cornerPockeyRadius*0.9/3,this.cornerPockeyRadius*0.9));

	//balls on the table
	let gapRY = this.ballRadius+0.1;
	let gapRX = this.ballRadius-2;
	this.balls.push(new Ball(canvas.width/2 + this.il/4, canvas.height/2, this.ballRadius, 0, "white"));
	this.balls.push(new Ball(canvas.width/2 - this.il/4, canvas.height/2, this.ballRadius, 1, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*4, canvas.height/2, this.ballRadius, 2, "black"));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*8, canvas.height/2, this.ballRadius, 3, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*4, canvas.height/2-gapRY*2, this.ballRadius, 4, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*4, canvas.height/2+gapRY*2, this.ballRadius, 5, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*2, canvas.height/2+gapRY, this.ballRadius, 6, RED));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*2, canvas.height/2-gapRY, this.ballRadius, 7, RED));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*6, canvas.height/2-gapRY, this.ballRadius, 8, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*6, canvas.height/2+gapRY, this.ballRadius, 9, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*6, canvas.height/2+gapRY*3, this.ballRadius, 10, RED));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*6, canvas.height/2-gapRY*3, this.ballRadius, 11, RED));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*8, canvas.height/2-gapRY*2, this.ballRadius, 12, RED));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*8, canvas.height/2+gapRY*2, this.ballRadius, 13, RED));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*8, canvas.height/2-gapRY*4, this.ballRadius, 14, YELLOW));
	this.balls.push(new Ball(canvas.width/2 - this.il/4 - gapRX*8, canvas.height/2+gapRY*4, this.ballRadius, 15, RED));

	this.prevBalls = deepCopy(this.balls);

	this.yellowBallsLeft = function(refBalls){
		if(refBalls == undefined){
			refBalls = this.balls;
		}

		let count = 0;
		for (var i = 0; i < refBalls.length; i++) {
			if(refBalls[i].color == YELLOW){
				count++;
			}
		}
		return count;
	}

	this.redBallsLeft = function(refBalls){
		if(refBalls == undefined){
			refBalls = this.balls;
		}

		let count = 0;
		for (var i = 0; i < refBalls.length; i++) {
			if(refBalls[i].color == RED){
				count++;
			}
		}
		return count;
	}

	this.allBallsAtRest = function(){
		for (var i = 0; i < this.balls.length; i++) {
			if(this.balls[i].vel.x != 0 || this.balls[i].vel.y != 0){
				return false;
			}
		}
		return true;
	}

	this.setAllBallsTimeToZero = function(){
		for (var i = 0; i < this.balls.length; i++) {
			this.balls[i].timeLeftTillNextImage = 0;
		}
	}

	this.update = function(){
		let ballsAtRest = this.allBallsAtRest();

		if(ballsAtRest && this.shotMeter.pullBack == 0 && this.pickedUp == false){
			this.getPathOfCurrentAng();
		}

		if(this.shootNow){
			this.shoot(true);
			ballsAtRest = false;
		}

		if(ballsAtRest == false){
			animateBalls(this.balls);

			if(this.currentTurn.id == 1 && gameType == "PVC"){
				handleBallBallCollision(this.pockets, this.balls, this.innerLines, true, 2, "CPU");
			}else{
				handleBallBallCollision(this.pockets, this.balls, this.innerLines, true, 10);
			}
		}

		if(ballsAtRest && this.nextTurn && this.shootNow == false){
			this.setAllBallsTimeToZero();
			this.nextTurn = false;
			HandleTurn(this);
		}
	}

	this.shoot = function(animate){
		if(animate){
			this.scratched = false;
			mouseDisabled = true;
			if(this.shotMeter.pullBack <= -this.ballRadius*3 + this.ballRadius){
				this.shootNow = false;
				mouseDisabled = false;

				this.balls[0].vel.x = -this.shotMeter.shotPower*Math.cos(this.shotAng);
				this.balls[0].vel.y = -this.shotMeter.shotPower*Math.sin(this.shotAng);
				this.nextTurn = true;

				this.shotMeter.pullBack = 0;
				this.shotMeter.shotPower = 0;
			}else{
				this.shotMeter.pullBack -= 20;
			}		
		}else{
			this.balls[0].vel.x = -this.shotMeter.shotPower*Math.cos(this.shotAng);
			this.balls[0].vel.y = -this.shotMeter.shotPower*Math.sin(this.shotAng);
		}	
	}

	this.getPathOfCurrentAng = function(){
		let vel = this.ballRadius/100;
		let bounce = 0;
		let iterations = 0;
		let currentAng = this.shotAng;
		let prevOutcome = undefined;

		//make updated array with new balls
		let castedQueBallAndThisBalls = deepCopy(this.balls);
		insertAt(castedQueBallAndThisBalls, 0, [deepCopyObject(this.balls[0])]);
		removeFromArray(castedQueBallAndThisBalls,1);

		castedQueBallAndThisBalls[0].vel.x = -Math.cos(this.shotAng)*vel;
		castedQueBallAndThisBalls[0].vel.y = -Math.sin(this.shotAng)*vel;

		this.shotPath = [];

		let start = new Vector(castedQueBallAndThisBalls[0].pos.x, castedQueBallAndThisBalls[0].pos.y);

		while(bounce < 2){
			let outcome = undefined;
			iterations = 0;

			//set the speed of the ball after the hit
			let tempAng = Math.atan2(castedQueBallAndThisBalls[0].vel.y,castedQueBallAndThisBalls[0].vel.x);
			castedQueBallAndThisBalls[0].vel.x = Math.cos(tempAng)*vel;
			castedQueBallAndThisBalls[0].vel.y = Math.sin(tempAng)*vel;

			// set the pos of the ball right before it hits the target
			let targetBalls = [];

			for (var i = 1; i < castedQueBallAndThisBalls.length; i++) {
				targetBalls.push(castedQueBallAndThisBalls[i]);
			}

			let contactPos = getContactPos(castedQueBallAndThisBalls[0], targetBalls, tempAng);

			// if it is even worth our time to put the "ball" furthur ahead
			if(contactPos){
				let tempBall = deepCopyObject(castedQueBallAndThisBalls[0]);
				castedQueBallAndThisBalls[0].pos.x = contactPos.c.x-Math.cos(tempAng)/100;
				castedQueBallAndThisBalls[0].pos.y = contactPos.c.y-Math.sin(tempAng)/100;
				getPosRigthBehindTarget(castedQueBallAndThisBalls[0], castedQueBallAndThisBalls, tempAng);
				// contactPos.l.draw("white");
				// colorCircle(castedQueBallAndThisBalls[0].pos.x, castedQueBallAndThisBalls[0].pos.y, 5, "blue");
				// colorCircle(contactPos.c.x, contactPos.c.y, 5, "blue");
			}

			// find the outcome
			while(outcome == undefined && iterations < 1000){
				castedQueBallAndThisBalls[0].pos.x += castedQueBallAndThisBalls[0].vel.x;
				castedQueBallAndThisBalls[0].pos.y += castedQueBallAndThisBalls[0].vel.y;
				iterations++;
				outcome = handleBallBallCollision(this.pockets, castedQueBallAndThisBalls, this.innerLines, false, 100);
			}

			// console.log(iterations)
			
			// Decides to draw an X or nothing based off what color the player is
			let lineAndHitResult;			
			contactPos.l.r = 2;

			// add the outcome to the tables path
			if(outcome){
				lineAndHitResult = {l:new LineSegment(start.x, start.y, outcome.hl.pos.x, outcome.hl.pos.y, 2), t:"X"};

				if(bounce == 0){
					this.shotPath.push(lineAndHitResult);
				}else{
					this.shotPath.push(contactPos);
				}

				insertAt(castedQueBallAndThisBalls, 0, [deepCopyObject(outcome.b)]);
				start = new Vector(outcome.hl.pos.x, outcome.hl.pos.y);
				prevOutcome = outcome;
			}else{
				lineAndHitResult = {l:new LineSegment(start.x, start.y, prevOutcome.hl.pos.x, prevOutcome.hl.pos.y, 2), t:"X"}
				
				if(bounce == 0){
					this.shotPath.push(lineAndHitResult);
				}else{
					this.shotPath.push(contactPos);
				}
				
				start = new Vector(prevOutcome.hl.pos.x, prevOutcome.hl.pos.y);
				insertAt(castedQueBallAndThisBalls, 0, [deepCopyObject(prevOutcome.b)]);
			}

			removeFromArrayByID(castedQueBallAndThisBalls, outcome.b.id)

			if(outcome.type == "ball"){
				removeFromArrayByID(castedQueBallAndThisBalls, outcome.hl.id)
			}

			//saying if the ball is hitting somthing it is supposed to
			// if the ball being hit is a "white" ball then it hit a wall
			if(this.currentTurn.ballType && outcome.b.color && 
			   outcome.b.color != this.currentTurn.ballType){

				lineAndHitResult.t = "X";
			}else{

				lineAndHitResult.t = "O";
			}

			if(outcome.b.color == "black"){
				if(this.currentTurn.ballsLeft == 1){
					lineAndHitResult.t = "O";
				}else{
					lineAndHitResult.t = "X";
				}
			}

			bounce++;
		}

		// this.shotPath[0].l.end = this.shotPath[1].l.start;
		let shotPathAng = Math.atan2(this.shotPath[1].l.end.y-this.shotPath[1].l.start.y, 
									 this.shotPath[1].l.end.x-this.shotPath[1].l.start.x);

		this.shotPath[1].l.end = 
		new Vector(this.shotPath[1].l.start.x+Math.cos(shotPathAng)*this.angMarkerLen, 
				   this.shotPath[1].l.start.y+Math.sin(shotPathAng)*this.angMarkerLen);

	}

	this.boxes = [new Rectangle(this.sideGaps, canvas.height/2 - this.oh/2, this.ol, this.inlet),
				  new Rectangle(this.sideGaps+this.il+this.inlet, canvas.height/2 - this.oh/2, this.inlet, this.oh),
				  new Rectangle(this.sideGaps, canvas.height/2 + this.ih/2, this.ol, this.inlet),
				  new Rectangle(this.sideGaps, canvas.height/2 - this.oh/2, this.inlet, this.oh)];

	this.draw = function(){
		//brownBorder
		colorRect(this.sideGaps, canvas.height/2 - this.oh/2, this.ol, this.inlet, "rgb(105, 30, 0)");
		colorRect(this.sideGaps+this.il+this.inlet, canvas.height/2 - this.oh/2, this.inlet, this.oh, "rgb(105, 30, 0)");
		colorRect(this.sideGaps, canvas.height/2 + this.ih/2, this.ol, this.inlet, "rgb(105, 30, 0)");
		colorRect(this.sideGaps, canvas.height/2 - this.oh/2, this.inlet, this.oh,"rgb(105, 30, 0)");

		//green felt
		colorRect(this.sideGaps+this.inlet, canvas.height/2-this.ih/2, this.il, this.ih, 'rgb(0,45,1)');

		//table markers horizontal
		for(let i = 1; i <= 7; i++){
			if(i == 4){
				continue;
			}
			drawFillTriangle(this.sideGaps+this.inlet+this.markerGapsX*i,canvas.height/2 - this.ih/2-this.inlet/2, 
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth,canvas.height/2-this.ih/2-this.inlet/2,
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth/2,canvas.height/2-this.ih/2-this.inlet/2-4, 'yellow');
			drawFillTriangle(this.sideGaps+this.inlet+this.markerGapsX*i,canvas.height/2 - this.ih/2-this.inlet/2, 
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth,canvas.height/2-this.ih/2-this.inlet/2,
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth/2,canvas.height/2-this.ih/2-this.inlet/2+4, 'yellow');
			drawFillTriangle(this.sideGaps+this.inlet+this.markerGapsX*i,canvas.height/2 + this.ih/2+this.inlet/2, 
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth,canvas.height/2+this.ih/2+this.inlet/2,
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth/2,canvas.height/2+this.ih/2+this.inlet/2-4, 'yellow');
			drawFillTriangle(this.sideGaps+this.inlet+this.markerGapsX*i,canvas.height/2+this.ih/2+this.inlet/2, 
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth,canvas.height/2+this.ih/2+this.inlet/2,
							 this.sideGaps+this.inlet+this.markerGapsX*i+this.markerWidth/2,canvas.height/2+this.ih/2+this.inlet/2+4, 'yellow');
		}

		for(let i = 1; i <= 3; i++){
			drawFillTriangle(this.sideGaps+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i, 
							 this.sideGaps+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth,
							 this.sideGaps+this.inlet/2+4,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth/2, 'yellow');
			drawFillTriangle(this.sideGaps+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i, 
							 this.sideGaps+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth,
							 this.sideGaps+this.inlet/2-4,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth/2, 'yellow');

			drawFillTriangle(this.sideGaps+this.inlet+this.il+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i, 
							 this.sideGaps+this.inlet+this.il+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth,
							 this.sideGaps+this.inlet+this.il+this.inlet/2+4,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth/2, 'yellow');
			drawFillTriangle(this.sideGaps+this.inlet+this.il+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i, 
							 this.sideGaps+this.inlet+this.il+this.inlet/2,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth,
							 this.sideGaps+this.inlet+this.il+this.inlet/2-4,canvas.height/2-this.ih/2+this.markerGapsY*i+this.markerWidth/2, 'yellow');
		}


		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].draw("rgb(61, 61, 61)");
		}

		for (var i = 0; i < this.pockets.length; i++) {
			this.pockets[i].draw("rgb(12,12,12)");
		}
		
		for (var i = 0; i < this.innerLines.length; i++) {
			this.innerLines[i].draw("rgb(61, 61, 61)", true);
		}

		for (var i = 0; i < this.balls.length; i++) {
			this.balls[i].draw();
		}

		//draws the arrows to prompt user to move the white ball
		if(table.scratched && this.balls[0].color == "white"){
			//up
			colorRect(this.balls[0].pos.x-this.ballRadius/2, this.balls[0].pos.y-this.ballRadius*3, this.ballRadius, this.ballRadius*1.5, "rgba(255,255,255,0.5)");
			drawFillTriangle(this.balls[0].pos.x-this.ballRadius,this.balls[0].pos.y-this.ballRadius*3, this.balls[0].pos.x,this.balls[0].pos.y-this.ballRadius*4, 
							 this.balls[0].pos.x+this.ballRadius,this.balls[0].pos.y-this.ballRadius*3, "rgba(255,255,255,0.5)")
			//down
			colorRect(this.balls[0].pos.x-this.ballRadius/2, this.balls[0].pos.y+this.ballRadius*3, this.ballRadius, -this.ballRadius*1.5, "rgba(255,255,255,0.5)");
			drawFillTriangle(this.balls[0].pos.x-this.ballRadius,this.balls[0].pos.y+this.ballRadius*3, this.balls[0].pos.x,this.balls[0].pos.y+this.ballRadius*4, 
							 this.balls[0].pos.x+this.ballRadius,this.balls[0].pos.y+this.ballRadius*3, "rgba(255,255,255,0.5)")	

			//left
			colorRect(this.balls[0].pos.x-this.ballRadius*3, this.balls[0].pos.y-this.ballRadius/2, this.ballRadius*1.5, this.ballRadius, "rgba(255,255,255,0.5)");
			drawFillTriangle(this.balls[0].pos.x-this.ballRadius*3,this.balls[0].pos.y-this.ballRadius, this.balls[0].pos.x-this.ballRadius*4,this.balls[0].pos.y, 
							 this.balls[0].pos.x-this.ballRadius*3,this.balls[0].pos.y+this.ballRadius, "rgba(255,255,255,0.5)")
			//right
			colorRect(this.balls[0].pos.x+this.ballRadius*3, this.balls[0].pos.y-this.ballRadius/2, -this.ballRadius*1.5, this.ballRadius, "rgba(255,255,255,0.5)");
			drawFillTriangle(this.balls[0].pos.x+this.ballRadius*3,this.balls[0].pos.y-this.ballRadius, this.balls[0].pos.x+this.ballRadius*4,this.balls[0].pos.y, 
							 this.balls[0].pos.x+this.ballRadius*3,this.balls[0].pos.y+this.ballRadius, "rgba(255,255,255,0.5)")
		}

		if(this.allBallsAtRest() && this.pickedUp == false){
			if(this.shotPath.length > 0){
				this.shotPath[0].l.draw("white");
				colorNoFillCircle(this.shotPath[0].l.end.x, this.shotPath[0].l.end.y, this.ballRadius, "white");
				this.shotPath[1].l.draw("white");
			}

			for (var i = 0; i < this.shotPath.length; i++) {

				if(this.shotPath[0].l.t == "X"){
					drawLine(this.shotPath[0].l.end.x+Math.cos(Math.PI/4)*this.ballRadius,
							 this.shotPath[0].l.end.y+Math.sin(Math.PI/4)*this.ballRadius,
							 this.shotPath[0].l.end.x+Math.cos(Math.PI/4+Math.PI)*this.ballRadius,
							 this.shotPath[0].l.end.y+Math.sin(Math.PI/4+Math.PI)*this.ballRadius,
							 1,"white");

					drawLine(this.shotPath[0].l.end.x+Math.cos(-Math.PI/4)*this.ballRadius,
							 this.shotPath[0].l.end.y+Math.sin(-Math.PI/4)*this.ballRadius,
							 this.shotPath[0].l.end.x+Math.cos(-Math.PI/4+Math.PI)*this.ballRadius,
							 this.shotPath[0].l.end.y+Math.sin(-Math.PI/4+Math.PI)*this.ballRadius,
							 1,"white");
				}
			}
			
			// draw stick
			drawPoolQue(this.shotAng, this.balls[0].pos.x+Math.cos(this.shotAng)*this.shotMeter.pullBack, 
					    this.balls[0].pos.y+Math.sin(this.shotAng)*this.shotMeter.pullBack, this.poolQueLen, this.ballRadius*3)
		}

		this.shotMeter.draw();
		this.playerMeters.draw();
	}

}

function ShotMeter(refrenceTable){
	this.x = refrenceTable.sideGaps / 3;
	this.y = canvas.height/2 - refrenceTable.oh/2;
	this.w = refrenceTable.sideGaps / 3;
	this.h = refrenceTable.oh;
	this.pullBack = 0;
	this.shotPower = 0;

	this.maxShot = refrenceTable.il*1.25;

	this.draw = function(){
		colorRect(this.x, this.y, this.w, this.h, 'lightblue');

		for (var i = 1/2; i <= 5; i++) {
			drawLine(this.x,this.y+i*this.h/5,this.x+this.w,this.y+i*this.h/5,2,"blue");
		}

		colorRect(this.x, this.y+this.pullBack, this.w, this.h-this.pullBack, 'rgb(18,18,18,0.75)');

		drawPoolQue(Math.PI/2, this.x+this.w/2, this.y+this.pullBack, table.oh, 0);

	}

	this.mouseIsOver = function(){
		if(IsPointInRect({x:mouseX, y:mouseY},this.x,this.y,this.w,this.h)){
			return true;
		}
		return false;
	}
}

function PlayerMeters(refrenceTable){
	this.table = refrenceTable;
	this.p1 = this.table.p1;
	this.p2 = this.table.p2;

	this.fontHeight = this.table.oh/4;

	while(measureText("1", this.fontHeight, "monospace").width > this.table.sideGaps/3){
		this.fontHeight--;
	}

	while(measureText("2", this.fontHeight, "monospace").width > this.table.sideGaps/3){
		this.fontHeight--;
	}

	this.draw = function(){
		//get color and draw player number
		let color1 = "rgb(255,255,255)";
		let color2 = "rgb(50,50,50)";

		if(this.table.currentTurn == this.p2){
			color1 = "rgb(50,50,50)";
			color2 = "rgb(255,255,255)";
		}

		drawText(color1, this.fontHeight + "px monospace", "1", 
		this.table.sideGaps+this.table.ol+this.table.sideGaps/3, 
		canvas.height/2-this.table.oh/4+this.fontHeight/3);

		drawText(color2, this.fontHeight + "px monospace", "2", 
		this.table.sideGaps+this.table.ol+this.table.sideGaps/3, 
		canvas.height/2+this.table.oh/4+this.fontHeight/3);


		// if player has ball type display ball types
		let img1;
		let img2;

		if(this.p1.ballType){

			if(this.p1.ballType == YELLOW){
				img1 = solid.center;
				img2 = striped.horizontal;
			}

			if(this.p1.ballType == RED){
				img1 = striped.horizontal;
				img2 = solid.center;
			}	

			drawImageFromSpriteSheetWithRotation(ballImageSet, img1.pos.x, img1.pos.y, BALL_IMG_WH, 
            BALL_IMG_WH, this.table.sideGaps+this.table.ol+this.table.sideGaps/2+3, 
            canvas.height/2-this.table.oh/4+this.fontHeight/2+4, this.table.ballRadius*2, this.table.ballRadius*2, 
            img1.ang);


			drawImageFromSpriteSheetWithRotation(ballImageSet, img2.pos.x, img2.pos.y, BALL_IMG_WH, 
            BALL_IMG_WH, this.table.sideGaps+this.table.ol+this.table.sideGaps/2+3, 
            canvas.height/2+this.table.oh/4+this.fontHeight/2+4, this.table.ballRadius*2, this.table.ballRadius*2, 
            img2.ang);

            return;
		}

		//if no ball type draw blank balls
		colorCircle(this.table.sideGaps+this.table.ol+this.table.sideGaps/2+3,
					canvas.height/2-this.table.oh/4+this.fontHeight/2+4, this.table.ballRadius, color1);
		

		colorCircle(this.table.sideGaps+this.table.ol+this.table.sideGaps/2+3,
					canvas.height/2+this.table.oh/4+this.fontHeight/2+4, this.table.ballRadius, color2);

	}

}

function drawPoolQue(ang, x, y, len, distFromOrgin){
	drawLine(x + Math.cos(ang)*distFromOrgin,y + Math.sin(ang)*distFromOrgin,
			 x + Math.cos(ang-0.004363323)*len,y + Math.sin(ang-0.004363323)*len,4,"rgb(255, 245, 158)");
	drawLine(x + Math.cos(ang)*distFromOrgin,y + Math.sin(ang)*distFromOrgin,
			 x + Math.cos(ang+0.004363323)*len,y + Math.sin(ang+0.004363323)*len,4,"rgb(255, 245, 158)");
	drawLine(x + Math.cos(ang)*len*0.5,y + Math.sin(ang)*len*0.5,
			 x + Math.cos(ang-0.004363323)*len,y + Math.sin(ang-0.004363323)*len,6,"rgb(161, 99, 0)");
	drawLine(x + Math.cos(ang)*len*0.5,y + Math.sin(ang)*len*0.5,
			 x + Math.cos(ang+0.004363323)*len,y + Math.sin(ang+0.004363323)*len,6,"rgb(161, 99, 0)");
	drawLine(x + Math.cos(ang)*distFromOrgin,y + Math.sin(ang)*distFromOrgin,
			 x + Math.cos(ang-0.004363323)*(distFromOrgin+len*0.02),
			 y + Math.sin(ang-0.004363323)*(distFromOrgin+len*0.02),4,"blue");
	drawLine(x + Math.cos(ang)*distFromOrgin,y + Math.sin(ang)*distFromOrgin,
			 x + Math.cos(ang+0.004363323)*(distFromOrgin+len*0.02),
			 y + Math.sin(ang+0.004363323)*(distFromOrgin+len*0.02),4,"blue");
}



	// this.neighbors = [[this.innerLines[6], this.innerLines[18]],
	// 				  [this.innerLines[19], this.innerLines[9]],
	// 				  [this.innerLines[10], this.innerLines[12]],
	// 				  [this.innerLines[22], this.innerLines[15]],
	// 				  [this.innerLines[13], this.innerLines[21]],
	// 				  [this.innerLines[7], this.innerLines[16]],
	// 				  [this.innerLines[0], this.innerLines[8]],
	// 				  [this.innerLines[5], this.innerLines[8]],
	// 				  [this.innerLines[7], this.innerLines[6]],
	// 				  [this.innerLines[1], this.innerLines[11]],
	// 				  [this.innerLines[11], this.innerLines[2]],
	// 				  [this.innerLines[9], this.innerLines[10]],
	// 				  [this.innerLines[2], this.innerLines[14]],
	// 				  [this.innerLines[4], this.innerLines[14]],
	// 				  [this.innerLines[12], this.innerLines[13]],
	// 				  [this.innerLines[17], this.innerLines[3]],
	// 				  [this.innerLines[5], this.innerLines[17]],
	// 				  [this.innerLines[16], this.innerLines[15]],
	// 				  [this.innerLines[0], this.innerLines[20]],
	// 				  [this.innerLines[1], this.innerLines[20]],
	// 				  [this.innerLines[18], this.innerLines[19]],
	// 				  [this.innerLines[23], this.innerLines[4]],
	// 				  [this.innerLines[3], this.innerLines[23]],
	// 				  [this.innerLines[22], this.innerLines[21]]
	// 				 ];

