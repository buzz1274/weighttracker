/* jshint ignore:start */

/* jshint ignore:end */

define('wt/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTAdapter.extend({
    host: window.location.protocol + '//' + window.location.hostname,
    namespace: 'api',
    ajax: function ajax(url, method, hash) {
      'use strict';

      if (typeof hash === 'undefined') {
        hash = {};
      }

      hash.xhrFields = { withCredentials: true };

      return this._super(url, method, hash);
    }
  });

});
define('wt/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'wt/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  App.idleTime = 0;
  App.idleMax = 15;

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('wt/authenticators/custom', ['exports', 'simple-auth/authenticators/base', 'ember'], function (exports, Base, Ember) {

  'use strict';

  exports['default'] = Base['default'].extend({
    authenticate: function authenticate(data) {
      'use strict';

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        Ember['default'].$.ajax({
          url: window.location.protocol + '//' + window.location.hostname + '/api/login',
          async: true,
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          xhrFields: {
            withCredentials: true
          }
        }).then(function (response) {
          Ember['default'].run(function () {
            try {
              response = JSON.parse(response);
            } catch (error) {}
            resolve({ token: response.token,
              userID: response.userID,
              name: response.name });
          });
        }, function (xhr) {
          if (!xhr.responseText) {
            reject();
          } else {
            var response = JSON.parse(xhr.responseText);
            Ember['default'].run(function () {
              reject(response.errors);
            });
          }
        });
      });
    },
    restore: function restore(data) {
      'use strict';

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (!Ember['default'].isEmpty(data.token)) {
          resolve(data);
        } else {
          reject();
        }
      });
    },
    invalidate: function invalidate() {
      'use strict';

      return new Ember['default'].RSVP.Promise(function (resolve) {
        Ember['default'].$.ajax({
          url: window.location.protocol + '//' + window.location.hostname + '/api/logout',
          xhrFields: {
            withCredentials: true
          },
          type: 'DELETE'
        }).always(function () {
          resolve();
        });
      });
    }
  });

});
define('wt/components/ember-chart', ['exports', 'ember-cli-chart/components/ember-chart'], function (exports, EmberChart) {

	'use strict';

	exports['default'] = EmberChart['default'];

});
define('wt/components/jqui-accordion/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-accordion/component'], function (exports, Ember, jquiAccordion) {

	'use strict';

	exports['default'] = jquiAccordion['default'];

});
define('wt/components/jqui-autocomplete/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-autocomplete/component'], function (exports, Ember, jquiAutocomplete) {

	'use strict';

	exports['default'] = jquiAutocomplete['default'];

});
define('wt/components/jqui-button/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-button/component'], function (exports, Ember, jquiButton) {

	'use strict';

	exports['default'] = jquiButton['default'];

});
define('wt/components/jqui-datepicker/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-datepicker/component'], function (exports, Ember, jquiDatepicker) {

	'use strict';

	exports['default'] = jquiDatepicker['default'];

});
define('wt/components/jqui-menu/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-menu/component'], function (exports, Ember, jquiMenu) {

	'use strict';

	exports['default'] = jquiMenu['default'];

});
define('wt/components/jqui-progress-bar/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-progress-bar/component'], function (exports, Ember, jquiProgressBar) {

	'use strict';

	exports['default'] = jquiProgressBar['default'];

});
define('wt/components/jqui-slider/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-slider/component'], function (exports, Ember, jquiSlider) {

	'use strict';

	exports['default'] = jquiSlider['default'];

});
define('wt/components/jqui-spinner/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-spinner/component'], function (exports, Ember, jquiSpinner) {

	'use strict';

	exports['default'] = jquiSpinner['default'];

});
define('wt/components/jqui-tabs/component', ['exports', 'ember', 'ember-cli-jquery-ui/components/jqui-tabs/component'], function (exports, Ember, jquiTabs) {

	'use strict';

	exports['default'] = jquiTabs['default'];

});
define('wt/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('wt/controllers/change-password', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    password: '',
    passwordRepeat: '',
    errorMessage: false,
    needs: ['weights/index'],
    actions: {

      change: function change() {
        'use strict';

        var that = this;

        Ember['default'].$.ajax({
          url: window.location.protocol + '//' + window.location.hostname + '/api/users/change_password/',
          type: 'POST',
          xhrFields: { withCredentials: true },
          data: { password: this.password,
            passwordRepeat: this.passwordRepeat } }, function () {}).done(function () {
          that.get('controllers.weights/index').set('modalMessage', 'Password edited');
          that.transitionToRoute('weights');
        }).fail(function (response) {
          if (response.status === 422 && response.responseText) {
            that.set('errorMessage', Ember['default'].$.parseJSON(response.responseText).errors);
          } else if (response.status === 401) {
            that.get('session').invalidate();
          } else {
            that.transitionToRoute('error');
          }
        });

        return false;
      }
    }
  });

});
define('wt/controllers/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    sortProperties: ['date'],
    sortAscending: false
  });

});
define('wt/controllers/login', ['exports', 'ember', 'wt/app'], function (exports, Ember, app) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    errorMessage: false,
    autoLogout: false,
    actions: {
      authenticate: function authenticate() {
        'use strict';

        var data = this.getProperties('username', 'password');
        var that = this;

        this.get('session').authenticate('authenticator:custom', data).then(null, function (message) {
          if (!message) {
            app['default'].idleTime = 0;
            that.transitionToRoute('error');
          } else {
            that.set('errorMessage', message);
            that.set('autoLogout', false);
            that.set('username', '');
            that.set('password', '');
          }
        });

        return false;
      },
      cancel: function cancel() {
        'use strict';

        this.get('model').deleteRecord();
        this.transitionToRoute('index');

        return false;
      }
    }
  });

});
define('wt/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('wt/controllers/profile', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    sex: ["-", "Male", "Female"],
    needs: ["weights/index"],
    errors: false,
    actions: {
      register: function register() {
        "use strict";

        var _this = this;

        if (this.get("model").get("formatted_date")) {
          this.get("model").set("date_of_birth", window.moment(this.get("model").get("formatted_date")).toDate());
        }

        var that = this;

        this.get("model").save().then(function () {
          _this.get("controllers.weights/index").set("modalMessage", "Profile edited");
          _this.set("session.secure.name", _this.get("model.name"));
          _this.transitionToRoute("weights");
        })["catch"](function (response) {
          if (response.status === 500 || !response.responseJSON || !response.responseJSON.errors) {
            that.transitionToRoute("error");
          } else {
            that.set("errors", response.responseJSON.errors);
          }
        });

        return false;
      },
      cancel: function cancel() {
        "use strict";

        this.get("model").deleteRecord();
        this.transitionToRoute("index");

        return false;
      }
    }
  });

});
define('wt/controllers/register', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    sex: ["-", "Male", "Female"],
    errors: false,
    actions: {

      register: function register() {
        "use strict";

        var _this = this;

        if (this.get("model").get("formatted_date")) {
          this.get("model").set("date_of_birth", window.moment(this.get("model").get("formatted_date")).toDate());
        }

        var that = this;

        this.get("model").save().then(function () {
          _this.transitionToRoute("login");
        })["catch"](function (response) {
          if (response.status === 500 || !response.responseJSON || !response.responseJSON.errors) {
            that.transitionToRoute("error");
          } else {
            that.set("errors", response.responseJSON.errors);
          }
        });

        return false;
      },
      cancel: function cancel() {
        "use strict";

        this.get("model").deleteRecord();
        this.transitionToRoute("index");

        return false;
      }
    }
  });

});
define('wt/controllers/reset-password', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    email: '',
    errorMessage: false,
    passwordResetMessage: false,
    actions: {

      reset: function reset() {
        'use strict';

        var that = this;

        Ember['default'].$.post(window.location.protocol + '//' + window.location.hostname + '/api/users/reset_password/', { email: this.email }, function () {}).done(function () {
          that.set('passwordResetMessage', 'Password reset email sent');
          that.set('errorMessage', false);
          that.set('email', '');
        }).fail(function (response) {
          if (response.status === 422 && response.responseText) {
            that.set('errorMessage', Ember['default'].$.parseJSON(response.responseText).errors);
          } else {
            that.transitionToRoute('error');
          }
        });

        return false;
      }
    }
  });

});
define('wt/controllers/weights/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    errors: false,
    action_edit: true,
    needs: ['weights/index'],
    actions: {
      save: function save() {
        'use strict';

        var _this = this;

        var date = new Date(window.moment.utc(this.get('model').get('formatted_date')));

        if (date !== 'Invalid Date') {
          this.get('model').set('date', date);
        }

        var that = this;

        this.get('model').save().then(function () {
          _this.get('controllers.weights/index').set('modalMessage', 'Weight edited');
          _this.transitionToRoute('weights.index');
        })['catch'](function (response) {
          if (response.status === 401) {
            that.get('session').invalidate();
          } else if (response.status === 404) {
            that.transitionToRoute('not-found', '');
          } else if (response.status === 500 || !response.responseJSON || !response.responseJSON.errors) {
            that.transitionToRoute('error');
          } else {
            that.set('errors', response.responseJSON.errors);
          }
        });

        return false;
      },
      cancel: function cancel() {
        'use strict';

        this.get('model').rollback();
        this.transitionToRoute('weights.index');

        return false;
      }
    }
  });

});
define('wt/controllers/weights/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    sortProperties: ['date'],
    sortAscending: false,
    modalMessage: false,
    recordsPerPage: 10,
    startRecord: 1,
    weightToDelete: false,
    page: 1,
    totalPages: 1,
    totalWeights: 0,
    prevDisabled: true,
    nextDisabled: true,
    stats: false,
    currentWeight: false,
    chartOptions: { pointDot: false,
      animation: false,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: false,
      scaleOverride: true,
      scaleSteps: 9,
      scaleGridLineColor: 'rgba(0,0,0,0.10)',
      scaleLabel: '<%= Number(value) + \' kg\'%>',
      showTooltips: false },
    chartData: Ember['default'].computed('model', function () {
      'use strict';

      var obeseWeight = 0,
          roundWeightToNearest = 5,
          weightCushion = 5,
          averageWeight = Number(this.get('stats').objectAt(0).get('averageWeight')),
          minWeight = Number(this.get('stats').objectAt(0).get('minWeight.weight')),
          maxWeight = Number(this.get('stats').objectAt(0).get('maxWeight.weight')),
          maxNormalWeight = Number(this.get('stats').objectAt(0).get('maxNormalWeight')),
          maxUnderweightWeight = Number(this.get('stats').objectAt(0).get('maxUnderweightWeight')),
          targetWeight = Number(this.get('stats').objectAt(0).get('targetWeight')),
          maxOverweightWeight = Number(this.get('stats').objectAt(0).get('maxOverweightWeight'));

      if (minWeight < targetWeight) {
        this.chartOptions.scaleStartValue = roundWeightToNearest * Math.round((minWeight - weightCushion) / roundWeightToNearest);
      } else {
        this.chartOptions.scaleStartValue = roundWeightToNearest * Math.round((targetWeight - weightCushion) / roundWeightToNearest);
      }

      var yScaleMaxValue = roundWeightToNearest * Math.round((maxWeight + weightCushion) / roundWeightToNearest);

      this.chartOptions.scaleStepWidth = Math.round((yScaleMaxValue - this.chartOptions.scaleStartValue) / this.chartOptions.scaleSteps);

      if (yScaleMaxValue < this.chartOptions.scaleStartValue + this.chartOptions.scaleSteps * this.chartOptions.scaleStepWidth) {

        yScaleMaxValue = this.chartOptions.scaleStartValue + this.chartOptions.scaleSteps * this.chartOptions.scaleStepWidth;
      }

      if (maxOverweightWeight < yScaleMaxValue) {
        obeseWeight = yScaleMaxValue;
      } else if (maxNormalWeight < yScaleMaxValue) {
        maxOverweightWeight = yScaleMaxValue;
      } else if (maxUnderweightWeight < yScaleMaxValue) {
        maxNormalWeight = yScaleMaxValue;
      } else {
        maxUnderweightWeight = yScaleMaxValue;
      }

      var dataset = {
        labels: this.calculateXAxisLabels(),
        showXLabels: 10,
        datasets: [{
          label: 'Obese',
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(Number.prototype.valueOf, obeseWeight),
          fillColor: 'rgba(255,0,0,0.05)',
          strokeColor: '#FF0000'
        }, {
          label: 'Overweight',
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(Number.prototype.valueOf, maxOverweightWeight),
          fillColor: 'rgba(255,255,0,0.07)',
          strokeColor: 'rgba(255,127,0,0.5)'
        }, {
          label: 'Normal Weight',
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(Number.prototype.valueOf, maxNormalWeight),
          fillColor: 'rgba(0,255,255,0.05)',
          strokeColor: 'rgba(0,255,0,0.5)'
        }, {
          label: 'Underweight',
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(Number.prototype.valueOf, maxUnderweightWeight),
          fillColor: 'rgba(255,127,0,0.10)',
          strokeColor: 'rgba(255,127,0,0.5)'
        }, {
          label: 'Weight',
          fillColor: 'transparent',
          strokeColor: '#AAA',
          datasetStrokeWidth: 5,
          data: this.get('content').mapBy('weight').reverse()
        }, {
          label: 'Average Weight',
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(Number.prototype.valueOf, averageWeight),
          strokeColor: '#000'
        }, {
          label: 'Target Weight',
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(Number.prototype.valueOf, targetWeight),
          strokeColor: '#9AF'
        }]
      };

      if (minWeight < obeseWeight && targetWeight < obeseWeight && yScaleMaxValue < obeseWeight || !obeseWeight) {
        dataset.datasets[0].data = [];
      }

      if (minWeight < maxOverweightWeight && targetWeight < maxOverweightWeight && yScaleMaxValue < maxOverweightWeight) {
        dataset.datasets[1].data = [];
      }

      if ((minWeight < maxNormalWeight || minWeight > maxNormalWeight) && targetWeight < maxNormalWeight && yScaleMaxValue < maxNormalWeight) {
        dataset.datasets[2].data = [];
      }

      if (minWeight > maxUnderweightWeight && targetWeight > maxUnderweightWeight && yScaleMaxValue > maxUnderweightWeight) {
        dataset.datasets[3].data = [];
      }

      return dataset;
    }),
    actions: {
      prevPage: function prevPage() {
        'use strict';

        if (this.page > 1) {
          this.decrementProperty('page', 1);
        } else {
          this.set('page', 1);
        }
      },
      nextPage: function nextPage() {
        'use strict';

        if (this.page < this.totalPages) {
          this.incrementProperty('page', 1);
        }
      },
      edit: function edit(weight) {
        'use strict';

        this.transitionToRoute('/weights/' + weight.id + '/edit');
      },
      'delete': function _delete() {
        'use strict';

        var _this = this;

        var that = this;

        this.get('weightToDelete').destroyRecord(this.get('weightToDelete')).then(function () {

          _this.set('weightToDelete', false);
          _this.set('modalMessage', 'Weight deleted');

          Ember['default'].$('#deleteModal').modal('hide');
          Ember['default'].$('#messageModal').modal({
            show: true
          });

          Ember['default'].$('#messageModal').on('hidden.bs.modal', function () {
            window.location = '/weights';
          });
        })['catch'](function (response) {
          this.set('weightToDelete', false);

          if (response.status === 401) {
            that.get('session').invalidate();
          } else if (response.status === 404) {
            that.transitionToRoute('not-found', '');
          } else {
            that.transitionToRoute('error');
          }
        });
      },
      cancelDelete: function cancelDelete() {
        'use strict';

        this.set('weightToDelete', false);
        Ember['default'].$('#deleteModal').modal('hide');
      },
      deleteModal: function deleteModal(weight) {
        'use strict';

        this.set('weightToDelete', weight);

        Ember['default'].$('#deleteModal').modal({
          show: true
        });
      }
    },
    arrangedContent: (function () {
      'use strict';

      this.set('totalWeights', this.get('content.length'));
      this.set('startRecord', (this.page - 1) * this.recordsPerPage);
      this.set('totalPages', Math.ceil(this.get('totalWeights') / this.recordsPerPage));

      if (this.page < this.totalPages) {
        this.set('nextDisabled', false);
      } else {
        this.set('nextDisabled', true);
      }

      if (this.page === 1) {
        this.set('prevDisabled', true);
      } else {
        this.set('prevDisabled', false);
      }

      return Ember['default'].ArrayProxy.createWithMixins(Ember['default'].SortableMixin, {
        content: this.get('model').toArray(),
        sortProperties: this.get('sortProperties'),
        sortAscending: this.get('sortAscending')
      }).slice(this.startRecord, this.startRecord + this.recordsPerPage);
    }).property('weight', 'page', 'totalPages', 'prevDisabled', 'nextDisabled', 'totalWeights'),
    calculateXAxisLabels: function calculateXAxisLabels() {
      'use strict';
      var dates = [],
          totalWeights = this.get('totalWeights'),
          currentDate = false,
          lastAddedDate = false,
          countWhenAdded = 0,
          weighedDates = this.get('content').mapBy('date').reverse(),
          skipDateAmount = totalWeights * 0.10;

      for (var i = 0; i < totalWeights; i++) {
        currentDate = window.moment(weighedDates[i]).format('MMMM Do, YYYY');
        if (i === 0) {
          dates[i] = currentDate;
          lastAddedDate = currentDate;
          countWhenAdded = i;
        } else if (i === totalWeights - 1) {
          dates[i] = currentDate;
        } else {
          if (i - countWhenAdded > skipDateAmount && i + skipDateAmount < totalWeights) {
            dates[i] = currentDate;
            lastAddedDate = currentDate;
            countWhenAdded = i;
          } else {
            dates[i] = '';
          }
        }
      }

      return dates;
    }
  });

});
define('wt/controllers/weights/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    errors: false,
    action_add: true,
    needs: ['weights/index'],
    actions: {
      save: function save() {
        'use strict';

        var _this = this;

        var date = new Date(window.moment.utc(this.get('model').get('formatted_date')));

        if (date !== 'Invalid Date') {
          this.get('model').set('date', date);
        }

        var that = this;

        this.get('model').save().then(function () {
          _this.get('controllers.weights/index').set('modalMessage', 'Weight added');
          _this.transitionToRoute('weights.index');
        })['catch'](function (response) {
          if (response.status === 500 || !response.responseJSON || !response.responseJSON.errors) {
            that.transitionToRoute('error');
          } else {
            that.set('errors', response.responseJSON.errors);
          }
        });

        return false;
      },
      cancel: function cancel() {
        'use strict';

        this.get('model').deleteRecord();
        this.transitionToRoute('weights.index');

        return false;
      }
    }
  });

});
define('wt/helpers/date-format', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (date) {
    'use strict';

    return window.moment(date).format('MMMM Do, YYYY');
  });

});
define('wt/helpers/table-cell-class', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (change, currentWeight, targetWeight) {
    'use strict';

    if (targetWeight === currentWeight) {
      return 'success';
    } else {
      if (currentWeight < targetWeight) {
        if (change < 0) {
          return 'danger';
        } else {
          return 'success';
        }
      } else if (currentWeight > targetWeight) {
        if (change > 0) {
          return 'danger';
        } else {
          return 'success';
        }
      }
    }
  });

});
define('wt/helpers/weight-format', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (weight) {
    "use strict";

    return Number(weight).toFixed(1);
  });

});
define('wt/initializers/active-model-adapter', ['exports', 'active-model-adapter', 'active-model-adapter/active-model-serializer'], function (exports, ActiveModelAdapter, ActiveModelSerializer) {

  'use strict';

  exports['default'] = {
    name: "active-model-adapter",
    initialize: function initialize(registry, application) {
      registry.register("adapter:-active-model", ActiveModelAdapter['default']);
      registry.register("serializer:-active-model", ActiveModelSerializer['default'].extend({ isNewSerializerAPI: true }));
    }
  };

});
define('wt/initializers/app-version', ['exports', 'wt/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('wt/initializers/export-application-global', ['exports', 'ember', 'wt/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('wt/initializers/simple-auth-token', ['exports', 'simple-auth-token/authenticators/token', 'simple-auth-token/authenticators/jwt', 'simple-auth-token/authorizers/token', 'simple-auth-token/configuration', 'wt/config/environment'], function (exports, TokenAuthenticator, JWTAuthenticator, Authorizer, Configuration, ENV) {

  'use strict';

  exports['default'] = {
    name: 'simple-auth-token',
    before: 'simple-auth',
    initialize: function initialize(container) {
      Configuration['default'].load(container, ENV['default']['simple-auth-token'] || {});
      container.register('simple-auth-authorizer:token', Authorizer['default']);
      container.register('simple-auth-authenticator:token', TokenAuthenticator['default']);
      container.register('simple-auth-authenticator:jwt', JWTAuthenticator['default']);
    }
  };

});
define('wt/initializers/simple-auth', ['exports', 'simple-auth/configuration', 'simple-auth/setup', 'wt/config/environment'], function (exports, Configuration, setup, ENV) {

  'use strict';

  exports['default'] = {
    name: 'simple-auth',
    initialize: function initialize(container, application) {
      Configuration['default'].load(container, ENV['default']['simple-auth'] || {});
      setup['default'](container, application);
    }
  };

});
define('wt/instance-initializers/active-model-adapter', ['exports', 'active-model-adapter', 'active-model-adapter/active-model-serializer'], function (exports, ActiveModelAdapter, ActiveModelSerializer) {

  'use strict';

  exports['default'] = {
    name: 'active-model-adapter',
    initialize: function initialize(applicationOrRegistry) {
      var registry, container;
      if (applicationOrRegistry.registry && applicationOrRegistry.container) {
        // initializeStoreService was registered with an
        // instanceInitializer. The first argument is the application
        // instance.
        registry = applicationOrRegistry.registry;
        container = applicationOrRegistry.container;
      } else {
        // initializeStoreService was called by an initializer instead of
        // an instanceInitializer. The first argument is a registy. This
        // case allows ED to support Ember pre 1.12
        registry = applicationOrRegistry;
        if (registry.container) {
          // Support Ember 1.10 - 1.11
          container = registry.container();
        } else {
          // Support Ember 1.9
          container = registry;
        }
      }

      registry.register('adapter:-active-model', ActiveModelAdapter['default']);
      registry.register('serializer:-active-model', ActiveModelSerializer['default']);
    }
  };

});
define('wt/models/stat', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    changeLastWeek: DS['default'].attr('number'),
    changeLastMonth: DS['default'].attr('number'),
    changeLastYear: DS['default'].attr('number'),
    changeGreatest: DS['default'].attr('number'),
    dateToTarget: DS['default'].attr('date'),
    accountCreated: DS['default'].attr('date'),
    maxUnderweightWeight: DS['default'].attr('number'),
    maxNormalWeight: DS['default'].attr('number'),
    maxOverweightWeight: DS['default'].attr('number'),
    currentWeight: DS['default'].attr(),
    targetWeight: DS['default'].attr('number'),
    averageWeight: DS['default'].attr('number'),
    weightToTarget: DS['default'].attr('number'),
    startWeight: DS['default'].attr('number'),
    maxWeight: DS['default'].attr(),
    minWeight: DS['default'].attr()
  });

});
define('wt/models/user', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    email: DS['default'].attr('string'),
    password: DS['default'].attr('string'),
    repeat_password: DS['default'].attr('string'),
    name: DS['default'].attr('string'),
    date_of_birth: DS['default'].attr('isodate'),
    sex: DS['default'].attr('string'),
    height: DS['default'].attr('number'),
    weight: DS['default'].attr('number'),
    target_weight: DS['default'].attr('number'),
    formatted_date: (function () {
      'use strict';

      return window.moment(this.get('date_of_birth')).format('MMMM D, YYYY');
    }).property('date_of_birth')
  });

});
define('wt/models/weight', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    weight_id: DS['default'].attr('number'),
    weight: DS['default'].attr('number'),
    date: DS['default'].attr('date'),
    change: DS['default'].attr('number'),
    formatted_date: (function () {
      'use strict';

      return window.moment(this.get('date')).format('MMMM D, YYYY');
    }).property('date')
  });

});
define('wt/router', ['exports', 'ember', 'wt/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType,
    actions: {
      error: function error() {
        'use strict';

        this.transitionTo('error', 'application-error');
      }
    }
  });

  exports['default'] = Router.map(function () {
    'use strict';

    this.route('index', { path: '/' });
    this.route('login');
    this.route('error');
    this.route('404');
    this.route('register');
    this.route('profile');
    this.route('reset-password');
    this.route('change-password');
    this.route('not-found', { path: '/*path' });

    this.route('weights', function () {
      this.route('new');
      this.route('edit', { path: ':id/edit' });
    });
  });

});
define('wt/routes/application', ['exports', 'wt/app', 'ember', 'simple-auth/mixins/application-route-mixin'], function (exports, app, Ember, ApplicationRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default'], {
    actions: {
      invalidateSession: function invalidateSession() {
        'use strict';

        this.get('session').invalidate();
      },
      sessionInvalidationSucceeded: function sessionInvalidationSucceeded() {
        'use strict';

        window.location = '/login';
      }
    },
    setupAutoLogout: (function () {
      'use strict';

      setInterval(function () {
        app['default'].idleTime = app['default'].idleTime + 1;
      }, 60000);

      Ember['default'].$('body').mousemove(function () {
        app['default'].idleTime = 0;
      });

      Ember['default'].$(this).keypress(function () {
        app['default'].idleTime = 0;
      });

      this.autoLogoutTimer();
    }).on('init'),
    autoLogoutTimer: function autoLogoutTimer() {
      'use strict';

      Ember['default'].run.later(this, this.autoLogoutTimer, 1000);

      if (this.get('session').isAuthenticated && app['default'].idleTime >= app['default'].idleMax) {

        app['default'].idleTime = 0;

        Ember['default'].$('#deleteModal').modal('hide');
        Ember['default'].$('#messageModal').modal('hide');

        this.controllerFor('login').set('autoLogout', true);
        this.get('session').invalidate();
      }
    }
  });

});
define('wt/routes/change-password', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    setupController: function setupController(controller) {
      'use strict';

      controller.set('errorMessage', false);
      controller.set('password', '');
      controller.set('passwordRepeat', '');
    }
  });

});
define('wt/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController() {
      'use strict';

      if (this.get('session').isAuthenticated) {
        var hash = window.location.search.substring(1).split('=')[0];

        if (hash === 'hash') {
          this.transitionTo('change-password');
        } else {
          this.transitionTo('weights');
        }
      }
    }
  });

});
define('wt/routes/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      'use strict';

      if (this.get('session').isAuthenticated) {
        this.transitionTo('weights');
      }

      controller.set('errorMessage', false);
      controller.set('username', '');
      controller.set('password', '');
    },
    deactivate: function deactivate() {
      'use strict';

      this._super();
      this.controllerFor('login').set('autoLogout', false);
    }
  });

});
define('wt/routes/not-found', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    redirect: function redirect() {
      'use strict';

      var url = this.router.location.formatURL('/not-found');

      if (window.location.pathname !== url) {
        this.transitionTo('/not-found');
      }
    }
  });

});
define('wt/routes/profile', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function model() {
      'use strict';

      var that = this;

      return Ember['default'].RSVP.hash({
        user: this.store.find('user', this.get('session.secure.userID'))
      })['catch'](function (response) {
        if (response.status === 401) {
          that.get('session').invalidate();
        } else if (response.status === 404) {
          that.transitionTo('not-found', '');
        } else {
          that.transitionTo('error');
        }
      });
    },
    setupController: function setupController(controller, model) {
      'use strict';

      controller.set('errors', false);
      controller.set('model', model.user);
    },
    deactivate: function deactivate() {
      'use strict';

      this.controllerFor('profile').get('model').rollback();
    }
  });

});
define('wt/routes/register', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      'use strict';

      if (this.get('session').isAuthenticated) {
        this.transitionTo('index');
      }

      controller.set('errors', false);
      controller.set('model', this.store.createRecord('user'));
    }
  });

});
define('wt/routes/reset-password', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      'use strict';

      if (this.get('session').isAuthenticated) {
        this.transitionTo('change-password');
      }

      var search = window.location.search.substring(1).split('=');

      if (search && search[0] && search[0] === 'hash' && search[1]) {
        this.get('session').authenticate('authenticator:custom', { hash: search[1] }).then(null, function (message) {

          if (message) {
            controller.set('errorMessage', message);
          }
        });
      }

      controller.set('errorMessage', false);
      controller.set('passwordResetMessage', false);
      controller.set('email', '');

      return false;
    }
  });

});
define('wt/routes/weights/edit', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function model(params) {
      'use strict';

      var that = this;

      return Ember['default'].RSVP.hash({
        weight: this.store.find('weight', params.id)
      })['catch'](function (response) {
        if (response.status === 401) {
          that.get('session').invalidate();
        } else if (response.status === 404) {
          that.transitionToRoute('not-found', '');
        } else {
          that.transitionToRoute('error');
        }
      });
    },
    setupController: function setupController(controller, model) {
      'use strict';

      controller.set('errors', false);
      controller.set('model', model.weight);
    },
    deactivate: function deactivate() {
      'use strict';

      this.controllerFor('weights.edit').get('model').rollback();
    }
  });

});
define('wt/routes/weights/index', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function model() {
      'use strict';

      var that = this;

      return Ember['default'].RSVP.hash({
        stats: this.store.findAll('stat'),
        weights: this.store.findAll('weight')
      })['catch'](function (response) {
        if (response.status === 401) {
          that.get('session').invalidate();
        } else {
          that.transitionToRoute('error');
        }
      });
    },
    setupController: function setupController(controller, model) {
      'use strict';

      controller.set('stats', model.stats);
      controller.set('content', model.weights);
      controller.set('targetWeight', model.stats.objectAt(0).get('targetWeight'));
      controller.set('currentWeight', model.stats.objectAt(0).get('currentWeight'));

      this._super(controller, model.weights);
    },
    removeModalMessage: (function () {
      'use strict';

      this.get('controller').set('modalMessage', false);
    }).on('deactivate')
  });

});
define('wt/routes/weights/new', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    setupController: function setupController(controller) {
      'use strict';

      controller.set('errors', false);
      controller.set('model', this.store.createRecord('weight'));
    },
    deactivate: function deactivate() {
      'use strict';

      var model = this.controllerFor('weights.new').get('model');
      model.rollback();
    }
  });

});
define('wt/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1,"id","edit_user");
            dom.setAttribute(el1,"class","glyphicon glyphicon-edit");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n              ");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              Welcome back,\n              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" \n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("| \n              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          var el2 = dom.createTextNode("Logout");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [5]);
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
          content(env, morph0, context, "session.secure.name");
          block(env, morph1, context, "link-to", ["profile"], {"title": "Edit User"}, child0, null);
          element(env, element0, context, "action", ["invalidateSession"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Login");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          block(env, morph0, context, "link-to", ["login"], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("WeightTracker");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          block(env, morph0, context, "link-to", ["weights"], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("WeightTracker");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          block(env, morph0, context, "link-to", ["index"], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container-fluid");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","welcome");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","header_content");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h1");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("          ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","main");
        dom.setAttribute(el2,"class","row-fluid");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","sub_main");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","footer");
        var el3 = dom.createTextNode("WeightTracker v0.1");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [3, 1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3, 1]),1,1);
        block(env, morph0, context, "if", [get(env, context, "session.isAuthenticated")], {}, child0, child1);
        block(env, morph1, context, "if", [get(env, context, "session.isAuthenticated")], {}, child2, child3);
        content(env, morph2, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('wt/templates/change-password', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","text-danger");
          var el2 = dom.createElement("strong");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 0]),0,0);
          content(env, morph0, context, "errorMessage");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n          Cancel\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("fieldset");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("legend");
        var el4 = dom.createTextNode("Change Password");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","form-group ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","control-label");
        dom.setAttribute(el4,"for","id_password");
        var el5 = dom.createTextNode("\n          Password:\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","form-group ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","control-label");
        dom.setAttribute(el4,"for","id_passwordRepeat");
        var el5 = dom.createTextNode("\n        Repeat Password:\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","pull-right");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("\n          Change\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [9]);
        var element2 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [3]),3,3);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [5]),3,3);
        var morph2 = dom.createMorphAt(element0,7,7);
        var morph3 = dom.createMorphAt(element1,1,1);
        inline(env, morph0, context, "input", [], {"class": "form-control form-large", "autocomplete": "off", "type": "password", "id": "id_password", "value": get(env, context, "controller.password")});
        inline(env, morph1, context, "input", [], {"class": "form-control form-large", "autocomplete": "off", "type": "password", "id": "id_passwordRepeat", "value": get(env, context, "controller.passwordRepeat")});
        block(env, morph2, context, "if", [get(env, context, "errorMessage")], {}, child0, null);
        block(env, morph3, context, "link-to", ["login"], {"class": "button"}, child1, null);
        element(env, element2, context, "action", ["change"], {"on": "click"});
        return fragment;
      }
    };
  }()));

});
define('wt/templates/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        dom.setAttribute(el1,"class","text-danger");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h4");
        var el3 = dom.createTextNode("500. Internal Server Error.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('wt/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"type","button");
            dom.setAttribute(el1,"class","btn btn-default");
            var el2 = dom.createTextNode("Login");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"type","button");
            dom.setAttribute(el1,"class","btn btn-default");
            var el2 = dom.createTextNode("Register");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"id","links");
          dom.setAttribute(el1,"class","text-center");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
          block(env, morph0, context, "link-to", ["login"], {}, child0, null);
          block(env, morph1, context, "link-to", ["register"], {}, child1, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","home_text");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dolor dui,\n    facilisis ut ante in, tristique sodales risus. Aenean a tristique erat. Quisque\n    ultricies facilisis urna sit amet volutpat. Pellentesque faucibus pulvinar mauris\n    vel vulputate. Cum sociis natoque penatibus et magnis dis parturient montes,\n    nascetur ridiculus mus. Curabitur sed lacus purus. Integer vitae purus pulvinar,\n    mattis nibh vitae, imperdiet nulla. Maecenas sit amet mauris ac erat vulputate\n    posuere.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Sed vitae massa rutrum, aliquet nisl sed, laoreet lacus. Sed interdum lectus vel\n    sapien fermentum, et ornare arcu pulvinar. Ut lobortis quam egestas, pellentesque\n    quam non, scelerisque urna. Morbi tellus lorem, rutrum eu mattis nec, sodales\n    sit amet tellus. Nullam id nisi euismod, tincidunt ex vitae, finibus erat.\n    Donec fermentum mi ac dolor pharetra finibus. Suspendisse venenatis condimentum\n    odio, eu consectetur magna rutrum et. Cras imperdiet neque dui, sed....\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),5,5);
        block(env, morph0, context, "unless", [get(env, context, "session.isAuthenticated")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('wt/templates/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","text-danger");
          var el2 = dom.createElement("strong");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 0]),0,0);
          content(env, morph0, context, "errorMessage");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","text-danger");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("You have been logged out automatically");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n          Cancel\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n          Register\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n          Reset Password\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("fieldset");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("legend");
        var el4 = dom.createTextNode("Login");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","form-group ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","control-label");
        dom.setAttribute(el4,"for","id_username");
        var el5 = dom.createTextNode("\n        Username:\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","form-group ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","control-label");
        dom.setAttribute(el4,"for","id_password");
        var el5 = dom.createTextNode("\n        Password:\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","pull-right");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("\n          Login\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","pull-left");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [10]);
        var element2 = dom.childAt(element1, [4]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [3]),3,3);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [5]),3,3);
        var morph2 = dom.createMorphAt(element0,7,7);
        var morph3 = dom.createMorphAt(element0,8,8);
        var morph4 = dom.createMorphAt(element1,1,1);
        var morph5 = dom.createMorphAt(element1,2,2);
        var morph6 = dom.createMorphAt(dom.childAt(element0, [12]),1,1);
        inline(env, morph0, context, "input", [], {"class": "form-control form-large", "autocomplete": "off", "id": "id_username", "value": get(env, context, "username")});
        inline(env, morph1, context, "input", [], {"class": "form-control form-large", "autocomplete": "off", "id": "id_password", "type": "password", "value": get(env, context, "password")});
        block(env, morph2, context, "if", [get(env, context, "errorMessage")], {}, child0, null);
        block(env, morph3, context, "if", [get(env, context, "autoLogout")], {}, child1, null);
        block(env, morph4, context, "link-to", ["index"], {"class": "button"}, child2, null);
        block(env, morph5, context, "link-to", ["register"], {"class": "button"}, child3, null);
        element(env, element2, context, "action", ["authenticate"], {"on": "click"});
        block(env, morph6, context, "link-to", ["reset-password"], {"class": "button"}, child4, null);
        return fragment;
      }
    };
  }()));

});
define('wt/templates/not-found', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("404");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('wt/templates/profile', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.email");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.name");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.date_of_birth");
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.sex");
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.height");
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.target_weight");
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n          Change Password\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("fieldset");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("legend");
        var el4 = dom.createTextNode("Profile");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","email");
        var el6 = dom.createTextNode("Email");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","name");
        var el6 = dom.createTextNode("Name");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","date_of_birth");
        var el6 = dom.createTextNode("Date of Birth");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-md-6");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","sex");
        var el6 = dom.createTextNode("Sex");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","height");
        var el6 = dom.createTextNode("Height(cm)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","target_weight");
        var el6 = dom.createTextNode("Target Weight(kg)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","pull-right");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-default");
        var el5 = dom.createTextNode("\n          Cancel\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("\n          Save\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","pull-left");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element1, [5]);
        var element5 = dom.childAt(element1, [7]);
        var element6 = dom.childAt(element1, [9]);
        var element7 = dom.childAt(element1, [11]);
        var element8 = dom.childAt(element0, [5]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element8, [3]);
        var morph0 = dom.createMorphAt(element2,3,3);
        var morph1 = dom.createMorphAt(element2,5,5);
        var morph2 = dom.createMorphAt(element3,3,3);
        var morph3 = dom.createMorphAt(element3,5,5);
        var morph4 = dom.createMorphAt(dom.childAt(element4, [3, 1]),1,1);
        var morph5 = dom.createMorphAt(element4,5,5);
        var morph6 = dom.createMorphAt(dom.childAt(element5, [3, 1]),1,1);
        var morph7 = dom.createMorphAt(element5,5,5);
        var morph8 = dom.createMorphAt(dom.childAt(element6, [3, 1]),1,1);
        var morph9 = dom.createMorphAt(element6,5,5);
        var morph10 = dom.createMorphAt(dom.childAt(element7, [3, 1]),1,1);
        var morph11 = dom.createMorphAt(element7,5,5);
        var morph12 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        inline(env, morph0, context, "input", [], {"class": "form-control", "value": get(env, context, "model.email")});
        block(env, morph1, context, "if", [get(env, context, "errors.email")], {}, child0, null);
        inline(env, morph2, context, "input", [], {"class": "form-control", "value": get(env, context, "model.name")});
        block(env, morph3, context, "if", [get(env, context, "errors.name")], {}, child1, null);
        inline(env, morph4, context, "jqui-datepicker", [], {"class": "form-control", "readonly": "readonly", "changeMonth": true, "changeYear": true, "yearRange": "1900:c", "maxDate": "0", "dateFormat": "MM d, yy", "value": get(env, context, "model.formatted_date")});
        block(env, morph5, context, "if", [get(env, context, "errors.date_of_birth")], {}, child2, null);
        inline(env, morph6, context, "view", ["select"], {"class": "form-control", "content": get(env, context, "sex"), "value": get(env, context, "model.sex")});
        block(env, morph7, context, "if", [get(env, context, "errors.sex")], {}, child3, null);
        inline(env, morph8, context, "input", [], {"class": "form-control", "maxlength": "3", "value": get(env, context, "model.height")});
        block(env, morph9, context, "if", [get(env, context, "errors.height")], {}, child4, null);
        inline(env, morph10, context, "input", [], {"class": "form-control", "maxlength": "6", "value": get(env, context, "model.target_weight")});
        block(env, morph11, context, "if", [get(env, context, "errors.target_weight")], {}, child5, null);
        element(env, element9, context, "action", ["cancel"], {"on": "click"});
        element(env, element10, context, "action", ["register"], {"on": "click"});
        block(env, morph12, context, "link-to", ["change-password"], {}, child6, null);
        return fragment;
      }
    };
  }()));

});
define('wt/templates/register', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.email");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.password");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.repeat_password");
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.name");
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.date_of_birth");
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.sex");
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.height");
          return fragment;
        }
      };
    }());
    var child7 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.weight");
          return fragment;
        }
      };
    }());
    var child8 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.target_weight");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("fieldset");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("legend");
        var el4 = dom.createTextNode("Register");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","email");
        var el6 = dom.createTextNode("Email");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","password");
        var el6 = dom.createTextNode("Password");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","repeat_password");
        var el6 = dom.createTextNode("Repeat Password");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","name");
        var el6 = dom.createTextNode("Name");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","date_of_birth");
        var el6 = dom.createTextNode("Date of Birth");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-md-6");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","sex");
        var el6 = dom.createTextNode("Sex");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","height");
        var el6 = dom.createTextNode("Height(cm)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","weight");
        var el6 = dom.createTextNode("Weight(kg)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","target_weight");
        var el6 = dom.createTextNode("Target Weight(kg)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","col-xs-4");
        var el7 = dom.createTextNode("\n              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","pull-right");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-default");
        var el5 = dom.createTextNode("\n            Cancel\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("\n          Register\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element1, [5]);
        var element5 = dom.childAt(element1, [7]);
        var element6 = dom.childAt(element1, [9]);
        var element7 = dom.childAt(element1, [11]);
        var element8 = dom.childAt(element1, [13]);
        var element9 = dom.childAt(element1, [15]);
        var element10 = dom.childAt(element1, [17]);
        var element11 = dom.childAt(element0, [5]);
        var element12 = dom.childAt(element11, [1]);
        var element13 = dom.childAt(element11, [3]);
        var morph0 = dom.createMorphAt(element2,3,3);
        var morph1 = dom.createMorphAt(element2,5,5);
        var morph2 = dom.createMorphAt(element3,3,3);
        var morph3 = dom.createMorphAt(element3,5,5);
        var morph4 = dom.createMorphAt(element4,3,3);
        var morph5 = dom.createMorphAt(element4,5,5);
        var morph6 = dom.createMorphAt(element5,3,3);
        var morph7 = dom.createMorphAt(element5,5,5);
        var morph8 = dom.createMorphAt(dom.childAt(element6, [3, 1]),1,1);
        var morph9 = dom.createMorphAt(element6,5,5);
        var morph10 = dom.createMorphAt(dom.childAt(element7, [3, 1]),1,1);
        var morph11 = dom.createMorphAt(element7,5,5);
        var morph12 = dom.createMorphAt(dom.childAt(element8, [3, 1]),1,1);
        var morph13 = dom.createMorphAt(element8,5,5);
        var morph14 = dom.createMorphAt(dom.childAt(element9, [3, 1]),1,1);
        var morph15 = dom.createMorphAt(element9,5,5);
        var morph16 = dom.createMorphAt(dom.childAt(element10, [3, 1]),1,1);
        var morph17 = dom.createMorphAt(element10,5,5);
        inline(env, morph0, context, "input", [], {"class": "form-control", "value": get(env, context, "model.email")});
        block(env, morph1, context, "if", [get(env, context, "errors.email")], {}, child0, null);
        inline(env, morph2, context, "input", [], {"type": "password", "class": "form-control", "value": get(env, context, "model.password")});
        block(env, morph3, context, "if", [get(env, context, "errors.password")], {}, child1, null);
        inline(env, morph4, context, "input", [], {"type": "password", "class": "form-control", "value": get(env, context, "model.repeat_password")});
        block(env, morph5, context, "if", [get(env, context, "errors.repeat_password")], {}, child2, null);
        inline(env, morph6, context, "input", [], {"class": "form-control", "value": get(env, context, "model.name")});
        block(env, morph7, context, "if", [get(env, context, "errors.name")], {}, child3, null);
        inline(env, morph8, context, "jqui-datepicker", [], {"class": "form-control", "readonly": "readonly", "changeMonth": true, "changeYear": true, "yearRange": "1900:c", "maxDate": "0", "dateFormat": "MM d, yy", "value": get(env, context, "model.formatted_date")});
        block(env, morph9, context, "if", [get(env, context, "errors.date_of_birth")], {}, child4, null);
        inline(env, morph10, context, "view", ["select"], {"class": "form-control", "content": get(env, context, "sex"), "value": get(env, context, "model.sex")});
        block(env, morph11, context, "if", [get(env, context, "errors.sex")], {}, child5, null);
        inline(env, morph12, context, "input", [], {"class": "form-control", "maxlength": "3", "value": get(env, context, "model.height")});
        block(env, morph13, context, "if", [get(env, context, "errors.height")], {}, child6, null);
        inline(env, morph14, context, "input", [], {"class": "form-control", "maxlength": "6", "value": get(env, context, "model.weight")});
        block(env, morph15, context, "if", [get(env, context, "errors.weight")], {}, child7, null);
        inline(env, morph16, context, "input", [], {"class": "form-control", "maxlength": "6", "value": get(env, context, "model.target_weight")});
        block(env, morph17, context, "if", [get(env, context, "errors.target_weight")], {}, child8, null);
        element(env, element12, context, "action", ["cancel"], {"on": "click"});
        element(env, element13, context, "action", ["register"], {"on": "click"});
        return fragment;
      }
    };
  }()));

});
define('wt/templates/reset-password', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","text-danger");
          var el2 = dom.createElement("strong");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 0]),0,0);
          content(env, morph0, context, "errorMessage");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("strong");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 0]),0,0);
          content(env, morph0, context, "passwordResetMessage");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n          Cancel\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("fieldset");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("legend");
        var el4 = dom.createTextNode("Reset Password");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","form-group ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","control-label");
        dom.setAttribute(el4,"for","id_username");
        var el5 = dom.createTextNode("\n        Email:\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","pull-right");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("\n          Reset\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [8]);
        var element2 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [3]),3,3);
        var morph1 = dom.createMorphAt(element0,5,5);
        var morph2 = dom.createMorphAt(element0,6,6);
        var morph3 = dom.createMorphAt(element1,1,1);
        inline(env, morph0, context, "input", [], {"class": "form-control form-large", "autocomplete": "off", "id": "id_email", "value": get(env, context, "controller.email")});
        block(env, morph1, context, "if", [get(env, context, "errorMessage")], {}, child0, null);
        block(env, morph2, context, "if", [get(env, context, "passwordResetMessage")], {}, child1, null);
        block(env, morph3, context, "link-to", ["login"], {"class": "button"}, child2, null);
        element(env, element2, context, "action", ["reset"], {"on": "click"});
        return fragment;
      }
    };
  }()));

});
define('wt/templates/weights/-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Add");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Edit");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.date");
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","error clear");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "errors.weight");
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-primary");
          var el2 = dom.createTextNode("\n            Edit\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          element(env, element1, context, "action", ["save"], {"on": "click"});
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-primary");
          var el2 = dom.createTextNode("\n            Add\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "action", ["save"], {"on": "click"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("fieldset");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("legend");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" Weight");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","date");
        var el6 = dom.createTextNode("Date");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","date");
        var el6 = dom.createTextNode("Weight(kg)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","pull-right");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-default");
        var el5 = dom.createTextNode("\n          Cancel\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0, 1]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [3]);
        var element6 = dom.childAt(element2, [5]);
        var element7 = dom.childAt(element6, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
        var morph1 = dom.createMorphAt(element4,3,3);
        var morph2 = dom.createMorphAt(element4,5,5);
        var morph3 = dom.createMorphAt(element5,3,3);
        var morph4 = dom.createMorphAt(element5,5,5);
        var morph5 = dom.createMorphAt(element6,3,3);
        block(env, morph0, context, "if", [get(env, context, "action_add")], {}, child0, child1);
        inline(env, morph1, context, "jqui-datepicker", [], {"class": "form-control", "readonly": "readonly", "dateFormat": "MM d, yy", "value": get(env, context, "model.formatted_date")});
        block(env, morph2, context, "if", [get(env, context, "errors.date")], {}, child2, null);
        inline(env, morph3, context, "input", [], {"class": "form-control", "placeholder": "Enter weight", "autocomplete": "off", "type": "text", "value": get(env, context, "model.weight")});
        block(env, morph4, context, "if", [get(env, context, "errors.weight")], {}, child3, null);
        element(env, element7, context, "action", ["cancel"], {"on": "click"});
        block(env, morph5, context, "if", [get(env, context, "action_edit")], {}, child4, child5);
        return fragment;
      }
    };
  }()));

});
define('wt/templates/weights/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "partial", ["weights/form"], {});
        return fragment;
      }
    };
  }()));

});
define('wt/templates/weights/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                (~");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(")\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "date-format", [get(env, context, "stat.dateToTarget")], {});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                (~");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(")\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "date-format", [get(env, context, "stat.dateToTarget")], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Start weight(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n              (");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(")\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Current weight(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n              (");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(")\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Target weight(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Weight to target(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Lowest weight(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n              (");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(")\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Highest weight(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n              (");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(")\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Average weight(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" \n              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Change last week(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Change last month(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Change last year(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","stats_title");
          var el3 = dom.createTextNode("Change highest(kg)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline, block = hooks.block, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element5 = dom.childAt(fragment, [1, 3]);
          var element6 = dom.childAt(fragment, [3, 3]);
          var element7 = dom.childAt(fragment, [5, 3]);
          var element8 = dom.childAt(fragment, [7, 3]);
          var element9 = dom.childAt(fragment, [9, 3]);
          var element10 = dom.childAt(fragment, [11, 3]);
          var element11 = dom.childAt(fragment, [15, 3]);
          var element12 = dom.childAt(fragment, [17, 3]);
          var element13 = dom.childAt(fragment, [19, 3]);
          var element14 = dom.childAt(fragment, [21, 3]);
          var morph0 = dom.createMorphAt(element5,1,1);
          var morph1 = dom.createMorphAt(element5,3,3);
          var morph2 = dom.createMorphAt(element6,1,1);
          var morph3 = dom.createMorphAt(element6,3,3);
          var morph4 = dom.createMorphAt(element7,1,1);
          var morph5 = dom.createMorphAt(element7,3,3);
          var morph6 = dom.createMorphAt(element8,1,1);
          var morph7 = dom.createMorphAt(element8,3,3);
          var morph8 = dom.createMorphAt(element9,1,1);
          var morph9 = dom.createMorphAt(element9,3,3);
          var morph10 = dom.createMorphAt(element10,1,1);
          var morph11 = dom.createMorphAt(element10,3,3);
          var morph12 = dom.createMorphAt(dom.childAt(fragment, [13, 3]),1,1);
          var morph13 = dom.createMorphAt(element11,1,1);
          var attrMorph0 = dom.createAttrMorph(element11, 'class');
          var morph14 = dom.createMorphAt(element12,1,1);
          var attrMorph1 = dom.createAttrMorph(element12, 'class');
          var morph15 = dom.createMorphAt(element13,1,1);
          var attrMorph2 = dom.createAttrMorph(element13, 'class');
          var morph16 = dom.createMorphAt(element14,1,1);
          var attrMorph3 = dom.createAttrMorph(element14, 'class');
          set(env, context, "stat", blockArguments[0]);
          inline(env, morph0, context, "weight-format", [get(env, context, "stat.startWeight")], {});
          inline(env, morph1, context, "date-format", [get(env, context, "stat.accountCreated")], {});
          inline(env, morph2, context, "weight-format", [get(env, context, "stat.currentWeight.weight")], {});
          inline(env, morph3, context, "date-format", [get(env, context, "stat.currentWeight.weighed_date")], {});
          inline(env, morph4, context, "weight-format", [get(env, context, "stat.targetWeight")], {});
          block(env, morph5, context, "if", [get(env, context, "stat.dateToTarget")], {}, child0, null);
          inline(env, morph6, context, "weight-format", [get(env, context, "stat.weightToTarget")], {});
          block(env, morph7, context, "if", [get(env, context, "stat.dateToTarget")], {}, child1, null);
          inline(env, morph8, context, "weight-format", [get(env, context, "stat.minWeight.weight")], {});
          inline(env, morph9, context, "date-format", [get(env, context, "stat.minWeight.weighed_date")], {});
          inline(env, morph10, context, "weight-format", [get(env, context, "stat.maxWeight.weight")], {});
          inline(env, morph11, context, "date-format", [get(env, context, "stat.maxWeight.weighed_date")], {});
          inline(env, morph12, context, "weight-format", [get(env, context, "stat.averageWeight")], {});
          attribute(env, attrMorph0, element11, "class", concat(env, [subexpr(env, context, "table-cell-class", [get(env, context, "stat.changeLastWeek"), get(env, context, "controller.currentWeight.weight"), get(env, context, "controller.targetWeight")], {}), " weight"]));
          inline(env, morph13, context, "weight-format", [get(env, context, "stat.changeLastWeek")], {});
          attribute(env, attrMorph1, element12, "class", concat(env, [subexpr(env, context, "table-cell-class", [get(env, context, "stat.changeLastMonth"), get(env, context, "controller.currentWeight.weight"), get(env, context, "controller.targetWeight")], {}), " weight"]));
          inline(env, morph14, context, "weight-format", [get(env, context, "stat.changeLastMonth")], {});
          attribute(env, attrMorph2, element13, "class", concat(env, [subexpr(env, context, "table-cell-class", [get(env, context, "stat.changeLastYear"), get(env, context, "controller.currentWeight.weight"), get(env, context, "controller.targetWeight")], {}), " weight"]));
          inline(env, morph15, context, "weight-format", [get(env, context, "stat.changeLastYear")], {});
          attribute(env, attrMorph3, element14, "class", concat(env, [subexpr(env, context, "table-cell-class", [get(env, context, "stat.changeGreatest"), get(env, context, "controller.currentWeight.weight"), get(env, context, "controller.targetWeight")], {}), " weight"]));
          inline(env, morph16, context, "weight-format", [get(env, context, "stat.changeGreatest")], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"id","add_weight");
          dom.setAttribute(el1,"class","glyphicon glyphicon-plus");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "weight-format", [get(env, context, "weight.change")], {});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                    -\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","weight");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","text-center");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"class","black");
          dom.setAttribute(el3,"title","Edit Weight");
          var el4 = dom.createTextNode("\n                  ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","glyphicon glyphicon-edit");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"class","black");
          dom.setAttribute(el3,"title","Delete Weight");
          var el4 = dom.createTextNode("\n                  ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","glyphicon glyphicon-trash");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [5]);
          var element2 = dom.childAt(element0, [7]);
          var element3 = dom.childAt(element2, [1]);
          var element4 = dom.childAt(element2, [3]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
          var morph2 = dom.createMorphAt(element1,1,1);
          var attrMorph0 = dom.createAttrMorph(element1, 'class');
          set(env, context, "weight", blockArguments[0]);
          inline(env, morph0, context, "date-format", [get(env, context, "weight.date")], {});
          inline(env, morph1, context, "weight-format", [get(env, context, "weight.weight")], {});
          attribute(env, attrMorph0, element1, "class", concat(env, [subexpr(env, context, "table-cell-class", [get(env, context, "weight.change"), get(env, context, "controller.currentWeight.weight"), get(env, context, "controller.targetWeight")], {}), " weight"]));
          block(env, morph2, context, "if", [get(env, context, "weight.change")], {}, child0, child1);
          element(env, element3, context, "action", ["edit", get(env, context, "weight")], {});
          element(env, element4, context, "action", ["deleteModal", get(env, context, "weight")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","messageModal");
        dom.setAttribute(el1,"class","modal fade");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","modal-dialog");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"id","messageModalContent");
        dom.setAttribute(el3,"class","modal-content");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","close");
        dom.setAttribute(el4,"data-dismiss","modal");
        dom.setAttribute(el4,"aria-label","Close");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"aria-hidden","true");
        var el6 = dom.createTextNode("×");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h5");
        dom.setAttribute(el4,"class","modal-title");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","deleteModal");
        dom.setAttribute(el1,"class","modal fade");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","modal-dialog");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","modal-content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","close");
        dom.setAttribute(el5,"data-dismiss","modal");
        dom.setAttribute(el5,"aria-label","Close");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"aria-hidden","true");
        var el7 = dom.createTextNode("×");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","modal-title");
        var el6 = dom.createTextNode("Delete weight");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-body");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Warning!!! This action is permanent and cannot be reverted.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-footer");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn btn-default");
        dom.setAttribute(el5,"data-dismiss","modal");
        var el6 = dom.createTextNode("\n          Cancel\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"class","black");
        dom.setAttribute(el5,"title","Delete Weight");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6,"type","button");
        dom.setAttribute(el6,"class","btn btn-primary");
        var el7 = dom.createTextNode("\n            Delete\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","graph");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","line-legend");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label");
        dom.setAttribute(el4,"style","background-color:#AAA;");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Current weight\n      (");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("kg");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label");
        dom.setAttribute(el4,"style","background-color:#000;");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Average weight\n      (");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("kg");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label");
        dom.setAttribute(el4,"style","background-color:#9AF;");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Target weight\n      (");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("kg");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label");
        dom.setAttribute(el4,"style","background-color:#FF0000;");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Obese\n      (");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode(">");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("kg");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label");
        dom.setAttribute(el4,"style","background-color:rgba(255,127,0,0.5);");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Overweight/Underweight\n      (");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode("<");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("kg");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label");
        dom.setAttribute(el4,"style","background-color:rgba(0,255,0,0.5);");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      Normal weight\n      (");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode("<");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("kg");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","left_container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","control_panel");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("table");
        dom.setAttribute(el3,"class","weights table table-condensed table-hover");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("thead");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("tr");
        dom.setAttribute(el5,"class","table_nav");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("td");
        dom.setAttribute(el6,"colspan","2");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"id","table_title");
        var el8 = dom.createTextNode("Stats");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tbody");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("table");
        dom.setAttribute(el3,"class","weights table table-condensed table-hover");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("thead");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("tr");
        dom.setAttribute(el5,"class","table_nav");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("td");
        dom.setAttribute(el6,"colspan","5");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("              ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"id","table_title");
        var el8 = dom.createTextNode("\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("span");
        dom.setAttribute(el8,"title","Previous Page");
        var el9 = dom.createTextNode("\n                  ««\n                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                Weights\n                ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("span");
        dom.setAttribute(el8,"title","Next Page");
        var el9 = dom.createTextNode("\n                  »»\n                ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("tr");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("td");
        dom.setAttribute(el6,"class","date_width");
        var el7 = dom.createElement("strong");
        var el8 = dom.createTextNode("Date");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("td");
        dom.setAttribute(el6,"class","weight_width_20");
        var el7 = dom.createElement("strong");
        var el8 = dom.createTextNode("Weight(kg)");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("td");
        dom.setAttribute(el6,"class","weight_width_28");
        var el7 = dom.createElement("strong");
        var el8 = dom.createTextNode("Wk Change(kg)");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("td");
        dom.setAttribute(el6,"class","text-center");
        var el7 = dom.createTextNode("-");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tbody");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, element = hooks.element, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element15 = dom.childAt(fragment, [3, 1, 1, 5, 3]);
        var element16 = dom.childAt(fragment, [5]);
        var element17 = dom.childAt(element16, [3]);
        var element18 = dom.childAt(fragment, [7]);
        var element19 = dom.childAt(element18, [3, 1]);
        var element20 = dom.childAt(element19, [1, 1, 1]);
        var element21 = dom.childAt(element20, [3]);
        var element22 = dom.childAt(element21, [1]);
        var element23 = dom.childAt(element21, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 1, 1, 3]),0,0);
        var morph1 = dom.createMorphAt(element16,1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element17, [1, 3]),0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element17, [3, 3]),0,0);
        var morph4 = dom.createMorphAt(dom.childAt(element17, [5, 3]),0,0);
        var morph5 = dom.createMorphAt(dom.childAt(element17, [7, 3]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element17, [9, 3]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element17, [11, 3]),1,1);
        var morph8 = dom.createMorphAt(dom.childAt(element18, [1, 1, 3]),1,1);
        var morph9 = dom.createMorphAt(element20,1,1);
        var morph10 = dom.createMorphAt(dom.childAt(element19, [3]),1,1);
        content(env, morph0, context, "modalMessage");
        element(env, element15, context, "action", ["delete", get(env, context, "weight")], {});
        inline(env, morph1, context, "ember-chart", [], {"type": "Line", "data": get(env, context, "chartData"), "height": 700, "width": 680, "legend": false, "options": get(env, context, "chartOptions")});
        inline(env, morph2, context, "weight-format", [get(env, context, "controller.stats.firstObject.currentWeight.weight")], {});
        inline(env, morph3, context, "weight-format", [get(env, context, "controller.stats.firstObject.averageWeight")], {});
        inline(env, morph4, context, "weight-format", [get(env, context, "controller.stats.firstObject.targetWeight")], {});
        inline(env, morph5, context, "weight-format", [get(env, context, "controller.stats.firstObject.maxOverweightWeight")], {});
        inline(env, morph6, context, "weight-format", [get(env, context, "controller.stats.firstObject.maxOverweightWeight")], {});
        inline(env, morph7, context, "weight-format", [get(env, context, "controller.stats.firstObject.maxNormalWeight")], {});
        block(env, morph8, context, "each", [get(env, context, "controller.stats")], {}, child0, null);
        block(env, morph9, context, "link-to", ["weights.new"], {"class": "pull-right", "title": "Add Weight"}, child1, null);
        element(env, element22, context, "bind-attr", [], {"class": ":pull-left prevDisabled:control_disabled:control"});
        element(env, element22, context, "action", ["prevPage"], {"on": "click"});
        element(env, element23, context, "bind-attr", [], {"class": ":pull-right nextDisabled:control_disabled:control"});
        element(env, element23, context, "action", ["nextPage"], {"on": "click"});
        block(env, morph10, context, "each", [get(env, context, "controller")], {}, child2, null);
        return fragment;
      }
    };
  }()));

});
define('wt/templates/weights/new', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "partial", ["weights/form"], {});
        return fragment;
      }
    };
  }()));

});
define('wt/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('wt/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('wt/tests/authenticators/custom.jshint', function () {

  'use strict';

  module('JSHint - authenticators');
  test('authenticators/custom.js should pass jshint', function() { 
    ok(true, 'authenticators/custom.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/change-password.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/change-password.js should pass jshint', function() { 
    ok(true, 'controllers/change-password.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/login.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/login.js should pass jshint', function() { 
    ok(true, 'controllers/login.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/profile.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/profile.js should pass jshint', function() { 
    ok(true, 'controllers/profile.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/register.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/register.js should pass jshint', function() { 
    ok(true, 'controllers/register.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/reset-password.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/reset-password.js should pass jshint', function() { 
    ok(true, 'controllers/reset-password.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/weights/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers/weights');
  test('controllers/weights/edit.js should pass jshint', function() { 
    ok(true, 'controllers/weights/edit.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/weights/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/weights');
  test('controllers/weights/index.js should pass jshint', function() { 
    ok(true, 'controllers/weights/index.js should pass jshint.'); 
  });

});
define('wt/tests/controllers/weights/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/weights');
  test('controllers/weights/new.js should pass jshint', function() { 
    ok(true, 'controllers/weights/new.js should pass jshint.'); 
  });

});
define('wt/tests/helpers/date-format.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/date-format.js should pass jshint', function() { 
    ok(true, 'helpers/date-format.js should pass jshint.'); 
  });

});
define('wt/tests/helpers/resolver', ['exports', 'ember/resolver', 'wt/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('wt/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('wt/tests/helpers/start-app', ['exports', 'ember', 'wt/app', 'wt/router', 'wt/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('wt/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('wt/tests/helpers/table-cell-class.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/table-cell-class.js should pass jshint', function() { 
    ok(true, 'helpers/table-cell-class.js should pass jshint.'); 
  });

});
define('wt/tests/helpers/weight-format.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/weight-format.js should pass jshint', function() { 
    ok(true, 'helpers/weight-format.js should pass jshint.'); 
  });

});
define('wt/tests/models/stat.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/stat.js should pass jshint', function() { 
    ok(true, 'models/stat.js should pass jshint.'); 
  });

});
define('wt/tests/models/user.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user.js should pass jshint', function() { 
    ok(true, 'models/user.js should pass jshint.'); 
  });

});
define('wt/tests/models/weight.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/weight.js should pass jshint', function() { 
    ok(true, 'models/weight.js should pass jshint.'); 
  });

});
define('wt/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('wt/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('wt/tests/routes/change-password.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/change-password.js should pass jshint', function() { 
    ok(true, 'routes/change-password.js should pass jshint.'); 
  });

});
define('wt/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('wt/tests/routes/login.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/login.js should pass jshint', function() { 
    ok(true, 'routes/login.js should pass jshint.'); 
  });

});
define('wt/tests/routes/not-found.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/not-found.js should pass jshint', function() { 
    ok(true, 'routes/not-found.js should pass jshint.'); 
  });

});
define('wt/tests/routes/profile.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/profile.js should pass jshint', function() { 
    ok(true, 'routes/profile.js should pass jshint.'); 
  });

});
define('wt/tests/routes/register.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/register.js should pass jshint', function() { 
    ok(true, 'routes/register.js should pass jshint.'); 
  });

});
define('wt/tests/routes/reset-password.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/reset-password.js should pass jshint', function() { 
    ok(true, 'routes/reset-password.js should pass jshint.'); 
  });

});
define('wt/tests/routes/weights/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/weights');
  test('routes/weights/edit.js should pass jshint', function() { 
    ok(true, 'routes/weights/edit.js should pass jshint.'); 
  });

});
define('wt/tests/routes/weights/index.jshint', function () {

  'use strict';

  module('JSHint - routes/weights');
  test('routes/weights/index.js should pass jshint', function() { 
    ok(true, 'routes/weights/index.js should pass jshint.'); 
  });

});
define('wt/tests/routes/weights/new.jshint', function () {

  'use strict';

  module('JSHint - routes/weights');
  test('routes/weights/new.js should pass jshint', function() { 
    ok(true, 'routes/weights/new.js should pass jshint.'); 
  });

});
define('wt/tests/test-helper', ['wt/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('wt/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('wt/tests/transforms/isodate.jshint', function () {

  'use strict';

  module('JSHint - transforms');
  test('transforms/isodate.js should pass jshint', function() { 
    ok(true, 'transforms/isodate.js should pass jshint.'); 
  });

});
define('wt/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:application', 'Unit | Adapter | application', {});

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('wt/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('wt/tests/unit/controllers/weights/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:weights/new', {});

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('wt/tests/unit/controllers/weights/new-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/weights');
  test('unit/controllers/weights/new-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/weights/new-test.js should pass jshint.'); 
  });

});
define('wt/tests/unit/models/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('wt/tests/unit/models/user-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/user-test.js should pass jshint', function() { 
    ok(true, 'unit/models/user-test.js should pass jshint.'); 
  });

});
define('wt/tests/unit/routes/register-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:register', 'Unit | Route | register', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('wt/tests/unit/routes/register-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/register-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/register-test.js should pass jshint.'); 
  });

});
define('wt/tests/unit/routes/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:user', 'Unit | Route | user', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('wt/tests/unit/routes/user-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/user-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/user-test.js should pass jshint.'); 
  });

});
define('wt/tests/unit/routes/weights/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:weights/index', 'Unit | Route | weights/index', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('wt/tests/unit/routes/weights/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/weights');
  test('unit/routes/weights/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/weights/index-test.js should pass jshint.'); 
  });

});
define('wt/tests/unit/routes/weights/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:weights/new', 'Unit | Route | weights/new', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('wt/tests/unit/routes/weights/new-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/weights');
  test('unit/routes/weights/new-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/weights/new-test.js should pass jshint.'); 
  });

});
define('wt/tests/views/change-password.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/change-password.js should pass jshint', function() { 
    ok(true, 'views/change-password.js should pass jshint.'); 
  });

});
define('wt/tests/views/index.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/index.js should pass jshint', function() { 
    ok(true, 'views/index.js should pass jshint.'); 
  });

});
define('wt/tests/views/login.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/login.js should pass jshint', function() { 
    ok(true, 'views/login.js should pass jshint.'); 
  });

});
define('wt/tests/views/register.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/register.js should pass jshint', function() { 
    ok(true, 'views/register.js should pass jshint.'); 
  });

});
define('wt/tests/views/reset-password.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/reset-password.js should pass jshint', function() { 
    ok(true, 'views/reset-password.js should pass jshint.'); 
  });

});
define('wt/tests/views/weights/edit.jshint', function () {

  'use strict';

  module('JSHint - views/weights');
  test('views/weights/edit.js should pass jshint', function() { 
    ok(true, 'views/weights/edit.js should pass jshint.'); 
  });

});
define('wt/tests/views/weights/index.jshint', function () {

  'use strict';

  module('JSHint - views/weights');
  test('views/weights/index.js should pass jshint', function() { 
    ok(true, 'views/weights/index.js should pass jshint.'); 
  });

});
define('wt/tests/views/weights/new.jshint', function () {

  'use strict';

  module('JSHint - views/weights');
  test('views/weights/new.js should pass jshint', function() { 
    ok(true, 'views/weights/new.js should pass jshint.'); 
  });

});
define('wt/transforms/isodate', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Transform.extend({
    deserialize: function deserialize(serialized) {
      "use strict";

      if (serialized) {
        return window.moment(serialized).toDate();
      }
      return serialized;
    },

    serialize: function serialize(deserialized) {
      "use strict";

      if (deserialized) {
        return window.moment(deserialized).format();
      }
      return deserialized;
    }
  });

});
define('wt/views/change-password', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'change-password',

    keyPress: function keyPress(e) {
      'use strict';
      if (e.keyCode === 13) {
        this.get('controller').send('change');
      }
    }

  });

});
define('wt/views/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'index'
  });

});
define('wt/views/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'login',

    keyPress: function keyPress(e) {
      'use strict';
      if (e.keyCode === 13) {
        this.get('controller').send('authenticate');
      }
    }

  });

});
define('wt/views/register', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'register',

    keyPress: function keyPress(e) {
      'use strict';
      if (e.keyCode === 13) {
        this.get('controller').send('register');
      }
    }

  });

});
define('wt/views/reset-password', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'reset-password',

    keyPress: function keyPress(e) {
      'use strict';
      if (e.keyCode === 13) {
        this.get('controller').send('reset');
      }
    }

  });

});
define('wt/views/weights/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'weights/edit',

    keyPress: function keyPress(e) {
      'use strict';

      if (e.keyCode === 13) {
        this.get('controller').send('save');
      }
    }

  });

});
define('wt/views/weights/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'weights/index',
    initialize: function initialize() {
      'use strict';
    },
    didInsertElement: function didInsertElement() {
      'use strict';

      if (this.get('controller').get('modalMessage') !== false) {
        Ember['default'].$('#messageModal').modal({
          show: true
        });

        Ember['default'].$('#messageModal').on('hidden.bs.modal', function () {
          window.location = '/weights';
        });
      }
    }

  });

});
define('wt/views/weights/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'weights/new',

    keyPress: function keyPress(e) {
      'use strict';

      if (e.keyCode === 13) {
        this.get('controller').send('save');
      }
    }

  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('wt/config/environment', ['ember'], function(Ember) {
  var prefix = 'wt';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("wt/tests/test-helper");
} else {
  require("wt/app")["default"].create({"hostname":"dev.weighttracker.zz50.co.uk","name":"wt","version":"0.0.0.7971103e"});
}

/* jshint ignore:end */
//# sourceMappingURL=wt.map