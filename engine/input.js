importScripts('data.js')

if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.input) === "undefined"){
    com.manatee.input = (function(){
        var LOG = new Logger("input");
        var input = {};
        var _pressedKeys = {};
        var _freshKeys = {};
        var _processFunction = function(input, world, timeElapsed){};
        input.load = function(inputScriptLocation){
            LOG.write("Loading input script");
            var scriptText = com.manatee.data.loadText(inputScriptLocation);
            var functionText = "(function(){var inputScript = function(input, world, timeElapsed){\n"+scriptText+"\n}; return inputScript;})()";
            LOG.write("Input function: " + functionText);
            _processFunction = eval(functionText);
        }
        input.keyup = function(keycode){
            _pressedKeys[keycode] = false;
        }
        input.keydown = function(keycode){
            if(!input.isKeyPressed(keycode)){
                _freshKeys[keycode] = true;
            }
            _pressedKeys[keycode] = true;
            
        }
        input.isKeyPressed = function(keycode){
            return _pressedKeys[keycode] == true;
        }
        input.wasKeyJustPressed = function(keycode){
            return _freshKeys[keycode] == true;
        },
        input.processInputs = function(world,timeElapsed){
            
            if(com.manatee.dialog.isInDialog()){
                com.manatee.dialog.processInputs();
            }else if(com.manatee.battle.isInBattle()){
                com.manatee.battle.processInputs();
            }else{
                //LOG.write("Processing inputs: " + timeElapsed)
                _processFunction(input,world,timeElapsed);
            }
            _freshKeys = {};
        }
        return input;
    })();
}

