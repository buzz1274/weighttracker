(function () {
    'use strict';

    App.WelcomeRoute = Ember.Route.extend({

        setupController: function(controller, song) {
            controller.set('model', song);
        },

        renderTemplate: function() {
            this.render('welcome', {
                into: 'application',
                outlet: 'main'
            });
        },

        events: {
            openRegisterModal: function() {
                var controller = this.controllerFor("Register");
                this.controllerFor("Register").registerFailed = false;
                this.controllerFor("Register").init();
                this.render('register', {into: 'application', outlet: 'modal',
                                         controller: controller});
            },
            openLoginModal: function() {
                this.render('login', { into: 'application', outlet: 'modal' });
            }
        }

    });

})();