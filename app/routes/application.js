import app from '../app';
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    invalidateSession() {
      "use strict";
      this.get('session').invalidate();
    }
  },
  setupAutoLogout: function() {
    "use strict";

    setInterval(function() {
      app.idleTime = app.idleTime + 1;
    }, 60000);


    Ember.$('body').mousemove(function() {
      app.idleTime = 0;
    });

    Ember.$(this).keypress(function() {
      app.idleTime = 0;
    });

    this.autoLogoutTimer();

  }.on('init'),
  autoLogoutTimer: function() {
    "use strict";

    Ember.run.later(this, this.autoLogoutTimer, 1000);

    if(this.get('session').isAuthenticated &&
       app.idleTime >= app.idleMax) {
      this.get('session').invalidate();
    }

  },
});
