function Card(card, sx, sy, x, y){
    this.card = card;
    this.sx = sx;
    this.sy = sy;
    this.faceDown = false;
    this.availible = false;
    this.animate = false;
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.display = function(dx, dy, ang){
        if(this.animate){
            this.animateUpdate(dx, dy);
            return;
        }

        if(this.faceDown){
            drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, dx, dy, CARD_WIDTH, CARD_HEIGHT, ang, false);
            return;
        }

        drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, dx, dy, CARD_WIDTH, CARD_HEIGHT, ang, false);
        if(this.availible) return;

        canvasContext.save();
        canvasContext.translate(dx, dy);
        canvasContext.rotate(ang);
        colorRect(-CARD_WIDTH/2, -CARD_HEIGHT/2, CARD_WIDTH, CARD_HEIGHT, "rgba(0,0,0,0.5)")
        canvasContext.restore();
    }

    this.animateUpdate = function(dx, dy){
        let angleBetweenPosAndDestination = Math.atan2(this.y - dy, this.x - dx);

        let currentDist = distanceOfTwoPoints(this.x, this.y, this.startX, this.startY);
        let wholeDist = distanceOfTwoPoints(dx, dy, this.startX, this.startY);

        this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/30;
        this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/30;

        let percentComplete = currentDist / wholeDist;

        if(this.faceDown){
            if(percentComplete <= 0.5){
                drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT);
            }else{
                drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, 0, false);
            }
        }else{
            drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT, 0, false);
        }

        let distToTarget = distanceOfTwoPoints(dx, dy, this.x, this.y);

        // animation is done
        if(distToTarget <= 1){
            this.animate = false;
            this.faceDown = false;
        }
    }
}


function deal(){
    let deckCopy = deepCopy(cards);

    for (let i = 0; i < Math.floor(cards.length / players.length); i++) {
        for (let j = 0; j < players.length; j++) {
            let index = Math.floor(Math.random() * deckCopy.length);
            players[j].push(new Card(deckCopy[index].card, deckCopy[index].sx, deckCopy[index].sy));
            if(j != 0) players[j][players[j].length-1].faceDown = true;
            deckCopy.splice(index, 1);
        }
    }
}

function orderHands(){
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].length; j++) {
            for (let e = 0; e < players[i].length; e++) {
                if(deckOrder.indexOf(players[i][j].card) > deckOrder.indexOf(players[i][e].card)){
                    let temp = players[i][j];
                    players[i][j] = players[i][e];
                    players[i][e] = temp;
                }
            }
        }
    }
}


function placeCard(player, i){
    if(playedCards.length == 0){
        startingPlayer = turn;
        suitLed = players[player][i].card[players[player][i].card.length-1];
    }

    turn = (player + 1) % players.length;

    if(player == 0){
        playCard(player, i, CANVAS_WIDTH/2 - players[0].length/2 * CARD_WIDTH/2 + i * CARD_WIDTH/2 + CARD_WIDTH/4, CANVAS_HEIGHT-CARD_HEIGHT/2 + 30, false);
        return;
    }

    if(player == 1){
        playCard(player, i, CARD_WIDTH/2, CANVAS_HEIGHT/2 - players[1].length/2 * CARD_HEIGHT/8 + i * CARD_HEIGHT/8 + CARD_HEIGHT/16, true);
        return;
    }

    if(player == 2){
        playCard(player, i, CANVAS_WIDTH/2 - players[2].length/2 * CARD_WIDTH/4 + i * CARD_WIDTH/4 + CARD_WIDTH/8, CARD_HEIGHT/2, true);
        return;
    }

    if(player == 3){
        playCard(player, i, CANVAS_WIDTH-CARD_WIDTH/2, CANVAS_HEIGHT/2 - players[3].length/2 * CARD_HEIGHT/8 + i * CARD_HEIGHT/8 + CARD_HEIGHT/16, true);
        return;
    }
}

function playCard(player, i, x, y, faceDown){
    playedCards[player] = new Card(players[player][i].card, players[player][i].sx, players[player][i].sy, x, y);
    playedCards[player].animate = true;
    playedCards[player].faceDown = faceDown;
    playedCards[player].availible = true;
    players[player].splice(i, 1);
    highlightHighCard();
    if(turn == 0){
        playHand();
        return;
    }
    setTimeout(playHand, 500);
}

function highlightHighCard(){
    let max = -1;
    for (let i = 0; i < playedCards.length; i++) {
        if(!playedCards[i]) continue;

        let card = playedCards[i].card;
        if(card[card.length-1] != suitLed) continue;
        if(max == -1){ max = i; continue; }

        let maxCard = playedCards[max].card;
        if(CARD_RANKS.indexOf(card.slice(0, -1)) > CARD_RANKS.indexOf(maxCard.slice(0, -1))){
            max = i;
        }
    }

    highCard = playedCards[max].card;

    for (let i = 0; i < playedCards.length; i++) {
        if(!playedCards[i]) continue;
        if(i == max) continue;
        playedCards[i].availible = false;
    }
}

async function passCards(){
    if(playerPassCards.length < 3) return;

    playerPassCards = [];

    for (let i = players[0].length-1; i >= 0; i--) {
        if(!players[0][i].availible){
            players[0][i].availible = true;
            continue;
        }

        players[0][i].faceDown = true;

        players[PASS_DIR_ORDER[0][handPassType]].push(players[0][i]);

        players[0].splice(i, 1);
    }

    cpuPass();

    orderHands();

    for (let i = 0; i < brains.length; i++) {
        brains[i].cards = deepCopy(players[brains[i].id]);
        brains[i].updateAfterDeal();
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].length; j++) {
            players[i][j].availible = false;
            if(i == 0) players[i][j].faceDown = false;
        }
    }
    
    document.getElementById("pass").style.display = "none";
    document.getElementById("num_cards").style.display = "none";

    preDealPass = false;

    twoOfClubs();
}


function twoOfClubs(){
    if(players[0][0].card == "2c"){ 
        players[0][0].availible = true;
        turn = 0;
    }else{
        for (let i = 0; i < players.length; i++) {
            if(players[i][0].card == "2c"){
                turn = i;
                placeCard(i, 0);
                activateUserCards();
            }
        }
    }
}


function playHand(){
    if(turn == startingPlayer){
        // hand over
        setTimeout(nextHand, 750);
        return;
    }

    if(turn == 0){ 
        activateUserCards();
        return;
    }

    brains[turn-1].cpuPlayBestCard();
}


function activateUserCards(){
    let cards = determineUsableCards(0);
    
    deactivateUserCards();

    for (let i = 0; i < cards.length; i++) {
        players[0][cards[i]].availible = true;
    }
}

function deactivateUserCards(){
    for (let i = 0; i < players[0].length; i++) {
        players[0][i].availible = false;
    }
}


function nextHand(){
    let max = 0;

    for (let i = 1; i < playedCards.length; i++) {
        let card = playedCards[i].card;
        if(card[card.length-1] != suitLed) continue;

        let maxCard = playedCards[max].card;
        if(CARD_RANKS.indexOf(card.slice(0, -1)) > CARD_RANKS.indexOf(maxCard.slice(0, -1)) || maxCard[maxCard.length-1] != suitLed){
            max = i;
        }
    }

    let scoreToAdd = 0;

    // determine how many points the user gets
    for (let i = 0; i < playedCards.length; i++) {
        if(playedCards[i].card[playedCards[i].card.length-1] == "h"){
            scoreToAdd++;
            heartsBroken = true;
        }

        if(playedCards[i].card == "Qs") scoreToAdd += 13;
    }

    points[max] += scoreToAdd;
    initCollectCards(max);
    playedCards = [];
    turn = max;
    suitLed = undefined;
    startingPlayer = undefined;

    if(players[0].length > 0){
        setTimeout(playHand, 500);
    }else{
        setTimeout(nextTrick, 750);
    }
}

async function nextTrick(){
    handPassType = (handPassType + 1) % 4;
    heartsBroken = false;
    let moonShoot = points.indexOf(26);

    for (let i = 0; i < points.length; i++) {
        if(i == moonShoot) continue;
        if(moonShoot != -1){
            scores[i] += 26;
            continue;
        }

        scores[i] += points[i];
        points[i] = 0;
    }

    scorePage = true;
    scoresButton.style.display = "none";

    for (let i = 0; i < scores.length; i++) {
        if(scores[i] >= 100){
            gameOver = true;
            playAgainButton.style.display = "inline";
            return;
        }
    }

    setTimeout(() => {
        scorePage = false;
        scoresButton.style.display = "inline";
    
        deal();
        orderHands();
        deactivateUserCards();
        
        if(handPassType == 3){
            twoOfClubs();
            return;
        }
    
        preDealPass = true;
        document.getElementById("pass").style.display = "inline";
        document.getElementById("num_cards").style.display = "inline";
    }, 4000);
}