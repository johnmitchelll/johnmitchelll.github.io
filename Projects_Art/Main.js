var projectsCanvas;
var projectsCanvasContext;

document.addEventListener('DOMContentLoaded', function() {
	projectsCanvas = document.getElementById('projects_canvas');
	projectsCanvasContext = projectsCanvas.getContext('2d');

    projectsCanvas.style.width = window.innerWidth + "px";
    projectsCanvas.style.height = window.innerHeight + "px";

    projectsCanvas.width = screen.width;
    projectsCanvas.height = screen.height;

	startProjects();

	var framesPerSecond = 30;
    setInterval(function(){drawEverythingProjects();},1000/framesPerSecond);
});


function startProjects(){
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < 300; j++) {
            lines[i][j] = Math.random()*30-15;
        }
    }

    linesXs = [projectsCanvas.width/2, 
               projectsCanvas.width/2,
               projectsCanvas.width/2, 
               projectsCanvas.width/2,
               projectsCanvas.width/2,
               projectsCanvas.width/2];


    linesAngs = [65*Math.PI/64, 65*Math.PI/64+0.1, 65*Math.PI/64+0.2, 
                 -Math.PI/64, -Math.PI/64-0.1, -Math.PI/64-0.2];
}


