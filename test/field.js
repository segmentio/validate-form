
describe('field', function () {

var assert = require('assert')
  , validate = require('validate-form')
  , field = validate.field;

beforeEach(function () {
  this.noop = function(){};
  this.input = document.createElement('input');
  this.field = field(this.input);
});

it('should be a constructor', function () {
  assert('function' === typeof field);
});

describe('#valid', function () {
  it('should get the validity', function () {
    assert(true === this.field.valid());
  });

  it('should set the validity', function () {
    this.field.valid(false);
    assert(false === this.field.valid());
  });
});

describe('#validate', function () {
  it('should skip empty, non-required fields', function (done) {
    this.field
      .is(function () { return false; })
      .validate(function (valid) {
        assert(valid);
        done();
      });
  });

  it('should call the invalid adapter', function (done) {
    this.input.value = 'val';
    validate.invalid(function () { done(); });
    this.field
      .is(function (value) { return false; })
      .validate();
  });

  it('should call the valid adapter', function (done) {
    this.input.value = 'val';
    validate.valid(function () { done(); });
    this.field
      .is(function (value) { return true; })
      .validate();
  });

  it('should break on first invalid', function () {
    var i = 0;
    var f = function (val) { return false; };
    validate.invalid(function () { i++; });
    this.field
      .is('required')
      .is(f)
      .is(f)
      .validate(function (valid) {
        assert(1 === i);
      });
  });
});

describe('#is', function () {
  it('should call sync validators with a value', function (done) {
    this.input.value = 'val';
    this.field.is(function (value) {
      assert('val' === value);
      done();
    }).validate();
  });

  it('should call async validators with a value and a done fn', function (done) {
    this.input.value = 'val';
    this.field.is(function (value, finish) {
      assert('val' === value);
      assert('function' === typeof finish);
      done();
    }).validate();
  });

  it('should set a required flag', function () {
    this.field.is('required');
    assert(this.field._required);
  });

  it('should take shorthands', function (done) {
    validate.validator('shorthand', function (val) {
      done();
    });
    this.field
      .is('required')
      .is('shorthand')
      .validate();
  });

  it('should allow shorthands that take settings', function (done) {
    this.input.value = 'val';
    validate.validator('shorthand', function (setting) {
      return function (val) {
        return val == setting;
      };
    });
    this.field
      .is('shorthand', 'val', 'message')
      .validate(function (valid) {
        assert(valid);
        done();
      });
  });
});

});