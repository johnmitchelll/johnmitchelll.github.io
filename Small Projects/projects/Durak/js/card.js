function Card(card, x, y, ang){
    this.card = card;
    this.face_down = true;
    this.animate = false;

    this.a_type = "flip and slide";

    this.x = x;
    this.y = y;
    this.start_x = x;
    this.start_y = y;
    this.start_w = CARD_WIDTH;
    this.start_h = CARD_HEIGHT;
    this.w = CARD_WIDTH;
    this.h = CARD_HEIGHT;
    this.end_w = CARD_WIDTH;
    this.end_h = CARD_HEIGHT;
    this.ang = ang;
    this.start_ang = ang;
    this.end_ang = ang;
    this.dx = x;
    this.dy = y;
    this.a_speed = 50;
    this.availible = true;

    this.display = function(){
        let alpha = 1;
        if(!this.availible) alpha = 0.2;

        if(this.animate){
            this.animateUpdate(alpha);
            if(this.animate) return;
        }

        if(this.face_down){
            drawImageFromSpriteSheetWithRotation(BACK_OF_CARD, 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.dx, this.dy, this.end_w, this.end_h, this.end_ang, false, alpha);
            return;
        }

        drawImageFromSpriteSheetWithRotation(BASE_DECK[this.card], 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.dx, this.dy, this.end_w, this.end_h, this.end_ang, false, alpha);
    }

    this.animateUpdate = function(alpha){
        let angleBetweenPosAndDestination = Math.atan2(this.y - this.dy, this.x - this.dx);

        let currentDist = distanceOfTwoPoints(this.x, this.y, this.start_x, this.start_y);
        let wholeDist = distanceOfTwoPoints(this.dx, this.dy, this.start_x, this.start_y);

        wholeDist = Math.max(0.0001, wholeDist);

        let percentComplete = currentDist / wholeDist;

        // animation is done
        if(percentComplete >= 0.9999){
            this.animate = false;
            if(this.a_type != "slide"){
                if(this.face_down) this.face_down = false;
                else this.face_down = true;
            }

            return;
        }

        this.w = (this.end_w - this.start_w) * percentComplete + this.start_w;
        this.h = (this.end_h - this.start_h) * percentComplete + this.start_h;

        let whole_ang = this.end_ang - this.start_ang;

        if(this.a_type == "flip and slide"){
            this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/this.a_speed;
            this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/this.a_speed;
            this.ang = this.start_ang + percentComplete*whole_ang;

            if(this.face_down){
                if(percentComplete <= 0.5){
                    drawImageFromSpriteSheetWithRotation(BACK_OF_CARD, 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, this.w*(1-percentComplete*2), this.h, this.ang, false, alpha);
                }else{
                    drawImageFromSpriteSheetWithRotation(BASE_DECK[this.card], 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, this.w*(2*percentComplete-1), this.h, this.ang, false, alpha);
                }
            }else{
                if(percentComplete <= 0.5){
                    drawImageFromSpriteSheetWithRotation(BASE_DECK[this.card], 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, this.w*(2*percentComplete-1), this.h, this.ang, false, alpha);
                }else{
                    drawImageFromSpriteSheetWithRotation(BACK_OF_CARD, 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, this.w*(1-percentComplete*2), this.h, this.ang, false, alpha);
                }
            }
        }

        if(this.a_type == "slide"){
            this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/this.a_speed;
            this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/this.a_speed;
            this.ang = this.start_ang + percentComplete*whole_ang;

            if(this.face_down){
                drawImageFromSpriteSheetWithRotation(BACK_OF_CARD, 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, this.w, this.h, this.ang, false, alpha);
            }else{
                drawImageFromSpriteSheetWithRotation(BASE_DECK[this.card], 0, 0, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, this.w, this.h, this.ang, false, alpha);
            }
        }
    }

    this.resetForAnimation = function(dx, dy, dAng, dW, dH, aT, aSpeed){
        this.start_x = this.x;
        this.start_y = this.y;
        this.start_w = this.w;
        this.start_h = this.h;
        this.end_w = (dW != undefined) ? dW : this.end_w;
        this.end_h = (dH != undefined) ? dH : this.end_h;
        this.start_ang = this.end_ang;
        this.end_ang = (dAng != undefined) ? dAng : this.end_ang;
        this.dx = (dx != undefined) ? dx : this.dx;
        this.dy = (dy != undefined) ? dy : this.dy;
        this.a_type = (aT != undefined) ? aT : this.a_type;
        this.a_speed = (aSpeed != undefined) ? aSpeed : this.a_speed;
        this.animate = true;
    }
}
