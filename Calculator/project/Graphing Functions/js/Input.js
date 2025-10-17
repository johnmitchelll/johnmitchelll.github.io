// Mouse Input
var mouseX;
var mouseY;
var mouseYLock = false;
var mouseDown = false;
var mouseInA = false;
var mouseInB = false;
var numFramesAfterClick = 0;
var lastMousePoint = {x:undefined, y:undefined};
var prevMousePoint = {x:undefined, y:undefined};
var mousePosInWindow = {x:undefined, y:undefined};
var prevXCursor;
var cursorXControl = true;

var keyboardActive = false;
var currentKeyBoard = 0;
var currentKeyBoardCursorPostion = 0;

function getDeviceOrientation(){
  if(Math.abs(window.orientation) == 90){
    //landscape
    return 0;
  }else{
    //portrait
    return 1;
  }
}

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
    mousePosInWindow.x = evt.changedTouches[0].pageX;
    mousePosInWindow.y = evt.changedTouches[0].pageY;
  }else{
    mousePosInWindow.x = evt.clientX;
    mousePosInWindow.y = evt.clientY;
  }

  mouseDown = true;

  if(mouseY > -canvas.height/2 && mouseY < canvas.height/2 
    && mouseX > -canvas.width/2 && mouseX < canvas.width/2){
    evt.preventDefault();
  }
}

function setMouseUp(evt){
  mouseDown = false;
  mouseInA = false;
  mouseInB = false;
  numFramesAfterClick = 0;

  if(mouseY > -canvas.height/2 && mouseY < canvas.height/2 
    && mouseX > -canvas.width/2 && mouseX < canvas.width/2){
    console.log("HI")
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
    console.log("HI")
    evt.preventDefault();
  }
}

function scrollOnCanvasHandle(evt){
  if(mouseY > -canvas.height/2 && mouseY < canvas.height/2 
    && mouseX > -canvas.width/2 && mouseX < canvas.width/2){
    evt.preventDefault();

    let deltaZoom = zoom / 20;
    if(detectMouseWheelDirection(evt) == "up" && zoom - deltaZoom > 0 && zoom > 0.01){
      zoom -= deltaZoom;
    }else if(detectMouseWheelDirection(evt) == "down"){
      zoom += deltaZoom;
    }
  }
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', setMouseDown);
document.addEventListener('mouseup', setMouseUp);
document.addEventListener('mousewheel', scrollOnCanvasHandle, { passive: false});
//the { passive: false } makes it so that the window will not scroll with the users movement
//it will also get rid of the touch delay on mobile devices 
document.addEventListener('touchstart', setMouseDown, { passive: false});
document.addEventListener('touchend', setMouseUp, { passive: false});
document.addEventListener('touchmove', touchMove, { passive: false});

function handleMouseInput(){
  // console.log(mouseX, mouseY)

  let showAreaUnderCurve = false;
  for (var i = 0; i < graphs.length; i++) {
    if(graphs[i].showAreaUnderCurve){
      showAreaUnderCurve = true;
      break;
    }
  }

  if(circlePointColision((a / zoom) * canvas.width + offX * canvas.width/zoom,offY * canvas.height/zoom,10, mouseX,mouseY) 
     && mouseDown && mouseInB == false && showAreaUnderCurve){
    mouseInA  = true;
  }

  if(circlePointColision((b / zoom) * canvas.width + offX * canvas.width/zoom,offY * canvas.height/zoom,10, mouseX,mouseY) 
     && mouseDown && mouseInA == false && showAreaUnderCurve){
    mouseInB  = true;
  }

  if(mouseInA){
    a = (mouseX / canvas.width) * zoom - offX;
    document.getElementById("a_equals").value = ((mouseX / canvas.width) * zoom - offX).toFixed(3);
  }
  if(mouseInB){
    b = (mouseX / canvas.width) * zoom - offX;
    document.getElementById("b_equals").value = ((mouseX / canvas.width) * zoom - offX).toFixed(3);
  }

  if(mouseDown 
    && mouseY > -canvas.height/2 && mouseY < canvas.height/2 
    && mouseX > -canvas.width/2 && mouseX < canvas.width/2
    && mouseInA == false && mouseInB == false){

    if(numFramesAfterClick == 0){
      lastMousePoint.x = mouseX;
      lastMousePoint.y = mouseY;
      prevMousePoint.x = mouseX;
      prevMousePoint.y = mouseY;
    }else if(mousePosInWindow.x > document.getElementById("canvas").getBoundingClientRect().left && 
             mousePosInWindow.x < document.getElementById("canvas").getBoundingClientRect().left + canvas.width && 
             mousePosInWindow.y > document.getElementById("canvas").getBoundingClientRect().top && 
             mousePosInWindow.y < document.getElementById("canvas").getBoundingClientRect().top + canvas.height)
    {
        cursorXControl = true;
        if(mouseX != prevMousePoint.x){
          let dx = mouseX - prevMousePoint.x;
          offX += dx * zoom/canvas.width;
          // document.getElementById("cursorX_equals").value = -offX;
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


  if(mouseYLock){
    let outPutAtOffX = -graphs[0].func(-offX);
    if(isNaN(outPutAtOffX) == false && outPutAtOffX != undefined && Math.abs(outPutAtOffX) != Infinity){
      offY = outPutAtOffX;
    }
  }
}
