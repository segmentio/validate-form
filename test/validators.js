
describe('validators', function () {

var assert = require('assert')
  , domify = require('domify')
  , validate = require('validate-form');

var form = domify('<form action="#submit"><input name="a"></form>')
  , input = form.querySelector('input');

describe('required', function () {
  it('should be invalid with an empty value', function (done) {
    input.value = '';
    var validator = validate(form);
    validator.field('a').is('required', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should trim values', function (done) {
    input.value = '  ';
    var validator = validate(form);
    validator.field('a').is('required', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with a non-empty value', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('required', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('regexp', function () {
  it('should be invalidated against a regexp', function (done) {
    input.value = 'w';
    var validator = validate(form);
    validator.field('a').is(/a/i, 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be validated against a regexp', function (done) {
    input.value = 'A';
    var validator = validate(form);
    validator.field('a').is(/a/i, 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });

  it('should accept a string setting', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('regexp', 'a', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('email', function () {
  it('should be invalid without an email addvalids', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('email', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with an email addvalids', function (done) {
    input.value = 'achilles@olymp.us';
    var validator = validate(form);
    validator.field('a').is('email', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('url', function () {
  it('should be invalid without a URL', function (done) {
    input.value = 'a';
    var validator = validate(form);
    validator.field('a').is('url', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with a URL', function (done) {
    input.value = 'http://google.com';
    var validator = validate(form);
    validator.field('a').is('url', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('hex', function () {
  it('should be invalid without a hex color', function (done) {
    input.value = '#92zz39';
    var validator = validate(form);
    validator.field('a').is('hex', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with a 3 digit hex color', function (done) {
    input.value = '#9F0';
    var validator = validate(form);
    validator.field('a').is('hex', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });

  it('should be valid with a 6 digit hex color', function (done) {
    input.value = '#39FA93';
    var validator = validate(form);
    validator.field('a').is('hex', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('rgb', function () {
  it('should be invalid without an RGB color', function (done) {
    input.value = 'rgb(255,255)';
    var validator = validate(form);
    validator.field('a').is('rgb', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with an RGB color', function (done) {
    input.value = 'rgb(255,255,255)';
    var validator = validate(form);
    validator.field('a').is('rgb', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });

  it('should have an rgba alias', function () {
    assert(validate.validators.rgba == validate.validators.rgb);
  });
});

describe('hsl', function () {
  it('should be invalid without an RGB color', function (done) {
    input.value = 'hsl(255,3%)';
    var validator = validate(form);
    validator.field('a').is('hsl', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with an RGB color', function (done) {
    input.value = 'hsl(255,100%,100%)';
    var validator = validate(form);
    validator.field('a').is('hsl', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });

  it('should have an rgba alias', function () {
    assert(validate.validators.hsla == validate.validators.hsl);
  });
});

describe('color', function () {
  it('should be invalid without a color', function (done) {
    input.value = 'z39';
    var validator = validate(form);
    validator.field('a').is('color', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with a hex color', function (done) {
    input.value = '#9F0';
    var validator = validate(form);
    validator.field('a').is('color', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });

  it('should be valid with an RGB color', function (done) {
    input.value = 'rgb(34,30,123)';
    var validator = validate(form);
    validator.field('a').is('color', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });

  it('should be valid with an HSL color', function (done) {
    input.value = 'hsl(34,40%,39%)';
    var validator = validate(form);
    validator.field('a').is('color', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('number', function () {
  it('should be invalid without a number', function (done) {
    var field = { value: function () { return '1'; }};
    var validator = validate(form);
    validator.field(field).is('number', 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with a number', function (done) {
    var field = { value: function () { return 1; }};
    var validator = validate(form);
    validator.field(field).is('number', 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('minimum', function () {
  it('should be invalid without enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('minimum', 5, 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('minimum', 3, 'message');
    validator.validate(function (valid) {
      assert(true === valid);
      done();
    });
  });
});

describe('maximum', function () {
  it('should be invalid without enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('maximum', 3, 'message');
    validator.validate(function (valid) {
      assert(false === valid);
      done();
    });
  });

  it('should be valid with enough chars', function (done) {
    input.value = 'four';
    var validator = validate(form);
    validator.field('a').is('maximum', 5, 'message');
    validator.validate(function (valid) {
      assert(true === valid);
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
