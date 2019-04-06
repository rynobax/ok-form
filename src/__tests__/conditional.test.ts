import ok from '../index';

describe('just use test', () => {
  const schema = ok.object({
    a: ok
      .number()
      .nullable()
      .test((_, { parent }) => (parent.b ? ok.number() : null)),
    b: ok
      .number()
      .nullable()
      .test((_, { parent }) => parent.a && ok.number()),
  });

  test('invalid', () => {
    const result = schema.validate({
      a: null,
      b: 2,
    });
    expect(result.valid).toBe(false);
  });

  test('invalid 2', () => {
    const result = schema.validate({
      a: 2,
      b: null,
    });
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate({
      a: 1,
      b: 2,
    });
    expect(result.valid).toBe(true);
  });
});
