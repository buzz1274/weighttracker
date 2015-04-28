define('router', ['Ember', 'wt'],
    function (Ember, wt) {
        return function () {
            wt.Router.map(function () {
                this.resource('Index', { path: '/' });
            });

            console.log("DERP");

            /*
            wt.IndexRoute = Ember.Route.extend({
                setupController: function () {
                    console.log("ROUTE");
                }
            });
            */


        }
    }
);