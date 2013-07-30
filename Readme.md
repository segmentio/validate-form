# validate

  Validate a DOM element, like a text input, against a set of rules. _Still a little in flux, feedback welcome..._

## Installation

    $ component install segmentio/validate

## Example
  
```js
var validate = require('validate')
  , form = document.getElementById('#form');

validate(form)
  .field('email')
    .is('required')
    .is('email')
  .field('password')
    .is('required')
    .is('minimum', 8, 'Minimum 8 characters.')
    .is(/\w+/i, 'Please only use certain characters...')
    .is(function (value, done) {
      done(null, value !== 'password');
    }, 'Come on...')
  .field('password-again')
    .is('required')
    .is('equal', 'password');
```

## API

### validate(el)
  
  Create a new validator for a given form `el`.

### #field(el)
  
  Add a field to the validator.

### #is(rule, [value], [message])
  
  Add a validation `rule` to the current field (either a function or a shorthand string) with an optional `message` to be displayed when invalid. The `rule` fn should take a `value, done` signature and should call `done(err, valid)`.

  Some validation functions are initialized with a `value` (like minimum length).

### #validate()
  
  Validate the form manually.

### .value(fn)
  
  Set the `value` adapter, for retrieving the value of the element being validated. By default it will use `component/value`.

### .invalid(fn)
  
  Set the `invalid` adapter, for marking the element as invalid. By default this will add an `invalid` class to the element and append a message `label` element.

### .valid(fn)
  
  Set the `valid` adapter, for marking the element as valid. By default, this will remove an `invalid` class and any message elements.

## Shorthands

* `RegExp` - validates against a `RegExp`.
* `'required'` - requires a non-empty value.
* `'email'` - requires an email address.
* `'url'` - requires a URL.
* `'minimum', length`  - requires a minimum `length` of characters. (also `min`)
* `'maximum', length` - requires a maximum `length` of characters. (also `max`)

## License

  MIT
