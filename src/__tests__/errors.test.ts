import ok from '../index';

test('casting string to object', () => {
  const schema = ok.object({
    double: ok.number().transform(v => v * 2),
    string: ok.number(),
  });
  const result = schema.cast('lol');
  expect(result).toEqual('lol');
});

test('casting string to object nested', () => {
  const schema = ok.object({
    foo: ok.object({
      double: ok.number().transform(v => v * 2),
      string: ok.number(),
    }),
  });
  const result = schema.cast({ foo: 'lol' });
  expect(result).toEqual({ foo: 'lol' });
});

test('validate string to object nested', () => {
  const schema = ok.object({
    foo: ok.object({
      double: ok.number().transform(v => v * 2),
      string: ok.number(),
    }),
  });
  const { errors, valid } = schema.validate({ foo: 'lol' });
  expect(valid).toEqual(false);
  expect(errors).toEqual({ foo: 'Must be an object' });
});

test('.test that throws', () => {
  const schema = ok
    .number()
    .optional()
    .test(v => {
      return v.foo;
    });
  expect(() => schema.validate(null)).toThrow(
    "Cannot read property 'foo' of null"
  );
});
