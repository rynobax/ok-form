import ok from '../index';

describe('parsing', () => {
  test.each<[string, any, boolean]>([
    ['empty string', '   ', false],
    ['number', 5, false],
    ['string', '5', false],
    ['true', true, false],
    ['false', false, false],
    ['object', {}, true],
    ['array', [5], false],
    ['null', null, false],
  ])('%s', (_, value, valid) => {
    const schema = ok.object({});
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });
});

test('custom message', () => {
  const customMsg = 'custom object err msg';
  const schema = ok.object({}, customMsg);
  const result = schema.validate(null);
  expect(result.error).toBe(customMsg);
});

describe('simple', () => {
  const schema = ok.object({
    num: ok.number(),
  });

  test('invalid', () => {
    const result = schema.validate({
      num: null,
    });
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate({
      num: 5,
    });
    expect(result.valid).toBe(true);
  });
});

describe('multiple keys', () => {
  const schema = ok.object({
    a: ok.number(),
    b: ok.number(),
    c: ok.number(),
  });

  test('invalid', () => {
    const result = schema.validate({
      a: 5,
      b: null,
    });
    expect(result.error).toEqual({
      b: expect.any(String),
      c: expect.any(String),
    });
  });

  test('valid', () => {
    const result = schema.validate({
      a: 1,
      b: 2,
      c: '3',
    });
    expect(result.valid).toBe(true);
  });
});

describe('nested', () => {
  const schema = ok.object({
    a: ok.number(),
    nested: ok.object({
      b: ok.number(),
      soDeep: ok.object({
        c: ok.number(),
      }),
    }),
  });

  test('invalid', () => {
    const result = schema.validate({
      a: 5,
      nested: {
        b: null,
        soDeep: {
          c: null,
        },
      },
    });
    expect(result.error).toEqual({
      nested: {
        b: expect.any(String),
        soDeep: {
          c: expect.any(String),
        },
      },
    });
  });

  test('valid', () => {
    const result = schema.validate({
      a: 1,
      nested: {
        b: 2,
        soDeep: {
          c: 3,
        },
      },
    });
    expect(result.valid).toBe(true);
  });
});

describe('required', () => {
  const schema = ok.object({});

  test('invalid', () => {
    const result = schema.validate(null);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate({});
    expect(result.valid).toBe(true);
  });
});

describe('nullable keys', () => {
  const schema = ok.object({
    a: ok.number().nullable(),
    b: ok.number().nullable(),
  });

  test('null valid', () => {
    const result = schema.validate({
      a: null,
      b: null,
    });
    expect(result.valid).toBe(true);
  });

  test('missing valid', () => {
    const result = schema.validate({});
    expect(result.valid).toBe(true);
  });
});

test('extra keys are ok', () => {
  const schema = ok.object({
    a: ok.number(),
  });
  const result = schema.validate({ a: 5, b: 5 });
  expect(result.valid).toBe(true);
});
