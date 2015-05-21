import ENV from "../config/environment";

export default DS.RESTAdapter.extend({
  host: 'http://'+ENV.APP.hostname,
  namespace: 'api'
});
