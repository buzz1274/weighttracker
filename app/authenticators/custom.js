import Base from 'simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({
  authenticate: function(data) {
    "use strict";

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url: window.location.protocol+'//'+window.location.hostname+'/api/login',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
      }).then(function(response) {
        Ember.run(function() {
          response = JSON.parse(response);
          resolve({token: response.token,
                   userId: response.userId,
                   name: response.name});
        });
      }, function(xhr) {
        var response = JSON.parse(xhr.responseText);
        Ember.run(function() {
          reject(response.errors);
        });
      });
    });

  },
  restore: function(data) {
    "use strict";

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });

  },
  invalidate: function() {}
});
