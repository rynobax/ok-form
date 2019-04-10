# ok-form (WIP)

minimal js object schema validation

[![Build Status](https://travis-ci.com/rynobax/ok-form.svg?branch=master)](https://travis-ci.com/rynobax/ok-form)
[![Stable Release](https://img.shields.io/npm/v/ok-form.svg)](https://npm.im/ok-form)
[![gzip size](TODO)](TODO)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

## Introduction

ok-form is a simple, predictable object schema validator that is optimized for front-end validation of forms.

[joi](https://github.com/hapijs/joi) and [yup](https://github.com/jquense/yup) are both great libraries for validation. However, they have expansive APIs, and can make simple validation cases harder than it needs to be [(more on that here)](#TODO).

## Installation

```
// with npm
npm install ok-form

// with yarn
yarn add ok-form
```

## Example

```javascript
import ok from 'ok-form';

const schema = ok.object({
  email: ok.string().email('Invalid email'),
  age: ok.number(),
  password: ok.string().min(8, 'Password must be at least 8 characters!'),
  confirmPassword: ok.string().test((v, { parent }) => {
    if (v !== parent.password) return 'Passwords must match!';
  }),
});

schema.validate({
  email: 'john@gmail.com',
  age: 24,
  password: 'supersecret',
  confirmPassword: 'supersecret',
});
// -> { valid: true, error: null }

schema.validate({
  email: 'not an email',
  age: 'not a number',
  password: 'short',
  confirmPassword: 'notsecret',
});
/*
->
{
  valid: false,
  error: {
    email: 'Invalid email',
    age: 'Must be a number',
    password: 'Password must be at least 8 characters!',
    confirmPassword: 'Passwords must match!',
  },
}
*/
```

## API

TODO: Links and stuff

### Result

The response from `validate` and `validateAsync` takes the shape:

`{ valid: boolean, error: any, validationError: ValidationError }`

TODO: These are important, clean up text

- `valid`: whether or not the value is valid
- `error`: A mirror of the schema, where the key will be set to a string of the error message, if it was not valid.

// TODO: maybe call these schema.?

### `any.validate(value: any): Result`

Validates a value using the schema

```
const schema = ok.object({ foo: ok.number('Must be a number!') });
schema.validate({ foo: 5 }); // -> { valid: true, error: null }
schema.validate({ foo: 'a' }); // -> { valid: false, error: { foo: 'Must be a number!' }
```

### `any.validateAsync(value: any): Promise<Result>`

Validates an asynchronous schema

```
const schema = ok
    .string()
    .test(async v => (await emailInUse(v)) && 'Email already in use!');;
schema.validateAsync('notInUse@email.com'); // -> Promise<{ valid: true, error: null }>
schema.validateAsync('inUse@email.com'); // -> Promise<{ valid: false, error: 'Email already in use!'>
```

### `any.cast(value: any): any`

Attempts to cast a value using the schema
All transforms defined in the schema will be run, and the resulting object returned
If an "impossible" cast is attempted (e.g. casting a string to an object) the input object will be returned

```
const schema = ok.object({ foo: ok.number('Must be a number!') });
schema.cast({ foo: 5 }); // -> { foo: 5 }
schema.cast({ foo: '5' }); // -> { foo: 5 }
schema.cast(null); // -> null
schema.cast(''); // -> ''
```

### `any.optional()`

Marks the schema as optional, meaning that `""`, `null`, `undefined` are considered valid

```
const schema = ok.string().optional();
schema.validate('') // -> { valid: true, error: null };
schema.validate(null) // -> { valid: true, error: null };
schema.validate(undefined) // -> { valid: true, error: null };
```

### `any.required(msg: string)`

Fields are required by default. If you want to specify the error message for an empty value, you can use `.required` to set it.

```
const schema = ok.string().required('This is required!');
schema.validate('') // -> { valid: false, error: 'This is required!' };
schema.validate(null) // -> { valid: false, error: 'This is required!' };
```

### `any.transform()`

### `any.test()`
