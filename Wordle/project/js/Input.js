// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;

const DELETE = 8;
const SPACE = 32;
const ENTER = 13;
const UP = 38
const RIGHT = 39;
const DOWN = 40;
const LEFT = 37;
const G = 71;
const Y = 89;
const B = 66;
const ESC = 27;
var escHeld = false;


function keyPressed(evt){ 
  handleScenes(evt.keyCode);
  evt.preventDefault();
}

function keyReleased(evt){ 
  if(evt.keyCode == ESC){
    escHeld = false;
  }
  
  evt.preventDefault();
}

document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyReleased)
document.addEventListener('mousemove', updateMousePos);

document.addEventListener('touchstart', setMouseDown, { passive: false});
document.addEventListener('touchend', setMouseUp, { passive: false});
document.addEventListener('touchmove', touchMove, { passive: false});

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = (evt.clientX - rect.left) - canvas.width/2;
  mouseY = (evt.clientY - rect.top) - canvas.height/2;
}

function setMouseDown(evt){}
function setMouseUp(evt){}
function touchMove(evt){}

//////////////////////////////////////////


function SceneOneInput(keyCode){
    if(keyCode == RIGHT && cpuWordle.currentIndex.x < 4){
        cpuWordle.currentIndex.x++;
    }

    if(keyCode == LEFT && cpuWordle.currentIndex.x > 0){
        cpuWordle.currentIndex.x--;
    }

    let nodeAtCurrentIndex = document.getElementById((cpuWordle.currentIndex.x) + "wordleRow" + (cpuWordle.currentIndex.y+1));
    if(keyCode == G){
        nodeAtCurrentIndex.style.background = GREEN;

        if(cpuWordle.currentIndex.x < 4){
            cpuWordle.currentIndex.x++;
        }
    }
    if(keyCode == Y){
        nodeAtCurrentIndex.style.background = YELLOW;

        if(cpuWordle.currentIndex.x < 4){
            cpuWordle.currentIndex.x++;
        }
    }
    if(keyCode == B){
        nodeAtCurrentIndex.style.background = BLANK;

        if(cpuWordle.currentIndex.x < 4){
            cpuWordle.currentIndex.x++;
        }
    }

    if(keyCode == ENTER){
        turnsInfo.push(deepCopyObject(cpuWordle))
        setWordleValuesFromHTML();

        currentScene = 0;
        cpuWordle.currentIndex.y++;
        clearWordList();
        updateWordList();
        handleWinLoss();

        updateKeyBoardColors();

        let element = document.getElementById("wordSearch");
        element.value = "";
        setCursorInputPosition(element, 0);
    }

    if(keyCode == ESC && escHeld == false){
        currentScene = 0;
        escHeld = true;
        clearWordFromWordleGrid();
        updateKeyBoardColors();
    }
}

function SceneZeroInput(keyCode){
    let element = document.getElementById("wordSearch");
    let letter = cpuWordle.getLetterObjFromKeyCode(keyCode);

    if(letter && keyCode == letter.keyCode && element.value.length < 5){
        element.value += letter.letter;
        setCursorInputPosition(element, currentSearchPos+1)
        handleSearchFromCurrentInput(element);
    }

    if(keyCode == DELETE){
        let word = "";

        for (var i = 0; i < element.value.length-1; i++) {
            word += element.value[i];
        }

        element.value = word;
        setCursorInputPosition(element, currentSearchPos-1)
        handleSearchFromCurrentInput(element);
    }

    if(keyCode == ESC && cpuWordle.currentIndex.y > 0 && escHeld == false){
        escHeld = true;
        currentScene = 1;
        cpuWordle.currentIndex.y--;
        cpuWordle = turnsInfo.pop();
        clearWordList();
        updateWordList();
        updateKeyBoardColors(); 
    }
}