import Ember from 'ember';
import app from '../app';

export default Ember.Controller.extend({
  errorMessage: false,
  actions: {
    authenticate() {
      "use strict";

      var data = this.getProperties('username', 'password');
      var that = this;

      this.get('session').authenticate('authenticator:custom', data).then(null, function(message) {
        if(!message) {
          app.idleTime = 0;
          that.transitionToRoute('error');
        } else {
          that.set('errorMessage', message);
          that.set('username', '');
          that.set('password', '');
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
