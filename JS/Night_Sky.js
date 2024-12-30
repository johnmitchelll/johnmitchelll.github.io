var night_sky = new DrawableSurface('night_sky');

var shootingStars = [];
var twinkleStars = new Array(30);

var moon = { x: 100, y: 60, r: 30 };
var moonShadow = { x: moon.x+8, y: moon.y-8, r: moon.r-1 };
var stars = new Array(100);

var ssRate = undefined;

function ShootingStar(ang, dir){
  this.ang = Math.random() * Math.PI*2;
  this.distNear = 0;
  this.distFar = 0;
  this.vel = 25+Math.random()*5;
  this.fazeTwo = false;
  this.start = { x: night_sky.canvas.width/2+Math.cos(this.ang)*-400+(300*Math.random()-150), y: night_sky.canvas.height/2+Math.sin(this.ang)*-400+(300*Math.random()-150) };
}

night_sky.initNightSky = function(){
  for(var i = 0; i < stars.length; i++){
    let dot = { x: Math.random() * night_sky.canvas.width, y: Math.random() * night_sky.canvas.height, r: Math.random() };

    while(distanceOfTwoPoints(dot.x, dot.y, moon.x, moon.y) < dot.r + moon.r + 20){
      dot = { x: Math.random() * night_sky.canvas.width, y: Math.random() * night_sky.canvas.height, r: Math.random() };
    }

    stars[i] = dot;
  }

  for(var i = 0; i < twinkleStars.length; i++){
    twinkleStars[i] = { i: Math.floor(Math.random()*stars.length), dir: 1 };
    twinkleStars[i].r = stars[twinkleStars[i].i].r;
  }

  // night_sky.canvas.addEventListener('mouseover', () => {
  //   ssRate = 150;
  //   night_sky.createNewShootingStar();
  // });

  // night_sky.canvas.addEventListener('mouseout', () => {
  //   ssRate = undefined;
  // });
}

night_sky.drawNightSky = function(){
  this.colorRect(0,0,this.canvas.width, this.canvas.height, "rgb(78, 47, 142)");

  //draw the moon
  this.colorCircle(moon.x,moon.y,moon.r, 'rgb(235, 64, 52)');
  this.colorCircle(moonShadow.x,moonShadow.y,moonShadow.r, 'rgb(78, 47, 142)');

  // stars
  for(var i = 0; i < stars.length; i++){
     this.colorCircle(stars[i].x,stars[i].y,stars[i].r, 'rgb(253,251,248)');
  }

  // twinkle
  for (let i = 0; i < twinkleStars.length; i++) {
    twinkleStars[i].dir == 1 ? stars[twinkleStars[i].i].r += 0.06 : stars[twinkleStars[i].i].r -= Math.min(0.06, stars[twinkleStars[i].i].r - twinkleStars[i].r);

    if(stars[twinkleStars[i].i].r >= 2){
      twinkleStars[i].dir = -1;
    }

    if(stars[twinkleStars[i].i].r <= twinkleStars[i].r){
      twinkleStars[i] = { i: Math.floor(Math.random()*stars.length), dir: 1 };
      twinkleStars[i].r = stars[twinkleStars[i].i].r;
    }
  }

  // shooting star code
  for (let i = 0; i < shootingStars.length; i++) {
    this.drawLine(shootingStars[i].start.x+Math.cos(shootingStars[i].ang)*shootingStars[i].distFar, 
                  shootingStars[i].start.y+Math.sin(shootingStars[i].ang)*shootingStars[i].distFar, 
                  shootingStars[i].start.x+Math.cos(shootingStars[i].ang)*shootingStars[i].distNear, 
                  shootingStars[i].start.y+Math.sin(shootingStars[i].ang)*shootingStars[i].distNear, 
                  1, "rgb(253,251,248)", "rgba(253,251,248,0.3)");

    if(shootingStars[i].fazeTwo == false){
        shootingStars[i].distFar += shootingStars[i].vel;
    }else{
        shootingStars[i].distNear += shootingStars[i].vel*1.5;
    }
  }

  // delete balls off screen
  for (let i = shootingStars.length-1; i >= 0; i--) {
    let x = shootingStars[i].start.x+Math.cos(shootingStars[i].ang)*shootingStars[i].distFar;
    let y = shootingStars[i].start.y+Math.sin(shootingStars[i].ang)*shootingStars[i].distFar;
    let dist = distanceOfTwoPoints(x, y, shootingStars[i].start.x, shootingStars[i].start.y);

    if(shootingStars[i].fazeTwo == false && dist > 800){
      shootingStars[i].fazeTwo = true;
      continue;
    }

    x = shootingStars[i].start.x+Math.cos(shootingStars[i].ang)*shootingStars[i].distNear;
    y = shootingStars[i].start.y+Math.sin(shootingStars[i].ang)*shootingStars[i].distNear;
    dist = distanceOfTwoPoints(x, y, shootingStars[i].start.x, shootingStars[i].start.y);

    if(dist > 800){
      shootingStars.splice(i, 1);
    }
  }
}


night_sky.createNewShootingStar = function(){
  shootingStars.push(new ShootingStar());

  // if(!ssRate){
    setTimeout(night_sky.createNewShootingStar, 3000+Math.random()*5000);
    // return;
  // }

  // setTimeout(night_sky.createNewShootingStar, ssRate);
}
