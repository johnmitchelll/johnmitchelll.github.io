
function Brain(hero){
    this.hero = hero;

    this.play_board = function(ref_board, depth = 0, alpha = -Infinity, beta = Infinity){
        
        if(depth > 9 || ref_board.check_game_over(true)) return ref_board.score;

        let isMaximizing = ref_board.turn == this.hero;
        let bestScore = isMaximizing ? -Infinity : Infinity;
        let bestMove = -1;

        for(let i = 0; i < 6; i++){
            let board_copy = deepCopyObject(ref_board);
            board_copy.hero = this.hero;
        
            let hole = 7 + (5-i);
            if(ref_board.turn == 0) hole = i;

            if(ref_board.data[hole].length == 0) continue;

            board_copy.play_hole(hole, true);
            board_copy.update_score(this.hero);

            let score = this.play_board(board_copy, depth+1, alpha, beta);

            if (isMaximizing) {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
                alpha = Math.max(alpha, bestScore);
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
                beta = Math.min(beta, bestScore);
            }

            if (beta <= alpha) break; // prune
        }
        

        if(depth == 0){
            let hole = 7 + (5-bestMove);
            if(this.hero == 0) hole = bestMove;
            board.play_hole(hole);
        }

        return bestScore;
    }
}