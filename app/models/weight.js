import DS from 'ember-data';

export default DS.Model.extend({
  weight: DS.attr('number'),
  date: DS.attr('date'),
  change: DS.attr('number'),
});
