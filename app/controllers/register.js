import Ember from 'ember';

export default Ember.Controller.extend({
  sex: ["-", "Male", "Female"],
  errors: false,
  actions: {

    register() {
      "use strict";

      if(this.get('model').get('formatted_date')) {
        this.get('model').set('date_of_birth',
          window.moment(this.get('model').get('formatted_date')).toDate());
      }

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
