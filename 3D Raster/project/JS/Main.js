var canvas;
var canvasContext;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    setInterval(() => {
        update_time_steps();
        camera.move();
        draw();
        spin_light_source();
        canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, 1000/60);

    init();
});

function init(){
    start_time = Date.now();

    world_geometry = [];

    for (let x = -10; x <= 10; x += 1) {
        for (let z = -10; z <= 10; z += 1) {
            world_geometry.push(new Vector(4, [x, -1, z, 1]));
        }
    }

    new Block(-2,-1,3,[Math.random(),0,Math.random()]);

    let light = new Light_Source(new Vector(4, [10000, 10000, 10000, 1]), [1,1,1], 1);
    // world_geometry.push(light);
    light_sources.push(light);
}