
function draw(){
    colorRect(0,0, canvas.width, canvas.height, "rgb(64, 89, 122)");

    if(current_screen == 0){
        draw_decals();

        draw_dealer_chips();

        draw_player_bets();
    
        draw_player_balance();
    
        draw_shoe_and_tray();
    
        draw_players_hands();
        
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].display();
        }
    
        if(game_state == 0) draw_user_bet_size();
    
        if(error_timer != -1) draw_error();
    }
    
    if(current_screen == 1){
        draw_stats();

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].display();
        }
    }

    // colorRect(0,0, canvas.width, canvas.height, "rgb(64, 89, 122)");
    // draw_decals();

    // drawText("black", "32px pixel_font", Math.floor(mouseX) + " : " +Math.floor(mouseY), mouseX, mouseY)
}

function draw_dealer_chips(){
    colorRect(CANVAS_WIDTH/2-210/2, 30, 210, 160, "rgb(58, 58, 58)");

    for (let i = 0; i < 5; i++) {
        colorRect(CANVAS_WIDTH/2-162/2+i*34-3.5, 35, 32, 140, "rgb(37, 37, 37)");

        for (let j = 0; j < RANDOM_CHIP_VALUES[i]; j++) {
            drawImageFromSpriteSheetWithRotation(CHIP_PIC_REF[i], CHIP_SOURCE_X_REF[i], 0, 30, 30, CANVAS_WIDTH/2-162/2+i*34+13, 30+j, 30, 30, 0, false)
        }
    }
}

function draw_player_bets(){
    
    for (let i = 0; i < PLAYER_CIRCLE_POS.length; i++) {    
        let color = "rgb(255,255,255)";
        if(turn != -1 && turn != i) color = "rgb(152, 152, 152)"
        colorNoFillCircle(PLAYER_CIRCLE_POS[i][0], PLAYER_CIRCLE_POS[i][1], 40, color, 5);
    
        let width = 0;

        for (let j = 0; j < players[i].bet_chips.length; j++) {
            drawImageFromSpriteSheetWithRotation(CHIP_PIC_REF[players[i].bet_chips[j]], CHIP_SOURCE_X_REF[players[i].bet_chips[j]], 0, 30, 30, PLAYER_CIRCLE_POS[i][0], PLAYER_CIRCLE_POS[i][1]-(j*3), 30, 30, 0, false)
        }
    
        width = measureText(players[i].bet + "$", 32, "pixel_font").width;
        drawText("black", "32px pixel_font", players[i].bet + "$", PLAYER_CIRCLE_POS[i][0]-width/2, PLAYER_CIRCLE_POS[i][1]+70);
    }
}

function draw_shoe_and_tray(){
    for (let i = 0; i < shoe.length; i++) {
        shoe[i].display(CANVAS_WIDTH-CARD_WIDTH-150-i, 100+i);
    }

    for (let i = 0; i < tray.length; i++) {
        tray[i].display();
    }
}

function draw_players_hands(){
    for (let j = 0; j < dealer.cards.length; j++) {
        dealer.cards[j].display();   
    }

    for (let i = 0; i < players.length; i++) {
        if(turn == i) continue;

        for (let j = 0; j < players[i].cards.length; j++) {
            players[i].cards[j].display();
        }
    }

    if(turn == -1) return;

    for (let j = 0; j < players[turn].cards.length; j++) {
        players[turn].cards[j].display();
    }

    if(players[turn].num_hands > 1){
        for (let i = 0; i < players[turn].cards.length; i++) {
            players[turn].cards[i].availible = true;

            if(players[turn].cards[i].hand != players[turn].hand_focus){
                players[turn].cards[i].availible = false;
            }
        }
    }
}

function draw_user_bet_size(){
    colorRect(CANVAS_WIDTH/2-193, CANVAS_HEIGHT/2-110, 380, 160, "rgb(100,100,100)");

    drawText("black", "64px pixel_font", "Place Your Bets", CANVAS_WIDTH/2-153, CANVAS_HEIGHT/2-60)
    
    for (let i = 0; i < BET_SIZES.length; i++) {
        drawImageFromSpriteSheetWithRotation(CHIP_PIC_REF[i], CHIP_SOURCE_X_REF[i], 0, 30, 30, CANVAS_WIDTH/2+i*70-140, CANVAS_HEIGHT/2, 60, 60, 0, false)
    }

    colorNoFillCircle(CANVAS_WIDTH/2+players[2].bet_size_index*70-141, CANVAS_HEIGHT/2, 35, "rgb(255,255,255)", 2);

    if(players[2].bet_chips.length > 0){
        colorCircle(CANVAS_WIDTH/2+2*70-140, CANVAS_HEIGHT/2+85, 30, "white");
        colorNoFillCircle(CANVAS_WIDTH/2+2*70-140, CANVAS_HEIGHT/2+85, 30, "black", 2);
        drawLine(CANVAS_WIDTH/2+2*70-140-10, CANVAS_HEIGHT/2+85-10, CANVAS_WIDTH/2+2*70-140+10, CANVAS_HEIGHT/2+85+10, 4,"red");
        drawLine(CANVAS_WIDTH/2+2*70-140+10, CANVAS_HEIGHT/2+85-10, CANVAS_WIDTH/2+2*70-140-10, CANVAS_HEIGHT/2+85+10, 4,"red");
    }
}

function draw_player_balance(){
    drawText("black", "32px pixel_font", "BALANCE: " + players[2].balance + "$", 25, CANVAS_HEIGHT-25)
}

function draw_error(){
    colorRect(0, CANVAS_HEIGHT/2-100, CANVAS_WIDTH, 200, "white");
    let width = measureText(ERROR_CODE[error], 64, "pixel_font").width;
    drawText("black", "64px pixel_font", ERROR_CODE[error], CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/2+16);
}

function draw_decals(){
    let blackjack = "BLACKJACK";
    let blackjack_radius = 250;

    for (let i = 0; i < blackjack.length; i++) {
        let angle = Math.PI-i/(blackjack.length-1)*Math.PI;
        drawCurvedText("rgb(150, 150, 0)", "80px pixel_font", blackjack[i], CANVAS_WIDTH/2+Math.cos(angle)*blackjack_radius, CANVAS_HEIGHT/2+Math.sin(angle)*blackjack_radius-120, angle-Math.PI/2, 80, "pixel_font");
    }

    let info = "DEALER HITS ON SOFT 17 | BLACKJACK PAYS 3:2";
    let info_radius = 250;

    for (let i = 0; i < info.length; i++) {
        let angle = Math.PI-i/(info.length-1)*Math.PI;
        drawCurvedText("rgb(0, 0, 0)", "24px pixel_font", info[i], CANVAS_WIDTH/2+Math.cos(angle)*info_radius, CANVAS_HEIGHT/2+Math.sin(angle)*info_radius-120, angle-Math.PI/2, 24, "pixel_font");
    }
}