if(Meteor.isClient) {
    Template.main.logged_in = function() {
        return Session.get('user_id');
    }
}