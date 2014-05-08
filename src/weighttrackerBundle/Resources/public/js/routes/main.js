(function () {
    'use strict';

    App.MainRoute = Ember.Route.extend({

        renderTemplate: function() {
            this.render('main', {
                into: 'application',
                outlet: 'main'
            });
        }

    });

})();