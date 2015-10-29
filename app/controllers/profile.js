import Ember from 'ember';

export default Ember.Controller.extend({
  sex: ["-", "Male", "Female"],
  needs: ['weights/index'],
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
        this.get('controllers.weights/index').set('modalMessage', 'Profile edited');
        this.set('session.secure.name', this.get('model.name'));
        this.transitionToRoute('weights');
      }).catch(function(response) {
        if(response.status === 500 || !response.responseJSON ||
          !response.responseJSON.errors) {
          that.transitionToRoute('error');
        } else {
          that.set('errors', response.responseJSON.errors);
        }
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
