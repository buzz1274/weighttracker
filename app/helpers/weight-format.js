import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(weight) {
  "use strict";

  return Number(weight).toFixed(1);
});
