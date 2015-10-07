import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    "use strict";

    if(this.get('session').isAuthenticated) {
      this.transitionTo('weights');
    }

    controller.set('errorMessage', false);
    controller.set('username', '');
    controller.set('password', '');

  },
  deactivate: function() {
    "use strict";

    this._super();
    this.controllerFor('login').set('autoLogout', false);

  }
});
