var boundary;
var quadTree;
var circle;

function drawAll() {
	colorRect(0,0, canvas.width,canvas.height,'#121212');

	quadTree = new QuadTree(boundary, 4);

	for (var i = 0; i < boids.length; i++) {
		quadTree.insert(boids[i])
	}

	for (var i = 0; i < boids.length; i++) {
		boids[i].draw('white');
		boids[i].getLocalBoids();
		boids[i].applyForces();
		boids[i].update();
	}

}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}

function random(min, max) { // min and max included 
  return Math.random() * (max - min) + min;
}

function dist(x1,y1,x2,y2){
  let ans = Math.sqrt( (x2-x1) * (x2-x1) +  (y2-y1) * (y2-y1) );
  return ans;
}

