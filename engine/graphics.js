importScripts('spriteset.js', 'camera.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.graphics) === "undefined") {
    com.manatee.graphics = (function() {
        var graphics = {};
        var _buffer, _overlayBuffer, _preloadBuffer, _gameScreen;
        var _bufferCanvas, _preloadBufferCanvas, _overlayCanvas, _gameScreenCanvas;
        var _transitionToScreen = null;
        var _lastDrawTime = new Date();
        var _clearBeforeDraw = false;
        var renderer = {};
        graphics.screen = {
            width: 0,
            height: 0
        };
        graphics.createScreen = function(width, height) {
            graphics.screen.width = width;
            graphics.screen.height = height;

            _preloadBufferCanvas = _createCanvas("game-preload", null, null, false);
            _preloadBuffer = _preloadBufferCanvas.getContext("2d")
            _bufferCanvas = _createCanvas("game-buffer", width, height, false);
            _buffer = _bufferCanvas.getContext("2d")

            _overlayCanvas = _createCanvas("dialog-buffer", width, height, false);
            _overlayBuffer = _overlayCanvas.getContext("2d");

            _gameScreenCanvas = _createCanvas("game-screen", width, height, true);
            _gameScreen = _gameScreenCanvas.getContext("2d")

            //com.manatee.graphics._transitionToCanvas = com.manatee.graphics._createCanvas("transition-to", width, height, true);
            //com.manatee.graphics._transitionToScreen = com.manatee.graphics._transitionToCanvas.getContext("2d")
        };
        graphics.loadRenderer = function(mode, location) {
            renderer[mode] = com.manatee.data.loadScriptReturn(location);
        };
        var _createCanvas = function(id, width, height, display) {
            var canvas = $("<canvas>")
                    .attr({
                        "id": id,
                        "width": width,
                        "height": height
                    })
                    .css({
                        "display": display ? "block" : "none"
                    });
            canvas.appendTo($("body"));
            return canvas[0];
        };

        graphics.getBufferContext = function() {
            return _buffer;
        }
        graphics.getPreloadBufferContext = function() {
            return _preloadBuffer;
        }
        graphics.resizePreloadBuffer = function(width, height) {
            $(_preloadBufferCanvas).attr({
                "width": width,
                "height": height
            });
            _preloadBuffer = _preloadBufferCanvas.getContext("2d");
        }
        graphics.getGameScreen = function() {
            return _gameScreen;
        }
        graphics.flushBuffer = function(clear) {
            graphics.clearCanvas(_gameScreenCanvas);
            _gameScreen.drawImage(_bufferCanvas, 0, 0);
            _gameScreen.drawImage(_overlayCanvas, 0, 0);
            if (clear) {
                _clearBeforeDraw = true;
            }
        }
        graphics.clearCanvas = function(canvas) {
            canvas.getContext('2d').clearRect(0, 0,
                    canvas.width, canvas.height)
        }
        graphics.drawAll = function(mode, screenTop, screenLeft, objects, debugText) {
            var drawStartTime = new Date();

            if (_clearBeforeDraw) {
                graphics.clearCanvas(_bufferCanvas);
                _clearBeforeDraw = false;
            }
            renderer[mode]({
                screen: {
                    top: screenTop,
                    left: screenLeft,
                    width: graphics.screen.width,
                    height: graphics.screen.height
                },
                objects: objects,
                debugText: debugText,
                canvas: _buffer
            });

            graphics.flushBuffer(true);
            _lastDrawTime = drawStartTime;
        }

        graphics.showDialog = function(dialog) {
            renderer["dialog"]({
                screen: {
                    top: 0,
                    left: 0,
                    width: graphics.screen.width,
                    height: graphics.screen.height
                },
                objects: dialog,
                debugText: "",
                canvas: _overlayBuffer
            });
            graphics.flushBuffer(false);
        }
        
        return graphics;
    })()
}

