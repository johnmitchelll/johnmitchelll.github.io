function TestBrain(){
    this.currentWordIndex = 0;
    this.currentWord = words[this.currentWordIndex];
    this.results = [];
    this.wordsPlayedOnWord = [];
    this.runningTotalOfTurns = 0;
    this.listOFlostGames = [];
    this.numOfLostGames = 0;

    // console.log(this.currentWord)

    this.playWord = function(){
        cpuWordle = new WordGrid();
        let win = false;
        let colors = [[0,0,0,0,0],
                      [0,0,0,0,0],
                      [0,0,0,0,0],
                      [0,0,0,0,0],
                      [0,0,0,0,0],
                      [0,0,0,0,0]];

        // play word in cpu wordle if the game is not over
        while(cpuWordle.currentIndex.y < 6 && win == false){

            // computer tells us what to play
            let wordToPlay = getBestMove(1)[0].word;
            this.wordsPlayedOnWord.push(wordToPlay);

            // console.log(wordToPlay)


            // set the word in the grid
            for (var i = 0; i < 5; i++) {
                cpuWordle.grid[i][cpuWordle.currentIndex.y].letter = wordToPlay[i];
            }

            // add the info given by the guess
            for (var i = 0; i < 5; i++) {

                if(equalIgnoreCase(wordToPlay[i], this.currentWord[i])){
                    cpuWordle.greenSpaces[i] = wordToPlay[i];

                    cpuWordle.grid[i][cpuWordle.currentIndex.y].color = GREEN;

                    if(!cpuWordle.lettersInWord.includes(wordToPlay[i])){
                        cpuWordle.lettersInWord.push(wordToPlay[i]);
                    }
                    continue;
                }


                if(this.currentWord.includes(wordToPlay[i])){   
                    let countInCurrentWord = getLetterCountOfList(this.currentWord, wordToPlay[i])
                    let numLocationsFound = 0;

                    for (var j = 0; j < 5; j++) {
                        if(equalIgnoreCase(this.currentWord[j], wordToPlay[j]) && equalIgnoreCase(this.currentWord[j], wordToPlay[i])){
                            numLocationsFound++;
                            continue;
                        }
                    }

                    // console.log(wordToPlay[i], countInCurrentWord, numLocationsFound)

                    for (var j = 0; j < 5; j++) {
                        // console.log(this.currentWord[j], equalIgnoreCase(this.currentWord[j], wordToPlay[i]), numLocationsFound, countInCurrentWord)
                        if(!equalIgnoreCase(this.currentWord[j], wordToPlay[j]) && 
                            equalIgnoreCase(wordToPlay[j], wordToPlay[i]) && 
                            numLocationsFound < countInCurrentWord){

                            // console.log(cpuWordle.grid[j][cpuWordle.currentIndex.y], j)
                            cpuWordle.grid[j][cpuWordle.currentIndex.y].color = YELLOW;
                            cpuWordle.yellowSpaces[j].push(wordToPlay[i]);

                            if(!cpuWordle.lettersInWord.includes(wordToPlay[i])){
                                cpuWordle.lettersInWord.push(wordToPlay[i]);
                            }

                            numLocationsFound++;
                        }
                    }
                }

                // console.log("BLANK")
                if(!cpuWordle.lettersInWord.includes(wordToPlay[i]) && !this.currentWord.includes(wordToPlay[i])){
                    cpuWordle.grid[i][cpuWordle.currentIndex.y].color = BLANK;
                    cpuWordle.blankSpaces.push(wordToPlay[i]);
                }

            }

            // update the count of the letter obj array
            cpuWordle.updateLetterObjArray();

            for (var i = 0; i < 5; i++) {
                colors[cpuWordle.currentIndex.y][i] = cpuWordle.grid[i][cpuWordle.currentIndex.y].color;
            }

            // move forward a turn
            cpuWordle.currentIndex.y++;

            // check for win

            win = true;
            for (var i = 0; i < cpuWordle.greenSpaces.length; i++) {
                if(cpuWordle.grid[i][cpuWordle.currentIndex.y-1].color != GREEN){
                    win = false;
                }      
            }   

        }

        this.runningTotalOfTurns += cpuWordle.currentIndex.y;
        this.results.push({turns:cpuWordle.currentIndex.y, word:this.currentWord, 
                           win:win, wordsUsed:this.wordsPlayedOnWord, colors:colors});
    }

    this.playNextWord = function(){
        if(this.numOfLostGames > 0){
            return;
        }

        if(words[this.currentWordIndex] != undefined){
            this.currentWord = words[this.currentWordIndex];
            this.wordsPlayedOnWord = [];

            this.playWord();

            // console.log(this.currentWordIndex, this.currentWord, 
            //             this.results[0].turns, 
            //             this.results[0].wordsUsed, 
            //             this.results[0].win);

            this.currentWordIndex++;
            return;
        }

        this.listOFlostGames = [];
        this.numOfLostGames = 0;

        for (var i = 0; i < this.results.length; i++) {
            if(this.results[i].win == false){
                this.numOfLostGames++;
                this.listOFlostGames.push(this.results[i])
            }
        }

        // console.log("done", "lost games " + this.numOfLostGames, "lost games ");
        // console.log(this.listOFlostGames);
    }
}


function frequencyAndPosOfLetterInWord(word, letter){
    let positionsOfLetter = [];

    for (var i = 0; i < 5; i++) {
        if(letter == word[i]){
            positionsOfLetter.push(i);
        }
    }

    return {pos:positionsOfLetter, count:positionsOfLetter.length};
}


function drawTest(){
    test.playNextWord();

    colorRect(0, 0, canvas.width, canvas.height, 'rgb(255,255,255)');
    let amountsOfGuesses = [0,0,0,0,0,0];
    let columnWidth = canvas.width / amountsOfGuesses.length;
    let averageGuesses = 0;

    for (var i = 0; i < test.results.length; i++) {
        amountsOfGuesses[test.results[i].turns-1]++;
        averageGuesses += test.results[i].turns;
    }

    for (var i = 0; i < amountsOfGuesses.length; i++) {
        colorRect(i*columnWidth, canvas.height, columnWidth, -(canvas.height) * (amountsOfGuesses[i] / test.results.length), "rgb(0," + (255/(amountsOfGuesses.length-i)) + "," +  (255/(i+1)) + ")");
        drawText("green", amountsOfGuesses[i], i*columnWidth + columnWidth/2,canvas.height - (canvas.height * amountsOfGuesses[i] / test.results.length));
        drawText("black", i+1, i*columnWidth + columnWidth/2, 10);
        drawLine(i*columnWidth,0,i*columnWidth,canvas.height,0.5,"grey")
    }

    averageGuesses /= test.results.length;
    document.getElementById("testRowZero").textContent =  "Average Amount Of Guesses: " + averageGuesses.toFixed(3);
    document.getElementById("testRowOne").textContent =  "Progress: " + test.results.length + " / " + words.length;
    document.getElementById("testRowTwo").textContent =  "Current Word: " + test.results[test.results.length-1].word;

    // clear wordle html
    for (var i = 5; i >= 0; i--) {
        cpuWordle.currentIndex.y = i;
        clearWordFromWordleGrid();
    }

    document.getElementById("top").style.display = "flex";

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 6; j++) {

            if(test.results[test.results.length-1].colors[j][i] == 0){
                break;
            }

            if(document.getElementById(i + "wordleRow" + (j+1))){
                document.getElementById(i + "wordleRow" + (j+1)).style.background = test.results[test.results.length-1].colors[j][i];
                document.getElementById(i + "wordleRow" + (j+1)).textContent = test.results[test.results.length-1].wordsUsed[j][i].toUpperCase();
            }
        }
    }
}




