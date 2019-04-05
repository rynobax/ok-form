import ok from '../index';

describe('parsing', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test.each<[string, any, boolean]>([
    ['empty string', '   ', false],
    ['number', 5, true],
    ['string', '5', true],
    ['true', true, false],
    ['false', false, false],
    ['object', {}, false],
    ['array', [5], false],
  ])('%s', (_, value, valid) => {
    const schema = ok.number();
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });

  it('message', () => {
    const customMsg = 'Custom validation msg';
    const schema = ok.number(customMsg);
    const result = schema.validate(null);
    expect(result.error).toBe(customMsg);
  });
});

describe('min', () => {
  test('invalid', () => {
    const schema = ok.number().min(10);
    const result = schema.validate(5);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const schema = ok.number().min(10);
    const result = schema.validate(15);
    expect(result.valid).toBe(true);
  });

  test('min is inclusive', () => {
    const schema = ok.number().min(10);
    const result = schema.validate(10);
    expect(result.valid).toBe(true);
  });

  test('message', () => {
    const customMsg = 'Must be greater than 5';
    const schema = ok.number().min(10, customMsg);
    const result = schema.validate(5);
    expect(result.error).toBe(customMsg);
  });
});

describe('max', () => {
  test.todo('invalid');
  test.todo('valid');
});

describe('lessThan', () => {
  test.todo('invalid');
  test.todo('valid');
});

describe('moreThan', () => {
  test.todo('invalid');
  test.todo('valid');
});

describe('positive', () => {
  test.todo('invalid');
  test.todo('valid');
});

describe('negative', () => {
  test.todo('invalid');
  test.todo('valid');
});

describe('integer', () => {
  test('invalid', () => {
    const schema = ok.number().integer();
    const result = schema.validate(372.21475815);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const schema = ok.number().integer();
    const result = schema.validate(15);
    expect(result.valid).toBe(true);
  });

  test('message', () => {
    const customMsg = 'Must be a cool integer thing';
    const schema = ok.number().integer(customMsg);
    const result = schema.validate(372.21475815);
    expect(result.error).toBe(customMsg);
  });
});

describe('combos', () => {
  describe('min and integer', () => {
    const minMsg = 'min failed';
    const intMsg = 'int failed';
    const schema = ok
      .number()
      .integer(intMsg)
      .min(0, minMsg);

    test('pass', () => {
      const result = schema.validate(5);
      expect(result.valid).toBe(true);
    });

    test('min fail', () => {
      const result = schema.validate(-5);
      expect(result.error).toBe(minMsg);
    });

    test('integer fail', () => {
      const result = schema.validate(5.213);
      expect(result.error).toBe(intMsg);
    });
  });
});
