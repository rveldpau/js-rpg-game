if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.camera) == "undefined"){
    com.manatee.camera = {
    }
}

function Camera() {
    this.id=null;
    this.location=new Point();
    var screenDim = com.manatee.config.getProperty(com.manatee.config.SCREEN_DIMENSIONS);
    this.frameWidth=screenDim.width;
    this.frameHeight=screenDim.height;
    this.scale=1.0;
    this.world=null;
    this._timeTotal = 0;
    this._renderCount = 0;
    
    this.viewPort = function(){
        var map = this.world.currentMap;
        var startX = Math.floor(this.location.x - this.frameWidth/2);
        if(startX<map.boundaries.left){
            startX = map.boundaries.left;
        }
        
        var startY = Math.floor(this.location.y - this.frameHeight/2);
        if(startY<map.boundaries.top){
            startY = map.boundaries.top;
        }
        
        var endX = startX + this.frameWidth;
        if(endX > map.boundaries.right){
            endX = map.boundaries.right;
            startX = map.boundaries.right - this.frameWidth;
        }
        var endY = startY + this.frameHeight;
        if(endY > map.boundaries.bottom){
            endY = map.boundaries.bottom;
            startY = map.boundaries.bottom - this.frameHeight;
        }
        
        var cameraBoundary = new Boundary();
        cameraBoundary.left = startX;
        cameraBoundary.top = startY;
        cameraBoundary.right = endX;
        cameraBoundary.bottom = endY;
        
        return cameraBoundary;
    }
    
    this.inView = function(){
        var map = this.world.currentMap;

        var cameraBoundary = this.viewPort();
        cameraBoundary.left -= map.tileSize;
        cameraBoundary.top -= map.tileSize;
        cameraBoundary.right += map.tileSize;
        cameraBoundary.bottom += map.tileSize;

        var objects = map.objectsIn(cameraBoundary);
        
        var curObj = null;
        for(var index=0;index<objects.length;index++){
            curObj = objects[index];
        }
        
        objects.push(this.world.character);
        
        return objects;
    }

}