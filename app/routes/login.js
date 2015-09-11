import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    "use strict";

    if(this.get('session').isAuthenticated) {
      this.transitionTo('index');
    }

    controller.set('errorMessage', false);
    controller.set('username', '');
    controller.set('password', '');

  }
});
