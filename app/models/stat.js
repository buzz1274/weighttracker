import DS from 'ember-data';

export default DS.Model.extend({
  changeLastWeek: DS.attr('number'),
  changeLastMonth: DS.attr('number'),
  changeLastYear: DS.attr('number'),
  changeGreatest: DS.attr('number'),
  dateToTarget: DS.attr('date'),
  accountCreated: DS.attr('date'),
  maxUnderweightWeight: DS.attr('number'),
  maxNormalWeight: DS.attr('number'),
  maxOverweightWeight: DS.attr('number'),
  currentWeight: DS.attr(),
  targetWeight: DS.attr('number'),
  averageWeight: DS.attr('number'),
  weightToTarget: DS.attr('number'),
  startWeight: DS.attr('number'),
  maxWeight: DS.attr(),
  minWeight: DS.attr()
});
