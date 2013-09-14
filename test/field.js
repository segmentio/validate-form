describe('field', function () {

var assert = require('assert')
  , validate = require('validate')
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
  it('should call the invalid adapter', function (done) {
    validate.invalid(function () { done(); });
    this.field.is(function (val, finish) {
      finish(null, false);
    }).validate();
  });

  it('should call the valid adapter', function (done) {
    validate.valid(function () { done(); });
    this.field.is(function (val, finish) {
      finish(null, true);
    }).validate();
  });

  it('should break on first invalid', function () {
    var i = 0;
    var f = function (val, done) { done(false); };
    validate.invalid(function () { i++; });
    this.field.is(f).is(f).validate();
    assert(1 === i);
  });
});

describe('#is', function () {
  it('should take a function', function () {
    this.field.is(this.noop);
    assert(this.noop === this.field.rules[0].fn);
  });

  it('should call the function with a value and a done fn', function (done) {
    this.input.value = 'val';
    this.field.is(function (value, finish) {
      assert('val' === value);
      assert('function' === typeof finish);
      done();
    }).validate();
  });

  it('should take a message', function () {
    this.field.is(this.noop, 'msg');
    assert('msg' === this.field.rules[0].msg);
  });

  it('should take shorthands', function () {
    var noop = this.noop;
    validate.validator('test', function (requirement) {
      assert(1 === requirement);
      return noop;
    });
    this.field.is('test', 1, 'msg');
    assert(noop === this.field.rules[0].fn);
    assert('msg' === this.field.rules[0].msg);
  });

  it('should set a required flag', function () {
    this.field.is('required');
    assert(this.field._required);
  });
});

});