import ENV from "../config/environment";
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://'+ENV.APP.hostname,
  namespace: 'api'
});
