(function () {
    'use strict';

    App.RegisterRoute = Ember.Route.extend({

        renderTemplate: function() {
            alert("DERP");
            this.render('register', {
                into: 'welcome',
                outlet: 'main'
            });
        }

    });

})();