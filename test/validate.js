describe('validate', function () {

var assert = require('assert')
  , validate = require('validate');

it('should be a constructor', function () {
  assert('function' === typeof validate);
});

describe('#valid', function () {
  it('should get the validity', function () {
    var input = document.createElement('input');
    var validator = validate(input);
    assert(true === validator.valid());
  });

  it('should set the validity', function () {
    var input = document.createElement('input');
    var validator = validate(input);
    validator.valid(false);
    assert(false === validator.valid());
  });
});

describe('#validate', function () {
  it('should call the invalid adapter', function (done) {
    var input = document.createElement('input');
    validate.invalid(function () { done(); });
    validate(input).is(function (val, finish) {
      finish(false);
    }).validate();
  });

  it('should call the valid adapter', function (done) {
    var input = document.createElement('input');
    validate.valid(function () { done(); });
    validate(input).is(function (val, finish) {
      finish(true);
    }).validate();
  });
});

describe('#is', function () {
  it('should take a function', function () {
    var noop = function(){};
    var input = document.createElement('input');
    var validator = validate(input).is(noop);
    assert(noop === validator.rules[0].fn);
  });

  it('should call the function with a value and a done fn', function (done) {
    var input = document.createElement('input');
    input.value = 'val';
    validate(input).is(function (value, finish) {
      assert('val' === value);
      assert('function' === typeof finish);
      done();
    }).validate();
  });

  it('should take a message', function () {
    var input = document.createElement('input');
    var validator = validate(input).is(function(){}, 'msg');
    assert('msg' === validator.rules[0].msg);
  });

  it('should take shorthands', function () {
    var noop = function(){};
    var input = document.createElement('input');
    validate.validator('test', function (input) {
      assert(1 === input);
      return noop;
    });
    var validator = validate(input).is('test', 1, 'msg');
    assert(noop === validator.rules[0].fn);
    assert('msg' === validator.rules[0].msg);
  });
});

describe('#on', function () {
  it('should validate on blur', function (done) {
    var input = document.createElement('input');
    validate(input).on('blur').is(function (val, finish) {
      done();
    });
    document.body.appendChild(input);
    input.focus();
    input.blur();
    document.body.removeChild(input);
  });
});

});