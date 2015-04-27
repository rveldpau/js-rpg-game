var editorServices = angular.module('editorServices', []);

editorServices.factory('GameImage', ['$resource',
    function ($resource) {
        return $resource('backend/sprite/image.php', {}, {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET', params: {id: 'id'}, isArray: false}
        });
    }
]);

editorServices.factory('SpriteSet', ['$resource',
    function ($resource) {
        return $resource('backend/sprite/set.php', {}, {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET', params: {id: 'id'}, isArray: false},
            save: {
                method: 'POST',
                isArray: false}
        });
    }
]);


editorServices.factory('WorldMap', ['$resource',
    function ($resource) {
        return $resource('backend/world/map.php', {}, {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET', params: {id: 'id'}, isArray: false},
            save: {
                method: 'POST',
                isArray: false}
        });
    }
]);