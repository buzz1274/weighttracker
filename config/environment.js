/* jshint node: true */

module.exports = function(environment) {
  "use strict";

  var ENV = {
    modulePrefix: 'wt',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {}
    },
    APP: {}
  };

  if (environment === 'development') {

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-eval' dev.weighttracker.zz50.co.uk:35729",
      'font-src': "'self'",
      'connect-src': "'self' ws://dev.weighttracker.zz50.co.uk:35729 dev.weighttracker.zz50.co.uk",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'media-src': "'self'"
    }

    ENV.APP.hostname = 'dev.weighttracker.zz50.co.uk';

  }

  if (environment === 'test') {
    ENV.baseURL = '/';
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.hostname = 'weighttracker.zz50.co.uk';
  }

  ENV['simple-auth'] = {
    serverTokenRevocationEndpoint: '/logout',
  };

  return ENV;
};
