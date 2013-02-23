var isEmail = require('is-email');



exports.required = function (done, message, value) {
  done(null, [message, !!value]);
};


exports.min = function (done, message, value, length) {
  done(null, [message, value.length > length]);
};


exports.max = function (done, message, value, length) {
  done(null, [message, value.length < length]);
};


exports.email = function (done, message, value) {
  done(null, [message, isEmail(value)]);
};


exports.regex = function (done, message, value, regex) {
  done(null, [message, regex.test(value)]);
};