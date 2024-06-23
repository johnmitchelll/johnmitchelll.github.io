const HERO_STRINGS = ["Full Stack Designer", "Student", "Self Taught", "Software Engineer", "6+ Years of Experience"];
var heroStringIndex = [0,0];
var heroStringDir = 1;
var outputString = document.getElementById("hero_dynamic");
var cursor = document.getElementById("hero_cursor");

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