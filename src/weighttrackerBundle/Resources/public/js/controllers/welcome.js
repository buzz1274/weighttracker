(function () {
    'use strict';

    App.WelcomeController = Ember.View.extend({
        actions: {
            openModal: function(modalName) {
                console.log(modalName);
                return this.render('register', {
                    into: 'welcome',
                    outlet: 'main'
                });
            }
        }
    })

})();