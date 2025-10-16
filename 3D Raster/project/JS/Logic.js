

function spin_light_source(){
    let light = light_sources[0];

    let dist = distance_of_two_points(0,0,light.pos.a[0], light.pos.a[2]);
    let ang = Math.atan2(light.pos.a[2],light.pos.a[0]);

    light.pos.a[0] = Math.cos(ang+SPIN_RATE/2) * dist;
    light.pos.a[2] = Math.sin(ang+SPIN_RATE/2) * dist;

    dist = distance_of_two_points(0,0,light.pos.a[0], light.pos.a[1]);
    ang = Math.atan2(light.pos.a[1],light.pos.a[0]);

    light.pos.a[0] = Math.cos(ang+SPIN_RATE/8) * dist;
    light.pos.a[1] = Math.sin(ang+SPIN_RATE/8) * dist;
}   

function spin_cube(){
    for (let i = 0; i < cube.length; i++) {
        for (let j = 0; j < cube[i].v.length; j++) {
            let dist = distance_of_two_points(0,0,cube[i].v[j].a[0], cube[i].v[j].a[2]-2);
            let ang = Math.atan2(cube[i].v[j].a[2]-2,cube[i].v[j].a[0]);

            cube[i].v[j].a[0] = Math.cos(ang+SPIN_RATE) * dist;
            cube[i].v[j].a[2] = 2+Math.sin(ang+SPIN_RATE) * dist;

            dist = distance_of_two_points(0,0,cube[i].v[j].a[0], cube[i].v[j].a[1]);
            ang = Math.atan2(cube[i].v[j].a[1],cube[i].v[j].a[0]);

            cube[i].v[j].a[0] = Math.cos(ang+SPIN_RATE) * dist;
            cube[i].v[j].a[1] = Math.sin(ang+SPIN_RATE) * dist;

            dist = distance_of_two_points(0,0, cube[i].v[j].a[1], cube[i].v[j].a[2]-2);
            ang = Math.atan2(cube[i].v[j].a[2]-2, cube[i].v[j].a[1]);

            cube[i].v[j].a[1] = Math.cos(ang+SPIN_RATE/2) * dist;
            cube[i].v[j].a[2] = 2+Math.sin(ang+SPIN_RATE/2) * dist;
        }
    }

    for (let i = 0; i < cube.length; i++) {
        cube[i].update_normal();
    }
}