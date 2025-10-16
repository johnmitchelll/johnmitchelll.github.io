let currentPlayer = 2;
let ai = 1;
let human = 2;
let gameOver = false;

async function getBestMove(){
	if(gameOver){
		return;
	}

	let move = await grabScores();

	await new Promise(res => {
		while(!move){}
		res();
	});

	brickGrid.array = move.array;
	currentPlayer = human;
	info_text.innerHTML = "";
	getWinner(brickGrid);
}

async function grabScores(){
	let children = getChildren(ai,brickGrid);
	let maxEval = -Infinity;
	let move = children[0];

	for (let i = 0; i < children.length; i++) {
		let currentEval;
		await new Promise(res => {
			currentEval = miniMax(children[i], 0,-Infinity,Infinity, false, i);
			res();
		});

		children[i].score = currentEval;
		if(currentEval > maxEval){
			maxEval = currentEval;
			move = children[i];
		}
	}

	return move;
}

function miniMax(board, depth, alpha, beta, isMaximising, i){
	let terminalScore = examineBoardForScoring(board);//last time a board will be called it is an end state
	
	if(terminalScore == Infinity || terminalScore == -Infinity){
		return terminalScore;
	}else if(depth > 5){
		return terminalScore;
	}

	if(isMaximising){
		let children = getChildren(ai,board);
		let maxEval = -Infinity;

		for (let i = 0; i < children.length; i++) {
			let currentEval = miniMax(children[i], depth+1, alpha, beta, false, i);
			children[i].score = currentEval;
			maxEval = Math.max(maxEval,currentEval)
			alpha = Math.max(alpha,currentEval)
			if(beta <= alpha){
				break;
			}
		}
		return maxEval;	
	}else{
		let children = getChildren(human,board);
		let minEval = Infinity;

		for (let i = 0; i < children.length; i++) {
			let currentEval = miniMax(children[i], depth+1, alpha, beta, true, i);
			children[i].score = currentEval;
			minEval = Math.min(minEval,currentEval)
			beta = Math.min(beta,currentEval)
			if(beta <= alpha){
				break;
			}
		}
		return minEval;	
	}
}

function getChildren(player, board){
	let children = [];
	let tempBoard;

	for(let i = 0; i < BRICK_COLS; i++) {
		for(let j = 0; j <= BRICK_ROWS; j++) {

			if(board.array[i][0].type != 0){
				break;
			}

			if(j == BRICK_ROWS || board.array[i][j].type != 0){
				tempBoard = new Board(deepCopy(board.array));
				tempBoard.array[i][j-1].type = player;
				children.push(tempBoard);

				break;
			}
		}
	}
	
	return children;
}

function getWinner(board){
	let temp = examineBoardForScoring(board);
	gameOver = true;

	if(temp == Infinity){
		info_text.innerHTML = "You Lose";
		return;
	}
	if(temp == "tie"){
		info_text.innerHTML = "You Tied";
		return;
	}
	if(temp == -Infinity){
		info_text.innerHTML = "You Win";
		return;
	}

	gameOver = false;
}

function examineBoardForScoring(board){
	let score = 0;

	for (let i = 0; i < BRICK_COLS; i++) {
		for (let j = 0; j < BRICK_ROWS; j++) {

			if(board.array[i][j].type != 0){

				//horizontal check
				if(i >= 3){
					let left = [];
					for (let e = 0; e < 4; e++) {
						left.push(board.array[i-e][j])
					}
					score += getScore(left)
				}
				if(i <= 3){
					let right = [];
					for (let e = 0; e < 4; e++) {
						right.push(board.array[i+e][j])
					}
					score += getScore(right)
				}


				//vertical check
				if(j >= 3){
					let up = [];
					for (let e = 0; e < 4; e++) {
						up.push(board.array[i][j-e])
					}
					score += getScore(up)
				}else{
					let down = [];
					for (let e = 0; e < 4; e++) {
						down.push(board.array[i][j+e])
					}
					score += getScore(down)
				}


				//diagonal from top right check
				if(j <= 2 && i >= 3){
					let diagLeft = [];
					for (let e = 0; e < 4; e++) {
						diagLeft.push(board.array[i-e][j+e])
					}
					score += getScore(diagLeft)
				}


				//diagonal from top left check
				if(j <= 2 && i <= 3){
					let diagRight = [];
					for (let e = 0; e < 4; e++) {
						diagRight.push(board.array[i+e][j+e])
					}
					score += getScore(diagRight)
				}

			}//if grid space is not blank 

		}//for rows
	}//for cols


	let availibleSpots = false;
	for(i = 0; i < BRICK_COLS; i++){
		for(j = 0; j < BRICK_ROWS; j++){
			if(board.array[i][j].type == 0){
				availibleSpots = true;
				break;
			}
		}

		if(availibleSpots){
			break;
		}
	}

	if(availibleSpots == false && (score != -Infinity || score != Infinity)){
		return "tie";
	}else{
		return score;
	}
}


function getScore(array){
	let score = 0;
	let root = array[0];
	let mult;

	root.type == human ? mult = -1 : mult = 1;

	//singles
	if(array[1].type == 0 && array[2].type == 0 && array[3].type == 0){
		score += 1 * mult;
	}

	//doubles
	if(array[1].type == root.type && array[2].type == 0 && array[3].type == 0){
		score += 2 * mult;
	}
	if(array[1].type == 0 && array[2].type == root.type && array[3].type == 0){
		score += 2 * mult;
	}
	if(array[1].type == 0 && array[2].type == 0 && array[3].type == root.type){
		score += 2 * mult;
	}

	//triples
	if(array[1].type == root.type && array[2].type == root.type && array[3].type == 0){
		score += 3 * mult;
	}
	if(array[1].type == root.type && array[2].type == root.type && array[3].type == 0){
		score += 3 * mult;
	}
	if(array[1].type == root.type && array[2].type == root.type && array[3].type == 0){
		score += 3 * mult;
	}

	//win
	if(array[1].type == root.type && array[2].type == root.type && array[3].type == root.type){
			score = Infinity * mult;
	}


	return score;
}


function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}
// Helper function to deal with Objects
function deepCopyObject(obj){
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}