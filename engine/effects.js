importScripts('graphics.js')

if (typeof (com.manatee.graphics.effects) === "undefined") {
    com.manatee.graphics.effects = (function(){
        var effects = {};
        registeredEffects={};
        effects.registerEffect = function(name,effectFunction){
            registeredEffects[name] = effectFunction;
        }
        effects.applyEffect = function(name, context){
            var effect = registeredEffects[name];
            if(effect===undefined){
                return;
            }
            effect(context);
        }
        return effects;
    })();
}