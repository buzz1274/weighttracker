import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    "use strict";

    var that = this;

    return Ember.RSVP.hash({
      stats: this.store.findAll('stat'),
      weights: this.store.findAll('weight')
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

    controller.set('stats', model.stats);
    controller.set('content', model.weights);
    controller.set('targetWeight', model.stats.objectAt(0).get('targetWeight'));
    controller.set('currentWeight', model.stats.objectAt(0).get('currentWeight'));

    this._super(controller, model.weights);

  },
  removeModalMessage: function() {
    "use strict";

    this.get('controller').set('modalMessage', false);

  }.on('deactivate')
});
