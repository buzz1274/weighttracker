import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: window.location.protocol+'//'+window.location.hostname,
  namespace: 'api'
});
