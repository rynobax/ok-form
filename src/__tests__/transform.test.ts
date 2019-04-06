import ok from '../index';

describe('tranform', () => {
  const schema = ok
    .number()
    .transform(v => v * 10)
    .max(10);
  test('invalid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(0.1);
    expect(result.valid).toBe(true);
  });
});

describe('transform order matters', () => {
  const t1 = (v: number) => v - 1;
  const t2 = (v: number) => v * 10;

  test('invalid', () => {
    const schema = ok
      .number()
      .transform(t1)
      .transform(t2)
      .max(5);
    const result = schema.validate(1);
    expect(result.valid).toBe(true);
  });

  test('valid', () => {
    const schema = ok
      .number()
      .transform(t2)
      .transform(t1)
      .max(5);
    const result = schema.validate(1);
    expect(result.valid).toBe(false);
  });
});
