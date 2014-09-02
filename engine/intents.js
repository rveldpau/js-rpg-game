importScripts('data.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.intents) === "undefined") {
    com.manatee.intents = (function() {
        var LOG = new Logger("intents");
        var intents = {};
        var _intentProcessors = {};
        var _currentIntents = [];
        intents.load = function(intentId, intentLocation) {
            var scriptText = com.manatee.data.loadText(intentLocation);
            var functionText = "(function(){"
                    + "return function(intent, world, timeElapsed){\n" + scriptText + "\n}})()";
            _intentProcessors[intentId] = eval(functionText);
        }
        intents.initialize = function() {
            intents.load("move", "/engine/intents/move.js");
            intents.load("interact", "/engine/intents/interact.js");
            intents.load("talk", "/engine/intents/talkTo.js");
            intents.load("runaway", "/engine/intents/runaway.js");
            intents.load("runto", "/engine/intents/runto.js");
        }
        intents.registerIntentProcessor = function(id, processorFunction) {
            _intentProcessors[id] = processorFunction;
        }
        intents.getIntentProcessor = function(id) {
            return _intentProcessors[id];
        }
        intents.processIntent = function(intent, world, timeElapsed) {
            LOG.write("Processing Intent: " + JSON.stringify(intent));
            var intentProcessor = _intentProcessors[intent.intentId];
            intentProcessor(intent, world, timeElapsed);
        }
        intents.addIntent = function(intent) {
            _currentIntents.push(intent);
        }
        intents.processAllIntents = function(world, timeElapsed) {
            for (var i = 0; i < _currentIntents.length; i++) {
                intents.processIntent(_currentIntents[i], world, timeElapsed);
            }
            _currentIntents.length = 0;
        }
        return intents;
    }
    )()
}

function Intent(intentId) {
    this.intentId = intentId == undefined ? null : intentId;
    this.object = null;
}
