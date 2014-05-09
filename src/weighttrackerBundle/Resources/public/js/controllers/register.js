(function () {

    'use strict';

    App.RegisterController = Ember.Controller.extend({
        register: function() {
            $.post("/register", {
                email: this.get('email'),
                password: this.get('password'),
                password_again: this.get('password_again')
            }).then(function() {
                $('.modal-backdrop').css('display', 'none');
                document.location = "/#main"
            }, function(data) {
                //display generic failure email
                if(data.responseText) {
                    var response = $.parseJSON(data.responseText)
                    this.set("registerFailed", true);

                    this.set("emailErrorMessage", "Invalid email address");
                    this.set("emailHasError", "has-error");

                }
            }.bind(this));
        }
    });

})();