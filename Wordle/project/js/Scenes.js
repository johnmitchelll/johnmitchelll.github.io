function handleScenes(keyCode){
    // yelllow green blank scene
    if(currentScene == 1){
        document.getElementById("keyBoardRow1").style.display = "none";
        document.getElementById("keyBoardRow2").style.display = "none";
        document.getElementById("keyBoardRow3").style.display = "none";
        document.getElementById("interact").style.display = "none";
        document.getElementById("YGBRow").style.display = "flex";
        document.getElementById("Restart").style.display = "none";
        document.getElementById("Test").style.display = "none";
        document.getElementById("InfoBox").textContent = "FILL IN THE COLOR OF EACH LETTER, USE THE ARROWS TO NAVIGATE";

        SceneOneInput(keyCode);
        centerIndexOnCurrentIndex();
    }

    // input search word scene
    if(currentScene == 0){
        document.getElementById("keyBoardRow1").style.display = "flex";
        document.getElementById("keyBoardRow2").style.display = "flex";
        document.getElementById("keyBoardRow3").style.display = "flex";
        document.getElementById("interact").style.display = "flex";
        document.getElementById("top").style.display = "flex";
        document.getElementById("YGBRow").style.display = "none";
        document.getElementById("Restart").style.display = "none";
        document.getElementById("InfoBox").textContent = "THE BEST WORD IS DISPLAYED AT THE TOP, SELECT FROM THE BEST WORDS OR SEARCH FOR A WORD";
        document.getElementById("Menu").style.display = "none";
        document.getElementById("Test").style.display = "none";

        SceneZeroInput(keyCode);
        document.getElementById("currentIndex").style.display = "none";
    }

    if(currentScene == 2){
        document.getElementById("keyBoardRow1").style.display = "none";
        document.getElementById("keyBoardRow2").style.display = "none";
        document.getElementById("keyBoardRow3").style.display = "none";
        document.getElementById("interact").style.display = "none";
        document.getElementById("YGBRow").style.display = "none";
        document.getElementById("currentIndex").style.display = "none";
        document.getElementById("Restart").style.display = "flex";
        document.getElementById("Test").style.display = "none";

        if(winner){
            document.getElementById("InfoBox").textContent = "WORD SOLVED, PRESS RESTART TO SOLVE ANOTHER";
            return;
        }

        document.getElementById("InfoBox").textContent = "SORRY I COULDN'T HELP, PRESS RESTART TO TRY AGAIN";        
    }

    if(currentScene == 3){
        document.getElementById("keyBoardRow1").style.display = "none";
        document.getElementById("keyBoardRow2").style.display = "none";
        document.getElementById("keyBoardRow3").style.display = "none"; 
        document.getElementById("interact").style.display = "none";
        document.getElementById("currentIndex").style.display = "none";
        document.getElementById("YGBRow").style.display = "none";
        document.getElementById("Restart").style.display = "none";
        document.getElementById("top").style.display = "none";
        document.getElementById("Menu").style.display = "flex";
        document.getElementById("Test").style.display = "none";
        document.getElementById("InfoBox").style.display = "flex";
        document.getElementById("gameCanvas").style.display = "none";
        document.getElementById("testDiv").style.display = "none";
        document.getElementById("top").style.height = "56.25vh";

        document.getElementById("InfoBox").textContent = "WELCOME TO WORDLE CYPHER, THE BEST WORDLE A.I. ON THE PLANET";
    }

    if(currentScene == 4){
        drawTest();
        document.getElementById("top").style.display = "flex";
        document.getElementById("top").style.height = "70vh";
        document.getElementById("testInfo").style.height = "auto";
        document.getElementById("gameCanvas").style.height = "80%";
        // document.getElementById("bottom").style.height = "75vh";
        document.getElementById("InfoBox").style.display = "none";
        document.getElementById("testDiv").style.display = "flex";
        document.getElementById("Menu").style.display = "none";
        document.getElementById("Test").style.display = "flex";
        document.getElementById("gameCanvas").style.display = "inline";
    }

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById("bottom").style.height = "31vh";
        document.getElementById("top").style.height = "41vh";
        document.getElementById("body").style.height = "80vh";
    }else{
         document.getElementById("bottom").style.height = "36vh";
         document.getElementById("top").style.height = "56vh";
         document.getElementById("body").style.height = "100vh";
    }
} 


function setWordleValuesFromHTML(){
    for (var i = 0; i < 5; i++) {
        cpuWordle.grid[i][cpuWordle.currentIndex.y].letter = document.getElementById(i + "wordleRow" + (cpuWordle.currentIndex.y+1)).textContent;
        cpuWordle.grid[i][cpuWordle.currentIndex.y].color = document.getElementById(i + "wordleRow" + (cpuWordle.currentIndex.y+1)).style.background;
    }

    cpuWordle.updateWordInfo();
}

function setCursorInputPosition(e, pos) {
    e.focus();
    e.setSelectionRange(pos, pos);
}

function handleSearchFromCurrentInput(searchElement){
    if(searchElement.value.length == 0){
        clearWordList();
        updateWordList();
        return;
    }

    let viableWords = [];

    for (var i = 0; i < omegaWordList.length; i++) {
        includes = true;

        for (var j = 0; j < searchElement.value.length; j++) {
            if(omegaWordList[i][j] != searchElement.value[j].toLowerCase()){
                includes = false;
            }
        }

        if(includes){
            viableWords.push({word:omegaWordList[i]})
        }
    }


    clearWordList();
    actualWordListLen = viableWords.length;
    desiredWordListLen = -1;

    for (var i = 0; i < actualWordListLen; i++) {
        makeNewWordButton(viableWords, i);
    }
}

function handleWinLoss(){
    let unconfirmedSpaces = 0;

    for (var i = 0; i < 5; i++) {
        if(cpuWordle.grid[i][cpuWordle.currentIndex.y-1].color != GREEN){
            unconfirmedSpaces++;   
        }
    }

    if(cpuWordle.currentIndex.y < 6 && actualWordListLen == 0){
        winner = false;
        currentScene = 2;
    }

    if(unconfirmedSpaces < 5 && cpuWordle.currentIndex.y == 6){
        winner = false;
        currentScene = 2;
    }

    if(unconfirmedSpaces == 0){
        winner = true;
        currentScene = 2;
    }
}

function goToScene(i){
    currentScene = i;
}

function initTest(){
    cpuWordle = new WordGrid();
    test = new TestBrain();
}




