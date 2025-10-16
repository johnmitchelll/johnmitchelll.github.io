var ballRadii;
var lineRadii;

var scenes = [];
var currentScene;
var prevScene;
var lastFrameScene;

var largeFont;
var gameType;
var winner;

const RED = "#900C3F";
const YELLOW = "#FFC300";

const BALL_IMG_WH = 15;

var table;
var brain;

var fps;

//pool table color rgb(0,45,1)
//pocket color = rgb(12,12,12)

function drawEverything (){
	colorRect(0, 0, canvas.width, canvas.height, 'rgb(18,18,18)');
	currentScene.onMouseAction();
	currentScene.draw();  

  prevMouseDown = mouseDown;

  //this will get the prev scene that we were on
  if(lastFrameScene != currentScene){
    prevScene = lastFrameScene;
    lastFrameScene = currentScene;
  }

  if(fpsClock == undefined || totalTime - fpsClock >= 0.5){
    fps = Math.floor(1 / elaspedTime);
    fpsClock = totalTime;
  }

  drawText('white', "12px monospace", "FPS:" + fps, canvas.width - 70, canvas.height-10)

  // console.log(1 / elaspedTime);
  // drawText("yellow", "12px monospace", Math.floor(mouseX) + ", " + Math.floor(mouseY), mouseX+5, mouseY)
}

function LoadingScreen(){
	colorRect(0, 0, canvas.width, canvas.height, 'rgb(18,18,18)');
  let width = measureText("LOADING...", Math.floor(canvas.width * 32/1000), "monospace").width;

	drawText("white", Math.floor(canvas.width * 32/1000) + "px monospace", "LOADING...", 
		  	 canvas.width/2-width/2, canvas.height/2-Math.floor(canvas.width * 32/1000));
}

var pics = [];
var ballImageSet = document.createElement("img");
var houseImage = document.createElement("img");

var picsToLoad = 0;

function loadImages() {
  var imageList = [
    {varName: ballImageSet, theFile: "Balls.png"},
    {varName: houseImage, theFile: "House.png"}
    ];

  picsToLoad = imageList.length;

  for(var i = 0; i < imageList.length; i++) {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.src = "Images/"+fileName;
  picsToLoad--;
}


