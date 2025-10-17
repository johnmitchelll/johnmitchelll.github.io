var rowOneOfLetters = ["qwertyuiop"];
var rowTwoOfLetters = ["asdfghjkl"];
var rowThreeOfLetters = [["go back"], "zxcvbnm", ["delete"]];

const allLettersInOrder = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

var YGBRowOfLetters = [["go back"], ["enter"],"ygb<>"];

var gameOverScreen = [["restart"]];

var menuScreen = [["test wordle cypher"], ["solve word"]];

var testScreen = [["go back"], ["test again"]];

var desiredWordListLen = 15;
var actualWordListLen;
var currentSearchPos = 0;


function InitHTML(){

	InitTextBox("InfoBox");

	InitTestInfo("testRowZero", 3);
	InitTestInfo("testRowOne", 3);
	InitTestInfo("testRowTwo", 3);

	document.getElementById("testDiv").style.display = "none";

	document.getElementById("gameCanvas").style.display = "none";
	document.getElementById("gameCanvas").style.width = "90%"
	document.getElementById("gameCanvas").style.height = "auto%"

	// first start with the keyboard
	NewKeyBoardRow("keyBoardRow1", rowOneOfLetters);
	NewKeyBoardRow("keyBoardRow2", rowTwoOfLetters);
	NewKeyBoardRow("keyBoardRow3", rowThreeOfLetters);

	// ygb
	NewKeyBoardRow("YGBRow", YGBRowOfLetters);
	document.getElementById("YYGBRow").style.background = YELLOW;
	document.getElementById("GYGBRow").style.background = GREEN;
	document.getElementById("BYGBRow").style.background = BLANK;

	// wordle
	NewWordleRow("wordleRow1");
	NewWordleRow("wordleRow2");
	NewWordleRow("wordleRow3");
	NewWordleRow("wordleRow4");
	NewWordleRow("wordleRow5");
	NewWordleRow("wordleRow6");

	// game over
	NewKeyBoardRow("Restart", gameOverScreen);
	document.getElementById("Restart").setAttribute('onclick', "clearWordleHTML()");

	// menu
	NewKeyBoardRow("Menu", menuScreen);
	document.getElementById("SOLVE WORDMenu").setAttribute('onclick', "clearWordleHTML()");
	document.getElementById("TEST WORDLE CYPHERMenu").setAttribute('onclick', "goToScene(4)");

	NewKeyBoardRow("Test", testScreen);
	document.getElementById("GO BACKTest").setAttribute('onclick', "goToScene(3)");
	document.getElementById("TEST AGAINTest").setAttribute('onclick', "initTest()");

	document.getElementById("wordList").style.display = "flex";
	document.getElementById("wordList").style.flexDirection = "column";
	updateWordList(15);

	InitIndex();
}

function NewKeyBoardRow(id, letters){
	let row = document.createElement("Div");
	row.id = id;
	row.style.width = "100%"
	row.style.display = "flex";
	row.style.justifyContent = "center"; 
	row.style.height = "33%";

	document.getElementById("bottom").appendChild(row);

	for (var i = 0; i < letters.length; i++) {
		for (var j = 0; j < letters[i].length; j++) {
			let letterButton = document.createElement("Button");
			letterButton.id = letters[i][j].toUpperCase() + id;
			letterButton.textContent = letters[i][j].toUpperCase();
			letterButton.style.width = "auto";
			letterButton.style.minWidth = "8%"
			letterButton.style.margin = "1% 0.5% 0.5% 0.5%";
			letterButton.style.color = "white";
			letterButton.style.fontSize = "2vh";
			letterButton.style.background = "grey";
			letterButton.style.borderRadius = "10%";
			letterButton.style.textAlign = "center";
			letterButton.style.alignItems = "center";
			letterButton.style.justifyContent = "center";
			letterButton.style.padding = "1%";
			letterButton.setAttribute('onclick', "setSearchBarFromInput(document.getElementById(\""+ (letters[i][j].toUpperCase() + id) +"\"))");

			document.getElementById(id).appendChild(letterButton);
		}
	}
}

function NewWordleRow(id){
	let row = document.createElement("Div");
	row.id = id;
	row.style.width = "90%"
	row.style.display = "flex";
	row.style.justifyContent = "space-around"; 
	row.style.alignSelf = "center";
	row.style.height = "16.66%";

	document.getElementById("wordle").appendChild(row);

	for (var i = 0; i < 5; i++) {
		let letterButton = document.createElement("Div");
		letterButton.id = i + id;
		letterButton.style.width = "20%";
		letterButton.style.margin = "1% 0.5% 0.5% 0.5%";
		letterButton.style.color = "white";
		letterButton.style.fontSize = "3vh";
		letterButton.style.border = "2px solid " + BLANK;
		letterButton.style.borderRadius = "5px";
		letterButton.style.display = "flex";
		letterButton.style.textAlign = "center";
		letterButton.style.alignItems = "center";
		letterButton.style.justifyContent = "center";

		document.getElementById(id).appendChild(letterButton);
	}
}

function InitIndex(){
	let letterButton = document.createElement("Div");
		letterButton.id = "currentIndex";

		let nodeAtCurrentIndex = document.getElementById((cpuWordle.currentIndex.x) + "wordleRow" + (cpuWordle.currentIndex.y+1));
		letterButton.style.width = (nodeAtCurrentIndex.offsetWidth-3) + "px";
		letterButton.style.height = (nodeAtCurrentIndex.offsetHeight-3) + "px";
		letterButton.style.left = nodeAtCurrentIndex.getBoundingClientRect().left + "px";        
        letterButton.style.top = nodeAtCurrentIndex.getBoundingClientRect().top + "px";        

		letterButton.style.border = "2px solid " + BLANK;
		letterButton.style.borderRadius = "5px";
		letterButton.style.position = "absolute";
		letterButton.style.background = "rgba(0,0,0,0)";

		document.getElementById("wordle").appendChild(letterButton);
}

function InitTextBox(id){
	let row = document.createElement("Div");
	row.id = id;
	row.style.width = "80%"
	row.style.alignSelf = "center"
	row.style.display = "flex";
	row.style.justifyContent = "center"; 
	row.style.height = "15%";
	row.style.color = "white";
	row.style.fontSize = "1.5vh";
	row.style.textAlign = "center";
	row.style.alignItems = "center";
	row.style.justifyContent = "center";
	// row.style.border = "1px solid " + BLANK;
	row.style.margin = "2%";

	document.getElementById("bottom").appendChild(row);

}

function updateWordList(){
	desiredWordListLen = 15;
	let list = getBestMove(desiredWordListLen);
	actualWordListLen = list.length;

	for (var i = 0; i < list.length+1; i++) {
		makeNewWordButton(list, i);
	}
}

function loadMoreWords(){
	document.getElementById("wordList").removeChild(document.getElementById("list["+ desiredWordListLen +"]"));

	desiredWordListLen += 15;
	let list = getBestMove(desiredWordListLen);
	actualWordListLen = list.length;

	for (var i = desiredWordListLen-15; i < desiredWordListLen+1; i++) {	
		makeNewWordButton(list, i);
	}
}

function clearWordList(){
	for (var i = 0; i <= actualWordListLen; i++) {
		if(i == actualWordListLen){
			if(actualWordListLen == desiredWordListLen){
				document.getElementById("wordList").removeChild(document.getElementById("list["+ i +"]"));
			}
			continue;
		}

		// console.log(desiredWordListLen, i, actualWordListLen)
		document.getElementById("wordList").removeChild(document.getElementById("list["+ i +"]"));
	}
}

function makeNewWordButton(list, index){
	let wordButton = document.createElement("Button");
		wordButton.id = "list["+ index +"]";
		
		if(index == list.length){
			wordButton.textContent = "LOAD MORE RESULTS...";
			wordButton.setAttribute('onclick', "loadMoreWords()");
		}else{
			wordButton.textContent = list[index].word.toUpperCase();
			wordButton.setAttribute('onclick', "setWordleGridFromWord(document.getElementById(\"list["+ index +"]\"))");
		}

		wordButton.style.width = "80%";
		wordButton.style.margin = "1% 0.5% 1% 0.5%";
		wordButton.style.color = "white";
		wordButton.style.fontSize = "2vw";
		wordButton.style.alignSelf = "center";
		wordButton.style.border = "1px solid grey";
		wordButton.style.borderRadius = "3%";


		if(index == list.length){
			if(index == desiredWordListLen){
				document.getElementById("wordList").appendChild(wordButton);
			}
			return
		}

		document.getElementById("wordList").appendChild(wordButton);
}

function setWordleGridFromWord(elem){
	let word = elem.textContent;

	for (var i = 0; i < 5; i++) {
		document.getElementById(i + "wordleRow" + (cpuWordle.currentIndex.y+1)).textContent = word[i];
		document.getElementById(i + "wordleRow" + (cpuWordle.currentIndex.y+1)).style.background = BLANK;
	}

	currentScene = 1;
	cpuWordle.currentIndex.x = 0;
}

function clearWordFromWordleGrid(){
	for (var i = 0; i < 5; i++) {
		document.getElementById(i + "wordleRow" + (cpuWordle.currentIndex.y+1)).textContent = "";
		document.getElementById(i + "wordleRow" + (cpuWordle.currentIndex.y+1)).style.background = "#121212";
	}
}

function centerIndexOnCurrentIndex(){
    let currentIndexPointer = document.getElementById("currentIndex");
    let nodeAtCurrentIndex = document.getElementById((cpuWordle.currentIndex.x) + "wordleRow" + (cpuWordle.currentIndex.y+1));

    currentIndexPointer.style.left = nodeAtCurrentIndex.getBoundingClientRect().left + "px";        
    currentIndexPointer.style.top = nodeAtCurrentIndex.getBoundingClientRect().top + "px";      
    currentIndexPointer.style.width = (nodeAtCurrentIndex.offsetWidth-3) + "px";
    currentIndexPointer.style.height = (nodeAtCurrentIndex.offsetHeight-3) + "px";
    currentIndexPointer.style.display = "inline";
    currentIndexPointer.style.border = "2px solid white";
}

function clearWordleHTML(){
	start();

	for (var i = 5; i >= 0; i--) {
		cpuWordle.currentIndex.y = i;
		clearWordFromWordleGrid();
	}

	document.getElementById("wordSearch").value = "";
	setCursorInputPosition(document.getElementById("wordSearch"), 0);
	clearWordList();
	updateWordList();

	updateKeyBoardColors();
}

function InitTestInfo(id, lenOf){
	let testInfoRow = document.createElement("Div");
	testInfoRow.id = id;
	testInfoRow.style.width = "80%"
	testInfoRow.style.fontSize = "2.5vh";

	document.getElementById("testInfo").appendChild(testInfoRow);
}


function updateKeyBoardColors(){	
	// sett all buttons to blank
	for (var i = 0; i < allLettersInOrder.length; i++) {
		for (var j = 0; j < allLettersInOrder[i].length; j++) {
			let elem = document.getElementById(allLettersInOrder[i][j].toUpperCase() + "keyBoardRow" + (i+1));
			cpuWordle.getLetterObjFromChar(elem.textContent).color = "grey";
		}
	}

	// go through wordle from start and et letter info from each letter
	for (var i = 0; i < 5; i++) {
		for (var j = 1; j < cpuWordle.currentIndex.y+1; j++) {
			elem = document.getElementById(i + "wordleRow" + j);
			cpuWordle.getLetterObjFromChar(elem.textContent).color = cpuWordle.grid[i][j-1].color;
		}
	}

	// set all colors of the keyboard
	for (var i = 0; i < allLettersInOrder.length; i++) {
		for (var j = 0; j < allLettersInOrder[i].length; j++) {
			let letterElem = document.getElementById(allLettersInOrder[i][j].toUpperCase() + "keyBoardRow" + (i+1));
			let letterElemFromCPUWordle = cpuWordle.getLetterObjFromChar(letterElem.textContent);

			letterElem.style.background = letterElemFromCPUWordle.color;
		}
	}
}

function setSearchBarFromInput(elem){
	let keyCode = cpuWordle.getLetterObjFromChar(elem.textContent)

	if(keyCode){
		handleScenes(keyCode.keyCode);
	}

	if(elem.textContent == "DELETE"){
		handleScenes(DELETE);
	}

	if(elem.textContent == "GO BACK"){
		handleScenes(ESC);
		escHeld = false;

		let element = document.getElementById("wordSearch");
    	element.value = "";
    	setCursorInputPosition(element, 0)
    	clearWordList();
    	updateWordList();
	}

	if(elem.textContent == "ENTER"){
		handleScenes(ENTER);
	}

	if(elem.textContent == "<"){
		handleScenes(LEFT);
	}

	if(elem.textContent == ">"){
		handleScenes(RIGHT);
	}
}


/*
Completly center text:

	row.style.textAlign = "center";
	row.style.alignItems = "center";
	row.style.justifyContent = "center";
*/



