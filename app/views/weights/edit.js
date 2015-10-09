import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'weights/edit',

  keyPress: function(e) {
    "use strict";

    if(e.keyCode === 13) {
      this.get('controller').send('save');
    }

  }

});
