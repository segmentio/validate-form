
var classes = require('classes');
var domify = require('domify');
var next = require('next-sibling');
var type = require('type');
var value = require('value');


/**
 * Default element accessor.
 *
 * @param {Element|Object} view
 */

exports.el = function (view) {
  if (view.el) return view.el; // handle views
  return view;
};


/**
 * Default value method.
 *
 * @param {Element|Object} view
 */

exports.value = function (view) {
  var el = this.el(view);
  if ('function' == typeof view.value) return view.value();
  if ('element' != type(el)) return;
  return value(el);
};


/**
 * Default valid method.
 *
 * @param {Element|Object} view
 */

exports.valid = function (view) {
  this.clear(view);
  var el = this.el(view);
  if ('function' == typeof view.valid) return view.valid();
  if ('element' != type(el)) return;

  classes(el).add('valid');
};


/**
 * Default invalid method.
 *
 * @param {Element|Object} view
 * @param {String} msg
 */

exports.invalid = function (view, msg) {
  this.clear(view);
  var el = this.el(view);
  if ('function' == typeof view.invalid) return view.invalid(msg);
  if ('element' != type(el)) return;

  classes(el).add('invalid');
  if (msg && el.parentNode) {
    var message = domify('<label class="validator-message">');
    message.textContent = msg;
    el.parentNode.insertBefore(message, el.nextSibling);
  }
};


/**
 * Default clear validation method.
 *
 * @param {Element|Object} view
 */

exports.clear = function (view) {
  var el = this.el(view);
  if ('function' == typeof view.valid) return view.valid();
  if ('element' != type(el)) return;

  classes(el).remove('valid').remove('invalid');
  var message;
  while (message = next(el, '.validator-message')) {
    if (el.parentNode) el.parentNode.removeChild(message);
  }
};