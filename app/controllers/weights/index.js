import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['weighed_date'],
  sortAscending: false,
  recordsPerPage: 10,
  startRecord: 1,
  page: 1,
  totalPages: 1,
  prevDisabled: true,
  nextDisabled: true,
  stats: false,
  targetWeight: false,
  currentWeight: false,
  actions: {
    prevPage: function() {
      "use strict";

      if(this.page > 1) {
        this.decrementProperty('page', 1);
      } else {
        this.set('page', 1);
      }

    },
    nextPage: function() {
      "use strict";

      if(this.page < this.totalPages) {
        this.incrementProperty('page', 1);
      }

    },
  },
  arrangedContent: function() {
    "use strict";

    this.set('startRecord', (this.page - 1) * this.recordsPerPage);
    this.set('totalPages', Math.ceil(this.get('content.length') /
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

    return this.get('content').slice(this.startRecord,
                                     this.startRecord + this.recordsPerPage);

  }.property('weight', 'page', 'totalPages', 'prevDisabled', 'nextDisabled')
});
