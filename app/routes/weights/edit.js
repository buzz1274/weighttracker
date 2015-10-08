import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function (params) {
    "use strict";

    var that = this;

    return Ember.RSVP.hash({
      weight: this.store.find('weight', params.weight_id)
    }).catch(function(response) {
      if (response.status === 401) {
        that.get('session').invalidate();
      } else {
        that.transitionToRoute('error');
      }
    });

  },
  setupController: function(controller, model) {
    "use strict";

    controller.set('errors', false);
    controller.set('model', model.weight);

  },
  deactivate: function() {
    "use strict";

      this.controllerFor('weights.edit').get('model').rollback();

  }
});
