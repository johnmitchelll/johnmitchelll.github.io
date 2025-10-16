 function Vector(x,y){
	this.x = x;
	this.y = y;

    this.draw = function(color){
        colorCircle(this.x, this.y, 5, color);
    }
}

function Rectangle(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h; 

    this.intersectCircle = function(cir){
        let distX = Math.abs(cir.pos.x - this.x-this.w/2);
        let distY = Math.abs(cir.pos.y - this.y-this.h/2);

        if (distX > (this.w/2 + cir.r)) { return false; }
        if (distY > (this.h/2 + cir.r)) { return false; }

        if (distX <= (this.w/2)) { return true; } 
        if (distY <= (this.h/2)) { return true; }

        let dx = distX-this.w/2;
        let dy = distY-this.h/2;

        return (dx*dx+dy*dy<=(cir.r*cir.r));
    }
}

function Ball(x,y,r, id, color){
	this.pos = new Vector(x,y);
	this.vel = new Vector(0,0);
	this.acc = new Vector(0,0);
	this.r = r;
	this.id = id;
	this.color = color;
	this.mass = 0.01;
	this.simTimeRemaining;
	this.oPos = this.pos;
    this.removeMe = false;
    this.timeLeftTillNextImage = 0;
    this.img;
    this.animationIndex = 0;
    this.prevDir = undefined;

    if(color == RED){
        this.img = striped.vertical;
    }

    if(color == YELLOW){
        this.img = solid.center;
    }

    if(color == "black"){
        this.img = black.center;
    }

    if(color == "white"){
        this.img = striped.blank;
    }

	this.draw = function(color){
        if(this.img){
            drawImageFromSpriteSheetWithRotation(ballImageSet, this.img.pos.x, this.img.pos.y, BALL_IMG_WH, 
            BALL_IMG_WH, this.pos.x, this.pos.y, this.r*2, this.r*2, this.img.ang);
            return;
        }

        if(color){  this.color = color  }
        colorCircle(this.pos.x, this.pos.y, this.r, this.color);

		// let ang = Math.atan2(this.vel.y, this.vel.x);
		// drawLine(this.pos.x+Math.cos(ang)*this.r,this.pos.y+Math.sin(ang)*this.r,this.pos.x,this.pos.y,4,"yellow");
	}
}

function LineSegment(sx, sy, ex, ey, r){
	this.start = new Vector(sx, sy);
	this.end = new Vector(ex, ey);
	this.r = r;
    this.colided = false;

	this.draw = function(color, fill){
		colorCircle(this.start.x, this.start.y, this.r, color);
		colorCircle(this.end.x, this.end.y, this.r, color);

		let nx = -(this.end.y - this.start.y);
		let ny = this.end.x - this.start.x;
		let d = Math.sqrt(nx*nx + ny*ny);
		nx /= d;
		ny /= d;

		drawLine(this.start.x+nx*this.r, this.start.y+ny*this.r, this.end.x+nx*this.r, this.end.y+ny*this.r, 1, color);
		drawLine(this.start.x-nx*this.r, this.start.y-ny*this.r, this.end.x-nx*this.r, this.end.y-ny*this.r, 1, color);

        if(fill){
            drawLine(this.start.x, this.start.y, this.end.x, this.end.y, this.r+2, color);
        }
	}
}

function BallImage(phase, dir, pos, ang, perp){
    this.dir = dir;
    this.phase = phase;
    this.pos = pos;
    this.ang = ang;
    this.perp = perp;
}

function DoCirclesOverlap(x1, y1, r1, x2, y2, r2){
	return distanceOfTwoPoints(x1, y1, x2, y2) <= r1 + r2;
}

function IsPointInCircle(x1, y1, x2, y2, r){
	return distanceOfTwoPoints(x1, y1, x2, y2) <= r;
}
function IsPointInRect(point,x,y,w,h){
	if(point.x >= x && point.x <= x + w
	&& point.y >= y && point.y <= y + h){
		return true;
	}
	return false;
}

function mapVal(minInput, maxInput, minOutPut, maxOutput, input){
    let m = (minOutPut - maxOutput) / (minInput - maxInput);

    let b = maxOutput / m - maxInput;

    return m * input + b;
}

function calculateAngleOfTwoPoints(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.atan2(deltaY, deltaX);
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();	
}

function colorNoFillCircle(centerX, centerY, radius, drawColor, width){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
    canvasContext.lineWidth = width;
	canvasContext.stroke();	
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorNoFillRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
    canvasContext.beginPath();
    canvasContext.strokeStyle = fillColor;
    canvasContext.rect(topLeftX, topLeftY, boxWidth, boxHeight);
    canvasContext.stroke();
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

function drawText(color, font, words, X, Y){
  canvasContext.fillStyle = color;
  canvasContext.font = font;
  canvasContext.fillText(words, X, Y);
}

 function drawFillTriangle(x1,y1, x2,y2, x3,y3, color){
   canvasContext.fillStyle = color;
   canvasContext.beginPath();
   canvasContext.moveTo(x1, y1);
   canvasContext.lineTo(x2, y2);
   canvasContext.lineTo(x3, y3);
   canvasContext.fill();
   // canvasContext.closePath();
 }

function drawImageFromSpriteSheetWithRotation(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, ang, antiAli){
    canvasContext.save();
    canvasContext.translate(dx, dy);
    canvasContext.rotate(ang);
     canvasContext.imageSmoothingEnabled = false; 
    if(antiAli){
        canvasContext.imageSmoothingEnabled = true; 
    }
    canvasContext.drawImage(img, sx, sy, sWidth, sHeight, -dWidth/2, -dHeight/2, dWidth, dHeight);
    canvasContext.restore();
}


function distanceOfTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function removeFromArray(array,index){
    for(i = array.length - 1; i >= 0; i--){
        if(i == index){
            array.splice(index, 1);
        }
    }
}

function removeFromArrayByID(array, id){
    for(i = array.length - 1; i >= 0; i--){
        if(array[i].id == id){
            array.splice(i, 1);
            return;
        }
    }
}

function insertAt(array, index, elementsArray) {
    for(i = elementsArray.length - 1; i >= 0; i--){
        array.splice(index, 0, elementsArray[i]);
    }
}

function updateTimeSteps(){
    currentTime = Date.now();

    totalTime = (currentTime - startTime)/1000;

    elaspedTime = totalTime - prevTotalTime;

    prevTotalTime = totalTime;
}


function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.textContent = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
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



