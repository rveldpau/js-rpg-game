var editorDirectives = angular.module('editorDirectives', []);

editorDirectives.directive('gameImage', [function () {
        return {
            templateUrl: 'editor/directives/sprite/image.html',
            replace: true,
            restrict: 'E',
            scope: {
                imgId: '@'
            }
        }
    }]);

editorDirectives.directive('spriteFrame', [function () {
        
        return {
            templateUrl: 'editor/directives/sprite/frame.html',
            replace: true,
            restrict: 'E',
            scope: {
                frame: '=',
                spriteSet: '='
            },

        }
    }]);
