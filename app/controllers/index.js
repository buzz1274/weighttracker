import Ember from 'ember';

export default Ember.ArrayController.extend({
  recordsPerPage: 15,
  page: 1,
  actions: {
    prevPage: function() {
      if(this.page > 1) {
        this.decrementProperty('page', 1);
      } else {
        this.set('page', 1);
      }
    },
    nextPage: function() {
      this.incrementProperty('page', 1);
    },
    viewWeight: function() {
      console.log("VIEW WEIGHT CLICKED");
    }
  },
  arrangedContent: function() {
    var start = (this.page - 1) * this.recordsPerPage;

    return this.get('content').slice(start, start + this.recordsPerPage);

  }.property('weight', 'page')
});
