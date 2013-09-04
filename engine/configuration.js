if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.config) == "undefined"){
    com.manatee.config = {
        _props: {},
        BASEURL: "baseUrl",
        SCREEN_DIMENSIONS: "screenDim",
        getProperty: function(propertyName){
            return com.manatee.config._props[propertyName];
        },
        setProperty: function(propertyName, value){
            com.manatee.config._props[propertyName] = value;
            if(com.manatee.config.onConfigChange!=undefined){
                com.manatee.config.onConfigChange(propertyName,value);
            }
        },
        getAll: function(){
            return _props;
        },
        onConfigChange: undefined
    }
}

