importScripts('spriteset.js', 'camera.js')

if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.graphics) === "undefined") {
    com.manatee.graphics = {
        _buffer: null,
        _overlayBuffer: null,
        _preloadBuffer: null,
        _gameScreen: null,
        _transitionToScreen: null,
        _lastDrawTime: new Date(),
        screen: {
            width: 0,
            height: 0
        },
        _createScreen: function(width, height) {
            com.manatee.graphics.screen.width = width;
            com.manatee.graphics.screen.height = height;

            com.manatee.graphics._preloadBufferCanvas = com.manatee.graphics._createCanvas("game-preload", null, null, false);
            com.manatee.graphics._preloadBuffer = com.manatee.graphics._preloadBufferCanvas.getContext("2d")
            com.manatee.graphics._bufferCanvas = com.manatee.graphics._createCanvas("game-buffer", width, height, false);
            com.manatee.graphics._buffer = com.manatee.graphics._bufferCanvas.getContext("2d")

            com.manatee.graphics._overlayCanvas = com.manatee.graphics._createCanvas("dialog-buffer", width, height, false);
            com.manatee.graphics._overlayBuffer = com.manatee.graphics._overlayCanvas.getContext("2d");

            com.manatee.graphics._gameScreenCanvas = com.manatee.graphics._createCanvas("game-screen", width, height, true);
            com.manatee.graphics._gameScreen = com.manatee.graphics._gameScreenCanvas.getContext("2d")

            com.manatee.graphics._transitionToCanvas = com.manatee.graphics._createCanvas("transition-to", width, height, true);
            com.manatee.graphics._transitionToScreen = com.manatee.graphics._transitionToCanvas.getContext("2d")

        },
        _createCanvas: function(id, width, height, display) {
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
        },
        getBufferContext: function() {
            return com.manatee.graphics._buffer;
        },
        getPreloadBufferContext: function() {
            return com.manatee.graphics._preloadBuffer;
        },
        resizePreloadBuffer: function(width, height) {
            $(com.manatee.graphics._preloadBufferCanvas).attr({
                "width": width,
                "height": height
            });
            com.manatee.graphics._preloadBuffer = com.manatee.graphics._preloadBufferCanvas.getContext("2d");
        },
        getGameScreen: function() {
            return com.manatee.graphics._gameScreen;
        },
        draw: function(sprite, x, y) {
            com.manatee.graphics._buffer.drawImage(sprite.img, x + sprite.offsetX, y + sprite.offsetX);
        },
        flushBuffer: function(clear) {
            com.manatee.graphics.clearCanvas(com.manatee.graphics._gameScreenCanvas);
            com.manatee.graphics._gameScreen.drawImage(com.manatee.graphics._bufferCanvas, 0, 0);
            com.manatee.graphics._gameScreen.drawImage(com.manatee.graphics._overlayCanvas, 0, 0);
            if (clear) {
                com.manatee.graphics._clearBeforeDraw = true;
            }
        },
        clearCanvas: function(canvas) {
            canvas.getContext('2d').clearRect(0, 0,
                    canvas.width, canvas.height)
        },
        drawAll: function(mode, screenTop, screenLeft, objects, debugText) {
            var drawStartTime = new Date();

            if (com.manatee.graphics._clearBeforeDraw) {
                com.manatee.graphics.clearCanvas(com.manatee.graphics._bufferCanvas);
                com.manatee.graphics._clearBeforeDraw = false;
            }
            if (mode === "world") {
                com.manatee.graphics.drawWorld(screenTop, screenLeft, objects, debugText);
            } else if (mode === "battle") {
                com.manatee.graphics.drawBattle(objects, debugText);
            }
            com.manatee.graphics.flushBuffer(true);
            com.manatee.graphics._lastDrawTime = drawStartTime;
        },
        drawBattle: function(battle, debugText) {
            com.manatee.graphics.drawBattleBackground();
            
            battle.enemies.forEach(function(enemy) {
                var sprite = com.manatee.spritesets.get(enemy.sprite.set).sprites[enemy.sprite.id];
                var currentFrame = sprite.getCurrentFrame(0);
                com.manatee.graphics._buffer.drawImage(currentFrame.img, 50, 50);
            });
            
            com.manatee.graphics._buffer.fillText(debugText, 5, 20);

        },
        drawBattleBackground: function() {
            var width = com.manatee.graphics.screen.width;
            var height = com.manatee.graphics.screen.height;
            if (com.manatee.graphics._battleBackground === undefined) {
                com.manatee.graphics.resizePreloadBuffer(width, height);
                var preloadCanvas = com.manatee.graphics.getPreloadBufferContext();
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
                com.manatee.graphics._battleBackground = preloadCanvas.getImageData(0, 0, width, height);
            }
            var canvas = com.manatee.graphics._buffer;
            canvas.putImageData(com.manatee.graphics._battleBackground, 0, 0);
            com.manatee.graphics.effects.applyEffect("wave", canvas);
            
            
        }
        ,
        drawWorld: function(screenTop, screenLeft, objects, debugText) {
            var drawStartTime = new Date();
            var timeElapsed = drawStartTime - com.manatee.graphics._lastDrawTime;
            var left = Math.floor(screenLeft);
            var top = Math.floor(screenTop);
            objects.sort(function(obj1, obj2) {
                var zDiff = obj1.location.layer - obj2.location.layer;
                if (zDiff != 0) {
                    return zDiff;
                }
                var yDiff = obj1.location.y - obj2.location.y;
                if (yDiff != 0) {
                    return yDiff;
                }

                return 0;
            })

            objects.forEach(function(obj) {
                var sprite = com.manatee.spritesets.get(obj.sprite.set).sprites[obj.sprite.id];
                if (sprite === undefined) {
                    return;
                }
                var x = Math.floor((obj.location.x - left) + sprite.offsetX);
                var y = Math.floor((obj.location.y - top) + sprite.offsetY);
                var currentFrame = sprite.getCurrentFrame(timeElapsed);
                if (currentFrame.img === undefined) {
                    console.log(sprite.id + " is not loaded...");
                } else {
                    com.manatee.graphics._buffer.drawImage(currentFrame.img, x, y);
                }
            });


            com.manatee.graphics._buffer.fillText(debugText, 5, 20);
            com.manatee.graphics._lastDrawTime = drawStartTime;
        },
        showDialog: function(dialog) {

            com.manatee.graphics.clearCanvas(com.manatee.graphics._overlayCanvas);
            if (dialog === null) {
                return;
            }
            var section = null;

            com.manatee.graphics._overlayBuffer.fillStyle = 'rgba(0,0,0,0.2)';
            com.manatee.graphics._overlayBuffer.fillRect(0, 0, 800, 600);

            Object.keys(dialog.sections).forEach(function(sectionId) {
                section = dialog.sections[sectionId];

                com.manatee.graphics._overlayBuffer.fillStyle = 'rgba(0,0,0,0.6)';
                com.manatee.graphics._overlayBuffer.fillRect(section.x, section.y, section.width, section.height);

                com.manatee.graphics._overlayBuffer.fillStyle = 'rgba(255,255,255,1)';

                com.manatee.graphics._overlayBuffer.font = "20px 'courier new'";
                com.manatee.graphics._drawDialogSectionText(section);

            })


            com.manatee.graphics.flushBuffer(false);
        },
        _drawDialogSectionText: function(section) {

            var line = '';
            var x = section.x + 5;
            var y = section.y + 25;
            var lineHeight = 20;

            if (section.text !== null) {
                if (section.preformatted) {
                    var lines = section.text.split('\n');
                    lines.forEach(function(line) {
                        com.manatee.graphics._overlayBuffer.fillText(line, x, y);
                        y += lineHeight;
                    })

                } else {
                    var words = section.text.split(' ');

                    for (var n = 0; n < words.length; n++) {
                        var testLine = line + words[n] + ' ';
                        var metrics = com.manatee.graphics._overlayBuffer.measureText(testLine);
                        var testWidth = metrics.width;
                        if (testWidth > section.width && n > 0) {
                            com.manatee.graphics._overlayBuffer.fillText(line, x, y);
                            line = words[n] + ' ';
                            y += lineHeight;
                        }
                        else {
                            line = testLine;
                        }
                    }
                }
                com.manatee.graphics._overlayBuffer.fillText(line, x, y);
                y += lineHeight;
            }

            var optionPad = 20;
            var optionX = x + optionPad;
            if (section.options != undefined) {
                section.options.forEach(function(option) {

                    if (option.selected) {
                        option.text = ">" + option.text
                        com.manatee.graphics._overlayBuffer.fillStyle = 'rgb(255,255,255)';
                    } else {
                        com.manatee.graphics._overlayBuffer.fillStyle = 'rgb(200,200,200)';
                    }
                    var optionWidth = com.manatee.graphics._overlayBuffer.measureText(option.text).width;
                    if (optionWidth + optionX > section.x + section.width) {
                        optionX = x + optionPad;
                        y += lineHeight;
                    }
                    com.manatee.graphics._overlayBuffer.fillText(option.text, optionX, y);
                    if (section.oneOptionPerLine) {
                        optionX = x + optionPad;
                        y += lineHeight;
                    } else {
                        optionX += optionWidth + optionPad;
                    }

                })
            }
        }
    }
}

