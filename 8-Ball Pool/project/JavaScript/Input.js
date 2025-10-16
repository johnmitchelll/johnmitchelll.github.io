var mouseX;
var mouseY;
var mouseDown = false;
var prevMouseDown = false;
var mouseDisabled = false;

const SPACE = 32;
const ENTER = 13;
const UP = 38
const RIGHT = 39;
const DOWN = 40;
const LEFT = 37;

var keyHeld_Space = false;

function updateMousePos(evt) {
	evt.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

function handleDeviceOrientation(){
	if(Math.abs(window.orientation) == 90){
		//landscape
		return 0;
	}else{
		//portrait
		return 1;
	}
}

function handleMouseOrTapDown(evt) {
	evt.preventDefault();
	if(event.changedTouches){
		mouseX = event.changedTouches[0].pageX;
		mouseY = event.changedTouches[0].pageY;
	}

	mouseDown = true;	
}

function handleMouseOrTapUp(evt){
	evt.preventDefault();
	mouseDown = false;
}

function touchMove(evt){
	evt.preventDefault();
	if(event.changedTouches[0]){
		mouseX = event.changedTouches[0].pageX;
		mouseY = event.changedTouches[0].pageY;
	}

	mouseDown = true;
}


document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', handleMouseOrTapDown, false);
document.addEventListener('mouseup', handleMouseOrTapUp, false);

//the { passive: false } makes it so that the window will not scroll with the users movement
//it will also get rid of the touch delay on mobile devices 
document.addEventListener('touchstart', handleMouseOrTapDown, { passive: false });
document.addEventListener('touchend', handleMouseOrTapUp, { passive: false });
document.addEventListener('touchmove', touchMove, { passive: false });


function setKeyHoldState(thisKey, setTo) {
	if(thisKey == SPACE){
		keyHeld_Space = setTo;
	}
}

function keyPressed(evt){
	setKeyHoldState(evt.keyCode, true);
	currentScene.onAction(evt.keyCode);
	evt.preventDefault();
}

function keyReleased(evt){
	setKeyHoldState(evt.keyCode, false);
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);
