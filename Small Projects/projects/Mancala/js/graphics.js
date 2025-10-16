
function draw(){
    colorRect(0,0, canvas.width, canvas.height, "rgb(64, 89, 122)");

    draw_board();

    draw_stones();

    draw_scores();

    draw_correct_holes();

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].display();
    }

    // drawText("black", "24px pixel_font", Math.floor(mouseX) + " : " +Math.floor(mouseY), mouseX, mouseY)
}

function draw_board(){
    colorRect(BOARD_DIM[0], BOARD_DIM[1], BOARD_DIM[2], BOARD_DIM[3], "rgb(147, 107, 56)");

    for (let i = 0; i < 8; i++) {
        colorCircle(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_HOLE_R, "rgb(95, 73, 44)");
        colorCircle(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING-BOARD_HOLE_R, BOARD_HOLE_R, "rgb(95, 73, 44)");
        
        let width = measureText(board.data[6+i].length, 24, "pixel_font").width;
        if(i != 0) drawText("black", "24px pixel_font", board.data[6+i].length, BOARD_DIM[0]+(7-i)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R-width/2, BOARD_DIM[1]+BOARD_HOLE_PADDING/2+5);
        
        width = measureText(board.data[i].length, 24, "pixel_font").width;
        if(i != 7) drawText("black", "24px pixel_font", board.data[i].length, BOARD_DIM[0]+(i+1)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R-width/2, BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING/2+5);
    }

    colorRect(BOARD_DIM[0]+BOARD_HOLE_PADDING, BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_HOLE_R*2, (BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING-BOARD_HOLE_R)-(BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R), "rgb(95, 73, 44)");
    colorRect(BOARD_DIM[0]+7*BOARD_DIM[2]/8+BOARD_HOLE_PADDING, BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_HOLE_R*2, (BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING-BOARD_HOLE_R)-(BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R), "rgb(95, 73, 44)");
}

function draw_stones(){
    for (let i = 0; i < board.data.length; i++) {
        for (let j = 0; j < board.data[i].length; j++) {
            board.data[i][j].display();
        }
    }
}

function draw_scores(){
    let width = measureText(scores[1], 64, "pixel_font").width;
    drawText("black", "64px pixel_font", scores[1], BOARD_DIM[0]+BOARD_HOLE_PADDING+BOARD_HOLE_R-width/2, 64);

    let color = "rgba(255,255,255,0.2)";
    if(board.turn == 1) color = "rgba(255,255,255,1)";
    drawLine(BOARD_DIM[0]+BOARD_HOLE_PADDING+BOARD_HOLE_R-width-3, 74, BOARD_DIM[0]+BOARD_HOLE_PADDING+BOARD_HOLE_R+width, 74, 4, color);

    width = measureText(scores[0], 64, "pixel_font").width;
    drawText("black", "64px pixel_font", scores[0], BOARD_DIM[0]+7*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R-width/2, 64);


    color = "rgba(255,255,255,0.2)";
    if(board.turn == 0) color = "rgba(255,255,255,1)";
    drawLine(BOARD_DIM[0]+7*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R-width-3, 74, BOARD_DIM[0]+7*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R+width, 74, 4, color);
}

function draw_correct_holes(){
    if(show_helping_arrows < Date.now()) return;

    if(board.turn == 1){
        for (let i = 1; i < 7; i++) {
            drawLine(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]-BOARD_HOLE_PADDING, BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]-BOARD_HOLE_PADDING-BOARD_HOLE_R, 2, "rgb(255,255,255)");
            drawLine(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]-BOARD_HOLE_PADDING, BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R-10, BOARD_DIM[1]-BOARD_HOLE_PADDING-10, 2, "rgb(255,255,255)");
            drawLine(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]-BOARD_HOLE_PADDING, BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R+10, BOARD_DIM[1]-BOARD_HOLE_PADDING-10, 2, "rgb(255,255,255)");
        }
    }else{
        for (let i = 1; i < 7; i++) {
            drawLine(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_DIM[3]+BOARD_HOLE_PADDING, BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_DIM[3]+BOARD_HOLE_PADDING+BOARD_HOLE_R, 2, "rgb(255,255,255)");
            drawLine(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_DIM[3]+BOARD_HOLE_PADDING, BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R-10, BOARD_DIM[1]+BOARD_DIM[3]+BOARD_HOLE_PADDING+10, 2, "rgb(255,255,255)");
            drawLine(BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R, BOARD_DIM[1]+BOARD_DIM[3]+BOARD_HOLE_PADDING, BOARD_DIM[0]+i*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R+10, BOARD_DIM[1]+BOARD_DIM[3]+BOARD_HOLE_PADDING+10, 2, "rgb(255,255,255)");
        }
    }
}