import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(date) {
  return moment(date).format('MMMM Do YYYY');
});
