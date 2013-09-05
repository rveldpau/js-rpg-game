
if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.graphics) == "undefined"){
    com.manatee.graphics = {
        _buffer: null,
        _preloadBuffer: null,
        _gameScreen: null,
        screen:{
            width:0,
            height:0
        },
        _createScreen: function(width,height){
            com.manatee.graphics.screen.width=width;
            com.manatee.graphics.screen.height=height;
            
            com.manatee.graphics._preloadBufferCanvas = com.manatee.graphics._createCanvas("game-preload",null,null,false);
            com.manatee.graphics._preloadBuffer = com.manatee.graphics._preloadBufferCanvas.getContext("2d")
            com.manatee.graphics._bufferCanvas = com.manatee.graphics._createCanvas("game-buffer",width*2,height*2,false);
            com.manatee.graphics._buffer = com.manatee.graphics._bufferCanvas.getContext("2d")
            //com.manatee.graphics._buffer.scale(2,2);
            
            com.manatee.graphics._gameScreenCanvas = com.manatee.graphics._createCanvas("game-screen",width,height,true);
            com.manatee.graphics._gameScreen = com.manatee.graphics._gameScreenCanvas.getContext("2d")
            //com.manatee.graphics._gameScreen.scale(0.5,0.5);
            
        },
        _createCanvas: function(id,width,height,display){
            var canvas = $("<canvas>")
            .attr({
                "id":id,
                "width":width,
                "height":height
            })
            .css({
                "display":display?"block":"none"
            });
            canvas.appendTo($("body"));
            return canvas[0];
        },
        getBufferContext: function(){
            return com.manatee.graphics._buffer;
        },
        getPreloadBufferContext: function(){
            return com.manatee.graphics._preloadBuffer;
        },
        resizePreloadBuffer: function(width,height){
            $(com.manatee.graphics._preloadBufferCanvas).attr({
                "width":width,
                "height":height
            });
            com.manatee.graphics._preloadBuffer = com.manatee.graphics._preloadBufferCanvas.getContext("2d");
        },
        getGameScreen: function(){
            return com.manatee.graphics._gameScreen;
        },
        draw: function(sprite,x,y){
            com.manatee.graphics._buffer.drawImage(sprite.img,x+sprite.offsetX,y+sprite.offsetX);
        },
        flushBuffer: function(clear){
            com.manatee.graphics.clearCanvas(com.manatee.graphics._gameScreenCanvas);
            com.manatee.graphics._gameScreen.drawImage(com.manatee.graphics._bufferCanvas,0,0);
            if(clear){
                com.manatee.graphics.clearCanvas(com.manatee.graphics._bufferCanvas);
            }
        },
        clearCanvas: function(canvas){
            canvas.getContext('2d').clearRect(0,0,
                canvas.width,canvas.height)
        },
        drawAll: function(screenTop, screenLeft, objects, debugText){
            var left = Math.floor(screenLeft);
            var top = Math.floor(screenTop);
            objects.forEach(function(obj){
                var sprite = com.manatee.spritesets.get(obj.sprite.set).sprites[obj.sprite.id];
                if(sprite==undefined){
                    return;
                }
                var x = Math.floor((obj.location.x - left) + sprite.offsetX);
                var y = Math.floor((obj.location.y - top) + sprite.offsetY);
                
//                var img = com.manatee.spritesets.get(obj.sprite.set).sprites[obj.sprite.id].img;
                com.manatee.graphics._buffer.drawImage(sprite.img,x,y);
                
            });
            com.manatee.graphics._buffer.fillText(debugText,5,20);
            com.manatee.graphics.flushBuffer(true);
        }
    }
}

