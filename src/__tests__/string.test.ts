import ok from '../index';

describe('parsing', () => {
  const schema = ok.string();
  test.each<[string, any, boolean]>([
    ['empty string', '   ', true],
    ['number', 5, true],
    ['string', '5', true],
    ['true', true, true],
    ['false', false, true],
    ['object', {}, false],
    ['array', [5], false],
    ['null', null, false],
  ])('%s', (_, value, valid) => {
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });

  it('message', () => {
    const customMsg = 'Custom validation msg';
    const schema = ok.string(customMsg);
    const result = schema.validate({});
    expect(result.error).toBe(customMsg);
  });

  describe('optional', () => {
    it('valid', () => {
      const schema = ok.string().optional();
      const result = schema.validate(null);
      expect(result.valid).toBe(true);
    });

    it('casting', () => {
      const schema = ok.string().optional();
      const result = schema.cast(null);
      expect(result).toBe(null);
    });
  });
});

const customMsg = 'My custom msg';
describe('length', () => {
  const schema = ok.string().length(5, customMsg);
  test('valid', () => {
    const result = schema.validate('abcde');
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate('a');
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate('a');
    expect(result.error).toBe(customMsg);
  });
});

describe('min', () => {
  const schema = ok.string().min(5, customMsg);
  test('valid', () => {
    const result = schema.validate('abcdefg');
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate('ab');
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate('ab');
    expect(result.error).toBe(customMsg);
  });
});

describe('max', () => {
  const schema = ok.string().max(5, customMsg);
  test('valid', () => {
    const result = schema.validate('ab');
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate('abcdefg');
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate('abcdefg');
    expect(result.error).toBe(customMsg);
  });
});

describe('matches', () => {
  const schema = ok.string().matches(/^[a-z]*$/, customMsg);
  test('valid', () => {
    const result = schema.validate('lowercase');
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate('uPpErCaSe');
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate('uPpErCaSe');
    expect(result.error).toBe(customMsg);
  });
});

describe('email', () => {
  const schema = ok.string().email(customMsg);
  test('valid', () => {
    const result = schema.validate('valid@gmail.com');
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate('not a valid email');
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate('not a valid email');
    expect(result.error).toBe(customMsg);
  });
});
