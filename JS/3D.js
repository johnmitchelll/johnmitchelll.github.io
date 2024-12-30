
// calc_bottom_art_canvas

var three_dimentional = new DrawableSurface('calc_bottom_art_canvas');

const SCREEN_WIDTH = document.getElementById("calc_bottom_art_canvas").offsetWidth;
const SCREEN_HEIGHT = 270;

// scaled down
const WORLD_WIDTH = 1;
const WORLD_HEIGHT = SCREEN_WIDTH / SCREEN_HEIGHT * 1.5;

const camera_origin = { x: 0, y: 0, z: -1 };

function getIntersectionWithZPlane(point1, point2) {
    // The plane's equation is z = 0
    const planeZ = 0;

    // Extract coordinates from the points
    const x1 = point1.x, y1 = point1.y, z1 = point1.z;
    const x2 = point2.x, y2 = point2.y, z2 = point2.z;

    // Calculate the direction vector of the line segment
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;

    // If dz is 0, the line is parallel to the plane
    if (Math.abs(dz) < 1e-6) {
        return null; // No intersection
    }

    // Find the parameter t where the line intersects the plane
    const t = (planeZ - z1) / dz;

    // Check if the intersection is within the segment
    if (t < 0 || t > 1) {
        return null; // Intersection is outside the segment
    }

    // Calculate the intersection point
    const intersection = {
        x: x1 + t * dx,
        y: y1 + t * dy,
        z: planeZ
    };

    return intersection;
}

three_dimentional.draw = function(){
    this.colorRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "rgb(78, 47, 142)");
    handlePoints();
}

var points = [{ x: 2, y: 2, z: 4 }, 
              { x: -2, y: 2, z: 4 }, 
              { x: -2, y: -2, z: 4 }, 
              { x: 2, y: -2, z: 4 },
              { x: 2, y: 2, z: 7 }, 
              { x: -2, y: 2, z: 7 }, 
              { x: -2, y: -2, z: 7 }, 
              { x: 2, y: -2, z: 7 }, 

              // top
              { x: 1, y: 2, z: 5 },
              { x: -1, y: 2, z: 5 },
              { x: 1, y: 2, z: 6 },
              { x: -1, y: 2, z: 6 },

              // bottom
              { x: 1, y: -2, z: 5 },
              { x: -1, y: -2, z: 5 },
              { x: 1, y: -2, z: 6 },
              { x: -1, y: -2, z: 6 },

              // left
              { x: -2, y: 0, z: 5 },
              { x: -2, y: 1, z: 5 },
              { x: -2, y: 0, z: 6 },
              { x: -2, y: 1, z: 6 },

               // right
               { x: 2, y: 0, z: 5 },
               { x: 2, y: 1, z: 5 },
               { x: 2, y: 0, z: 6 },
               { x: 2, y: 1, z: 6 },

               //middle
               { x: 1, y: 0, z: 5 },
               { x: -1, y: 0, z: 5 },
               { x: 1, y: 0, z: 6 },
               { x: -1, y: 0, z: 6 },
               { x: 1, y: 1, z: 5 },
               { x: -1, y: 1, z: 5 },
               { x: 1, y: 1, z: 6 },
               { x: -1, y: 1, z: 6 }
            ];


function handlePoints(){
    for (let i = 0; i < points.length; i++) {
        const dx1 = points[i].x;
        const dy1 = points[i].z - 5.5;
        const distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        const nextAngle1 = Math.atan2(dy1, dx1) + 0.003;

        points[i].x = distance1 * Math.cos(nextAngle1);
        points[i].z = 5.5 + distance1 * Math.sin(nextAngle1);

        // const dx2 = points[i].y;
        // const dy2 = points[i].z - 5.5;
        // const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        // const nextAngle2 = Math.atan2(dy2, dx2) + 0.005;

        // points[i].y = distance2 * Math.cos(nextAngle2);
        // points[i].z = 5.5 + distance2 * Math.sin(nextAngle2);

        // const dx3 = points[i].x;
        // const dy3 = points[i].y;
        // const distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

        // const nextAngle3 = Math.atan2(dy3, dx3) - 0.003;

        // points[i].x = distance3 * Math.cos(nextAngle3);
        // points[i].y = distance3 * Math.sin(nextAngle3);

        let intersection = getIntersectionWithZPlane(points[i], camera_origin);
        three_dimentional.colorCircle((intersection.x / WORLD_WIDTH * SCREEN_WIDTH) + SCREEN_WIDTH/2, 
                                      (-1 * intersection.y / WORLD_HEIGHT * SCREEN_HEIGHT) + SCREEN_HEIGHT/2, 0.5, "rgba(255,255,255,0.2)");
    }

    drawPointLineToPointLine(0, 1);
    drawPointLineToPointLine(1, 2);
    drawPointLineToPointLine(2, 3);
    drawPointLineToPointLine(3, 0);
    drawPointLineToPointLine(1, 5);
    drawPointLineToPointLine(2, 6);
    drawPointLineToPointLine(0, 4);
    drawPointLineToPointLine(3, 7);
    drawPointLineToPointLine(6, 7);
    drawPointLineToPointLine(5, 4);
    drawPointLineToPointLine(5, 6);
    drawPointLineToPointLine(4, 7);

    drawPointLineToPointLine(12, 14);
    drawPointLineToPointLine(14, 15);
    drawPointLineToPointLine(15, 13);
    drawPointLineToPointLine(13, 12);
    drawPointLineToPointLine(8, 10);
    drawPointLineToPointLine(10, 11);
    drawPointLineToPointLine(11, 9);
    drawPointLineToPointLine(9, 8);

    drawPointLineToPointLine(16, 17);
    drawPointLineToPointLine(17, 19);
    drawPointLineToPointLine(19, 18);
    drawPointLineToPointLine(18, 16);
    drawPointLineToPointLine(20, 21);
    drawPointLineToPointLine(21, 23);
    drawPointLineToPointLine(23, 22);
    drawPointLineToPointLine(22, 20);

    drawPointLineToPointLine(20, 24);
    drawPointLineToPointLine(28, 21);
    drawPointLineToPointLine(22, 26);
    drawPointLineToPointLine(30, 23);
    drawPointLineToPointLine(16, 25);
    drawPointLineToPointLine(18, 27);
    drawPointLineToPointLine(17, 29);
    drawPointLineToPointLine(19, 31);

    drawPointLineToPointLine(13, 25);
    drawPointLineToPointLine(12, 24);
    drawPointLineToPointLine(14, 26);
    drawPointLineToPointLine(15, 27);
    drawPointLineToPointLine(8, 28);
    drawPointLineToPointLine(9, 29);
    drawPointLineToPointLine(10, 30);
    drawPointLineToPointLine(11, 31);
}

function drawPointLineToPointLine(p1, p2){
    intersection1 = getIntersectionWithZPlane(points[p1], camera_origin);
    intersection2 = getIntersectionWithZPlane(points[p2], camera_origin);
    three_dimentional.drawLine((intersection1.x / WORLD_WIDTH * SCREEN_WIDTH) + SCREEN_WIDTH/2,(-1 * intersection1.y / WORLD_HEIGHT * SCREEN_HEIGHT) + SCREEN_HEIGHT/2,
                                (intersection2.x / WORLD_WIDTH * SCREEN_WIDTH) + SCREEN_WIDTH/2,(-1 * intersection2.y / WORLD_HEIGHT * SCREEN_HEIGHT) + SCREEN_HEIGHT/2,
                                1,"rgba(255,255,255,0.6)", "rgba(255,255,255,0.6)");
}