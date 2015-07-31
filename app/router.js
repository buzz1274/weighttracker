import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  actions: {
    error: function() {
      "use strict";

      this.transitionTo('not-found', 'application-error');
    }
  }
});

export default Router.map(function() {
  "use strict";

  this.route('index', { path: '/' });
  this.route('login');
  this.route('not-found', { path: '/*path' });

  this.route('weights', function() {
    this.route('new');
  });

  this.route('register');
});
