var baseTravelMovement = 75 * (timeElapsed/1000);
var object = intent.object;

var startingLocation = new Point();
startingLocation.x = object.location.x;
startingLocation.y = object.location.y;

var objectBoundaries = object.getCurrentBounds();

var potentialCollisionBoundaries = new Boundary();
potentialCollisionBoundaries.left = objectBoundaries.left-(baseTravelMovement*4);
potentialCollisionBoundaries.top = objectBoundaries.top-(baseTravelMovement*4);
potentialCollisionBoundaries.right = objectBoundaries.right+(baseTravelMovement*4);
potentialCollisionBoundaries.bottom = objectBoundaries.bottom+(baseTravelMovement*4);
potentialCollisionBoundaries.layer = object.location.layer;

var potentialCollisionObjects = world.currentMap.objectsIn(potentialCollisionBoundaries);

var axis = ["x","y"];

var logEnabled = false;

axis.forEach(function(axis){
    //Must set location axis rather than replace the location object, this ensures that 
    //the camera continues to follow (camera shares the same location object)
    
    if(intent[axis]!=undefined){
    
        object.location[axis] += intent[axis] * baseTravelMovement;
        
        var canMove = true;

        potentialCollisionObjects.forEach(function(potentialObject){
            if(object!=potentialObject){
                if(object.collidesWith(potentialObject)){
                    canMove = false;

                    if(object.onCollision!=undefined){
                        object.onCollision(potentialObject);
                    }
                    if(potentialObject.onCollision!=undefined){
                        potentialObject.onCollision(object);
                    }
                }
            }
        })

        if(!canMove){
            object.location[axis] = startingLocation[axis];
        }
    }
})

world.currentMap.rezone(object);
