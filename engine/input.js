
if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.input) == "undefined"){
    com.manatee.input = {
        _pressedKeys: {},
        _processFunction: function(input, world, timeElapsed){},
        load: function(inputScriptLocation){
            var scriptText = com.manatee.data.loadText(inputScriptLocation);
            var functionText = "com.manatee.input._processFunction = function(input, world, timeElapsed){\n"+scriptText+"\n}";
            console.log("Input function: " + functionText);
            eval(functionText);
        },
        keyup: function(keycode){
            com.manatee.input._pressedKeys[keycode] = false;
        },
        keydown: function(keycode){
            com.manatee.input._pressedKeys[keycode] = true;
        },
        isKeyPressed: function(keycode){
            return com.manatee.input._pressedKeys[keycode] == true;
        },
        processInputs: function(timeElapsed){
            com.manatee.input._processFunction(com.manatee.input,com.manatee.game.loop.world,timeElapsed);
        }
    }
}

