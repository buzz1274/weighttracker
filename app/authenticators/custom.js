import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function(data) {
    console.log("restore");
  },
  authenticate: function(options) {
    console.log("authenticate");
    console.log(options);
  },
  invalidate: function(data) {
    console.log("invalidate");
  }
});
