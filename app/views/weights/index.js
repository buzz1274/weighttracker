import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'weights/index',
  initialize: function() {
    "use strict";

  },
  didInsertElement: function() {
    "use strict";

    if(this.get('controller').get('modalMessage') !== false) {
      Ember.$('#messageModal').modal({
        show: true
      });

      Ember.$('#messageModal').on('hidden.bs.modal', function() {
        window.location = '/weights';
      });
    }

  }

});
