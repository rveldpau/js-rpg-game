var startingLocation = new Point();
startingLocation.x = object.location.x;
startingLocation.y = object.location.y;

var potentialCollisionBoundaries = new Boundary();
potentialCollisionBoundaries.left = object.location.x+-100;
potentialCollisionBoundaries.top = object.location.y-100;
potentialCollisionBoundaries.right = object.location.x+100;
potentialCollisionBoundaries.bottom = object.location.y+100;

var potentialCollisionObjects = world.currentMap.objectsIn(potentialCollisionBoundaries);

var collidedObjects = [];

var axis = ["x","y"];

axis.forEach(function(axis){
    //Must set location axis rather than replace the location object, this ensures that 
    //the camera continues to follow (camera shares the same location object)
    object.location[axis] += intent[axis];
    var canMove = true;
    
    potentialCollisionObjects.forEach(function(potentialObject){
        if(object.collidesWith(potentialObject)){
            canMove = false;
            
            if(object.onCollide!=undefined){
                object.onCollide(object);
            }
            if(potentialObject.onCollide!=undefined){
                potentialObject.onCollide(object);
            }
        }
    })
    
    if(!canMove){
        object.location[axis] = startingLocation[axis];
    }
})

