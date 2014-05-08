(function () {
    'use strict';

    App.WelcomeView = Ember.View.extend({
        template: Ember.TEMPLATES['welcome.hbs'],
        outlet: 'modal'
    })

})();