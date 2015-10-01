import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  showAddEditWeight: true,
  setupController: function(controller) {
    "use strict";

    controller.set('errors', false);
    controller.set('model', this.store.createRecord('weight'));

  },
  deactivate: function() {
    "use strict";

    var model = this.controllerFor('weights.new').get('model');
    model.rollback();
  }
});
