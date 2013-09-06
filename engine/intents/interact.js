var object = intent.object;


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
            
            if(object.onCollision!=undefined){
                object.onCollision(potentialObject);
            }
            if(potentialObject.onCollision!=undefined){
                potentialObject.onCollision(object);
            }
        }
    })
    
    if(!canMove){
        object.location[axis] = startingLocation[axis];
    }
})

