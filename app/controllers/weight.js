import Ember from 'ember';

export default Ember.Controller.extend({
  showAddEditWeight: false,
  actions: {
    viewWeight: function() {
      console.log(this.model);
      this.set('showAddEditWeight', !this.showAddEditWeight);
    }
  },
});
