document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    scene = menu_scene;
    initScenes();

    setInterval(() => {
        draw();
        scene.hover();
        canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, 1000/60);
});


function setUp(){
    pausableTimeouts = [];
    inputAllowed = false;
    hover_index = undefined;
    
    for (let i = 0; i < 4; i++) {
        brains.push(new Brain(i));
    }

    game = new Game();
    game.deal();
    
    initGameScene();
}