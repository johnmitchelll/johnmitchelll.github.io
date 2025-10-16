// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;
var prevMouseDown = false;

const KEYS = ["W", "A", "S", "D", "ARROWUP", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT", " ", "SHIFT"];

var held_keys = {  };
KEYS.forEach(key => { held_keys[key] = false; });

function keyPressed(evt){ 
    held_keys[evt.key.toUpperCase()] = true;
    evt.preventDefault();
}

function keyReleased(evt){ 
    held_keys[evt.key.toUpperCase()] = false;
    evt.preventDefault();
}


document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyReleased);;

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mouseup', setMouseUp);
document.addEventListener('mousedown', setMouseDown);

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();

  let width = document.getElementById("canvas").style.width;
  let height = document.getElementById("canvas").style.height;

  width = parseFloat(width.slice(0, -2));
  height = parseFloat(height.slice(0, -2));

  mouseX = (evt.clientX - rect.left)/width * CANVAS_WIDTH;
  mouseY = (evt.clientY - rect.top)/height  * CANVAS_HEIGHT;
}

function setMouseDown(evt){
    mouseDown = true;
}

function setMouseUp(evt){
    mouseDown = false;
}