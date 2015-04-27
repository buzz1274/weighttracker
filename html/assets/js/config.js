require.config({
    paths: {
        "jquery": "//code.jquery.com/jquery-2.1.3.min",
        "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        "jquery_ui": "//code.jquery.com/ui/1.11.4/jquery-ui.min"
    },
    shim: {
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