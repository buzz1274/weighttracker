import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string')
  /*
  sex: DS.attr('string'),
  height: DS.attr('number'),
  targetWeight: DS.attr('number'),
  currentWeight: DS.attr('number'),
  weightToTarget: DS.attr('number'),
  dateToTarget: DS.attr('date'),
  weightLastWeek: DS.attr('number'),
  weightLastMonth: DS.attr('number'),
  weightLastYear: DS.attr('number')
  */
});
