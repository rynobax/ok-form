import ok from '../index';

const customMsg = 'custom array err msg';

describe('parsing', () => {
  const schema = ok.array(ok.number());
  test.each<[string, any, boolean]>([
    ['empty string', '   ', false],
    ['number', 5, false],
    ['string', '5', false],
    ['true', true, false],
    ['false', false, false],
    ['object', {}, false],
    ['array', [5], true],
    ['null', null, false],
  ])('%s', (_, value, valid) => {
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });
});

test('custom message', () => {
  const schema = ok.array(ok.number(), customMsg);
  const result = schema.validate('yo');
  expect(result.errors).toBe(customMsg);
});

describe('array of primitives', () => {
  const schema = ok.array(ok.number());

  test('invalid', () => {
    const result = schema.validate({
      num: null,
    });
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate([5]);
    expect(result.valid).toBe(true);
  });

  test('message', () => {
    const result = schema.validate([5, 'lsdfjlk']);
    expect(result.errors).toEqual([null, 'Must be a number']);
  });
});

describe('array of objects', () => {
  const schema = ok.array(
    ok.object({
      foo: ok.number(),
    })
  );

  test('valid', () => {
    const result = schema.validate([{ foo: 5 }]);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate([{ foo: 'lsdfjlk' }]);
    expect(result.errors).toEqual([{ foo: 'Must be a number' }]);
  });
});

describe('array of arrays', () => {
  const schema = ok.array(ok.array(ok.number()));

  test('valid', () => {
    const result = schema.validate([[5], [6]]);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate([['fdsklfj']]);
    expect(result.errors).toEqual([['Must be a number']]);
  });
});

test('cast', () => {
  const schema = ok.array(ok.number());
  const result = schema.cast([5, '6']);
  expect(result).toEqual([5, 6]);
});

describe('length', () => {
  const schema = ok.array(ok.number()).length(3, customMsg);

  test('valid', () => {
    const result = schema.validate([5, 5, 5]);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate([5]);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate([5]);
    expect(result.errors).toEqual(customMsg);
  });
});

describe('min', () => {
  const schema = ok.array(ok.number()).min(3, customMsg);

  test('valid', () => {
    const result = schema.validate([5, 5, 5, 5]);
    expect(result.valid).toBe(true);
  });

  test('inclusive', () => {
    const result = schema.validate([5, 5, 5]);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate([5]);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate([5]);
    expect(result.errors).toEqual(customMsg);
  });
});

describe('max', () => {
  const schema = ok.array(ok.number()).max(3, customMsg);

  test('valid', () => {
    const result = schema.validate([5, 5]);
    expect(result.valid).toBe(true);
  });

  test('inclusive', () => {
    const result = schema.validate([5, 5, 5]);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate([5, 5, 5, 5]);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate([5, 5, 5, 5]);
    expect(result.errors).toEqual(customMsg);
  });
});
