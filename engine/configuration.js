if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.config) === "undefined"){
    com.manatee.config = (function(){
        var config = {};
        var props = {};
        
        config.BASEURL = "baseUrl";
        config.SCREEN_DIMENSIONS = "screenDim",
        
        config.getProperty = function(propertyName){
            return props[propertyName];
        };
        config.setProperty = function(propertyName, value){
            props[propertyName] = value;
            if(config.onConfigChange!==undefined){
                config.onConfigChange(propertyName,value);
            }
        };
        config.getAll = function(){
            return props;
        },
        config.onConfigChange = undefined;
        return config;
    })();
}

