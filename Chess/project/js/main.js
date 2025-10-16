var canvas;
var canvasContext;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    setUp();

    setInterval(update, 1000/60);
});

function setUp(){
    game_ref = new Game();
    game_history = new History();

    brain = new Brain((game_ref.white_side == 0) ? 1 : 0, game_ref);

    pieces_img_data[0] = new Piece(0, 0, "./content/black.png", 0, 9, 10, 14);
    pieces_img_data[1] = new Piece(0, 1, "./content/black.png", 16, 7, 10, 16);
    pieces_img_data[2] = new Piece(0, 2, "./content/black.png", 32, 6, 10, 17);
    pieces_img_data[3] = new Piece(0, 3, "./content/black.png", 48, 4, 10, 19);
    pieces_img_data[4] = new Piece(0, 4, "./content/black.png", 64, 3, 10, 20);
    pieces_img_data[5] = new Piece(0, 5, "./content/black.png", 80, 0, 10, 23);

    pieces_img_data[6] = new Piece(1, 0, "./content/white.png", 0, 9, 10, 14);
    pieces_img_data[7] = new Piece(1, 1, "./content/white.png", 16, 7, 10, 16);
    pieces_img_data[8] = new Piece(1, 2, "./content/white.png", 32, 6, 10, 17);
    pieces_img_data[9] = new Piece(1, 3, "./content/white.png", 48, 4, 10, 19);
    pieces_img_data[10] = new Piece(1, 4, "./content/white.png", 64, 3, 10, 20);
    pieces_img_data[11] = new Piece(1, 5, "./content/white.png", 80, 0, 10, 23);

    init_menu_items();
}

function update(){
    draw();
    play_brain();
    prevMouseDown = mouseDown;
    canvasAlign(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
}