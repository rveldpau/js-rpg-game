if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.world) == "undefined"){
    com.manatee.world = {
        load: function(worldLocation){
            var world = null;
            var data = com.manatee.data.load(worldLocation);
            world = com.manatee.world._handleLoadedData(data);
            
            return world;
            
        },
        _handleLoadedData: function(data){
            var world = new World();
            world.id = data.id;
            world.name = data.name;
            
            console.log("Loading spritesets,,,")
            data.spritesets.forEach(function(spritesetLocation){
                postMessage({
                    "action":"load",
                    "type":"spriteset",
                    "location":spritesetLocation
                })
            });
            
            com.manatee.input.load(data.inputScript);
            
            console.log("Loading maps,,,")
            data.maps.forEach(function(mapLocation){
                var map = com.manatee.maps.load(mapLocation);
                world.maps[map.id] = map;
            })
            
            world.currentMap = world.maps[data.start.map];
            world.start = data.start;
            
            
            console.log("Creating character")
            world.character = new Robject();
            world.character.location.x = world.start.location.x;
            world.character.location.y = world.start.location.y;
            world.character.sprite = {
                set:data.character.sprite.set,
                id:data.character.sprite.id
            }
            
            return world;
        }
    }
}

function World() {
    this.id=null;
    this.name=null;
    this.maps={};
    this.spritesets={};
    this.currentMap=null;
    this.start=null;
    this.character=null;
}