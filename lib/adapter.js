
var classes = require('classes');
var domify = require('domify');
var next = require('next-sibling');
var type = require('type');
var value = require('value');


/**
 * Default value method.
 *
 * @param {Element} el
 */

exports.value = function (el) {
  if ('function' == typeof el.value) return el.value();
  if ('element' == type(el)) return value(el);
};


/**
 * Default valid method.
 *
 * @param {Element} el
 */

exports.valid = function (el) {
  if ('function' == typeof el.valid) return el.valid();
  if ('element' != type(el)) return;
  clear(el);
  classes(el).remove('invalid');
};


/**
 * Default invalid method.
 *
 * @param {Element} el
 * @param {String} msg
 */

exports.invalid = function (el, msg) {
  if ('function' == typeof el.invalid) return el.invalid(msg);
  if ('element' != type(el)) return;

  clear(el);
  classes(el).add('invalid');

  if (msg && el.parentNode) {
    var message = domify('<label class="validator-message">');
    message.textContent = msg;
    el.parentNode.insertBefore(message, el.nextSibling);
  }
};


/**
 * Clear validation messages.
 *
 * @param {Element} el
 */

function clear (el) {
  var message;
  while (message = next(el, '.validator-message')) {
    if (el.parentNode) el.parentNode.removeChild(message);
  }
}