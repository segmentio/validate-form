
var adapter = require('./adapter')
  , Batch = require('batch')
  , bind = require('event').bind
  , type = require('type')
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
 * Initialize a new `Validator`.
 */

function Validator (el) {
  if (!(this instanceof Validator)) return new Validator(el);
  this.el = el;
  this._valid = true;
  this.rules = {};
  this.count = 0;
}


/**
 * Use the given `plugin`.
 *
 * @param {Function} plugin
 */

Validator.use = function (plugin) {
  plugin(this);
  return this;
};


/**
 * Get or set the field's validity.
 *
 * @param {Boolean} valid (optional)
 * @param {String} msg (optional)
 * @return {Boolean|Validator}
 */

Validator.prototype.valid = function (valid, msg) {
  if (0 === arguments.length) return this._valid;
  this._valid = valid;
  valid
    ? adapter.valid(this.el)
    : adapter.invalid(this.el, msg);
  return this;
};


/**
 * Validate our element against all of its rules.
 *
 * @return {Validator}
 */

Validator.prototype.validate = function () {
  var self = this;
  var val = adapter.value(this.el);
  var batch = new Batch();

  for (var key in this.rules) {
    var rule = this.rules[key];
    batch.push(function (done) {
      rule.fn(val, function (err, valid) {
        if (err) throw err;
        if (!valid) return done([rule.msg]);
        done();
      });
    });
  }

  batch.end(function (err, res) {
    if (err) return self.valid(false, err[0]);
    self.valid(true);
  });

  return this;
};


/**
 * Add a validation rule, `fn(val, done)`, displaying `msg` on invalid.
 *
 * @param {Function|RegExp|String} fn
 * @param {Mixed} value (optional)
 * @param {String} msg (optional)
 * @return {Validator}
 */

Validator.prototype.is = function (fn, value, msg) {

  // regexp
  if ('regexp' === type(fn)) {
    fn = validators.regexp(fn);
    msg = value;
  }

  // shorthand
  if ('string' === type(fn)) {
    fn = validators[fn];
  }

  // handle fns that take a value
  if (1 === fn.length) {
    fn = fn(value);
  } else if ('string' === type(value)) {
    msg = value;
  }

  this.rules[this.count] = { fn: fn, msg: msg };
  this.count++;
  return this;
};


/**
 * Set the trigger for validation.
 *
 * @param {String} trigger
 * @return {Validator}
 */

Validator.prototype.on = function (trigger) {
  if ('submit' === trigger) throw new Error('handle submit case');
  bind(this.el, trigger, this.validate.bind(this));
  return this;
};