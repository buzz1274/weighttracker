import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  password: DS.attr('string'),
  repeat_password: DS.attr('string'),
  name: DS.attr('string'),
  date_of_birth: DS.attr('isodate'),
  sex: DS.attr('string'),
  height: DS.attr('number'),
  weight: DS.attr('number'),
  target_weight: DS.attr('number'),
  formatted_date: function() {
    "use strict";

    return window.moment(this.get('date_of_birth')).format('MMMM D, YYYY');

  }.property('date_of_birth')
});
