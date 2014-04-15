importScripts("configuration.js","data.js","coords.js","collision.js","robject.js","map.js","world.js","intents.js","input.js","dialog.js","ai.js","camera.js")

console = {
    log: function(msg){
        postMessage({"action":"log","message":msg});
    }
}

if(typeof(com)==="undefined"){
    com = {};
}



if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.game) === "undefined"){
    com.manatee.game = {};
}

if(typeof(com.manatee.game.loop) === "undefined"){
    com.manatee.game.loop = {
        totalTimeElapsed: 0,
        lastRunTime: new Date(),
        totalFrames: -1,
        _pause:false,
        
        world: null,
        camera: null,
        initialize: function(baseUrl, worldLocation, screenWidth, screenHeight){
            console.log("Initialization started");
            com.manatee.config.onConfigChange = function(property,value){
                postMessage({"action":"config-change", "property":property, "value":value});
            };
            com.manatee.config.setProperty(com.manatee.config.BASEURL, baseUrl);
            com.manatee.config.setProperty(com.manatee.config.SCREEN_DIMENSIONS, {width:screenWidth,height:screenHeight});
            
            com.manatee.intents.initialize();
            
            var world = com.manatee.world.load(worldLocation);
            com.manatee.game.loop.world = world;

            console.log("World loaded")
            var camera = new Camera();
            com.manatee.game.loop.camera = camera;
            console.log("Camera created")
            camera.world = world
            camera.location = world.character.location;
            console.log("Locations set")
        },
        processInput: function(){
            
        },
        mainLoop: function(){
            var loopStartTime = new Date();;

            if(com.manatee.game.loop._pause){
                return;
            }

            var timeElapsed = loopStartTime - com.manatee.game.loop.lastRunTime;
            //console.log("Time elapsed: " + timeElapsed);

            if(com.manatee.dialog.isInDialog()){
                com.manatee.input.processInputs(timeElapsed);
                postMessage({"action":"dialog","dialog":com.manatee.dialog.getCurrentDialogDisplay()});
            }else{
                var objectsInView = com.manatee.game.loop.camera.inView();
                
                com.manatee.ai.processIntelligence(objectsInView, timeElapsed);
                
                com.manatee.input.processInputs(timeElapsed);
                
                com.manatee.intents.processAllIntents(timeElapsed);

                var cameraView = com.manatee.game.loop.camera.viewPort();
                postMessage({"action":"draw", "objects":JSON.stringify(objectsInView),
                    "screenLeft":cameraView.left, "screenTop": cameraView.top, 
                    "debugText":"Dialog?: " + com.manatee.dialog.isInDialog() + " FPS: " + 
                        Math.round(
                            com.manatee.game.loop.totalFrames /
                                (com.manatee.game.loop.totalTimeElapsed/1000)
                        )
                });
                
                com.manatee.game.loop.totalTimeElapsed += timeElapsed;
                com.manatee.game.loop.totalFrames++;
            }
            com.manatee.game.loop.lastRunTime = loopStartTime;
            
        }
    };
}

onmessage = function(event){
    switch(event.data.action){
        case "start":
            com.manatee.game.loop.initialize(event.data.baseUrl, event.data.worldLocation, event.data.screenWidth, event.data.screenHeight);
            setTimeout(com.manatee.game.loop.mainLoop,100);
            break;
        case "complete":
            if(event.data.completed=="draw"||event.data.completed=="dialog"){
                com.manatee.game.loop.mainLoop();
            }
            break;
        case "config-change":
            console.log("Configuration changed from UI")
            com.manatee.config.setProperty(event.data.property, event.data.value);
            break;
        case "keydown":
            com.manatee.input.keydown(event.data.keycode);
            break;
        case "keyup":
            com.manatee.input.keyup(event.data.keycode);
            break;
        case "pause":
            com.manatee.game.loop._pause = true;
            break;
        case "resume":
            com.manatee.game.loop._pause = false;
            com.manatee.game.loop.lastRunTime = new Date();
            com.manatee.game.loop.mainLoop();
            break;
    }
}

