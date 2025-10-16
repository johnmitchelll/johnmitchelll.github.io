

function Board(){
    this.data = [];
    this.score = 0;
    this.turn = 0;

    this.play_hole = async function(hole, query){    
        if(this.data[hole].length == 0) return;
    
        let num_stones_left = this.data[hole].length
        let next_hole = (hole+1)%14;
        let last_hole = hole;
        let num_stones = this.data[hole].length;
    
        for (let i = 0; i < num_stones; i++) {
            if(this.turn == 0 && next_hole == 13) next_hole = 0;
            if(this.turn == 1 && next_hole == 6) next_hole++;
    
            for (let j = num_stones_left-1; j >= 0; j--) {
                this.data[next_hole].push(this.data[last_hole][j]);
                this.data[last_hole][j].index = next_hole;
                this.data[last_hole][j].update_pos();
                this.data[last_hole].splice(j, 1);
            }
    
            last_hole = next_hole;
            num_stones_left--;
            next_hole = (next_hole+1)%14;
    
            if(!query) await new Promise(res => setTimeout(res, 500));
        }
    
        this.finish_play(last_hole);
        if(!query) this.check_game_over();
        else this.check_game_over(true);

        if(!query && board.turn == 1) setTimeout(() => {
                brain.play_board(board);
            }, 500);
    }
    
    this.finish_play = function(last_hole){
        if(this.turn == 0 && last_hole == 6) return;
        if(this.turn == 1 && last_hole == 13) return;
    
        let oposite_hole = 12-last_hole;
        if(this.turn == 1) oposite_hole = 12%last_hole;
    
        let goal = 6;
        if(this.turn == 0){
            this.turn = 1;
            if(last_hole > 5) return;
        }else{
            this.turn = 0;
            goal = 13;
            if(last_hole < 7) return;
        }
    
        if(this.data[last_hole].length == 1){
            if(this.data[oposite_hole].length == 0) return;
    
            for (let i = this.data[oposite_hole].length-1; i >= 0; i--) {
                this.data[goal].push(this.data[oposite_hole][i]);
                this.data[oposite_hole][i].index = goal;
                this.data[oposite_hole][i].update_pos();
                this.data[oposite_hole].splice(i, 1);
            }
    
            this.data[goal].push(this.data[last_hole][0]);
            this.data[last_hole][0].index = goal;
            this.data[last_hole][0].update_pos();
            this.data[last_hole].splice(0, 1);
        }
    }
    
    this.check_game_over = function(query){
        let game_over = [true, true];
    
        for(let i = 0; i < 6; i++){
            if(this.data[i].length > 0) game_over[0] = false;
            if(this.data[12-i].length > 0) game_over[1] = false;
        }
    
        if(!game_over[0] && !game_over[1]) return false;
        if(query) return true;

        let goal = 13;
        if(game_over[1]) goal = 6;
    
        for (let i = 0; i < 6; i++) {
            let oposite_hole = 12-i;
            if(game_over[1]) oposite_hole = i;
    
            for (let e = this.data[oposite_hole].length-1; e >= 0; e--) {
                this.data[goal].push(this.data[oposite_hole][e]);
                this.data[oposite_hole][e].index = goal;
                this.data[oposite_hole][e].update_pos();
                this.data[oposite_hole].splice(e, 1);
            }
        }
    
        if(this.data[13].length > this.data[6].length){
            scores[1]++;
        }else if(this.data[13].length < this.data[6].length){
            scores[0]++;
        }
    
        reset_button.visible = true;
        return true;
    }

    this.update_score = function(hero){
        if(this.check_game_over(true)){
            this.score = 10000;
            if((hero == 0 && this.data[13].length > this.data[6].length) || (hero == 1 && this.data[6].length > this.data[13].length)) this.score = -10000;
            return;
        }

        this.score = this.data[13].length - this.data[6].length;
        if(hero == 0) this.score = this.data[6].length - this.data[13].length;
    }
}