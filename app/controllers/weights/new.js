import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save() {
      "use strict";

      var date = new Date(window.moment.utc(this.get('model').get('formatted_date')));

      if(date !== 'Invalid Date') {
        this.get('model').set('date', date);
      }

      this.get('model').save().then(() => {
        this.transitionToRoute('weights.index');
      });

      return false;
    },
    cancel() {
      "use strict";

      this.get('model').deleteRecord();
      this.transitionToRoute('weights.index');

      return false;
    }
  }
});
