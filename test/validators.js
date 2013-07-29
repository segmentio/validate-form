describe('validators', function () {

var assert = require('assert')
  , validate = require('validate');

describe('required', function () {
  it('should be invalid with an empty value', function (done) {
    var input = document.createElement('input');
    validate.invalid(function () { done(); });
    validate(input).is('required').validate();
  });

  it('should be valid with a non-empty value', function (done) {
    var input = document.createElement('input');
    input.value = 'a';
    validate.valid(function () { done(); });
    validate(input).is('required').validate();
  });
});

describe('regexp', function () {
  it('should be invalidated against a regexp', function (done) {
    var input = document.createElement('input');
    validate.invalid(function () { done(); });
    validate(input).is(/a/).validate();
  });

  it('should be validated against a regexp', function (done) {
    var input = document.createElement('input');
    input.value = 'A';
    validate.valid(function () { done(); });
    validate(input).is(/a/i).validate();
  });

  it('should accept strings', function (done) {
    var input = document.createElement('input');
    input.value = 'a';
    validate.valid(function () { done(); });
    validate(input).is('regexp', 'a').validate();
  });
});

describe('email', function () {
  it('should be invalid without an email address', function (done) {
    var input = document.createElement('input');
    validate.invalid(function () { done(); });
    validate(input).is('email').validate();
  });

  it('should be valid with an email address', function (done) {
    var input = document.createElement('input');
    input.value = 'achilles@example.com';
    validate.valid(function () { done(); });
    validate(input).is('email').validate();
  });
});

describe('minimum', function () {
  it('should be invalid without enough chars', function (done) {
    var input = document.createElement('input');
    input.value = 'four';
    validate.invalid(function () { done(); });
    validate(input).is('minimum', 5).validate();
  });

  it('should be valid with enough chars', function (done) {
    var input = document.createElement('input');
    input.value = 'four';
    validate.valid(function () { done(); });
    validate(input).is('minimum', 3).validate();
  });
});

describe('maximum', function () {
  it('should be invalid without enough chars', function (done) {
    var input = document.createElement('input');
    input.value = 'four';
    validate.invalid(function () { done(); });
    validate(input).is('maximum', 3).validate();
  });

  it('should be valid with enough chars', function (done) {
    var input = document.createElement('input');
    input.value = 'four';
    validate.valid(function () { done(); });
    validate(input).is('maximum', 5).validate();
  });
});

describe('min', function () {
  it('should be an alias for minimum', function () {
    assert(validate.validators.min === validate.validators.minimum);
  });
});

describe('max', function () {
  it('should be an alias for maximum', function () {
    assert(validate.validators.max === validate.validators.maximum);
  });
});

});