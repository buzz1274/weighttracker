import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'weights/index',
  didInsertElement: function() {
    "use strict";

    if(this.get('controller').get('modalMessage') !== false) {
      Ember.$('#messageModal').modal({
        show: true
      });
    }

  },

});
