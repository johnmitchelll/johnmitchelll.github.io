async function player_play_hand(player){
    while(player.index == turn){
        let playing_hand = player.cards;
        if(player.num_hands > 1) playing_hand = player.hands[player.hand_focus];

        if(play_split(playing_hand) && player.num_hands < 4) player.split();
        else if(play_double(playing_hand)) player.double();
        else play_basic(playing_hand, player);

        await new Promise(res => setTimeout(res, 2000));
    }
}

function play_split(playing_cards){
    if(playing_cards.length > 2) return false;

    let card_one = playing_cards[0].card.slice(0,-1);
    let card_two = playing_cards[1].card.slice(0,-1);

    let able_to_split = false;

    if(card_one == card_two) able_to_split = true
    if(get_spliced_card_value(card_one) == 10 && get_spliced_card_value(card_two) == 10) able_to_split = true;

    if(able_to_split == false) return false;

    // we now have the option to split
    if(card_one == "A" || card_one == "8") return true;

    let dealer_up_card = dealer.cards[1].card.slice(0,-1);

    if(card_one == "9" && (get_spliced_card_value(dealer_up_card) >= 2 && get_spliced_card_value(dealer_up_card) <= 9)){
        return true;
    }

    if(card_one == "7" && (get_spliced_card_value(dealer_up_card) >= 2 && get_spliced_card_value(dealer_up_card) <= 8)){
        return true;
    }  

    if(card_one == "2" || card_one == "3" || card_one == "6"){
        if(get_spliced_card_value(dealer_up_card) >= 2 && get_spliced_card_value(dealer_up_card) <= 7) return true;
    }

    if(card_one == "4" && dealer_up_card == "5") return true;

    return false;
}

function play_double(playing_cards){
    if(playing_cards.length > 2) return false;

    let hand_value = calculate_hand_value(playing_cards);
    let dealer_up_card = dealer.cards[1].card.slice(0,-1);

    if(hand_value.hard){
        if(hand_value.score == 11){
            if(get_spliced_card_value(dealer_up_card) >= 2 && get_spliced_card_value(dealer_up_card) <= 10) return true;
        }

        if(hand_value.score == 10){
            if(get_spliced_card_value(dealer_up_card) >= 2 && get_spliced_card_value(dealer_up_card) <= 9) return true;
        }

        if(hand_value.score == 9){
            if(get_spliced_card_value(dealer_up_card) >= 2 && get_spliced_card_value(dealer_up_card) <= 6) return true;
        }

        return false;
    }

    // soft scores
    if(hand_value.score == 17 && (get_spliced_card_value(dealer_up_card) >= 3 && get_spliced_card_value(dealer_up_card) <= 6)){
        return true;
    }

    if(hand_value.score == 18 && (get_spliced_card_value(dealer_up_card) >= 4 && get_spliced_card_value(dealer_up_card) <= 6)){
        return true;
    }

    if(hand_value.score >= 13 && hand_value.score <= 16){
        if(dealer_up_card == "5" || dealer_up_card == "6") return true;
    }

    if(hand_value.score == 12 && dealer_up_card == "5"){
        return true;
    }

    return false;
}

function play_basic(playing_cards, player){
    let hand_value = calculate_hand_value(playing_cards);
    let dealer_up_card = dealer.cards[1].card.slice(0,-1);

    if(hand_value.hard){
        if(hand_value.score >= 13 && (dealer_up_card == "2" || dealer_up_card == "3")){
            return  player.stand();
        }

        if(hand_value.score >= 12 && (dealer_up_card == "4" || dealer_up_card == "5" || dealer_up_card == "6")){
            return  player.stand();
        }

        if(hand_value.score >= 17){
            return player.stand();
        }

        player.hit();
        return;
    }

    // soft scores
    if(hand_value.score >= 19){
        if(dealer_up_card == "9" || get_spliced_card_value(dealer_up_card) == 10) return player.stand();
    }

    if(hand_value.score >= 18) return player.stand();

    player.hit();
    return;
}