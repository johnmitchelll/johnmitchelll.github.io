function Brain(index){
    this.index = index;
    this.TT = new Map();
    this.MAX_DEPTH = 6;

    this.attack = () => {
        let card_index = this.getBestCard(deepCopyObject(game), this.index, true, 1, -Infinity, Infinity);
        if(card_index == -1){
            game.players_done[this.index] = true;
            game.nextTurn();
            return;
        }
        game.attacks.push([game.players[game.attacker][card_index]]);
        game.players[game.attacker].splice(card_index, 1);
        CARD3.play();
        game.resetPlayerHandPlacement(game.attacker, 20, true);
        game.organizeAttackCards();
        game.playDefense();
    };

    this.defend = () => {
        let card_index = this.getBestCard(deepCopyObject(game), this.index, true, 1, -Infinity, Infinity);
        if(card_index == -1){
            game.defended = false;
            HURT2.play();
            game.playAttack();
            return;
        }
        for (let i = 0; i < game.players_done.length; i++) {
            if(game.players[i].length != 0) game.players_done[i] = false;
        }
        game.attacks[game.attacks.length-1].push(game.players[this.index][card_index]);
        game.players[this.index].splice(card_index, 1);
        CARD2.play();
        game.resetPlayerHandPlacement(this.index, 20, true);
        game.organizeAttackCards();
        game.playAttack();
    };

    this.hashState = (g) => {
        const atk = g.attacker, def = g.defender, ds = g.defended ? 1 : 0;
        const trump = g.trump_suit || (g.trump && g.trump.suit) || (g.trumpCard && g.trumpCard.suit) || '';
        let hands = '';
        for (let p = 0; p < g.players.length; p++) {
            const hand = g.players[p].map(c => (typeof c.card === 'string' ? c.card : (c.suit||'') + (c.rank||''))).sort().join('');
            hands += `|${p}:${hand}`;
        }
        let piles = '';
        for (const pile of (g.attacks||[])) {
            piles += '[' + pile.map(c => (typeof c.card === 'string' ? c.card : (c.suit||'') + (c.rank||''))).join(',') + ']';
        }
        return `${atk},${def},${ds},${trump}${hands}#${piles}`;
    };

    this.getBestCard = (game_ref, turn, maximizing, depth, alpha = -Infinity, beta = Infinity) => {
        const key = this.hashState(game_ref) + `|t:${turn}|m:${maximizing}|d:${depth}`;
        if (depth !== 1) {
            const hit = this.TT.get(key);
            if (hit && hit.alpha <= alpha && hit.beta >= beta) return hit.score;
        }

        const openAttacks = (game_ref.attacks||[]).some(p => p && p.length === 1);
        const canExtend = (game_ref.defender === turn) || openAttacks;
        const depthLimit = this.MAX_DEPTH + (canExtend ? 2 : 0);
        if (depth > depthLimit || (game_ref.gameOver && game_ref.gameOver(true))) {
            const s = this.get_score(game_ref);
            const evalScore = Number.isFinite(s) ? s : 0;
            if (depth !== 1) this.TT.set(key, { score: evalScore, alpha, beta });
            return evalScore;
        }

        let cards_availible = (turn == game_ref.attacker) ? game_ref.getAttackCards(turn) : game_ref.getDefendingCards();
        let card_scores = new Array(game_ref.players[turn].length);

        if(turn == game_ref.defender && (cards_availible.length == 0 || game_ref.defended == false)){
            game_ref.defended = false;
            const v = this.getBestCard(game_ref, game_ref.attacker, game_ref.attacker == this.index, depth, alpha, beta);
            if (depth !== 1) this.TT.set(key, { score: v, alpha, beta });
            return v;
        }

        if(turn == game_ref.attacker && cards_availible.length == 0){
            game_ref.players_done[turn] = true;
            const v = this.brainNextTurn(game_ref);
            if (depth !== 1) this.TT.set(key, { score: v, alpha, beta });
            return v;
        }

        const suitOf = c => (typeof c.card === 'string' ? c.card[0] : (c.suit || (c.card && c.card.suit)));
        const trumpSuit =
            game_ref.trump_suit ||
            (game_ref.trump && (game_ref.trump.suit || (game_ref.trump.card && game_ref.trump.card[0]))) ||
            (game_ref.trumpCard && (game_ref.trumpCard.suit || (game_ref.trumpCard.card && game_ref.trumpCard.card[0])));

        const rankIdx = c => CARD_RANKS.indexOf((typeof c.card === 'string' ? c.card.slice(1) : c.card.rank || ''));
        const isTrump = c => suitOf(c) === trumpSuit;

        const scoreMoveHeuristic = (idx) => {
            const c = game_ref.players[turn][idx];
            let s = 0;
            const r = rankIdx(c);
            if (turn === game_ref.attacker) {
                s -= (isTrump(c) ? 10 : 0);
                s -= r * 0.5;
                const sameRank = game_ref.players[turn].filter(x => rankIdx(x) === r).length;
                s += Math.max(0, sameRank - 1) * 1.5;
            } else {
                s -= r;
                if (isTrump(c)) s -= 3;
            }
            return s;
        };

        const ordered = cards_availible.slice().sort((a,b) => scoreMoveHeuristic(b) - scoreMoveHeuristic(a));

        for (let oi = 0; oi < ordered.length; oi++) {
            const card_index = ordered[oi];
            let game_i = deepCopyObject(game_ref);

            if (turn == game_ref.attacker){
                game_i.attacks.push([game_i.players[game_i.attacker][card_index]]);
                game_i.players[game_i.attacker].splice(card_index, 1);
                card_scores[card_index] = this.getBestCard(game_i, game_i.defender, game_i.defender == this.index, depth + 1, alpha, beta);
            } else {
                game_i.attacks[game_i.attacks.length-1].push(game_i.players[game_i.defender][card_index]);
                game_i.players[game_i.defender].splice(card_index, 1);
                card_scores[card_index] = this.getBestCard(game_i, game_i.attacker, game_i.attacker == this.index, depth + 1, alpha, beta);
            }

            if (maximizing){
                if (card_scores[card_index] > alpha) alpha = card_scores[card_index];
            } else {
                if (card_scores[card_index] < beta) beta = card_scores[card_index];
            }
            if (beta <= alpha) break;
        }

        let passing_surrendering;
        if(game_ref.attacker == turn && game_ref.attacks.length > 0){
            game_ref.players_done[turn] = true;
            passing_surrendering = this.brainNextTurn(game_ref);
        }
        if(game_ref.defender == turn){
            game_ref.defended = false;
            passing_surrendering = this.getBestCard(game_ref, game_ref.attacker, game_ref.attacker == this.index, depth, alpha, beta);
        }

        let max_score = -Infinity;
        let min_score = Infinity;
        for (let i = 0; i < card_scores.length; i++) {
            if (maximizing && card_scores[i] != null && card_scores[i] > max_score) max_score = card_scores[i];
            if (!maximizing && card_scores[i] != null && card_scores[i] < min_score) min_score = card_scores[i];
        }
        if (maximizing && passing_surrendering != null && passing_surrendering > max_score) max_score = passing_surrendering;
        if (!maximizing && passing_surrendering != null && passing_surrendering < min_score) min_score = passing_surrendering;

        let ret;
        if (depth != 1) {
            ret = maximizing ? max_score : min_score;
        } else {
            if (passing_surrendering === max_score) {
                ret = -1;
            } else {
                let bestIdx = -1, bestVal = -Infinity;
                for (let i = 0; i < card_scores.length; i++) {
                    const v = card_scores[i];
                    if (v != null && v > bestVal) { bestVal = v; bestIdx = i; }
                }
                ret = bestIdx;
            }
        }

        if (depth !== 1) this.TT.set(key, { score: ret, alpha, beta });
        return ret;
    };

    this.brainNextTurn = (game_ref) => {
        if(game_ref.isTurnOver() == false && game_ref.gameOver(true) == false){
            game_ref.attacker = (game_ref.attacker+1) % 4;
            if(game_ref.attacker == game_ref.defender) game_ref.attacker = (game_ref.attacker+1) % 4;
            while(game_ref.players[game_ref.attacker].length == 0){
                game_ref.players_done[game_ref.attacker] = true;
                game_ref.attacker = (game_ref.attacker+1) % 4;
                if(game_ref.attacker == game_ref.defender) game_ref.attacker = (game_ref.attacker+1) % 4;
            }
            return this.getBestCard(game_ref, game_ref.attacker, game_ref.attacker == this.index);
        }
        if(!game_ref.defended){
            for (let i = 0; i < game_ref.attacks.length; i++) {
                for (let j = 0; j < game_ref.attacks[i].length; j++) {
                    game_ref.players[game_ref.defender].push(game_ref.attacks[i][j]);
                }
            }
            game_ref.attacks = [];
        }
        const s = this.get_score(game_ref);
        return Number.isFinite(s) ? s : 0;
    };

    this.get_score = (game_ref) => {
        if(game_ref.gameOver(true) && game_ref.players[this.index].length > 0) return -Infinity;
        if(game_ref.players[this.index].length == 0) return Infinity;

        const rankIdx = c => CARD_RANKS.indexOf((typeof c.card === 'string' ? c.card.slice(1) : c.card.rank || ''));
        const suitOf = c => (typeof c.card === 'string' ? c.card[0] : (c.suit || (c.card && c.card.suit)));
        const trumpSuit =
            game_ref.trump_suit ||
            (game_ref.trump && (game_ref.trump.suit || (game_ref.trump.card && game_ref.trump.card[0]))) ||
            (game_ref.trumpCard && (game_ref.trumpCard.suit || (game_ref.trumpCard.card && game_ref.trumpCard.card[0])));

        const me = this.index;
        const myHand = game_ref.players[me] || [];
        const others = game_ref.players.filter((_,i)=>i!==me);

        const myLen = myHand.length;
        const oppLenSum = others.reduce((s,p)=>s+(p?p.length:0),0);

        const myTrumps = myHand.filter(c => suitOf(c) === trumpSuit);
        const myTrumpStrength = myTrumps.reduce((s,c)=>s+rankIdx(c),0);

        let oppTrumpsCount = 0, oppTrumpStrength = 0, oppHighNonTrump = 0;
        for(const p of others){
            for(const c of (p||[])){
                if(suitOf(c) === trumpSuit){ oppTrumpsCount++; oppTrumpStrength += rankIdx(c); }
                else if(rankIdx(c) >= Math.floor(CARD_RANKS.length*0.7)) oppHighNonTrump++;
            }
        }

        const rankCounts = {};
        for(const c of myHand){
            const r = rankIdx(c);
            rankCounts[r] = (rankCounts[r]||0)+1;
        }
        let pairsValue = 0;
        for(const k in rankCounts){
            const n = rankCounts[k];
            if(n >= 2) pairsValue += (n*(n-1)/2);
        }

        const lowCut = Math.floor(CARD_RANKS.length*0.35);
        const myLowNonTrumps = myHand.filter(c => suitOf(c) !== trumpSuit && rankIdx(c) <= lowCut).length;

        let attackOptions = 0, defendOptions = 0;
        try {
            attackOptions = game_ref.getAttackCards ? (game_ref.getAttackCards(me)||[]).length : 0;
        } catch(_){}
        try {
            defendOptions = (game_ref.defender === me && game_ref.getDefendingCards) ? (game_ref.getDefendingCards()||[]).length : 0;
        } catch(_){}

        let openAttacks = 0;
        for(const pile of (game_ref.attacks||[])){
            if(!pile || pile.length === 0) continue;
            if(pile.length === 1) openAttacks++;
        }

        const wHand = 50;
        const wTrumpCount = 22;
        const wTrumpStr = 6;
        const wPairs = 12;
        const wLow = 8;
        const wAtkOpt = 10;
        const wDefOpt = 16;
        const wOpenAtkPenalty = 18;
        const wOppHighNonTrumpPenalty = 4;

        let score = 0;
        score += (oppLenSum - myLen) * wHand;
        score += (myTrumps.length - oppTrumpsCount) * wTrumpCount;
        score += (myTrumpStrength - oppTrumpStrength) * wTrumpStr;
        score += pairsValue * wPairs;
        score += myLowNonTrumps * wLow;
        score += attackOptions * wAtkOpt;
        score += defendOptions * wDefOpt;
        if(game_ref.defender === me) score -= openAttacks * wOpenAtkPenalty;
        score -= oppHighNonTrump * wOppHighNonTrumpPenalty;

        return score;
    };
}
