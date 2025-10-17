// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;

var numFramesAfterClick = 0;
var lastMousePoint = {x:undefined, y:undefined};
let prevMousePoint = {x:undefined, y:undefined};

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = (evt.clientX - rect.left) - canvas.width/2;
  mouseY = (evt.clientY - rect.top) - canvas.height/2;
}

function setMouseDown(evt){
   if(evt.changedTouches && evt.changedTouches[0]){
    mouseX = evt.changedTouches[0].pageX - canvasOffSets.left - canvas.width/2;
    mouseY = evt.changedTouches[0].pageY - canvas.height/2;
  }

  mouseDown = true;

  if(mouseY > -canvas.height/2 && mouseY < canvas.height/2 
    && mouseX > -canvas.width/2 && mouseX < canvas.width/2){
    evt.preventDefault();
  }
}

function setMouseUp(evt){
  mouseDown = false;
  numFramesAfterClick = 0;

  if(mouseX > canvasOffSets.left && mouseX < canvasOffSets.right &&
     mouseY > canvasOffSets.top && mouseY < canvasOffSets.bottom){
    evt.preventDefault();
  } 
}

function touchMove(evt){
  if(evt.changedTouches && evt.changedTouches[0]){
    mouseX = evt.changedTouches[0].pageX - canvasOffSets.left - canvas.width/2;
    mouseY = evt.changedTouches[0].pageY - canvas.height/2;
  }

  mouseDown = true;

  if(mouseY > -canvas.height/2 && mouseY < canvas.height/2 
    && mouseX > -canvas.width/2 && mouseX < canvas.width/2){
    evt.preventDefault();
  } 
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', setMouseDown);
document.addEventListener('mouseup', setMouseUp);
//the { passive: false } makes it so that the window will not scroll with the users movement
//it will also get rid of the touch delay on mobile devices 
document.addEventListener('touchstart', setMouseDown, { passive: false });
document.addEventListener('touchend', setMouseUp, { passive: false });
document.addEventListener('touchmove', touchMove, { passive: false });

function handleMouseInput(){

  if(mouseDown 
    && mouseY > -canvas.height/2 && mouseY < canvas.height 
    && mouseX > -canvas.width/2 && mouseX < canvas.width){

    if(numFramesAfterClick == 0){
      lastMousePoint.x = mouseX;
      lastMousePoint.y = mouseY;
      prevMousePoint.x = mouseX;
      prevMousePoint.y = mouseY;
    }else{
      if(mouseX != prevMousePoint.x){
        let dx = mouseX - prevMousePoint.x;
        offX += dx * zoom/canvas.width;
      }
      if(mouseY != prevMousePoint.y){
        let dy = mouseY - prevMousePoint.y;
        offY += dy * zoom/canvas.height;
      }

      prevMousePoint.x = mouseX;
      prevMousePoint.y = mouseY;
    }

    numFramesAfterClick++; 
  }
}

function circlePointColision(x1,y1,r, x2,y2){
  let dist = distanceOfTwoPoints(x1, y1, x2, y2);

  return dist < r;
}

