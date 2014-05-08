(function () {
    'use strict';

    App.WelcomeController = Ember.View.extend({
        actions: {
            openModal: function(modalName) {
                //console.log(Ember.TEMPLATES['register.hbs']);
                console.log(modalName);
                return this.render(modalName, {
                    into: 'application',
                    outlet: 'main',
                    controller: 'welcome'
                });
            }
        }
    })

})();