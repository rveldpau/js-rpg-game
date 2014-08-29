

function Logger(name){
    this.name = name;
    this.write = function(message){
        if(typeof message === "string"){
            console.log(this.name + ": " + message);
        }else{
            console.log(this.name + ": " + JSON.stringify(message));
        }
    }
}