import Ember from 'ember';

export default Ember.Controller.extend({
  errors: false,
  actions: {
    authenticate() {
      "use strict";

      var data = this.getProperties('username', 'password');

      console.log(data);

      if(!this.get('session').authenticate('authenticator:custom', data)) {
        this.errors = true;
      }
      console.log("DERP");

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
