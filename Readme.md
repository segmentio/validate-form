# validate

  Validate a DOM element, like a text input, against a set of rules.

## Installation

    $ component install segmentio/validate

## Example
  
```js
var validate = require('validate');

var input = document.createElement('input');
var validator = validate(input)
  .on('blur')
  .is('required')
  .is('maximum', 8, 'Maximum 8 characters.')
  .is(/\w+/i, 'Please only use certain characters...')
  .is(function (value, done) {
    done(value === 'something');
  });

validator.validate(); // can also validate manually
```

## API

### validate(el)
  
  Create a new validator for a given `el`.

### .use(plugin)
  
  Use the given `plugin`.

### .value(fn)
  
  Set the `value` adapter, for retrieving the value of the element being validated. By default it will use `component/value`.

### .invalid(fn)
  
  Set the `invalid` adapter, for marking the element as invalid. By default this will add an `invalid` class to the element and append a message `label` element.

### .valid(fn)
  
  Set the `valid` adapter, for marking the element as valid. By default, this will remove an `invalid` class and any message elements.

### #value([boolean, [message]])

  Get or set the validity of the element, with an optional `message`.

### #validate()
  
  Validate the element manually.

### #is(rule, [value], [message])
  
  Add a validation `rule` (either a function or a shorthand string) with an optional `message` to be displayed when invalid.

  Some validation functions are initialized with a `value` (like minimum length).

### #on(event)
  
  Automatically validate the element on `event` (blur, keydown, etc.)

## Shorthands

* `RegExp` - validates against a `RegExp`.
* `'required'` - requires a non-empty value.
* `'email'` - requires an email address.
* `'url'` - requires a URL.
* `'minimum', length`  - requires a minimum `length` of characters. (also `min`)
* `'maximum', length` - requires a maximum `length` of characters. (also `max`)

## License

  MIT
