import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['index'],
  actions: {
    editWeight: function() {
      var indexController = this.get('controllers.index');
      indexController.set('showAddEditWeight', true);
      indexController.set('weight', this.model);
    }
  },
});
