import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function (params) {
    "use strict";

    //return this.modelFor('weight').findBy('id', params.id);
  },
  setupController: function(controller) {
    "use strict";

    controller.set('errors', false);
    controller.set('model', this.get('model'));

  },
  deactivate: function() {
    "use strict";

    //var model = this.controllerFor('weights.edit').get('model');
    //model.rollback();
  }
});
