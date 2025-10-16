function Vector(x,y){
	this.x = x;
	this.y = y;

	this.add = function(vec){
		this.x += vec.x;
		this.y += vec.y;
	}

	this.sub = function(vec){
		this.x -= vec.x;
		this.y -= vec.y;
	}

	this.mult = function(vec){
		this.x *= vec.x;
		this.y *= vec.y;
	}

	this.div = function(vec){
		this.x /= vec.x;
		this.y /= vec.y;
	}
}

function limit(vec, limit){
	if(vec.x < -limit){
		vec.x = -limit;
	}
	if(vec.x > limit){
		vec.x = limit;
	}
	if(vec.y < -limit){
		vec.y = -limit;
	}
	if(vec.y > limit){
		vec.y = limit;
	}
}

function Rectangle(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

    this.contains = function(point){
        if(point.pos.x >= this.x - this.w && 
            point.pos.x <= this.x + this.w &&
            point.pos.y >= this.y - this.h &&
            point.pos.y <= this.y + this.h){
             return true;
        }
        return false;

    }

    this.intersects = function(range){
		if(range.x - range.w > this.x + this.w ||
			range.x + range.w < this.x - this.w ||
			range.y - range.h > this.y + this.h ||
			range.y + range.h < this.y - this.h){
			return false;
		}
		return true;
	}

	this.circle_Intersection = function(circle){
		let rect_x = this.x - this.w;
		let rect_y = this.y - this.h;
		let rect_w = this.w*2;
		let rect_h = this.h*2;

		let nearest_X = Math.max(rect_x, Math.min(circle.x, rect_x + rect_w));
		let nearest_Y = Math.max(rect_y, Math.min(circle.y, rect_y + rect_h));

		let delta_X = circle.x - Math.max(rect_x, Math.min(circle.x, rect_x + rect_w));
		let delta_Y = circle.y - Math.max(rect_y, Math.min(circle.y, rect_y + rect_h));
		return (delta_X * delta_X + delta_Y * delta_Y) < (circle.r * circle.r);
	}


}


function Circle(x,y,r){
	this.x = x;
	this.y = y;
	this.r = r;

	this.contains = function(point){
		let d = dist(point.pos.x,point.pos.y,this.x,this.y)
        if(d < this.r){
             return true;
        }
        return false;
    }
}

