importScripts("logger.js", "configuration.js", "world.js", "graphics.js", "spriteset.js", "battle.js", "effects.js", "fx/wave.js")

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.game) === "undefined") {
    com.manatee.game = (function() {
        var LOG = new Logger("game-ui");
        var game = {};
        game.loop = null;

        game.getWorld = function() {
            return loop.getWorld();
        }
        game.initialize = function(worldLocation) {

            var screenWidth = 800;
            var screenHeight = 600;
            com.manatee.graphics.createScreen(screenWidth, screenHeight);

            game.loop = new Worker(com.manatee._engineBase + "game_loop.js");
            game.loop.onmessage = _handleLoopMessage;

            $('body').keydown(function(ev) {
                game.loop.postMessage({"action": "keydown", "keycode": ev.keyCode})
                return false;
            });
            $('body').keyup(function(ev) {
                game.loop.postMessage({"action": "keyup", "keycode": ev.keyCode})
                return false;
            });

            $(window).focus(function() {
                game.loop.postMessage({"action": "resume"})
                document.title = document.title.replace(" - Paused", "")
            })

            $(window).blur(function() {
                game.loop.postMessage({"action": "pause"})
                if (document.title.indexOf("Paused") == -1) {
                    document.title = document.title + " - Paused"
                }
            })

            game.loop.postMessage({"action": "start",
                "baseUrl": document.location.href,
                "worldLocation": worldLocation,
                "screenHeight": screenHeight,
                "screenWidth": screenWidth})

            LOG.write("Initialized")
        };
        game.postMessage = function(msgProperties) {
            game.loop.postMessage(msgProperties);
        }
        var _handleLoopMessage = function(event) {
            var data = event.data;
            switch (data.action) {
                case "log":
                    console.log("backend: " + data.message);
                    break;
                case "load":
                    if (data.type === "spriteset") {
                        com.manatee.spritesets.load(data.location)
                    }
                    break;
                case "draw":
                    if (data.mode === "world") {
                        com.manatee.graphics.drawAll(data.mode, data.screenTop, data.screenLeft, JSON.parse(data.objects), data.debugText);
                    } else if (data.mode === "battle") {
                        com.manatee.graphics.drawAll(data.mode, 0, 0, JSON.parse(data.objects), data.debugText);
                    }

                    com.manatee.graphics.showDialog(data.dialog);
                    break;
                case "battle":
                    //com.manatee.graphics.showBattle(data.battle);
                    break;
                case "dialog":
                    //com.manatee.graphics.showDialog(data.dialog);
                    break;
                case "config-change":
                    LOG.write("Config updated from loop");
                    com.manatee.config.setProperty(data.property, data.value);
                    break;
                case "ready":
                    $("#loading").css({'display': 'none'});
                    break;
                case "logging":
                    if (event.data.toAdd) {
                        com.manatee.logging.enable(event.data.name);
                    } else {
                        com.manatee.logging.disable(event.data.name);
                    }
                    break;
            }
            game.loop.postMessage({"action": "complete", "completed": data.action})
        }

        return game;
    })()
}