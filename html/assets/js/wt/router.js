define('router', ['Ember', 'wt'],
    function (Ember, wt) {
        return function () {
            wt.Router.map(function () {
                this.resource('index', { path: '/' });
                this.route('weight', { path: 'weight' });
            });
        }
    }
);