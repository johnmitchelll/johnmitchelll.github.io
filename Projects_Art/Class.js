
let vels = [0,0,0,0,0,0];
let t = 0;

function updateLines(){

    t += 0.01

    for (let i = 0; i < lines.length; i++) {
        lines[i][0] = perlin.get(i+t, 1-t)*10;

        for (let j = lines[i].length-1; j >= 1; j--) {
            lines[i][j] = lines[i][j-1];
        }
    }

}

