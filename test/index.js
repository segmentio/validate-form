
describe('validate-form', function () {

  var assert = require('assert');
  var submit = require('submit-form');
  var validate = require('validate-form');

  beforeEach(function () {
    var form = this.form = document.createElement('form');
    form.action = '#submit';
    var input = this.input = document.createElement('input');
    input.name = 'input';
    form.appendChild(input);
    this.validator = validate(form);
  });

  it('should be a constructor', function () {
    assert('function' == typeof validate);
  });

  describe('#use', function () {
    it('should call the plugin with the validator instance', function (done) {
      var validator = this.validator;
      validator.use(function (self) {
        assert(self == validator);
        done();
      });
    });
  });

  describe('#validator', function () {
    it('should define a new view-specific validator', function () {
      var noop = function(){};
      this.validator.validator('noop', noop);
      assert(this.validator.validators.noop == noop);
    });
  });

  describe('#el', function () {
    it('should set the view-specific adapter', function (done) {
      this.validator.el(done);
      this.validator.adapter.el();
    });
  });

  describe('#value', function () {
    it('should set the view-specific adapter', function (done) {
      this.validator.value(done);
      this.validator.adapter.value();
    });
  });

  describe('#invalid', function () {
    it('should set the view-specific adapter', function (done) {
      this.validator.invalid(done);
      this.validator.adapter.invalid();
    });
  });

  describe('#valid', function () {
    it('should set the view-specific adapter', function (done) {
      this.validator.valid(done);
      this.validator.adapter.valid();
    });
  });

  describe('#clear', function () {
    it('should set the view-specific adapter', function (done) {
      this.validator.clear(done);
      this.validator.adapter.clear();
    });
  });

  describe('#field', function () {
    it('should be chainable', function () {
      var validator = this.validator.field(this.input);
      assert(validator == this.validator);
    });

    it('should add an `is` method to the validator', function () {
      assert(!this.validator.is);
      this.validator.field(this.input);
      assert(this.validator.is);
    });

    it('should add a validator rule', function () {
      assert(0 === this.validator._validator.rules.length);
      this.validator.field(this.input);
      assert(1 == this.validator._validator.rules.length);
    });
  });

  describe('#validate', function () {
    it('should be false when invalid', function (done) {
      this.validator.field('input').is('required');
      this.validator.validate(function (err, valid) {
        if (err) return done(err);
        assert(false === valid);
        done();
      });
    });

    it('should be true when valid', function (done) {
      this.input.value = 'text';
      this.validator.field('input').is('required');
      this.validator.validate(function (err, valid) {
        if (err) return done(err);
        assert(true === valid);
        done();
      });
    });

    it('should wait for remote validators to submit the form', function (done) {
      this.input.value = 'text';
      this.form.onsubmit = function (e) {
        e.preventDefault();
        done();
      };
      this.validator
        .field('input')
        .is(function (val, done) {
          setTimeout(function () {
            done(true);
          }, 42);
        });
      submit(this.form);
    });
  });

});