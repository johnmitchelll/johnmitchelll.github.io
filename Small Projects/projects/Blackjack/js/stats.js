
const GRAPH = [CANVAS_WIDTH/16, 75, 7*CANVAS_WIDTH/8, CANVAS_HEIGHT/2+50];
const NUM_VERT_MARKS = 3;
const NUM_HORZ_MARKS = 5;

function draw_stats(){
    colorNoFillRect(GRAPH[0], GRAPH[1], GRAPH[2], GRAPH[3], "rgb(255,255,255,0.5)",1)

    drawLine(GRAPH[0], GRAPH[1]-30, GRAPH[0], GRAPH[1]+GRAPH[3]+30, 2, "white");

    drawLine(GRAPH[0]-10, GRAPH[1]-20, GRAPH[0], GRAPH[1]-30, 2, "white");
    drawLine(GRAPH[0]+10, GRAPH[1]-20, GRAPH[0], GRAPH[1]-30, 2, "white");

    drawLine(GRAPH[0]-10, GRAPH[1]+GRAPH[3]+20, GRAPH[0], GRAPH[1]+GRAPH[3]+30, 2, "white");
    drawLine(GRAPH[0]+10, GRAPH[1]+GRAPH[3]+20, GRAPH[0], GRAPH[1]+GRAPH[3]+30, 2, "white");

    let min = 0;
    let max = 0;
    let running_total = 0;
    let marks = [];

    for (let i = 0; i < hand_history.length; i++) {
        running_total += hand_history[i];
        if(running_total < min) min = running_total;
        if(running_total > max) max = running_total;
        marks.push(running_total);
    }

    if(max > 0) max += 50;
    if(min < 0) min -= 50;

    for (let i = 0; i <= NUM_VERT_MARKS; i++) {
        let value = max - (i / NUM_VERT_MARKS) * (max - min);
        let width = measureText(Math.floor(value), 24, "pixel_font").width;
        drawText("black", "24px pixel_font", Math.floor(value), GRAPH[0]-width-6,  GRAPH[1]+GRAPH[3]*(i / NUM_VERT_MARKS)+6);
    }

    let x_axis_percent_down = Math.abs(max / (max - min));
    drawLine(GRAPH[0]+GRAPH[2], GRAPH[1], GRAPH[0]+GRAPH[2], GRAPH[1]+GRAPH[3], 2, "rgb(64, 89, 122)");
    drawLine(GRAPH[0], GRAPH[1]+GRAPH[3]*x_axis_percent_down, GRAPH[0]+GRAPH[2], GRAPH[1]+GRAPH[3]*x_axis_percent_down, 2, "white");
    drawLine(GRAPH[0]+GRAPH[2], GRAPH[1]+GRAPH[3]*x_axis_percent_down-10, GRAPH[0]+GRAPH[2], GRAPH[1]+GRAPH[3]*x_axis_percent_down+10, 2, "white");


    for (let i = 1; i < Math.min(NUM_HORZ_MARKS, hand_history.length); i++) {
        let index = Math.round(i / Math.min(NUM_HORZ_MARKS, hand_history.length) * hand_history.length);
        let percent_in_length = index / hand_history.length * GRAPH[2];
        drawLine(GRAPH[0]+percent_in_length, GRAPH[1]+GRAPH[3]*x_axis_percent_down-10, GRAPH[0]+percent_in_length, GRAPH[1]+GRAPH[3]*x_axis_percent_down+10, 2, "white");
        
        let width = measureText(index, 24, "pixel_font").width;
        drawText("black", "24px pixel_font", index, GRAPH[0]+percent_in_length-width/2,  GRAPH[1]+GRAPH[3]+27);
    }

    // values
    for (let i = 0; i < marks.length; i++) {
        let vert_percent_value = (marks[i] - min) / (max - min);
        let prev_vert_percent_value = max / (max - min);
        if(i != 0) prev_vert_percent_value = (marks[i-1] - min) / (max - min);

        let horz_percent_value = i / marks.length;
        let prev_horz_percent_value = 0;
        if(i != 0) prev_horz_percent_value = (i-1) / marks.length;

        drawLine(GRAPH[0]+GRAPH[2]*prev_horz_percent_value, GRAPH[1]+GRAPH[3]-GRAPH[3]*prev_vert_percent_value, GRAPH[0]+GRAPH[2]*horz_percent_value, GRAPH[1]+GRAPH[3]-GRAPH[3]*vert_percent_value, 2, "white");
    }

    // handle the mouse shit
    if(mouseX < GRAPH[0] || mouseX > GRAPH[0]+GRAPH[2] || mouseY < GRAPH[1] || mouseY > GRAPH[1]+GRAPH[3]) return;

    let mouse_horz_percent = (mouseX - GRAPH[0]) / GRAPH[2];
    let index = Math.round(mouse_horz_percent * hand_history.length);
    let vert_percent_value = (marks[index] - min) / (max - min);

    drawText("black", "24px pixel_font", marks[index], GRAPH[0]+GRAPH[2]*index/hand_history.length+5,  GRAPH[1]+GRAPH[3]-GRAPH[3]*vert_percent_value-5);
    colorRect(GRAPH[0]+GRAPH[2]*index/hand_history.length-5,  GRAPH[1]+GRAPH[3]-GRAPH[3]*vert_percent_value-5, 10, 10, "white");
}