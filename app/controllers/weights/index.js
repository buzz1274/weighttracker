import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['date'],
  sortAscending: false,
  recordsPerPage: 10,
  startRecord: 1,
  page: 1,
  totalPages: 1,
  prevDisabled: true,
  nextDisabled: true,
  stats: false,
  targetWeight: false,
  currentWeight: false,
  updateArrangedContent: false,
  chartOptions: {pointDot: false,
                 animation: false,
                 height: 700,
                 scaleShowHorizontalLines: true,
                 scaleShowVerticalLines: false,
                 scaleGridLineColor : "rgba(0,0,0,0.10)",

                 showTooltips: false},
  chartData: Ember.computed('model', function() {
    "use strict";

    var obeseWeight = 0;

    if(this.get('stats').objectAt(0).get('maxOverweightWeight') >
       this.get('stats').objectAt(0).get('maxWeight')) {
      obeseWeight = Number(this.get('stats').objectAt(0).get('maxOverweightWeight')) + 5;
    } else {
      obeseWeight = Number(this.get('stats').objectAt(0).get('maxWeight.weight')) + 5;
    }

    var dataset =  {
      labels: Array.apply(null, new Array(this.get('totalWeights'))).map(
        String.prototype.valueOf, ''),
      datasets: [
        {
          label: "Obese",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, Math.round(Number(obeseWeight))),
          fillColor: "rgba(255,0,0,0.05)",
          strokeColor: "transparent",
        },
        {
          label: "Overweight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, this.get('stats').objectAt(0).get('maxOverweightWeight')),
          fillColor: "rgba(255,255,0,0.05)",
          strokeColor: "rgba(255,127,0,0.5)",
        },
        {
          label: "Normal Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, this.get('stats').objectAt(0).get('maxNormalWeight')),
          fillColor: "rgba(0,255,255,0.05)",
          strokeColor: "rgba(0,255,0,0.5)",
        },
        {
          label: "Underweight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, this.get('stats').objectAt(0).get('maxUnderweightWeight')),
          fillColor: "rgba(255,0,0,0.05)",
          strokeColor: "rgba(0,255,0,0.5)",
        },
        {
          label: "Weight",
          fillColor: "transparent",
          strokeColor: "#AAA",
          data: this.get('content').mapBy('weight').reverse()
        },
        {
          label: "Target Weight",
          data: Array.apply(null, new Array(this.get('totalWeights'))).map(
            Number.prototype.valueOf, this.get('targetWeight')),
          strokeColor: "#9Af",
        },
      ]
    };

    if(this.get('stats').objectAt(0).get('minWeight') >
       this.get('stats').objectAt(0).get('maxUnderweightWeight') + 5 ||
       this.get('targetWeight') >
       this.get('stats').objectAt(0).get('maxUnderweightWeight') + 5) {
      dataset.datasets[3].data = [];
    }

    if(this.get('stats').objectAt(0).get('maxWeight') <
      this.get('stats').objectAt(0).get('maxOverweightWeight') + 5 ||
      this.get('targetWeight') >
      this.get('stats').objectAt(0).get('maxOverweightWeight') + 5) {
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
    updateArrangedContent: function() {
      "use strict";

      this.set('updateArrangedContent', true);

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

    this.set('updateArrangedContent', false);

    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      content: this.get('model').toArray(),
      sortProperties: this.get('sortProperties'),
      sortAscending: this.get('sortAscending')
    }).slice(this.startRecord, this.startRecord + this.recordsPerPage);

  }.property('weight', 'page', 'totalPages', 'prevDisabled',
             'nextDisabled', 'updateArrangedContent', 'totalWeights')
});
