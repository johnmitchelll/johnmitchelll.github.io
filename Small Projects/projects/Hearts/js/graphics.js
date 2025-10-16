
const CARD_PIC_WIDTH = 73;
const CARD_PIC_HEIGHT = 105;

const SCREEN_AREA = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT);

const CARD_WIDTH = Math.max(SCREEN_AREA/8, 300/8);
const CARD_HEIGHT = Math.max(SCREEN_AREA/5, 300/5);

var scorePage = false;
var gameOver = false;

var scoresButton = document.getElementById("scores");
var playAgainButton = document.getElementById("playAgain");

function draw(){
    colorRect(0,0, canvas.width, canvas.height, "rgb(64,122,93)");

    drawPlayersHands();

    if(scorePage){
        let w;

        if(gameOver){
            w = measureText("GAME OVER", 36, "pixel_font").width;
            drawText("black", "36px pixel_font", "GAME OVER", CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT/2-100);
        }else{
            w = measureText("SCORES:", 36, "pixel_font").width;
            drawText("black", "36px pixel_font", "SCORES:", CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT/2-100);
        }

        w = measureText(scores[0], 36, "pixel_font").width;
        drawText("black", "36px pixel_font", scores[0], CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT/2-55);
        colorRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2-73, 20, 20, "blue");
        colorNoFillRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2-73, 20, 20, "lightgrey");

        w = measureText(scores[1], 36, "pixel_font").width;
        drawText("black", "36px pixel_font", scores[1], CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT/2-19);
        colorRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2-38, 20, 20, "red");
        colorNoFillRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2-38, 20, 20, "lightgrey");

        w = measureText(scores[2], 36, "pixel_font").width;
        drawText("black", "36px pixel_font", scores[2], CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT/2+17);
        colorRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2-2, 20, 20, "white");
        colorNoFillRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2-2, 20, 20, "lightgrey");
        
        w = measureText(scores[3], 36, "pixel_font").width;
        drawText("black", "36px pixel_font", scores[3], CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT/2+53);
        colorRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2+34, 20, 20, "black");
        colorNoFillRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT/2+34, 20, 20, "lightgrey");
        return;
    }

    drawPlayersPoints();
    drawPlayedCards();
    drawCollectCards();

    scoresButton.style.top = (canvas.offsetTop + 10) + "px";
    scoresButton.style.left = (canvas.offsetLeft + 10 / CANVAS_WIDTH * canvas.offsetWidth) + "px";
}


function drawPlayersHands(){
    // bottom and top players
    for (let i = 0; i < players[0].length; i++) {
        players[0][i].display(CANVAS_WIDTH/2 - players[0].length/2 * CARD_WIDTH/2 + i * CARD_WIDTH/2 + CARD_WIDTH/4, CANVAS_HEIGHT-CARD_HEIGHT/2 + 30, 0);
    }

    for (let i = players[2].length-1; i >= 0; i--) {
        players[2][i].display(CANVAS_WIDTH/2 - players[2].length/2 * CARD_WIDTH/4 + i * CARD_WIDTH/4 + CARD_WIDTH/8, 30, 0);
    }

    // left and right players
    for (let i = 0; i < players[1].length; i++) {
        players[1][i].display(CARD_WIDTH/2, CANVAS_HEIGHT/2 - players[1].length/2 * CARD_HEIGHT/8 + i * CARD_HEIGHT/8 + CARD_HEIGHT/16, Math.PI/2);
    }

    for (let i = players[3].length-1; i >= 0; i--) {
        players[3][i].display(CANVAS_WIDTH-CARD_WIDTH/2, CANVAS_HEIGHT/2 - players[3].length/2 * CARD_HEIGHT/8 + i * CARD_HEIGHT/8 + CARD_HEIGHT/16, Math.PI/2);
    }
}

function drawPlayedCards(){
    if(playedCards[0]) playedCards[0].display(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + CARD_HEIGHT, 0);
    if(playedCards[1]) playedCards[1].display(CANVAS_WIDTH/2-CARD_WIDTH*1.5, CANVAS_HEIGHT/2, 0);
    if(playedCards[2]) playedCards[2].display(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - CARD_HEIGHT, 0);
    if(playedCards[3]) playedCards[3].display(CANVAS_WIDTH/2+CARD_WIDTH*1.5, CANVAS_HEIGHT/2, 0);
}

function drawPlayersPoints(){
    let w = measureText("POINTS: " + points[0], 24, "pixel_font").width;
    drawText("black", "24px pixel_font", "POINTS: " + points[0], CANVAS_WIDTH/2 - w/2, CANVAS_HEIGHT-CARD_HEIGHT+20);
    colorRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT-CARD_HEIGHT+3, 20, 20, "blue");
    colorNoFillRect(CANVAS_WIDTH/2 - w/2 - 25, CANVAS_HEIGHT-CARD_HEIGHT+3, 20, 20, "lightgrey");

    w = measureText("POINTS: " + points[1], 24, "pixel_font").width;
    drawText("black", "24px pixel_font", "POINTS: " + points[1], 30, CANVAS_HEIGHT/2 - players[1].length/2 * CARD_HEIGHT/8 + CARD_HEIGHT/16 - 40);
    colorRect(35 + w, CANVAS_HEIGHT/2 - players[1].length/2 * CARD_HEIGHT/8 + CARD_HEIGHT/16 - 55, 20, 20, "red");
    colorNoFillRect(35 + w, CANVAS_HEIGHT/2 - players[1].length/2 * CARD_HEIGHT/8 + CARD_HEIGHT/16 - 55, 20, 20, "lightgrey");

    w = measureText("POINTS: " + points[2], 24, "pixel_font").width;
    drawText("black", "24px pixel_font", "POINTS: " + points[2], CANVAS_WIDTH/2 - w/2, CARD_HEIGHT-10);
    colorRect(CANVAS_WIDTH/2 - w/2 + 5 + w, CARD_HEIGHT-25, 20, 20, "white");
    colorNoFillRect(CANVAS_WIDTH/2 - w/2 + 5 + w, CARD_HEIGHT-25, 20, 20, "lightgrey");

    w = measureText("POINTS: " + points[3], 24, "pixel_font").width;
    drawText("black", "24px pixel_font", "POINTS: " + points[3], CANVAS_WIDTH-w-27, CANVAS_HEIGHT/2 - players[3].length/2 * CARD_HEIGHT/8 + CARD_HEIGHT/16 - 40)
    colorRect(CANVAS_WIDTH-w - 53, CANVAS_HEIGHT/2 - players[3].length/2 * CARD_HEIGHT/8 + CARD_HEIGHT/16 - 55, 20, 20, "black");
    colorNoFillRect(CANVAS_WIDTH-w - 53, CANVAS_HEIGHT/2 - players[3].length/2 * CARD_HEIGHT/8 + CARD_HEIGHT/16 - 55, 20, 20, "lightgrey");
}

function initCollectCards(max){
    collector = max;

    for (let i = 0; i < playedCards.length; i++) {
        collectCards[i] = deepCopyObject(playedCards[i]);
        collectCards[i].startX = collectCards[i].x;
        collectCards[i].startY = collectCards[i].y;
        collectCards[i].animate = true;
    }

    setTimeout(() => {
        collector = undefined;
        collectCards = [];
    }, 1000);
}

function drawCollectCards(){
    if(collectCards.length == 0) return;
    let locations = [[CANVAS_WIDTH/2, CANVAS_HEIGHT + CARD_HEIGHT/2], 
                     [-CARD_WIDTH/2, CANVAS_HEIGHT/2], 
                     [CANVAS_WIDTH/2, -CARD_HEIGHT/2], 
                     [CANVAS_WIDTH + CARD_WIDTH/2, CANVAS_HEIGHT/2]];

    for (let i = 0; i < collectCards.length; i++) {
        collectCards[i].display(locations[collector][0], locations[collector][1], 0);
    }
}

function toggleScorePage(){
    if(scorePage){
        scorePage = false;
        scoresButton.style.top = (canvas.offsetTop + 10) + "px";
        scoresButton.style.left = (canvas.offsetLeft + 10 / CANVAS_WIDTH * canvas.offsetWidth) + "px";
        scoresButton.style.transform = "translate(0%, 0%)";
        scoresButton.innerHTML = "SCORES";
        if(!preDealPass) return;
        document.getElementById("pass").style.display = "inline";
        document.getElementById("num_cards").style.display = "inline";
        return;
    }

    scorePage = true;
    document.getElementById("pass").style.display = "none";
    document.getElementById("num_cards").style.display = "none";
    scoresButton.style.left = "50%";
    scoresButton.style.transform = "translate(-50%, -50%)";
    scoresButton.style.top = "75%";
    scoresButton.innerHTML = "GO BACK";
}