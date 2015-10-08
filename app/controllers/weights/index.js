import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['date'],
  sortAscending: false,
  recordsPerPage: 10,
  startRecord: 1,
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
                 scaleGridLineColor : "rgba(0,0,0,0.10)",
                 scaleLabel : "<%= Number(value) + ' kg'%>",
                 showTooltips: false},
  chartData: Ember.computed('model', function() {
    "use strict";

    var obeseWeight = 0,
        roundWeightToNearest = 5,
        weightCushion = 5,
        minWeight = Number(this.get('stats').objectAt(0).get('minWeight.weight')),
        maxWeight = Number(this.get('stats').objectAt(0).get('maxWeight.weight')),
        maxNormalWeight = Number(this.get('stats').objectAt(0).get('maxNormalWeight')),
        maxUnderweightWeight = Number(this.get('stats').objectAt(0).get('maxUnderweightWeight')),
        targetWeight = Number(this.get('stats').objectAt(0).get('targetWeight')),
        maxOverweightWeight = Number(this.get('stats').objectAt(0).get('maxOverweightWeight'));

    if((maxOverweightWeight + weightCushion) > maxWeight) {
      obeseWeight =
        roundWeightToNearest * Math.round((maxOverweightWeight + weightCushion) / roundWeightToNearest);
    } else {
      if(minWeight < targetWeight) {
        this.chartOptions.scaleStartValue =
          roundWeightToNearest * Math.round((minWeight - weightCushion) / roundWeightToNearest);
      } else {
        this.chartOptions.scaleStartValue =
          roundWeightToNearest * Math.round((targetWeight - weightCushion) / roundWeightToNearest);
      }

      obeseWeight =
        roundWeightToNearest * Math.round((maxWeight + weightCushion) / roundWeightToNearest);

      this.chartOptions.scaleOverride = true;
      this.chartOptions.scaleStepWidth = 5;
      this.chartOptions.scaleSteps =
        (obeseWeight - this.chartOptions.scaleStartValue) / this.chartOptions.scaleStepWidth;
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
          strokeColor: "#FF0000",
        },
        {
          label: "Overweight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, maxOverweightWeight),
          fillColor: "rgba(255,255,0,0.05)",
          strokeColor: "rgba(255,127,0,0.5)",
        },
        {
          label: "Normal Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, maxNormalWeight),
          fillColor: "rgba(0,255,255,0.05)",
          strokeColor: "rgba(0,255,0,0.5)",
        },
        {
          label: "Underweight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, maxUnderweightWeight),
          fillColor: "rgba(255,0,0,0.05)",
          strokeColor: "rgba(0,255,0,0.5)",
        },
        {
          label: "Weight",
          fillColor: "transparent",
          strokeColor: "#AAA",
          datasetStrokeWidth: 5,
          data: this.get('content').mapBy('weight').reverse()
        },
        {
          label: "Target Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, targetWeight),
          strokeColor: "#9AF",
        },
      ]
    };

    if(minWeight > (maxUnderweightWeight + weightCushion) ||
       targetWeight > (maxUnderweightWeight + weightCushion)) {
      dataset.datasets[3].data = [];
    }

    if(maxWeight < (maxOverweightWeight + weightCushion) ||
       targetWeight > (maxOverweightWeight + weightCushion)) {
      dataset.datasets[0].data = [];
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
