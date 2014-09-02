importScripts('data.js', 'input.js', 'map.js', 'robject.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.world) === "undefined") {
    com.manatee.world = (function(){
        var world = {};
        world.load = function(worldLocation) {
            var newWorld = null;
            var data = com.manatee.data.load(worldLocation);
            newWorld = _handleLoadedData(data);

            return newWorld;

        }
        var _handleLoadedData = function(data) {
            var newWorld = new World();
            newWorld.id = data.id;
            newWorld.name = data.name;

            console.log("Loading spritesets...")
            data.spritesets.forEach(function(spritesetLocation) {
                postMessage({
                    "action": "load",
                    "type": "spriteset",
                    "location": spritesetLocation
                })
            });

            console.log("Registering common dialogs...")
            for(var dialogName in data.dialogs){
                com.manatee.dialog.registerDialog(dialogName, data.dialogs[dialogName])    
            }

            com.manatee.input.load(data.inputScript);

            console.log("Loading maps...")
            data.maps.forEach(function(mapLocation) {
                var map = com.manatee.maps.load(mapLocation);
                newWorld.maps[map.id] = map;
            })

            newWorld.currentMap = newWorld.maps[data.start.map];
            newWorld.start = data.start;


            console.log("Creating character")
            newWorld.character = new Robject();
            newWorld.character.location.x = newWorld.start.location.x;
            newWorld.character.location.y = newWorld.start.location.y;
            newWorld.character.location.layer = newWorld.start.location.layer;
            newWorld.character.lastDirection = newWorld.start.direction;
            newWorld.character.sprite = data.character.sprite;
            newWorld.character.boundingBox.top = data.character.boundingBox.top;
            newWorld.character.boundingBox.left = data.character.boundingBox.left;
            newWorld.character.boundingBox.bottom = data.character.boundingBox.bottom;
            newWorld.character.boundingBox.right = data.character.boundingBox.right;

            return newWorld;
        }
        return world;
    })()
}

function World() {
    this.id = null;
    this.name = null;
    this.maps = {};
    this.spritesets = {};
    this.currentMap = null;
    this.start = null;
    this.character = null;
}