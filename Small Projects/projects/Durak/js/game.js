

function Game(){
    this.players = [[],[],[],[]];
    this.trumph = undefined;
    this.players_done = [false, false, false, false];
    this.deck = [];
    this.attacks = [];
    this.defended = true;
    this.discarded = [];
    this.defender = -1;
    this.attacker = -1;
    this.game_over = false;

    let i = 0;
    for (let key in BASE_DECK) {
        BASE_DECK[key].src = "./imgs/" + key + ".png";
        this.deck[i] = new Card(key, CANVAS_WIDTH/2, 5*CANVAS_HEIGHT/8 + 50, Math.PI/2);
        i++;
    }


    this.shuffle = function(){
        let deckCopy = deepCopy(this.deck);
        this.deck = [];

        for (let i = deckCopy.length-1; i >= 0; i--) {
            let index = Math.floor(Math.random() * deckCopy.length);

            this.deck.push(deckCopy[index]);
            deckCopy.splice(index, 1);
        }
    }

    this.deal = async function(dont_wait){
        this.shuffle();

        for (let j = 0; j < 6; j++) {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].push(this.deck.pop());
                this.resetPlayerHandPlacement(i, 30, i != 0)
                DEAL.play();

                if(!dont_wait) await new Promise(res => createTimeout(res, 150));
            }
        }

        const DECK_AND_TRUMPH_WIDTH = TRUMPH_CARD_WIDTH + 20 + CARD_HEIGHT;
        this.deck[this.deck.length-1].resetForAnimation(CANVAS_WIDTH/2 - DECK_AND_TRUMPH_WIDTH/2 + TRUMPH_CARD_WIDTH/2, undefined, 0, TRUMPH_CARD_WIDTH, TRUMPH_CARD_HEIGHT);
        this.trumph = deepCopyObject(this.deck.pop());

        for (let i = 0; i < this.deck.length; i++) {
            this.deck[i].dx = CANVAS_WIDTH/2 - DECK_AND_TRUMPH_WIDTH/2 + TRUMPH_CARD_WIDTH + 20 + CARD_HEIGHT/2;
            this.deck[i].a_type = "slide";
            this.deck[i].animate = true;
            HURT1.play();
        }

        if(!dont_wait) await new Promise(res => createTimeout(res, 1000));

        this.orderHands();
        this.selectAttackerDefender();

        if(!dont_wait) await new Promise(res => createTimeout(res, 1000));
        this.playAttack();
    }

    this.orderHands = function(){
        let i = 0;

        for (const hand of this.players) {
            hand.sort((a, b) => {
                const sA = SUIT_RANKINGS.indexOf(a.card[0]);
                const sB = SUIT_RANKINGS.indexOf(b.card[0]);
                if (sA !== sB) return sA - sB;

                const rA = CARD_RANKS.indexOf(a.card.slice(1));
                const rB = CARD_RANKS.indexOf(b.card.slice(1));
                return rA - rB;
            });

            this.resetPlayerHandPlacement(i, 20, i != 0);
            i++;
        }

        SLIDE.play();
    }

    this.selectAttackerDefender = function(){
        let trumph_suit = SUIT_RANKINGS.indexOf(this.trumph.card[0]);
        let min_rank = Infinity;

        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.players[i].length; j++) {

                let suit = SUIT_RANKINGS.indexOf(this.players[i][j].card[0]);
                let rank = CARD_RANKS.indexOf(this.players[i][j].card.slice(1));

                if(suit != trumph_suit) continue;

                if(rank < min_rank){
                    this.attacker = i;
                    this.defender = (i+1) % 4;
                    min_rank = rank;
                }
            }
        }
    }

    this.playAttack = async function(dont_wait){
        let attackingCards = this.getAttackCards(this.attacker);

        if(!dont_wait) await new Promise(res => createTimeout(res, 1000));

        if(attackingCards.length == 0){
            this.players_done[this.attacker] = true;
            this.nextTurn();
            return;
        }
        
        if(this.attacker == 0){
            inputAllowed = true;
            if(this.attacks.length > 0) BITA_BUTTON.visible = true;
            return;
        }

        brains[this.attacker].attack(attackingCards);
    }

    this.playDefense = async function(dont_wait){
        let defendingCards = this.getDefendingCards();
        
        if(!dont_wait) await new Promise(res => createTimeout(res, 1000)); 

        if(defendingCards.length == 0 || this.defended == false){
            if(defendingCards.length == 0 && this.defended == true) HURT2.play();
            this.defended = false;
            this.playAttack();
            return;
        }

        if(this.defender == 0){
            inputAllowed = true;
            SURRENDER_BUTTON.visible = true;
            return;
        }

        brains[this.defender].defend(defendingCards);
    }

    this.nextTurn = async function(dont_wait){
        if(this.isTurnOver() == false && this.gameOver() == false){
            this.attacker = (this.attacker+1) % 4;
            if(this.attacker == this.defender) this.attacker = (this.attacker+1) % 4;

            while(this.players[this.attacker].length == 0){
                this.players_done[this.attacker] = true;
                this.attacker = (this.attacker+1) % 4;
                if(this.attacker == this.defender) this.attacker = (this.attacker+1) % 4;
            }

            this.playAttack(dont_wait);
            return;
        }

        inputAllowed = false;

        if(!this.defended){
            for (let i = 0; i < this.attacks.length; i++) {
                for (let j = 0; j < this.attacks[i].length; j++) {
                    this.players[this.defender].push(this.attacks[i][j]);
                }
            }

            if(!dont_wait) await new Promise(res => createTimeout(res, 500));
            this.resetPlayerHandPlacement(this.defender, 50, this.defender != 0);

            if(!dont_wait) await new Promise(res => createTimeout(res, 2000));
            this.attacks = [];
            this.nextHand(dont_wait);
            return;
        }

        for (let i = 0; i < this.attacks.length; i++) {
            for (let j = 0; j < this.attacks[i].length; j++) {
                this.discarded.push(this.attacks[i][j]);
                let ang = Math.random()*Math.PI*2;
                this.discarded[this.discarded.length-1].resetForAnimation(CANVAS_WIDTH/2+CANVAS_WIDTH*Math.cos(ang), CANVAS_HEIGHT/2+CANVAS_HEIGHT*Math.sin(ang), Math.random()*Math.PI*2, LITTLE_CARD_WIDTH, LITTLE_CARD_HEIGHT, "flip and slide", 100);
                DEFENDED.play();
            }
        }
        
        if(!dont_wait) await new Promise(res => createTimeout(res, 2000));
        this.attacks = [];
        this.nextHand(dont_wait);
    }

    this.nextHand = async function(dont_wait){
        let given = 0;
        for (let i = (4+this.defender-1)%4; given < 3; i = (i+1)%4) {
            if(i == this.defender) continue;

            given++;
            if(!dont_wait) await this.giveFromDeck(i); 
            if(!dont_wait) await new Promise(res => createTimeout(res, 200));
        }

        if(!dont_wait) await this.giveFromDeck(this.defender);

        if(this.gameOver()){
            this.game_over = true;
            GAMEOVER.play();
            GAME_OVER_BUTTON.visible = true;
            this.defender = -1;
            this.attacker = -1;
            this.trumph = undefined;
            NEW_GAME_BUTTON.visible = false;
            return;
        }

        if(this.players[0].length == 0){
            NEW_GAME_BUTTON.visible = true;
        }

        this.attacker = this.defender
        if (this.players[this.attacker].length === 0) this.attacker = [1,2,3,4].map(i => (this.attacker + i) % 4).find(i => this.players[i].length > 0);
        if (!this.defended) this.attacker = [1,2,3,4].map(i => (this.defender + i) % 4).find(i => this.players[i].length > 0);
        this.defender = [1,2,3,4].map(i => (this.attacker + i) % 4).find(i => this.players[i].length > 0);

        this.orderHands();

        if(!dont_wait) await new Promise(res => createTimeout(res, 1000));

        this.defended = true;
        this.players_done = [false, false, false, false];

        this.playAttack();
        inputAllowed = false;
    }

    this.gameOver = function(dont_play_noise){
        let gameOver = 0;

        for (let i = 0; i < this.players.length; i++) {
            if(this.players[i].length > 0) gameOver++;
            if(gameOver > 1) return false;
        }

        if(!dont_play_noise) GAMEOVER.play();
        return true;
    }

    // helpers
    this.resetPlayerHandPlacement = function(player_index, speed, faceDown){
        for (let i = 0; i < this.players[player_index].length; i++) {

            playerHandCardGap = 3*CARD_WIDTH/4;
            if(playerHandCardGap * this.players[0].length + CARD_WIDTH > CANVAS_WIDTH){
                playerHandCardGap = (CANVAS_WIDTH - CARD_WIDTH) / this.players[0].length;
            }

            let width_gap = playerHandCardGap;

            this.players[player_index][i].a_type = "slide";
            if(faceDown != undefined && this.players[player_index][i].face_down != faceDown) this.players[player_index][i].a_type = "flip and slide";

            //  if(player_index == 0) console.log(this.players[player_index][i].face_down, this.players[player_index][i].a_type, this.players[player_index][i].animate)

            this.players[player_index][i].resetForAnimation(undefined, undefined, undefined, CARD_WIDTH, CARD_HEIGHT);

            if(player_index != 0){
                width_gap = LITTLE_CARD_WIDTH/2;
                this.players[player_index][i].resetForAnimation(undefined, undefined, undefined, LITTLE_CARD_WIDTH, LITTLE_CARD_HEIGHT);
            }

            let x = (player_index + 1) % 2;
            let y = player_index % 2;

            const HAND_WIDTH = width_gap * (this.players[player_index].length - 1);

            this.players[player_index][i].resetForAnimation(PLAYER_CARD_POS[player_index][0] - HAND_WIDTH/2 * x + i * width_gap * x,
                                                    PLAYER_CARD_POS[player_index][1] - HAND_WIDTH/2 * y + i * width_gap * y,
                                                    player_index * Math.PI/2, undefined, undefined, undefined, speed);
        }

        // console.log("//////////////////////////////")
    }

    this.organizeAttackCards = function(){
        for (let i = 0; i < this.attacks.length; i++) {
            for (let j = 0; j < this.attacks[i].length; j++) {

                let y = 3*CANVAS_HEIGHT/8;
                if(this.attacks.length > 3) {
                    y = 3*CANVAS_HEIGHT/8 - CARD_HEIGHT/2;
                    if(i >= 3) y = 3*CANVAS_HEIGHT/8 + CARD_HEIGHT/2 + 35;
                }

                let type = "flip and slide";
                if(this.attacks[i][j].face_down == false) type = "slide";

                let offset = [CARD_WIDTH/2, 0];
                if(j == 0) offset = [0, 0];

                let ang = 0;
                if(this.attacks[i].length == 2){
                    if(j == 0){
                        ang = -Math.PI/16;
                        offset = [-CARD_WIDTH/8, 0];
                    }
                    
                    if(j == 1) ang = Math.PI/16;
                }

                this.attacks[i][j].resetForAnimation(ATTACKS_X[this.attacks.length-1][i] + offset[0], y + offset[1], ang, CARD_WIDTH, CARD_HEIGHT, type, 50);
            }
        }
    }

    this.getRanksPlayed = function(){
        let ranks = [];

        for (let i = 0; i < this.attacks.length; i++) {
            for (let j = 0; j < this.attacks[i].length; j++) {

                let rank = CARD_RANKS.indexOf(this.attacks[i][j].card.slice(1));
                if(!ranks.includes(rank)) ranks.push(rank);
            }
        }

        return ranks;
    }

    this.getAttackCards = function(playerIndex){
        if(this.attacks.length >= 6 || this.players[this.defender].length == 0) return [];

        let ranksPlayed = this.getRanksPlayed();
        let attackCards = [];

        for (let i = 0; i < this.players[playerIndex].length; i++) {
            let rank = CARD_RANKS.indexOf(this.players[playerIndex][i].card.slice(1));
            if(ranksPlayed.includes(rank) || ranksPlayed.length == 0) attackCards.push(i);
        }

        return attackCards;
    }

    this.getDefendingCards = function(){
        let cardsToDefend = new Array(this.attacks.length);
        let defendCards = [];
        let trumphSuit =  SUIT_RANKINGS.indexOf(this.trumph.card[0]);

        for (let i = 0; i < this.attacks.length; i++) {  
            if(this.attacks[i].length == 2) continue;
            cardsToDefend[i] = this.attacks[i][0];
        }

        for (let i = 0; i < this.players[this.defender].length; i++) {
            let players_suit = SUIT_RANKINGS.indexOf(this.players[this.defender][i].card[0]);
            let players_rank = CARD_RANKS.indexOf(this.players[this.defender][i].card.slice(1));
            
            for (let j = 0; j < cardsToDefend.length; j++) {
                if(!cardsToDefend[j]) continue;
                let attacking_suit = SUIT_RANKINGS.indexOf(cardsToDefend[j].card[0]);
                let attacking_rank = CARD_RANKS.indexOf(cardsToDefend[j].card.slice(1))

                if(players_suit == attacking_suit && players_rank > attacking_rank || attacking_suit != trumphSuit && players_suit == trumphSuit){
                    defendCards.push(i);
                }
            }
        }

        return defendCards;
    }

    this.isTurnOver = function(){
        if(this.attacks.length == 6 || this.players[this.defender].length == 0) return true;

        let allAttackersDone = true;

        for (let i = 0; i < this.players_done.length; i++) {
            if(i == this.defender) continue;
            if(this.players_done[i] == false && this.players[i].length > 0) allAttackersDone = false;
        }

        return allAttackersDone;
    }

    this.giveFromDeck = async function(i, dont_wait){
        while(this.players[i].length < 6 && this.deck.length > 0){
            this.players[i].push(this.deck.pop());

            this.resetPlayerHandPlacement(i, 30, i != 0);
            DEAL.play();

            if(!dont_wait) await new Promise(res => createTimeout(res, 500));
        }

        if(this.trumph.availible && this.players[i].length < 6 && this.deck.length == 0){
            this.players[i].push(deepCopyObject(this.trumph));
            this.resetPlayerHandPlacement(i, 50, i != 0);
            HURT1.play();

            this.trumph.availible = false;
            this.trumph.resetForAnimation(CANVAS_WIDTH/2, undefined, undefined, undefined, undefined, "slide", 20);
        }

        if(this.trumph.availible && this.deck.length == 0){
            this.trumph.resetForAnimation(CANVAS_WIDTH/2, undefined, undefined, undefined, undefined, "slide", 20);
        }

        return true;
    }
}