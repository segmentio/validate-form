
describe('adapter', function () {

  var adapter = require('validate-form/lib/adapter');
  var assert = require('assert');

  describe('.el', function () {
    it('should return an element', function () {
      var el = document.createElement('input');
      assert(el == adapter.el(el));
    });

    it('should return a view .el property', function () {
      var view = { el: document.createElement('input') };
      assert(view.el == adapter.el(view));
    });
  });

  describe('.value', function () {
    it('should return the elements value', function () {
      var input = document.createElement('input');
      input.value = 'a';
      assert('a' == adapter.value(input));
    });

    it('should call a views value method', function () {
      var input = { value: function(){ return 'a'; }};
      assert('a' == adapter.value(input));
    });
  });

  describe('.invalid', function () {
    it('should mark the input as invalid', function () {
      var input = document.createElement('input');
      adapter.invalid(input);
      assert('invalid' == input.className);
    });

    it('should display a message', function () {
      var input = document.createElement('input');
      var div = document.createElement('div');
      div.appendChild(input);
      adapter.invalid(input, 'test');
      assert('test' == input.nextSibling.textContent);
      assert('LABEL' == input.nextSibling.nodeName);
      assert('validator-message' == input.nextSibling.className);
    });

    it('should call a views invalid method', function (done) {
      var input = { invalid: function(msg){
        assert('message' == msg);
        done();
      }};
      adapter.invalid(input, 'message');
    });
  });

  describe('.valid', function () {
    it('should mark the input as valid', function () {
      var input = document.createElement('input');
      adapter.valid(input);
      assert('valid' == input.className);
    });

    it('should remove a message', function () {
      var input = document.createElement('input');
      var div = document.createElement('div');
      div.appendChild(input);
      adapter.invalid(input, 'test');
      adapter.valid(input);
      assert(null == input.nextSibling);
    });

    it('should call a views valid method', function (done) {
      var input = { valid: function(msg){ done(); }};
      adapter.valid(input);
    });
  });

  describe('.clear', function () {
    it('should remove valid and invalid classes', function () {
      var input = document.createElement('input');
      input.className = 'valid invalid';
      adapter.clear(input);
      assert('' == input.className);
    });
  });

});