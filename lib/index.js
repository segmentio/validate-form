
var adapter = require('./adapter')
  , Batch = require('batch')
  , bind = require('event').bind
  , contains = require('contains')
  , each = require('each')
  , Field = require('./field')
  , validators = require('./validators');


/**
 * Expose `Validator`.
 */

module.exports = exports = Validator;


/**
 * Define value method.
 */

exports.value = function (fn) {
  adapter.value = fn;
};


/**
 * Define valid method.
 */

exports.valid = function (fn) {
  adapter.valid = fn;
};


/**
 * Define invalid method.
 */

exports.invalid = function (fn) {
  adapter.invalid = fn;
};


/**
 * Expose `adapter`.
 */

exports.adapter = adapter;


/**
 * Define a validator function `fn(input)`, that returns a `fn(val, done)`.
 */

exports.validator = function (name, fn) {
  validators[name] = fn;
};


/**
 * Expose `validators`.
 */

exports.validators = validators;


/**
 * Expose `Field`.
 */

exports.Field = exports.field = Field;


/**
 * Initialize a new `Validator`.
 *
 * @param {Element} el
 */

function Validator (el) {
  if (!(this instanceof Validator)) return new Validator(el);
  this.el = el;
  this.fields = {};

  var self = this;
  bind(el, 'submit', function (e) {
    self.validate(function (err, res) {
      if (err) throw err;
      if (!res) {
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

Validator.prototype.field = function (el) {
  if ('string' === typeof el) el = this.el.querySelector('[name="' + el + '"]');
  var name = el.getAttribute('name');
  var field = this.fields[name] = new Field(el);

  // to ease chaining
  field.field = this.field.bind(this);
  return field;
};


/**
 * Validate each field against all of its rules, and callback `fn(err, res)`.
 *
 * @param {Function} callback
 * @return {Validator}
 */

Validator.prototype.validate = function (fn) {
  var fields = this.fields;
  var batch = new Batch();

  each(this.fields, function (name, field) {
    batch.push(function (done) {
      field.validate(function (err, valid) {
        if (err) return done(err);
        done(null, valid);
      });
    });
  });

  batch.end(function (err, res) {
    contains(res || [], false)
      ? fn(err, false)
      : fn(err, true);
  });

  return this;
};