import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('title', 'Display graph & table');
    controller.set('weights', this.store.find('weight'));
  }
});
