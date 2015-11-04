import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    "use strict";

    controller.set('errorMessage', false);
    controller.set('passwordResetMessage', false);
    controller.set('email', '');

  }
});
