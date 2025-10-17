function Rectangle(x1,y1, x2,y2, c, w,h){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2; 
    this.y2 = y2;
    this.w = distanceOfTwoPoints(this.x1,this.y1,this.x2,this.y1);
    this.h = distanceOfTwoPoints(this.x2,this.y1,this.x2,this.y2);
    this.a = Math.abs(this.w * this.h);
             
    this.color = c;
    this.type = "rect"
    this.id = globalIdCounter + 1;
    globalIdCounter++;

    this.north = new LineSegment(this.x1, this.y1, this.x2,this.y1, "black");
    this.east = new LineSegment(this.x2,this.y1, this.x2,this.y2, "black");
    this.south = new LineSegment(this.x2,this.y2, this.x1,this.y2, "black");
    this.west = new LineSegment(this.x1,this.y2, this.x1, this.y1, "black");

    this.draw = function(fill){

        this.north.draw(this.color);
        this.east.draw(this.color);
        this.south.draw(this.color);
        this.west.draw(this.color);

        if(fill){
            colorRect((this.x1 / zoom) * canvas.width + offX * canvas.width/zoom, 
                      (this.y1 / zoom) * canvas.height + offY * canvas.height/zoom, 
                      (this.w / zoom) * canvas.width, (this.h / zoom) * canvas.height, this.color);

            this.north.draw("black");
            this.east.draw("black");
            this.south.draw("black");
            this.west.draw("black");
        }

        
        // drawText("black", this.a.toFixed(3) + ", " + this.id, ((this.x1+this.w/2) / zoom) * canvas.width + offX * canvas.width/zoom,
        //     ((this.y1+this.h/2) / zoom) * canvas.height + offY * canvas.height/zoom)
    }

    this.intersectionRect = function(target, type){

        if(type == 0 && this.x2 >= target.x1 &&
           this.x1 <= target.x2 &&
           this.y2 > target.y1 &&
           this.y1 < target.y2){

            return true;
        }

        if(type == 1 && this.x2 > target.x1 &&
           this.x1 < target.x2 &&
           this.y2 >= target.y1 &&
           this.y1 <= target.y2){
            return true;
        }


        if(type == 2 && this.x2 >= target.x1 &&
           this.x1 <= target.x2 &&
           this.y2 >= target.y1 &&
           this.y1 <= target.y2){
            return true;
        }

        return false;
    }
}

function Triangle(b,h, x,y, c){
    this.b = b;
    this.h = h;
    this.x = x; 
    this.y = y;
    this.color = c;
    this.type = "tri"

    this.draw = function(fill){
        if(fill){
            drawFillTriangle(this.x-this.b/2,this.y+h/2, this.x+this.b/2,this.y+h/2, this.x,this.y-h/2, this.color);
        }
        drawNoFillTriangle(this.x-this.b/2,this.y+h/2, this.x+this.b/2,this.y+h/2, this.x,this.y-h/2, this.color)
    }
}

function LineSegment(x1,y1, x2,y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.draw = function(color){

        drawLine((this.x1 / zoom) * canvas.width + offX * canvas.width/zoom,
                 (this.y1 / zoom) * canvas.height + offY * canvas.height/zoom,
                 (this.x2 / zoom) * canvas.width + offX * canvas.width/zoom,
                 (this.y2 / zoom) * canvas.height + offY * canvas.height/zoom, 1, color)
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//this is for setting the buttons so that i will show a graph element or not :)

function addFunction(){
    graphs.push(new Graph());
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPosOfMarkers(len, real_len, off){
    let posMarkers = [];

    let a = -off - len/2 + 0.0001;
    let b = -off + len/2 + 0.0001;

    let deltaX = 2;

    let numMarks = 0;
    for (var i = 0; i < zoom; i += deltaX) {
        numMarks++;
    }

    while(numMarks < NUM_MARKS){
        deltaX -= deltaX/2;

        numMarks = 0;
        for (var i = 0; i < zoom; i += deltaX) {
            numMarks++;
        }
    }

    while(numMarks > NUM_MARKS){
        deltaX += deltaX;

        numMarks = 0;
        for (var i = 0; i < zoom; i += deltaX) {
            numMarks++;
        }
    }

    let firstX = undefined;
    let j = 0;

    if(a < 0){
        while(j > a){
            j -= deltaX;
        }
        firstX = j + deltaX;
    }

    if(a > 0){
        j = 0;
        while(j < a){
            j += deltaX;
        }
        firstX = j;
    }

    j = 1;
    posMarkers.push(firstX);
    while(firstX + j * deltaX < b){
        posMarkers.push(firstX + j * deltaX);
        j++;
    }

    return posMarkers;
}

function getRGB(a){
    if(graphs.length == 2){
        return 'rgba('+ 0 +','+ 255 +','+ 0 +','+ a +')'
    }
    if(graphs.length == 1){
        return 'rgba('+ 255 +','+ 0 +','+ 0 +','+ a +')'
    }
    if(graphs.length == 0){
        return 'rgba('+ 0 +','+ 0 +','+ 255 +','+ a +')'
    }
    if(graphs.length == 3){
        return 'rgba('+ 255 +','+ 255 +','+ 0 +','+ a +')'
    }
    if(graphs.length == 4){
        return 'rgba('+ 0 +','+ 255 +','+ 255 +','+ a +')'
    }
    if(graphs.length == 5){
        return 'rgba('+ 255 +','+ 0 +','+ 255 +','+ a +')'
    }
    if(graphs.length > 5){
        return 'rgba('+ 255*Math.random() +','+ 255*Math.random() +','+ 255*Math.random() +','+ a +')'
    }
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

function colorNoFillRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
    canvasContext.beginPath();
    canvasContext.strokeStyle = fillColor;
    canvasContext.lineWidth = 1;
    canvasContext.rect(topLeftX, topLeftY, boxWidth, boxHeight);
    canvasContext.stroke();
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function drawNoFillTriangle(x1,y1, x2,y2, x3,y3, width, color){
    drawLine(x1,y1,x2,y2,2,color)
    drawLine(x2,y2,x3,y3,2,color)
    drawLine(x3,y3,x1,y1,2,color)
}

function drawFillTriangle(x1,y1, x2,y2, x3,y3, color){
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.lineTo(x3, y3);
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



