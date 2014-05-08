(function () {
    'use strict';

    App.WelcomeRoute = Ember.Route.extend({

        renderTemplate: function() {
            this.render('welcome', {
                into: 'application',
                outlet: 'main'
            });
        },

        events: {
            openRegisterModal: function() {
                this.render('register', { into: 'application', outlet: 'modal' });
            },
            openLoginModal: function() {
                this.render('login', { into: 'application', outlet: 'modal' });
            }
        }

    });

})();