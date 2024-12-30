var mouseX;
var mouseY;
var mouseCol;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

async function handleMouseClick(){
	if(mouseX <= 0 || mouseX >= canvas.offsetWidth || 
	   mouseY <= 0 || mouseY >= canvas.offsetHeight){
		return;
	}

	getMouseIndex();

	if(brickGrid.array[mouseCol][0].type != 0 || currentPlayer == ai || gameOver){
		return;
	}

	info_text.innerHTML = "CPU Thinking";

	for (var i = 0; i <= BRICK_ROWS; i++) {
		if(i == BRICK_ROWS || brickGrid.array[mouseCol][i].type != 0){
			brickGrid.array[mouseCol][i-1].type = currentPlayer;
			currentPlayer = ai;
			getWinner(brickGrid);
			await delay(1000);
			getBestMove();
			break;
		}
	}
}


function getMouseIndex(){
	let w = canvas.offsetWidth * BRICK_W / canvas.width;
	mouseCol = Math.floor(mouseX/w);
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', handleMouseClick);

