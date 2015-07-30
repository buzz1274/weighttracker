import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save() {
      "use strict";

      this.get('model').save().then(() => {
        this.transitionToRoute('index');
      });

      return false;
    },
    cancel() {
      "use strict";
      
      this.transitionToRoute('index');

      return false;
    }
  }
});
