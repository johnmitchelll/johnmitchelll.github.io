
function Brain(index){
    this.index = index;
    this.TT = new Map();
    this.MAX_DEPTH = 18;                 // deeper tactical look
    this.SEARCH_NODE_LIMIT = 220000;     // safe but strong in browser
    this.searchNodes = 0;

    // ---------- Helpers & accessors ----------
    const suitIdx = (c) => SUIT_RANKINGS.indexOf((typeof c.card === 'string' ? c.card[0] : c.suit || c.card[0]));
    const rankIdx = (c) => CARD_RANKS.indexOf((typeof c.card === 'string' ? c.card.slice(1) : c.rank || c.card.slice(1)));
    const cardStr = (c) => (typeof c.card === 'string' ? c.card : (c.suit||'') + (c.rank||''));

    const getTrumpSuitIdx = (g) => {
        if (g && g.trumph && g.trumph.card && typeof g.trumph.card === 'string') {
            return SUIT_RANKINGS.indexOf(g.trumph.card[0]);
        }
        return -1;
    };

    const isTrumpCard = (g, c) => suitIdx(c) === getTrumpSuitIdx(g);

    const canDefendBasic = (g, defCard, attCard) => {
        const tr = getTrumpSuitIdx(g);
        const sD = suitIdx(defCard), sA = suitIdx(attCard);
        const rD = rankIdx(defCard), rA = rankIdx(attCard);
        return (sD === sA && rD > rA) || (sA !== tr && sD === tr);
    };

    const shallowCopy = (o) => JSON.parse(JSON.stringify(o));

    // Choose the pile index that this defense card can cover at the lowest "cost".
    const bestPileForDefenseCard = (g, defIdx) => {
        const defC = g.players[g.defender][defIdx];
        let best = -1, bestCost = 1e9;
        for (let i = 0; i < g.attacks.length; i++) {
            const pile = g.attacks[i];
            if (!pile || pile.length !== 1) continue;
            const a = pile[0];
            if (!canDefendBasic(g, defC, a)) continue;
            // cost: prefer same-suit minimal over trump; within same suit prefer smallest rank overshoot
            let cost = 0;
            if (suitIdx(defC) !== suitIdx(a)) cost += 1000; // trumping costs more
            cost += Math.max(0, rankIdx(defC) - rankIdx(a));
            if (cost < bestCost) { bestCost = cost; best = i; }
        }
        return best;
    };

    // ---------- Weakness / strong-suit analysis (paper-inspired) ----------
    // Weakness ranks for P vs specific opponent D (current defender).
    const weaknessRanks = (g, pIdx, dIdx) => {
        const tr = getTrumpSuitIdx(g);
        const my = g.players[pIdx], opp = g.players[dIdx];
        const bySuitOpp = [[],[],[],[]];
        for (const c of opp) bySuitOpp[suitIdx(c)].push(rankIdx(c));
        for (let s = 0; s < 4; s++) bySuitOpp[s].sort((a,b)=>a-b);

        const myRanks = new Set();
        for (const c of my) myRanks.add(rankIdx(c));
        const result = new Set();

        for (const r of myRanks){
            let allDominated = true;
            // for every suit where I hold rank r, check opponent has strictly higher in same suit
            for (const c of my){
                if (rankIdx(c) !== r) continue;
                const s = suitIdx(c);
                // In classic Durak with trumps: any non-trump can be trumped; treat as dominated if opp has trump and I don't want to burn mine.
                const sameSuitHigher = bySuitOpp[s].find(x => x > r) !== undefined;
                const canTrump = (s !== tr) && bySuitOpp[tr].length > 0;
                if (!(sameSuitHigher || canTrump)) { allDominated = false; break; }
            }
            if (allDominated) result.add(r);
        }
        return result;
    };

    // Well-covered weakness: every suit occurrence of rank r is dominated by higher ranks,
    // and P has no card at those dominating ranks in those suits.
    const wellCoveredWeaknessRanks = (g, pIdx, dIdx) => {
        const tr = getTrumpSuitIdx(g);
        const my = g.players[pIdx], opp = g.players[dIdx];
        const myBySuitRanks = [new Set(), new Set(), new Set(), new Set()];
        const oppBySuitRanks = [new Set(), new Set(), new Set(), new Set()];
        for (const c of my) myBySuitRanks[suitIdx(c)].add(rankIdx(c));
        for (const c of opp) oppBySuitRanks[suitIdx(c)].add(rankIdx(c));

        const wr = weaknessRanks(g, pIdx, dIdx);
        const result = new Set();
        wr.forEach(r => {
            let ok = true;
            for (let s = 0; s < 4; s++){
                if (!myBySuitRanks[s].has(r)) continue;
                // find a minimal higher opp rank in suit s, else trump
                let hasHigherSame = false, minHigher = null;
                for (const ro of oppBySuitRanks[s]) {
                    if (ro > r) { hasHigherSame = true; if (minHigher === null || ro < minHigher) minHigher = ro; }
                }
                if (hasHigherSame){
                    if (myBySuitRanks[s].has(minHigher)) { ok = false; break; }
                } else {
                    // covered by trump – ensure I do not have that trump rank (any)
                    if (oppBySuitRanks[tr].size > 0){
                        // choose smallest opp trump rank; if I also have it, not well-covered
                        let minT = null; for (const t of oppBySuitRanks[tr]) if (minT===null||t<minT) minT=t;
                        if (myBySuitRanks[tr].has(minT)) { ok = false; break; }
                    } else {
                        ok = false; break;
                    }
                }
            }
            if (ok) result.add(r);
        });
        return result;
    };

    const strongSuitsOfOpponent = (g, pIdx, dIdx) => {
        const mySuits = new Set(g.players[pIdx].map(suitIdx));
        const oppSuits = new Set(g.players[dIdx].map(suitIdx));
        const strong = new Set();
        for (const s of oppSuits) if (!mySuits.has(s)) strong.add(s);
        return strong;
    };

    // ---------- Root actions (map move from deep copy to real indices) ----------
    this.attack = (attackingCardsFromGame) => {
        const choice = this._rootChooseMove('attack', attackingCardsFromGame);
        if (choice === -1){
            game.players_done[this.index] = true;
            game.nextTurn();
            return;
        }
        game.attacks.push([game.players[game.attacker][choice]]);
        game.players[game.attacker].splice(choice, 1);
        CARD3.play();
        game.resetPlayerHandPlacement(game.attacker, 20, true);
        game.organizeAttackCards();
        game.playDefense();
    };

    this.defend = (defendingCardsFromGame) => {
        const choice = this._rootChooseMove('defend', defendingCardsFromGame);
        if (choice === -1){
            game.defended = false;
            HURT2.play();
            game.playAttack();
            return;
        }
        // choose best pile for this defense card
        const pileIdx = bestPileForDefenseCard(game, choice);
        if (pileIdx === -1){
            // safety: surrender if mapping produced an illegal defense
            game.defended = false;
            HURT2.play();
            game.playAttack();
            return;
        }
        game.attacks[pileIdx].push(game.players[this.index][choice]);
        game.players[this.index].splice(choice, 1);
        CARD2.play();
        game.resetPlayerHandPlacement(this.index, 20, true);
        game.organizeAttackCards();
        game.playAttack();
    };

    this._rootChooseMove = (mode, availFromGame) => {
        const gCopy = deepCopyObject(game);
        const turn = (mode === 'attack') ? gCopy.attacker : gCopy.defender;
        const bestIdxInCopy = this.getBestCard(gCopy, turn, turn === this.index, 1, -Infinity, Infinity);
        if (bestIdxInCopy === -1) return -1;

        const chosenCardStr = (gCopy.players[turn] && gCopy.players[turn][bestIdxInCopy])
            ? gCopy.players[turn][bestIdxInCopy].card
            : null;

        if (!chosenCardStr) {
            if (Array.isArray(availFromGame) && availFromGame.length > 0) return availFromGame[0];
            return -1;
        }
        if (Array.isArray(availFromGame) && availFromGame.length > 0) {
            for (const realIdx of availFromGame) {
                if (game.players[turn][realIdx] && game.players[turn][realIdx].card === chosenCardStr) {
                    return realIdx;
                }
            }
        }
        for (let i = 0; i < game.players[turn].length; i++) {
            if (game.players[turn][i] && game.players[turn][i].card === chosenCardStr) return i;
        }
        if (Array.isArray(availFromGame) && availFromGame.length > 0) return availFromGame[0];
        return -1;
    };

    // ---------- Transposition key ----------
    this.hashState = (g) => {
        const atk = g.attacker, def = g.defender, ds = g.defended ? 1 : 0;
        const tr = getTrumpSuitIdx(g);
        let hands = '';
        for (let p = 0; p < g.players.length; p++) {
            const hand = g.players[p].map(c => cardStr(c)).sort().join('');
            hands += `|${p}:${hand}`;
        }
        let piles = '';
        for (const pile of (g.attacks||[])) {
            piles += '[' + pile.map(c => cardStr(c)).join(',') + ']';
        }
        return `${atk},${def},${ds},${tr}${hands}#${piles}`;
    };

    // ---------- Iterative deepening ----------
    this.iterativeDeepening = (game_ref, turn, maximizing, alpha, beta) => {
        this.searchNodes = 0;
        this.TT.clear();
        let bestMove = -1, bestScore = -Infinity;
        for (let depthLimit = 1; depthLimit <= this.MAX_DEPTH; depthLimit++){
            this.currentDepthLimit = depthLimit;
            const res = this.getBestCardSearch(game_ref, turn, maximizing, 1, alpha, beta);
            if (typeof res === 'object' && res.move !== undefined){
                bestMove = res.move;
                bestScore = res.score;
            }
            if (bestScore === Infinity || bestScore === -Infinity) break;
            if (this.searchNodes > this.SEARCH_NODE_LIMIT) break;
        }
        return bestMove;
    };

    this.getBestCard = (game_ref, turn, maximizing, depth, alpha = -Infinity, beta = Infinity) => {
        if (depth === 1) return this.iterativeDeepening(game_ref, turn, maximizing, alpha, beta);
        return this.getBestCardSearch(game_ref, turn, maximizing, depth, alpha, beta);
    };

    // ---------- Core search with paper-inspired move ordering ----------
    this.getBestCardSearch = (g, turn, maximizing, depth, alpha, beta) => {
        this.searchNodes++;
        if (this.searchNodes > this.SEARCH_NODE_LIMIT) {
            const s = this.evaluate(g);
            return (depth === 1) ? { move: -1, score: s } : s;
        }

        const key = this.hashState(g) + `|t:${turn}|m:${maximizing}|d:${depth}`;
        const ttEntry = this.TT.get(key);
        if (ttEntry && ttEntry.depth >= (this.currentDepthLimit||this.MAX_DEPTH) - depth + 1) {
            return ttEntry.value;
        }

        const depthLimit = this.currentDepthLimit || this.MAX_DEPTH;
        if (depth > depthLimit || (g.gameOver && g.gameOver(true))) {
            const s = this.evaluate(g);
            this.TT.set(key, { depth: depthLimit, value: s });
            return s;
        }

        let legal = (turn == g.attacker) ? g.getAttackCards(turn) : g.getDefendingCards();

        // Branch: no legal actions
        if (turn == g.defender && (legal.length == 0 || g.defended == false)) {
            const g2 = deepCopyObject(g);
            g2.defended = false;
            const v = this.getBestCardSearch(g2, g2.attacker, g2.attacker == this.index, depth, alpha, beta);
            this.TT.set(key, { depth: depthLimit, value: v });
            return v;
        }
        if (turn == g.attacker && legal.length == 0) {
            const v = this.advanceToNextAttacker(g, depth, alpha, beta);
            this.TT.set(key, { depth: depthLimit, value: v });
            return v;
        }

        // ----- Move ordering heuristics -----
        const me = this.index;
        const tr = getTrumpSuitIdx(g);
        const ranksPlayed = g.getRanksPlayed ? g.getRanksPlayed() : [];
        const opp = (turn == g.attacker) ? g.defender : g.attacker;

        const wr = weaknessRanks(g, turn, g.defender);
        const wcw = wellCoveredWeaknessRanks(g, turn, g.defender);
        const strongOpp = strongSuitsOfOpponent(g, turn, g.defender);

        const isStartOfRound = (g.attacks.length === 0);

        function leadPenalty(idx){
            const c = g.players[turn][idx];
            let p = 0;
            // Lemma 2 idea: avoid starting with rank i that opponent can mirror back in a strong suit
            if (isStartOfRound){
                const r = rankIdx(c);
                // if opponent has a card of this rank in a suit that I do not hold, penalize
                for (const oc of g.players[g.defender]){
                    if (rankIdx(oc) === r && !g.players[turn].some(x => suitIdx(x) === suitIdx(oc))) { p += 30; break; }
                }
                // Lemma 4 idea: avoid leading highest of a suit when not clearly winning by attack-only
                const s = suitIdx(c);
                let highestMine = true;
                for (const x of g.players[turn]) if (suitIdx(x)===s && rankIdx(x)>rankIdx(c)) { highestMine=false; break; }
                if (highestMine) p += 10;
            }
            return p;
        }

        function attackOrderScore(idx){
            const c = g.players[turn][idx];
            const r = rankIdx(c), s = suitIdx(c);
            let score = 0;
            // Prefer low non-trumps to probe; preserve trumps
            if (!isTrumpCard(g, c)) score += 20 - r; else score -= 10 + r;
            // If I have effectively one weakness, prefer dumping non-weakness in increasing ranks
            if (wr.size <= 1 && !wr.has(r)) score += (30 - r);
            // Favor ranks already on table to extend
            if (ranksPlayed.includes(r)) score += 25;
            // Slightly prefer playing from suits the opponent is weak at
            if (!strongOpp.has(s)) score += 5;
            // Penalize paper-inspired risky leads
            score -= leadPenalty(idx);
            return score;
        }

        function defendOrderScore(idx){
            const c = g.players[turn][idx];
            let score = 0;
            // Prefer same-suit minimal defense
            for (const pile of g.attacks){
                if (!pile || pile.length!==1) continue;
                const a = pile[0];
                if (suitIdx(c)===suitIdx(a) && rankIdx(c) > rankIdx(a)) score += 30 - (rankIdx(c) - rankIdx(a));
            }
            // Use trump only if necessary; lower trump is better
            if (isTrumpCard(g, c)) score -= (10 + rankIdx(c));
            // Preserve pairs for future attacks
            const r = rankIdx(c);
            const sameRankCount = g.players[turn].filter(x => rankIdx(x)===r).length;
            if (sameRankCount >= 2) score -= 6;
            // Avoid using a card at a rank that is my only non-weakness when I have many weaknesses
            if (wcw.has(r)) score -= 8;
            return score;
        }

        const moveList = legal.map(i => ({ idx: i, ord: (turn==g.attacker ? attackOrderScore(i) : defendOrderScore(i)) }));
        moveList.sort((a,b)=>b.ord - a.ord);

        let bestIdx = -1;
        let bestVal = maximizing ? -Infinity : Infinity;

        for (const m of moveList){
            const i = m.idx;
            const g2 = deepCopyObject(g);
            if (turn == g.attacker){
                g2.attacks.push([g2.players[g2.attacker][i]]);
                g2.players[g2.attacker].splice(i, 1);
                const val = this.getBestCardSearch(g2, g2.defender, g2.defender == this.index, depth + 1, alpha, beta);
                if (maximizing){ if (val > bestVal){ bestVal = val; bestIdx = i; } if (val > alpha) alpha = val; }
                else { if (val < bestVal){ bestVal = val; bestIdx = i; } if (val < beta) beta = val; }
            } else {
                const pileIdx = bestPileForDefenseCard(g2, i);
                if (pileIdx === -1) continue; // illegal defense path
                g2.attacks[pileIdx].push(g2.players[g2.defender][i]);
                g2.players[g2.defender].splice(i, 1);
                const val = this.getBestCardSearch(g2, g2.attacker, g2.attacker == this.index, depth + 1, alpha, beta);
                if (maximizing){ if (val > bestVal){ bestVal = val; bestIdx = i; } if (val > alpha) alpha = val; }
                else { if (val < bestVal){ bestVal = val; bestIdx = i; } if (val < beta) beta = val; }
            }
            if (beta <= alpha) break;
            if (this.searchNodes > this.SEARCH_NODE_LIMIT) break;
        }

        // Consider pass/surrender choices
        let passVal = null;
        if (g.attacker == turn && g.attacks.length > 0){
            const g3 = deepCopyObject(g);
            g3.players_done[turn] = true;
            passVal = this.advanceToNextAttacker(g3, depth, alpha, beta);
        }
        if (g.defender == turn){
            const g3 = deepCopyObject(g);
            g3.defended = false;
            passVal = this.getBestCardSearch(g3, g3.attacker, g3.attacker == this.index, depth, alpha, beta);
        }
        if (passVal !== null){
            if (maximizing){ if (passVal > bestVal){ bestVal = passVal; bestIdx = -1; } }
            else { if (passVal < bestVal){ bestVal = passVal; bestIdx = -1; } }
        }

        const ret = (depth === 1) ? { move: bestIdx, score: bestVal } : bestVal;
        this.TT.set(key, { depth: depthLimit, value: ret });
        return ret;
    };

    this.advanceToNextAttacker = (g, depth, alpha, beta) => {
        if (g.isTurnOver() == false && g.gameOver() == false){
            g.attacker = (g.attacker+1) % 4;
            if(g.attacker == g.defender) g.attacker = (g.attacker+1) % 4;
            while(g.players[g.attacker].length == 0){
                g.players_done[g.attacker] = true;
                g.attacker = (g.attacker+1) % 4;
                if(g.attacker == g.defender) g.attacker = (g.attacker+1) % 4;
            }
            return this.getBestCardSearch(g, g.attacker, g.attacker == this.index, depth + 1, alpha, beta);
        }
        if(!g.defended){
            for (let i = 0; i < g.attacks.length; i++) {
                for (let j = 0; j < g.attacks[i].length; j++) {
                    g.players[g.defender].push(g.attacks[i][j]);
                }
            }
            g.attacks = [];
        }
        return this.evaluate(g);
    };

    // ---------- Evaluation with paper-inspired terms ----------
    this.evaluate = (g) => {
        // Terminal
        if(g.gameOver && g.gameOver(true) && (g.players[this.index].length > 0)) return -Infinity;
        if((g.players[this.index]||[]).length === 0) return Infinity;

        const me = this.index;
        const others = g.players.map((_,i)=>i).filter(i => i!==me);
        const tr = getTrumpSuitIdx(g);

        const my = g.players[me] || [];
        const myTrumps = my.filter(c => suitIdx(c)===tr);
        const myLen = my.length;

        const oppLens = others.map(i => g.players[i].length);
        const oppLenSum = oppLens.reduce((a,b)=>a+b,0);

        // Weaknesses and well-covered weaknesses vs current defender
        const wr = weaknessRanks(g, me, g.defender);
        const wcw = wellCoveredWeaknessRanks(g, me, g.defender);

        // Open piles penalty when defending (avoid being overloaded)
        let openAttacks = 0;
        for(const pile of (g.attacks||[])) if (pile && pile.length===1) openAttacks++;

        // Rank pairs to enable multi-card attacks
        const rankCounts = {};
        for(const c of my){ const r = rankIdx(c); rankCounts[r] = (rankCounts[r]||0)+1; }
        let pairsValue = 0; for(const k in rankCounts){ const n = rankCounts[k]; if(n>=2) pairsValue += (n*(n-1)/2); }

        // Low non-trumps are cheap to dump when attacking
        const lowCut = Math.floor(CARD_RANKS.length*0.35);
        const myLowNonTrumps = my.filter(c => suitIdx(c)!==tr && rankIdx(c) <= lowCut).length;

        // Defending options available right now if I am defender
        let defendOptions = 0; try { if (g.defender === me) defendOptions = (g.getDefendingCards()||[]).length; } catch(_){}

        // Aggregate score (weights tuned by playtesting + paper heuristics)
        let score = 0;
        score += (oppLenSum - myLen) * 60;             // hand length swing
        score += (myTrumps.length) * 26;               // trump count
        score += pairsValue * 18;                      // attack power
        score += myLowNonTrumps * 8;                   // dumpability
        score -= openAttacks * 22;                     // under-fire penalty
        score -= wcw.size * 20;                        // well-covered weaknesses are bad for attack-only
        score -= Math.max(0, wr.size - 1) * 6;         // more than one weakness is worse
        score += defendOptions * 16;                   // flexibility when defending

        return score;
    };
}
