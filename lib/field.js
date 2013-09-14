
var adapter = require('./adapter')
  , Batch = require('batch')
  , bind = require('event').bind
  , each = require('each')
  , type = require('type')
  , validators = require('./validators');


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
  this._valid = true;
  this.rules = {};
  this.count = 0;
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
 * Validate our element against all of its rules, and callback `fn(err, res)`.
 *
 * @param {Function} callback
 * @return {Field}
 */

Field.prototype.validate = function (fn) {
  var self = this;
  var val = adapter.value(this.el);
  var batch = new Batch();

  each(this.rules, function (key, rule) {
    batch.push(function (done) {
      if (!self._required && '' === val) return done(); // optional fields
      rule.fn(val, function (err, valid) {
        if (err) throw err;
        if (!valid) return done([rule.msg]);
        done();
      });
    });
  });

  batch.end(function (err, res) {
    var valid = !err;
    var message;
    if (err) message = err[0];
    self.valid(valid, message);
    fn(null, valid);
  });

  return this;
};


/**
 * Add a validation rule, `fn(val, done)`, displaying `msg` on invalid.
 *
 * @param {Function|RegExp|String} fn
 * @param {Mixed} value (optional)
 * @param {String} msg (optional)
 * @return {Field}
 */

Field.prototype.is = function (fn, value, msg) {

  // regexp
  if ('regexp' === type(fn)) {
    fn = validators.regexp(fn);
    msg = value;
  }

  // shorthand
  if ('string' === type(fn)) {
    if ('required' == fn) this._required = true;
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
 * @return {Field}
 */

Field.prototype.on = function (trigger) {
  var self = this;
  bind(this.el, trigger, function (e) {
    self.validate();
  });
  return this;
};