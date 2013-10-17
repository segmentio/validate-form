
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
 */

function Field (el) {
  if (!(this instanceof Field)) return new Field(el);
  this.el = el;
  this._required = false;
  this._valid = true;
  this.validator = new Validator();
}


/**
 * Get or set the field's validity.
 *
 * @param {Boolean} valid (optional)
 * @param {String} msg (optional)
 * @return {Boolean|Field}
 */

Field.prototype.valid = function (valid, msg) {
  if (0 === arguments.length) return this._valid;
  this._valid = valid;
  valid
    ? adapter.valid(this.el)
    : adapter.invalid(this.el, msg);
  return this;
};


/**
 * Validate our element against all of its rules, and `callback(valid)`.
 *
 * @param {Function} callback
 * @return {Field}
 */

Field.prototype.validate = function (callback) {
  var self = this;
  var value = adapter.value(this.el);
  var done = function (valid, msg) {
    self.valid(valid, msg);
    callback && callback(valid, msg);
  };

  if ('' === value && !this._required) {
    done(true);
  } else {
    this.validator.validate(value, done);
  }

  return this;
};


/**
 * Add a validation `fn` displaying `message` when invalid.
 *
 * @param {Function|RegExp|String} fn
 * @param {Mixed} settings (optional)
 * @param {String} message
 * @return {Field}
 */

Field.prototype.is = function (fn, settings, message) {
  var last = arguments.length - 1;
  settings = [].slice.call(arguments, 1, last);
  message = arguments[last];

  // mark as required
  if ('required' == fn) this._required = true;

  // regexp
  if ('regexp' === type(fn)) fn = validators.regexp(fn);

  // shorthand
  if ('string' === type(fn)) fn = validators[fn];

  // handle fns that take settings
  if (settings.length) fn = fn.apply(null, settings);

  this.validator.rule(fn, message);
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
    self.validate();
  });
  return this;
};