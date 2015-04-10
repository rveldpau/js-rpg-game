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
                loadedSpriteset.$promise.then(function(){
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

})();

