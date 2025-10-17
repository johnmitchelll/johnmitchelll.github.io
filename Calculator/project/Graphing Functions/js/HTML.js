    
function handleFormInputFromKeyBoard(input){
    if(input.type == "text"){
        let elem = document.getElementById("graph" + currentKeyBoard + "form");

        elem.value = addStrToOtherStr(elem.value, currentKeyBoardCursorPostion, input.val);
        setCursorInputPosition(elem, currentKeyBoardCursorPostion + input.val.length);
        currentKeyBoardCursorPostion += input.val.length;
    }

    if(input.type == "action"){
        if(input.val == "up" && currentKeyBoard > 0){
            setCursorInputPosition(document.getElementById("graph" + (currentKeyBoard-1) + "form"), 0);
            currentKeyBoardCursorPostion = 0;
            currentKeyBoard--;
        }
        if(input.val == "down" && currentKeyBoard < graphs.length-1){
            setCursorInputPosition(document.getElementById("graph" + (currentKeyBoard+1) + "form"), 0);
            currentKeyBoardCursorPostion = 0;
            currentKeyBoard++; 
        }
        if(input.val == "right" && currentKeyBoardCursorPostion < document.getElementById("graph" + currentKeyBoard + "form").value.length)
        {
            setCursorInputPosition(document.getElementById("graph" + currentKeyBoard + "form"), currentKeyBoardCursorPostion + 1);
            currentKeyBoardCursorPostion++;
        }
        if(input.val == "left" && currentKeyBoardCursorPostion > 0){
            setCursorInputPosition(document.getElementById("graph" + currentKeyBoard + "form"), currentKeyBoardCursorPostion - 1);
            currentKeyBoardCursorPostion--;
        }
        if(input.val == "backspace" && currentKeyBoardCursorPostion > 0){
            let elem = document.getElementById("graph" + currentKeyBoard + "form");
            elem.value = removeCharFromSrting(elem.value, currentKeyBoardCursorPostion)
            currentKeyBoardCursorPostion--;
        }
    }
}

function setCursorInputPosition(e, pos) {
    e.focus();
    e.setSelectionRange(pos, pos);
}

function addFunction(){
    graphs.push(new Graph());
}

function toggleKeyBoard(){
    //if it is deactivated
    if(keyboardActive == false){

        document.getElementById("keyboard").style.height = (window.innerHeight/3) + "px";
        document.getElementById("keyboard").style.width = window.innerWidth + "px";
        document.getElementById("up").style.display = "none";
        document.getElementById("activated_keyboard").style.display = "flex";

        let winKeyboardDif = window.innerHeight - document.getElementById("activated_keyboard").offsetHeight;
        canvas.height = winKeyboardDif;
        canvasContext.translate(canvas.width/2, canvas.height/2);

        keyboardActive = true;

        return;
    }
    
    document.getElementById("keyboard").style.height = "50px";
    document.getElementById("keyboard").style.width = document.getElementById("sidenav").offsetWidth + "px";
    document.getElementById("up").style.display = "initial";
    document.getElementById("activated_keyboard").style.display = "none";

    canvas.height = window.innerHeight;
    canvasContext.translate(canvas.width/2, canvas.height/2);

    keyboardActive = false;
}

function lockCursorToFirstFunciton(){
    if(mouseYLock){
        mouseYLock = false;
        document.getElementById("yVal1").className = "button";
        return;
    }

    document.getElementById("yVal1").className = "button_enabled";
    mouseYLock = true;
}

function handleGraphCSS(index){
    graphs[index].tanEquals.style.width = "auto";
    graphs[index].defIntegral.style.width = "auto";
}

function setValuesOfHTML(){
    canvas.width = window.innerWidth-document.getElementById("sidenav").offsetWidth;
    
    if(keyboardActive){
      document.getElementById("keyboard").style.width = window.innerWidth + "px";
      document.getElementById("keyboard").style.height = (window.innerHeight/3) + "px";
      let winKeyboardDif = window.innerHeight - document.getElementById("activated_keyboard").offsetHeight;
      canvas.height = winKeyboardDif;
    }else{
      canvas.height = window.innerHeight;
    }

    canvasContext.translate(canvas.width/2, canvas.height/2);

    let n_rangeslider = document.getElementById("n");
    n = n_rangeslider.value;
    document.getElementById("n_text").textContent = "Number of Partitions = " + n;


    let subtractedHeight = window.innerHeight - document.getElementById("keyboard").offsetHeight - 10;
    document.getElementById("sidenav").style.height =  subtractedHeight + "px";
      
    outputQueue = parse(document.getElementById("a_equals").value);
    if(outputQueue.length > 0){
      outcome = eval(outputQueue, 1);
      if(isNaN(outcome) == false && outcome != undefined && Math.abs(outcome) != Infinity){
        a = eval(outputQueue, 1);
      }
    }
      
    outputQueue = parse(document.getElementById("b_equals").value);
    if(outputQueue.length > 0){
      outcome = eval(outputQueue, 1);
      if(isNaN(outcome) == false && outcome != undefined && Math.abs(outcome) != Infinity){
        b = eval(outputQueue, 1);
      }
    }

    outputQueue = parse("-" + document.getElementById("cursorX_equals").value);
    if(outputQueue.length > 0){
      outcome = eval(outputQueue, 1);

      if(prevXCursor != document.getElementById("cursorX_equals").value){
        prevXCursor = document.getElementById("cursorX_equals").value;
        cursorXControl = false;
      }
      
      if(isNaN(outcome) == false && outcome != undefined && Math.abs(outcome) != Infinity && cursorXControl == false){
        offX = outcome;
      } 
    }
}

