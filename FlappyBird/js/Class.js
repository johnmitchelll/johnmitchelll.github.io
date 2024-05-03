const WALL_GAP = 350;
var wall_speed = 4;

function moveWalls(){
  if(walls[0].x + walls[0].w < 0){
    walls[0] = undefined;
    for (var i = 1; i < walls.length; i++) {
      walls[i-1] = walls[i];
    }
    walls[walls.length-1] = new Wall();

    for (let i = 0; i < population.balls.length; i++) {
      population.balls[i].payingAttentionTo = walls[0];
      population.balls[i].nextWall = walls[1];
    }
  }

  wall_speed += 0.01;

  if(wall_speed > 7){
    wall_speed = 7;
  }

  if(population.allDead == false){
    walls[0].x -= wall_speed;
    for (var i = 1; i < walls.length; i++) {
      if(walls[i-1].x < walls[i].x - WALL_GAP){
        walls[i].x -= wall_speed;
      }
    }
  }

}

function Wall(color){
  this.x = canvas.width+5;
  this.w = 125;
  this.vel = wall_speed;
  this.passed = false;
  this.color = color;
  this.gap = {
              y:randomIntFromInterval(80, canvas.height-160-80),
              h:randomIntFromInterval(160, 180)
            }

  this.show = function(color){
    //top wall
    canvasContext.strokeStyle = "rgba(255,255,255,1)";

    
    canvasContext.strokeRect(this.x,0,this.w,this.gap.y);
    colorRect(this.x,0, this.w,this.gap.y, color);
    //bottom wall
    
    canvasContext.strokeRect(this.x,this.gap.y+this.gap.h,
                            this.w,canvas.height-(this.gap.y+this.gap.h));
    colorRect(this.x,this.gap.y+this.gap.h, 
                            this.w,canvas.height-(this.gap.y+this.gap.h), color);
  }
}

/////////////////////////////////////////////////////////////////////////////////

const GRAV = 1.2;

function Ball(id){
  this.x = walls[0].w + 120*(Math.random()-0.5);
  this.y = canvas.height/2;
  this.r = 15;
  this.vel =  0;
  this.acc = 0;
  this.score = 0;
  this.maxSpeed = 20;
  this.maxFallSpeed = 10;
  this.dead = false;
  this.fitness = 0;
  this.brain = new Brain();
  this.payingAttentionTo = walls[0];
  this.nextWall = walls[1];
  this.id = id;

  this.xStrength = 0;
  this.tyStrength = 0;
  this.byStrength = 0;

  this.ang = 0;

  this.show = function(color){
    this.animate();
    drawImageFromSpriteSheetWithRotation(bird, 0, 0, 17, 12, this.x, this.y, 51, 36, this.ang, false);
  }

  this.animate = function(){
    this.ang = Math.atan2(this.vel, wall_speed);

    this.ang = normalizeValue(-2*Math.PI, 2*Math.PI, this.ang) - 0.5;

    this.ang *= 7.5;
  }

  this.move = function(){
    if(this.dead == false){
      this.acc += GRAV;
      this.vel += this.acc;

      if(showBestInputInfo && this.id == population.balls[display].id){
        if(Math.abs(this.payingAttentionTo.gap.y - this.y) <= Math.abs((this.payingAttentionTo.gap.y+this.payingAttentionTo.gap.h) - this.y)){
          drawLine(this.x,this.y,this.x,this.payingAttentionTo.gap.y + this.payingAttentionTo.gap.h,3,"red");
          drawLine(this.x,this.y,this.x,this.payingAttentionTo.gap.y,3,"blue");
        }else{
          drawLine(this.x,this.y,this.x,this.payingAttentionTo.gap.y,3,"blue");
          drawLine(this.x,this.y,this.x,this.payingAttentionTo.gap.y + this.payingAttentionTo.gap.h,3,"red");
        }

        drawLine(this.x,this.y,this.payingAttentionTo.x,this.y,3,"green");
        
      }


      let inputNodes = this.brain.layers[0];
      //must send as an object with a weight and value sent
      let xGap = normalizeValue(0, canvas.width, this.payingAttentionTo.x - (this.x + this.r));
      inputNodes[0].inputs.push({weight:1,val:xGap});

      let topYGap = normalizeValue(0, canvas.height, Math.abs(this.payingAttentionTo.gap.y - (this.y - this.r)))
      inputNodes[1].inputs.push({weight:1,val:topYGap});

      let bottomYGap = normalizeValue(0, canvas.height, Math.abs((this.payingAttentionTo.gap.y + this.payingAttentionTo.gap.h) - (this.y + this.r)))
      inputNodes[2].inputs.push({weight:1,val:bottomYGap});

      // let nextBottomYGap = normalizeValue(-canvas.height, canvas.height, Math.abs((this.nextWall.gap.y + this.nextWall.gap.h) - (this.y + this.r)))
      // inputNodes[3].inputs.push({weight:1,val:nextBottomYGap});

      // let nextTopYGap = normalizeValue(-canvas.height, canvas.height, Math.abs(this.nextWall.gap.y - (this.y - this.r)))
      // inputNodes[4].inputs.push({weight:1,val:nextTopYGap});
     
      let output = this.brain.getOutput();

      // console.log(output, this.vel)
      
      if(this.id == population.balls[display].id){
        this.xStrength = xGap;
        this.tyStrength = topYGap;
        this.byStrength  = bottomYGap;
      }

      if(output.val > 0.5){
        this.vel -= 20;
      }

      // console.log(this.vel, diving, output)
      // if we are choosing to dive we will be able to faster than when in freefall
      if(this.vel > this.maxFallSpeed){
        this.vel = this.maxFallSpeed;
      }else if(this.vel < -this.maxFallSpeed){
        this.vel = -this.maxFallSpeed;
      }

      this.y += this.vel;
      this.acc *= 0;

      this.checkCollision();
    }
  }

  this.checkCollision = function(){

    if(this.x - this.r > this.payingAttentionTo.x + this.payingAttentionTo.w){
      this.payingAttentionTo = walls[1];
      this.nextWall = walls[walls.length-1];

      if(this.id == population.balls[display].id){
        polesPassed++;

        if(polesPassed > bestPolesPassed){  
          bestPolesPassed = polesPassed;
        }
      }
    }

    if(this.y + this.r > canvas.height){
        this.y = canvas.height-this.r;
        this.dead = true;
        return;
    }

    let wall = walls[0];
    //top wall collision
    if(this.x + this.r > wall.x && this.x - this.r < wall.x + wall.w
      && this.y - this.r < wall.gap.y){
      this.dead = true;
      return;
    }
    //bottom wall collision
    if(this.x + this.r > wall.x && this.x - this.r < wall.x + wall.w
      && this.y + this.r > wall.gap.y + wall.gap.h){
      this.dead = true;
      return;
    }

    // only add score if below top, we dont want to reward that behavior
    if(this.y > 0){
      this.score++;
    }
  }

  this.reset = function(){
    this.x = walls[0].w + 120*(Math.random()-0.5);
    this.y = canvas.height/2;
    this.vel =  0;
    this.acc = 0;
    this.dead = false;
    this.payingAttentionTo = walls[0];
    this.nextWall = walls[1];
    this.score = 0;
  }

}

/////////////////////////////////////////////////////////////////////////////////

function Population(size){
  this.size = size;
  this.balls = new Array(size);
  this.bestScore = -Infinity;
  this.allDead = false;
  this.genNum = 0;
  this.amountAlive = size;
  this.currentBestScore = 0;

  for (var i = 0; i < this.balls.length; i++) {
    this.balls[i] = new Ball(i);
  }

  this.show = function(){
    // show the best one alive at the moment
    if(showAllBirds == false){
      for (var i = 0; i < this.balls.length; i++) {
        if(this.balls[i].dead == false){
          this.balls[i].show();
          return;
        }
      }
    }

    for (var i = 0; i < this.balls.length; i++) {
      if(this.balls[i].dead == false){
        this.balls[i].show();
      }
    }
  }

  this.update = function(){

    this.allDead = areAllBallsDead(this.balls);
    if(this.allDead){
      for (var i = 0; i < walls.length; i++) {
        walls[i] = new Wall();
      }

      this.genNum++;

      this.createNewGeneration();
      this.amountAlive = this.balls.length;
      this.currentBestScore = 0;
      polesPassed = 0;

      wall_speed = 4;
      
      this.allDead = false;
      return; 
    }

    this.amountAlive = 0;
    for (var i = 0; i < this.balls.length; i++) {
      if(this.balls[i].dead == false){
        this.amountAlive++;
        
        this.balls[i].move();
      }
    }

    for (var i = 0; i < this.balls.length; i++) {
      if(this.balls[i].dead == false){
        display = i;
        break;
      }
    }

    this.currentBestScore++;

    moveWalls();
  }

  this.createNewGeneration = function(){

      this.balls.sort(function(a, b){return b.score - a.score});
      
       if(this.balls[0].score > this.bestScore){
          this.bestScore = this.balls[0].score;
          bestPolesPassed = polesPassed;
        }

        this.balls[0].reset();

      for (var i = 2; i < this.balls.length; i++) {
        this.balls[i].reset();

        this.balls[i].brain = deepCopyObject(this.balls[0].brain);

        this.balls[i].brain.randomlyMutate();
      }

  }

}

function areAllBallsDead(arr){
  let ballAlive = false;
    for (var i = 0; i < arr.length; i++) {
      if(arr[i].dead == false){
        ballAlive = true;
      }
    }

    if(ballAlive == false){
      return true;
    }else{
      return false;
    }
}
