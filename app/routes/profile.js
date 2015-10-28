import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function () {
    "use strict";

    var that = this;

    return Ember.RSVP.hash({
      user: this.store.find('user', this.get('session.secure.userID'))
    }).catch(function(response) {
      if (response.status === 401) {
        that.get('session').invalidate();
      } else if(response.status === 404) {
        that.transitionTo('not-found', '');
      } else {
        that.transitionTo('error');
      }
    });

  },
  setupController: function(controller, model) {
    "use strict";

    controller.set('errors', false);
    controller.set('model', model.user);

  },
  deactivate: function() {
    "use strict";

    this.controllerFor('profile').get('model').rollback();

  }
});
