
document.addEventListener('DOMContentLoaded', function() {
  setInterval(updateDynamicScrollers, 1000/10);
});

var activeAreaGap = 100;
var leftSliders = document.getElementsByClassName("left_slider");
var rightSliders = document.getElementsByClassName("right_slider");
var dynamicSliders = document.querySelectorAll("#about_me .dynamic_container")

const PERCENT_STOPPING = 1;

function updateDynamicScrollers(){

    for (let index = 0; index < dynamicSliders.length; index++) {
      dynamicSliders[index].style.height = (dynamicSliders[index].childNodes[1].offsetHeight+20) + "px";
    }


    for (let index = 0; index < leftSliders.length; index++) {

      if(window.scrollY + window.innerHeight/2 <= leftSliders[index].offsetTop + leftSliders[index].offsetHeight/2 + window.innerHeight/2-activeAreaGap &&
      window.scrollY + window.innerHeight/2 >= leftSliders[index].offsetTop + leftSliders[index].offsetHeight/2 - window.innerHeight/2+activeAreaGap){
          moveLeftDiv(true, leftSliders[index]);
      }else{
          moveLeftDiv(false, leftSliders[index]);
      }
      
    }

    for (let index = 0; index < rightSliders.length; index++) {

      if(window.scrollY + window.innerHeight/2 <= rightSliders[index].offsetTop + rightSliders[index].offsetHeight/2 + window.innerHeight/2-activeAreaGap &&
      window.scrollY + window.innerHeight/2 >= rightSliders[index].offsetTop + rightSliders[index].offsetHeight/2 - window.innerHeight/2+activeAreaGap){
          moveRightDiv(true, rightSliders[index]);
      }else{
          moveRightDiv(false, rightSliders[index]);
      }

    }
}


function moveLeftDiv(forward, div){
  if(forward){

    if(div.offsetLeft > window.innerWidth-window.innerWidth*PERCENT_STOPPING+30){
      div.style.animationPlayState = "running";
    }else{
      div.style.animationPlayState = "paused";
    }

    return;
  }

  if(div.offsetLeft < window.innerWidth){
    div.style.animationPlayState = "running";
  }else{
    div.style.animationPlayState = "paused";
  }
}

function moveRightDiv(forward, div){
  if(forward){

    if(div.offsetLeft+div.offsetWidth < window.innerWidth*PERCENT_STOPPING-30){
      div.style.animationPlayState = "running";
    }else{
      div.style.animationPlayState = "paused";
    }

    return;
  }

  if(div.offsetLeft+div.offsetWidth > 0){
    div.style.animationPlayState = "running";
  }else{
    div.style.animationPlayState = "paused";
  }
}