import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    "use strict";

    this.controllerFor('register').set('errors', false);

    return this.store.createRecord('user');
  }
});
