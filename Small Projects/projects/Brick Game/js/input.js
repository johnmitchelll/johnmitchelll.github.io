var mouseX;
var mouseY;
var prevMouseDown = false;
var mouseDown = false;
var pieceHeld = false;

const ENTER = 13;
var keyHeld_Enter = false;

function updateMousePos(evt) {
	// evt.preventDefault();
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = (event.clientX - canvas.offsetLeft) / canvas.offsetWidth * CANVAS_WIDTH;
    mouseY = (event.clientY - canvas.offsetTop) / canvas.offsetHeight * CANVAS_HEIGHT;
}

function handlePieceClick(x, y, w, h, i){
	if(brainActivated) return;
	if(mouseDown == false) usablePieces[i][3] = 0;

	if(pieceHeld == false && prevMouseDown == false && mouseDown == true && mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h){
		usablePieces[i][3] = 1;
		pieceHeld = true;
	}
}

function handleMouseUp(evt) {
	// evt.preventDefault();
	mouseDown = false;
	pieceHeld = false;
	assignToGrid();
}

function handleMouseDown(evt){
	// evt.preventDefault();

	if(gameOver){
		setUp();
		return;
	}

	mouseDown = true;
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', handleMouseDown, false);
document.addEventListener('mouseup', handleMouseUp, false);

function setKeyHoldState(thisKey, setTo) {
	if(thisKey == ENTER){
		keyHeld_Enter = setTo;
	}
}

function keyPressed(evt){
	setKeyHoldState(evt.keyCode, true);
	// evt.preventDefault();
}

function keyReleased(evt){
	setKeyHoldState(evt.keyCode, false);
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);
