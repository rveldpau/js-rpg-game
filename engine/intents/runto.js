var object = intent.object;
var to = intent.to==undefined?world.character:intent.to;
var xDiff = to.location.x - object.location.x;
var yDiff = to.location.y - object.location.y;

var stopTolerance = intent.stopTolerance == undefined ? 0 : intent.stopTolerance;
var startTolerance = intent.startTolerance == undefined ? 100 : intent.startTolerance;

var distance = object.location.distanceFrom(to.location);

if(distance > stopTolerance && distance < startTolerance){
    yDiff = yDiff / distance;
    xDiff = xDiff / distance;
    
    var moveIntent = new Intent("move");
    moveIntent.object = object;
    moveIntent.x = xDiff;
    moveIntent.y = yDiff;

    if(intent.speed!=undefined){
        moveIntent.x *= intent.speed;
        moveIntent.y *= intent.speed;
    }

    com.manatee.intents.addIntent(moveIntent);
}