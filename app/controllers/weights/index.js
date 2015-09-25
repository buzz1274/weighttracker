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
                 scaleShowHorizontalLines: true,
                 scaleShowVerticalLines: false,
                 showTooltips: false},
  chartData: Ember.computed('model', function() {
    "use strict";

    return {
      labels: Array.apply(null, new Array(this.get('content.length'))).map(String.prototype.valueOf, ''),
      datasets: [
        {
          label: "Obese",
          data: Array.apply(null, new Array(this.get('content.length'))).map(Number.prototype.valueOf, 120),
          fillColor: "rgba(255,0,0,0.05)",
          strokeColor: "transparent",
        },
        {
          label: "Overweight",
          data: Array.apply(null, new Array(this.get('content.length'))).map(Number.prototype.valueOf, 98),
          fillColor: "rgba(255,255,0,0.05)",
          strokeColor: "rgba(255,127,0,0.5)",
        },
        {
          label: "Normal Weight",
          data: Array.apply(null, new Array(this.get('content.length'))).map(Number.prototype.valueOf, 85),
          fillColor: "rgba(0,255,255,0.05)",
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
          data: Array.apply(null, new Array(this.get('content.length'))).map(Number.prototype.valueOf, 78),
          strokeColor: "#9Af",
        },
      ]
    };

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

    this.set('startRecord', (this.page - 1) * this.recordsPerPage);
    this.set('totalPages', Math.ceil(this.get('content.length') /
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
             'nextDisabled', 'updateArrangedContent')
});
