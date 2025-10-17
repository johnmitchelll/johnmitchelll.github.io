function Vector(x,y){
    this.x = x;
    this.y = y;
}

function distanceOfTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorRectNoFill(topLeftX, topLeftY, boxWidth, boxHeight, fillColor, lineWidth) {
    canvasContext.lineWidth = lineWidth;
    canvasContext.strokeStyle = fillColor;
    canvasContext.strokeRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function drawText(color, words, X, Y){
    canvasContext.fillStyle = color;
    canvasContext.fillText(words, X, Y);
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

function circlePointColision(x1,y1,r, x2,y2){
  let dist = distanceOfTwoPoints(x1, y1, x2, y2);

  return dist < r;
}


function removeFromArray(array,index){
    for(i = array.length - 1; i >= 0; i--){
        if(i == index){
            array.splice(index, 1);
        }
    }
}

function insertAt(array, index, elementsArray) {
    for(i = elementsArray.length - 1; i >= 0; i--){
        array.splice(index, 0, elementsArray[i]);
    }
}

function insertStringAt(index, string, newString) {
  if (index > 0) {
    return string.substring(0, index) + newString + string.substring(index);
  }

  return newString + string;
};


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

// Function to compare two strings ignoring their cases
function equalIgnoreCase(str1, str2){
    return str1.toUpperCase() == str2.toUpperCase();
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

function calculateWordConfigurations(){
    let configurations = new Array(Math.pow(3,5));

    let index = 0;
    for (var pos1 = 0; pos1 < 3; pos1++) {
    for (var pos2 = 0; pos2 < 3; pos2++) {
    for (var pos3 = 0; pos3 < 3; pos3++) {
    for (var pos4 = 0; pos4 < 3; pos4++) {
    for (var pos5 = 0; pos5 < 3; pos5++) {

        configurations[index] = new Array(5)

        if(pos1 == 0){configurations[index][0] = GREEN}
        if(pos1 == 1){configurations[index][0] = YELLOW}
        if(pos1 == 2){configurations[index][0] = BLANK}

        if(pos2 == 0){configurations[index][1] = GREEN}
        if(pos2 == 1){configurations[index][1] = YELLOW}
        if(pos2 == 2){configurations[index][1] = BLANK}

        if(pos3 == 0){configurations[index][2] = GREEN}
        if(pos3 == 1){configurations[index][2] = YELLOW}
        if(pos3 == 2){configurations[index][2] = BLANK}

        if(pos4 == 0){configurations[index][3] = GREEN}
        if(pos4 == 1){configurations[index][3] = YELLOW}
        if(pos4 == 2){configurations[index][3] = BLANK}

        if(pos5 == 0){configurations[index][4] = GREEN}
        if(pos5 == 1){configurations[index][4] = YELLOW}
        if(pos5 == 2){configurations[index][4] = BLANK}

        index++;

    }}}}}

    // go through and get rid of cases that have only one yellow
    for (var i = configurations.length - 1; i >= 0; i--) {
        
        let countY = 0;
        let countG = 0;
        for (var j = 0; j < configurations[i].length; j++) {
            if(configurations[i][j] == YELLOW){
                countY++;
            }
            if(configurations[i][j] == GREEN){
                countG++;
            }
        }

        if(countY == 1 && countG == 4){
            removeFromArray(configurations,i);  
        }
    }

    return configurations;
}
    




