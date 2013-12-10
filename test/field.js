
describe('field', function () {

  var assert = require('assert');
  var tick = require('next-tick');
  var validate = require('validate-form');

  var form, input, validator;

  beforeEach(function () {
    input = document.createElement('input');
    form = document.createElement('form');
    form.action = '#submit';
    form.appendChild(input);
    document.body.appendChild(form);
    validator = validate(form).field(input);
  });

  afterEach(function () {
    document.body.removeChild(form);
  });

  describe('#validate', function () {
    it('should skip empty, non-required fields', function (done) {
      validator
        .is(function () { return false; }, 'message')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(valid);
          done();
        });
    });

    it('should call the invalid adapter with the el and a message', function (done) {
      input.value = 'val';
      validator.invalid(function (el, message) {
        assert(input == el);
        assert('message' == message);
        done();
      });
      validator
        .is(function (value) { return false; }, 'message')
        .validate();
    });

    it('should call the valid adapter with the el', function (done) {
      input.value = 'val';
      validator.valid(function (el) {
        assert(input == el);
        done();
      });
      validator
        .is(function (value) { return true; }, 'message')
        .validate();
    });

    it('should break on first invalid', function () {
      input.value = 'val';
      var i = 0;
      var f = function (val) { return false; };
      validator.invalid(function () { i++; });
      validator
        .is(f, 'message')
        .is(f, 'message')
        .validate(function (valid) {
          assert(1 === i);
        });
    });
  });

  describe('#is', function () {
    it('should call sync validators with a value', function (done) {
      input.value = 'val';
      validator.is(function (value) {
        assert('val' === value);
        done();
      }, 'message').validate();
    });

    it('should call async validators with a value and a done fn', function (done) {
      input.value = 'val';
      validator.is(function (value, finish) {
        assert('val' === value);
        assert('function' === typeof finish);
        done();
      }, 'message').validate();
    });

    it('should take shorthands', function (done) {
      input.value = 'val';
      validator.validator('shorthand', function (val) {
        done();
      });
      validator
        .is('shorthand', 'message')
        .validate();
    });

    it('should allow shorthands that take settings', function (done) {
      input.value = 'val';
      validator.validator('shorthand', function (setting) {
        return function (val) {
          return val == setting;
        };
      });
      validator
        .is('shorthand', 'val', 'message')
        .validate(function (err, valid) {
          if (err) return done(err);
          assert(valid);
          done();
        });
    });
  });

  describe('#on', function () {
    it('should validate on an event', function (done) {
      input.value = 'value';
      validator = validate(form)
        .on('blur')
        .field(input)
          .is('email', 'message');
      input.focus();
      input.blur();
      tick(function () {
        assert('invalid' === input.className);
        done();
      });
    });

    it('should not mark as invalid on blur if empty', function (done) {
      validator = validate(form)
        .on('blur')
        .field(input)
          .is('email', 'message');
      input.focus();
      input.blur();
      tick(function () {
        assert('invalid' !== input.className);
        done();
      });
    });
  });

});