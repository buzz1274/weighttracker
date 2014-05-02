window.weight_tracker = Ember.Application.create();

weight_tracker.Router.map(function() {
    this.resource('index', {path: '/'});
    this.resource('main', {path: 'main'});
});

weight_tracker.mainRoute = Ember.Route.extend({
    renderTemplate: function() {
        this.render('main', {outlet: 'outlet'});
    }
});