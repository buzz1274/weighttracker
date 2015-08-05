import DS from 'ember-data';

export default DS.Model.extend({
  weight: DS.attr('number'),
  date: DS.attr('date'),
  lost: DS.attr('number'),
  formatted_weight: function() {
    "use strict";

    var weight = this.get('weight');

    if(weight) {
      return this.get('weight').toFixed(1);
    } else {
      return false;
    }

  }.property('weight'),
  formatted_date: function() {
    "use strict";

      if(this.get('date')) {
        return window.moment(this.get('date')).format('MMMM D, YYYY');
      } else {
        return;
      }

  }.property('date')
});
