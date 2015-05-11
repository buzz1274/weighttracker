import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('weight');
  },
  setupController: function(controller) {
    //this.set('weights = this.store.find('weight').slice(0, 10);


    //console.log(weights);

    //controller.set('weights', this.model());
  },
});
