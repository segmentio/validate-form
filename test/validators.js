describe('validators', function () {

var assert = require('assert')
  , domify = require('domify')
  , validate = require('validate');

var form = domify('<form action="#submit"><input name="a"></form>')
  , input = form.querySelector('input');

describe('required', function () {
  it('should be invalid with an empty value', function (done) {
    input.value = '';
    var validator = validate(form);
    validator.field('a').is('required');
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with a non-empty value', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('required');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

describe('regexp', function () {
  it('should be invalidated against a regexp', function (done) {
    input.value = '';
    var validator = validate(form);
    validator.field('a').is(/a/i);
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be validated against a regexp', function (done) {
    input.value = 'A';
    var validator = validate(form);
    validator.field('a').is(/a/i);
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });

  it('should accept strings', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('regexp', 'a');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

describe('email', function () {
  it('should be invalid without an email address', function (done) {
    input.value = '';
    var validator = validate(form);
    validator.field('a').is('email');
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with an email address', function (done) {
    input.value = 'achilles@olymp.us';
    var validator = validate(form);
    validator.field('a').is('email');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

describe('minimum', function () {
  it('should be invalid without enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('minimum', 5);
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('minimum', 3);
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

describe('maximum', function () {
  it('should be invalid without enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('maximum', 3);
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('maximum', 5);
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
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