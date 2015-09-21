import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    "use strict";

    return Ember.RSVP.hash({
      stats: this.store.findAll('stat'),
      weights: this.store.findAll('weight')
    });
  },
  setupController: function(controller, model) {
    "use strict";

    controller.set('stats', model.stats);
    controller.set('content', model.weights);
    controller.set('targetWeight', model.stats.objectAt(0).get('targetWeight'));
    controller.set('currentWeight', model.stats.objectAt(0).get('currentWeight'));

  }
});
