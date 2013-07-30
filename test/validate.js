describe('validate', function () {

var assert = require('assert')
  , domify = require('domify')
  , validate = require('validate')
  , Field = validate.Field;

var form = domify('<form action="#submit"><input name="email"></form>')
  , input = form.querySelector('input');

it('should be a constructor', function () {
  assert('function' === typeof validate);
});

describe('#field', function () {
  it('should return a field instance', function () {
    var field = validate(form).field(input);
    assert(field instanceof Field);
  });

  it('should store the field by name', function () {
    var validator = validate(form);
    var field = validator.field(input);
    assert(field === validator.fields.email);
  });

  it('should accept a field name', function () {
    var field = validate(form).field('email');
    assert(input === field.el);
  });
});

describe('#validate', function () {
  it('should finish false when invalid', function (done) {
    var validator = validate(form);
    validator.field('email').is('email');
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should finish true when valid', function (done) {
    input.value = 'achilles@olymp.us';
    var validator = validate(form);
    validator.field('email').is('email');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

});