import ok from '../index';
import { ValidationRuntimeError } from '../errors';

test('casting string to object', () => {
  const schema = ok.object({
    double: ok.number().transform(v => v * 2),
    string: ok.number(),
  });
  try {
    schema.cast('lol');
    expect('test').toEqual('to have thrown');
  } catch (err) {
    expect(err instanceof ValidationRuntimeError).toBe(true);
    expect((err as ValidationRuntimeError).message).toEqual(
      'Must be an object'
    );
    expect((err as ValidationRuntimeError).originalError.message).toEqual(
      'Cannot cast string to object'
    );
  }
});

test('.test that throws', () => {
  const schema = ok
    .number()
    .optional()
    .test(v => {
      return v.foo;
    });
  const { validationError } = schema.validate(null);
  expect(validationError!.message).toEqual(
    "Cannot read property 'foo' of null"
  );
  expect(validationError!.originalError.message).toEqual(
    "Cannot read property 'foo' of null"
  );
});
