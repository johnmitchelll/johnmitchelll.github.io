const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const Z_FAR = 10;
const Z_NEAR = 1;

const FOV_THETA = Math.PI/2;
const A = CANVAS_HEIGHT / CANVAS_WIDTH;
const F = 1 / Math.tan(FOV_THETA / 2);
const Q = Z_FAR / (Z_FAR - Z_NEAR);

const PROJECTION_MATRIX = new Matrix(
    4, 4,
    [A*F,    0,         0,            0,
      0,     F,         0,            0, 
      0,     0,         Q,            1,
      0,     0,   (-1*Z_NEAR*Q),      0]
);

var camera = new Camera();
const CAMERA_SENSITIVITY = Math.PI/2000;
const CAMERA_SPEED = Math.PI/500;
const SPIN_RATE = 0.004;

const MIN_LIGHTING = 0.2;
var light_sources = [];

var world_geometry = [];
var projected_world_geometry = [];

var cube = [];

// timing
var time_elapsed = 0;
var start_time = 0;
var prev_time = 0;
var delta_time = 0;
var fps = 0;
var fps_refresh_timer = 0;

// file reading
var file = new File();


// NOTES
// i want to make a good menu system 
// create a cube class
// be able to apply textures to objects
// look direction will be a fun one
