var r = 78;
var g = 47;
var b = 142;

const STEPS = 30;
const R_DIR_MAG = (235 - r) / STEPS;
const G_DIR_MAG = (64 - g) / STEPS;
const B_DIR_MAG = (b - 52) / STEPS;

var rDir = R_DIR_MAG;
var gDir = G_DIR_MAG;
var bDir = -B_DIR_MAG;


function Particle() {

  this.mag = 1 + Math.random() * 1;
  this.angle = 0;

  this.posX = Math.random()*perlinCanvas.canvas.width;
  this.posY = Math.random()*perlinCanvas.canvas.height;

  this.update = function() {
    this.posX += Math.cos(this.angle);
    this.posY += Math.sin(this.angle);
  }

  this.randomize = function(){
    this.posX = Math.random()*perlinCanvas.canvas.width;
    this.posY = Math.random()*perlinCanvas.canvas.height;
  }

  this.show = function(color) {
    if(color){
      perlinCanvas.colorCircle(this.posX,this.posY, 0.5, 'rgba(35, 25, 112, 0.5)')
      // perlinCanvas.colorCircle(this.posX,this.posY, 0.5, 'rgba('+r+','+g+','+b+','+0.4+'')
    }else{
      perlinCanvas.colorCircle(this.posX,this.posY, 0.5, 'rgba(235, 64, 52, 0.1)')
    }
    
  }

  this.edges = function() {
    if (this.posX > perlinCanvas.canvas.width+10) {
      this.pickRandomSide();
    }
    if (this.posX < -10) {
      this.pickRandomSide();
    }
    if (this.posY > perlinCanvas.canvas.height+10) {
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
      this.posY = Math.random() * perlinCanvas.canvas.height;
    }else if(seed>=0.25 && seed<0.5){
      this.posX = perlinCanvas.canvas.width + 10;
      this.posY = Math.random() * perlinCanvas.canvas.height;
    }else if(seed>=0.5 && seed<0.75){
      this.posY = -10;
      this.posX = Math.random() * perlinCanvas.canvas.width;
    }else{
      this.posY = perlinCanvas.canvas.height + 10;
      this.posX = Math.random() * perlinCanvas.canvas.width;
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
    if (r > 235) {
      rDir = -R_DIR_MAG;
    }else if(r < 78){
      rDir = R_DIR_MAG;
    }

    g += gDir;
    if (g > 64) {
      gDir = -G_DIR_MAG;
    }else if(g < 47){
      gDir = G_DIR_MAG;
    }

    b += bDir;
    if (b > 142) {
      bDir = -B_DIR_MAG;
    }else if(b < 52){
      bDir = B_DIR_MAG;
    }
}