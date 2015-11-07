import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function() {
    "use strict";

    if(this.get('session').isAuthenticated) {
      var hash = window.location.search.substring(1).split('=')[0];

      if(hash === 'hash') {
        this.transitionTo('change-password');
      } else {
        this.transitionTo('weights');
      }
    }

  }
});
