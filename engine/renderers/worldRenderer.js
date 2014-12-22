var LOG = new Logger("world-renderer");
var timeElapsed = 0;
var _lastDrawTime = new Date();

var worldGraphics = {
    sortObjectsByZIndex: function(objects) {
        objects.sort(function(obj1, obj2) {
            var zDiff = obj1.location.layer - obj2.location.layer;
            if (zDiff !== 0) {
                return zDiff;
            }
            var yDiff = obj1.location.y - obj2.location.y;
            if (yDiff !== 0) {
                return yDiff;
            }
            return 0;
        })
    },
    drawObjects: function(canvas, left, top, timeElapsed, objects) {
        objects.forEach(function(obj) {
            var sprite = com.manatee.spritesets.get(obj.sprite.set).get(obj.sprite.id);
            if (sprite === undefined) {
                LOG.write("Object found without a sprite at" + obj.id);
                return;
            }
            var x = Math.floor((obj.location.x - left) + sprite.offsetX);
            var y = Math.floor((obj.location.y - top) + sprite.offsetY);
            var currentFrame = sprite.getCurrentFrame(timeElapsed);
            if (currentFrame === undefined || currentFrame.img === undefined) {
                console.log(sprite.id + " is not loaded...");
            } else {
                if (currentFrame.img !== undefined && currentFrame.img !== null) {
                    canvas.drawImage(currentFrame.img, x, y);
                }
            }
        });
    }
}

return function(properties) {
    //LOG.write("Rendering");
    
    var canvas = properties.canvas;
    var objects = properties.objects;
    
    var debugText = properties.debugText;
    var left = Math.floor(properties.screen.left);
    var top = Math.floor(properties.screen.top);

    var drawStartTime = new Date();
    var timeElapsed = drawStartTime - _lastDrawTime;

    worldGraphics.sortObjectsByZIndex(objects);
    worldGraphics.drawObjects(canvas,left, top, timeElapsed, objects);

    canvas.fillText(debugText, 5, 20);
    _lastDrawTime = drawStartTime;
}
