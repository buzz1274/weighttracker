export default DS.Model.extend({
  weightID: DS.attr('number'),
  weight: DS.attr('number'),
  date: DS.attr('date'),
  difference: DS.attr('number'),
  gone: DS.attr('number')
});
