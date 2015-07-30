import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['index'],
  actions: {
    editWeight: function() {
      "use strict";

      console.log("EDIT WEIGHT IN CONTROLLER");

      var indexController = this.get('controllers.index');
      indexController.set('showAddEditWeight', true);
      indexController.set('weight', this.model);

      //indexController.set('showAddEditWeight', false);

      //return true;

    },
    addWeight: function() {
      "use strict";

      console.log("ADD WEIGHT IN CONTROLLER");

      return false;

    }
  }
});
