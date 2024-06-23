var activeAreaGap = window.innerHeight/2-150;
var dynamicSliders = document.querySelectorAll("#about_me .dynamic_container");

var prevInOrOut = new Array(dynamicSliders.length);
for (let index = 0; index < dynamicSliders.length; index++) {
  prevInOrOut[index] = -1; 
}


function updateDynamicScrollers(){

  let activationDiv = document.getElementById("about_me_body");

    if(window.scrollY + window.innerHeight/2 <= activationDiv.offsetTop + activationDiv.offsetHeight/2 + activeAreaGap &&
    window.scrollY + window.innerHeight/2 >= activationDiv.offsetTop + activationDiv.offsetHeight/2 - activeAreaGap){
      for (let index = 0; index < dynamicSliders.length; index++) {
        animateHalf(true, dynamicSliders[index], index);
      }
    }else{
      for (let index = 0; index < dynamicSliders.length; index++) {
        animateHalf(false, dynamicSliders[index], index);
      }  
    }
      
}


function animateHalf(inScreen, div, index){

  if(inScreen){
    if(prevInOrOut[index] == 0 || prevInOrOut[index] == -1){
      prevInOrOut[index] = 1;
      div.style.animationPlayState = "running";

      setTimeout(() => {
        if(prevInOrOut[index] != 0){
          div.style.animationPlayState = "paused";
        }
      }, 500);
    }

    return;
  }

  if(prevInOrOut[index] == 1){
    div.style.animationPlayState = "running";

    div.addEventListener("animationiteration", () => {
      prevInOrOut[index] = 0;
      div.style.animationPlayState = "paused";
    });
  }
}
