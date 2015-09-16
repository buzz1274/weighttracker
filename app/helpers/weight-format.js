import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(weight) {
  "use strict";

  return weight.toFixed(1);
});
