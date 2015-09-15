import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  changeLastWeek: DS.attr('number'),
  changeLastMonth: DS.attr('number'),
  changeLastYear: DS.attr('number'),
  changeAllTime: DS.attr('number'),
  dateToTarget: DS.attr('date'),
  sex: DS.attr('string'),
  height: DS.attr('number'),
  currentWeight: DS.attr('number'),
  targetWeight: DS.attr('number'),
  weightToTarget: DS.attr('number'),
  startWeight: DS.attr('number'),
  formattedDateToTarget: function() {
    "use strict";

    if(this.get('dateToTarget')) {
      return window.moment(this.get('dateToTarget')).format('MMMM D, YYYY');
    } else {
      return;
    }

  }.property('dateToTarget')
});
