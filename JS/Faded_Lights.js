var faded_lights = new DrawableSurface('pf_faded_lights_art');

var lights;
const LIGHTS_SCALE = 10;
const LIGHTS_BRIGHTNESS = 1;

faded_lights.init = function(){
    lights = new Array(Math.floor(this.canvas.width / LIGHTS_SCALE));

    for (let i = 0; i < lights.length; i++) {
        updateColor();
        lights[i] = {r: r, g: g, b: b};
        this.colorRect(i * LIGHTS_SCALE, 0, LIGHTS_SCALE, this.canvas.height, "rgba(" + r + ", " + g + ", " + b + ", " + LIGHTS_BRIGHTNESS + ")");
    }
}

faded_lights.draw = function(){
    updateColor();
    lights.shift();
    lights.push({r: r, g: g, b: b});

    for (let i = 0; i < lights.length; i++) {
        this.colorRect(i * LIGHTS_SCALE, 0, LIGHTS_SCALE, this.canvas.height, "rgba(" + lights[i].r + ", " + lights[i].g + ", " + lights[i].b + ", " + LIGHTS_BRIGHTNESS + ")");
    }
}

