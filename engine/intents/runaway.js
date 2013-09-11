var object = intent.object;
var from = intent.from==undefined?world.character:intent.from;
var xDiff = object.location.x - from.location.x;
var yDiff = object.location.y - from.location.y;

var tolerance = intent.tolerance == undefined ? 100 : intent.tolerance;

var distance = object.location.distanceFrom(from.location);

if(distance<tolerance){
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