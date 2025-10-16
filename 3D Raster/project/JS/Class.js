
function Matrix(m, n, values){
    this.m = m;
    this.n = n;
    this.a = new Array(m);

    for (let i = 0; i < m; i++) {
        this.a[i] = new Array(n).fill(0);
    }

    for (let i = 0; i < m; i++) {
        if(!values) break;

        for (let j = 0; j < n; j++) {
            if(values[n * i + j] == undefined) throw new SyntaxError("Matrix Values Are Not Complete");
            this.a[i][j] = values[n * i + j];
        }
    }

}

function Vector(m, values){
    this.m = m;
    this.n = 1;
    this.a = new Array(m).fill(0);

    for (let i = 0; i < m; i++) {
        if(!values) break;

        if(values[i] == undefined) throw new SyntaxError("Vector Values Are Not Complete");
        this.a[i] = values[i];
    }
}

function matrix_matrix_multiplication(m1, m2){
    if(m1.n != m2.m) throw new SyntaxError("Matricies Are Incompatible");

    let values = new Array(m1.m * m2.n).fill(0);

    for (let i = 0; i < m1.m; i++) {
        for (let j = 0; j < m2.n; j++) {

            for (let e = 0; e < m1.n; e++) {
                values[i * m2.n + j] += m1.a[i][e] * m2.a[e][j];
            }
        }
    }

    return new Matrix(m1.m, m2.n, values);
}

function matrix_matrix_addition(m1, m2){
    if(m1.m != m2.m || m1.n != m2.n) throw new SyntaxError("Matricies Are Incompatible");

    let values = new Array(m1.m * m1.n).fill(0);

    for (let i = 0; i < m1.m; i++) {
        for (let j = 0; j < m1.n; j++) {
            values[i * m1.n + j] = m1.a[i][j] + m2.a[i][j];
        }
    }

    return new Matrix(m1.m, m1.n, values);
}

function matrix_vector_multiplication(m, v){
    if(m.n != v.m) throw new SyntaxError("Matrix-Vector Dimentions Are Incompatible");

    let values = new Array(m.m).fill(0);

    for (let i = 0; i < m.m; i++) {
        for (let j = 0; j < m.n; j++) {
            values[i] += m.a[i][j] * v.a[j];
        }
    }

    return new Vector(m.m, values);
}

function vector_vector_multiplication(v1, v2){
    if(v1.m != v2.m) throw new SyntaxError("Vectors Are Incompatible");

    let value = 0;

    for (let i = 0; i < v1.m; i++) {
        value += v1.a[i] * v2.a[i];
    }

    return value;
}

function vector_vector_addition(v1, v2){
    if(v1.m != v2.m) throw new SyntaxError("Vectors Are Incompatible");

    let values = new Array(v1.m).fill(0);

    for (let i = 0; i < v1.m; i++) {
        values[i] = v1.a[i] + v2.a[i];
    }

    return new Vector(v1.m, values);
}

function vector_scalar_multiplication(v, s){
    let values = new Array(v.m).fill(0);

    for (let i = 0; i < v.m; i++) {
        values[i] = v.a[i] * s;
    }

    return new Vector(v.m, values);
}

function cross_product(v1, v2){
    // function only for 3D vecs
    if(v1.m != 4 || v2.m != 4) throw new SyntaxError("Vectors Must Be 3D");

    let values = [v1.a[1]*v2.a[2] - v1.a[2]*v2.a[1], 
                  v1.a[2]*v2.a[0] - v1.a[0]*v2.a[2],
                  v1.a[0]*v2.a[1] - v1.a[1]*v2.a[0], 1];

    return new Vector(v1.m, values);
}

function dot_product(v1, v2){
    if(vector_magnitude(v1) != 1) v1 = vector_scalar_multiplication(v1, 1 / vector_magnitude(v1));
    if(vector_magnitude(v2) != 1) v2 = vector_scalar_multiplication(v2, 1 / vector_magnitude(v2));
    return v1.a[0]*v2.a[0] + v1.a[1]*v2.a[1] + v1.a[2]*v2.a[2];
}

function vector_magnitude(v){
    return Math.sqrt(v.a[0]**2 + v.a[1]**2 + v.a[2]**2);
}

function Camera(){
    this.xz_ang = 0;
    this.y_ang = 0;
    this.pos = new Vector(4, [0,0,0, 1]);
    this.dir = new Vector(4, [0,0,1, 1]);

    this.display = function(){
        projected_world_geometry = [];
        this.project_world_geometry();
        projected_world_geometry.sort((a, b) => b.z - a.z);

        for (let i = 0; i < projected_world_geometry.length; i++) {
            // if(projected_world_geometxry[i].o instanceof Triangle) draw_triangle_to_screen_space(projected_world_geometry[i].o, projected_world_geometry[i].o.color);
            if(projected_world_geometry[i].o instanceof Triangle) draw_triangle_to_screen_space(projected_world_geometry[i].o, projected_world_geometry[i].o.color);
            if(projected_world_geometry[i].o instanceof Line) draw_line_to_screen_space(projected_world_geometry[i].o);
            if(projected_world_geometry[i].o instanceof Light_Source) draw_light_source_to_screen_space(projected_world_geometry[i].o.pos, projected_world_geometry[i].o);
            if(projected_world_geometry[i].o instanceof Vector) draw_point_to_screen_space(projected_world_geometry[i].o);
        }
    }

    this.project_world_geometry = function(){
        for (let i = 0; i < world_geometry.length; i++) {
            if(world_geometry[i] instanceof Face){
                this.project_triangle(world_geometry[i].t[0]);
                this.project_triangle(world_geometry[i].t[1]);
            } else

            if(world_geometry[i] instanceof Triangle){
                this.project_triangle(world_geometry[i]);
            } else 

            if(world_geometry[i] instanceof Line){
                let clipped_into_z_near = false;
                let projected_line = new Line(undefined, undefined, world_geometry[i].center);
                let closer_point_to_cam = -1;

                for (let j = 0; j < 2; j++) {
                    let transformed_point = this.tranform_point_into_camera_space(world_geometry[i].v[j]);
                    if(closer_point_to_cam = -1 || transformed_point.a[2] < closer_point_to_cam) closer_point_to_cam = transformed_point.a[2];
                    if(transformed_point.a[2] < 0) clipped_into_z_near = true;
                    projected_line.v[j] = this.project_point_into_screen_space(transformed_point);
                }
                
                if(clipped_into_z_near == false) projected_world_geometry.push({o: projected_line, z: closer_point_to_cam});
            } else 

            if(world_geometry[i] instanceof Light_Source){
                let transformed_point = this.tranform_point_into_camera_space(world_geometry[i].pos);
                if(transformed_point.a[2] < 0) continue;
                let projected_point = this.project_point_into_screen_space(transformed_point);
                if(projected_point.a[0] > 1 || projected_point.a[0] < -1 || projected_point.a[1] > 1 || projected_point.a[1] < -1) continue;
                let new_light_source = new Light_Source(projected_point, world_geometry[i].hue, world_geometry[i].intensity);
                projected_world_geometry.push({o: new_light_source, z: transformed_point.a[2]});
            } else 

            if(world_geometry[i] instanceof Vector){
                let transformed_point = this.tranform_point_into_camera_space(world_geometry[i]);
                if(transformed_point.a[2] < 0) continue;
                let projected_point = this.project_point_into_screen_space(transformed_point);
                if(projected_point.a[0] > 1 || projected_point.a[0] < -1 || projected_point.a[1] > 1 || projected_point.a[1] < -1) continue;
                projected_world_geometry.push({o: projected_point, z: transformed_point.a[2]});
            }
        }
    }

    this.move = function(){
        if(held_keys["ARROWUP"]) this.y_ang += CAMERA_SENSITIVITY * delta_time;
        if(held_keys["ARROWLEFT"]) this.xz_ang -= 2 * CAMERA_SENSITIVITY * delta_time;
        if(held_keys["ARROWRIGHT"]) this.xz_ang += 2 * CAMERA_SENSITIVITY * delta_time;
        if(held_keys["ARROWDOWN"]) this.y_ang -= CAMERA_SENSITIVITY * delta_time;

        if(this.y_ang > Math.PI/2) this.y_ang = Math.PI/2;
        if(this.y_ang < -Math.PI/2) this.y_ang = -Math.PI/2;

        this.dir.a[0] = Math.sin(this.xz_ang);
        this.dir.a[1] = Math.sin(this.y_ang);
        this.dir.a[2] = Math.cos(this.xz_ang);

        if(held_keys["W"]){
            this.pos.a[0] += Math.sin(this.xz_ang) * CAMERA_SPEED * delta_time * Math.cos(this.y_ang);
            this.pos.a[1] += Math.sin(this.y_ang) * CAMERA_SPEED * delta_time;
            this.pos.a[2] += Math.cos(this.xz_ang) * CAMERA_SPEED * delta_time * Math.cos(this.y_ang);
        } 

        if(held_keys["A"]){
            this.pos.a[0] -= Math.sin(this.xz_ang + Math.PI/2) * CAMERA_SPEED * delta_time;
            this.pos.a[2] -= Math.cos(this.xz_ang + Math.PI/2) * CAMERA_SPEED * delta_time;
        } 

        if(held_keys["S"]){
            this.pos.a[0] -= Math.sin(this.xz_ang) * CAMERA_SPEED * delta_time * Math.cos(this.y_ang);
            this.pos.a[1] -= Math.sin(this.y_ang) * CAMERA_SPEED * delta_time;
            this.pos.a[2] -= Math.cos(this.xz_ang) * CAMERA_SPEED * delta_time * Math.cos(this.y_ang);
        } 

        if(held_keys["D"]){
            this.pos.a[0] += Math.sin(this.xz_ang + Math.PI/2) * CAMERA_SPEED * delta_time;
            this.pos.a[2] += Math.cos(this.xz_ang + Math.PI/2) * CAMERA_SPEED * delta_time;
        } 

        if(held_keys[" "]){
            this.pos.a[1] += CAMERA_SPEED * delta_time;
        }

        if(held_keys["SHIFT"]){
            this.pos.a[1] -= CAMERA_SPEED * delta_time;
        }
    }

    this.tranform_point_into_camera_space = function(v){
        let translated = new Vector(4, [v.a[0] - this.pos.a[0], v.a[1] - this.pos.a[1], v.a[2] - this.pos.a[2], 1]);

        let xz_dist = distance_of_two_points(translated.a[0], translated.a[2], 0, 0)
        let angle_to_camera_xz = Math.atan2(translated.a[2], translated.a[0]);
        let rotated_xz_angle = angle_to_camera_xz + this.xz_ang;

        let rotated_xz = new Vector(4, [
            Math.cos(rotated_xz_angle) * xz_dist, 
            translated.a[1], 
            Math.sin(rotated_xz_angle) * xz_dist, 
            1
        ]);

        let yz_dist = distance_of_two_points(rotated_xz.a[1], rotated_xz.a[2], 0, 0)
        let angle_to_camera_yz = Math.atan2(rotated_xz.a[1], rotated_xz.a[2]);
        let rotated_yz_angle = angle_to_camera_yz - this.y_ang;

        let rotated_yz = new Vector(4, [
            rotated_xz.a[0], 
            Math.sin(rotated_yz_angle) * yz_dist, 
            Math.cos(rotated_yz_angle) * yz_dist, 
            1
        ]);

        return rotated_yz;
    }

    this.project_point_into_screen_space = function(v){
        let projected_point = matrix_vector_multiplication(PROJECTION_MATRIX, v);
        projected_point = vector_scalar_multiplication(projected_point, 1 / projected_point.a[3]);

        return projected_point;
    }

    this.clip_triangle = function(transformed_points, color, z){
        let clipped = [];
        let unclipped = [];

        for (let j = 0; j < 3; j++) {
            if(transformed_points[j].a[2] <= 0) clipped.push(transformed_points[j].a);
            else if(transformed_points[j].a[2] > 0) unclipped.push(transformed_points[j].a);
        }

        // easy we just are in front of triangle lol
        if(clipped.length == 3) return;

        // create a triagle
        if(clipped.length == 2){
            let close_one = intersectLineWithXYPlane(unclipped[0], clipped[0]);
            let close_two = intersectLineWithXYPlane(unclipped[0], clipped[1]);

            let tri = new Triangle([new Vector(4, [unclipped[0][0], unclipped[0][1], unclipped[0][2], 1]), 
                                    new Vector(4, [close_one[0], close_one[1], close_one[2], 1]),
                                    new Vector(4, [close_two[0], close_two[1], close_two[2], 1])], 
                                    color);

            for (let j = 0; j < 3; j++) {
                tri.v[j] = this.project_point_into_screen_space(tri.v[j]);
            }

            projected_world_geometry.push({o: tri, z: z});

            return;
        }

        // create a trapezoid
        if(clipped.length == 1){
            let close_one = intersectLineWithXYPlane(unclipped[0], clipped[0]);
            let close_two = intersectLineWithXYPlane(unclipped[1], clipped[0]);
            let far_average = [(unclipped[0][0] + unclipped[1][0]) / 2, 
                            (unclipped[0][1] + unclipped[1][1]) / 2, 
                            (unclipped[0][2] + unclipped[1][2]) / 2];

            let tri_one = new Triangle([new Vector(4, [unclipped[0][0], unclipped[0][1], unclipped[0][2], 1]), 
                                        new Vector(4, [close_one[0], close_one[1], close_one[2], 1]),
                                        new Vector(4, [far_average[0], far_average[1], far_average[2], 1])], 
                                        color);

            let tri_two = new Triangle([new Vector(4, [close_one[0], close_one[1], close_one[2], 1]), 
                                        new Vector(4, [far_average[0], far_average[1], far_average[2], 1]),
                                        new Vector(4, [close_two[0], close_two[1], close_two[2], 1])], 
                                        color);

            let tri_three = new Triangle([new Vector(4, [far_average[0], far_average[1], far_average[2], 1]), 
                                        new Vector(4, [close_two[0], close_two[1], close_two[2], 1]),
                                        new Vector(4, [unclipped[1][0], unclipped[1][1], unclipped[1][2], 1])], 
                                        color);

            for (let j = 0; j < 3; j++) {
                tri_one.v[j] = this.project_point_into_screen_space(tri_one.v[j]);
                tri_two.v[j] = this.project_point_into_screen_space(tri_two.v[j]);
                tri_three.v[j] = this.project_point_into_screen_space(tri_three.v[j]);
            }

            projected_world_geometry.push({o: tri_one, z: z});
            projected_world_geometry.push({o: tri_two, z: z});
            projected_world_geometry.push({o: tri_three, z: z}); 
        }
    }

    this.project_triangle = function(t){
        // check if we are facing the triangle
        let neg_tri_center = vector_scalar_multiplication(t.center, -1);
        let cam_to_tri_dir = vector_vector_addition(this.pos, neg_tri_center);
        if(dot_product(cam_to_tri_dir, t.normal) < 0) return;

        let clipped_into_z_near = false;
        let projected_triangle = new Triangle(undefined, t.color, t.normal, false);
        projected_triangle.center = t.center
        let transformed_points = new Array(3);
        let average_z = 0;

        for (let j = 0; j < 3; j++) {
            let transformed_point = this.tranform_point_into_camera_space(t.v[j]);
            transformed_points[j] = transformed_point;
            if(transformed_point.a[2] < 0) clipped_into_z_near = true;
            average_z += transformed_point.a[2];
            projected_triangle.v[j] = this.project_point_into_screen_space(transformed_point);
        }

        average_z /= 3;
        let tranformed_center = this.tranform_point_into_camera_space(t.center).a[2];
        projected_triangle.color = calculate_triangle_lighting(projected_triangle);

        if(clipped_into_z_near == false){
            projected_world_geometry.push({o: projected_triangle, z: tranformed_center});
        }else{
            this.clip_triangle(transformed_points, projected_triangle.color, tranformed_center);
        }
    }
}

function Triangle(v, c, n, create_normal){
    this.v = v;
    if(!v) this.v = [new Vector(4, [0,0,0,1]), new Vector(4, [0,0,0,1]), new Vector(4, [0,0,0,1])];

    this.color = c;
    this.center = new Vector(4, [(this.v[0].a[0] + this.v[1].a[0] + this.v[2].a[0]) / 3, (this.v[0].a[1] + this.v[1].a[1] + this.v[2].a[1]) / 3, (this.v[0].a[2] + this.v[1].a[2] + this.v[2].a[2]) / 3, 1]);
    this.normal = n;
    this.smooth_shading = false;
    if(this.n instanceof Array) this.smooth_shading = true;

    this.update_normal = function(){
        this.center = new Vector(4, [(this.v[0].a[0] + this.v[1].a[0] + this.v[2].a[0]) / 3, (this.v[0].a[1] + this.v[1].a[1] + this.v[2].a[1]) / 3, (this.v[0].a[2] + this.v[1].a[2] + this.v[2].a[2]) / 3, 1]);
        const AB_EDGE = new Vector(4, [this.v[1].a[0] - this.v[0].a[0], this.v[1].a[1] - this.v[0].a[1], this.v[1].a[2] - this.v[0].a[2], 1]);
        const AC_EDGE = new Vector(4, [this.v[2].a[0] - this.v[0].a[0], this.v[2].a[1] - this.v[0].a[1], this.v[2].a[2] - this.v[0].a[2], 1]);
        const N = cross_product(AB_EDGE, AC_EDGE);
        const VECTOR_MAGNITUDE = vector_magnitude(N);
        this.normal = new Vector(4, [N.a[0] / VECTOR_MAGNITUDE, N.a[1] / VECTOR_MAGNITUDE, N.a[2] / VECTOR_MAGNITUDE, 0]);
        
        if(!this.line) return;
        this.line.v[0] = this.center;
        this.line.v[1] = vector_vector_addition(this.center, this.normal);
    }

    if(!n && this.smooth_shading == false) this.update_normal();
    if(!create_normal || create_normal == false) return;
    this.line = new Line(this.center, vector_vector_addition(this.center, this.normal));
    world_geometry.push(this.line);
}

function Face(v1, v2, color, normal, face_image){
    let oposite_corner_vertex_one = new Vector(4, [v1.a[0], v2.a[1], v1.a[2], 1]);
    let oposite_corner_vertex_two = new Vector(4, [v2.a[0], v1.a[1], v2.a[2], 1]);

    if(v1.a[1] - v2.a[1] == 0){
        oposite_corner_vertex_one = new Vector(4, [v1.a[0], v1.a[1], v2.a[2], 1]);
        oposite_corner_vertex_two = new Vector(4, [v2.a[0], v1.a[1], v1.a[2], 1]);
    }

    this.t = [
        new Triangle([new Vector(4, v1.a), new Vector(4, v2.a), oposite_corner_vertex_one], color, normal),
        new Triangle([new Vector(4, v1.a), new Vector(4, v2.a), oposite_corner_vertex_two], color, normal)
    ];

    this.v = [v1, v2];
    this.color = color;
    this.normal = normal;
    this.face_image = face_image;
}

function Block(x,y,z, color){
    this.color = color;
    this.faces = [];

    // NORTH SOUTH EAST WEST TOP BOTTOM
    this.faces.push(new Face(new Vector(4, [x,y,z+1,1]), new Vector(4, [x+1,y+1,z+1,1]), this.color, new Vector(4, [0,0,1,1])));
    this.faces.push(new Face(new Vector(4, [x,y,z,1]), new Vector(4, [x+1,y+1,z,1]), this.color, new Vector(4, [0,0,-1,1])));
    this.faces.push(new Face(new Vector(4, [x+1,y,z,1]), new Vector(4, [x+1,y+1,z+1,1]), this.color, new Vector(4, [1,0,0,1])));
    this.faces.push(new Face(new Vector(4, [x,y,z,1]), new Vector(4, [x,y+1,z+1,1]), this.color, new Vector(4, [-1,0,0,1])));
    this.faces.push(new Face(new Vector(4, [x,y+1,z,1]), new Vector(4, [x+1,y+1,z+1,1]), this.color, new Vector(4, [0,1,0,1])));
    this.faces.push(new Face(new Vector(4, [x,y,z,1]), new Vector(4, [x+1,y,z+1,1]), this.color, new Vector(4, [0,-1,0,1])));

    for (let i = 0; i < this.faces.length; i++) {
        world_geometry.push(this.faces[i]);
    }
}

function Line(v1, v2, center){
    this.v = [v1, v2];
    if(v1 == undefined || v2 == undefined) v = [new Vector(4, [0,0,0,1]), new Vector(4, [0,0,0,1])];

    if(center){
        this.center = center;
        return;
    } 

    this.center = new Vector(4, [(this.v[0].a[0] + this.v[1].a[0]) / 2, (this.v[0].a[1] + this.v[1].a[1]) / 2, (this.v[0].a[2] + this.v[1].a[2]) / 2, 1]);
}

function Light_Source(v, hue, intensity){
    this.pos = v;
    this.hue = hue;
    this.intensity = intensity;
}

function calculate_triangle_lighting(t){
    let accumulated_light = [MIN_LIGHTING,MIN_LIGHTING,MIN_LIGHTING];

    for (let i = 0; i < light_sources.length; i++) {
        let neg_tri_center = vector_scalar_multiplication(t.center, -1);
        let light_to_tri_dir = vector_vector_addition(light_sources[i].pos, neg_tri_center);
        let dot_product_light_tri = dot_product(light_to_tri_dir, t.normal);
        if(dot_product_light_tri < 0) continue;

        for (let j = 0; j < 3; j++) {
            accumulated_light[j] += light_sources[i].hue[j] * dot_product_light_tri * light_sources[i].intensity;
            accumulated_light[j] = Math.min(1, accumulated_light[j]);
        }
    }

    return [t.color[0] * accumulated_light[0], t.color[1] * accumulated_light[1], t.color[2] * accumulated_light[2]];
}