 Template.what.events({
    'click #create_account_button' : function(e, t) {
        $('#login_popup').css('display', 'block');
        $('#opaque').css('display', 'block');
        $('#login_popup').css('top', '150px');
    },
    'click #cancel_create_account' : function(e, t) {
        $('#login_popup').css('display', 'none');
        $('#opaque').css('display', 'none');
    },
    'click #create_account' : function(e, t) {
        e.preventDefault();
        alert("here");
    }
});