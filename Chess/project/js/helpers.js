var prevDimentions = { width: -1, height: -1 };

function canvasAlign(canvasDiv, w, h){
    if(prevDimentions.width == window.innerWidth && prevDimentions.height == window.innerHeight){
        return;
    }

    prevDimentions = { width: window.innerWidth, height: window.innerHeight };

    // hotdog
    if(w / h  >  window.innerWidth / window.innerHeight){
      canvasDiv.style.width = window.innerWidth + "px";
      canvasDiv.style.height = (h * window.innerWidth / w) + "px";
      return;
    }

    // hamburger
    canvasDiv.style.width = (w * window.innerHeight / h) + "px";
    canvasDiv.style.height = window.innerHeight + "px";
}


function mapVal(minInput, maxInput, minOutPut, maxOutput, input){
    let m = (minOutPut - maxOutput) / (minInput - maxInput);

    let b = maxOutput / m - maxInput;

    return m * input + b;
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();	
}

function colorNoFillCircle(centerX, centerY, radius, drawColor, width){
	canvasContext.strokeStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  canvasContext.lineWidth = width;
	canvasContext.stroke();	
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function drawRotatedRect(x, y, width, height, fillColor, angle) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(angle);
  
  if (fillColor) {
      canvasContext.fillStyle = fillColor;
      canvasContext.fillRect(-width / 2, -height / 2, width, height);
  }

  canvasContext.restore();
}

function drawRotatedNoFillRect(x, y, width, height, fillColor, lineWidth, angle) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(angle);
  
  if (fillColor) {
      canvasContext.lineWidth = 2;
      if(lineWidth) canvasContext.lineWidth = lineWidth;
      canvasContext.beginPath();
      canvasContext.strokeStyle = fillColor;
      canvasContext.rect(-width / 2, -height / 2, width, height);
      canvasContext.stroke();
  }

  canvasContext.restore();
}

function colorNoFillRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor, lineWidth){
  canvasContext.lineWidth = 2;
  if(lineWidth) canvasContext.lineWidth = lineWidth;
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

function drawCurvedText(color, font, words, x, y, angle, size, style){
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(angle);
  canvasContext.fillStyle = color;
  canvasContext.font = font;
  let dimentions = measureText(words, size, style);
  canvasContext.fillText(words, -dimentions.width/2, -dimentions.height/2);
  canvasContext.restore();
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

function factorial(x){
  let o = x;
  for (let i = x-1; i >= 1; i--) { o *= i; }
  return o;
}

function binomialCoefficient(n, k){
  return factorial(n) / (factorial(k)*factorial(n - k));
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