function draw(){
    draw_sky_box();
    
    camera.display();

    drawText("white", "8px monospace", "FPS: " + fps, CANVAS_WIDTH - 60, CANVAS_HEIGHT - 10); 
}

function draw_point_to_screen_space(v){
    colorCircle(-v.a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, v.a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2, 1, "white");
}

function draw_triangle_to_screen_space(t, c){
    drawFillTriangle(-t.v[0].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, t.v[0].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2,
                     -t.v[1].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, t.v[1].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2, 
                     -t.v[2].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, t.v[2].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2, 
                     "rgb("+ c[0]*255 +", "+ c[1]*255 +", "+ c[2]*255 +")");
                     
    // drawText("white", "8px monospace", 0, -t.v[0].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, t.v[0].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2,);
    // drawText("white", "8px monospace", 1, -t.v[1].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, t.v[1].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2);
    // drawText("white", "8px monospace", 2, -t.v[2].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, t.v[2].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2,);
}

function draw_line_to_screen_space(l){
    drawLine(-l.v[0].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, l.v[0].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2,
             -l.v[1].a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, l.v[1].a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2,
            2, "white");
}

function draw_light_source_to_screen_space(v, l){
    if(v.a[0] > 1 || v.a[0] < -1 || v.a[1] > 1 || v.a[1] < -1) return;
    colorCircle(-v.a[0] * CANVAS_WIDTH/2 + CANVAS_WIDTH/2, v.a[1] * CANVAS_HEIGHT/2 + CANVAS_HEIGHT/2, 5 * (-l.pos.a[2]-1), "rgb("+l.hue[0]*255+","+l.hue[1]*255+","+l.hue[2]*255+""+l.intensity+")");
}

function draw_sky_box(){
    let starting_line_angle = camera.y_ang + FOV_THETA;
    for (let i = 0; i < CANVAS_HEIGHT; i += 10) {
        let i_theta = starting_line_angle - Math.PI * i / CANVAS_HEIGHT;
        let rg = 75 - Math.abs(i_theta) / (Math.PI/2)*25;
        colorRect(0, i, CANVAS_WIDTH, 10, "rgb("+rg+", "+rg+", 200)");
    }
}