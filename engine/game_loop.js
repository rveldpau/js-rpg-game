console.realLog = console.log;
console = {
    log: function(msg) {
        try{
            postMessage({"action": "log", "message": msg});
        }catch(ex){
            postMessage({"action": "log", "message": "Failed to post message because " + ex.message});
            postMessage({"action": "log", "message": ex.stack});
        }
    }
}

importScripts("logger.js", "configuration.js", "data.js", "coords.js", "collision.js", "battle.js", "robject.js", "map.js", "world.js", "intents.js", "input.js", "dialog.js", "ai.js", "camera.js")

if (typeof (com) === "undefined") {
    com = {};
}



if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.game) === "undefined") {
    com.manatee.game = {};
}

if (typeof (com.manatee.game.loop) === "undefined") {
    com.manatee.game.loop = (function() {
        var LOG = new Logger("game-loop");
        var loop = {};
        var totalTimeElapsed = 0;
        var lastRunTime = new Date();
        var totalFrames = -1;
        var _pause = false;
        var world = null;
        var camera = null;
        var ready = false;
        loop.getWorld = function() {
            return world;
        };
        loop.initialize = function(baseUrl, worldLocation, screenWidth, screenHeight) {

            LOG.write("Initialization started");
            com.manatee.config.onConfigChange = function(property, value) {
                postMessage({"action": "config-change", "property": property, "value": value});
            };
            com.manatee.config.setProperty(com.manatee.config.BASEURL, baseUrl);
            com.manatee.config.setProperty(com.manatee.config.SCREEN_DIMENSIONS, {width: screenWidth, height: screenHeight});

            com.manatee.intents.initialize();

            world = com.manatee.world.load(worldLocation);

            LOG.write("World loaded")
            camera = new Camera(world);
            LOG.write("Camera created")
            camera.location = world.character.location;
            LOG.write("Locations set")
        }
        loop.processInput = function() {

        }

        loop.postMessage = function(properties) {
            postMessage(properties);
        }
        var mainLoop = function() {
            if (!ready) {
                LOG.write("Waiting til ready...");
                return;
            }
            try {
                var loopStartTime = new Date();
                ;

                if (_pause) {
                    return;
                }

                var timeElapsed = loopStartTime - lastRunTime;
                //LOG.write("Time elapsed: " + timeElapsed);

                if (com.manatee.battle.isInBattle()) {
                    com.manatee.input.processInputs(timeElapsed);
                    com.manatee.battle.process();
                    if (!com.manatee.battle.isInBattle()) {
                        return mainLoop();
                    }
                    //LOG.write("Getting battle display" + com.manatee.battle.getCurrentBattleDisplay);
                    postMessage({"action": "draw", "mode": "battle",
                        "dialog": com.manatee.dialog.getCurrentDialogDisplay(),
                        "objects": JSON.stringify(com.manatee.battle.getCurrentBattleDisplay()),
                        "debugText": "Dialog?: " + com.manatee.dialog.isInDialog() + " FPS: " +
                                Math.round(
                                        totalFrames /
                                        (totalTimeElapsed / 1000)
                                        )
                    });
                    totalTimeElapsed += timeElapsed;
                    totalFrames++;
                } else {
                    var objectsInView = camera.inView();
                    //Reset all dynamic images
                    objectsInView.forEach(function(obj) {
                        if (obj.sprite.base !== undefined) {
                            obj.sprite.id = obj.sprite.id.replace("walk", "stand");
                            obj.sprite.id = obj.sprite.id.replace("run", "stand");
                        }
                    });
                    com.manatee.ai.processIntelligence(objectsInView, timeElapsed);

                    com.manatee.input.processInputs(world, timeElapsed);

                    com.manatee.intents.processAllIntents(world, timeElapsed);

                    var cameraView = camera.viewPort();
                    postMessage({"action": "draw", "mode": "world",
                        "dialog": com.manatee.dialog.getCurrentDialogDisplay(),
                        "objects": JSON.stringify(objectsInView),
                        "screenLeft": cameraView.left, "screenTop": cameraView.top,
                        "debugText": "Dialog?: " + com.manatee.dialog.isInDialog() + " FPS: " +
                                Math.round(
                                        totalFrames /
                                        (totalTimeElapsed / 1000)
                                        )
                    });

                    totalTimeElapsed += timeElapsed;
                    totalFrames++;
                }
                lastRunTime = loopStartTime;
            } catch (ex) {
                console.log(ex.stack);
                throw ex;
            }
        }

        onmessage = function(event) {
            switch (event.data.action) {
                case "start":
                    loop.initialize(event.data.baseUrl, event.data.worldLocation, event.data.screenWidth, event.data.screenHeight);
                    setTimeout(mainLoop, 100);
                    break;
                case "complete":
                    switch (event.data.completed) {
                        case "draw":
                        case "dialog":
                        case "battle":
                            mainLoop();
                            break;
                        case "spritesets-load":
                            LOG.write("Sprite set is loaded!!!");
                            ready = true;
                            postMessage({"action": "ready"});
                            mainLoop();
                            break;
                    }
                    break;
                case "config-change":
                    LOG.write("Configuration changed from UI")
                    com.manatee.config.setProperty(event.data.property, event.data.value);
                    break;
                case "keydown":
                    com.manatee.input.keydown(event.data.keycode);
                    break;
                case "keyup":
                    com.manatee.input.keyup(event.data.keycode);
                    break;
                case "pause":
                    _pause = true;
                    break;
                case "resume":
                    _pause = false;
                    lastRunTime = new Date();
                    mainLoop();
                    break;
                case "logging":
                    if (event.data.toAdd) {
                        com.manatee.logging.enable(event.data.name);
                    } else {
                        com.manatee.logging.disable(event.data.name);
                    }
                    break;
            }
        }
        return loop;
    })()
}



