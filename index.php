<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <script src="third-party/jquery.js" ></script>
        <script src="engine/configuration.js" ></script>
        <script src="engine/data.js" ></script>
        <script src="engine/coords.js" ></script>
        <script src="engine/sprite.js" ></script>
        <script src="engine/collision.js" ></script>
        <script src="engine/robject.js" ></script>
        <script src="engine/graphics.js" ></script>
        <script src="engine/spriteset.js" ></script>
        <script src="engine/map.js" ></script>
        <script src="engine/world.js" ></script>
        <script src="engine/camera.js" ></script>
        <script src="engine/game.js" ></script>
        <style>
            canvas {
                border: 1px solid black;
                image-rendering: optimizeSpeed;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: -o-crisp-edges;
                image-rendering: optimize-contrast;
                -ms-interpolation-mode: nearest-neighbor; 
            }
            #game-screen{
            }
        </style>
    </head>
    <body>
        <script>
            $(function(){
                com.manatee.game.initialize("resources/world.json")
            });
        </script>
    </body>
</html>
