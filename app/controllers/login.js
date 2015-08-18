import Ember from 'ember';

export default Ember.Controller.extend({
  errors: false,
  actions: {
    authenticate() {
      "use strict";

      var data = this.getProperties('username', 'password');

      console.log(data);

      console.log(this.get('session').authenticate('authenticator:custom', data));

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
