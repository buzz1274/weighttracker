import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    "use strict";

    return this.store.findAll('weight');
  },
  setupController: function(controller, model) {
    "use strict";

    controller.set('stats', this.store.findAll('stats'));
    controller.set('content', model);

  }
});
