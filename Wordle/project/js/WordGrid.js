function WordGrid(){
    this.cols = 5;
    this.rows = 6;
    this.grid = new Array(this.cols);
    this.currentIndex = new Vector(0,0);

    this.letters = new Array(26);
    this.greenSpaces = [0,0,0,0,0];
    this.yellowSpaces = [[],[],[],[],[]];
    this.blankSpaces = [];
    this.lettersInWord = [];
    
    // faze 0: look for fastest path, 1: scramble, find word that will cut down most words that are left
    this.faze = 0;

    for (var i = 0; i < this.letters.length; i++) {
        this.letters[i] = new Letter(i);
    }

    for (var i = 0; i < this.grid.length; i++) {
        this.grid[i] = new Array(this.rows);
    }

    for (var col = 0; col < this.grid.length; col++) {
        for (var row = 0; row < this.grid[col].length; row++) {
            this.grid[col][row] = new Node();
        }   
    }

    this.updateWordInfo = function(){

        for (var i = 0; i < 5; i++) {
            let node = this.grid[i][this.currentIndex.y];
            let letter = this.getLetterObjFromChar(node.letter);

        // check for green letters
           if(node.color == GREEN){
                this.greenSpaces[i] = letter.letter.toLowerCase();
                if(!this.lettersInWord.includes(letter.letter.toLowerCase())){
                    this.lettersInWord.push(letter.letter.toLowerCase())
                }
           }

        // check for yellow letters
           if(node.color == YELLOW){
                this.yellowSpaces[i].push(letter.letter.toLowerCase());
                if(!this.lettersInWord.includes(letter.letter.toLowerCase())){
                    this.lettersInWord.push(letter.letter.toLowerCase())
                }
           }

        // check for blank letters
           if(node.color == BLANK){
                letter.availble = false;

                if(!this.blankSpaces.includes(letter.letter.toLowerCase()) 
                    && this.getLetterObjFromChar(letter.letter).count == 0){
                        this.blankSpaces.push(letter.letter.toLowerCase());
                }
           }
        }

        this.updateLetterObjArray();
    }

    this.updateLetterObjArray = function(){
        // update what the letter count of each of the letters in the word if the count is greater than what it alr is

        // console.log(deepCopy(this.yellowSpaces))

        for (var i = 0; i < 5; i++) {
            let countOfLetterInWord = getLetterCountOfLettersInWord(this.grid[i][this.currentIndex.y].letter, this);
            let letterObj = this.getLetterObjFromChar(this.grid[i][this.currentIndex.y].letter);

            // console.log(this.grid[i][this.currentIndex.y], i)

            if((this.grid[i][this.currentIndex.y].color == YELLOW || this.grid[i][this.currentIndex.y].color == GREEN) && 
                countOfLetterInWord > letterObj.count){
                    letterObj.count = countOfLetterInWord;
            }
        }
    }

    this.getLetterObjFromChar = function(char){
    // feed this function a char and it will give you the letter that coresponds to the letters array
        for (var i = 0; i < 26; i++) {
            if(equalIgnoreCase(this.letters[i].letter, char)){

                return this.letters[i];
            }
        }
    }   

    this.getLetterObjFromKeyCode = function(keyCode){
    // feed this function a char and it will give you the letter that coresponds to the letters array
        for (var i = 0; i < 26; i++) {
            if(this.letters[i].keyCode == keyCode){

                return this.letters[i];
            }
        }
    }

}

function Node(){
    this.letter = "";
    this.color = undefined;
}


function Letter(letterNumber){
    this.keyCode = letterNumber + 65;
    this.index = letterNumber;
    this.letter = String.fromCharCode(this.keyCode);

    this.availble = true;
    this.count = 0;
}

