function QuadTree(boundary,capacity,depth){
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
        this.depth = depth || 0;

    this.subDivide = function(){
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Rectangle(x - w/2,y - h/2,w/2,h/2)
        this.northWest = new QuadTree(nw,this.capacity,this.depth+1);
        let ne = new Rectangle(x + w/2,y - h/2,w/2,h/2)
        this.northEast = new QuadTree(ne,this.capacity,this.depth+1);
        let sw = new Rectangle(x - w/2,y + h/2,w/2,h/2)
        this.southWest = new QuadTree(sw,this.capacity,this.depth+1);
        let se = new Rectangle(x + w/2,y + h/2,w/2,h/2)
        this.southEast = new QuadTree(se,this.capacity,this.depth+1);  

        this.divided = true;
    }

    this.insert = function(point){
        if(this.boundary.contains(point) == false || this.depth > 8){
            return;
        }

        if(this.points.length < this.capacity){
            this.points.push(point)
            
        }else{
            if(this.divided == false){
                this.subDivide();
            }
            this.northEast.insert(point);
            this.northWest.insert(point);
            this.southEast.insert(point);
            this.southWest.insert(point);
        }
    }

    this.show = function(){

        canvasContext.beginPath();
        canvasContext.strokeStyle = "white";
        canvasContext.rect(boundary.x-boundary.w, boundary.y-boundary.h, boundary.w*2, boundary.h*2);
        canvasContext.stroke();

            for (var i = 0; i < this.points.length; i++) {
                if(this.divided){
                    this.northEast.show();
                    this.northWest.show();
                    this.southEast.show();
                    this.southWest.show(); 
                }
            }
    }

    this.query = function(range, found){
        if(this.boundary.circle_Intersection(range) == false){
            return found;
        }else{
            for (var i = 0; i < this.points.length; i++) {
                if(range.contains(this.points[i]) == true){
                    found.push(this.points[i])
                }  
            }

            if(this.divided == true){
                this.northWest.query(range, found);
                this.northEast.query(range, found);
                this.southWest.query(range, found);
                this.southEast.query(range, found);
            }

            return found;

        }
    }
}


