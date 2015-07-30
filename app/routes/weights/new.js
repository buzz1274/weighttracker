import Ember from 'ember';

export default Ember.Route.extend({
  showAddEditWeight: true,
  model() {
    "use strict";
    return this.store.createRecord('weight');
  }
});
