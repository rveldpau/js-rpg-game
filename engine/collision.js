if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.collision) == "undefined"){
    com.manatee.collision = {
        never: function(object1, object2){
            return false;
        },
        always: function(object1, object2){
            return true;
        }
    }
}

