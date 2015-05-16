export default DS.Model.extend({
  weightID: DS.attr('number'),
  weight: DS.attr('number'),
  date: DS.attr('date'),
  difference: DS.attr('number'),
  gone: DS.attr('number'),
  formatted_weight: function() {
    return this.get('weight').toFixed(1);
  }.property('weight'),
  formatted_date: function() {
    return moment(this.get('date')).format('MMMM D, YYYY');
  }.property('date')
});
