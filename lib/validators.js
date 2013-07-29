
var email = require('is-email');


/**
 * Required.
 */

exports.required = function (val, done) {
  done(!!val);
};


/**
 * Regexp.
 */

exports.regexp = function (regexp) {
  return function (val, done) {
    done(regexp.test(val));
  };
};


/**
 * Email address.
 */

exports.email = function (val, done) {
  done(email(val));
};


/**
 * Minimum length.
 */

exports.min =
exports.minimum = function (length) {
  return function (val, done) {
    var l = val.length
      ? val.length
      : val;
    done(l >= length);
  };
};


/**
 * Maximum length.
 */

exports.max =
exports.maximum = function (length) {
  return function (val, done) {
    var l = val.length
      ? val.length
      : val;
    done(l <= length);
  };
};