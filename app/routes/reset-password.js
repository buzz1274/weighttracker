import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    "use strict";

    if(this.get('session').isAuthenticated) {
      this.transitionTo('change-password');
    }

    var search = window.location.search.substring(1).split('=');

    if(search && search[0] && search[0] === 'hash' && search[1]) {
      this.get('session').authenticate('authenticator:custom',
                                       {hash: search[1]}).then(null, function(message) {

        console.log(message);

        if(message) {
          console.log(message);
          controller.set('errorMessage', message);
        }

      });
    }

    controller.set('errorMessage', false);
    controller.set('passwordResetMessage', false);
    controller.set('email', '');

  }
});
