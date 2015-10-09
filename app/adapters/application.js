import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: window.location.protocol+'//'+window.location.hostname,
  namespace: 'api',
  ajax: function(url, method, hash) {
    "use strict";

    if(typeof hash === 'undefined') {
      hash = {};
    }

    hash.xhrFields = {withCredentials: true};

    return this._super(url, method, hash);

  }
});
