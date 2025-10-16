
function shuffle(){
    let unshuffled = shoe.concat(tray);
    let shuffled = [];

    for (let i = unshuffled.length; i > 0; i--) {
        let random_index = Math.floor(Math.random()*unshuffled.length);
        shuffled.push(deepCopyObject(unshuffled[random_index]));
        unshuffled.splice(random_index, 1);
    }

    tray = [];
    shoe = shuffled;

    for (let i = 0; i < shoe.length; i++) {
        shoe[i].dx = CANVAS_WIDTH-CARD_WIDTH-150-i;
        shoe[i].x = CANVAS_WIDTH-CARD_WIDTH-150-i;
        shoe[i].start_x = CANVAS_WIDTH-CARD_WIDTH-150-i;

        shoe[i].dy = 100+i;
        shoe[i].y = 100+i;
        shoe[i].start_y = 100+i;

        shoe[i].end_ang = 4*Math.PI/6;
        shoe[i].availible = true;
        shoe[i].flip_ang = Math.PI;
        shoe[i].a_type = "flip and slide";
    }
}

async function place_bets(){
    game_state = 1;
    deal_button.visible = false;

    players[2].original_bet = players[2].bet;

    for (let i = 0; i < players.length; i++) {
        players[i].prev_bet = players[i].bet;
        if(i == 2) continue;
        players[i].bet_chips.push(2);
        players[i].bet = 25;
        players[i].balance -= 25;
        players[i].original_bet = players[i].bet;
    }

    turn = -1;

    await deal();

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].cards.length; j++) {
            players[i].cards[j].availible = false;
        }
    }

    play_hand();
}

async function deal(){
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < players.length; i++) {
            players[i].cards.push(take_from_shoe());
            let player_card_ref = players[i].cards[players[i].cards.length-1];

            player_card_ref.animate = true;
            player_card_ref.end_ang = players[i].ang;
            organize_played_cards(players[i]);

            await new Promise(res => setTimeout(res, 500));
        }

        dealer.cards.push(take_from_shoe());
        dealer.cards[dealer.cards.length-1].animate = true;
        dealer.cards[dealer.cards.length-1].end_ang = dealer.ang;
        organize_played_cards(dealer);
        if(j == 0) dealer.cards[dealer.cards.length-1].a_type = "slide";

        await new Promise(res => setTimeout(res, 250));
    }

    return true;
}

function organize_played_cards(user){
    for (let i = 0; i < user.cards.length; i++) {
        user.cards[i].dx = user.x + Math.cos(user.ang)*i*20 + Math.cos(user.ang)*user.cards[i].hand*CARD_WIDTH;
        user.cards[i].dy = user.y + Math.sin(user.ang)*i*20 + Math.sin(user.ang)*user.cards[i].hand*CARD_WIDTH;
        user.cards[i].dx -= Math.cos(user.ang)*((user.cards.length-1)*20)/2 + Math.cos(user.ang)*(user.num_hands-1)*CARD_WIDTH/2;
        user.cards[i].dy -= Math.sin(user.ang)*((user.cards.length-1)*20)/2 + Math.sin(user.ang)*(user.num_hands-1)*CARD_WIDTH/2;
    }
}

async function play_hand(){
    let dealer_up_card = dealer.cards[1].card.slice(0,-1);
    if(dealer_up_card == "A" || dealer_up_card == "K" || dealer_up_card == "Q" || dealer_up_card == "J" || dealer_up_card == "10"){
        await new Promise(res => setTimeout(res, 1000));
        if(await peek_dealers_card() == true) return;
    }

    check_for_blackjack();
    
    turn = 0;

    for (let j = 0; j < players[turn].cards.length; j++) {
        players[turn].cards[j].availible = true;
    }
    
    await new Promise(res => setTimeout(res, 1000));
    player_play_hand(players[turn]);
}

async function continue_hand(){
    if(players[turn].num_hands > 1 && players[turn].hand_focus < players[turn].num_hands-1){
        players[turn].hand_focus++;
        if(calculate_hand_value(players[turn].hands[players[turn].hand_focus]).score == 21) continue_hand();
        if(turn == 2) turn_on_bet_buttons();
        return;
    }

    turn = (turn + 1) % players.length;

    if(turn != 0){
        for (let j = 0; j < players[turn-1].cards.length; j++) {
            players[turn-1].cards[j].availible = false;
        }

        for (let j = 0; j < players[turn].cards.length; j++) {
            players[turn].cards[j].availible = true;
        }
    }

    if(turn == 0){
        turn = -1;
        
        for (let j = 0; j < players[4].cards.length; j++) {
            players[4].cards[j].availible = false;
        }

        await new Promise(res => setTimeout(res, 1000));
        play_dealers_hand();
        return;
    }

    if(calculate_hand_value(players[turn].cards).score == 21) return continue_hand();

    if(turn == 2){
        if(current_screen == 0) turn_on_bet_buttons();
        game_state = 2;
        return;
    }

    turn_off_bet_butttons();
    await new Promise(res => setTimeout(res, 1000));
    player_play_hand(players[turn]);
}

function calculate_hand_value(hand){
    let score = 0;
    let has_ace = false;

    for (let i = 0; i < hand.length; i++) {
        let card = hand[i].card.slice(0, -1);

        if(card == "A"){
            has_ace = true;
            continue;
        } 

        score += CARD_VALUE[card];
    }

    if(!has_ace) return {score: score, hard: true};
    let hard = true;

    for (let i = 0; i < hand.length; i++) {
        let card = hand[i].card.slice(0, -1);
        if(card != "A") continue;

        if(score + 11 <= 21){
            score += 11;
            hard = false;
            continue;
        }

        if(score + 1 <= 21){
            score++;
            continue;
        }

        // in the case where we count an A as an 11 then as a one and go over. We take away 10 so we count the first A as 1
        if(hard == false){
            score -= 9;
            continue;
        }

        return {score: score+1, hard: true};
    }

    return {score: score, hard: hard};
}

async function play_dealers_hand(){
    for (let i = 0; i < 2; i++) {
        dealer.cards[i].animate = true;
        dealer.cards[i].start_x = dealer.cards[i].dx;
        dealer.cards[i].start_y = dealer.cards[i].dy;
        dealer.cards[i].x = dealer.cards[i].dx;
        dealer.cards[i].y = dealer.cards[i].dy;
        dealer.cards[i].start_ang = dealer.ang;
        dealer.cards[i].a_type = "slide";
    }

    dealer.cards[0].dx -= CARD_WIDTH/2;
    dealer.cards[1].dx += CARD_WIDTH/2;
    
    await new Promise(res => setTimeout(res, 1000));

    dealer.cards[0].animate = true;
    dealer.cards[0].a_type = "flip";

    await new Promise(res => setTimeout(res, 1000));

    for (let i = 0; i < 2; i++) {
        dealer.cards[i].animate = true;
        dealer.cards[i].start_x = dealer.cards[i].dx;
        dealer.cards[i].start_y = dealer.cards[i].dy;
        dealer.cards[i].a_type = "slide";
    }

    dealer.cards[0].dx += CARD_WIDTH/2;
    dealer.cards[1].dx -= CARD_WIDTH/2;

    await new Promise(res => setTimeout(res, 1000));

    while(calculate_hand_value(dealer.cards).score < 17 || 
         (calculate_hand_value(dealer.cards).score <= 17 && calculate_hand_value(dealer.cards).hard == false)){
            dealer.cards.push(take_from_shoe());
            dealer.cards[dealer.cards.length-1].animate = true;
            dealer.cards[dealer.cards.length-1].end_ang = dealer.ang;
            organize_played_cards(dealer);
            await new Promise(res => setTimeout(res, 1000));
    }

    await new Promise(res => setTimeout(res, 1750));

    await pay_out_players();

    turn = -1;

    await new Promise(res => setTimeout(res, 2000));

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].cards.length; j++) {
            players[i].cards[j].hand = 0;
            players[i].cards[j].animate = true;
            players[i].cards[j].start_x = players[i].cards[j].dx;
            players[i].cards[j].start_y = players[i].cards[j].dy;
            players[i].cards[j].dx = CARD_WIDTH+150;
            players[i].cards[j].dy = 150-tray.length/2;
            players[i].cards[j].start_ang = players[i].ang;
            players[i].cards[j].end_ang = Math.PI/2;
            players[i].cards[j].a_y =  "flip and slide";
            tray.push(players[i].cards[j]);
        }

        players[i].cards = [];
        players[i].hands = [];
        players[i].num_hands = 1;
        players[i].hand_focus = 0;
    }

    for (let i = 0; i < dealer.cards.length; i++) {
        dealer.cards[i].animate = true;
        dealer.cards[i].start_x = dealer.cards[i].dx;
        dealer.cards[i].start_y = dealer.cards[i].dy;
        dealer.cards[i].dx = CARD_WIDTH+150;
        dealer.cards[i].dy = 150-tray.length/2;
        dealer.cards[i].start_ang = dealer.ang;
        dealer.cards[i].end_ang = Math.PI/2;
        dealer.cards[i].a_type = "flip and slide";
        tray.push(dealer.cards[i]);
    }

    dealer.cards = [];

    await new Promise(res => setTimeout(res, 1000));

    for (let i = 0; i < players.length; i++) {
        players[i].balance += players[i].bet;
        players[i].bet = 0;
        players[i].bet_chips = [];
        players[i].original_bet = 0;
        players[i].bets = [];

        if(i == 2) hand_history.push(players[i].balance - players[i].prev_balance);

        if(players[i].balance <= 0){
            players[i].balance = 1000;
        }

        players[i].prev_balance = players[i].balance;
    }

    if(players[2].balance >= players[2].prev_bet){
        players[2].bet = players[2].prev_bet;
        players[2].balance -= players[2].prev_bet;
        add_chips_from_amount(2, players[2].prev_bet);
    }

    game_state = 0;
    if(current_screen == 0) deal_button.visible = true;
}

async function pay_out_players(){
    if(calculate_hand_value(dealer.cards).score > 21){ // if dealer busted
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j < players[i].cards.length; j++) {
                players[i].cards[j].availible = true;
            }

            await new Promise(res => setTimeout(res, 250));

            turn = i;

            if(players[i].num_hands > 1){
                for (let j = 0; j < players[i].num_hands; j++) {
                    players[i].hand_focus = j;

                    if(calculate_hand_value(players[i].hands[j]).score > 21){
                        if(players[i].bets[j] == 0) players[i].bet -= players[i].original_bet;
                        else players[i].bet -= players[i].original_bet*2;
                        players[i].bet_chips = [];
                        add_chips_from_amount(i, players[i].bet);
                        continue;
                    }

                    if(players[i].bets[j] == 0) players[i].bet += players[i].original_bet;
                    else players[i].bet += players[i].original_bet*2;
                    players[i].bet_chips = [];
                    add_chips_from_amount(i, players[i].bet);
                    await new Promise(res => setTimeout(res, 250));
                }

                players[i].hand_focus = -1;

                continue;
            }

            for (let j = 0; j < players[i].cards.length; j++) {
                players[i].cards[j].availible = false;
            }

            if(calculate_hand_value(players[i].cards).score > 21){
                players[i].bet_chips = [];
                players[i].bet = 0;
                continue; 
            }

            players[i].bet_chips = players[i].bet_chips.concat(players[i].bet_chips);
            players[i].bet *= 2;
        }
    }else{ // if dealer didnt bust
        for (let i = 0; i < players.length; i++) {  
            for (let j = 0; j < players[i].cards.length; j++) {
                players[i].cards[j].availible = true;
            }

            await new Promise(res => setTimeout(res, 250));

            turn = i;

            if(players[i].num_hands > 1){
                for (let j = 0; j < players[i].num_hands; j++) {
                    players[i].hand_focus = j;

                    if(calculate_hand_value(dealer.cards).score > calculate_hand_value(players[i].hands[j]).score || 
                       calculate_hand_value(players[i].hands[j]).score > 21){
                        if(players[i].bets[j] == 0) players[i].bet -= players[i].original_bet;
                        else players[i].bet -= players[i].original_bet*2;
                        players[i].bet_chips = [];
                        add_chips_from_amount(i, players[i].bet);
                    }else 
                    if(calculate_hand_value(dealer.cards).score < calculate_hand_value(players[i].hands[j]).score){
                        if(players[i].bets[j] == 0) players[i].bet += players[i].original_bet;
                        else players[i].bet += players[i].original_bet*2;
                        players[i].bet_chips = [];
                        add_chips_from_amount(i, players[i].bet);
                    }

                    await new Promise(res => setTimeout(res, 250));
                }

                players[i].hand_focus = -1;

                continue;
            }

            for (let j = 0; j < players[i].cards.length; j++) {
                players[i].cards[j].availible = false;
            }

            if(calculate_hand_value(dealer.cards).score > calculate_hand_value(players[i].cards).score || 
               calculate_hand_value(players[i].cards).score > 21){
                players[i].bet_chips = [];
                players[i].bet = 0;
            }else 
            if(calculate_hand_value(dealer.cards).score < calculate_hand_value(players[i].cards).score){
                players[i].bet_chips = players[i].bet_chips.concat(players[i].bet_chips);
                players[i].bet *= 2;
            }
        }
    }
}

async function peek_dealers_card(){
    dealer.cards[0].animate = true;
    dealer.cards[0].start_x = dealer.cards[0].dx;
    dealer.cards[0].start_y = dealer.cards[0].dy;
    dealer.cards[0].x = dealer.cards[0].dx;
    dealer.cards[0].y = dealer.cards[0].dy;
    dealer.cards[0].start_ang = dealer.cards[0].end_ang;
    dealer.cards[0].a_type = "slide";
    dealer.cards[0].dy -= CARD_HEIGHT/4;
    await new Promise(res => setTimeout(res, 1000));

    dealer.cards[0].animate = true;
    dealer.cards[0].start_x = dealer.cards[0].x;
    dealer.cards[0].start_y = dealer.cards[0].y;
    dealer.cards[0].start_ang = dealer.cards[0].end_ang;
    dealer.cards[0].a_type = "slide";
    dealer.cards[0].dy += CARD_HEIGHT/4;
    await new Promise(res => setTimeout(res, 1000));

    if(calculate_hand_value(dealer.cards).score == 21){
        play_dealers_hand();
        return true;
    }

    return false;
}

function check_for_blackjack(){
    for (let i = 0; i < players.length; i++) {
        if(calculate_hand_value(players[i].cards).score == 21){
            players[i].bet_chips = [];
            players[i].balance += Math.ceil(players[i].bet*2.5);
            players[i].bet = 0;
        }
    }
}

function take_from_shoe(){
    if(!shoe[0]){
        shuffle();
    }

    return shoe.pop();
}

function add_chips_from_amount(player, amount){
    let running_difference = amount;
    let chips = [];

    for (let i = BET_SIZES.length; i >= 0; i--) {
        while(running_difference >= BET_SIZES[i]){
            chips.push(i);
            running_difference -= BET_SIZES[i];
        }
    }

    players[player].bet_chips = players[player].bet_chips.concat(chips);
}

// basic one that is just for the brain
function get_spliced_card_value(card){
    if(card == "K" || card == "Q" || card == "J") return 10;
    if(card == "A") return 1;
    return parseInt(card);
}