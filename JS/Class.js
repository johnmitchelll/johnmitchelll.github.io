
function DrawableSurface(id){
  this.canvas = document.getElementById(id);
  this.canvasContext = this.canvas.getContext('2d');

  this.canvas.width = this.canvas.offsetWidth;
  this.canvas.height = this.canvas.offsetHeight;

  this.draw = function(){}

  this.drawLine = function(x1,y1,x2,y2,width,color1, color2){

      var gradient = this.canvasContext.createLinearGradient(0, 0, x2, y2);
      // Add color stops
      gradient.addColorStop(1, color2);
      gradient.addColorStop(0, color1);

      // Set the gradient as the stroke style
      this.canvasContext.strokeStyle = gradient;

      this.canvasContext.lineWidth = width;
      // this.canvasContext.strokeStyle = color;
      this.canvasContext.beginPath()
      this.canvasContext.moveTo(x1, y1);
      this.canvasContext.lineTo(x2, y2);
      this.canvasContext.stroke();
  }

  this.colorRect = function(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
      this.canvasContext.fillStyle = fillColor;
      this.canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }

  this.colorCircle = function(centerX, centerY, radius, drawColor){
      this.canvasContext.fillStyle = drawColor;
      this.canvasContext.beginPath();
      this.canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
      this.canvasContext.fill(); 
    }
    
  function drawFillTriangle(x1,y1, x2,y2, x3,y3, color){
    this.canvasContext.fillStyle = color;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x1, y1);
    this.canvasContext.lineTo(x2, y2);
    this.canvasContext.lineTo(x3, y3);
    this.canvasContext.fill();
    // canvasContext.closePath();
  }
  
}

function goBack(){
  let cover = document.createElement("div");
  cover.style.width = "100vw";
  cover.style.height = "100vh";
  cover.style.position = "fixed";
  cover.style.zIndex = "99999";
  cover.style.backgroundColor = "rgb(18,18,18)";
  container.appendChild(cover);
  cover.style.animation = "fadeIn 0.5s linear";

  setTimeout(() => {
    window.history.back();
  }, 500);
}

function goTo(path){  
  let cover = document.createElement("div");
  cover.id = "screen_cover";
  cover.style.width = "100vw";
  cover.style.height = "100vh";
  cover.style.position = "fixed";
  cover.style.zIndex = "99999";
  cover.style.backgroundColor = "rgb(18,18,18)";
  container.appendChild(cover);
  cover.style.animation = "fadeIn 0.5s linear";

  setTimeout(() => {
    window.location.href = path;
  }, 500);
}


function calculateCollegeProgress(){
  let start = new Date('2021-08-19T12:00:00').getTime();
  let end = new Date('2025-12-10T12:00:00').getTime();
  let now = Date.now();

  let dist = end - start;
  let progress = now - start;

  let percent = Math.floor(progress / dist * 100);

  document.getElementById("college_progress").innerHTML = Math.min(percent, 100)  + "%";
  document.getElementById("loading_bar_progress").style.width = Math.min(percent, 100)  + "%";
}


function setCSSVars(){
  document.documentElement.style.setProperty('--small4-width', document.getElementById("small_4").offsetWidth + "px");

  let small4_divs = document.querySelectorAll("#small_4 div");

  for (let i = 0; i < small4_divs.length; i++) {
    small4_divs[i].style.width = small4_divs[i].children[0].offsetWidth + "px";
  }
}

var small2Index = 0;

function small2Animate(){
  let divs = document.querySelectorAll("#small_2 h3");

  divs[small2Index].className = "small2_list_soft";

  small2Index = (small2Index + 1) == divs.length ? 0 : (small2Index + 1);

  divs[small2Index].className = "small2_list_strong";

  setTimeout(small2Animate, 1000+Math.random()*2000);
}


function canvasAlign(){
	if(prevWindowDimentions.width == window.innerWidth && prevWindowDimentions.height == window.innerHeight){
    return;
	}

  clearTimeout(perlinRefreshTimer);
  clearInterval(perlinInterval);
  perlinRefreshTimer = undefined;
  perlinInterval = undefined;

  perlinCanvas.colorRect(0, 0, perlinCanvas.canvas.width, perlinCanvas.canvas.height, "rgb(18,18,18)");

  document.documentElement.style.setProperty('--small4-width', document.getElementById("small_4").offsetWidth + "px");

  startPerlin();
}


function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}

function distanceOfTwoPoints(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function getAngleWithXAxis(point) {
  const { x, y } = point;
  const angle = Math.atan2(y, x);
  return angle;
}

function cycleThroughImages(div){
  let children = div.children;

  setTimeout(() => {
    cycleThroughImages(div)
  }, 5000);

  for (let i = 0; i < children.length; i++) {
    if(children[i].className == "display_image"){
      children[i].className = "";

      if(i == children.length-1){
        children[0].className = "display_image";
        return;
      }

      children[i+1].className = "display_image";
      return;
    }
  }
}



function runFade() {
    const oldCover = document.getElementById('screen_cover');
    if (oldCover) oldCover.remove();

    const el = document.getElementById('container');
    if (!el) return;

    el.classList.remove('fade-in');
    void el.offsetWidth; // reflow
    el.classList.add('fade-in');
}

document.addEventListener('DOMContentLoaded', runFade);
window.addEventListener('pageshow', runFade);