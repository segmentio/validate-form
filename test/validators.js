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

  it('should trim values', function(done){
    input.value = '  ';
    var validator = validate(form);
    validator.field('a').is('required');
    validator.validate(function(err, res){
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
    input.value = 'w';
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
    input.value = 'a';
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

describe('url', function () {
  it('should be invalid without a URL', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('url');
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with a URL', function (done) {
    input.value = 'http://google.com';
    var validator = validate(form);
    validator.field('a').is('url');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

describe('color', function () {
  it('should be invalid without a hex color', function (done) {
    input.value = '#92zz39';
    var validator = validate(form);
    validator.field('a').is('color');
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with a 3 digit hex color', function (done) {
    input.value = '#9F0';
    var validator = validate(form);
    validator.field('a').is('color');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });

  it('should be valid with a 6 digit hex color', function (done) {
    input.value = '#39FA93';
    var validator = validate(form);
    validator.field('a').is('color');
    validator.validate(function (err, res) {
      assert(true === res);
      done();
    });
  });
});

describe('number', function () {
  it('should be invalid without a number', function (done) {
    var field = { value: function () { return '1'; }};
    var validator = validate(form);
    validator.field(field).is('number');
    validator.validate(function (err, res) {
      assert(false === res);
      done();
    });
  });

  it('should be valid with a number', function (done) {
    var field = { value: function () { return 1; }};
    var validator = validate(form);
    validator.field(field).is('number');
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
