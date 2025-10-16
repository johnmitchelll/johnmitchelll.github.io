

function init_menu_items(){
    deal_button = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT-200, "DEAL NOW", true, () => {
        if(players[2].bet == 0){
            error = 1;
            error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
            return;
        }

        place_bets();
    });

    hit_button = new Button(CANVAS_WIDTH/2-45, CANVAS_HEIGHT/2+10, "HIT", false, () => {
        double_button.clickable = false;
        split_button.clickable = false;
        players[2].hit();
    });
    stand_button = new Button(CANVAS_WIDTH/2+45, CANVAS_HEIGHT/2+10, "STAND", false, () => {
        players[2].stand();
    });
    double_button = new Button(CANVAS_WIDTH/2-140, CANVAS_HEIGHT/2+10, "DOUBLE", false, () => {
        if(!double_button.clickable) return;
        players[2].double();
    });
    split_button = new Button(CANVAS_WIDTH/2+140, CANVAS_HEIGHT/2+10, "SPLIT", false, () => {
        if(!split_button.clickable) return;
        players[2].split();
    });

    split_button = new Button(CANVAS_WIDTH/2+140, CANVAS_HEIGHT/2+10, "SPLIT", false, () => {
        if(!split_button.clickable) return;
        players[2].split();
    });

    stats_button = new Button(100, 60, "STATS‎ ‎ ‎", true, () => {
        current_screen = 1;

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].visible = false;
        }

        back_button.visible = true;
    });

    back_button = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT-CANVAS_HEIGHT/4+100, "BACK", false, () => {
        current_screen = 0;
        back_button.visible = false;
        stats_button.visible = true;
        if(game_state == 2) turn_on_bet_buttons();
        if(game_state == 0) deal_button.visible = true;
    });
    
    buttons.push(deal_button);
    buttons.push(hit_button);
    buttons.push(stand_button);
    buttons.push(double_button);
    buttons.push(split_button);
    buttons.push(stats_button);
    buttons.push(back_button);
}

function turn_off_bet_butttons(){
    hit_button.visible = false;
    stand_button.visible = false;
    double_button.visible = false;
    split_button.visible = false;
    game_state = 3;
}

function turn_on_bet_buttons(){
    hit_button.visible = true;
    stand_button.visible = true;

    double_button.visible = true;
    double_button.clickable = true;

    split_button.visible = true;
    split_button.clickable = false;
    let card_one = players[2].cards[0].card.slice(0,-1);
    let card_two = players[2].cards[1].card.slice(0,-1);

    if(players[2].num_hands > 1){
        card_one = players[2].hands[players[2].hand_focus][0].card.slice(0,-1);
        card_two = players[2].hands[players[2].hand_focus][1].card.slice(0,-1);
    }

    if(card_one == card_two) split_button.clickable = true;
    if(get_spliced_card_value(card_one) == 10 && get_spliced_card_value(card_two) == 10) split_button.clickable = true;
    game_state = 2;
}