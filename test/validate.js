describe('validate', function () {

var assert = require('assert')
  , domify = require('domify')
  , validate = require('validate')
  , Field = validate.Field;

beforeEach(function () {
  this.form = domify('<form action="#submit"><input name="email"></form>');
  this.input = this.form.querySelector('input');
  this.validator = validate(this.form);
});

it('should be a constructor', function () {
  assert('function' === typeof validate);
});

describe('#field', function () {
  it('should return a field instance', function () {
    var field = this.validator.field(this.input);
    assert(field instanceof Field);
  });

  it('should store the field by name', function () {
    var field = this.validator.field(this.input);
    assert(field === this.validator.fields.email);
  });

  it('should accept a field name', function () {
    var field = this.validator.field('email');
    assert(this.input === field.el);
  });
});

describe('#validate', function () {
  it('should finish false when invalid', function (done) {
    this.validator.field('email').is('required');
    this.validator.validate(function (err, valid) {
      assert(false === valid);
      done();
    });
  });

  it('should finish true when valid', function (done) {
    this.input.value = 'achilles@olymp.us';
    this.validator.field('email').is('required');
    this.validator.validate(function (err, valid) {
      assert(true === valid);
      done();
    });
  });
});

});