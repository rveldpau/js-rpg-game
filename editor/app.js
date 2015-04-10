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
                otherwise({
                    redirectTo: '/'
                })
    }]);