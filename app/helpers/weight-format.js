import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(weight) {
  return weight.toFixed(1);
});
