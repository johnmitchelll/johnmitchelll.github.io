

function Scene(){
    this.display = function(){}
    this.hover = function(){}
    this.click = function(){}

    this.buttons = [];
}


var BITA_BUTTON;
var SURRENDER_BUTTON;
var NEW_GAME_BUTTON;
var GAME_OVER_BUTTON;
var MENU_BUTTON;


// Game
function initGameScene(){
    game_scene.buttons = [];

    BITA_BUTTON = new Button(CANVAS_WIDTH/4, 5*CANVAS_HEIGHT/8 + 50, BITA, "32px pixel_font");
    BITA_BUTTON.onclick = function(){
        game.players_done[0] = true;
        game.nextTurn();
        BITA_BUTTON.visible = false;
    }

    SURRENDER_BUTTON = new Button(CANVAS_WIDTH/4-25, 5*CANVAS_HEIGHT/8 + 50, SURRENDER, "32px pixel_font");
    SURRENDER_BUTTON.onclick = function(){
        game.defended = false;
        HURT2.play()
        game.playAttack();
        SURRENDER_BUTTON.visible = false;
    }

    GAME_OVER_BUTTON = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 128, NEW_GAME, "32px pixel_font");
    GAME_OVER_BUTTON.onclick = function(){
        setUp();
        GAME_OVER_BUTTON.visible = false;
    }

    NEW_GAME_BUTTON = new Button(PLAYER_CARD_POS[0][0], PLAYER_CARD_POS[0][1], NEW_GAME, "32px pixel_font");
    NEW_GAME_BUTTON.onclick = function(){
        setUp();
        NEW_GAME_BUTTON.visible = false;
    }

    MENU_BUTTON = new Button(CANVAS_WIDTH - 100, 80, MENU, "32px pixel_font", true);
    MENU_BUTTON.onclick = function(){
        scene = menu_scene;
        RESUME_BUTTON.visible = true;
        pauseTimeouts();
        LANGUAGE.play();
    }

    game_scene.buttons.push(BITA_BUTTON);
    game_scene.buttons.push(SURRENDER_BUTTON);
    game_scene.buttons.push(GAME_OVER_BUTTON);
    game_scene.buttons.push(NEW_GAME_BUTTON);
    game_scene.buttons.push(MENU_BUTTON);
}

game_scene = new Scene();
game_scene.display = function(){
    drawBackground();
    drawAttackerDefender();

    for (let i = 0; i < game.deck.length; i++) {
        game.deck[i].display();
    }

    game.trumph?.display()

    drawPlayersHands();

    drawAttacks();

    for (let i = 0; i < game.discarded.length; i++) {
        game.discarded[i].display();
    }

    for (let i = 0; i < game_scene.buttons.length; i++) {
        game_scene.buttons[i].display();
    }

    drawGameOver();
}

game_scene.hover = function(){
    document.body.style.cursor = "default";
   
    handleCardsHover();

    for (let i = 0; i < game_scene.buttons.length; i++) {
        if(game_scene.buttons[i].visible == false) continue;
        if(mouseX > game_scene.buttons[i].DIM[0] && mouseY > game_scene.buttons[i].DIM[1] && 
           mouseX < game_scene.buttons[i].DIM[0] + game_scene.buttons[i].DIM[2] && mouseY < game_scene.buttons[i].DIM[1] + game_scene.buttons[i].DIM[3]){
            document.body.style.cursor = "pointer";
        }
    }
}

game_scene.click = function(){
    if(prevMouseDown == true) return;

    handleCardClick();

    for (let i = 0; i < game_scene.buttons.length; i++) {
        if(game_scene.buttons[i].visible == false) continue;
        if(mouseX > game_scene.buttons[i].DIM[0] && mouseY > game_scene.buttons[i].DIM[1] && 
           mouseX < game_scene.buttons[i].DIM[0] + game_scene.buttons[i].DIM[2] && mouseY < game_scene.buttons[i].DIM[1] + game_scene.buttons[i].DIM[3]){
            game_scene.buttons[i].onclick();
        }
    }
}


// Menu
var PLAY_BUTTON;
var ENGLISH_RUSSIAN_BUTTON;
var RESUME_BUTTON;
var RULES_BUTTON;

function initMenuScene(){
    PLAY_BUTTON = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, PLAY, "32px pixel_font", true);
    PLAY_BUTTON.onclick = function(){
        scene = game_scene
        setUp();
    }

    ENGLISH_RUSSIAN_BUTTON = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT - 80, ENGLISH_RUSSIAN, "32px pixel_font", true);
    ENGLISH_RUSSIAN_BUTTON.text_width += 7;
    ENGLISH_RUSSIAN_BUTTON.onclick = function(){
        language = (language+1) % 2;
        LANGUAGE.play();
    }

    RESUME_BUTTON = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 200, RESUME, "32px pixel_font");
    RESUME_BUTTON.text_width += 7;
    RESUME_BUTTON.onclick = function(){
        scene = game_scene;
        resumeTimeouts();
    }

    RULES_BUTTON = new Button(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 100, RULES, "32px pixel_font", true);
    RULES_BUTTON.text_width += 7;
    RULES_BUTTON.onclick = function(){
        LANGUAGE.play();
        scene = rules_scene;
    }

    menu_scene.buttons.push(PLAY_BUTTON);
    menu_scene.buttons.push(ENGLISH_RUSSIAN_BUTTON);
    menu_scene.buttons.push(RESUME_BUTTON);
    menu_scene.buttons.push(RULES_BUTTON);
}

menu_scene = new Scene();
menu_scene.display = function(){
    let time = Date.now();

    for (let col = -2; col < BACKGROUND_COLS+2; col++) {
        for (let row = -2; row < BACKGROUND_ROWS+2; row++) {

            if((col + row) % 2 == 0){
                colorRect(BACKGROUND_COLS_WIDTH * col, BACKGROUND_ROWS_HEIGHT * row + (time / 50) % (BACKGROUND_ROWS_HEIGHT*2), BACKGROUND_COLS_WIDTH, BACKGROUND_ROWS_HEIGHT, "rgba(31, 43, 103, 1)");
            }else{
                colorRect(BACKGROUND_COLS_WIDTH * col, BACKGROUND_ROWS_HEIGHT * row + (time / 50) % (BACKGROUND_ROWS_HEIGHT*2), BACKGROUND_COLS_WIDTH, BACKGROUND_ROWS_HEIGHT, "rgba(30, 40, 95, 1)");
            }

            colorNoFillRect(BACKGROUND_COLS_WIDTH * col, BACKGROUND_ROWS_HEIGHT * row + (time / 50) % (BACKGROUND_ROWS_HEIGHT*2), BACKGROUND_COLS_WIDTH, BACKGROUND_ROWS_HEIGHT, "rgba(33, 33, 45, 0.34)");
        }
    }

    let dim = getTextSize(DURAK[language], "224px pixel_font");
    drawText("white", "224px pixel_font", DURAK[language], CANVAS_WIDTH/2 - dim.width/2, CANVAS_HEIGHT/4+100);// - Math.sin(time/1000)*10);

    for (let i = 0; i < menu_scene.buttons.length; i++) {
        menu_scene.buttons[i].display();
    }
}

menu_scene.hover = function(){
    document.body.style.cursor = "default";
   
    for (let i = 0; i < menu_scene.buttons.length; i++) {
        if(menu_scene.buttons[i].visible == false) continue;
        if(mouseX > menu_scene.buttons[i].DIM[0] && mouseY > menu_scene.buttons[i].DIM[1] && 
           mouseX < menu_scene.buttons[i].DIM[0] + menu_scene.buttons[i].DIM[2] && mouseY < menu_scene.buttons[i].DIM[1] + menu_scene.buttons[i].DIM[3]){
            document.body.style.cursor = "pointer";
        }
    }
}

menu_scene.click = function(){
    if(prevMouseDown == true) return;

    for (let i = 0; i < menu_scene.buttons.length; i++) {
        if(menu_scene.buttons[i].visible == false) continue;
        if(mouseX > menu_scene.buttons[i].DIM[0] && mouseY > menu_scene.buttons[i].DIM[1] && 
           mouseX < menu_scene.buttons[i].DIM[0] + menu_scene.buttons[i].DIM[2] && mouseY < menu_scene.buttons[i].DIM[1] + menu_scene.buttons[i].DIM[3]){
            menu_scene.buttons[i].onclick();
        }
    }
}

// rules
var NO_RESUME_MENU_BUTTON;

function initRulesScene(){
    NO_RESUME_MENU_BUTTON = new Button(CANVAS_WIDTH - 100, 80, MENU, "32px pixel_font", true);
    NO_RESUME_MENU_BUTTON.onclick = function(){
        scene = menu_scene;
        LANGUAGE.play();
    }

    rules_scene.buttons.push(NO_RESUME_MENU_BUTTON);
}

rules_scene = new Scene();
rules_scene.display = function(){
    drawBackground();

    for (let i = 0; i < rules_scene.buttons.length; i++) {
        rules_scene.buttons[i].display();
    }

    let percent_scrolled = (scroll_bar_y - SCROLL_BAR_DIM[1]) / SCROLL_BAR_DIM[3];
    let total_height = 0;

    for (let i = 0; i < PARAGRAPHS.length; i++) {
        let paragraph_split = PARAGRAPHS[i][(language+1)%2].split(" ");
        let line_width = 0;

        for (let j = 0; j < paragraph_split.length; j++) {
            let dim = getTextSize(paragraph_split[j], "32px pixel_font");
            if(line_width + dim.width > 700){
                total_height += 32;
                line_width = 0;
            }

            line_width += dim.width + 20;
        }

        total_height += 75;
    }

    total_height -= CANVAS_HEIGHT - 250;
    let running_y = 0;
    
    for (let i = 0; i < PARAGRAPHS.length; i++) {
        let paragraph_split = PARAGRAPHS[i][(language+1)%2].split(" ");
        let line_width = 0;

        for (let j = 0; j < paragraph_split.length; j++) {
            let dim = getTextSize(paragraph_split[j], "32px pixel_font");
            if(line_width + dim.width > 700){
                running_y += 32;
                line_width = 0;
            }

            drawText("rgba(208, 208, 208, 1)", "32px pixel_font", paragraph_split[j], 100 + line_width,  250+running_y - total_height*percent_scrolled);
            line_width += dim.width + 20;
        }

        running_y += 75;
    }

    drawText("white", "64px pixel_font", DURAK[language], 100, 150 - total_height*percent_scrolled);

    colorRect(SCROLL_BAR_DIM[0], SCROLL_BAR_DIM[1], SCROLL_BAR_DIM[2], SCROLL_BAR_DIM[3], "rgba(16, 21, 74, 1)");

    drawImageFromSpriteSheetWithRotation(SCROLL, 0, 0, 32, 8, SCROLL_BAR_DIM[0] + SCROLL_BAR_DIM[2]/2, scroll_bar_y, 50, 20, 0, false, 1);
}

rules_scene.hover = function(){
    document.body.style.cursor = "default";

    if(mouseX > SCROLL_BAR_DIM[0] - 12.5 && mouseY > SCROLL_BAR_DIM[1] && 
       mouseX < SCROLL_BAR_DIM[0] + SCROLL_BAR_DIM[2] + 12.5 && mouseY < SCROLL_BAR_DIM[1] + SCROLL_BAR_DIM[3]){
        document.body.style.cursor = "pointer";
    }

    if(scroll_bar_held){
        scroll_bar_y = Math.min(Math.max(mouseY, SCROLL_BAR_DIM[1]), SCROLL_BAR_DIM[1] + SCROLL_BAR_DIM[3]);
    }
   
    for (let i = 0; i < rules_scene.buttons.length; i++) {
        if(rules_scene.buttons[i].visible == false) continue;
        if(mouseX > rules_scene.buttons[i].DIM[0] && mouseY > rules_scene.buttons[i].DIM[1] && 
           mouseX < rules_scene.buttons[i].DIM[0] + rules_scene.buttons[i].DIM[2] && mouseY < rules_scene.buttons[i].DIM[1] + rules_scene.buttons[i].DIM[3]){
            document.body.style.cursor = "pointer";
        }
    }
}

rules_scene.click = function(){
    if(prevMouseDown == true) return;

    if(mouseX > SCROLL_BAR_DIM[0] - 12.5 && mouseY > SCROLL_BAR_DIM[1] && 
       mouseX < SCROLL_BAR_DIM[0] + SCROLL_BAR_DIM[2] + 12.5 && mouseY < SCROLL_BAR_DIM[1] + SCROLL_BAR_DIM[3]){
        scroll_bar_held = true;
        return;
    }

    for (let i = 0; i < rules_scene.buttons.length; i++) {
        if(rules_scene.buttons[i].visible == false) continue;
        if(mouseX > rules_scene.buttons[i].DIM[0] && mouseY > rules_scene.buttons[i].DIM[1] && 
           mouseX < rules_scene.buttons[i].DIM[0] + rules_scene.buttons[i].DIM[2] && mouseY < rules_scene.buttons[i].DIM[1] + rules_scene.buttons[i].DIM[3]){
            rules_scene.buttons[i].onclick();
        }
    }
}

function initScenes(){
    initGameScene();
    initMenuScene();
    initRulesScene();
}