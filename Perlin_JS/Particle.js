var r = 25;
var g = 25;
var b = 142;
var rDir = 1;
var gDir = 1;
var bDir = 1;
var dirMag = 0.2;


function Particle() {

  this.mag = 1 + Math.random() * 1;
  this.angle = 0;

  this.posX = Math.random()*canvas.width;
  this.posY = Math.random()*canvas.height;

  this.update = function() {
    this.posX += Math.cos(this.angle);
    this.posY += Math.sin(this.angle);
  }

  this.randomize = function(){
    this.posX = Math.random()*canvas.width;
    this.posY = Math.random()*canvas.height;
  }



  this.show = function() {

    
    // b += bDir;
    // if (b > 255) {
    //   bDir = -dirMag;
    // }else if(b < 220){
    //   bDir = dirMag;
    // }

    colorCircle(this.posX,this.posY, 0.5, 'rgba('+r+','+g+','+b+', 0.3)')
  }

  this.edges = function() {
    if (this.posX > canvas.width+10) {
      this.pickRandomSide();
    }
    if (this.posX < -10) {
      this.pickRandomSide();
    }
    if (this.posY > canvas.height+10) {
      this.pickRandomSide();
    }
    if (this.posY < -10) {
      this.pickRandomSide();
    }
  }

  this.pickRandomSide = function(){
    let seed = Math.random();
    if(seed<0.25){
      this.posX = -10;
      this.posY = Math.random() * canvas.height;
    }else if(seed>=0.25 && seed<0.5){
      this.posX = canvas.width + 10;
      this.posY = Math.random() * canvas.height;
    }else if(seed>=0.5 && seed<0.75){
      this.posY = -10;
      this.posX = Math.random() * canvas.width;
    }else{
      this.posY = canvas.height + 10;
      this.posX = Math.random() * canvas.width;
    }
  }

  this.follow = function(grid){
      var col = Math.floor((this.posX + SCALE) / SCALE);
      var row = Math.floor((this.posY + SCALE) / SCALE);
      var index = row * cols + col;

      if(index < 0 || index > flowFeild.length-1){
        return;
      }

      this.angle = grid[index]
  }
}


function updateColor(){
    r += rDir;
    if (r > 100) {
      rDir = -dirMag;
    }else if(r < 0){
      rDir = dirMag;
    }
    g += gDir;
    if (g > 50) {
      gDir = -dirMag;
    }else if(g < 0){
      gDir = dirMag;
    }
}