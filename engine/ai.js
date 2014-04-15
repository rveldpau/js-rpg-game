if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.ai) === "undefined"){
    com.manatee.ai = {
        processIntelligence: function(objects, timeElapsed){
            objects.forEach(function(object){
                if(object.ai != undefined){
                    object.ai(object,timeElapsed); 
                }
            })
            
        }
    }
}

