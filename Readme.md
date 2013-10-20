
# validate-form

  Easily validate a form element against a set of rules. The rules can be sync or async, and the form submission will wait.

## Installation

    $ component install segmentio/validate-form

## Example
  
```js
var validate = require('validate-form');
var form = document.getElementById('#form');

validate(form)
  .field('email')
    .is('required')
    .is('email')
  .field('password')
    .is('required')
    .is('minimum', 8, 'Minimum 8 characters.')
    .is(/\w+/i, 'Please only use certain characters...')
    .is(function (value) {
      return value != 'password');
    });
```

## API

### validate(el)
  
  Create a new validator for a given form `el`.

### #field(name)
  
  Add a field to the validator by its `name` attribute. You can also just pass the input `el` directly.

### #is(fn, [message])
  
  Add a validation `fn` with an optional error `message`.

### #is(string, [message])

  Add a validation function by its shorthand `string` with an optional error `message`.

### #is(regexp, [message])
  
  Add a validation `regexp` with an optional error `message`.

### #is(string, settings..., [message])

  Add a validation function that takes optional `settings...` and returns a regular validation function. This would be for things like minimum length, which require a `length` number.

### #on(event)

  Trigger the validation on an `event` in addition to `submit`. For example `'blur'`.

### #validate(callback)
  
  Validate the form manually and `callback(valid)`.

### #value(fn)
  
  Set the value adapter `fn`, for retrieving the value of the element being validated. By default it will use `component/value`.

### #invalid(fn)
  
  Set the invalid adapter `fn`, for marking the element as invalid. By default this will add an `invalid` class to the element and append a message `label` element.

### #valid(fn)
  
  Set the valid adapter `fn`, for marking the element as valid. By default, this will remove an `invalid` class and any message elements.

## Shorthands

  * `RegExp` - validates against a `RegExp`.
  * `'required'` - requires a non-empty value.
  * `'email'` - requires an email address.
  * `'url'` - requires a URL.
  * `'color'` - requires a hex, RGB or HSL color string.
  * `'hex'` - requires a hex color string.
  * `'rgb'` - requires an RGB color string.
  * `'hsl'` - requires an HSL color string.
  * `'minimum', length`  - requires a minimum `length` of characters. (also `min`)
  * `'maximum', length` - requires a maximum `length` of characters. (also `max`)

## License

  MIT
