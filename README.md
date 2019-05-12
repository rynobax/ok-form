# ok-form

Javscript schema-based validation for forms

[![Build Status](https://travis-ci.com/rynobax/ok-form.svg?branch=master)](https://travis-ci.com/rynobax/ok-form)
[![Stable Release](https://img.shields.io/npm/v/ok-form.svg)](https://npm.im/ok-form)
[![gzip size](http://img.badgesize.io/https://unpkg.com/ok-form@latest/dist/ok-form.umd.min.js?compression=gzip)](https://unpkg.com/ok-form@latest/dist/ok-form.umd.min.js)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

## Introduction

ok-form is a simple, predictable object schema validator that is optimized for validation of forms.

[joi](https://github.com/hapijs/joi) and [yup](https://github.com/jquense/yup) are both good libraries, but can cause friction when used for validating forms. ok-form improves upon them by having:

- a smaller bundle size (3kB vs 20+kB)
- sensible default casting behavior
- a simple API for conditional validation and references (no magic strings or refs!)

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
// -> { valid: true, errors: null }

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
  errors: {
    email: 'Invalid email',
    age: 'Must be a number',
    password: 'Password must be at least 8 characters!',
    confirmPassword: 'Passwords must match!',
  },
}
*/
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [API](#api)
  - [Schema](#schema)
    - [Result](#result)
    - [`schema.validate(value: any): Result`](#schemavalidatevalue-any-result)
    - [`schema.validateAsync(value: any): Promise<Result>`](#schemavalidateasyncvalue-any-promiseresult)
    - [`schema.cast(value: any): any`](#schemacastvalue-any-any)
  - [any](#any)
    - [`any(): Schema`](#any-schema)
    - [`any.optional()`](#anyoptional)
    - [`any.required(msg: string)`](#anyrequiredmsg-string)
    - [`any.transform(transform: fn)`](#anytransformtransform-fn)
    - [`any.test(test: fn)`](#anytesttest-fn)
    - [Context](#context)
    - [Parent](#parent)
    - [Root](#root)
    - [Path](#path)
  - [string](#string)
    - [`string(msg?: string, transform?: fn): Schema`](#stringmsg-string-transform-fn-schema)
    - [`string.length(len: number, msg?: string)`](#stringlengthlen-number-msg-string)
    - [`string.min(len: number, msg?: string)`](#stringminlen-number-msg-string)
    - [`string.max(len: number, msg?: string)`](#stringmaxlen-number-msg-string)
    - [`string.matches(regex: Regex, msg?: string)`](#stringmatchesregex-regex-msg-string)
    - [`string.email(msg?: string)`](#stringemailmsg-string)
  - [number](#number)
    - [`number(msg?: string, transform?: fn): Schema`](#numbermsg-string-transform-fn-schema)
    - [`number.min(val: number, msg?: string)`](#numberminval-number-msg-string)
    - [`number.max(val: number, msg?: string)`](#numbermaxval-number-msg-string)
    - [`number.lessThan(val: number, msg?: string)`](#numberlessthanval-number-msg-string)
    - [`number.moreThan(val: number, msg?: string)`](#numbermorethanval-number-msg-string)
    - [`number.positive(msg?: string)`](#numberpositivemsg-string)
    - [`number.negative(msg?: string)`](#numbernegativemsg-string)
    - [`number.integer(msg?: string)`](#numberintegermsg-string)
  - [boolean](#boolean)
    - [`boolean(msg?: string, transform?: fn): Schema`](#booleanmsg-string-transform-fn-schema)
  - [object](#object)
    - [`object(shape: Shape, msg?: string): Schema`](#objectshape-shape-msg-string-schema)
  - [array](#array)
    - [`array(shape: Schema, msg?: string): Schema`](#arrayshape-schema-msg-string-schema)
    - [`array.length(len: number, msg?: string)`](#arraylengthlen-number-msg-string)
    - [`array.min(len: number, msg?: string)`](#arrayminlen-number-msg-string)
    - [`array.max(len: number, msg?: string)`](#arraymaxlen-number-msg-string)
- [Tips](#tips)
  - [Conditional validation](#conditional-validation)
  - [Typescript](#typescript)
  - [Usage with Formik](#usage-with-formik)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# API

## Schema

### Result

The response from `validate` and `validateAsync` takes the shape:

`{ valid: boolean, errors: any, validationError: ValidationError }`

- `valid`: whether or not the value matches the schema
- `errors`: The schema's errors, where each error message is positioned where the error occured (see below for example)

### `schema.validate(value: any): Result`

Validates a value using the schema.

```javascript
const schema = ok.object({ foo: ok.number('Must be a number!') });
schema.validate({ foo: 5 }); // -> { valid: true, errors: null }
schema.validate({ foo: 'a' }); // -> { valid: false, errors: { foo: 'Must be a number!' }
```

### `schema.validateAsync(value: any): Promise<Result>`

Validates an asynchronous schema.

```javascript
const schema = ok
  .string()
  .test(async v => (await emailInUse(v)) && 'Email already in use!');
schema.validateAsync('notInUse@email.com'); // -> Promise<{ valid: true, errors: null }>
schema.validateAsync('inUse@email.com'); // -> Promise<{ valid: false, errors: 'Email already in use!'>
```

### `schema.cast(value: any): any`

Attempts to cast a value using the schema.
All transforms defined in the schema will be run, and the resulting object returned.
If an "impossible" cast is attempted (e.g. casting a string to an object) the input object will be returned.

```javascript
const schema = ok.object({ foo: ok.number('Must be a number!') });
schema.cast({ foo: 5 }); // -> { foo: 5 }
schema.cast({ foo: '5' }); // -> { foo: 5 }
schema.cast(null); // -> null
schema.cast(''); // -> ''
```

## any

All of the `any` methods can also be used on the more specific schema types, like `string` or `object`.

### `any(): Schema`

Create a schema with minimal default validation/transformations. If you want to implement all validation logic yourself, you can use this.

```javascript
const schema = ok.any();
schema.validate(5); // -> { valid: true };
schema.validate(true); // -> { valid: true };
schema.validate({ foo: [1, 2, 3] }); // -> { valid: true };
```

### `any.optional()`

Marks the schema as optional, meaning that `""`, `null`, `undefined` are considered valid.

```javascript
const schema = ok.string().optional();
schema.validate(''); // -> { valid: true };
schema.validate(null); // -> { valid: true };
schema.validate(undefined); // -> { valid: true };
```

### `any.required(msg: string)`

Fields are required by default. If you want to specify the error message for an empty value, you can use `.required` to set it.

```javascript
const schema = ok.string().required('This is required!');
schema.validate(''); // -> { valid: false, errors: 'This is required!' };
schema.validate(null); // -> { valid: false, errors: 'This is required!' };
```

### `any.transform(transform: fn)`

Add a transformation to the schema. These transformations will be run when a value is cast via the schema.

The transformations will be run in the order they are defined.

All transformations will run before validation.

```javascript
const schema = ok
  .number()
  .transform(v => v * 2)
  .max(10);
schema.validate(8); // -> { valid: false };
schema.cast(8); // -> 16;
```

### `any.test(test: fn)`

Adds a custom test function to the schema.

The test will be passed the value, and should return a string (the error message) if there is an issue, or a non string if the value is valid.

```javascript
const schema = ok.string().test(v => {
  if (v === 'evil') return 'No evil allowed';
});
schema.validate('evil'); // -> { valid: false, errors: 'No evil allowed' };
schema.cast('good'); // -> { valid: true };
```

The second argument to `test` is the `Context` object, which is used if you need to reference other fields.

### Context

Context an object of the shape `{ parent: Parent, root: Root, path: string[] }`

### Parent

`parent` is the parent value of the current node, before transformation.

```javascript
const schema = ok.object({
  foo: ok
    .string()
    .test((v, { parent }) => console.log(`Value: ${v}, parent: ${parent}`)),
  bar: ok.string(),
});
schema.validate({ foo: 'Foo!', bar: 'Bar!' });
// Value: Foo!, parent: { foo: 'Foo!', bar: 'Bar!' }
```

### Root

`root` is the value passed to `validate`, before transformation.

```javascript
const schema = ok.object({
  deep: ok.object({
    nesting: ok.object({
      foo: ok
        .string()
        .test((v, { root }) => console.log(`Value: ${v}, root: ${root}`)),
    }),
  }),
});
schema.validate({ deep: { nesting: { foo: 'Foo!' } } });
// Value: Foo!, root: { deep: { nesting: { foo: 'Foo!' } } }
```

### Path

`path` is an array of strings of the path to the current node.

```javascript
const schema = ok.object({
  nested: ok.object({
    array: ok.array(
      ok
        .string()
        .test((v, { path }) => console.log(`Value: ${v}, path: ${path}`))
    ),
  }),
});
schema.validate({ nested: { array: ['Foo!'] } });
// Value: Foo!, path: ['nested', 'array', '0']
```

Note that these tests will run even if the value is null, undefined, or empty, unlike the type specific tests (eg. `max`, `.length`, etc).

## string

### `string(msg?: string, transform?: fn): Schema`

Create a schema for a string.

If the value is not null, undefined, or an object, the value will be cast using `String`. You can override the default cast by passing a transformation function as the second argument.

```javascript
const schema = ok.string();
schema.validate('hello'); // -> { valid: true };
schema.validate(5); // -> { valid: true };
schema.cast(5); // -> '5';
schema.validate({ foo: 5 }); // -> { valid: false };
```

### `string.length(len: number, msg?: string)`

Require the string be a certain length.

```javascript
const schema = ok.string().length(5);
schema.validate('hello'); // -> { valid: true };
schema.validate('hello world'); // -> { valid: false };
```

### `string.min(len: number, msg?: string)`

Require the string be at least a certain length.

```javascript
const schema = ok.string().min(5);
schema.validate('h'); // -> { valid: false };
schema.validate('hello'); // -> { valid: true };
schema.validate('hello world'); // -> { valid: true };
```

### `string.max(len: number, msg?: string)`

Require the string be at most a certain length.

```javascript
const schema = ok.string().max(5);
schema.validate('h'); // -> { valid: true };
schema.validate('hello'); // -> { valid: true };
schema.validate('hello world'); // -> { valid: false };
```

### `string.matches(regex: Regex, msg?: string)`

Require the string match a regular expression.

```javascript
const schema = ok.string().matches(/^[a-z]*$/);
schema.validate('hello'); // -> { valid: true };
schema.validate('Hello'); // -> { valid: false };
```

### `string.email(msg?: string)`

Require the string is an email address (using [this regex](https://emailregex.com/)).

```javascript
const schema = ok.string().matches(/^[a-z]*$/);
schema.validate('hello@world.com'); // -> { valid: true };
schema.validate('hello world'); // -> { valid: false };
```

## number

### `number(msg?: string, transform?: fn): Schema`

Create a schema for a number.

If the value is a string, the value will be cast using `Number`. You can override the default cast by passing a transformation function as the second argument.

```javascript
const schema = ok.number();
schema.validate(5); // -> { valid: true };
schema.validate('5'); // -> { valid: true };
schema.cast('5'); // -> '5';
schema.validate('hello'); // -> { valid: false };
```

### `number.min(val: number, msg?: string)`

Require the number be at least a certain value.

```javascript
const schema = ok.string().min(5);
schema.validate(1); // -> { valid: false };
schema.validate(5); // -> { valid: true };
schema.validate(10); // -> { valid: true };
```

### `number.max(val: number, msg?: string)`

Require the number be at most a certain value.

```javascript
const schema = ok.string().max(5);
schema.validate(1); // -> { valid: true };
schema.validate(5); // -> { valid: true };
schema.validate(10); // -> { valid: false };
```

### `number.lessThan(val: number, msg?: string)`

Require the number be less than a certain value.

```javascript
const schema = ok.string().lessThan(5);
schema.validate(1); // -> { valid: true };
schema.validate(5); // -> { valid: false };
schema.validate(10); // -> { valid: false };
```

### `number.moreThan(val: number, msg?: string)`

Require the number be more than a certain value.

```javascript
const schema = ok.string().moreThan(5);
schema.validate(1); // -> { valid: false };
schema.validate(5); // -> { valid: false };
schema.validate(10); // -> { valid: true };
```

### `number.positive(msg?: string)`

Require the number be positive

```javascript
const schema = ok.string().positive();
schema.validate(-5); // -> { valid: false };
schema.validate(0); // -> { valid: false };
schema.validate(5); // -> { valid: true };
```

### `number.negative(msg?: string)`

Require the number be negative

```javascript
const schema = ok.string().negative();
schema.validate(-5); // -> { valid: true };
schema.validate(0); // -> { valid: false };
schema.validate(5); // -> { valid: false };
```

### `number.integer(msg?: string)`

Require the number be an integer

```javascript
const schema = ok.string().integer();
schema.validate(5); // -> { valid: true };
schema.validate(5.25); // -> { valid: false };
```

## boolean

### `boolean(msg?: string, transform?: fn): Schema`

Create a schema for a boolean.

If the value is a string, the values `true` and `false` will be cast to their boolean representation. You can override the default cast by passing a transformation function as the second argument.

```javascript
const schema = ok.boolean();
schema.validate(true); // -> { valid: true };
schema.validate('false'); // -> { valid: true };
schema.validate(5); // -> { valid: false };
```

## object

### `object(shape: Shape, msg?: string): Schema`

Create a schema for an object.

`Shape` is an object where each value is a schema.

```javascript
const schema = ok.object({ foo: ok.number(); });
schema.validate({ foo: 5 }) // -> { valid: true };
schema.validate({ foo: 'hello' }) // -> { valid: false };
schema.validate(5) // -> { valid: false };
```

## array

### `array(shape: Schema, msg?: string): Schema`

Create a schema for an array.

```javascript
const schema = ok.array(ok.number());
schema.validate([1, 2, 3]); // -> { valid: true };
schema.validate(['hello', 'world']); // -> { valid: false };
schema.validate(5); // -> { valid: false };
```

### `array.length(len: number, msg?: string)`

Require the array be a certain length.

```javascript
const schema = ok.array(ok.number()).length(2);
schema.validate([1, 2]); // -> { valid: true };
schema.validate([1, 2, 3]); // -> { valid: false };
```

### `array.min(len: number, msg?: string)`

Require the array be at least a certain length.

```javascript
const schema = ok.array(ok.number()).min(2);
schema.validate([1]); // -> { valid: false };
schema.validate([1, 2]); // -> { valid: true };
schema.validate([1, 2, 3]); // -> { valid: true };
```

### `array.max(len: number, msg?: string)`

Require the array be at most a certain length.

```javascript
const schema = ok.array(ok.number()).max(2);
schema.validate([1]); // -> { valid: true };
schema.validate([1, 2]); // -> { valid: true };
schema.validate([1, 2, 3]); // -> { valid: false };
```

# Tips

## Conditional validation

Conditional types can be achieved using test. If you return a schema from `.test`, it will be evaluated against the value. So if you only want to run the test under a certain condition, simply check the condition and return a schema for that case.

Example: `a` and `b` are only required if the other is set

```javascript
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

schema.validate({ a: null, b: null }); // -> { valid: true };
schema.validate({ a: 1, b: null }); // -> { valid: false };
schema.validate({ a: null, b: 1 }); // -> { valid: false };
schema.validate({ a: 1, b: 1 }); // -> { valid: true };
```

## Typescript

ok-form supports typescript out of the box. All of the schema constructors take 3 generic paramaters:

```javascript
ok.any<Input, Parent, Root>()
```

`Input` is the type of the object that it expects to be passed to `validate` and `cast`.

`Parent` is the type of the schema's [Parent value](#parent)

`Root` is the type of the schema's [Root value](#root)

## Usage with Formik

[Formik](https://formik.dev) is a great tool for reducing form boilerplate. Here's how you would integrate ok-form with it:

```javascript
const schema = ok.object({ name: ok.string(); email: ok.string() });
const form = () => (
  <Formik
    validate={{values => schema.validate(values).error}}
  >
    {/* Form code */}
  </Formik>
)

```
