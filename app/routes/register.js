import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    "use strict";

    if(this.get('session').isAuthenticated) {
      this.transitionTo('index');
    }

    controller.set('errors', false);
    controller.set('model', this.store.createRecord('user'));

  }
});
