
function drawEverything (){
  timer--;
  if(timer <= 0){
    for (var i = 0; i < particles.length; i++) {
       particles[i].randomize();
    }

    timer = 200//Math.max(1000 / respawnNum, 200);
    respawnNum++;
  }
  
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowFeild);
    particles[i].update();
    particles[i].edges();

    if(i < particles.length/2){
      particles[i].show();
    }else{
      particles[i].show(true);
    }
  }

  canvasAlign();
}