
var email = require('is-email');
var trim = require('trim');
var url = require('is-url');


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
 * URLs.
 */

exports.url = function (val, done) {
  done(null, url(val));
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


/**
 * HEX color.
 */

var colorMatcher = /#[a-f0-9]{3}([a-f0-9]{3})?/i;

exports.color = function (val, done) {
  done(null, colorMatcher.test(val));
};


/**
 * Number.
 *
 * Note: this won't work for straight up element validation since they
 * always return strings.
 */

exports.number = function (val, done) {
  done(null, 'number' === typeof val);
};