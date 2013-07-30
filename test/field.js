describe('field', function () {

var assert = require('assert')
  , validate = require('validate')
  , field = validate.field;

it('should be a constructor', function () {
  assert('function' === typeof field);
});

describe('#valid', function () {
  it('should get the validity', function () {
    var input = document.createElement('input');
    var validator = field(input);
    assert(true === validator.valid());
  });

  it('should set the validity', function () {
    var input = document.createElement('input');
    var validator = field(input);
    validator.valid(false);
    assert(false === validator.valid());
  });
});

describe('#validate', function () {
  it('should call the invalid adapter', function (done) {
    var input = document.createElement('input');
    validate.invalid(function () { done(); });
    field(input).is(function (val, finish) {
      finish(null, false);
    }).validate();
  });

  it('should call the valid adapter', function (done) {
    var input = document.createElement('input');
    validate.valid(function () { done(); });
    field(input).is(function (val, finish) {
      finish(null, true);
    }).validate();
  });

  it('should break on first invalid', function () {
    var input = document.createElement('input');
    var i = 0;
    var f = function (val, done) { done(false); };
    validate.invalid(function () { i++; });
    field(input)
      .is(f)
      .is(f)
      .validate();
    assert(1 === i);
  });
});

describe('#is', function () {
  it('should take a function', function () {
    var noop = function(){};
    var input = document.createElement('input');
    var validator = field(input).is(noop);
    assert(noop === validator.rules[0].fn);
  });

  it('should call the function with a value and a done fn', function (done) {
    var input = document.createElement('input');
    input.value = 'val';
    field(input).is(function (value, finish) {
      assert('val' === value);
      assert('function' === typeof finish);
      done();
    }).validate();
  });

  it('should take a message', function () {
    var input = document.createElement('input');
    var validator = field(input).is(function(){}, 'msg');
    assert('msg' === validator.rules[0].msg);
  });

  it('should take shorthands', function () {
    var noop = function(){};
    var input = document.createElement('input');
    validate.validator('test', function (input) {
      assert(1 === input);
      return noop;
    });
    var validator = field(input).is('test', 1, 'msg');
    assert(noop === validator.rules[0].fn);
    assert('msg' === validator.rules[0].msg);
  });
});

describe('#on', function () {
  it('should validate on blur', function (done) {
    var input = document.createElement('input');
    field(input).on('blur').is(function (val, finish) {
      done();
    });
    document.body.appendChild(input);
    input.focus();
    input.blur();
    document.body.removeChild(input);
  });
});

});