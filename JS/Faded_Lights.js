const pf_path = document.getElementById('animatedPath');
const pf_hoverTarget = document.querySelector('.hover-target');

const pf_originalD = "M-5,150 Q150,250, 150,350 T350,503";
const pf_hoverD    = "M-5,150 Q150,150, 150,350 T350,403"; // change shape for demo

pf_hoverTarget.addEventListener('mouseenter', () => {
  pf_path.setAttribute("d", hoverD);
});

pf_hoverTarget.addEventListener('mouseleave', () => {
  pf_path.setAttribute("d", originalD);
});


// var faded_lights = new DrawableSurface('pf_faded_lights_art');

// var lights;
// const LIGHTS_SCALE = 10;
// const LIGHTS_BRIGHTNESS = 1;

// faded_lights.init = function(){
//     lights = new Array(Math.floor(this.canvas.width / LIGHTS_SCALE));

//     for (let i = 0; i < lights.length; i++) {
//         updateColor();
//         lights[i] = {r: r, g: g, b: b};
//         this.colorRect(i * LIGHTS_SCALE, 0, LIGHTS_SCALE, this.canvas.height, "rgba(" + r + ", " + g + ", " + b + ", " + LIGHTS_BRIGHTNESS + ")");
//     }
// }

// faded_lights.draw = function(){
//     updateColor();
//     lights.shift();
//     lights.push({r: r, g: g, b: b});

//     for (let i = 0; i < lights.length; i++) {
//         this.colorRect(i * LIGHTS_SCALE, 0, LIGHTS_SCALE, this.canvas.height, "rgba(" + lights[i].r + ", " + lights[i].g + ", " + lights[i].b + ", " + LIGHTS_BRIGHTNESS + ")");
//     }
// }

