import DS from 'ember-data';

export default DS.Model.extend({
  weight_id: DS.attr('number'),
  weight: DS.attr('number'),
  date: DS.attr('date'),
  change: DS.attr('number'),
  formatted_date: function() {
    "use strict";

    return window.moment(this.get('date')).format('MMMM D, YYYY');

  }.property('date')
});
