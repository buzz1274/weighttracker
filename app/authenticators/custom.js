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
          resolve({token: response.token});
        });
      }, function(xhr, status, error) {
        var response = JSON.parse(xhr.responseText);

        var login_error = true;

        console.log(response);
        console.log(status);
        console.log(error);
        console.log(response.errors);
        Ember.run(function() {
          reject(response.errors);
        });
      });
    });

  },
  restore: function() {},
  invalidate: function() {}
});
