window.weight_tracker = Ember.Application.create();

weight_tracker.Router.map(function() {
    this.resource('index', {path: '/'});
});
