
var adapter = require('./adapter');
var bind = require('event').bind;
var each = require('each');
var Field = require('./field');
var Validator = require('validator');
var validators = require('./validators');


/**
 * Expose `Validator`.
 */

module.exports = exports = FormValidator;


/**
 * Expose `adapter`.
 */

exports.adapter = adapter;


/**
 * Expose `validators`.
 */

exports.validators = validators;


/**
 * Expose `Field`.
 */

exports.Field = exports.field = Field;


/**
 * Define a value method.
 *
 * @param {Function} fn
 */

exports.value = function (fn) {
  adapter.value = fn;
};


/**
 * Define a valid method.
 *
 * @param {Function} fn
 */

exports.valid = function (fn) {
  adapter.valid = fn;
};


/**
 * Define an invalid method.
 *
 * @param {Function} fn
 */

exports.invalid = function (fn) {
  adapter.invalid = fn;
};


/**
 * Define a validator function `fn(input)`, that returns a `fn(val, done)`.
 *
 * @param {String|Object} name
 * @param {Function} fn
 */

exports.validator = function (name, fn) {
  if ('object' == typeof name) {
    for (var key in name) exports.validator(key, name[key]);
    return;
  }

  validators[name] = fn;
};


/**
 * Initialize a new `FormValidator`.
 *
 * @param {Element} el
 */

function FormValidator (el) {
  if (!(this instanceof FormValidator)) return new FormValidator(el);
  this.el = el;
  this.fields = {};
  this.validator = new Validator();

  var self = this;
  bind(el, 'submit', function (e) {
    self.validate(function (valid) {
      if (!valid) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  });
}


/**
 * Add a field `el` to be validated.
 *
 * @param {Element|String} el
 * @return {Field}
 */

FormValidator.prototype.field = function (el) {
  if ('string' === typeof el) el = this.el.querySelector('[name="' + el + '"]');
  var name = adapter.name(el);
  var field = this.fields[name] = new Field(el);

  this.validator.rule(function (val, done) {
    field.validate(done);
  });

  // to ease chaining
  field.field = this.field.bind(this);
  return field;
};


/**
 * Validate each field against all of its rules, and `callback(valid)`.
 *
 * @param {Function} callback
 * @return {FormValidator}
 */

FormValidator.prototype.validate = function (callback) {
  this.validator.validate(null, callback);
  return this;
};