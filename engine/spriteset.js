
if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}
if(typeof(com.manatee.spritesets) == "undefined"){
    com.manatee.spritesets = {
        _loadedSpritesets: {},
        _loadedSpritesetsById: {},
        load: function(spritesetLocation){
            var spriteset = com.manatee.spritesets._loadedSpritesets[spritesetLocation];
            if(spriteset==undefined){
                console.log("Loading spriteset " + spritesetLocation)
                var data = com.manatee.data.load(spritesetLocation);
                spriteset = com.manatee.spritesets._handleLoadedData(data);
                com.manatee.spritesets._loadedSpritesets[spritesetLocation] = spriteset;
                com.manatee.spritesets._loadedSpritesetsById[spriteset.id] = spriteset;
            }
            return spriteset;
        },
        _handleLoadedData: function(data,spritesetLocation){
            var newSpriteset = new Spriteset();
            newSpriteset.id = data.id;
            newSpriteset.srcLocation = spritesetLocation;
            newSpriteset.img = $("<img>")
            .attr(
            {
                "src":data.src,
                "id":data.id+"-img"
            }
            ).css("display","none")
            .load(
                function(){
                    
                    var flipCanvas = $("<canvas>").appendTo('body');
                    var flipContext = null;
                    
                    com.manatee.graphics.resizePreloadBuffer(newSpriteset.img.width(),newSpriteset.img.height());
                    var preloader = com.manatee.graphics.getPreloadBufferContext();
                    preloader.drawImage(newSpriteset.img[0],0,0);
                    var imgData = null;
                    $.each(newSpriteset.sprites, function(index,sprite){
                        sprite.img = $("<canvas>")
                            .attr({
                                "id":newSpriteset.id + "-" + index,
                                "width":sprite.width,
                                "height":sprite.height
                            }).appendTo("body")[0];
                            spriteContext = sprite.img.getContext('2d')
                        
                        imgData = preloader.getImageData(sprite.x,sprite.y,sprite.width,sprite.height);
                        
                        if(sprite.flip=="x"){
                            flipCanvas.attr({
                                width:sprite.width,
                                height:sprite.height
                            });
                            flipContext = flipCanvas[0].getContext('2d');
                            flipContext.putImageData(imgData,0,0);
                            flipContext.translate(sprite.width, 0);
                            flipContext.scale(-1, 1);
                            flipContext.drawImage(flipCanvas[0],0,0);
                            imgData = flipContext.getImageData(0,0,sprite.width,sprite.height);
                        }
                        spriteContext.putImageData(imgData,0,0);
                    })
                    flipCanvas.remove();
                }).appendTo("body");
                
            $.each(data.sprites, function(index,value){
                var newSprite = new Sprite();
                newSprite.id = value.id;
                newSprite.name = value.name;
                newSprite.x = (value.x * data.configuration.unit)
                + (value.x * data.configuration.margin) + data.configuration.offsetX;
                newSprite.y = (value.y * data.configuration.unit) 
                + (value.y * data.configuration.margin) + data.configuration.offsetY;
                newSprite.width = (value.width == undefined)?data.configuration.unit:value.width;
                newSprite.height = (value.height == undefined)?data.configuration.unit:value.height;
                newSprite.offsetX = (value.offsetX == undefined)?0:value.offsetX;
                newSprite.offsetY = (value.offsetY == undefined)?0:value.offsetY;
                newSprite.flip = value.flip;
                newSpriteset.addSprite(newSprite);
            })
            return newSpriteset;
        },
        get: function(id){
            return com.manatee.spritesets._loadedSpritesetsById[id];
        }
    }
}

function Spriteset() {
    this.id = null;
    this.srcLocation = null;
    this.sprites = {};
    this._spriteNames = {};
    this.image = null;
    this.addSprite = function(sprite){
        this.sprites[sprite.id] = sprite;
        this._spriteNames[sprite.name] = sprite.id;
        sprite.spriteset = this;
    }
    this.getSpriteByName = function(name){
        var id = this._spriteNames[name];
        return this.sprites[id];
    }
    
}

