if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.intents) == "undefined"){
    com.manatee.intents = {
        _intentProcessors: {},
        _currentIntents:[],
        load: function(intentId, intentLocation){
            var scriptText = com.manatee.data.loadText(intentLocation);
            var functionText = "com.manatee.intents._intentProcessors['" + intentId + "']"
             + "= function(intent, world){\n"+scriptText+"\n}";
            console.log("Intent function: " + functionText);
            eval(functionText);
        },
        initialize: function(){
            com.manatee.intents.load("move", "engine/intents/move.js");
            com.manatee.intents.load("interact", "engine/intents/interact.js");
        },
        registerIntentProcessor: function(id, processorFunction){
            com.manatee.intents._intentProcessors[id] = processorFunction;
        },
        getIntentProcessor:function(id){
            return com.manatee.intents._intentProcessors[id];
        },
        processIntent: function(intent){
            //console.log("Processing Intent: " + JSON.stringify(intent) + " for " + JSON.stringify(object))
            var intentProcessor = com.manatee.intents._intentProcessors[intent.intentId];
            intentProcessor(intent,com.manatee.game.loop.world);
        },
        addIntent: function(intent){
            com.manatee.intents._currentIntents.push(intent);
        },
        processAllIntents: function(){
            var intent = null;
            for(var i=0;i<com.manatee.intents._currentIntents.length;i++){
                com.manatee.intents.processIntent(com.manatee.intents._currentIntents[i]);
            }
            com.manatee.intents._currentIntents.length=0;
        }
        
    }
}

function Intent() {
    this.intentId=null;
    this.object=null;
}
