if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.robject) == "undefined"){
    com.manatee.robject = {
    }
}

function Robject() {
    this.id=null;
    this.sprite=null;
    this.collisionDetection=com.manatee.collision.never;
    this.collidesWith=function(otherObject){
        var collidesWithThis = this.collisionDetection(this,otherObject);
        return collidesWithThis?true:otherObject.collisionDetection(otherObject, this);
    }
    this.location=new Point();
    this.spriteOffset=new Point();
    
    this.boundingBox=new Boundary();
    this.getCurrentBounds = function(){
        var currentBounds = new Boundary();
        currentBounds.top = this.location.y + this.boundingBox.top;
        currentBounds.left = this.location.x + this.boundingBox.left;
        currentBounds.bottom = this.location.y + this.boundingBox.bottom;
        currentBounds.right = this.location.x + this.boundingBox.right;
        currentBounds.layer = this.location.layer;
        return currentBounds;
    }
    
    this.intents=[];
    this.clearIntents = function(){
        this.intents.length = 0;
    };
    this.addIntent = function(intent){
        this.intents.push(intent);
    }
}