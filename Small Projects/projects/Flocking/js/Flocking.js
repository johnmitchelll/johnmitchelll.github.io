boids = new Array(100);

function Boid(i){
	this.index = i;
	this.r = 4;
	this.maxVel = 3;
	this.pos = new Vector(Math.random() * canvas.width,Math.random() * canvas.height);
	this.vel = new Vector(random(-this.maxVel,this.maxVel), random(-this.maxVel,this.maxVel));
	this.acc = new Vector(0,0);

	this.maxAlignCohereInfluence = 0.05;
	this.maxSeparationInfluence = 0.2;
	this.ang = Math.atan2((this.vel.y/this.maxVel),(this.vel.x/this.maxVel))
	this.perception = 100;
	this.localBoids = [];
	this.smallerLocalBoids = [];


	this.draw = function(color){
		colorCircle(this.pos.x,this.pos.y, this.r, color)

		drawLine(this.pos.x,this.pos.y,
						 this.pos.x+Math.cos(this.ang)*this.r*2,this.pos.y+Math.sin(this.ang)*this.r*2,
						 3,'blue')
	}

	this.update = function(){

		this.ang = Math.atan2((this.vel.y/this.maxVel),(this.vel.x/this.maxVel))
		this.vel.add(this.acc)
		this.pos.add(this.vel);
		this.acc.mult(new Vector(0,0));

		limit(this.vel, this.maxVel)

		if(this.pos.x - this.r > canvas.width){
			this.pos.x = 0 - this.r;
		}
		if(this.pos.x + this.r < 0){
			this.pos.x = canvas.width + this.r;
		}
		if(this.pos.y - this.r > canvas.height){
			this.pos.y = 0 - this.r;
		}
		if(this.pos.y + this.r < 0){
			this.pos.y = canvas.height + this.r;
		}
	}





	this.align = function(){
		let steering = new Vector(0,0);

		for (var i = 0; i < this.localBoids.length; i++) {
				steering.add(this.localBoids[i].vel)
		}

		if(this.localBoids.length != 0){

			steering.x /= this.localBoids.length;
			steering.y /= this.localBoids.length;

			let steeringAng = Math.atan2((steering.y/this.maxVel),(steering.x/this.maxVel));
			steering.x = Math.cos(steeringAng) * this.maxVel;
			steering.y = Math.sin(steeringAng) * this.maxVel;

			steering.sub(this.vel);
			limit(steering, this.maxAlignCohereInfluence)
		}

		return steering
	}

	this.cohere = function(){
		let steering = new Vector(0,0);

		for (var i = 0; i < this.localBoids.length; i++) {
				steering.add(this.localBoids[i].pos)
		}

		if(this.localBoids.length != 0){

			steering.x /= this.localBoids.length;
			steering.y /= this.localBoids.length;

			steering.sub(this.pos)

			let steeringAng = Math.atan2((steering.y/this.maxVel),(steering.x/this.maxVel));
			steering.x = Math.cos(steeringAng) * this.maxVel;
			steering.y = Math.sin(steeringAng) * this.maxVel;

			steering.sub(this.vel);
			limit(steering, this.maxAlignCohereInfluence)
		}

		return steering
	}

	this.separate = function(){
		let steering = new Vector(0,0);
		let total = 0;

		for (var i = 0; i < this.smallerLocalBoids.length; i++) {
				let d = dist(this.pos.x,this.pos.y,this.smallerLocalBoids[i].pos.x,this.smallerLocalBoids[i].pos.y)

				let diff = new Vector(this.pos.x - this.smallerLocalBoids[i].pos.x, this.pos.y - this.smallerLocalBoids[i].pos.y)
				diff.x /= d;
				diff.y /= d;

				steering.add(diff)
				total++;
		}

		if(total != 0){
			steering.x /= total;
			steering.y /= total;

			let steeringAng = Math.atan2((steering.y/this.maxVel),(steering.x/this.maxVel));
			steering.x = Math.cos(steeringAng) * this.maxVel*2;
			steering.y = Math.sin(steeringAng) * this.maxVel*2;

			steering.sub(this.vel);

			limit(steering, this.maxSeparationInfluence)
		}

		return steering
	}


	this.applyForces = function(){
		let alignment = this.align();
		let cohesion = this.cohere()
		let separatation = this.separate()
		let finalforce = new Vector(0,0)

		finalforce.add(alignment)
		finalforce.add(cohesion)
		finalforce.add(separatation);

		this.acc.add(finalforce)
	}


	this.getLocalBoids = function(){
		this.localBoids = [];
		this.smallerLocalBoids = [];

		let range = new Circle(this.pos.x, this.pos.y, this.perception)
		let smallerRange = new Circle(this.pos.x, this.pos.y, 40)

		quadTree.query(range, this.localBoids)
		quadTree.query(smallerRange, this.smallerLocalBoids)

		for (var i = this.localBoids.length - 1; i >= 0; i--) {
			if(this.localBoids[i] == this){
				this.localBoids.splice(i,1);
			}
		}

		for (var i = this.smallerLocalBoids.length - 1; i >= 0; i--) {
			if(this.smallerLocalBoids[i] == this){
				this.smallerLocalBoids.splice(i,1);
			}
		}

	}

}