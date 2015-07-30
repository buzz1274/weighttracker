export default DS.Model.extend({
  weightID: DS.attr('number'),
  weight: DS.attr('number'),
  date: DS.attr('date'),
  difference: DS.attr('number'),
  gone: DS.attr('number'),
  formatted_weight: function() {
    var weight = this.get('weight');
    if(weight) {
      return this.get('weight').toFixed(1);
    } else {
      return false;
    }
  }.property('weight'),
  formatted_date: function() {
    return moment(this.get('date')).format('MMMM D, YYYY');
  }.property('date')
});
