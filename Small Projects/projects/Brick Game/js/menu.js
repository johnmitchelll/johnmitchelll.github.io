var brainActivated = false;
var brainSpeed = 50;

function handleHelp(){
    brainActivated = true;
    document.getElementById("stop").style.display = "inline";
    document.getElementById("speed_panel").style.display = "inline";
    document.getElementById("help").style.display = "none";
    setTimeout(playHand, 250);
}

function handleStop(){
    brainActivated = false;
    document.getElementById("stop").style.display = "none";
    document.getElementById("speed_panel").style.display = "none";
    document.getElementById("help").style.display = "inline";
}

document.getElementById('speed').addEventListener('input', () => {
    brainSpeed = parseInt(document.getElementById('speed').value);
    document.getElementById('speed_indicator').innerHTML = "Speed: " + brainSpeed + "%";
});