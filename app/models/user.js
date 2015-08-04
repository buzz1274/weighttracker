import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  password: DS.attr('string'),
  repeat_password: DS.attr('string'),
  name: DS.attr('string'),
  date_of_birth: DS.attr('date'),
  sex: DS.attr('string'),
  height: DS.attr('number'),
  weight: DS.attr('string'),
  formatted_date: function() {
    "use strict";

    if(this.get('date')) {
      return window.moment(this.get('date')).format('MMMM D, YYYY');
    } else {
      return;
    }

  }.property('date')
});
