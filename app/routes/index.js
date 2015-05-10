import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('weight');
  },
  setupController: function(controller) {
    //this.set('weights = this.store.find('weight').slice(0, 10);


    //console.log(weights);

    controller.set('weights', this.model());
  },
  actions: {
    nextPage: function() {
      alert("NEXT CLICKED");
    },
    prevPage: function() {
      alert("PREV CLICKED");
    },
    viewWeight: function() {
      alert("VIEW WEIGHT CLICKED");
    },
  },
  arrangedContent: function() {
    return this.model().slice(0, 10);
  }.property('weights')
});
