import Ember from 'ember';

export default Ember.Controller.extend({
  password: '',
  passwordRepeat: '',
  errorMessage: false,
  needs: ['weights/index'],
  actions: {

    change() {
      "use strict";

      var that = this;

      Ember.$.ajax({
        url: window.location.protocol+'//'+
             window.location.hostname+'/api/users/change_password/',
        type: "POST",
        xhrFields: {withCredentials: true},
        data: {password: this.password,
               passwordRepeat: this.passwordRepeat}}, function() {
        }).done(function() {
          that.get('controllers.weights/index').set('modalMessage', 'Password edited');
          that.transitionToRoute('weights');
        }).fail(function(response) {
          if(response.status === 422 && response.responseText) {
            that.set('errorMessage', Ember.$.parseJSON(response.responseText).errors);
          } else if(response.status === 401) {
            that.get('session').invalidate();
          } else {
            that.transitionToRoute('error');
          }
        });

      return false;
    }
  }
});
