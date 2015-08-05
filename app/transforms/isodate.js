import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function (serialized) {
    "use strict";

    if (serialized) {
      return window.moment(serialized).toDate();
    }
    return serialized;
  },

  serialize: function (deserialized) {
    "use strict";

    if (deserialized) {
      return window.moment(deserialized).format();
    }
    return deserialized;
  }
});
