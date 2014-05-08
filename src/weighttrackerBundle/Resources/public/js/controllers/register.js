(function () {

    'use strict';

    App.RegisterController = Ember.Controller.extend({
        register: function() {
            $.post("/register", {
                email: this.get('email')
            }).then(function() {
                $('.modal-backdrop').css('display', 'none');
                document.location = "/#main"
            }, function() {
                this.set("registerFailed", true);
            }.bind(this));
        }
    });

})();