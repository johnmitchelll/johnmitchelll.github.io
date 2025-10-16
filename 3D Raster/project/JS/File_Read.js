document.getElementById("file_input").addEventListener("change", (event) => {
    let input_file = event.target.files[0];
    if(!input_file) return;
  
    let name_type = input_file.name.split(".", 2);
    file.name = name_type[0];
    file.type = name_type[1];

    let reader = new FileReader();
    reader.onload = (e) => {    
        file.content = e.target.result;   
        file.parse_file();
    };
    reader.readAsText(input_file);
});

function File(){
    let name;
    let type;
    let content;

    this.parse_file = function(){
        if(this.type == "tri") this.parse_tri_file();
        else if(this.type == "obj") this.parse_obj_file();
    }

    this.parse_tri_file = function(){
        let split_string = this.content.split("Triangle");
        split_string.shift();

        
        for (let i = 0; i < split_string.length; i++) {
                let split_triangle_string = split_string[i].split("\n");
                split_triangle_string.shift();
                split_triangle_string.pop();

                let triangle_values = [];
                for (let j = 0; j < split_triangle_string.length; j++) {
                    split_triangle_string[j].replace(/[\\r]/g, '')
                    triangle_values.push(split_triangle_string[j].match(/-?\d+(\.\d+)?/g).map(Number));
                }
                
                let color = [triangle_values[0][0]/255, triangle_values[0][1]/255, triangle_values[0][2]/255];
                let v1 = new Vector(4, [parseFloat(triangle_values[1][0]), parseFloat(triangle_values[1][1]), parseFloat(triangle_values[1][2]), 1]);
                // let n1 = new Vector(4, [triangle_values[1][3], triangle_values[1][4], triangle_values[1][5], 1]);
                
                let v2 = new Vector(4, [parseFloat(triangle_values[2][0]), parseFloat(triangle_values[2][1]), parseFloat(triangle_values[2][2]), 1]);
                // let n2 = new Vector(4, [triangle_values[2][3], triangle_values[2][4], triangle_values[2][5], 1]);

                let v3  = new Vector(4, [parseFloat(triangle_values[3][0]), parseFloat(triangle_values[3][1]), parseFloat(triangle_values[3][2]), 1]);
                // let n3  = new Vector(4, [triangle_values[2][3], triangle_values[2][4], triangle_values[2][5], 1]);

                world_geometry.push(new Triangle([v1, v2, v3], color));
        }
    }

    this.parse_obj_file = function(){
        let split_string = this.content.split("\n");
        let vertecies = [];
        let normals = [];
        // let triangles = [];

        for (let i = 0; i < split_string.length; i++) {
            let split_line = split_string[i].split(" ");
            split_line[1]
            if(split_line[0] == "v") vertecies.push(split_string[i].match(/-?\d+(\.\d+)?/g).map(Number));
            if(split_line[0] == "vn") normals.push(split_string[i].match(/-?\d+(\.\d+)?/g).map(Number));
            

            if(split_line[0] == "f"){
                let vectors = [];
                for (let j = 1; j < split_line.length; j++) {
                    let vectors_info = split_line[j].split("/");
                    vectors_info[0] = parseFloat(vectors_info[0]);
                    vectors_info[1] = parseFloat(vectors_info[2]);
                    vectors_info[0] = vertecies[vectors_info[0]-1];
                    vectors_info[1] = normals[vectors_info[1]-1];
                    vectors_info.pop();
                    vectors.push(vectors_info);
                }

                world_geometry.push(new Triangle([new Vector(4, vectors[0][0].concat(1)), 
                                             new Vector(4, vectors[1][0].concat(1)), 
                                             new Vector(4, vectors[2][0].concat(1))], 
                                            [1,1,1]));
            }
        }
    }
}