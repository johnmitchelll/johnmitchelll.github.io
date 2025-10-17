function getBestMove(numOfResults){

	if(cpuWordle.currentIndex.y == 0){
		let outcome = fazeZeroOrOne(words, 0, numOfResults, letterPosFreq);
		outcome[0] = {word: "crane", score: Infinity};
		return outcome;
	}

	// find allowed words
	let viableAnswers = [];

	// small set of actual answer words
	for (var i = 0; i < words.length; i++) {	
		if(wordIsViable(words[i])){
			viableAnswers.push(words[i]);
		}
	}

	// console.log(viableAnswers);
	// console.log(deepCopyObject(cpuWordle));

	decideCPUWordleFaze(viableAnswers);
	let letterFreq = getLetterPositionalFeqency(viableAnswers);

	return fazeZeroOrOne(viableAnswers, cpuWordle.faze, numOfResults, letterFreq);
}	


// zero and one use the same logic but look at the problem differetly
function fazeZeroOrOne(viableAnswers, faze, numOfResults, letterFreq){

	if(viableAnswers.length == 1){
		return [{word:viableAnswers[0], score: Infinity}];
	}

	// look through all the words that are availble to use and choose the one that will cut down the most amount of words
	let lettersCount = [];

	for (var i = 0; i < viableAnswers.length; i++) {
		let indexesOfUnknownSpaces = [];

		for (var j = 0; j < cpuWordle.greenSpaces.length; j++) {
			if(cpuWordle.greenSpaces[j] == 0){
				indexesOfUnknownSpaces.push(j);
			}
		}
		

		// find out what the letters occurence is for the word
		for (var j = 0; j < 5; j++) {
			if(!indexesOfUnknownSpaces.includes(j)){
				continue;
			}

			// figure out what letters are in each word non repeating and add it to its count
			let includes = false;
			for (var e = 0; e < lettersCount.length; e++) {
				if(equalIgnoreCase(viableAnswers[i][j], lettersCount[e].letter)){

					let firstIndex = doesLetterRepeatInWord(viableAnswers[i], viableAnswers[i][j])

					if(firstIndex == false){
						lettersCount[e].count++;
					}else if(j == firstIndex){
						lettersCount[e].count++;
					}

					includes = true;
					break;
				}

			}

			// if we have not found any words that contain this letter then add it to the list
			if(includes == false){
				lettersCount.push({letter:viableAnswers[i][j], count:1});
			}
		}
	}
	
	// console.log(viableAnswers)
	// console.log(lettersCount)

	// time for the fun part
	let bestWords = [];
	let wordPool = allowedWords;
	let totalUniqueLetters = 0;

	for (var i = 0; i < lettersCount.length; i++) {
		for (var j = 0; j < lettersCount[i].count; j++) {
			totalUniqueLetters++;
		}
	}

	if(faze == 0){
		wordPool = viableAnswers;
	}

	// now find the word with the most amount of good letters in the right spaces
	for (var i = 0; i < wordPool.length; i++) {
		let score = 0;

		if(wordHasBeenPlayed(wordPool[i])){
			continue;
		}

		for (var j = 0; j < lettersCount.length; j++) {	
			let indexOf = wordPool[i].indexOf(lettersCount[j].letter);

			if(indexOf != -1){
				let addition = lettersCount[j].count / totalUniqueLetters;

				if(lettersCount[j].letter == cpuWordle.greenSpaces[indexOf]){
					addition /= 1000;
				}

				score +=  addition//* (1 - 1 / lettersCount[j].count);
			}
		}

		if(score > 0){
			score += 0.165*getScoreFromLetterPositions(wordPool[i], letterFreq)
			bestWords.push({word:wordPool[i], score: score})
		}
	}

	bestWords.sort(function(a, b){return b.score - a.score});
	 
	 if(bestWords.length > numOfResults){
		bestWords.length = numOfResults;
	}

	return bestWords;
}


function wordIsViable(word){

	for (var i = 0; i < 5; i++) {

		if(cpuWordle.greenSpaces[i] != 0 && word[i] != cpuWordle.greenSpaces[i]){

			// if(word == "cheek"){
			// console.log("GREEN", word, word[i], cpuWordle.greenSpaces[i])
			// }
			return false;
		}
		if(cpuWordle.yellowSpaces[i].length > 0){
			if(cpuWordle.yellowSpaces[i].includes(word[i])){
				
				// if(word == "cheek"){
				// console.log("YELLOW IN WRONG SPACE", word, cpuWordle.yellowSpaces[i], i)
				// }
				return false;
			}
		}

		for (var e = 0; e < 5; e++) {
			for (var j = 0; j < cpuWordle.yellowSpaces[e].length; j++) {
				if(!word.includes(cpuWordle.yellowSpaces[e][j])){
						
					// if(word == "cheek"){	
					// console.log("YELLOW DONT INCLUDE", word, cpuWordle.yellowSpaces[e][j])
					// }
					return false;
				}
			}
		}
		
		if(cpuWordle.blankSpaces.includes(word[i])){
			// if(word == "cheek"){
			// console.log("BLANK", word, cpuWordle.blankSpaces, word[i])
			// }
			return false;
		}
	}

	if(wordHasCorrectLetterCount(word) == false){
		// if(word == "cheek"){
		// 	console.log("COUNT")
		// }
		return false;
	}

	return true;
}

function wordHasCorrectLetterCount(word){

	// checking to see if we have any letters that we knwo are in the word
	// if we dont know how many letters are in the word then we dont care 
	if(cpuWordle.lettersInWord.length == 0){
		return true;
	}

	// see if the word has the letter in it and also see if that letter has the correct count
	let valid = true;
	let includes = false;
	for (var i = 0; i < cpuWordle.lettersInWord.length; i++) {

		if(!word.includes(cpuWordle.lettersInWord[i])){
			valid = false;
		}

		for (var j = 0; j < word.length; j++) {
			if(equalIgnoreCase(word[j], cpuWordle.lettersInWord[i])){
				includes = true;
				let countCPU = cpuWordle.getLetterObjFromChar(cpuWordle.lettersInWord[i]).count;
				let countWord = getLetterCountOfList(word, cpuWordle.lettersInWord[i]);

				if(countWord < countCPU){
					valid = false;
				}
			}	
		}
	}

	if(valid && includes){
		return true;
	}
	
	return false;
}

function doesLetterRepeatInWord(word, letter){
	let firstOccurenceIndex = undefined;

	for (var i = 0; i < word.length; i++) {
		if(equalIgnoreCase(letter, word[i])){
			if(firstOccurenceIndex == undefined){
			 	firstOccurenceIndex = i;
			}else{
				return firstOccurenceIndex;
			}
		}
	}

	return false;
}	

function getLetterCountOfList(list, letter){
	let count = 0;

	for (var i = 0; i < list.length; i++) {
		if(list[i] == letter){
			count++;
		}
	}

	return count;
}

function getLetterCountOfLettersInWord(letter){
	let count = 0;
	let word = ""

	for (var i = 0; i < 5; i++) {
		if(equalIgnoreCase(cpuWordle.grid[i][cpuWordle.currentIndex.y].letter, letter) 
			&& (cpuWordle.grid[i][cpuWordle.currentIndex.y].color == GREEN 
			|| cpuWordle.grid[i][cpuWordle.currentIndex.y].color == YELLOW)){
				count++;
		}

		word += cpuWordle.grid[i][cpuWordle.currentIndex.y].letter;
	}

	// console.log(word, letter, count)

	return count;
}

function decideCPUWordleFaze(viableAnswers){
    if(cpuWordle.currentIndex.y < 5 && viableAnswers.length > 2){
		cpuWordle.faze = 1;
        return;
    }

    cpuWordle.faze = 0;
}


/* game plan: 
	1. find words that are availible from small set
	2. figure out what faze of searching you are in
	3. based off of how you are searching pull up best word
*/

function getLetterPositionalFeqency(viableAnswers){
	let wordFrequencty = [[],[],[],[],[]];

	for (var i = 0; i < viableAnswers.length; i++) {
		for (var e = 0; e < 5; e++) {
			let indexOf = -1;

			for (var j = 0; j < wordFrequencty[e].length; j++) {
				if(wordFrequencty[e][j].letter == viableAnswers[i][e]){
					indexOf = j;
					break;
				}
			}

			if(indexOf == -1){
				wordFrequencty[e].push({letter:viableAnswers[i][e], count:0});
				continue;
			}

			wordFrequencty[e][indexOf].count++;
		}
	}

	for (var i = 0; i < 5; i++) {
		wordFrequencty[i].sort(function(a, b){return b.count - a.count});
	}


	// creating a list of the plain letters
	let letterFreq = [[],[],[],[],[]];


	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < wordFrequencty[i].length; j++) {
			letterFreq[i].push(wordFrequencty[i][j].letter);
		}
	}


	return letterFreq;
}


function getScoreFromLetterPositions(word, wordFrequencty){
	let score = 0

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < wordFrequencty[i].length; j++) {
			if(equalIgnoreCase(wordFrequencty[i][j], word[i])){
				score += (26-i) / 26;
				// score += (wordFrequencty[i].length-i) / wordFrequencty[i].length;
			}
		}
	}

	return score;

}

function wordHasBeenPlayed(word){
	let words = ["", "", "", "", "", ""];

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < cpuWordle.currentIndex.y; j++) {
			words[j] += cpuWordle.grid[i][j].letter;
		}
	}

	if(words.includes(word)){
		return true;
	}

	return false;
}	




