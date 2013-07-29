
var classes = require('classes')
  , domify = require('domify')
  , value = require('value');


/**
 * Default value method.
 *
 * @param {Element} el
 */

exports.value = function (el) {
 return value(el);
};


/**
 * Default valid method, noop.
 *
 * @param {Element} el
 */

exports.valid = clear;


/**
 * Default invalid method.
 *
 * @param {Element} el
 * @param {String} msg
 */

exports.invalid = function (el, msg) {
  clear(el);
  classes(el).add('invalid');
  if (msg && el.parentNode) {
    var message = domify('<label class="validator-message">');
    message.textContent = msg;
    el.parentNode.insertBefore(message, el.nextSibling);
  }
};


/**
 * Clear validation state.
 *
 * @param {Element} el
 */

function clear (el) {
  classes(el).remove('invalid');
  var next;
  while (next = el.nextSibling) {
    if (classes(next).has('validator-message')) el.parentNode.removeChild(next);
  }
}