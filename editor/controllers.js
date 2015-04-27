(function () {

    var editorControllers = angular.module('editorControllers', []);
    editorControllers.controller('welcomeController', function ($scope) {
        $scope.message = "Welcome to the editor!";
    });

    editorControllers.controller('imagesController', ['$scope', '$routeParams', 'GameImage', function ($scope, $routeParams, GameImage) {
            if ($routeParams.selectedImageId) {
                $scope.selectedImage = GameImage.get({'id': $routeParams.selectedImageId});
                console.log($scope.selectedImage);
            }
            $scope.images = GameImage.query();
        }]);

    editorControllers.controller('spritesetController', ['$scope', 'SpriteSet', function ($scope, SpriteSet) {
            $scope.spritesets = SpriteSet.query();
        }]);


    editorControllers.controller('spritesetEditController', ['$scope', '$routeParams', 'GameImage', 'SpriteSet', function ($scope, $routeParams, GameImage, SpriteSet) {
            $scope.images = GameImage.query();
            $scope.spriteSet = {
                frames: {},
                config: {
                    "offsetX": 0,
                    "offsetY": 0,
                    "tileSize": 32,
                    "margin": 0
                }
            };
            if ($routeParams.spritesetId) {
                var loadedSpriteset = SpriteSet.get({'id': $routeParams.spritesetId});
                loadedSpriteset.$promise.then(function () {
                    $scope.spriteSet = loadedSpriteset;
                    $scope.onSpriteSetImageSelection();

                })
            }

            $scope.selectedFrame = null;
            $scope.mouseIsDown = false;

            var prepareSpriteSetImage = function () {
                $scope.spriteSet.height = parseInt($("#image").height());
                $scope.spriteSet.width = parseInt($("#image").width());
                update_visualizations();
            };


            $scope.onSpriteSetImageSelection = function () {
                var imgsrc = "/resources/" + $scope.spriteSet.src;
                $("#image, #frame")
                        .on("load", prepareSpriteSetImage)
                        .attr("src", imgsrc);
                $("#frame-offseter").css({
                    height: $scope.spriteSet.config.tileSize,
                    width: $scope.spriteSet.config.tileSize,
                    overflow: "hidden"
                });
            }

            var update_visualizations = function () {
                //console.log("Drawing Grid...")
                //$("#image-container").height(spriteSet.height);

                var visualizationCanvas = document.getElementById("frame-selection-visualization");

                var visualization = visualizationCanvas.getContext("2d");
                visualization.width = $scope.spriteSet.width;
                visualization.height = $scope.spriteSet.height;
                visualization.canvas.width = $scope.spriteSet.width;
                visualization.canvas.height = $scope.spriteSet.height;

                if ($scope.spriteSet.config.tileSize <= 4) {
                    console.log("Not drawing Grid because tileSize is too small");
                } else {

                    visualization.strokeStyle = "RGBA(0,0,0,0.5)";

                    var y = $scope.spriteSet.config.offsetY - $scope.spriteSet.config.margin;
                    while (y < $scope.spriteSet.height) {
                        drawLine(visualization, 0, y, $scope.spriteSet.width, y);

                        if ($scope.spriteSet.config.margin != 0) {
                            y += $scope.spriteSet.config.margin;
                            drawLine(visualization, 0, y, $scope.spriteSet.width, y);
                        }
                        y += $scope.spriteSet.config.tileSize;
                    }

                    var x = $scope.spriteSet.config.offsetX - $scope.spriteSet.config.margin;
                    while (x < $scope.spriteSet.width) {
                        drawLine(visualization, x, 0, x, $scope.spriteSet.height);

                        if ($scope.spriteSet.config.margin !== 0) {
                            x += $scope.spriteSet.config.margin;
                            drawLine(visualization, x, 0, x, $scope.spriteSet.height);
                        }
                        x += $scope.spriteSet.config.tileSize;
                    }
                }
                if ($scope.selectedFrame !== null) {
                    var x = $scope.spriteSet.config.offsetX + ($scope.spriteSet.config.tileSize * $scope.selectedFrame.x) + ($scope.spriteSet.config.margin * ($scope.selectedFrame.x + 1)) - $scope.spriteSet.config.margin;
                    var y = $scope.spriteSet.config.offsetY + ($scope.spriteSet.config.tileSize * $scope.selectedFrame.y) + ($scope.spriteSet.config.margin * ($scope.selectedFrame.y + 1)) - $scope.spriteSet.config.margin;
                    var width = $scope.selectedFrame.width * ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin) - $scope.spriteSet.config.margin;
                    var height = $scope.selectedFrame.height * ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin) - $scope.spriteSet.config.margin;
                    visualization.fillStyle = "RGBA(0,0,0,0.5)";
                    visualization.fillRect(x, y, width, height);
                    show_sprite();
                }
            }
            $scope.update_visualizations = update_visualizations;

            var drawLine = function (canvas, x1, y1, x2, y2) {
                canvas.beginPath();
                canvas.moveTo(x1, y1);
                canvas.lineTo(x2, y2);

                canvas.stroke();
            }


            var show_sprite = function () {

                var width = $scope.selectedFrame.width * ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin) - $scope.spriteSet.config.margin;
                var height = $scope.selectedFrame.height * ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin) - $scope.spriteSet.config.margin;

                $("#frame-offseter").css({
                    width: width,
                    height: height,
                    position: "relative",
                    display: "block",
                    overflow: "hidden"
                })

                $("#frame").css({
                    position: "absolute",
                    top: -($scope.spriteSet.config.offsetY + ($scope.spriteSet.config.tileSize * $scope.selectedFrame.y) + ($scope.spriteSet.config.margin * $scope.selectedFrame.y)),
                    left: -($scope.spriteSet.config.offsetX + ($scope.spriteSet.config.tileSize * $scope.selectedFrame.x) + ($scope.spriteSet.config.margin * $scope.selectedFrame.x))
                })
            }

            var resize = function () {
                $("#image-container").width($("#body").innerWidth() - $("#properties").outerWidth(true));
                $("#image-container").height($(window).height() - $("#header").outerHeight() - 40);
            }

            resize();
            window.onresize = resize();

            $scope.onSpriteSelectionMouseDown = function (ev) {
                var x = ev.offsetX;
                var y = ev.offsetY;

                var selectedTileX = Math.floor((x - $scope.spriteSet.config.offsetX) / ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin));
                var selectedTileY = Math.floor((y - $scope.spriteSet.config.offsetY) / ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin));

                $scope.selectedFrame = {
                    x: selectedTileX,
                    y: selectedTileY,
                    width: 1,
                    height: 1
                }
                $scope.mouseIsDown = true;
                update_visualizations();
            }

            $scope.onSpriteSelectionMouseMove = function (ev) {
                if (!$scope.mouseIsDown) {
                    return;
                }

                var x = ev.offsetX;
                var y = ev.offsetY;

                var selectedTileX = Math.floor((x - $scope.spriteSet.config.offsetX) / ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin));
                var selectedTileY = Math.floor((y - $scope.spriteSet.config.offsetY) / ($scope.spriteSet.config.tileSize + $scope.spriteSet.config.margin));

                var width = selectedTileX - $scope.selectedFrame.x + 1;
                width = width > 1 ? width : 1;
                var height = selectedTileY - $scope.selectedFrame.y + 1;
                height = height > 1 ? height : 1;

                $scope.selectedFrame.width = width;
                $scope.selectedFrame.height = height;

                update_visualizations();
            }

            $scope.onSpriteSelectionMouseUp = function (ev) {
                $scope.mouseIsDown = false;
            }

            $scope.add_selected_frame = function () {
                if ($scope.selectedFrame.id == undefined || $scope.selectedFrame.id == '' || $scope.selectedFrame.id == null) {
                    alert("Frames must have a id");
                } else {
                    $scope.spriteSet.frames[$scope.selectedFrame.id] = $scope.selectedFrame;
                    $scope.clear_selected_frame();
                }
            }

            $scope.clear_selected_frame = function () {
                $scope.selectedFrame = null;
                update_visualizations();
            }

            $scope.selectFrame = function (id) {
                $scope.selectedFrame = $scope.spriteSet.frames[id];
                update_visualizations();
            }

            $scope.save = function () {
                var result = SpriteSet.save($scope.spriteSet);
                if (result.success) {
                    alert("Saved!")
                } else {
                    alert(result.message);
                }
            }


        }]);

    editorControllers.controller('spritesEditController', ['$scope', '$routeParams', 'SpriteSet', function ($scope, $routeParams, SpriteSet) {
            if ($routeParams.spritesetId) {
                var loadedSpriteset = SpriteSet.get({'id': $routeParams.spritesetId});
                loadedSpriteset.$promise.then(function () {
                    $scope.spriteSet = loadedSpriteset;
                })
            }

            var generateDefaultSprite = function () {
                $scope.currentSprite = {
                    offsetX: 0,
                    offsetY: 0,
                    frameDisplayTime: 500
                };
                $scope.currentIsInArray = false;
                $scope.currentFrames = [];
            }
            

            generateDefaultSprite();

            $scope.addSelectedFrameToSprite = function (frameId) {
                window.clearTimeout(frameDisplayTimeout);
                if (!$scope.currentSprite.frames) {
                    $scope.currentSprite.frames = [];
                }
                $scope.currentFrames.push(getFrameFromSpriteset(frameId));
                $scope.currentSprite.frames.push(frameId);
                updateFrameDisplay();
            }

            $scope.selectSprite = function (id) {
                window.clearTimeout(frameDisplayTimeout);
                for (var i = 0; i < $scope.spriteSet.sprites.length; i++) {
                    if ($scope.spriteSet.sprites[i].id === id) {
                        $scope.currentSprite = $scope.spriteSet.sprites[i];
                        $scope.currentFrames = [];
                        for (var frameId = 0; frameId < $scope.currentSprite.frames.length; frameId++) {
                            $scope.currentFrames.push(getFrameFromSpriteset($scope.currentSprite.frames[frameId]));
                        }
                        $scope.currentIsInArray = true;
                        return $scope.currentSprite;
                    }
                    updateFrameDisplay();
                }
                return null;
            }

            $scope.addCurrentSprite = function () {
                window.clearTimeout(frameDisplayTimeout);
                if (!$scope.spriteSet.sprites) {
                    $scope.spriteSet.sprites = [];
                }
                $scope.spriteSet.sprites.push($scope.currentSprite);

                generateDefaultSprite();
            }

            $scope.newSprite = function () {
                generateDefaultSprite();
            }

            $scope.updateCurrentSprite = function () {
                generateDefaultSprite();
            }

            $scope.save = function () {
                var result = SpriteSet.save($scope.spriteSet);
                if (result.success) {
                    alert("Saved!")
                } else {
                    alert(result.message);
                }
            }

            var getFrameFromSpriteset = function (frameId) {
                console.log("Finding " + frameId);
                console.log($scope.spriteSet);
                var frames = $scope.spriteSet.frames;
                return frames[frameId];
            }
            
            var currentDisplayFrame = 1;
            var frameDisplayTimeout = null;
            
            var updateFrameDisplay = function(){
                currentDisplayFrame++;
                if(currentDisplayFrame>$scope.currentFrames.length){
                    currentDisplayFrame = 1;
                }
                $("#sprite-preview > div").hide();
                $("#sprite-preview > div:nth-child(" + currentDisplayFrame + ")").show();
                frameDisplayTimeout = window.setTimeout(updateFrameDisplay,$scope.currentSprite.frameDisplayTime);
            }
            $scope.updateFrameDisplay = updateFrameDisplay();
            
            


        }]);
    
    editorControllers.controller('mapsEditController', ['$scope', '$routeParams', 'WorldMap', function ($scope, $routeParams, WorldMap) {
            $scope.maps = WorldMap.query();


        }]);

})();


