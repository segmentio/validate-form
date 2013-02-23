var type       = require('type')
  , val        = require('val')
  , each       = require('each')
  , Batch      = require('batch')
  , Tip        = require('tip')
  , Validators = require('./validators');



module.exports = validate;


/**
 * Validate a form `element` against `validators`.
 *
 * @param {element} element
 * @param {string|regexp|object} validators
 * @param {string|object} messages
 * @param {object} options
 */

function validate (element, validators, messages, options) {
  if (!validators) throw new Error('Invalid validator, haha.');

  // Allow for passing jQuery objects.
  if (type(element) === 'array') {
    for (var i = 0, el; el = element[i]; i++) validate(el, validators, messages, options);
    return;
  }

  // Allow for `validators` to be a string, in which case it's just defaulting
  // the validator key to `true`, or a regex, in which case it's using the
  // regex validator.
  if (type(validators) === 'string') {
    var key = validators;
    validators = {};
    validators[key] = true;

    // Convert a single message too.
    if (type(messages) === 'string') {
      var message = messages;
      messages = {};
      messages[key] = message;
    }
  } else if (type(validators) === 'regexp') {
    validators = { regex : validators };
  }

  // If the optional flag is set, we only validate if there's user input.
  // TODO: shouldn't this remove the invalid class if it exists.
  var value = val(element);
  if (options.optional && !value) return;

  // Add each validation.
  var batch = new Batch();
  validators.each(function (name, setting) {
    batch.push(function (done) {
      var validator = Validators[name]
        , message   = messages[name];
      if (validator) validator(done, message, value, setting);
    });
  });

  // Kick off the validations.
  batch.end(function (err, res) {
    // Whether to mark the element invalid or valid (className).
    // What message to show.
    // How to show the message, let's stick to tooltips for now.
    var valid, message;

    for (var i = 0, result; result = res[i]; i++) {
      if (valid !== undefined) break;
      valid = result[0];
      message = result[1];
    }

    if (valid !== undefined) {

    }
  });
}


/**
 * Add a validator.
 *
 * @param {string} name
 * @param {function} validator
 *
 * Validators get passed:
 *   @param {function} done Call with the result, to support async.
 *   @param {string} value The user input.
 *   @param setting Whatever the validator's setting was (ie. `{ min : 8 }`).
 */

exports.add = function (name, validator) {
  if (Validators.hasOwnProperty(name)) throw new Error(name + ' already exists.');
  Validators[name] = validator;
};