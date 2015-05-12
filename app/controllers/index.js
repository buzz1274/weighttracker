import Ember from 'ember';

export default Ember.ArrayController.extend({
  recordsPerPage: 15,
  page: 1,
  totalPages: 1,
  prevDisabled: true,
  nextDisabled: true,
  actions: {
    prevPage: function() {
      if(this.page > 1) {
        this.decrementProperty('page', 1);
      } else {
        this.set('page', 1);
      }
    },
    nextPage: function() {
      if(this.page < this.totalPages) {
        this.incrementProperty('page', 1);
      }
    },
    viewWeight: function() {
      console.log("VIEW WEIGHT CLICKED");
    }
  },
  arrangedContent: function() {
    var start = (this.page - 1) * this.recordsPerPage;
    this.set('totalPages', Math.floor(this.get('content.length') /
                                      this.recordsPerPage));

    if(this.page < this.totalPages) {
      this.set('nextDisabled', false);
    } else {
      this.set('nextDisabled', true);
    }

    if(this.page === 1) {
      this.set('prevDisabled', true);
    } else {
      this.set('prevDisabled', false);
    }

    return this.get('content').slice(start, start + this.recordsPerPage);

  }.property('weight', 'page', 'totalPages', 'prevDisabled', 'nextDisabled')
});
