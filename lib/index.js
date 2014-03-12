
var adapter = require('./adapter');
var bind = require('bind');
var event = require('event');
var clone = require('clone');
var each = require('each');
var async = require('async-each');
var extend = require('extend');
var Field = require('./field');
var submit = require('submit-form');
var Vldtr = require('validator');
var validators = require('./validators');


/**
 * Expose `Validator`.
 */

module.exports = exports = Validator;


/**
 * Initialize a new `Validator`.
 *
 * @param {Element} form
 */

function Validator (form) {
  if (!(this instanceof Validator)) return new Validator(form);
  this.opts = { validateEmpty: false };
  this.form = form;
  this._fields = [];
  this._validator = new Vldtr();
  this.adapter = clone(adapter);
  this.validators = clone(validators);
  this.submit = bind(this, this.submit);
  this.bind();
}


/**
 * Use a `plugin`.
 *
 * @param {Function} plugin
 * @return {Validator}
 */

Validator.prototype.use = function (plugin) {
  plugin(this);
  return this;
};


/**
 * Set an option
 * @param {String} key
 * @param {Any} value
 */

Validator.prototype.set = function(key, val) {
  var opts = {};
  if('object' === typeof key) opts = key;
  if('string' === typeof key && 'undefined' !== typeof val) opts[key] = val;
  this.opts = extend(this.opts, opts);
  return this;
};

/**
 * Set an aditional trigger `event` for individual field validation.
 *
 * @param {String} event
 * @return {Validator}
 */

Validator.prototype.on = function (event) {
  this._event = event;
  return this;
};


/**
 * Add a field `el` to be validated.
 *
 * @param {Element|String} el
 * @return {Validator}
 */

Validator.prototype.field = function (el) {
  if ('string' === typeof el) el = this.form.querySelector('[name="' + el + '"]');
  var field = new Field(el, this.adapter, this.validators, this.opts);
  if (this._event) field.on(this._event);

  this._validator.rule(function (val, done) {
    field.validate(done);
  });

  // let us chain `is` like we were the field
  this.is = function () {
    field.is.apply(field, arguments);
    return this;
  };

  this._fields.push(field);

  return this;
};


/**
 * Validate each field and `callback(err, valid, msg)` once first field fails.
 *
 * @param {Function} callback
 * @return {Validator}
 */

Validator.prototype.validate = function (callback) {
  this._validator.validate(null, function (err, valid, msg) {
    callback && callback(err, valid, msg);
  });
  return this;
};

/**
 * Validate each field and `callback(err, valid, fields)`.
 *
 * @param {Function} callback
 * @return {Validator}
 */

Validator.prototype.validateAll = function (callback) {

  var state = true, errs = [], msgs = [];
  async(this._fields, validate, status);

  function validate(field, next) {
    field.validate(function(err, valid, msg) {
      next(err, {valid: valid, msg: msg, field: field });
    });
  }

  function status(err, fields) {
    callback(err, verify(fields), fields);
  }

  function verify(fields) {
    var state = true;
    each(fields, function(f) {
      if(!f.valid) state = false;
    });
    return state;
  }

  return this;
};


/**
 * Define a view-specific validator `fn`.
 *
 * @param {String|Object} name
 * @param {Function} fn
 */

Validator.prototype.validator = function (name, fn) {
  if ('object' == typeof name) {
    for (var key in name) this.validator(key, name[key]);
    return;
  }

  this.validators[name] = fn;
};


/**
 * Define a view-specific el adapter `fn`.
 *
 * @param {Function} fn
 * @return {Validator}
 */

Validator.prototype.el = function (fn) {
  this.adapter.el = fn;
  return this;
};


/**
 * Define a view-specific value adapter `fn`.
 *
 * @param {Function} fn
 * @return {Validator}
 */

Validator.prototype.value = function (fn) {
  this.adapter.value = fn;
  return this;
};


/**
 * Define a view-specific valid adapter `fn`.
 *
 * @param {Function} fn
 * @return {Validator}
 */

Validator.prototype.valid = function (fn) {
  this.adapter.valid = fn;
  return this;
};


/**
 * Define a view-specific invalid adapter `fn`.
 *
 * @param {Function} fn
 * @return {Validator}
 */

Validator.prototype.invalid = function (fn) {
  this.adapter.invalid = fn;
  return this;
};


/**
 * Define a view-specific clear adapter `fn`.
 *
 * @param {Function} fn
 * @return {Validator}
 */

Validator.prototype.clear = function (fn) {
  this.adapter.clear = fn;
  return this;
};


/**
 * Bind the form's submit handler.
 *
 * @return {Validator}
 * @api private
 */

Validator.prototype.bind = function () {
  // capture to preempt other handlers
  event.bind(this.form, 'submit', this.submit, true);
  return this;
};


/**
 * Unind the form's submit handler.
 *
 * @return {Validator}
 * @api private
 */

Validator.prototype.unbind = function () {
  // capture to preempt other handlers
  event.unbind(this.form, 'submit', this.submit, true);
  return this;
};


/**
 * Form submit handler.
 *
 * @param {Event} e
 * @api private
 */

Validator.prototype.submit = function (e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  var self = this;
  this.validate(function (err, valid) {
    if (!err && valid) {
      self.unbind();
      submit(self.form);
    }
  });
};
