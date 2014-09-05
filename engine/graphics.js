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
        graphics.draw = function(sprite, x, y) {
            if (sprite.img !== undefined && sprite.img !== null) {
                console.log("Drawing " + sprite.id + " - img is " + sprite.img);
                _buffer.drawImage(sprite.img, x + sprite.offsetX, y + sprite.offsetX);
            }
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
            if (mode === "world") {
                graphics.drawWorld(screenTop, screenLeft, objects, debugText);
            } else if (mode === "battle") {
                graphics.drawBattle(objects, debugText);
            }
            graphics.flushBuffer(true);
            _lastDrawTime = drawStartTime;
        }
        graphics.drawBattle = function(battle, debugText) {
            battleGraphics.drawBattleBackground();

            battle.enemies.forEach(function(enemy) {
                var sprite = com.manatee.spritesets.get(enemy.battle.spriteset).get(enemy.battle.sprite);
                var currentFrame = sprite.getCurrentFrame(0);
                _buffer.drawImage(currentFrame.img, 300, 300);
            });

            _buffer.fillText(debugText, 5, 20);

        }

        var battleGraphics = {
            drawBattleBackground: function() {
                var width = graphics.screen.width;
                var height = graphics.screen.height;
                if (battleGraphics._battleBackground === undefined) {
                    graphics.resizePreloadBuffer(width, height);
                    var preloadCanvas = graphics.getPreloadBufferContext();
                    var grd = preloadCanvas.createLinearGradient(0, 0, 0, 600);
                    grd.addColorStop(0, "#113377");
                    grd.addColorStop(1, "#003366");

                    preloadCanvas.fillStyle = grd;
                    preloadCanvas.fillRect(0, 0, width, height);

                    var grd = preloadCanvas.createLinearGradient(0, 0, 0, 600);
                    grd.addColorStop(0, "#6699FF");
                    grd.addColorStop(1, "#335599");

                    preloadCanvas.fillStyle = grd;
                    for (var x = 15; x < width; x += 60) {
                        for (var y = 15; y < height; y += 60) {
                            preloadCanvas.fillRect(x, y, 30, 30);
                        }
                    }
                    battleGraphics._battleBackground = preloadCanvas.getImageData(0, 0, width, height);
                }
                var canvas = _buffer;
                canvas.putImageData(battleGraphics._battleBackground, 0, 0);
                graphics.effects.applyEffect("wave", canvas);


            }
        }

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
            drawObjects: function(left, top, timeElapsed, objects) {
                objects.forEach(function(obj) {
                    var sprite = com.manatee.spritesets.get(obj.sprite.set).get(obj.sprite.id);
                    if (sprite === undefined) {
                        return;
                    }
                    var x = Math.floor((obj.location.x - left) + sprite.offsetX);
                    var y = Math.floor((obj.location.y - top) + sprite.offsetY);
                    var currentFrame = sprite.getCurrentFrame(timeElapsed);
                    if (currentFrame === undefined || currentFrame.img === undefined) {
                        console.log(sprite.id + " is not loaded...");
                    } else {
                        if (currentFrame.img !== undefined && currentFrame.img !== null) {
                            _buffer.drawImage(currentFrame.img, x, y);
                        }
                    }
                });
            }
        }

        graphics.drawWorld = function(screenTop, screenLeft, objects, debugText) {
            var drawStartTime = new Date();
            var timeElapsed = drawStartTime - _lastDrawTime;
            var left = Math.floor(screenLeft);
            var top = Math.floor(screenTop);

            worldGraphics.sortObjectsByZIndex(objects);
            worldGraphics.drawObjects(left, top, timeElapsed, objects);

            _buffer.fillText(debugText, 5, 20);
            _lastDrawTime = drawStartTime;
        }
        graphics.showDialog = function(dialog) {

            graphics.clearCanvas(_overlayCanvas);
            if (dialog === null) {
                return;
            }
            var section = null;

            _overlayBuffer.fillStyle = 'rgba(0,0,0,0.2)';
            _overlayBuffer.fillRect(0, 0, 800, 600);

            Object.keys(dialog.sections).forEach(function(sectionId) {
                section = dialog.sections[sectionId];

                _overlayBuffer.fillStyle = 'rgba(0,0,0,0.6)';
                _overlayBuffer.fillRect(section.x, section.y, section.width, section.height);

                _overlayBuffer.fillStyle = 'rgba(255,255,255,1)';

                _overlayBuffer.font = "20px 'courier new'";
                _drawDialogSectionText(section);
            })


            graphics.flushBuffer(false);
        }
        var _drawDialogSectionText = function(section) {

            var line = '';
            var x = section.x + 5;
            var y = section.y + 25;
            var lineHeight = 20;

            if (section.text !== null) {
                if (section.preformatted) {
                    var lines = section.text.split('\n');
                    lines.forEach(function(line) {
                        _overlayBuffer.fillText(line, x, y);
                        y += lineHeight;
                    })

                } else {
                    var words = section.text.split(' ');

                    for (var n = 0; n < words.length; n++) {
                        var testLine = line + words[n] + ' ';
                        var metrics = _overlayBuffer.measureText(testLine);
                        var testWidth = metrics.width;
                        if (testWidth > section.width && n > 0) {
                            _overlayBuffer.fillText(line, x, y);
                            line = words[n] + ' ';
                            y += lineHeight;
                        }
                        else {
                            line = testLine;
                        }
                    }
                }
                _overlayBuffer.fillText(line, x, y);
                y += lineHeight;
            }

            var optionPad = 20;
            var optionX = x + optionPad;
            if (section.options != undefined) {
                section.options.forEach(function(option) {

                    if (option.selected) {
                        option.text = ">" + option.text
                        _overlayBuffer.fillStyle = 'rgb(255,255,255)';
                    } else {
                        _overlayBuffer.fillStyle = 'rgb(200,200,200)';
                    }
                    var optionWidth = _overlayBuffer.measureText(option.text).width;
                    if (optionWidth + optionX > section.x + section.width) {
                        optionX = x + optionPad;
                        y += lineHeight;
                    }
                    _overlayBuffer.fillText(option.text, optionX, y);
                    if (section.oneOptionPerLine) {
                        optionX = x + optionPad;
                        y += lineHeight;
                    } else {
                        optionX += optionWidth + optionPad;
                    }

                })
            }
        }
        return graphics;
    })()
}

