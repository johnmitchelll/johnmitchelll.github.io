

function userAttack(){
    let attackCards = game.getAttackCards(0);

    if(!attackCards.includes(hover_index)) return;

    game.attacks.push([game.players[game.attacker][hover_index]]);
    game.players[game.attacker].splice(hover_index, 1);

    game.resetPlayerHandPlacement(game.attacker, 20, false);
    game.organizeAttackCards();

    BITA_BUTTON.visible = false;
    inputAllowed = false;
    hover_index = undefined;
    prev_hover_index = undefined;
    CARD3.play();

    game.playDefense();
}

function userDefend(){
    let defendCards = game.getDefendingCards(0);

    let containsCard = false;
    let defendingIndex = -1;

    for (let i = 0; i < defendCards.length; i++) {
        if(defendCards[i] == hover_index){
            containsCard = true;
            defendingIndex = i;
            break;
        }
    }

    if(!containsCard) return;

    for (let i = 0; i < game.players_done.length; i++) {
        if(game.players[i].length != 0) game.players_done[i] = false;
    }

    game.attacks[game.attacks.length-1].push(game.players[game.defender][hover_index]);
    game.players[game.defender].splice(hover_index, 1);

    game.resetPlayerHandPlacement(game.defender, 20, false);
    game.organizeAttackCards();

    SURRENDER_BUTTON.visible = false;
    inputAllowed = false;
    hover_index = undefined;
    prev_hover_index = undefined;
    CARD2.play();
    
    game.playAttack();
}

function getAvailibleCardIndexes(){
    if(game.attacker == 0) return game.getAttackCards(0);
    else if(game.defender == 0) return game.getDefendingCards();
}