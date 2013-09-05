if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.intents) == "undefined"){
    com.manatee.intents = {
        _intentProcessors: {},
        load: function(intentId, intentLocation){
            var scriptText = com.manatee.data.loadText(intentLocation);
            var functionText = "com.manatee.intents._intentProcessors['" + intentId + "'] = function(object ,intent, world){\n"+scriptText+"\n}";
            console.log("Intent function: " + functionText);
            eval(functionText);
        },
        initialize: function(){
            com.manatee.intents.load("move", "engine/intents/move.js");
        },
        registerIntentProcessor: function(id, processorFunction){
            com.manatee.intents._intentProcessors[id] = processorFunction;
        },
        getIntentProcessor:function(id){
            return com.manatee.intents._intentProcessors[id];
        },
        processIntent: function(object, intent){
            var intentProcessor = com.manatee.intents._intentProcessors[intent.intentId];
            intentProcessor(object, intent);
        },
        processAllIntents: function(objects){
            objects.forEach(function(object){
                object.intents.forEach(function(intent){
                    com.manatee.intents.processIntent(object, intent);
                })
                object.clearIntents();
            })
        }
        
    }
}

function Intent() {
    this.intentId=null;
}
