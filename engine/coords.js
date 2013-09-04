function Point(){
    this.x = 0;
    this.y = 0;
    this.layer = 0;
    
    this.isIn = function(boundary){
        return boundary.contains(this);
    }
}

function Boundary(){
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.layer = null;
    
    this.contains = function(obj){
        if(this.layer!=null && obj.layer!=null){
            if(this.layer!=obj.layer){
                return false;
            }
        }
        
        if(obj.left!=undefined){
            return this._containsBoundary(obj);
        }else if(obj.x!=undefined){
            return this._containsPoint(obj);
        }
        
        
    }
    
    this._containsBoundary = function(boundary){
        
        var xOverlap = this._valueInRange(boundary.left, this.left, this.right) ||
                    this._valueInRange(this.left, boundary.left, boundary.right);

        var yOverlap = this._valueInRange(boundary.top, this.top, this.bottom) ||
                    this._valueInRange(this.top, boundary.top, boundary.bottom);
        
        
        return xOverlap && yOverlap;
    }
    
    this._containsPoint = function(point){
        return point.x >= this.left && point.x <= this.right &&
            point.y >= this.top && point.y <= this.bottom;
    }
    
    this.topLeft = function(){
        return this._makePoint(this.left, this.top, this.layer);
    }
    
    this.bottomRight = function(){
        return this._makePoint(this.right, this.bottom, this.layer);
    }
    
    this._makePoints=function(){
        return [
            this.topLeft(),
            this._makePoint(this.left, this.bottom, this.layer),
            this._makePoint(this.right, this.top, this.layer),
            this.bottomRight()
        ];
        
    }
    
    this._makePoint = function(x,y,layer){
        var point = new Point();
        point.x = x;
        point.y = y;
        point.layer = layer;
        return point;
    }
    
    this._valueInRange = function(value,min,max){
        return (value >= min) && (value <= max); 
    }
}

