Template.register.events({
    'click #cancel_create_account' : function(e, t) {
        //loop through each form element setting value to default
        $('#login_popup').css('display', 'none');
        $('#opaque').css('display', 'none');
    },
    'click #create_account': function(e, t) {
        e.preventDefault();
        var form = {
            'email': t.find('#email').value,
            'password': t.find('#password').value,
        }
        form = Meteor.call("validate_registration", form);
        console.log(form);

        Accounts.createUser({email: form.email, password: form.password}, function(err){
          if (err) {
            console.log(err);
            alert('error  ' + err);
            // Inform the user that account creation failed
          } else {
            alert('pass');
            console.log(Meteor.user());
            // Success. Account has been created and the user
            // has logged in successfully.
          }
        });
        return false;
    },
});

/*
var Register = {

var close_popup = function() {
    //loop through each form element setting value to default
    $('#login_popup').css('display', 'none');
    $('#opaque').css('display', 'none');
}

var validate_registration = function(t) {
    return {'email': t.find('#email').value,
            'password': t.find('#password').value}
}
*/