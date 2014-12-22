if (typeof (com) === "undefined") {
    com = {};
}

if (typeof (com.manatee) === "undefined") {
    com.manatee = {};
}

if (typeof (com.manatee.spriteset) === "undefined") {
    com.manatee.spriteset = {};
}

com.manatee.spriteset.editor = (function () {
    var selectedSprite = null;
    var mouseIsDown = false;
    
    var spriteSet = new Model();

    var editor = {};
    editor.init = function () {

        spriteSet.attach("srcLocation", "select[name=image]");
        spriteSet.onChange("srcLocation", onSpriteSetImageSelection);

        spriteSet.attach("offsetX", "#spriteset-offsetx");
        spriteSet.attach("offsetY", "#spriteset-offsety");
        spriteSet.attach("name", "#spriteset-name");
        spriteSet.attach("tileSize", "#spriteset-unit");
        spriteSet.attach("margin", "#spriteset-margin");

        spriteSet.onChange("offsetX;offsetY;tileSize;margin", onSpriteSetPropertyChange);

        $("#sprite-selection-visualization").mousedown(onSpriteSelectionMouseDown);
        $("#sprite-selection-visualization").mousemove(onSpriteSelectionMouseMove);
        $("#sprite-selection-visualization").mouseup(onSpriteSelectionMouseUp);
    }

    editor.dump = function () {
        console.log(JSON.stringify(spriteSet));
    }

    var onSpriteSetImageSelection = function () {
        var imgsrc = "/resources/spritesets/" + spriteSet.srcLocation;
        $("#image, #sprite")
                .on("load", prepareSpriteSetImage)
                .attr("src", imgsrc);

    }

    var prepareSpriteSetImage = function () {
        spriteSet.set("height", parseInt($("#image").height()));
        spriteSet.set("width", parseInt($("#image").width()));
        draw_grid();
    }

    var onSpriteSetPropertyChange = function () {
        console.log("Change made...");
        draw_grid();
    }

    var onSpriteSelectionMouseDown = function (ev) {
        var x = ev.offsetX;
        var y = ev.offsetY;

        var selectedTileX = Math.floor((x - spriteSet.offsetX) / (spriteSet.tileSize + spriteSet.margin));
        var selectedTileY = Math.floor((y - spriteSet.offsetY) / (spriteSet.tileSize + spriteSet.margin));

        selectedSprite = new Model();
        selectedSprite.set("x",selectedTileX);
        selectedSprite.set("y",selectedTileY);
        selectedSprite.set("width",1);
        selectedSprite.set("height",1);
        
        selectedSprite.attach("x", "#sprite-x");
        selectedSprite.attach("y", "#sprite-y");
        selectedSprite.attach("width", "#sprite-width");
        selectedSprite.attach("height", "#sprite-height");
        selectedSprite.onChange("x;y;width;height", draw_grid);


        mouseIsDown = true;
        draw_grid();
    }

    var onSpriteSelectionMouseMove = function(ev){
        if(!mouseIsDown){
            return;
        }
        
        var x = ev.offsetX;
        var y = ev.offsetY;

        var selectedTileX = Math.floor((x - spriteSet.offsetX) / (spriteSet.tileSize + spriteSet.margin));
        var selectedTileY = Math.floor((y - spriteSet.offsetY) / (spriteSet.tileSize + spriteSet.margin));

        var width = selectedTileX - selectedSprite.x + 1;
        width = width > 1 ? width : 1;
        var height = selectedTileY - selectedSprite.y + 1;
        height = height > 1 ? height : 1;

        selectedSprite.set("width",width);
        selectedSprite.set("height",height);

        draw_grid();
    }

    var onSpriteSelectionMouseUp = function (ev) {
        mouseIsDown = false;
    }



    var draw_grid = function () {
        console.log("Drawing Grid...")
        $("#image-container").height(spriteSet.height);

        var visualizationCanvas = document.getElementById("sprite-selection-visualization");

        var visualization = visualizationCanvas.getContext("2d");
        visualization.width = spriteSet.width;
        visualization.height = spriteSet.height;
        visualization.canvas.width = spriteSet.width;
        visualization.canvas.height = spriteSet.height;

        if(spriteSet.tileSize<=4){
            console.log("Not drawing Grid because tileSize is too small");
        }else{

            console.log("Drawing Grid for SpriteSet " + spriteSet.width + "x" + spriteSet.height)

            visualization.strokeStyle = "#6666FF";

            var y = spriteSet.offsetY - spriteSet.margin;
            while (y < spriteSet.height) {
                drawLine(visualization, 0, y, spriteSet.width, y);

                if (spriteSet.margin != 0) {
                    y += spriteSet.margin;
                    drawLine(visualization, 0, y, spriteSet.width, y);
                }
                y += spriteSet.tileSize;
            }

            var x = spriteSet.offsetX - spriteSet.margin;
            while (x < spriteSet.width) {
                drawLine(visualization, x, 0, x, spriteSet.height);

                if (spriteSet.margin !== 0) {
                    x += spriteSet.margin;
                    drawLine(visualization, x, 0, x, spriteSet.height);
                }
                x += spriteSet.tileSize;
            }
        }
        console.log(selectedSprite);
        if (selectedSprite !== null) {
            var x = spriteSet.offsetX + (spriteSet.tileSize * selectedSprite.x) + (spriteSet.margin * (selectedSprite.x + 1)) - spriteSet.margin;
            var y = spriteSet.offsetY + (spriteSet.tileSize * selectedSprite.y) + (spriteSet.margin * (selectedSprite.y + 1)) - spriteSet.margin;
            var width = selectedSprite.width * (spriteSet.tileSize + spriteSet.margin) - spriteSet.margin;
            var height = selectedSprite.height * (spriteSet.tileSize + spriteSet.margin) - spriteSet.margin;
            visualization.fillStyle="RGBA(0,0,0,0.5)";
            visualization.fillRect(x, y, width, height);
            show_sprite();
        }

    }

    var drawLine = function (canvas, x1, y1, x2, y2) {
        canvas.beginPath();
        canvas.moveTo(x1, y1);
        canvas.lineTo(x2, y2);

        canvas.stroke();
    }

    var show_sprite = function () {

        var width = selectedSprite.width * (spriteSet.tileSize + spriteSet.margin) - spriteSet.margin;
        var height = selectedSprite.height * (spriteSet.tileSize + spriteSet.margin) - spriteSet.margin;


        $("#sprite-offseter").css({
            width: width,
            height: height,
            position: "relative",
            display: "block",
            overflow: "hidden"
        })

        $("#sprite").css({
            position: "absolute",
            top: -(spriteSet.offsetY + (spriteSet.tileSize * selectedSprite.y) + (spriteSet.margin * selectedSprite.y)),
            left: -(spriteSet.offsetY + (spriteSet.tileSize * selectedSprite.x) + (spriteSet.margin * selectedSprite.x))
        })
    }

    $(editor.init);
    return editor;
})();






