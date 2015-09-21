import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(
  function(change, currentWeight, targetWeight) {
  "use strict";

  if(targetWeight === currentWeight) {
    return 'success';
  } else {
    if(currentWeight < targetWeight) {
      if(change <= 0) {
        return 'danger';
      } else {
        return 'success';
      }
    } else if(currentWeight > targetWeight) {
      if(change >= 0) {
        return 'danger';
      } else {
        return 'success';
      }
    }
  }
});
