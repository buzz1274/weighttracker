import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    "use strict";

    controller.set('errorMessage', false);
    controller.set('username', '');
    controller.set('password', '');
  }
});
