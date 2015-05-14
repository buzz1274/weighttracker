import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['index'],
  actions: {
    viewWeight: function() {
      var indexController = this.get('controllers.index');
      indexController.set('showAddEditWeight', !indexController.showAddEditWeight);
      indexController.set('weight', this.model);
    }
  },
});
