import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(date) {
  "use strict";

  return window.moment(date).format('MMMM D, YYYY');
});
