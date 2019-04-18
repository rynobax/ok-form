# ok-form (WIP)

minimal js object schema validation

[![Build Status](https://travis-ci.com/rynobax/ok-form.svg?branch=master)](https://travis-ci.com/rynobax/ok-form)
[![Stable Release](https://img.shields.io/npm/v/ok-form.svg)](https://npm.im/ok-form)
[![gzip size](TODO)](TODO)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

## Introduction

ok-form is a simple, predictable object schema validator that is optimized for front-end validation of forms.

[joi](https://github.com/hapijs/joi) and [yup](https://github.com/jquense/yup) are both great libraries for validation. However, they have expansive APIs, and can make simple validation cases harder than it needs to be [(more on that here)](#TODO).

ok-form differs from these libraries by offering a small API, having sensible casting behavior by default, and offering a very explicit API for conditional validation.

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

## any

### `any.validate(value: any): Result`

Validates a value using the schema.
// TODO: Note that this casts first

```
const schema = ok.object({ foo: ok.number('Must be a number!') });
schema.validate({ foo: 5 }); // -> { valid: true, error: null }
schema.validate({ foo: 'a' }); // -> { valid: false, error: { foo: 'Must be a number!' }
```

### `any.validateAsync(value: any): Promise<Result>`

Validates an asynchronous schema.

```
const schema = ok
    .string()
    .test(async v => (await emailInUse(v)) && 'Email already in use!');;
schema.validateAsync('notInUse@email.com'); // -> Promise<{ valid: true, error: null }>
schema.validateAsync('inUse@email.com'); // -> Promise<{ valid: false, error: 'Email already in use!'>
```

### `any.cast(value: any): any`

Attempts to cast a value using the schema.
All transforms defined in the schema will be run, and the resulting object returned.
If an "impossible" cast is attempted (e.g. casting a string to an object) the input object will be returned.

```
const schema = ok.object({ foo: ok.number('Must be a number!') });
schema.cast({ foo: 5 }); // -> { foo: 5 }
schema.cast({ foo: '5' }); // -> { foo: 5 }
schema.cast(null); // -> null
schema.cast(''); // -> ''
```

### `any.optional()`

Marks the schema as optional, meaning that `""`, `null`, `undefined` are considered valid.

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

### `any.transform(transform: fn)`

Add a transformation to the schema. These transformations will be run when a value is cast via the schema.

The transformations will be run in the order they are defined.

```
const schema = ok.number().transform(v => v * 2).max(10);
schema.validate(8) // -> { valid: false, error: 'Must be less than or equal to 10' };
schema.cast(8) // -> 16;
```

### `any.test(test: fn)`

Adds a custom test function to the schema.

The test will be passed the value, and should return a string (the error message) if there is an issue, or a non string if the value is valid.

The second argument to `test` is the `Context` object, explained in detail [here](TODO)

```
const schema = ok.string().test(v => {
  if (v === 'evil') return 'No evil allowed';
});
schema.validate('evil') // -> { valid: false, error: 'No evil allowed' };
schema.cast('good') // -> { valid: true };
```

// TODO: where should this go

### `any()`

Create a schema with minimal default validation/transformations. If you want to implement all validation logic yourself, you can use this.

```
const schema = ok.any();
schema.validate(5) // -> { valid: true };
schema.validate(true) // -> { valid: true };
schema.validate({ foo: [1, 2, 3] }) // -> { valid: true };
```

## string

### `string(msg?: string, transform?: fn)`

Create a schema for a string.

If the value is not nullish or an object, the value will be cast using `String`. You can override the default cast by passing a transformation function as the second argument.

```
const schema = ok.string();
schema.validate('hello') // -> { valid: true };
schema.validate(5) // -> { valid: true };
schema.cast(5) // -> '5';
schema.validate({ foo: 5 }) // -> { valid: false };
```

### `string.length(len: number, msg?: string)`

Require the string be a certain length.

```
const schema = ok.string().length(5);
schema.validate('hello') // -> { valid: true };
schema.validate('hello world') // -> { valid: false };
```

### `string.min(len: number, msg?: string)`

Require the string be at least a certain length.

```
const schema = ok.string().min(5);
schema.validate('h') // -> { valid: false };
schema.validate('hello') // -> { valid: true };
schema.validate('hello world') // -> { valid: true };
```

### `string.max(len: number, msg?: string)`

Require the string be at most a certain length.

```
const schema = ok.string().max(5);
schema.validate('h') // -> { valid: true };
schema.validate('hello') // -> { valid: true };
schema.validate('hello world') // -> { valid: false };
```

### `string.matches(regex: Regex, msg?: string)`

Require the string match a regular expression.

```
const schema = ok.string().matches(/^[a-z]*$/);
schema.validate('hello') // -> { valid: true };
schema.validate('Hello') // -> { valid: false };
```

### `string.email(msg?: string)`

Require the string is an email address (using [this regex](https://emailregex.com/)).

```
const schema = ok.string().matches(/^[a-z]*$/);
schema.validate('hello@world.com') // -> { valid: true };
schema.validate('hello world') // -> { valid: false };
```

## number

### `number(msg?: string, transform?: fn)`

Create a schema for a number.

If the value is a string, the value will be cast using `Number`. You can override the default cast by passing a transformation function as the second argument.

```
const schema = ok.number();
schema.validate(5) // -> { valid: true };
schema.validate('5') // -> { valid: true };
schema.cast('5') // -> '5';
schema.validate('hello') // -> { valid: false };
```

### `number.min(val: number, msg?: string)`

Require the number be at least a certain value.

```
const schema = ok.string().min(5);
schema.validate(1) // -> { valid: false };
schema.validate(5) // -> { valid: true };
schema.validate(10) // -> { valid: true };
```

### `number.max(val: number, msg?: string)`

Require the number be at most a certain value.

```
const schema = ok.string().max(5);
schema.validate(1) // -> { valid: true };
schema.validate(5) // -> { valid: true };
schema.validate(10) // -> { valid: false };
```

### `number.lessThan(val: number, msg?: string)`

Require the number be less than a certain value.

```
const schema = ok.string().lessThan(5);
schema.validate(1) // -> { valid: true };
schema.validate(5) // -> { valid: false };
schema.validate(10) // -> { valid: false };
```

### `number.moreThan(val: number, msg?: string)`

Require the number be more than a certain value.

```
const schema = ok.string().moreThan(5);
schema.validate(1) // -> { valid: false };
schema.validate(5) // -> { valid: false };
schema.validate(10) // -> { valid: true };
```

### `number.positive(msg?: string)`

Require the number be positive

```
const schema = ok.string().positive();
schema.validate(-5) // -> { valid: false };
schema.validate(0) // -> { valid: false };
schema.validate(5) // -> { valid: true };
```

### `number.negative(msg?: string)`

Require the number be negative

```
const schema = ok.string().negative();
schema.validate(-5) // -> { valid: true };
schema.validate(0) // -> { valid: false };
schema.validate(5) // -> { valid: false };
```

### `number.integer(msg?: string)`

Require the number be an integer

```
const schema = ok.string().integer();
schema.validate(5) // -> { valid: true };
schema.validate(5.25) // -> { valid: false };
```

## boolean

### `boolean(msg?: string, transform?: fn)`

Create a schema for a boolean.

If the value is a string, the values `true` and `false` will be cast to their boolean representation. You can override the default cast by passing a transformation function as the second argument.

```
const schema = ok.boolean();
schema.validate(true) // -> { valid: true };
schema.validate('false') // -> { valid: true };
schema.validate(5) // -> { valid: false };
```

## object

### `object(shape: Shape, msg?: string)`

Create a schema for an object.

// TODO: Clarify shape

```
const schema = ok.object({ foo: ok.number(); });
schema.validate({ foo: 5 }) // -> { valid: true };
schema.validate({ foo: 'hello' }) // -> { valid: false };
schema.validate(5) // -> { valid: false };
```

## array

### `array(shape: Shape, msg?: string)`

Create a schema for an array.

// TODO: Clarify shape

```
const schema = ok.array(ok.number());
schema.validate([1, 2, 3]) // -> { valid: true };
schema.validate(['hello', 'world']) // -> { valid: false };
schema.validate(5) // -> { valid: false };
```

### `array.length()`

Require the array be a certain length.

```
const schema = ok.array(ok.number()).length(2);
schema.validate([1, 2]) // -> { valid: true };
schema.validate([1, 2, 3]) // -> { valid: false };
```

### `array.min()`

Require the array be at least a certain length.

```
const schema = ok.array(ok.number()).min(2);
schema.validate([1]) // -> { valid: false };
schema.validate([1, 2]) // -> { valid: true };
schema.validate([1, 2, 3]) // -> { valid: true };
```

### `array.max()`

Require the array be at most a certain length.

```
const schema = ok.array(ok.number()).max(2);
schema.validate([1]) // -> { valid: true };
schema.validate([1, 2]) // -> { valid: true };
schema.validate([1, 2, 3]) // -> { valid: false };
```

## Tips

### Conditional validation

Conditional types can be achieved using test. If you return a schema from `.test`, it will be evaluated against the value. So if you only want to run the test under a certain condition, simply check the condition and return a schema for that case.

Example: `a` and `b` are only required if the other is set

```
const schema = ok.object({
  // Using ternary
  a: ok
    .number()
    .optional()
    .test((_, { parent }) => (parent.b ? ok.number() : null)),
  // Using short-circuiting
  b: ok
    .number()
    .optional()
    .test((_, { parent }) => parent.a && ok.number()),
});

schema.validate({ a: null, b: null }) // -> { valid: true };
schema.validate({ a: 1, b: null }) // -> { valid: false };
schema.validate({ a: null, b: 1 }) // -> { valid: false };
schema.validate({ a: 1, b: 1 }) // -> { valid: true };

```

# issues with joi and yup / why not...

## joi

Hard to set error msgs
bundle size?

# yup

converting string -> number is a pain
dsl for conditional validation is strange
circular references

// TODO: Random stuff
if number is null, dont run "number" tests, but still run "any" tests

note about required vs constructor
