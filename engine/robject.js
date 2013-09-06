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
    //onCollision should be defined as a function that takes in
    //the object the collision occured with. It should match the definition
    //    function(impacted){...}
    this.onCollision = undefined;
    this.onInteract = undefined;
    
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
}