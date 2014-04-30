require.config({
    paths: {
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min",
        "bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "jquery_ui": "//code.jquery.com/ui/1.9.1/jquery-ui.min",
        "angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min",
        "angular.route": "//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.3/angular-route.min"
    },
    shim: {
        "angular": ['jquery'],
        "angular.route": ['angular'],
        "bootstrap": {
            exports : "$",
            deps: ['jquery']
        },
        "jquery_ui": {
            exports : "$",
            deps: ['jquery']
        },
        "my_angular": {
            exports: 'angular',
            deps: ['angular', 'angular.route']
        }
    }
});