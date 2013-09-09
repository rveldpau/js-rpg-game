
if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.input) == "undefined"){
    com.manatee.input = {
        _pressedKeys: {},
        _freshKeys: {},
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
            if(!com.manatee.input.isKeyPressed(keycode)){
                com.manatee.input._freshKeys[keycode] = true;
            }
            com.manatee.input._pressedKeys[keycode] = true;
            
        },
        isKeyPressed: function(keycode){
            return com.manatee.input._pressedKeys[keycode] == true;
        },
        wasKeyJustPressed: function(keycode){
            return com.manatee.input._freshKeys[keycode] == true;
        },
        processInputs: function(timeElapsed){
            
            if(com.manatee.dialog.isInDialog()){
                com.manatee.dialog.processInputs();
            }else{
                //console.log("Processing inputs: " + timeElapsed)
                com.manatee.input._processFunction(com.manatee.input,com.manatee.game.loop.world,timeElapsed);
            }
            com.manatee.input._freshKeys = {};
        }
    }
}

