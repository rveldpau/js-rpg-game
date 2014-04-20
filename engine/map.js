importScripts('configuration.js','coords.js','spriteset.js')
if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}
if(typeof(com.manatee.maps) === "undefined"){
    com.manatee.maps = {
        load: function(mapLocation){
            var map = null;
            console.log("Loading map " + mapLocation)
            var data = com.manatee.data.load(mapLocation);
            map = com.manatee.maps._handleLoadedData(data);
            return map;
            
        },
        _handleLoadedData: function(data){
            var map = new Map();
            map.id = data.id;
            map.name = data.name;
            
            if(data.tileSize !== undefined){
                map.tileSize = data.tileSize;
            }
            
            data.spritesets.forEach(function(spritesetLocation){
                //var spriteset = com.manatee.spritesets.load(spritesetLocation);
                //map.spritesets[spriteset.id] = spriteset;
                postMessage({
                    "action":"load",
                    "type":"spriteset",
                    "location":spritesetLocation
                })
            })
            
            console.log("Registering dialogs for map '" + map.name + "'...")
            for(var dialogName in data.dialogs){
                com.manatee.dialog.registerDialog(dialogName, data.dialogs[dialogName])    
            }
            
            if(data.boundaries.startX!==undefined){
                map.boundaries.left = parseInt(data.boundaries.startX);
                map.boundaries.right = parseInt(data.boundaries.startX);
            }
            
            if(data.boundaries.startY!==undefined){
                map.boundaries.top = parseInt(data.boundaries.startY);
                map.boundaries.bottom = parseInt(data.boundaries.startY);
            }
            var layer = 0;
            var nextId = 0;
            data.map.forEach(function(layerData){
                if(map.data[layer]===undefined){
                    map.data[layer] = [];
                }
                var y=0;
                layerData.forEach(function(rowData){
                    if(layer===0){
                        map.boundaries.bottom += map.tileSize;
                    }
                    for(var x=0;x<rowData.length;x++){
                        var mapValue = rowData.charAt(x);
                        var valueMapping = data.mapping[mapValue];
                        if(valueMapping===undefined){
                            continue;
                        }
                        if(map.data[layer][x]===undefined){
                            map.data[layer][x] = [];
                            if(layer===0){
                                map.boundaries.right += map.tileSize;
                            }
                        }
                        
                        var object = new Robject();
                        object.id = map.id + "-" + nextId++;
                        object.sprite = {
                            set: valueMapping.set,
                            id: valueMapping.sprite
                        };
                        object.location.x = x * map.tileSize;
                        object.location.y = y * map.tileSize;
                        object.location.layer = layer;
                        
                        object.boundingBox.top = valueMapping.boundingBox.top;
                        object.boundingBox.left = valueMapping.boundingBox.left;
                        object.boundingBox.bottom = valueMapping.boundingBox.bottom;
                        object.boundingBox.right = valueMapping.boundingBox.right;
                        
                        object.collisionDetection = eval(valueMapping["collision-detection"]);
                        if(valueMapping.onCollision !==undefined){
                            eval("object.onCollision = function(impacted){" + valueMapping.onCollision + "}");
                        }
                        
                        if(valueMapping.onInteract !==undefined){
                            eval("object.onInteract = function(interactor, me){" + valueMapping.onInteract + "}");
                        }
                        
                        if(valueMapping.onTalk !==undefined){
                            eval("object.onTalk = function(interactor, me){" + valueMapping.onTalk + "}");
                        }
                        
                        if(valueMapping.ai !==undefined){
                            eval("object.ai = function(object,timeElapsed){" + valueMapping.ai + "}");
                        }
                        
                        if(valueMapping.properties !== undefined){
                            Object.keys(valueMapping.properties).forEach(function(key){
                                object[key] = eval(valueMapping.properties[key]);
                            });
                        }
                        
                        map.data[layer][x][y] = object;
                    }
                    y++;
                })
                layer++;
            })
            var screenDim = com.manatee.config.getProperty(com.manatee.config.SCREEN_DIMENSIONS);
            map.zonificate(screenDim.width,screenDim.height);
            
            
            return map;
        }
    }
}

function Map() {
    this.id = null;
    this.name = null;
    this.spritesets = {};
    this.mapping = {};
    this.data = [];
    this.boundaries = new Boundary();
    this.tileSize = 32;
    this.objectsIn=function(boundary){
        var objects = [];
        for(var zoneCol=0;zoneCol<this.zones.length;zoneCol++){
            var currentZoneCol = this.zones[zoneCol];
            for(var zoneRow=0;zoneRow<currentZoneCol.length;zoneRow++){
                var currentZone = currentZoneCol[zoneRow];
                if(boundary.contains(currentZone.boundaries)){
                    Object.keys(currentZone.objects).forEach(function(objectId){
                        objects.push(currentZone.objects[objectId]);
                    })
                    
                }
            }
        }
        for(var objectIndex=objects.length-1;objectIndex>=0;objectIndex--){
            if(!boundary.contains(objects[objectIndex].getCurrentBounds())){
                objects.splice(objectIndex,1);
            }
        }
        return objects;
    }
    this.spriteAt = function(x,y){
        var col = this.data[0][x];
        if(col===undefined){
            return undefined;
        }
        return col[y].sprite;
    }
    this.toMapCoords = function(point){
        var mapCoord = new Point();
        mapCoord.x = Math.floor(point.x / this.tileSize);
        mapCoord.y = Math.floor(point.y / this.tileSize);
        return mapCoord;
    }
    this.zones = [];
    this.zonificate = function(screenWidth, screenHeight){
        this.zones = [];
        var zoneWidth = Math.ceil(screenWidth / 1.5);
        var zoneHeight = Math.ceil(screenHeight / 1.5);
        var xIndex = 0;
        var yIndex = 0;
        for(var zoneX=0;zoneX<this.boundaries.right;){
            this.zones[xIndex] = [];
            yIndex=0;
            for(var zoneY=0;zoneY<this.boundaries.bottom;){
                var zone = new MapZone();
                zone.id = xIndex + "," + yIndex;
                zone.map = this;
                zone.boundaries.left = zoneX;
                zone.boundaries.top = zoneY;
                zone.boundaries.right = zoneX + zoneWidth;
                if(zone.boundaries.right>this.boundaries.right){
                    zone.boundaries.right = this.boundaries.right;
                }
                zone.boundaries.bottom = zoneY + zoneHeight;
                if(zone.boundaries.bottom>this.boundaries.bottom){
                    zone.boundaries.bottom = this.boundaries.bottom;
                }
                this.zones[xIndex][yIndex] = zone;
                yIndex++;
                zoneY+=zoneHeight
            }
            zoneX+=zoneWidth;
            xIndex++;
        }
        var currentMap = this;
        var xIndex=0;
        currentMap.zones.forEach(function(zoneColumn){
            var yIndex = 0;
            zoneColumn.forEach(function(zone){
                for(var x=0;x<=2;x++){
                    var borderZoneX = xIndex-1+x;
                    if(borderZoneX<0){
                        continue;
                    }
                    for(var y=0;y<=2;y++){
                        var borderZoneY = yIndex-1+y;
                        if(borderZoneY<0){
                            continue;
                        }
                        var borderZoneRows = currentMap.zones[borderZoneX];
                        if(borderZoneRows===undefined){
                            continue;
                        }
                        if(borderZoneRows[borderZoneY]!==undefined){
                            zone.borderZones[x][y] = borderZoneRows[borderZoneY];
                        }
                    }
                }
                currentMap._populateZone(zone);
                yIndex++;
            })
            xIndex++;
            
        })
    }
    
    this._populateZone = function(zone){
        mapStart = this.toMapCoords(zone.boundaries.topLeft());
        mapEnd = this.toMapCoords(zone.boundaries.bottomRight());
        for(var z=0;z<this.data.length;z++){
            for(var x=mapStart.x;x<mapEnd.x+1;x++){
                var col = this.data[z][x];
                if(col==undefined){
                    continue;
                }
                for(var y=mapStart.y;y<mapEnd.y+1;y++){
                    var object = col[y];
                    if(object!==undefined){
                        zone.objects[object.id] = object;
                    }
                }
            }
        }
    }
    
    this.rezone = function(object){
        this.zones.forEach(function(zoneColumn){
            zoneColumn.forEach(function(zone){
                if(zone.boundaries.contains(object.location)){
                    zone.objects[object.id] = object;
                }else{
                    delete zone.objects[object.id];
                }
            })
        })
    }
}

function MapZone(){
    this.id = null;
    this.map = null;
    this.borderZones=
        [[undefined,undefined,undefined],
        [undefined,null,undefined],
        [undefined,undefined,undefined]];
    this.boundaries = new Boundary();
    this.objects = {};
}