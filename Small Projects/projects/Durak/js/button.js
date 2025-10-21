
function Button(x, y, text, font, visible){
    this.x = x;
    this.y = y;
    this.text = text[language];
    this.font = font;
    let dim = getTextSize(this.text, font);
    this.text_width = dim.width;
    this.text_height = 21;
    this.visible = (visible) ? true: false;

    this.DIM = [this.x - this.text_width/2 - 20, this.y - this.text_height/2 - 10, this.text_width + 40, this.text_height + 20];

    this.display = function(){
        if(this.visible == false) return;

        this.text = text[language];
        let dim = getTextSize(this.text, font);
        this.text_width = dim.width;
        this.text_height = 21;
        this.DIM = [this.x - this.text_width/2 - 20, this.y - this.text_height/2 - 10, this.text_width + 40, this.text_height + 20];

        drawImageFromSpriteSheetWithRotation(BUTTON_START, 0, 0, 4, 20, this.x - (20 + this.text_width)/2 - 7, this.y, 16, 30 + this.text_height, 0, false, 1);
        drawImageFromSpriteSheetWithRotation(BUTTON_MIDDLE, 0, 0, 57, 20, this.x, this.y, 20 + this.text_width, 30 + this.text_height, 0, false, 1);
        drawImageFromSpriteSheetWithRotation(BUTTON_END, 0, 0, 3, 20, this.x + (20 + this.text_width)/2 + 5, this.y, 12, 30 + this.text_height, 0, false, 1);
        drawText("black", this.font, this.text, this.x - this.text_width/2 + 5, this.y + this.text_height/2-2);

        // colorNoFillRect(this.DIM[0], this.DIM[1], this.DIM[2], this.DIM[3], "red");
    }

    this.onclick = function(){}
}