var graphs = [];
var graphCount = 0;

function getGraphs(){
  for (var i = 0; i < graphs.length; i++) {
    graphs[i].index = i;
  }

  for (var i = 0; i < graphs.length; i++) {
    graphs[i].equation = document.getElementById(graphs[i].elem + "form").value;
    graphs[i].getDomain();

    handleGraphCSS(i);
  }
}


function Graph(){
  this.equation = "";
  this.prevEquation = "";
  this.elem = "";
  this.index = 0;
  this.inputLength = canvas.width*2;
  this.deltaX = canvas.width / this.inputLength;

  this.showAreaUnderCurve = false;
  this.showTangent = false;

  this.domain = [];
  this.outputQueue = [];
  this.color = getRGB();

  this.elem = "graph" + graphCount;
  graphCount++;

  this.tan = document.createElement("Button");
  this.integral = document.createElement("Button");
  this.defIntegral = document.createElement("Span");
  this.tanEquals = document.createElement("Span");

  this.showTangentLine = function(){
    if(this.showTangent == false || this.showTangent == undefined){
      this.showTangent = true;
    }else{
      this.showTangent = false;
    }
  }
  
  this.showDefiniteIntegral = function(){
    if(this.showAreaUnderCurve == false || this.showAreaUnderCurve == undefined){
      this.showAreaUnderCurve = true;
    }else{
      this.showAreaUnderCurve = false;
    }
  } 

  this.getDomain = function(){
    this.domain = [];

    if(this.equation == ""){
      return;
    }

    if(this.prevEquation != this.equation){
      this.prevEquation = this.equation;
      this.outputQueue = parse(this.equation);
    }

    for (var i = -offX * canvas.width/zoom - canvas.width/2; i < -offX * canvas.width/zoom + canvas.width/2; i += this.deltaX) {
      let x = (i / canvas.width ) * zoom;
      let y = this.func(x);
      
      this.domain.push(new Vec(x, y));
    }
  }

  this.func = function(x){
    let y = eval(this.outputQueue, x);
    return -y;
  }

  InitNewGraphHTML(this, this.tan, this.integral, this.tanEquals, this.defIntegral);
}

function InitNewGraphHTML(graph, tan, integral, tanEquals, defIntegral){
  // console.log(graph)
  let divElement = document.createElement("Div");
    divElement.id = graph.elem;
    divElement.style.marginBottom = "5px";
    divElement.style.marginTop = "5px";
  document.getElementById("form-group").appendChild(divElement)

  let fOfXEquals = document.createElement("Span");
    fOfXEquals.id = "fOfXEquals"
    fOfXEquals.innerHTML = "<span>f(x) =</span>";
    fOfXEquals.style.color = "white";
    fOfXEquals.style.width = "30px";
    fOfXEquals.style.margin = "0px";
    fOfXEquals.style.padding = "0px";
    fOfXEquals.style.textdecoration = "none";
    fOfXEquals.style.cursor = "default";
  document.getElementById(graph.elem).appendChild(fOfXEquals)

  let inputElement = document.createElement("Input");
    inputElement.id = graph.elem + "form";
    inputElement.inputmode = "none";
    inputElement.style.color = "white";
    inputElement.style.textdecoration = "none";
    inputElement.style.cursor = "text";
    inputElement.style.border = "2px solid " + graph.color;
  document.getElementById(graph.elem).appendChild(inputElement)


  //the div to hold the del tan and itegral elems
  let tanItegralElement = document.createElement("Div");
      tanItegralElement.id = graph.elem + "integralElem";
      tanItegralElement.style.display = "flex";
      tanItegralElement.style.width = "100%";
      tanItegralElement.style.flexWrap = "wrap";

  let deleteElem = document.createElement("Button");
    deleteElem.id = "button"
    deleteElem.innerHTML = "X";
    deleteElem.style.alignSelf = "center";
    deleteElem.style.fontSize = "10px";
    deleteElem.style.border = "2px solid red";
    deleteElem.style.width = "10%";
    deleteElem.style.height = "100%";
    deleteElem.style.color = "white";
    deleteElem.style.background = "red";
    deleteElem.style.margin = "5px";
    deleteElem.style.cursor = "pointer";

    deleteElem.addEventListener("mousedown", function(){
      if(graphs.length > 1 && document.getElementById(graph.elem + "form").value == ""){
        document.getElementById(graph.elem).remove();
        removeFromArray(graphs,graph.index)
      }else{
        document.getElementById(graph.elem + "form").value = "";
        graph.outputQueue = [];
      }
    });
  tanItegralElement.appendChild(deleteElem);


    tan.className = "button";
    tan.innerHTML = "d/dx";
    tan.style.border = "2px solid " + graph.color;

    tan.addEventListener("mousedown", function(){
      graph.showTangentLine();
      if(graph.showTangent == false || graph.showTangent == undefined){
        tan.className = "button";
      }else{
        tan.className = "button_enabled";
      }
    });

  tanItegralElement.appendChild(tan);

    tanEquals.innerHTML = "<span>= </span>";
    tanEquals.style.color = "white";
    tanEquals.style.alignSelf = "center";
    tanEquals.style.width = "auto";
    tanEquals.style.margin = "0px";
    tanEquals.style.padding = "0px";
    tanEquals.style.boarder = "5px";
    tanEquals.style.textdecoration = "none";
    tanEquals.style.cursor = "default";
  tanItegralElement.appendChild(tanEquals);

    integral.className = "button"
    integral.innerHTML = "∫f(x)dx";
    integral.style.border = "2px solid " + graph.color;

    integral.addEventListener("mousedown", function(){
      graph.showDefiniteIntegral();
      if(graph.showAreaUnderCurve == false || graph.showAreaUnderCurve == undefined){
        integral.className = "button";
      }else{
        integral.className = "button_enabled";
      }
    });

  tanItegralElement.appendChild(integral)

    defIntegral.innerHTML = "<span>=  </span>";
    defIntegral.style.color = "white";
    defIntegral.style.alignSelf = "center";
    defIntegral.style.width = "30px";
    defIntegral.style.height = "auto";
    defIntegral.style.margin = "0px";
    defIntegral.style.padding = "0px";
    defIntegral.style.boarder = "5px";
    defIntegral.style.textdecoration = "none";
    defIntegral.style.cursor = "default";
  tanItegralElement.appendChild(defIntegral);
  
  document.getElementById(graph.elem).appendChild(tanItegralElement);

}

// ∫f(x)dx
// d/dx


