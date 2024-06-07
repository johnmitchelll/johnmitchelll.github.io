var art1 = new DrawableSurface('art1_canvas');

var shootingStars = [];

art1.draw = function(){
    this.colorRect(0,0,this.canvas.width, this.canvas.height, "rgb(18, 18, 18)");

    let interval = Math.PI/32;

    let startx = this.canvas.offsetWidth/2;
    let starty = this.canvas.offsetHeight/2;

    // vert lines
    for (let i = 2*Math.PI/16; i <= 14*Math.PI/16+0.01; i += interval) {
        this.drawLine(startx, starty, startx+Math.cos(i)*1000, starty+Math.sin(i)*1000, 1, "rgb(255,255,255)", "rgb(255,255,255)");
        this.drawLine(startx, starty, startx+Math.cos(i)*1000, starty-Math.sin(i)*1000, 1, "rgb(255,255,255)", "rgb(255,255,255)");
    }

    // horz lines
    for (let i = 0; i <= 122.5; i += 12.25) {
        let c = i / Math.max(Math.sin(14*Math.PI/16), 0.000001);

        this.drawLine(startx+Math.cos(14*Math.PI/16)*c, starty+i, startx-Math.cos(14*Math.PI/16)*c, starty+i, 0.5, "rgb(255,255,255)", "rgb(255,255,255)");
        this.drawLine(startx+Math.cos(14*Math.PI/16)*c, starty+i*-1, startx-Math.cos(14*Math.PI/16)*c, starty+i*-1, 0.5, "rgb(255,255,255)", "rgb(255,255,255)");
    }

    // shooting star code
    for (let i = 0; i < shootingStars.length; i++) {

        // let disOfPoints = distanceOfTwoPoints(startx+Math.cos(shootingStars[i].ang)*shootingStars[i].distFar, starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distFar*shootingStars[i].dir,
        // startx+Math.cos(shootingStars[i].ang)*shootingStars[i].distNear, starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distNear*shootingStars[i].dir);

        // for (let j = 0; j < Math.abs(disOfPoints); j += Math.abs(disOfPoints)/30) {
        //     this.colorCircle(startx+Math.cos(shootingStars[i].ang)*(shootingStars[i].distFar-j), 
        //                     starty+Math.sin(shootingStars[i].ang)*(shootingStars[i].distFar-j)*shootingStars[i].dir, 
        //                     Math.min((shootingStars[i].distFar-j+1)/10, 6), 
        //                     "rgb("+235*j/Math.abs(disOfPoints)+", "+64*j/Math.abs(disOfPoints)+", "+52*j/Math.abs(disOfPoints)+")");
        // }

        // this.colorCircle(startx+Math.cos(shootingStars[i].ang)*shootingStars[i].distFar, starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distFar*shootingStars[i].dir, Math.min(shootingStars[i].distFar/10, 6), "red");
        // this.colorCircle(startx+Math.cos(shootingStars[i].ang)*shootingStars[i].distNear, starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distNear*shootingStars[i].dir, Math.min(shootingStars[i].distNear/10, 4), "red");

        this.drawLine(startx+Math.cos(shootingStars[i].ang)*shootingStars[i].distFar, starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distFar*shootingStars[i].dir, 
        startx+Math.cos(shootingStars[i].ang)*shootingStars[i].distNear, starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distNear*shootingStars[i].dir, 2, "rgb(18,18,18)", "rgb(255, 255, 255)");

        if(shootingStars[i].fazeTwo == false){
            shootingStars[i].distFar += shootingStars[i].vel;
        }else{
            shootingStars[i].distNear += shootingStars[i].vel*2;
        }
        
    }

    // delete balls offscreen
    for (let i = shootingStars.length-1; i >= 0; i--) {
        let y1 = starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distFar*shootingStars[i].dir;

        if(shootingStars[i].fazeTwo == false && (y1 - shootingStars[i].distFar/10 > this.canvas.height || y1 + shootingStars[i].distFar/10 < 0)){
            shootingStars[i].fazeTwo = true;
            continue;
        }

        let y2 = starty+Math.sin(shootingStars[i].ang)*shootingStars[i].distNear*shootingStars[i].dir;
        
        if(y2 - shootingStars[i].distNear/10 > this.canvas.height || y2 + shootingStars[i].distNear/10< 0){
            shootingStars.splice(i, 1);
        }
    }
}

// 

art1.createNewShootingStar = function(){
    let shootingStar = new ShootingStar(); 

    if(Math.random() > 0.5){
        shootingStar.dir = -1;
    }

    shootingStar.ang = Math.random()*(14*Math.PI/16 - 2*Math.PI/16) + 2*Math.PI/16;

    shootingStars.push(shootingStar);

    setTimeout(art1.createNewShootingStar, 300);
}

function ShootingStar(ang, dir){
    this.ang = 0;
    this.distNear = 0;
    this.distFar = 0;
    this.vel = 10+Math.random()*2;
    this.dir = 1;
    this.fazeTwo = false;
}

function distanceOfTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}