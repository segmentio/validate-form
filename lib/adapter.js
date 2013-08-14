
var classes = require('classes')
  , domify = require('domify')
  , next = require('next-sibling')
  , type = require('type')
  , value = require('value');


/**
 * Default value method. Handles elements, and views with a `value` method.
 *
 * @param {Element} el
 */

exports.value = function (el) {
  if ('function' === typeof el.value) return el.value();
  return value(el);
};


/**
 * Default name method. Handles elements and views with a `name` method.
 *
 * @param {Element} el
 */

exports.name = function (el) {
  if ('function' === typeof el.name) return el.name();
  return el.name;
};


/**
 * Default valid method, just clear.
 *
 * @param {Element} el
 */

exports.valid = clear;


/**
 * Default invalid method. Handles elements, and views with an `el` property.
 *
 * @param {Element} el
 * @param {String} msg
 */

exports.invalid = function (el, msg) {
  if ('element' === type(el.el)) el = el.el;

  clear(el);
  classes(el).add('invalid');
  if (msg && el.parentNode) {
    var message = domify('<label class="validator-message">');
    message.textContent = msg;
    el.parentNode.insertBefore(message, el.nextSibling);
  }
};


/**
 * Clear validation state. Handles elements, and views with an `el`  property.
 *
 * @param {Element} el
 */

function clear (el) {
  if ('element' === type(el.el)) el = el.el;

  classes(el).remove('invalid');
  var message;
  while (message = next(el, '.validator-message')) {
    el.parentNode.removeChild(message);
  }
}