import Base from 'simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({
  authenticate: function(data) {
    "use strict";

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url: window.location.protocol+'//'+window.location.hostname+'/api/login',
        async: true,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        xhrFields: {
          withCredentials:true
        },
      }).then(function(response) {
        Ember.run(function() {
          try {
            response = JSON.parse(response);
          } catch(error) {
            
          }
          resolve({token: response.token,
                   userID: response.userID,
                   name: response.name});
        });
      }, function(xhr) {
        if(!xhr.responseText) {
          reject();
        } else {
          var response = JSON.parse(xhr.responseText);
          Ember.run(function () {
            reject(response.errors);
          });
        }
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
  invalidate: function() {
    "use strict";

    return new Ember.RSVP.Promise(function(resolve) {
      Ember.$.ajax({
        url: window.location.protocol+'//'+window.location.hostname+'/api/logout',
        xhrFields: {
          withCredentials: true
        },
        type: 'DELETE'
      }).always(function() {
        resolve();
      });
    });

  }
});
