import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    //this.set('weights = this.store.find('weight').slice(0, 10);


    //console.log(weights);

    controller.set('weights', this.store.find('weight'));
  },
  actions: {
    nextPage: function() {
      this.controller.set('weights', this.model);
    },
    prevPage: function() {
      alert("PREV CLICKED");
    }
  },
  arrangedContent: function() {
    return this.get('weights').slice(0, 10);
  }.property('weights')
});
