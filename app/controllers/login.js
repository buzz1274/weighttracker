import Ember from 'ember';

export default Ember.Controller.extend({
  errorMessage: false,
  actions: {
    authenticate() {
      "use strict";

      var data = this.getProperties('username', 'password');
      var that = this;

      this.get('session').authenticate('authenticator:custom', data).then(null, function(message) {
        that.set('errorMessage', message);
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
