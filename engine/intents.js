importScripts('data.js')

if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.intents) === "undefined"){
    com.manatee.intents = {
        _intentProcessors: {},
        _currentIntents:[],
        load: function(intentId, intentLocation){
            var scriptText = com.manatee.data.loadText(intentLocation);
            var functionText = "com.manatee.intents._intentProcessors['" + intentId + "']"
             + "= function(intent, world, timeElapsed){\n"+scriptText+"\n}";
            eval(functionText);
        },
        initialize: function(){
            com.manatee.intents.load("move", "engine/intents/move.js");
            com.manatee.intents.load("interact", "engine/intents/interact.js");
            com.manatee.intents.load("talk", "engine/intents/talkTo.js");
            com.manatee.intents.load("runaway", "engine/intents/runaway.js");
            com.manatee.intents.load("runto", "engine/intents/runto.js");
        },
        registerIntentProcessor: function(id, processorFunction){
            com.manatee.intents._intentProcessors[id] = processorFunction;
        },
        getIntentProcessor:function(id){
            return com.manatee.intents._intentProcessors[id];
        },
        processIntent: function(intent, timeElapsed){
            //console.log("Processing Intent: " + JSON.stringify(intent) + " for " + JSON.stringify(object))
            var intentProcessor = com.manatee.intents._intentProcessors[intent.intentId];
            intentProcessor(intent,com.manatee.game.loop.world,timeElapsed);
        },
        addIntent: function(intent){
            com.manatee.intents._currentIntents.push(intent);
        },
        processAllIntents: function(timeElapsed){
            var intent = null;
            for(var i=0;i<com.manatee.intents._currentIntents.length;i++){
                com.manatee.intents.processIntent(com.manatee.intents._currentIntents[i],timeElapsed);
            }
            com.manatee.intents._currentIntents.length=0;
        }
        
    }
}

function Intent(intentId) {
    this.intentId=intentId==undefined?null:intentId;
    this.object=null;
}
