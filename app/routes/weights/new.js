import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  showAddEditWeight: true,
  model() {
    "use strict";
    return this.store.createRecord('weight');
  }
});
