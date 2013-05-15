Template.what.events({
    'click #create_account_button' : function(e, t) {
        $('#login_popup').css('display', 'block');
        $('#opaque').css('display', 'block');
        $('#login_popup').css('top', '150px');
    },
});