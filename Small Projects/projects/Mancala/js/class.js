
function Stone(index){
    this.index = index;
    this.color = "rgb("+ 50 +","+ (100+Math.random()*155) +","+ (100+Math.random()*155) +")"

    this.x = BOARD_DIM[0]+(this.index+1)%7*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R;
    if(this.index == 6) this.x = BOARD_DIM[0]+(this.index+1)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R;
    if(this.index > 6) this.x = BOARD_DIM[0]+(6-(this.index)%7)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R;
    this.x += 10+Math.random()*-20;
    this.y = BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R;
    if(this.index < 7) this.y = BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING-BOARD_HOLE_R;
    if(this.index == 6 || this.index == 13) this.y = BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R + Math.random()*(BOARD_DIM[3]-BOARD_HOLE_PADDING*2-BOARD_HOLE_R*2);
    this.y += 10+Math.random()*-20;

    this.animate = false;
    this.start_x;
    this.start_y;
    this.dx;
    this.dy;

    this.display = function(){
        if(this.animate){
            this.run_animation();
            return;
        }

        colorCircle(this.x, this.y, 10, this.color);
    }

    this.run_animation = function(){
        let whole_dist = distanceOfTwoPoints(this.start_x, this.start_y, this.dx, this.dy);
        let current_dist = distanceOfTwoPoints(this.x, this.y, this.dx, this.dy);

        let percent_done = 1 - current_dist / whole_dist;

        this.x += Math.cos(Math.atan2(this.dy - this.y, this.dx - this.x))*whole_dist/30;
        this.y += Math.sin(Math.atan2(this.dy - this.y, this.dx - this.x))*whole_dist/30;

        colorCircle(this.x, this.y, Math.min(10+1/Math.abs(0.5 - percent_done), 15), this.color);

        if(current_dist <= 5){
            this.start_x = this.x;
            this.start_y = this.y;
            this.animate = false;
        }
    }

    this.update_pos = function(){
        this.animate = true;

        this.dx = BOARD_DIM[0]+(this.index+1)%7*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R;
        if(this.index == 6) this.dx = BOARD_DIM[0]+(this.index+1)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R;
        if(this.index > 6) this.dx = BOARD_DIM[0]+(6-(this.index)%7)*BOARD_DIM[2]/8+BOARD_HOLE_PADDING+BOARD_HOLE_R;
        this.dx += 10+Math.random()*-20;
        this.start_x = this.x;

        this.dy = BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R;
        if(this.index < 7) this.dy = BOARD_DIM[1]+BOARD_DIM[3]-BOARD_HOLE_PADDING-BOARD_HOLE_R;
        if(this.index == 6 || this.index == 13) this.dy = BOARD_DIM[1]+BOARD_HOLE_PADDING+BOARD_HOLE_R + Math.random()*(BOARD_DIM[3]-BOARD_HOLE_PADDING*2-BOARD_HOLE_R*2);
        this.dy += 10+Math.random()*-20;
        this.start_y = this.y;
    }
}

function Button(x, y, text, visible, callback){
    this.x = x;
    this.y = y;
    this.text = text;
    this.visible = visible;
    this.clickable = true;

    let dimensions = measureText(this.text, 19, "pixel_font");
    this.w = dimensions.width;
    this.h = dimensions.height;

    this.callback = callback;

    this.display = function(){
        if(!this.visible) return;
        colorRect(this.x - this.w/2 - 10, this.y - this.h/2 - 10, this.w+20, this.h+20, "white");
        colorNoFillRect(this.x - this.w/2 - 10, this.y - this.h/2 - 10, this.w+20, this.h+20, "black");

        drawText("black", "32px pixel_font", this.text, this.x-this.w/2+5, this.y+5);

        if(this.clickable == false) colorRect(this.x - this.w/2 - 10, this.y - this.h/2 - 10, this.w+20, this.h+20, "rgb(0,0,0,0.5)");
    }
}