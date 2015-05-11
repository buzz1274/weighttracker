import Ember from 'ember';

export default Ember.ArrayController.extend({
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
    console.log(this.model);
    return this.model;
  }.property('weight')
});
