describe('adapter', function () {

var assert = require('assert')
  , validate = require('validate');

describe('.value', function () {
  it('should return the correct value for an element', function () {
    var input = document.createElement('input');
    input.value = 'a';
    assert('a' === validate.adapter.value(input));
  });

  it('should return the correct value for a view', function () {
    var input = { value: function(){ return 'a'; }};
    assert('a' === validate.adapter.value(input));
  });

  it('should be settable', function (done) {
    var old = validate.adapter.value;
    validate.value(function () { done(); });
    validate.adapter.value();
    validate.value(old);
  });
});

describe('.name', function () {
  it('should return the correct name for an element', function () {
    var input = document.createElement('input');
    input.name = 'a';
    assert('a' === validate.adapter.name(input));
  });

  it('should return the correct name for a view', function () {
    var input = { name: function(){ return 'a'; }};
    assert('a' === validate.adapter.name(input));
  });
});

describe('.invalid', function () {
  it('should mark the input as invalid', function () {
    var input = document.createElement('input');
    validate.adapter.invalid(input);
    assert('invalid' === input.className);
  });

  it('should display a message', function () {
    var input = document.createElement('input');
    var div = document.createElement('div');
    div.appendChild(input);
    validate.adapter.invalid(input, 'test');
    assert('test' === input.nextSibling.textContent);
    assert('LABEL' === input.nextSibling.nodeName);
    assert('validator-message' === input.nextSibling.className);
  });

  it('should be settable', function (done) {
    var old = validate.adapter.invalid;
    validate.invalid(function () { done(); });
    validate.adapter.invalid();
    validate.invalid(old);
  });
});

describe('.valid', function () {
  it('should mark the input as valid', function () {
    var input = document.createElement('input');
    validate.adapter.invalid(input);
    validate.adapter.valid(input);
    assert('' === input.className);
  });

  it('should remove a message', function () {
    var input = document.createElement('input');
    var div = document.createElement('div');
    div.appendChild(input);
    validate.adapter.invalid(input, 'test');
    validate.adapter.valid(input);
    assert(null === input.nextSibling);
  });

  it('should be settable', function (done) {
    var old = validate.adapter.valid;
    validate.valid(function () { done(); });
    validate.adapter.valid();
    validate.valid(old);
  });
});

});