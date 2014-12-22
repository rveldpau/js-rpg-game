var battleGraphics = {
    drawBattleBackground: function(canvas) {
        var width = com.manatee.graphics.screen.width;
        var height = com.manatee.graphics.screen.height;
        if (battleGraphics._battleBackground === undefined) {
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
            battleGraphics._battleBackground = preloadCanvas.getImageData(0, 0, width, height);
        }
        canvas.putImageData(battleGraphics._battleBackground, 0, 0);
        com.manatee.graphics.effects.applyEffect("wave", canvas);


    }
}

var renderer = function(properties) {
    var canvas = properties.canvas;
    var battle = properties.objects;
    var debugText = properties.debugText;
    
    battleGraphics.drawBattleBackground(canvas);

    battle.enemies.forEach(function(enemy) {
        var sprite = com.manatee.spritesets.get(enemy.battle.spriteset).get(enemy.battle.sprite);
        var currentFrame = sprite.getCurrentFrame(0);
        canvas.drawImage(currentFrame.img, 300, 300);
    });

    canvas.fillText(debugText, 5, 20);
}

return renderer;
