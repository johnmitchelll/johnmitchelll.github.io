const configurations = calculateWordConfigurations();

function getBestMove(numOfResults){
	let viableAnswers = getViableAnswers(cpuWordle);

	return fazeZeroOrOne(viableAnswers, numOfResults);
}	


// zero and one use the same logic but look at the problem differetly
function fazeZeroOrOne(viableAnswers, numOfResults){
	let bestWords = [];

	if(viableAnswers.length == 1){
		return [{word:viableAnswers[0], score: Infinity}];
	}

	// compute the score for each of the possible words
	for (var i = 0; i < words.length; i++) {
		// amount of information given by word
		let score = 0;	

		for (var j = 0; j < configurations.length; j++) {
			let dummyWordle = deepCopyObject(cpuWordle);

			setWordleFromConfiguration(configurations[j], words[i], dummyWordle)

			let possibleAnswers = getViableAnswers(dummyWordle);

			if(possibleAnswers.length > 0){

				// information
				let p = possibleAnswers.length / viableAnswers.length;
				let inforation = -Math.log2(p);
				score += p*inforation;
			}
		}

		// mean
		score /= configurations.length;

		if(score > 0){
			bestWords.push({word:omegaWordList[i], score:score});
		}
	}


	// mean
	// bestWords.sort(function(a, b){return a.score - b.score});
	bestWords.sort(function(a, b){return b.score - a.score});

	console.log(bestWords)


	if(bestWords.length > numOfResults){
		bestWords.length = numOfResults;
	}

	return bestWords;
}

function getArrayFromBestWords(words){
	let string = "[";

	for (var i = 0; i < words.length; i++) {
		string += "{word:\"" + words[i].word + "\"}";

		if(i != words.length-1){
			string += ",";
		}
	}

	string += "]";

	return string;
}


function setWordleFromConfiguration(config, word, wordle){
	for (var i = 0; i < 5; i++) {
		wordle.grid[i][wordle.currentIndex.y].letter = word[i];
		wordle.grid[i][wordle.currentIndex.y].color = config[i];
	}

	wordle.updateWordInfo();
}

function getViableAnswers(wordle){
	// find allowed words
	let viableAnswers = [];

	// small set of actual answer words
	for (var i = 0; i < words.length; i++) {	
		if(wordIsViable(words[i], wordle)){
			viableAnswers.push(words[i]);
		}
	}

	return viableAnswers;
}


function wordIsViable(word, wordle){

	for (var i = 0; i < 5; i++) {

		if(wordle.greenSpaces[i] != 0 && word[i] != wordle.greenSpaces[i]){

			// if(word == "cheek"){
			// console.log("GREEN", word, word[i], wordle.greenSpaces[i])
			// }
			return false;
		}
		if(wordle.yellowSpaces[i].length > 0){
			if(wordle.yellowSpaces[i].includes(word[i])){
				
				// if(word == "cheek"){
				// console.log("YELLOW IN WRONG SPACE", word, wordle.yellowSpaces[i], i)
				// }
				return false;
			}
		}

		for (var e = 0; e < 5; e++) {
			for (var j = 0; j < wordle.yellowSpaces[e].length; j++) {
				if(!word.includes(wordle.yellowSpaces[e][j])){
						
					// if(word == "cheek"){	
					// console.log("YELLOW DONT INCLUDE", word, wordle.yellowSpaces[e][j])
					// }
					return false;
				}
			}
		}
		
		if(wordle.blankSpaces.includes(word[i])){
			// if(word == "cheek"){
			// console.log("BLANK", word, wordle.blankSpaces, word[i])
			// }
			return false;
		}
	}

	if(wordHasCorrectLetterCount(word, wordle) == false){
		// if(word == "cheek"){
		// 	console.log("COUNT")
		// }
		return false;
	}

	return true;
}

function wordHasCorrectLetterCount(word, wordle){

	// checking to see if we have any letters that we knwo are in the word
	// if we dont know how many letters are in the word then we dont care 
	if(wordle.lettersInWord.length == 0){
		return true;
	}

	// see if the word has the letter in it and also see if that letter has the correct count
	let valid = true;
	let includes = false;
	for (var i = 0; i < wordle.lettersInWord.length; i++) {

		if(!word.includes(wordle.lettersInWord[i])){
			valid = false;
		}

		for (var j = 0; j < word.length; j++) {
			if(equalIgnoreCase(word[j], wordle.lettersInWord[i])){
				includes = true;
				let countCPU = wordle.getLetterObjFromChar(wordle.lettersInWord[i]).count;
				let countWord = getLetterCountOfList(word, wordle.lettersInWord[i]);

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

function getLetterCountOfLettersInWord(letter, wordle){
	let count = 0;
	let word = ""

	for (var i = 0; i < 5; i++) {
		if(equalIgnoreCase(wordle.grid[i][wordle.currentIndex.y].letter, letter) 
			&& (wordle.grid[i][wordle.currentIndex.y].color == GREEN 
			|| wordle.grid[i][wordle.currentIndex.y].color == YELLOW)){
				count++;
		}

		word += wordle.grid[i][wordle.currentIndex.y].letter;
	}

	// console.log(word, letter, count)

	return count;
}









function getAllPosibleGames(viableAnswers, wordle, depth){
	let d = {data:[]};
	depth++;

	for (var i = 0; i < viableAnswers.length; i++) {
		let word = {word:viableAnswers[i], configs: [], score:0};

		for (var j = 0; j < configurations.length; j++) {

			let dummyWordle = deepCopyObject(wordle);
			setWordleFromConfiguration(configurations[j], viableAnswers[i], dummyWordle)
			let possibleAnswers = getViableAnswers(dummyWordle);

			if(possibleAnswers.length > 0){
				let p = possibleAnswers.length / viableAnswers.length;
				let inforation = -Math.log2(p);
				word.score += p*inforation;

				if(depth < 3 && dummyWordle.currentIndex.y < 5 && possibleAnswers.length > 1){
					dummyWordle.currentIndex.y++;
					word.configs.push({config:configurations[j], possibleAnswers:getAllPosibleGames(possibleAnswers, dummyWordle, depth), depth:depth});
				}else{
					word.configs.push({config:configurations[j], possibleAnswers:possibleAnswers, depth:depth});
				}
			}
		}

		d.data.push(word);
	}

	return d.data
}


















