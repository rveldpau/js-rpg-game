importScripts('graphics.js')

if (typeof (com.manatee.graphics.effects) === "undefined") {
    com.manatee.graphics.effects = {
        _effects:{},
        registerEffect: function(name,effectFunction){
            com.manatee.graphics.effects._effects[name] = effectFunction;
        },
        applyEffect: function(name, context){
            var effect = com.manatee.graphics.effects._effects[name];
            if(effect===undefined){
                return;
            }
            effect(context);
        }
    }
}