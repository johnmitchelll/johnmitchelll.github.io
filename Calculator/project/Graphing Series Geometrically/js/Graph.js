var graphs = [];
var graphCount = 0;

function getGraphs(){
  var zoom_rangeslider = document.getElementById("zoom");
  zoom = Number.parseFloat(zoom_rangeslider.value);

  var n_rangeslider = document.getElementById("n");
  n = parseInt(n_rangeslider.value);

  document.getElementById("nIsEqualTo").innerText = "n = " + n;

  for (var i = 0; i < graphs.length; i++) {
    graphs[i].index = i;
  }

  for (var i = 0; i < graphs.length; i++) {
    graphs[i].equation = document.getElementById(graphs[i].elem + "form").value;
    // graphs[i].equation = "1 / (2^n)";

    graphs[i].area = Number.parseFloat(document.getElementById(graphs[i].elem + "areaForm").value);
    graphs[i].sideLen = Math.sqrt(graphs[i].area);
    graphs[i].shape = new Rectangle(-graphs[i].sideLen/2, -graphs[i].sideLen/2, graphs[i].sideLen/2, graphs[i].sideLen/2, graphs[i].color);

    graphs[i].getSubShapes();
  }
}

function drawGraphs(){
  for (var i = 0; i < graphs.length; i++) {
    graphs[i].draw();
  }
}


function Graph(){
  this.equation = "";
  this.prevEquation = "";
  this.prevN = n;
  this.prevArea;
  this.elem = "graph" + graphCount;
  this.index = graphs.length;

  
  this.subShapes = [];
  this.area = 1;
  this.sideLen = Math.sqrt(this.area);
  this.full = false;

  this.outputQueue = [];
  this.color = getRGB(1);
  this.secondaryColor = getRGB(0.65);

  this.shape = new Rectangle(-this.sideLen/2, -this.sideLen/2, this.sideLen/2, this.sideLen/2, this.secondaryColor);

  graphCount++;

  this.draw = function(){
    if(this.area == undefined){
      return;
    }

    this.shape.draw(false);

    if(this.equations == ""){
      return;
    }
    
    for (var i = 1; i < this.subShapes.length; i++) {
      this.subShapes[i].draw(true);
    }
  }

  this.getSubShapes = function(){
    if(isNaN(this.area)){
      this.subShapes = [];
      return;
    }

    if(this.equation == ""){
      this.subShapes = [this.shape];
      return;
    }
    
    getSubShapes(this);

    if(this.full){
      for (var i = 0; i < this.subShapes.length; i++) {
        this.subShapes[i].color = this.color;
      }
    }
  }

  this.func = function(n, x){
    let y = eval(this.outputQueue, n, x);
    return y;
  }

  InitNewGraphHTML(this);
}

function InitNewGraphHTML(graph){
  // console.log(graph)
  let divElement = document.createElement("Div");
    divElement.id = graph.elem;
    divElement.style.marginBottom = "5px";
    divElement.style.marginTop = "5px";
  document.getElementById("form-group").appendChild(divElement)

  let deleteElem = document.createElement("Button");
    deleteElem.id = "button"
    deleteElem.innerHTML = "X";
    deleteElem.style.fontSize = "10px";
    deleteElem.style.border = "2px solid red";
    deleteElem.style.width = "10%";
    deleteElem.style.margin = "5px";
    deleteElem.style.color = "white";
    deleteElem.style.background = "red";

    deleteElem.addEventListener("mousedown", function(){
      if(graphs.length > 1){
        document.getElementById(graph.elem).remove();
        removeFromArray(graphs,graph.index)
      }
    });
  document.getElementById(graph.elem).appendChild(deleteElem)

  let fOfXEquals = document.createElement("Span");
    fOfXEquals.id = "fOfXEquals"
    fOfXEquals.innerHTML = "<span>∑n→∞</span>";
    fOfXEquals.style.color = "white";
    fOfXEquals.style.width = "30px";
    fOfXEquals.style.margin = "0px";
    fOfXEquals.style.padding = "0px";
    fOfXEquals.style.boarder = "5px";
    fOfXEquals.style.textdecoration = "none";
  document.getElementById(graph.elem).appendChild(fOfXEquals)

  let inputElement = document.createElement("Input");
    inputElement.id = graph.elem + "form";
    inputElement.style.color = "white";
    inputElement.style.textdecoration = "none";
    inputElement.style.cursor = "text";
    inputElement.style.width = "98%";
    inputElement.style.border = "2px solid " + graph.color;
  document.getElementById(graph.elem).appendChild(inputElement)

  let area = document.createElement("Span");
    area.id = "area"
    area.innerHTML = "<span>Input Area:</span>";
    area.style.color = "white";
    area.style.width = "30px";
    area.style.margin = "0px";
    area.style.margin = "0px";
    area.style.boarder = "5px";
    area.style.textdecoration = "none";
  document.getElementById(graph.elem).appendChild(area)

  let areaInputElement = document.createElement("Input");
    areaInputElement.id = graph.elem + "areaForm";
    areaInputElement.style.color = "white";
    areaInputElement.style.textdecoration = "none";
    areaInputElement.style.cursor = "text";
    areaInputElement.style.width = "98%";
    areaInputElement.style.border = "2px solid " + graph.color;
  document.getElementById(graph.elem).appendChild(areaInputElement)

}

// ∫f(x)dx
// d/dx
//∑n→∞

//to get from real to screen
//(x / zoom) * canvas.width + offX * canvas.width/zoom

