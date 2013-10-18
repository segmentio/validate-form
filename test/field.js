
describe('field', function () {

  var assert = require('assert');
  var validate = require('validate-form');

  beforeEach(function () {
    var form = document.createElement('form');
    var input = this.input = document.createElement('input');
    this.validator = validate(form).field(input);
  });

  describe('#validate', function () {
    it('should skip empty, non-required fields', function (done) {
      this.validator
        .is(function () { return false; }, 'message')
        .validate(function (valid) {
          assert(valid);
          done();
        });
    });

    it('should call the invalid adapter with the el and a message', function (done) {
      var input = this.input;
      input.value = 'val';
      this.validator.invalid(function (el, message) {
        assert(input == el);
        assert('message' == message);
        done();
      });
      this.validator
        .is(function (value) { return false; }, 'message')
        .validate();
    });

    it('should call the valid adapter with the el', function (done) {
      var input = this.input;
      input.value = 'val';
      this.validator.valid(function (el) {
        assert(input == el);
        done();
      });
      this.validator
        .is(function (value) { return true; }, 'message')
        .validate();
    });

    it('should break on first invalid', function () {
      this.input.value = 'val';
      var i = 0;
      var f = function (val) { return false; };
      this.validator.invalid(function () { i++; });
      this.validator
        .is(f, 'message')
        .is(f, 'message')
        .validate(function (valid) {
          assert(1 === i);
        });
    });
  });

  describe('#is', function () {
    it('should call sync validators with a value', function (done) {
      this.input.value = 'val';
      this.validator.is(function (value) {
        assert('val' === value);
        done();
      }, 'message').validate();
    });

    it('should call async validators with a value and a done fn', function (done) {
      this.input.value = 'val';
      this.validator.is(function (value, finish) {
        assert('val' === value);
        assert('function' === typeof finish);
        done();
      }, 'message').validate();
    });

    it('should take shorthands', function (done) {
      this.input.value = 'val';
      this.validator.validator('shorthand', function (val) {
        done();
      });
      this.validator
        .is('shorthand', 'message')
        .validate();
    });

    it('should allow shorthands that take settings', function (done) {
      this.input.value = 'val';
      this.validator.validator('shorthand', function (setting) {
        return function (val) {
          return val == setting;
        };
      });
      this.validator
        .is('shorthand', 'val', 'message')
        .validate(function (valid) {
          assert(valid);
          done();
        });
    });
  });

});