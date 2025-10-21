var mouseX;
var mouseY;
var prevMouseDown = false;
var mouseDown = false;

const ENTER = 13;
var keyHeld_Enter = false;

function updateMousePos(evt) {
	mouseX = (evt.clientX - canvas.offsetLeft) / canvas.offsetWidth * CANVAS_WIDTH;
    mouseY = (evt.clientY - canvas.offsetTop) / canvas.offsetHeight * CANVAS_HEIGHT;
}

function handleMouseUp(evt) {
	// evt.preventDefault();
	mouseDown = false;
    prevMouseDown = false;
    scroll_bar_held = false;
}

function handleMouseDown(evt){
	// evt.preventDefault();
	mouseDown = true;
	scene.click();
    prevMouseDown = true;
}

function handleCardClick(){
    if(!inputAllowed || hover_index == undefined) return;

    if(game.attacker == 0) userAttack();
    if(game.defender == 0) userDefend();
}

function handleCardsHover(){
    if(!inputAllowed || game.defender == 0 && game.defended == false || game.defender != 0 && game.attacker != 0) return;

    const PLAYER_HAND = [
        CANVAS_WIDTH/2 - ((game.players[0].length-1) * playerHandCardGap + CARD_WIDTH)/2, 
        CANVAS_HEIGHT - CARD_HEIGHT - 20, 
        (game.players[0].length-1) * playerHandCardGap + CARD_WIDTH, CARD_HEIGHT
    ];

    if(mouseX > PLAYER_HAND[0] && mouseY > PLAYER_HAND[1] && mouseX < PLAYER_HAND[0] + PLAYER_HAND[2] && mouseY < PLAYER_HAND[1] + PLAYER_HAND[3]){
        let availibleCards = getAvailibleCardIndexes();

        updateHoverIndex(PLAYER_HAND);

        document.body.style.cursor = "pointer";

        if((game.defender == 0 || game.attacker == 0) && !availibleCards.includes(hover_index)){
            if(prev_hover_index != undefined) game.resetPlayerHandPlacement(0, 10, false);
            hover_index = undefined;
            prev_hover_index = undefined;
            return;
        }

        if(prev_hover_index == hover_index) return;

        game.resetPlayerHandPlacement(0, 10, false);

        game.players[0][hover_index].dy -= CARD_HEIGHT/3;

        for (let i = 0; i < game.players[0].length; i++) {
            if(i == hover_index) continue;

            if(i < hover_index) game.players[0][i].dx -= (CARD_WIDTH - playerHandCardGap);
            if(i > hover_index) game.players[0][i].dx += (CARD_WIDTH - playerHandCardGap);
        }

        prev_hover_index = hover_index;
        return;
    }

    document.body.style.cursor = "default";

    if(hover_index != undefined){
        game.resetPlayerHandPlacement(0, 10, false);
        hover_index = undefined;
        prev_hover_index = undefined;
    }
}

function updateHoverIndex(PLAYER_HAND){
    if(hover_index == undefined){
        hover_index = Math.floor((mouseX - PLAYER_HAND[0]) / playerHandCardGap);
        hover_index = Math.min(hover_index, game.players[0].length-1);
        return;
    }

    for (let i = 0; i < game.players[0].length; i++) {
        if(i == hover_index && mouseX > PLAYER_HAND[0] + i * playerHandCardGap && mouseX < PLAYER_HAND[0] + i * playerHandCardGap + CARD_WIDTH){
            hover_index = i;
            return;
        }

        if(i < hover_index && mouseX > PLAYER_HAND[0] + i * playerHandCardGap - (CARD_WIDTH - playerHandCardGap) && mouseX < PLAYER_HAND[0] + i * playerHandCardGap + playerHandCardGap){
            hover_index = i;
            return;
        }

        if(i > hover_index && mouseX > PLAYER_HAND[0] + i * playerHandCardGap + (CARD_WIDTH - playerHandCardGap) && mouseX < PLAYER_HAND[0] + i * playerHandCardGap + (CARD_WIDTH - playerHandCardGap) + playerHandCardGap){
            hover_index = i;
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
