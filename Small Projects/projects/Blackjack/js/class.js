function Card(card, sx, sy, x, y, ang){
    this.card = card;
    this.sx = sx;
    this.sy = sy;
    this.face_down = false;
    this.animate = false;
    this.a_type = "flip and slide";
    this.flip_ang = Math.PI;
    this.x = x;
    this.y = y;
    this.start_x = x;
    this.start_y = y;
    this.start_ang = ang;
    this.end_ang = ang;
    this.dx = x;
    this.dy = y;
    this.availible = true;
    this.hand = 0;

    this.display = function(){
        if(this.animate){
            this.animateUpdate();
            return;
        }

        if(this.face_down){
            drawImageFromSpriteSheetWithRotation(cards_pic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.dx, this.dy, CARD_WIDTH, CARD_HEIGHT, this.end_ang, false);
            return;
        }

        drawImageFromSpriteSheetWithRotation(cards_pic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.dx, this.dy, CARD_WIDTH, CARD_HEIGHT, this.end_ang, false);
        if(this.availible) return;

        canvasContext.save();
        canvasContext.translate(this.dx, this.dy);
        canvasContext.rotate(this.end_ang);
        colorRect(-CARD_WIDTH/2, -CARD_HEIGHT/2, CARD_WIDTH, CARD_HEIGHT, "rgba(0,0,0,0.5)")
        canvasContext.restore();
    }

    this.animateUpdate = function(){
        let angleBetweenPosAndDestination = Math.atan2(this.y - this.dy, this.x - this.dx);

        let currentDist = distanceOfTwoPoints(this.x, this.y, this.start_x, this.start_y);
        let wholeDist = distanceOfTwoPoints(this.dx, this.dy, this.start_x, this.start_y);

        let percentComplete = currentDist / wholeDist;

        let whole_ang = this.end_ang - this.start_ang;

        if(this.a_type == "flip and slide"){
            this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/50;
            this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/50;
            let ang = this.start_ang + percentComplete*whole_ang;

            if(this.face_down){
                if(percentComplete <= 0.5){
                    drawImageFromSpriteSheetWithRotation(cards_pic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT, ang, false);
                }else{
                    drawImageFromSpriteSheetWithRotation(cards_pic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, ang, false);
                }
            }else{
                if(percentComplete <= 0.5){
                    drawImageFromSpriteSheetWithRotation(cards_pic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, ang, false);
                }else{
                    drawImageFromSpriteSheetWithRotation(cards_pic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT, ang, false);
                }
            }
        }

        if(this.a_type == "slide"){
            this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/50;
            this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/50;
            let ang = this.start_ang + percentComplete*whole_ang;

            if(this.face_down){
                drawImageFromSpriteSheetWithRotation(cards_pic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT, ang, false);
            }else{
                drawImageFromSpriteSheetWithRotation(cards_pic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT, ang, false);
            }
        }

        if(this.a_type == "flip"){
            if(this.face_down){
                this.flip_ang -= Math.PI/50;
                percentComplete = (Math.PI - this.flip_ang) / Math.PI;

                if(percentComplete <= 0.5){
                    drawImageFromSpriteSheetWithRotation(cards_pic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT, this.end_ang, false);
                }else{
                    drawImageFromSpriteSheetWithRotation(cards_pic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, this.end_ang, false);
                }

                if(this.flip_ang <= 0){
                    this.flip_ang = 0;
                    this.animate = false;
                    this.face_down = false;
                }
            }else{
                this.flip_ang += Math.PI/50;
                percentComplete = this.flip_ang / Math.PI;

                if(percentComplete <= 0.5){
                    drawImageFromSpriteSheetWithRotation(cards_pic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, this.end_ang, false);
                }else{
                    drawImageFromSpriteSheetWithRotation(cards_pic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT, this.end_ang, false);
                }

                if(this.flip_ang >= Math.PI){
                    this.flip_ang = Math.PI;
                    this.animate = false;
                    this.face_down = true;
                }
            }

            return;
        }

        // animation is done
        if(percentComplete >= 0.9999){
            this.animate = false;
            if(this.a_type != "slide"){
                if(this.face_down){
                    this.face_down = false;
                    this.flip_ang = Math.PI;
                }else{
                    this.face_down = true;
                    this.flip_ang = 0;
                }
            } 
        }
    }
}

function Player(x,y,ang,id){
    this.x = x;
    this.y = y;
    this.ang = ang;
    this.index = id;

    this.bet = 0;
    this.original_bet = 0;
    this.bet_size_index = 0;
    this.bet_chips = [];
    this.bets = []; // for when we split and we need to know where we doubled

    this.balance = 1000;
    this.prev_balance = 1000;

    this.cards = [];
    this.num_hands = 1;
    this.hand_focus = 0;
    this.hands = [];

    this.prev_bet = 0;

    this.hit = function(){
        if(this.num_hands > 1){
            let running_hand_total = 0;

            for (let i = 0; i <= this.hand_focus; i++)
                running_hand_total += this.hands[i].length;

            this.cards.splice(running_hand_total, 0, take_from_shoe());
            this.cards[running_hand_total].animate = true;
            this.cards[running_hand_total].end_ang = this.ang;
            this.cards[running_hand_total].hand = this.hand_focus;
            this.hands[this.hand_focus].push(this.cards[running_hand_total]);
        }else{
            this.cards.push(take_from_shoe());
            this.cards[this.cards.length-1].animate = true;
            this.cards[this.cards.length-1].end_ang = this.ang;
        }
        
        organize_played_cards(this);
        
        if(this.num_hands > 1 && calculate_hand_value(this.hands[this.hand_focus]).score >= 21){
            continue_hand();
        }else if(this.num_hands == 1 && calculate_hand_value(this.cards).score >= 21){
            continue_hand();
        }
    }

    this.stand = function(){
        continue_hand();
    }

    this.double = function(){
        if(this.balance < this.original_bet){
            error = 0;
            error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
            return;
        }

        if(this.num_hands > 1){
            let running_hand_total = 0;

            for (let i = 0; i <= this.hand_focus; i++)
                running_hand_total += this.hands[i].length;

            this.cards.splice(running_hand_total, 0, take_from_shoe());
            this.cards[running_hand_total].animate = true;
            this.cards[running_hand_total].end_ang = this.ang;
            this.cards[running_hand_total].hand = this.hand_focus;
            this.hands[this.hand_focus].push(this.cards[running_hand_total]);
            this.bets[this.hand_focus] = 1;
        }else{
            this.cards.push(take_from_shoe());
            this.cards[this.cards.length-1].animate = true;
            this.cards[this.cards.length-1].end_ang = this.ang;
        }

        this.balance -= this.original_bet;
        this.bet += this.original_bet;
        this.bet_chips = [];
        add_chips_from_amount(this.index, this.bet);

        organize_played_cards(this);
        continue_hand();
    }

    this.split = async function(){
        if(this.num_hands == 4){
            error = 2;
            error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
            return;
        }

        if(this.balance < this.original_bet){
            error = 0;
            error_timer = Date.now()+ERROR_MESSAGE_TIME_LENGTH;
            return;
        }

        split_button.clickable = false;

        this.bet += this.original_bet;
        this.balance -= this.original_bet;
        add_chips_from_amount(this.index, this.original_bet)

        if(this.num_hands == 1){
            this.hands.push([this.cards[0], this.cards[1]]);
            this.bets = [0, 0];
        }else{
            this.bets.push(0);
        }

        this.num_hands++;
        this.hands.push([this.hands[this.hand_focus].pop()]);
        this.hands[this.num_hands-1][0].hand = this.num_hands-1;

        let running_hand_total = 0;
        let move_card_to_end_of_hand = true;

        for (let i = 0; i < this.hands.length; i++) {
            running_hand_total += this.hands[i].length;
            if(this.hands[i].length != 1) continue;
            
            if(move_card_to_end_of_hand){
                move_card_to_end_of_hand = false;
                this.cards.push(this.cards.splice(running_hand_total, 1)[0]);
            }

            this.cards.splice(running_hand_total, 0, take_from_shoe()); // insert top shoe card into hand at running_hand_total
            this.hands[i].push(this.cards[running_hand_total]);
            this.cards[running_hand_total].hand = i;
            this.cards[running_hand_total].animate = true;
            this.cards[running_hand_total].end_ang = this.ang;
            running_hand_total++;

            organize_played_cards(this);
            await new Promise(res => setTimeout(res, 500));
        }

        if(this.index == 2) turn_on_bet_buttons();
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