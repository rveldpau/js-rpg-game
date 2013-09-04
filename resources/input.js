var baseTravelMovement = 75 * (timeElapsed/1000);

if(input.isKeyPressed(16)){
    baseTravelMovement *= 2;
}

if(input.isKeyPressed(39)){
    world.character.location.x += baseTravelMovement;
}

if(input.isKeyPressed(37)){
    world.character.location.x -= baseTravelMovement;
}

if(input.isKeyPressed(40)){
    world.character.location.y += baseTravelMovement;
}

if(input.isKeyPressed(38)){
    world.character.location.y -= baseTravelMovement;
}

