import Ember from 'ember';

export default Ember.Controller.extend({
  sex: ["-", "Male", "Female"],
  errors: false,
  actions: {

    register() {
      "use strict";

      /*
      var date = new Date(this.get('model').get('formatted_date'));

      if(date !== 'Invalid Date') {
        this.get('model').set('date', date);
      }
      */

      var that = this;

      this.get('model').save().then(() => {
        this.transitionToRoute('login');
      }).catch(function(response) {
        that.set('errors', response.responseJSON.errors);
      });

      return false;
    },
    cancel() {
      "use strict";

      this.get('model').deleteRecord();
      this.transitionToRoute('index');

      return false;
    }
  }
});
