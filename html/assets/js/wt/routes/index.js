define(['Ember', 'wt'],
    function (Ember, wt) {

        "use strict"

        wt.IndexRoute = Ember.Route.extend({
            setupController: function () {
                console.log("controller");
                this.render();
            }
        });

        return wt.IndexRoute;

    });