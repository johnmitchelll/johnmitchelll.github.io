var grid = new DrawableSurface('calc_bottom_art_canvas');

grid.draw = function(){
    let interval = Math.PI/32;

    let startx = this.canvas.offsetWidth/2;
    let starty = this.canvas.offsetHeight/2;

    // vert lines
    for (let i = 2*Math.PI/16; i <= 14*Math.PI/16+0.01; i += interval) {
        this.drawLine(startx, starty, startx+Math.cos(i)*1000, starty+Math.sin(i)*1000, 1, "rgba(253,251,248, 0.4)", "rgba(253,251,248, 0.4)");
        this.drawLine(startx, starty, startx+Math.cos(i)*1000, starty-Math.sin(i)*1000, 1, "rgba(253,251,248, 0.4)", "rgba(253,251,248, 0.4)");
    }

    // horz lines
    for (let i = 0; i <= 122.5; i += 12.25) {
        let c = i / Math.max(Math.sin(14*Math.PI/16), 0.000001);

        this.drawLine(startx+Math.cos(14*Math.PI/16)*c, starty+i, startx-Math.cos(14*Math.PI/16)*c, starty+i, 0.5, "rgba(253,251,248, 0.4)", "rgba(253,251,248, 0.4)");
        this.drawLine(startx+Math.cos(14*Math.PI/16)*c, starty+i*-1, startx-Math.cos(14*Math.PI/16)*c, starty+i*-1, 0.5, "rgba(253,251,248, 0.4)", "rgba(253,251,248, 0.4)");
    }
}
