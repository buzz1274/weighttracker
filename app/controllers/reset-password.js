import Ember from 'ember';

export default Ember.Controller.extend({
  email: '',
  errorMessage: false,
  passwordResetMessage: false,
  actions: {

    reset() {
      "use strict";

      var that = this;

      Ember.$.post(window.location.protocol+'//'+
                   window.location.hostname+
                   '/api/users/reset_password/',
                   {email: this.email}, function() {
      }).done(function() {
        that.set('passwordResetMessage', 'Password reset email sent');
        that.set('errorMessage', false);
        that.set('email', '');
      }).fail(function(response) {
          if(response.status === 422 && response.responseText) {
            that.set('errorMessage', Ember.$.parseJSON(response.responseText).errors);
          } else {
            that.transitionToRoute('error');
          }
      });

      return false;
    }
  }
});
