var pairsOfCollidingBalls = [];
var ballSelected;

function handleBallBallCollision(pockets, balls, lines, resolution, simUpdates, player, indexxx){
	let numSimulationUpdates = 4;
	if(simUpdates){
		numSimulationUpdates = simUpdates;
	}
	let simElapsedTime = elaspedTime / numSimulationUpdates;
	let maxSimulationSteps = 3;

	
	for (var t = 0; t < numSimulationUpdates; t++) {
		for (var i = 0; i < balls.length; i++) {
			balls[i].simTimeRemaining = simElapsedTime;
		}
		

		for (var step = 0; step < maxSimulationSteps; step++) {
			//apply forces to the balls
			for (var i = 0; i < balls.length; i++) {

				let simTimeRemaining = 1;
				let friction = 0.0045;;
				let stopVal = 0.0001;

				if(player != "CPU"){
					simTimeRemaining = balls[i].simTimeRemaining;
					friction = 0.5;
					stopVal = 0.5;
				}

				if(resolution){
					balls[i].oPos.x = balls[i].pos.x;
					balls[i].oPos.y = balls[i].pos.y;

					balls[i].acc.x = 0;
					balls[i].acc.x = 0;

					//adding friction
					balls[i].acc.x = -balls[i].vel.x * friction;
					balls[i].acc.y = -balls[i].vel.y * friction;

					//update vetcors
					balls[i].vel.x += balls[i].acc.x * simTimeRemaining;
					balls[i].vel.y += balls[i].acc.y * simTimeRemaining;
					balls[i].pos.x += balls[i].vel.x * simTimeRemaining;
					balls[i].pos.y += balls[i].vel.y * simTimeRemaining;

					if(balls[i].pos.x <= 0){  balls[i].pos.x = canvas.width;  }
					if(balls[i].pos.x > canvas.width){	balls[i].pos.x = 0;	}
					if(balls[i].pos.y <= 0){  balls[i].pos.y = canvas.height;  }
					if(balls[i].pos.y > canvas.height){	balls[i].pos.y = 0;	}

					if(Math.abs(balls[i].vel.x*balls[i].vel.x + balls[i].vel.y*balls[i].vel.y) <= stopVal){
						balls[i].vel.x = 0;
						balls[i].vel.y = 0;
					}
				}
			}//apply forces
			
			//get collisions and handle static collisions
			for (var i = 0; i < balls.length; i++) {

				//against edges
				for (var j = 0; j < lines.length; j++) {

					let line1 = new Vector(lines[j].end.x - lines[j].start.x, lines[j].end.y - lines[j].start.y);
					let line2 = new Vector(balls[i].pos.x - lines[j].start.x, balls[i].pos.y - lines[j].start.y);

					let edgeLength = line1.x*line1.x + line1.y*line1.y;
					let tl = Math.max(0, Math.min(edgeLength, (line1.x*line2.x + line1.y*line2.y))) / edgeLength;

					let closestPointX = lines[j].start.x + tl * line1.x;
					let closestPointY = lines[j].start.y + tl * line1.y;

					let distance = distanceOfTwoPoints(closestPointX, closestPointY, balls[i].pos.x, balls[i].pos.y);

					if(distance <= (balls[i].r + lines[j].r)){

						//static collision has occured
						let fakeBall = new Ball(closestPointX, closestPointY, lines[j].r);
						fakeBall.mass = balls[i].mass;
						fakeBall.vel.x = -balls[i].vel.x;
						fakeBall.vel.y = -balls[i].vel.y;
						
						let overlapLine = distance - balls[i].r - fakeBall.r;

						distance = Math.max(distance, 0.0001);

						balls[i].pos.x -= overlapLine * (balls[i].pos.x - fakeBall.pos.x) / distance;
						balls[i].pos.y -= overlapLine * (balls[i].pos.y - fakeBall.pos.y) / distance;
						
						pairsOfCollidingBalls.push({b1:fakeBall, b2:balls[i], type:"wall"});
					}
				}

				for (var j = 0; j < pockets.length; j++) {
					if(distanceOfTwoPoints(balls[i].pos.x, balls[i].pos.y, pockets[j].pos.x, pockets[j].pos.y) < table.cornerPockeyRadius){
						balls[i].removeMe = true;
					}
				}

				//agaisnt other balls
				for (var j = 0; j < balls.length; j++) {
					if(balls[i].id != balls[j].id){

						if(DoCirclesOverlap(balls[i].pos.x, balls[i].pos.y, balls[i].r, 
											balls[j].pos.x, balls[j].pos.y, balls[j].r)){

							pairsOfCollidingBalls.push({b1:balls[j], b2:balls[i], type:"ball"});

							let distFromBallsCenters = distanceOfTwoPoints(balls[i].pos.x, balls[i].pos.y, balls[j].pos.x, balls[j].pos.y);
							let overLap = (distFromBallsCenters - balls[i].r - balls[j].r)/2;

							distFromBallsCenters = Math.max(distFromBallsCenters, 0.0001)

								//displace the current ball
								balls[i].pos.x -= overLap * (balls[i].pos.x - balls[j].pos.x) / distFromBallsCenters;
								balls[i].pos.y -= overLap * (balls[i].pos.y - balls[j].pos.y) / distFromBallsCenters;

								// //displace the target ball
								balls[j].pos.x += overLap * (balls[i].pos.x - balls[j].pos.x) / distFromBallsCenters;
								balls[j].pos.y += overLap * (balls[i].pos.y - balls[j].pos.y) / distFromBallsCenters;
						}

					}
				}

				let simTimeRemaining = 1;
				if(player != "CPU"){
					simTimeRemaining = balls[i].simTimeRemaining;
				}

				//time displacement
				let intendedSpeed = Math.sqrt(balls[i].vel.x*balls[i].vel.x + balls[i].vel.y*balls[i].vel.y);


				if(intendedSpeed != 0){
					let intendedDistance = intendedSpeed * simTimeRemaining;
					let actualDistance = distanceOfTwoPoints(balls[i].pos.x, balls[i].pos.y,
														 balls[i].oPos.x, balls[i].oPos.y);
					let actualTime = actualDistance / intendedSpeed;

					if(player != "CPU"){
						balls[i].simTimeRemaining -= actualTime;
					}

				}
			}//set time displacement and deal with static collisions

			//handle dynamic collisions
			for (var i = 0; i < pairsOfCollidingBalls.length; i++) {
				let b1 = pairsOfCollidingBalls[i].b1;
				let b2 = pairsOfCollidingBalls[i].b2;
				let type = pairsOfCollidingBalls[i].type;

				let distFromCollisionsCenters = distanceOfTwoPoints(b1.pos.x, b1.pos.y, b2.pos.x, b2.pos.y);

				distFromCollisionsCenters = Math.max(distFromCollisionsCenters, 0.00001);

				//normal
				let nx = (b1.pos.x - b2.pos.x) / distFromCollisionsCenters;
				let ny = (b1.pos.y - b2.pos.y) / distFromCollisionsCenters;

				//tagent
				let tx = -ny;
				let ty = nx;

				//dot product tangent
				let dpTan1 = b1.vel.x * tx + b1.vel.y * ty;
				let dpTan2 = b2.vel.x * tx + b2.vel.y * ty;

				//dot product normal
				let dpNorm1 = b1.vel.x * nx + b1.vel.y * ny;
				let dpNorm2 = b2.vel.x * nx + b2.vel.y * ny;

				//conservation of momentum in 1D
				let m1 = (dpNorm1 * (b1.mass - b2.mass) + 2 * b2.mass * dpNorm2) / (b1.mass + b2.mass);
				let m2 = (dpNorm2 * (b2.mass - b1.mass) + 2 * b1.mass * dpNorm1) / (b1.mass + b2.mass);

				b1.vel.x = tx * dpTan1 + nx * m1;
				b1.vel.y = ty * dpTan1 + ny * m1;
				b2.vel.x = tx * dpTan2 + nx * m2;
				b2.vel.y = ty * dpTan2 + ny * m2;

				pairsOfCollidingBalls = [];

				if(resolution == false){
					if(type == "wall"){
						b2.color = undefined;
						return {b:b2, hl:b2, type:"wall"}
					}
					if(type == "ball"){
						return {b:b1, hl:b2, type:"ball"}
					}
				}
			}//dynamic collisions

			for (var i = balls.length - 1; i >= 0; i--) {
				if(balls[i].removeMe){
					removeFromArray(balls,i)
				}
			}
		}//max sim steps
	}//for shortened epoch
}//function

function getContactPos(targetBall, thisBalls, ang){
	//find collision between line and circles then find the collision between 
	//lines and line and see what is the closest, that will be the point that i return

	let ballCollisions = [];

	let collisions = [];

	let line = new LineSegment(targetBall.pos.x, targetBall.pos.y, 
	targetBall.pos.x+Math.cos(ang)*canvas.width, targetBall.pos.y+Math.sin(ang)*canvas.width, targetBall.r);

	for (var i = 0; i < thisBalls.length; i++) {
		let collision = CirCapsuleIntersection(thisBalls[i], line);

		if(collision){
			collisions.push({c:collision, d:distanceOfTwoPoints(targetBall.pos.x, targetBall.pos.y, 	
															   collision.x, collision.y)});
		}
	}

	if(collisions.length == 0){
		for (var i = 0; i < table.innerLines.length; i++) {
			collision = CapsuleCapsuleCollision(table.innerLines[i], line, i);

			if(collision){
				collisions.push({c:collision, d:distanceOfTwoPoints(targetBall.pos.x, targetBall.pos.y, 	
															   collision.x, collision.y)});
			}
		}
	}

	collisions.sort(function(a, b){return a.d - b.d});

	// console.log(deepCopy(collisions))

	if(collisions[0]){
		return {c:collisions[0].c, l:line}
	}
}

function getPosRigthBehindTarget(ball, balls, ang){	
	for (var i = 0; i < table.innerLines.length; i++) {
		while(CirCapsuleIntersection(ball, table.innerLines[i])){
			ball.pos.x -= Math.cos(ang)/100;
			ball.pos.y -= Math.sin(ang)/100;
		}
	}

	for (var i = 1; i < balls.length; i++) {
		while(distanceOfTwoPoints(ball.pos.x, ball.pos.y, balls[i].pos.x, balls[i].pos.y) < table.ballRadius*2){
			ball.pos.x -= Math.cos(ang)/100;
			ball.pos.y -= Math.sin(ang)/100;
		}
	}
}


function CirCapsuleIntersection(circle, line){
    //against edges
    let line1 = new Vector(line.end.x - line.start.x, line.end.y - line.start.y);
    let line2 = new Vector(circle.pos.x - line.start.x, circle.pos.y - line.start.y);

    let edgeLength = line1.x*line1.x + line1.y*line1.y;
    let tl = Math.max(0, Math.min(edgeLength, (line1.x*line2.x + line1.y*line2.y))) / edgeLength;

    let closestPointX = line.start.x + tl * line1.x;
    let closestPointY = line.start.y + tl * line1.y;

    let distance = distanceOfTwoPoints(closestPointX, closestPointY, circle.pos.x, circle.pos.y);

    if(distance <= (circle.r + line.r)){
        return new Vector(closestPointX, closestPointY);
    }
}

function LineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

  // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x:x, y:y}
}

function CapsuleCapsuleCollision(a, b, j){
	let intPoint = LineLineIntersection(a.start.x, a.start.y, a.end.x, a.end.y, 
                                        b.start.x, b.start.y, b.end.x, b.end.y)

    if(intPoint){
        // (new Ball(intPoint.x, intPoint.y, 5, 100000, "yellow")).draw();
        // table.innerLines[j].draw("green", true);
        // table.neighbors[j][0].draw("green", true)
        // table.neighbors[j][1].draw("green", true)

        return intPoint;
    }

    let dists = [];
    dists.push(CirCapsuleIntersection(new Ball(a.start.x,a.start.y,a.r), b));
    dists.push(CirCapsuleIntersection(new Ball(a.end.x,a.end.y,a.r), b));

    for (var i = 0; i < dists.length; i++) {
        if(dists[i]){
        	// (new Ball(dists[i].x, dists[i].y, 5, 100000, "red")).draw();
            return dists[i];
        }
    }


    return false;
}




