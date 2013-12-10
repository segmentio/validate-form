
describe('validators', function () {

  var assert = require('assert');
  var validate = require('validate-form');

  beforeEach(function () {
    var form = this.form = document.createElement('form');
    form.action = '#submit';
    var input = this.input = document.createElement('input');
    input.name = 'input';
    form.appendChild(input);
    this.validator = validate(form);
  });

  describe('required', function () {
    it('should be invalid with an empty value', function (done) {
      this.input.value = '';
      this.validator
        .field('input')
        .is('required')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should trim values', function (done) {
      this.input.value = '  ';
      this.validator
        .field('input')
        .is('required')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with a non-empty value', function (done) {
      this.input.value = 'a';
      this.validator
        .field('input')
        .is('required')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('regexp', function () {
    it('should be invalidated against a regexp', function (done) {
      this.input.value = 'w';
      this.validator
        .field('input')
        .is(/a/i)
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be validated against a regexp', function (done) {
      this.input.value = 'A';
      this.validator
        .field('input')
        .is(/a/i)
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });

    it('should accept a string setting', function (done) {
      this.input.value = 'a';
      this.validator
        .field('input')
        .is('regexp', 'a')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('email', function () {
    it('should be invalid without an email', function (done) {
      this.input.value = 'a';
      this.validator
        .field('input')
        .is('email')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with an email', function (done) {
      this.input.value = 'achilles@olymp.us';
      this.validator
        .field('input')
        .is('email')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('url', function () {
    it('should be invalid without a URL', function (done) {
      this.input.value = 'a';
      this.validator
        .field('input')
        .is('url')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with a URL', function (done) {
      this.input.value = 'http://google.com';
      this.validator
        .field('input')
        .is('url')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('hex', function () {
    it('should be invalid without a hex color', function (done) {
      this.input.value = '#92zz39';
      this.validator
        .field('input')
        .is('hex')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with a 3 digit hex color', function (done) {
      this.input.value = '#9F0';
      this.validator
        .field('input')
        .is('hex')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });

    it('should be valid with a 6 digit hex color', function (done) {
      this.input.value = '#39FA93';
      this.validator
        .field('input')
        .is('hex')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('rgb', function () {
    it('should be invalid without an RGB color', function (done) {
      this.input.value = 'rgb(255,255)';
      this.validator
        .field('input')
        .is('rgb')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with an RGB color', function (done) {
      this.input.value = 'rgb(255,255,255)';
      this.validator
        .field('input')
        .is('rgb')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });

    it('should have an rgba alias', function () {
      assert(this.validator.validators.rgba == this.validator.validators.rgb);
    });
  });

  describe('hsl', function () {
    it('should be invalid without an RGB color', function (done) {
      this.input.value = 'hsl(255,3%)';
      this.validator
        .field('input')
        .is('hsl')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with an RGB color', function (done) {
      this.input.value = 'hsl(255,100%,100%)';
      this.validator
        .field('input')
        .is('hsl')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });

    it('should have an rgba alias', function () {
      assert(this.validator.validators.hsla == this.validator.validators.hsl);
    });
  });

  describe('color', function () {
    it('should be invalid without a color', function (done) {
      this.input.value = 'z39';
      this.validator
        .field('input')
        .is('color')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with a hex color', function (done) {
      this.input.value = '#9F0';
      this.validator
        .field('input')
        .is('color')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });

    it('should be valid with an RGB color', function (done) {
      this.input.value = 'rgb(34,30,123)';
      this.validator
        .field('input')
        .is('color')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });

    it('should be valid with an HSL color', function (done) {
      this.input.value = 'hsl(34,40%,39%)';
      this.validator
        .field('input')
        .is('color')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('number', function () {
    it('should be invalid without a number', function (done) {
      var field = { value: function () { return '1'; }};
      this.validator
        .field(field)
        .is('number')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with a number', function (done) {
      var field = { value: function () { return 1; }};
      this.validator
        .field(field)
        .is('number')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('minimum', function () {
    it('should be invalid without enough chars', function (done) {
      this.input.value = 'four';
      this.validator
        .field('input')
        .is('minimum', 5, '')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with enough chars', function (done) {
      this.input.value = 'four';
      this.validator
        .field('input')
        .is('minimum', 3, '')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('maximum', function () {
    it('should be invalid without enough chars', function (done) {
      this.input.value = 'four';
      this.validator
        .field('input')
        .is('maximum', 3, '')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(false === valid);
          done();
        });
    });

    it('should be valid with enough chars', function (done) {
      this.input.value = 'four';
      this.validator
        .field('input')
        .is('maximum', 5, '')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(true === valid);
          done();
        });
    });
  });

  describe('min', function () {
    it('should be an alias for minimum', function () {
      assert(this.validator.validators.min === this.validator.validators.minimum);
    });
  });

  describe('max', function () {
    it('should be an alias for maximum', function () {
      assert(this.validator.validators.max === this.validator.validators.maximum);
    });
  });

});
