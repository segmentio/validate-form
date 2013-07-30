
var email = require('is-email');
var trim = require('trim');


/**
 * Required.
 */

exports.required = function (val, done) {
  done(null, !!trim(val));
};


/**
 * Regexp.
 *
 * @param {RegExp|String} regexp
 */

exports.regexp = function (regexp) {
  if ('string' === typeof regexp) regexp = new RegExp(regexp);
  return function (val, done) {
    done(null, regexp.test(val));
  };
};


/**
 * Email address.
 */

exports.email = function (val, done) {
  done(null, email(val));
};


/**
 * Minimum length.
 *
 * @param {Number} length
 */

exports.min =
exports.minimum = function (length) {
  return function (val, done) {
    var l = val.length
      ? val.length
      : val;
    done(null, l >= length);
  };
};


/**
 * Maximum length.
 * @param {Number} length
 */

exports.max =
exports.maximum = function (length) {
  return function (val, done) {
    var l = val.length
      ? val.length
      : val;
    done(null, l <= length);
  };
};
