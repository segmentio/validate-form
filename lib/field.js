
var adapter = require('./adapter');
var bind = require('event').bind;
var each = require('each');
var type = require('type');
var Validator = require('validator');
var validators = require('./validators');


/**
 * Expose `Field`.
 */

module.exports = Field;


/**
 * Initialize a new `Field`.
 *
 * @param {Element} el
 * @param {Object} adapter
 * @param {Object} validators
 */

function Field (el, adapter, validators) {
  this.el = el;
  this.adapter = adapter;
  this.validators = validators;
  this._validator = new Validator();
  this._required = false;
  this._valid = true;
}


/**
 * Add a validation `fn` displaying `message` when invalid.
 *
 * @param {Function|RegExp|String} fn
 * @param {Mixed} settings (optional)
 * @param {String} message (optional)
 * @return {Field}
 */

Field.prototype.is = function (fn) {
  var settings = arguments.length < 3 ? [] : [].slice.call(arguments, 1, arguments.length - 1);
  var message = arguments.length == 1 ? '' : arguments[arguments.length - 1];

  // mark as required
  if ('required' == fn) this._required = true;

  // regexp
  if ('regexp' == type(fn)) fn = this.validators.regexp(fn);

  // shorthand
  if ('string' == type(fn)) fn = this.validators[fn];

  // handle fns that take settings
  if (settings.length) fn = fn.apply(null, settings);

  this._validator.rule(fn, message);
  return this;
};


/**
 * Validate our element against all of its rules, and `callback(valid)`.
 *
 * @param {Function} callback (optional)
 * @return {Field}
 */

Field.prototype.validate = function (callback) {
  var value = this.adapter.value(this.el);

  // optional state
  if (!value && !this._required) {
    this.adapter.valid(this.el);
    callback && callback(true);
    return this;
  }

  var self = this;
  this._validator.validate(value, function (valid, msg) {
    valid
      ? self.adapter.valid(self.el)
      : self.adapter.invalid(self.el, msg);
    callback && callback(valid, msg);
  });
  return this;
};


/**
 * Set an `event` trigger for validation.
 *
 * @param {String} event
 * @return {Field}
 */

Field.prototype.on = function (event) {
  var self = this;
  bind(this.el, event, function (e) {
    // don't validate an empty input on blur, that's annoying
    if ('blur' === event && !self.adapter.value(self.el)) return;
    self.validate();
  });
  return this;
};