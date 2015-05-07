import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  actions: {
    error: function() {
      this.transitionTo('not-found', 'application-error');
    }
  }
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('login');
  this.route('not-found', { path: '/*path' });
});

export default Router;
