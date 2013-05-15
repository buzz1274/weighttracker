if(Meteor.isClient) {
    Template.outer.logged_in = function() {
        return Session.get('user_id');
    }
}