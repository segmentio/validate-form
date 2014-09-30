
var email = require('is-email');
var hex = require('is-hex-color');
var hsl = require('is-hsl-color');
var rgb = require('is-rgb-color');
var trim = require('trim');
var url = require('is-url');


/**
 * Required.
 */

exports.required = trim;


/**
 * Email addresses.
 */

exports.email = email;


/**
 * URLs.
 */

exports.url = url;


/**
 * HEX color.
 */

exports.hex = hex;


/**
 * HSL color.
 */

exports.hsla = exports.hsl = hsl;


/**
 * RGB color.
 */

exports.rgba = exports.rgb = rgb;


/**
 * Any color string.
 */

exports.color = function (val) {
  return hex(val) || hsl(val) || rgb(val);
};


/**
 * Number.
 *
 * Note: this won't work for straight up element validation since they
 * always return strings.
 */

exports.number = function (val) {
  return 'number' == typeof val;
};


/**
 * Regexp.
 *
 * @param {RegExp|String} regexp
 */

exports.regexp = function (regexp) {
  return function (val) {
    return  new RegExp(regexp).test(val);
  };
};


/**
 * Minimum length.
 *
 * @param {Number} length
 */

exports.min =
exports.minimum = function (length) {
  return function (val) {
    var l = val.length ? val.length : val;
    return l >= length;
  };
};


/**
 * Maximum length.
 * @param {Number} length
 */

exports.max =
exports.maximum = function (length) {
  return function (val) {
    var l = val.length ? val.length : val;
    return l <= length;
  };
};