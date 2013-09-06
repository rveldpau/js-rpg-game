var baseTravelMovement = 75 * (timeElapsed/1000);

var moveRequired = false;
var moveIntent = new Intent();

moveIntent.intentId = "move";
moveIntent.object = world.character;
moveIntent.x = 0;
moveIntent.y = 0;
moveIntent.fast = false;
moveIntent.direction = "";


if(input.isKeyPressed(16)){
    baseTravelMovement *= 2;
    moveIntent.fast = true;
}

if(input.isKeyPressed(40)){
    moveIntent.y += baseTravelMovement;
    moveRequired = true;
    moveIntent.direction += "s"
}else if(input.isKeyPressed(38)){
    moveIntent.y -= baseTravelMovement;
    moveRequired = true;
    moveIntent.direction += "n"
}

if(input.isKeyPressed(39)){
    moveIntent.x += baseTravelMovement;
    moveRequired = true;
    moveIntent.direction += "e"
}else if(input.isKeyPressed(37)){
    moveIntent.x -= baseTravelMovement;
    moveRequired = true;
    moveIntent.direction += "w"
}



var motion = "stand";

if(moveRequired){
    var motion = moveIntent.fast?"run":"walk";    
    com.manatee.intents.addIntent(moveIntent);
}else{
    moveIntent.direction = world.character.lastDirection;
}

world.character.sprite.id = "ness-" + motion + "-" + moveIntent.direction;
world.character.lastDirection = moveIntent.direction;

if(input.wasKeyJustPressed(32)){
    var interactIntent = new Intent();
    interactIntent.intentId = "interact";
    interactIntent.object = world.character;
    com.manatee.intents.addIntent(interactIntent);
}  