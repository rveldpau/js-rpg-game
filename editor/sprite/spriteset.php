<html>
    <head>
        <title>Spriteset Editor</title>
        <script src="/third-party/jquery.js" ></script>
        <script src="/editor/model.js" ></script>
        <script src="spriteset.js" ></script>
        <style>
            #image-container{
                margin-right: 20em; 
                position:relative;
            }

            #image, #sprite-selection-visualization{
                position:absolute;
                top:0px;
                left:0px;
            }


            #properties{
                position:absolute;
                right:0em;
                top:0em;
                width:20em;
            }

            #properties label{
                width:6em;
                display: inline-block;
            }
        </style>
    </head>
    <body>

        <div id="image-selector">
            <select name="image">
                <?php
                foreach (scandir("../../resources/spritesets/") as $key => $value) {
                    if (in_array($value, array(".", ".."))) {
                        continue;
                    } else if (strpos($value, ".json") === false) {
                        ?>
                        <option value="<?php echo $value; ?>" /><?php echo $value ?></option>
                        <?php
                    }
                }
                ?>
            </select>
        </div>
        <div id="image-container">
            <img id="image" />
            <canvas id="sprite-selection-visualization" />
        </div>
        <div id="sprite-container" style="background-color: #999; padding: 2em; display: inline-block;">
            <div id="sprite-offseter" style="background:#666">
                <img id="sprite" />
            </div>
        </div>
        <div id="properties">
            <div id="spriteset-properties">
                Spriteset Properties
                <div><label>Name:</label> <input type="text" id="spriteset-name" /></div>
                <div><label>Tile Size:</label> <input type="text" id="spriteset-unit" value="32" /></div>
                <div><label>Offset X:</label> <input type="text" id="spriteset-offsetx" value="0" /></div>
                <div><label>Offset Y:</label> <input type="text" id="spriteset-offsety" value="0" /></div>
                <div><label>Margin:</label> <input type="text" id="spriteset-margin" value="0" /></div>

            </div>

            <div id="current-sprite">
                Sprite Properties
                <div><label>Name:</label> <input type="text" id="sprite-name" /></div>
                <div><label>X:</label> <input type="text" id="sprite-x" /></div>
                <div><label>Y:</label> <input type="text" id="sprite-y" /></div>
                <div><label>Width:</label> <input type="text" id="sprite-width" /></div>
                <div><label>Height:</label> <input type="text" id="sprite-height" /></div>
            </div>
        </div>

        <script>

        </script>
    </body>
</html>