
const HERO_STRINGS = ["Full Stack Designer", "Student", "Self Taught", "Software Engineer", "6+ Years of Experience"];
var heroStringIndex = [0,0];
var heroStringDir = 1;
var outputString = document.getElementById("hero_dynamic");

function goThroughTypingAnimation(){
    // keep typing it our
    if(heroStringIndex[1] <= HERO_STRINGS[heroStringIndex[0]].length-1){
        outputString.innerHTML += HERO_STRINGS[heroStringIndex[0]][heroStringIndex[1]];
        heroStringIndex[1]++;
        setTimeout(goThroughTypingAnimation, 100+Math.random()*100);
        return;
    }

    // we are out of bounds for the string
    setTimeout(deleteHeroString, 1000);
}

function deleteHeroString(){
    // go to next string and start over typing it out
    if(outputString.innerHTML.length == 0){
        heroStringIndex[1] = 0;
        heroStringIndex[0]++;

        if(heroStringIndex[0] == HERO_STRINGS.length){
            heroStringIndex[0] = 0;
        }

        goThroughTypingAnimation();

        return;
    }

    setTimeout(deleteHeroString, 50);
    
    outputString.innerHTML = outputString.innerHTML.slice(0, -1);
}




function DrawableSurface(id){
    this.canvas = document.getElementById(id);
    this.canvasContext = this.canvas.getContext('2d');

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.draw = function(){}

    this.drawLine = function(x1,y1,x2,y2,width,color1, color2){

        var gradient = this.canvasContext.createLinearGradient(0, 0, x2, y2);
        // Add color stops
        gradient.addColorStop(1, color2);
        gradient.addColorStop(0, color1);

        // Set the gradient as the stroke style
        this.canvasContext.strokeStyle = gradient;

        this.canvasContext.lineWidth = width;
        // this.canvasContext.strokeStyle = color;
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(x1, y1);
        this.canvasContext.lineTo(x2, y2);
        this.canvasContext.stroke();
    }

    this.colorRect = function(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    }

    this.colorCircle = function(centerX, centerY, radius, drawColor){
        this.canvasContext.fillStyle = drawColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
        this.canvasContext.fill(); 
      }
      
      function drawFillTriangle(x1,y1, x2,y2, x3,y3, color){
        this.canvasContext.fillStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x1, y1);
        this.canvasContext.lineTo(x2, y2);
        this.canvasContext.lineTo(x3, y3);
        this.canvasContext.fill();
        // canvasContext.closePath();
      }
    
}