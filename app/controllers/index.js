import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'weight',
  showAddEditWeight: false,
  recordsPerPage: 20,
  weight: false,
  page: 1,
  totalPages: 1,
  prevDisabled: true,
  nextDisabled: true,
  actions: {
    prevPage: function() {
      if(this.page > 1) {
        this.set('page', this.page - 1);
      } else {
        this.set('page', 1);
      }
    },
    nextPage: function() {
      if(this.page < this.totalPages) {
        this.set('page', this.page + 1);
      } else {
        this.set('page', this.totalPages);
      }
    },
    addWeight: function() {
      this.set('weight', false);
      this.set('showAddEditWeight', true);
    },
    saveWeight: function() {
      var weight = this.get('weight');

      console.log("SAVE WEIGHT");

      if(weight) {
        this.get('weight').save();
        console.log('edit weight');
      } else {
        console.log('add weight');
      }

      this.set('showAddEditWeight', false);
    },
    deleteWeight: function() {
      console.log('delete weight');

      this.set('showAddEditWeight', false);
    },
    closeWeightModal: function() {
      this.set('showAddEditWeight', false);
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

  }.property('weight', 'page', 'totalPages',
             'prevDisabled', 'nextDisabled',
             'content')
});
