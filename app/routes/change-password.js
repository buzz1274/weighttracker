import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController: function(controller) {
    "use strict";

    controller.set('errorMessage', false);
    controller.set('password', '');
    controller.set('passwordRepeat', '');

  }
});
