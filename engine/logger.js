if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.logging) === "undefined") {
    com.manatee.logging = (function(){
        var logging = {};
        
        var enabledLoggers = [];
        
        logging.enable = function(name){
            if(!logging.isEnabledFor(name)){
                enabledLoggers.push(name);
                com.manatee.game.loop.postMessage({"action":"logging","toAdd":"true","name":name});
                console.log("Logging is enabled for " + name);
            }
            
        }
        
        logging.isEnabledFor = function(name){
            return enabledLoggers.indexOf(name) !== -1;
        }
        
        logging.disable = function(name){
            var enabledIndex = enabledLoggers.indexOf(name);
            if(enabledIndex !== -1){
                enabledLoggers.splice(index,1);
            }
            com.manatee.game.loop.postMessage({"action":"logging","toAdd":"false","name":name});
        }
        
        logging.writeEntry = function(logger, message){
            if(logger == undefined || logger.name == undefined){
                return;
            }
            
            if(!logging.isEnabledFor(logger.name)){
                return;
            }
            
            if(typeof message === "string"){
                console.log(logger.name + ": " + message);
            }else{
                console.log(logger.name + ": " + JSON.stringify(message));
            }
        }
        
        return logging;
    })()
}

function Logger(name){
    this.name = name;
    this.write = function(message){
        com.manatee.logging.writeEntry(this,message);
    }
}