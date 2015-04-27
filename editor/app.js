var editorApp = angular.module('editorApp', ['ngResource', 'ngRoute', 'editorServices', 'editorDirectives', 'editorControllers']);

editorApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'editor/welcome.html',
                    controller: 'welcomeController'
                }).
                when('/images', {
                    templateUrl: 'editor/partials/sprite/images.html',
                    controller: 'imagesController'
                }).
                when('/images/:selectedImageId', {
                    templateUrl: 'editor/partials/sprite/image.html',
                    controller: 'imagesController'
                }).
                when('/spritesets', {
                    templateUrl: 'editor/partials/sprite/spritesets.html',
                    controller: 'spritesetController'
                }).
                when('/spritesets/new', {
                    templateUrl: 'editor/partials/sprite/spriteset.html',
                    controller: 'spritesetEditController'
                }).
                when('/spritesets/:spritesetId', {
                    templateUrl: 'editor/partials/sprite/spriteset.html',
                    controller: 'spritesetEditController'
                }).
                when('/spritesets/:spritesetId/sprites', {
                    templateUrl: 'editor/partials/sprite/sprites.html',
                    controller: 'spritesEditController'
                }).
                when('/world/maps', {
                    templateUrl: 'editor/partials/world/maps.html',
                    controller: 'mapsEditController'
                }).
                when('/world/maps/new', {
                    templateUrl: 'editor/partials/world/map.html',
                    controller: 'mapsEditController'
                }).
                when('/world/maps/:mapId', {
                    templateUrl: 'editor/partials/world/map.html',
                    controller: 'mapsEditController'
                }).
                otherwise({
                    redirectTo: '/'
                })
    }]);