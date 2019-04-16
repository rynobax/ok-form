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

test('tranform can convert away null values', () => {
  const schema = ok
    .number()
    .transform(v => (v === null ? 5 : v))
    .max(10);
  const result = schema.validate(null);
  expect(result.valid).toBe(true);
});

describe('custom transforms override default behavior', () => {
  test('number', () => {
    const schema = ok.number('Must be a number', v => {
      // Convert fraction to number
      if (v.includes('/')) {
        const [numerator, denominator] = v.split('/').map(Number);
        return numerator / denominator;
      }
    });
    const result = schema.validate('3/4');
    expect(result.valid).toBe(true);
    const value = schema.cast('3/4');
    expect(value).toEqual(0.75);
  });

  test('string', () => {
    const schema = ok.string('Must be a string', String);
    const result = schema.validate(null);
    expect(result.valid).toBe(true);
    const value = schema.cast(null);
    expect(value).toEqual('null');
  });

  test('boolean', () => {
    const schema = ok.boolean('Must be a boolean', v => {
      // Accept t or f
      if (v === 't') return true;
      else if (v === 'f') return false;
      else return v;
    });
    const result = schema.validate('t');
    expect(result.valid).toBe(true);
    const value = schema.cast('t');
    expect(value).toEqual(true);
  });
});
