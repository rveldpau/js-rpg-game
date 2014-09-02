importScripts('logger.js', 'sprite.js')
if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}
if (typeof (com.manatee.spritesets) === "undefined") {
    com.manatee.spritesets = (function(){
        var LOG = new Logger("spritesets");
        var spritesets = {};
        var _loadedSpritesets = {};
        var _loadedSpritesetsById = {};
        spritesets.allLoaded = function(){
            var loaded = true;
            Object.keys(_loadedSpritesets).forEach(function(key){
                if(!_loadedSpritesets[key].loaded){
                    LOG.write("Spriteset " + key + " is still not loaded.");
                    loaded = false;
                }else{
                    LOG.write("Spriteset " + key + " is loaded.");
                }
            });
            return loaded;
        }
        spritesets.load = function(spritesetLocation) {
            var spriteset = _loadedSpritesets[spritesetLocation];
            if (spriteset == undefined) {
                LOG.write("Loading spriteset " + spritesetLocation)
                var data = com.manatee.data.load(spritesetLocation);
                spriteset = _handleLoadedData(data);
                _loadedSpritesets[spritesetLocation] = spriteset;
                _loadedSpritesetsById[spriteset.id] = spriteset;
            }
            return spriteset;
        }
        var _handleLoadedData = function(data, spritesetLocation) {
            var newSpriteset = new Spriteset();
            newSpriteset.id = data.id;
            newSpriteset.srcLocation = spritesetLocation;
            newSpriteset.loaded = false;
            newSpriteset.img = $("<img>")
                    .css("display", "none")
                    .load(
                            function() {
                                LOG.write("Sprite set image loaded...");
                                var flipCanvas = $("<canvas>").appendTo('body');
                                var flipContext = null;

                                com.manatee.graphics.resizePreloadBuffer(newSpriteset.img.width(), newSpriteset.img.height());
                                var preloader = com.manatee.graphics.getPreloadBufferContext();
                    LOG.write("Pre-loading spriteset image");
                    preloader.drawImage(newSpriteset.img[0],0,0);
                                var imgData = null;
                                var frame = null;
                                Object.keys(newSpriteset.frames).forEach(function(frameId) {
                                    frame = newSpriteset.frames[frameId];
                                    frame.img = $("<canvas>")
                                            .css({"display": "none"})
                                            .attr({
                                                "id": newSpriteset.id + "-" + frame.id,
                                                "width": frame.width,
                                                "height": frame.height
                                            }).appendTo("body")[0];
                                    frameContext = frame.img.getContext('2d')

                                    imgData = preloader.getImageData(frame.x, frame.y, frame.width, frame.height);
                                    frameContext.putImageData(imgData, 0, 0);
                                    if (frame.flip == "x") {
                                        flipCanvas.attr({
                                            width: frame.width,
                                            height: frame.height
                                        });
                                        flipContext = flipCanvas[0].getContext('2d');
                                        flipContext.clearRect(0, 0, frame.width, frame.height);
                                        flipContext.translate(frame.width, 0);
                                        flipContext.scale(-1, 1);
                                        flipContext.drawImage(frame.img, 0, 0);
                                        imgData = flipContext.getImageData(0, 0, frame.width, frame.height);
                                        frameContext.putImageData(imgData, 0, 0);

                                    }
                                    $(frame.img).remove();
                                })
                                flipCanvas.remove();
                                
                                newSpriteset.loaded = true;
                                if(spritesets.allLoaded()){
                                    com.manatee.game.postMessage({"action":"complete","completed":"spritesets-load"});
                                }
                                $(this).remove();
                            })
                            .attr(
                            {
                                "src": data.src,
                                "id": data.id + "-img"
                            }
                    ).appendTo("body");

            data.frames.forEach(function(value) {
                var newFrame = new SpriteFrame();
                newFrame.id = value.id;
                newFrame.name = value.name;
                newFrame.x = (value.x * data.configuration.unit)
                        + (value.x * data.configuration.margin) + data.configuration.offsetX;
                newFrame.y = (value.y * data.configuration.unit)
                        + (value.y * data.configuration.margin) + data.configuration.offsetY;
                newFrame.width = (value.width == undefined) ? data.configuration.unit : value.width;
                newFrame.height = (value.height == undefined) ? data.configuration.unit : value.height;
                newFrame.flip = value.flip;
                newSpriteset.addFrame(newFrame);
            })

            data.sprites.forEach(function(value) {
                var newSprite = new Sprite();
                newSprite.id = value.id;
                newSprite.name = value.name;
                newSprite.offsetX = (value.offsetX == undefined) ? 0 : value.offsetX;
                newSprite.offsetY = (value.offsetY == undefined) ? 0 : value.offsetY;
                newSprite.frameDisplayTime = (value.frameDisplayTime == undefined) ? 0 : value.frameDisplayTime
                value.frames.forEach(function(frameId) {
                    newSprite.frames.push(newSpriteset.frames[frameId]);
                })

                newSpriteset.addSprite(newSprite);
            });
            
            return newSpriteset;
        }
        spritesets.get = function(id) {
            return _loadedSpritesetsById[id];
        }
        return spritesets;
    })()
}

function Spriteset() {
    this.id = null;
    this.srcLocation = null;
    this.sprites = {};
    this.frames = {};
    this._spriteNames = {};
    this.image = null;
    this.addFrame = function(frame) {
        this.frames[frame.id] = frame;
        frame.spriteset = this;
    }
    this.addSprite = function(sprite) {
        this.sprites[sprite.id] = sprite;
        this._spriteNames[sprite.name] = sprite.id;
        sprite.spriteset = this;
    }
    this.getSpriteByName = function(name) {
        var id = this._spriteNames[name];
        return this.sprites[id];
    }
    this.containsSprite = function(name) {
        return this.getSpriteByName(name) !== undefined;
    }

}

