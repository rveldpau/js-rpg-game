var baseTravelMovement = 75 * (timeElapsed/1000);

if(input.isKeyPressed(16)){
    baseTravelMovement *= 2;
}

var moveIntent = new Intent();
moveIntent.intentId = "move";
moveIntent.x = 0;
moveIntent.y = 0;

if(input.isKeyPressed(39)){
    moveIntent.x += baseTravelMovement;
}

if(input.isKeyPressed(37)){
    moveIntent.x -= baseTravelMovement;
}

if(input.isKeyPressed(40)){
    moveIntent.y += baseTravelMovement;
}

if(input.isKeyPressed(38)){
    moveIntent.y -= baseTravelMovement;
}

world.character.addIntent(moveIntent);