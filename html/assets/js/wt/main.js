require.config({
    paths: {
        "jquery": "//code.jquery.com/jquery-2.1.3.min",
        "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        "jquery_ui": "//code.jquery.com/ui/1.11.4/jquery-ui.min",
        "Ember": "//cdnjs.cloudflare.com/ajax/libs/ember.js/1.11.3/ember.min",
        "Handlebars": "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.2/handlebars.amd"
    },
    shim: {
        Ember: {
            deps: ['Handlebars', 'jquery'],
            exports: 'Ember'
        },
        "bootstrap": {
            exports : "$",
            deps: ['jquery']
        },
        "jquery_ui": {
            exports : "$",
            deps: ['jquery']
        }
    }

});

require(["wt"], function (wt) {
    "use strict"

    wt.deferReadiness();

    require(['router', 'routes/index', 'views/index'],
        function(Router) {
            Router();

            wt.advanceReadiness();

            console.log("DONE");

        }
    );

});