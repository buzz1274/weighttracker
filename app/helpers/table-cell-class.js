import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(weight) {
  if(weight > 0) {
    return 'danger';
  } else {
    return 'success';
  }
});
