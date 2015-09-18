import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function() {
    "use strict";

    if(this.get('session').isAuthenticated) {
      this.transitionTo('weights');
    }

  }
});
