

function init_menu_items(){
    reset_button = new Button(CANVAS_WIDTH/2, 7*CANVAS_HEIGHT/8, "RESET‎ ‎ ", false, () => {
        board.turn = (scores[0] + scores[1]) % 2;
        reset_button.visible = false;

        if(board.turn == 1) setTimeout(() => {
            brain.play_board(board);
        }, 2000);
 
        let running_remainder = 0; 
        let index = 0;

        for (let i = board.data[6].length-1; i >= 0; i--) {
            if(running_remainder == 4){
                running_remainder = 0;
                index++;
                if(index == 6) index++;
            }

            board.data[index].push(board.data[6][i]);
            board.data[6][i].index = index;
            board.data[6][i].update_pos();
            board.data[6].splice(i, 1);

            running_remainder++;
        }

        for (let i = board.data[13].length-1; i >= 0; i--) {
            if(running_remainder == 4){
                running_remainder = 0;
                index++;
                if(index == 6) index++;
            }

            board.data[index].push(board.data[13][i]);
            board.data[13][i].index = index;
            board.data[13][i].update_pos();
            board.data[13].splice(i, 1);

            running_remainder++;
        }
    });

    buttons.push(reset_button)
}