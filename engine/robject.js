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
        var collidesWithThis = collisionDetection(this,otherObject);
        return collidesWithThis?true:otherObject.collisionDetection(otherObject, this);
    }
    this.location=new Point();
    this.spriteOffset=new Point();
}