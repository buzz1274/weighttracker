import Ember from 'ember';

export default Ember.Controller.extend({
  errors: false,
  action_edit: true,
  needs: ['weights/index'],
  actions: {
    save() {
      "use strict";

      var date = new Date(window.moment.utc(this.get('model').get('formatted_date')));

      if(date !== 'Invalid Date') {
        this.get('model').set('date', date);
      }

      var that = this;

      this.get('model').save().then(() => {
        this.get('controllers.weights/index').set('modalMessage', 'Weight edited');
        this.transitionToRoute('weights.index');
      }).catch(function(response) {
        if(response.status === 401) {
          that.get('session').invalidate();
        } else if(response.status === 404) {
          that.transitionToRoute('not-found', '');
        } else if(response.status === 500 || !response.responseJSON ||
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

      this.get('model').rollback();
      this.transitionToRoute('weights.index');

      return false;
    }
  }
});
