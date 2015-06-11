/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'wt',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-eval' alpha.weighttracker.zz50.co.uk:35729",
      'font-src': "'self'",
      'connect-src': "'self' ws://alpha.weighttracker.zz50.co.uk:35729 alpha.weighttracker.zz50.co.uk",
      'img-src': "'self'",
      'style-src': "'self'",
      'media-src': "'self'"
    }

    ENV.APP.hostname = 'alpha.weighttracker.zz50.co.uk'
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.hostname = 'weighttracker.zz50.co.uk'
  }

  return ENV;
};
