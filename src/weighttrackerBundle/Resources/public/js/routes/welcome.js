(function () {
    'use strict';

    App.WelcomeRoute = Ember.Route.extend({

        renderTemplate: function() {
            this.render('welcome', {
                into: 'application',
                outlet: 'modal'
            });
        }

    });

})();