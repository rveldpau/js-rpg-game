<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Test Game</title>
        <script src="third-party/jquery.js" ></script>
        <script src="engine/engine.js" ></script>
        <style>
            body {
                overflow:hidden;
                text-align: center;
                background:#000;
            }
            canvas {
                border: 1px solid black;
                image-rendering: optimizeSpeed;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: -o-crisp-edges;
                image-rendering: optimize-contrast;
                -ms-interpolation-mode: nearest-neighbor; 
            }
            #loading{
                width:2000px;
                height:2200px;
                position:absolute;
                top:0px;
                left:0px;
                display:block;
                background:#000;
                opacity:0.9;
                z-index:100;
            }
            #game-screen{
    position: absolute;
    height: 960px;
    width: 1280px;
    image-rendering:pixelated;
    background:red;
    top:calc(50% - 960px/2);   /* 50% - height/2 */
    left:calc(50% - 1280px/2);  /* 50% - width/2 */
}
        </style>
    </head>
    <body>
        <div id="loading"></div>
        <script>
            $(function(){
                com.manatee.game.initialize("resources/game.json")
            });
        </script>
    </body>
</html>
