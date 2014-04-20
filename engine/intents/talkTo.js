var object = intent.object;

var potentialCollisionBoundaries = new Boundary();
potentialCollisionBoundaries.left = object.location.x + object.boundingBox.left;
potentialCollisionBoundaries.top = object.location.y + object.boundingBox.top;
potentialCollisionBoundaries.right = object.location.x + object.boundingBox.right;
potentialCollisionBoundaries.bottom = object.location.y + object.boundingBox.bottom;
potentialCollisionBoundaries.layer = object.location.layer;

var tolerance = world.currentMap.tileSize;

if(object.lastDirection.indexOf("s") != -1){
    potentialCollisionBoundaries.bottom += tolerance; 
}else if(object.lastDirection.indexOf("n") != -1){
    potentialCollisionBoundaries.top -= tolerance; 
}
if(object.lastDirection.indexOf("e") != -1){
    potentialCollisionBoundaries.right += tolerance; 
}else if(object.lastDirection.indexOf("w") != -1){
    potentialCollisionBoundaries.left -= tolerance; 
}

var talked = false;
var potentialInteractionObjects = world.currentMap.objectsIn(potentialCollisionBoundaries);
potentialInteractionObjects.some(function(potentialObject){
    if(potentialObject.onTalk!==undefined){
        potentialObject.onTalk(object, potentialObject);
        talked = true;
    }
})

if(!talked){
    com.manatee.dialog.prompt("There's nothing to talk to...");
}