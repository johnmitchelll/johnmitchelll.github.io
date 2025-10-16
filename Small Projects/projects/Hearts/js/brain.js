var brains = [];

function Brain(id){
    this.cardsOutThere = [[{c: "Ah", b: false }, {c: "Kh", b: false }, {c: "Qh", b: false }, {c: "Jh", b: false }, {c: "10h", b: false }, {c: "9h", b: false }, {c: "8h", b: false }, {c: "7h", b: false }, {c: "6h", b: false }, {c: "5h", b: false }, {c: "4h", b: false }, {c: "3h", b: false }, {c: "2h", b: false }],
                          [{c: "As", b: false }, {c: "Ks", b: false }, {c: "Qs", b: false }, {c: "Js", b: false }, {c: "10s", b: false }, {c: "9s", b: false }, {c: "8s", b: false }, {c: "7s", b: false }, {c: "6s", b: false }, {c: "5s", b: false }, {c: "4s", b: false }, {c: "3s", b: false }, {c: "2s", b: false }],
                          [{c: "Ad", b: false }, {c: "Kd", b: false }, {c: "Qd", b: false }, {c: "Jd", b: false }, {c: "10d", b: false }, {c: "9d", b: false }, {c: "8d", b: false }, {c: "7d", b: false }, {c: "6d", b: false }, {c: "5d", b: false }, {c: "4d", b: false }, {c: "3d", b: false }, {c: "2d", b: false }],
                          [{c: "Ac", b: false }, {c: "Kc", b: false }, {c: "Qc", b: false }, {c: "Jc", b: false }, {c: "10c", b: false }, {c: "9c", b: false }, {c: "8c", b: false }, {c: "7c", b: false }, {c: "6c", b: false }, {c: "5c", b: false }, {c: "4c", b: false }, {c: "3c", b: false }, {c: "2c", b: false }]];
    this.id = id;
    this.usableCards;
    this.getCardSafeness;
    this.cardSafeness = new Array(players[this.id].length);
    this.oponentsSuits = [[1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1]];

    this.cpuPlayBestCard = function(){
        this.usableCards = determineUsableCards(this.id);
        this.cardSafeness = new Array(this.usableCards.length);
        let playType = determineUsableCards(this.id, true);
        
        this.updateCardsOutThere();
        this.getCardSafeness(playType);

        let usableWithSafeness = [];
        for (let i = 0; i < this.usableCards.length; i++) {
            usableWithSafeness.push({i: this.usableCards[i], s: this.cardSafeness[i]});
        }

        usableWithSafeness.sort(function(a, b){return b.s - a.s});

        let playCard = 0;

        if(playType == "free play" || this.dertermineIfPlayHighCard(playType)) usableWithSafeness.sort(function(a, b){return a.s - b.s});
        if(players[this.id][this.usableCards[0]].card == "Qs" && this.usableCards.length > 1) playCard = 1;

        for (let i = 0; i < usableWithSafeness.length; i++) {
            console.log(players[this.id][usableWithSafeness[i].i].card, usableWithSafeness[i].s);
        }

        placeCard(this.id, usableWithSafeness[playCard].i);

        console.log(this.id + "  //////////////////////////////////////\n////////////////////////////////////////\n\n")
    }

    this.getCardSafeness = function(playType){
        for (let j = 0; j < this.usableCards.length; j++) {
            let card = players[this.id][this.usableCards[j]].card;

            // if we are playing the same suit as led, play the highest card that will undercut the highest card played;
            if(playType == "have a card" && CARD_RANKS.indexOf(card.slice(0, -1)) < CARD_RANKS.indexOf(highCard.slice(0, -1))){
                this.cardSafeness[j] = 12 + CARD_RANKS.indexOf(card.slice(0, -1));
                continue;
            }
                
            if(card == "Qs" || card == "As" || card == "Ks"){
                this.cardSafeness[j] = -Infinity;
                continue;
            }

            let score = 0;
            let numCardsHigher = 0;
            let numOpenCardsOfTheSameSuit = 0;
            let numberOfCardsNotBurned = 0;
            let cardRank = [0, 0];
            let numPlayersAheadWithSuitStill = 0;

            for (let index = 0; index < this.cardsOutThere.length; index++) {
                for (let i = 0; i < this.cardsOutThere[index].length; i++) {
                    if(this.cardsOutThere[index][i].c == card){
                        cardRank = [index, i];
                        break;
                    }
                }
            }

            for (let i = cardRank[1] + 1; i < this.cardsOutThere[cardRank[0]].length; i++) {
                if(this.cardsOutThere[cardRank[0]][i].b == false){
                    numCardsHigher++;
                }
            }

            // how many cards are below it can unercut it
            score += (12 - numCardsHigher) / 12;

            
            for (let i = 0; i < 13; i++) {
                if(this.cardsOutThere[cardRank[0]][i].b == false) numOpenCardsOfTheSameSuit++;
            }

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 13; j++) {
                    if(this.cardsOutThere[i][j].b == false) numberOfCardsNotBurned++;
                }
            }

            for (let i = (this.id+1) % 4; i != startingPlayer && i != this.id; i = (i+1) % 4) {
                if(this.oponentsSuits[i][cardRank[0]] == 1){
                    numPlayersAheadWithSuitStill++;
                }
            }

            // what are the odds that at least one person that is up after us will have the suit we are considering playing
            let chancesOnePersonAheadHasSuit = 1 - (binomialCoefficient(numberOfCardsNotBurned - numOpenCardsOfTheSameSuit, players[(this.id+1) % 4].length) / binomialCoefficient(numberOfCardsNotBurned, players[(this.id+1) % 4].length));
            score += numPlayersAheadWithSuitStill * chancesOnePersonAheadHasSuit;

            this.cardSafeness[j] = score;
        }
    }

    this.dertermineIfPlayHighCard = function(playType){
        if(playType == "free play" || playType == "opener") return false;
        if((turn + 1) % 4 != startingPlayer) return false;

        // if we have no card that is lower than the highest card at the table
        if(CARD_RANKS.indexOf(players[this.id][this.usableCards[0]].card.slice(0, -1)) > CARD_RANKS.indexOf(highCard.slice(0, -1))){
            console.log("LOWEST CARD OF THE SUIT LED IS HIGHER THAN HIGHEST CARD ON TABLE")
            return true;
        }

        // no points on the table at the end of the hand so I am going to play the highest card I have
        for (let i = 0; i < playedCards.length; i++) {
            if(!playedCards[i]) continue;

            let card = playedCards[i].card;
            if(card[card.length-1] == "h" || card == "Qs"){
                return false;
            }
        }

        console.log("NO CARD ON TABLE THAT CAN GIVE US A POINT SO TAKING");
        return true;
    }

    this.updateCardsOutThere = function(){
        if(playedCards.length == 0) return;

        for (let j = 0; j < playedCards.length; j++) {
            if(!playedCards[j]) continue;

            for (let index = 0; index < this.cardsOutThere.length; index++) {
                for (let i = 0; i < this.cardsOutThere[index].length; i++) {
                    if(this.cardsOutThere[index][i].c == playedCards[j].card){
                        this.cardsOutThere[index][i].b = true;
                        break;
                    }
                }
            }

            if(playedCards[j].card[playedCards[j].card.length-1] != suitLed){
                this.oponentsSuits[j][SUIT_ORDER[suitLed]] = 0;
            }
        }
    }

    this.updateAfterDeal = function(){
        for (let index = 0; index < this.cardsOutThere.length; index++) {
            for (let i = 0; i < this.cardsOutThere[index].length; i++) {
                for (let j = 0; j < players[this.id].length; j++) {
                    if(this.cardsOutThere[index][i].c == players[this.id][j].card){
                        this.cardsOutThere[index][i].b = true;
                        break;
                    }
                }
            }
        }
    }
}

function cpuPass(){
    let highestCards = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];

    for (let i = 1; i < players.length; i++) {
        for (let j = 3; j < players[i].length; j++) {
            let card = players[i][j].card;

            let minHigh = 0;
            for (let e = 1; e < highestCards[i-1].length; e++) {
                let highCard = players[i][highestCards[i-1][e]].card;
                let minHighCard = players[i][highestCards[i-1][minHigh]].card;
                if(CARD_RANKS.indexOf(minHighCard.slice(0, -1)) > CARD_RANKS.indexOf(highCard.slice(0, -1)) && highCard != "Qs" && highCard != "Ks"){
                    minHigh = e;
                }
            }

            let minHighCard = players[i][highestCards[i-1][minHigh]].card;
            if(CARD_RANKS.indexOf(card.slice(0, -1)) > CARD_RANKS.indexOf(minHighCard.slice(0, -1)) || card == "Qs" || card == "Ks" || card == "As"){
                if(minHighCard == "Qs" || minHighCard == "Ks") continue;
                highestCards[i-1][minHigh] = j;
            }
        }
    }

    for (let i = 0; i < highestCards.length; i++) {
        highestCards[i].sort(function(a, b){return b - a});
    }

    for (let i = 1; i < players.length; i++) {
        for (let j = 0; j < 3; j++) {
            players[PASS_DIR_ORDER[i][handPassType]].push(players[i][highestCards[i-1][j]]);
            players[i].splice(highestCards[i-1][j], 1);
        }
    }
}



// gameStateQuery is for knowing what type of play we are 
// getting into us. We have a card, starter, we dont have the card
function determineUsableCards(player, gameStateQuery){
    let usableCards = [];

    for (let i = 0; i < players[player].length; i++) {
        let card = players[player][i].card;

        if(card[card.length-1] == suitLed){
            usableCards.push(i);
        }
    }

    if(usableCards.length == 0){
        if(gameStateQuery && !suitLed) return "opener";
        if(gameStateQuery && suitLed) return "free play";

        let hasOnlyHearts = true;
        for (let i = 0; i < players[player].length; i++) {
            let card = players[player][i].card;
            if(card[card.length-1] != "h"){
                hasOnlyHearts = false;
                break;
            }
        }

        for (let i = 0; i < players[player].length; i++) {
            let card = players[player][i].card;
            if(playedCards.length == 0 && heartsBroken == false && card[card.length-1] == "h" && hasOnlyHearts == false) continue;
            usableCards.push(i);
        }
    }

    if(gameStateQuery) return "have a card";
    return usableCards;
}