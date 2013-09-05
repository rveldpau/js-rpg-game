var startingLocation = new Point();
startingLocation.x = object.location.x;
startingLocation.y = object.location.y;

object.location.x += intent.x;
object.location.y += intent.y;

var potentialCollisionBoundaries = new Boundary();
potentialCollisionBoundaries.left = object.location.x-100;
potentialCollisionBoundaries.top = object.location.y-100;
potentialCollisionBoundaries.right = object.location.x+100;
potentialCollisionBoundaries.bottom = object.location.y+100;

var potentialCollisionObjects = world.currentMap.objectsIn(potentialCollisionBoundaries);

var canMove = true;
var collidedObjects = [];

potentialCollisionObjects.forEach(function(potentialObject){
    if(object.collidesWith(potentialObject)){
        //If there is a collision do nothing...
        //console.log("Can't move, i collided with...");
        //console.log(JSON.stringify(potentialObject));
        canMove = false;
        collidedObjects.push(potentialObject);
        //Return true finishes the loop
    }
})


//Must set X and Y rather than replace the location object, this ensures that 
//the camera continues to follow (camera shares the same location object)
if(collidedObjects.length!=0){
    object.location.x = startingLocation.x;
    object.location.y = startingLocation.y;
}else{
    
    //object.location.x -= intent.x;
    //object.location.y -= intent.y;
}
