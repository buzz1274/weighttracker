import Ember from 'ember';

export default Ember.ArrayController.extend({
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
  chartOptions: {pointDot: false,
                 animation: false,
                 scaleShowHorizontalLines: true,
                 scaleShowVerticalLines: false,
                 scaleOverride: true,
                 scaleSteps: 9,
                 scaleGridLineColor : "rgba(0,0,0,0.10)",
                 scaleLabel : "<%= Number(value) + ' kg'%>",
                 showTooltips: false},
  chartData: Ember.computed('model', function() {
    "use strict";

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

    if(minWeight < targetWeight) {
      this.chartOptions.scaleStartValue =
        roundWeightToNearest * Math.round((minWeight - weightCushion) / roundWeightToNearest);
    } else {
      this.chartOptions.scaleStartValue =
        roundWeightToNearest * Math.round((targetWeight - weightCushion) / roundWeightToNearest);
    }

    var yScaleMaxValue =
      roundWeightToNearest * Math.round((maxWeight + weightCushion) / roundWeightToNearest);

    this.chartOptions.scaleStepWidth =
      Math.round((yScaleMaxValue - this.chartOptions.scaleStartValue) / this.chartOptions.scaleSteps);

    if(yScaleMaxValue < (this.chartOptions.scaleStartValue +
                         (this.chartOptions.scaleSteps * this.chartOptions.scaleStepWidth))) {

      yScaleMaxValue =
        this.chartOptions.scaleStartValue +
          (this.chartOptions.scaleSteps * this.chartOptions.scaleStepWidth);
    }

    if(maxOverweightWeight < yScaleMaxValue) {
      obeseWeight = yScaleMaxValue;
    } else if(maxNormalWeight < yScaleMaxValue) {
      maxOverweightWeight = yScaleMaxValue;
    } else if(maxUnderweightWeight < yScaleMaxValue) {
      maxNormalWeight = yScaleMaxValue;
    } else {
      maxUnderweightWeight = yScaleMaxValue;
    }

    var dataset =  {
      labels: this.calculateXAxisLabels(),
      showXLabels: 10,
      datasets: [
        {
          label: "Obese",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, obeseWeight),
          fillColor: "rgba(255,0,0,0.05)",
          strokeColor: "#FF0000"
        },
        {
          label: "Overweight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, maxOverweightWeight),
          fillColor: "rgba(255,255,0,0.07)",
          strokeColor: "rgba(255,127,0,0.5)"
        },
        {
          label: "Normal Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, maxNormalWeight),
          fillColor: "rgba(0,255,255,0.05)",
          strokeColor: "rgba(0,255,0,0.5)"
        },
        {
          label: "Underweight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, maxUnderweightWeight),
          fillColor: "rgba(255,127,0,0.10)",
          strokeColor: "rgba(255,127,0,0.5)"
        },
        {
          label: "Weight",
          fillColor: "transparent",
          strokeColor: "#AAA",
          datasetStrokeWidth: 5,
          data: this.get('content').mapBy('weight').reverse()
        },
        {
          label: "Average Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, averageWeight),
          strokeColor: "#000",
        },
        {
          label: "Target Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, targetWeight),
          strokeColor: "#9AF",
        },
      ]
    };

    if((minWeight < obeseWeight && targetWeight < obeseWeight &&
        yScaleMaxValue < obeseWeight) || !obeseWeight) {
      dataset.datasets[0].data = [];
    }

    if(minWeight < maxOverweightWeight && targetWeight < maxOverweightWeight &&
       yScaleMaxValue < maxOverweightWeight) {
      dataset.datasets[1].data = [];
    }

    if((minWeight < maxNormalWeight || minWeight > maxNormalWeight) &&
       targetWeight < maxNormalWeight && yScaleMaxValue < maxNormalWeight) {
      dataset.datasets[2].data = [];
    }

    if(minWeight > maxUnderweightWeight &&
       targetWeight > maxUnderweightWeight &&
       yScaleMaxValue > maxUnderweightWeight) {
      dataset.datasets[3].data = [];
    }

    return dataset;

  }),
  actions: {
    prevPage: function() {
      "use strict";

      if(this.page > 1) {
        this.decrementProperty('page', 1);
      } else {
        this.set('page', 1);
      }

    },
    nextPage: function() {
      "use strict";

      if(this.page < this.totalPages) {
        this.incrementProperty('page', 1);
      }

    },
    edit: function(weight) {
      "use strict";

      this.transitionToRoute('/weights/'+weight.id+'/edit');

    },
    delete: function() {
      "use strict";

      var that = this;

      this.get('weightToDelete').destroyRecord(this.get('weightToDelete')).then(() => {

        this.set('weightToDelete', false);
        this.set('modalMessage', 'Weight deleted');

        Ember.$('#deleteModal').modal('hide');
        Ember.$('#messageModal').modal({
          show: true
        });

        Ember.$('#messageModal').on('hidden.bs.modal', function() {
          window.location = '/weights';
        });

      }).catch(function(response) {
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
    cancelDelete: function() {
      "use strict";

      this.set('weightToDelete', false);
      Ember.$('#deleteModal').modal('hide');

    },
    deleteModal: function(weight) {
      "use strict";

      this.set('weightToDelete', weight);

      Ember.$('#deleteModal').modal({
        show: true
      });

    }
  },
  arrangedContent: function() {
    "use strict";

    this.set('totalWeights', this.get('content.length'));
    this.set('startRecord', (this.page - 1) * this.recordsPerPage);
    this.set('totalPages', Math.ceil(this.get('totalWeights') /
                           this.recordsPerPage));

    if(this.page < this.totalPages) {
      this.set('nextDisabled', false);
    } else {
      this.set('nextDisabled', true);
    }

    if(this.page === 1) {
      this.set('prevDisabled', true);
    } else {
      this.set('prevDisabled', false);
    }

    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      content: this.get('model').toArray(),
      sortProperties: this.get('sortProperties'),
      sortAscending: this.get('sortAscending')
    }).slice(this.startRecord, this.startRecord + this.recordsPerPage);

  }.property('weight', 'page', 'totalPages', 'prevDisabled',
             'nextDisabled', 'totalWeights'),
  calculateXAxisLabels: function() {
    "use strict";
    var dates = [],
        totalWeights = this.get('totalWeights'),
        currentDate = false,
        lastAddedDate = false,
        countWhenAdded = 0,
        weighedDates = this.get('content').mapBy('date').reverse(),
        skipDateAmount = totalWeights * 0.10;

    for (var i = 0; i < totalWeights; i++) {
      currentDate = window.moment(weighedDates[i]).format('MMMM Do, YYYY');
      if(i === 0) {
        dates[i] = currentDate;
        lastAddedDate = currentDate;
        countWhenAdded = i;
      } else if(i === totalWeights - 1) {
        dates[i] = currentDate;
      } else {
        if((i - countWhenAdded) > skipDateAmount &&
           (i + skipDateAmount) < totalWeights) {
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
