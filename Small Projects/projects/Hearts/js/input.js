var mouseX;
var mouseY;
var prevMouseDown = false;
var mouseDown = false;

const ENTER = 13;
var keyHeld_Enter = false;

function updateMousePos(evt) {
	// evt.preventDefault();
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = (event.clientX - canvas.offsetLeft) / canvas.offsetWidth * CANVAS_WIDTH;
    mouseY = (event.clientY - canvas.offsetTop) / canvas.offsetHeight * CANVAS_HEIGHT;
}

function handleMouseUp(evt) {
	// evt.preventDefault();
	mouseDown = false;
}

function handleMouseDown(evt){
	// evt.preventDefault();
	mouseDown = true;
	handleCardClick();
}

function handleCardClick(){
	if(scorePage) return;

	for (let i = players[0].length-1; i >= 0; i--) {
		let left = CANVAS_WIDTH/2 - players[0].length/2 * CARD_WIDTH/2 + i * CARD_WIDTH/2 + CARD_WIDTH/4 - CARD_WIDTH/2;
		let right = CANVAS_WIDTH/2 - players[0].length/2 * CARD_WIDTH/2 + i * CARD_WIDTH/2 + CARD_WIDTH/4 + CARD_WIDTH/2;
		let top = CANVAS_HEIGHT-CARD_HEIGHT/2 + 30 - CARD_HEIGHT/2;
		let bottom = CANVAS_HEIGHT-CARD_HEIGHT/2 + 30 + CARD_HEIGHT/2;

		if(mouseX > left && mouseX < right && mouseY > top && mouseY < bottom){
			if(preDealPass){
				if(players[0][i].availible){
					players[0][i].availible = false;
					playerPassCards.pop();
					document.getElementById("num_cards").innerHTML = "PICK CARDS TO PASS: " + playerPassCards.length + " / 3"
					return;
				} 

				if(playerPassCards.length == 3) return;
				players[0][i].availible = true;
				playerPassCards.push(players[0][i]);
				document.getElementById("num_cards").innerHTML = "PICK CARDS TO PASS: " + playerPassCards.length + " / 3"
				return;
			}
			
			if(turn != 0) return;
			if(players[0][i].availible){
				placeCard(0, i);
				deactivateUserCards();
			}
			return;
		}
	}
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
