


function draw(){
    scene.display();
}

function drawPlayersHands(){
    for (let i = 0; i < game.players.length; i++) {
        for (let j = 0; j < game.players[i].length; j++) {
            game.players[i][j].display();
        }
    }
} 

function drawAttackerDefender(){
    if(game.defender == -1 || game.attacker == -1) return;
    let defenseOffset = [0,0];
    let attackOffset = [0,0];
    if(game.defender == 0 && game.players[0].length >= 7) defenseOffset = [150, 220];
    if(game.attacker == 0 && game.players[0].length >= 7) attackOffset = [150, 220];

    drawImageFromSpriteSheetWithRotation(SHIELD, 0, 0, 24, 24, PLAYER_SHIELD_POS[game.defender][0]-defenseOffset[0], PLAYER_SHIELD_POS[game.defender][1]-defenseOffset[1], 50, 50, PLAYER_SHIELD_POS[game.defender][2], false, game.defended ? 1 : 0.5);
    drawImageFromSpriteSheetWithRotation(KNIFE, 0, 0, 10, 39, PLAYER_SHIELD_POS[game.attacker][0]-attackOffset[0], PLAYER_SHIELD_POS[game.attacker][1]-attackOffset[1], 10 * 80 / 39, 80, PLAYER_SHIELD_POS[game.attacker][2], false, 1);
}

function drawAttacks(){
    for (let i = 0; i < game.attacks.length; i++) {
        for (let j = 0; j < game.attacks[i].length; j++) {
            game.attacks[i][j].display();
        }
    }
}

function drawBackground(){
    // colorRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "rgba(31, 43, 103, 1)");

    for (let col = 0; col < BACKGROUND_COLS; col++) {
        for (let row = 0; row < BACKGROUND_ROWS; row++) {

            if((col + row) % 2 == 0){
                colorRect(BACKGROUND_COLS_WIDTH * col, BACKGROUND_ROWS_HEIGHT * row, BACKGROUND_COLS_WIDTH, BACKGROUND_ROWS_HEIGHT, "rgba(31, 43, 103, 1)");
            }else{
                colorRect(BACKGROUND_COLS_WIDTH * col, BACKGROUND_ROWS_HEIGHT * row, BACKGROUND_COLS_WIDTH, BACKGROUND_ROWS_HEIGHT, "rgba(30, 40, 95, 1)");
            }

            colorNoFillRect(BACKGROUND_COLS_WIDTH * col, BACKGROUND_ROWS_HEIGHT * row, BACKGROUND_COLS_WIDTH, BACKGROUND_ROWS_HEIGHT, "rgba(33, 33, 45, 0.34)");
        }
    }
}



function drawRuler(){
    drawLine(mouseX, mouseY, mouseX-21, mouseY, 2, "red");
    drawLine(mouseX, mouseY, mouseX, mouseY-21, 2, "red");
}

function drawGameOver(){
    if(!game.game_over) return;
    let dim = getTextSize(GAME_OVER[language], "128px pixel_font");
    drawText("white", "128px pixel_font", GAME_OVER[language], CANVAS_WIDTH/2-dim.width/2, CANVAS_HEIGHT/2);
}