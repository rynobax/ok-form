import ok from '../index';

const customMsg = 'cool custom number message';

describe('parsing', () => {
  test.each<[string, any, boolean]>([
    ['empty string', '   ', false],
    ['number', 5, true],
    ['string', '5', true],
    ['true', true, false],
    ['false', false, false],
    ['object', {}, false],
    ['array', [5], false],
    ['null', null, false],
  ])('%s', (_, value, valid) => {
    const schema = ok.number();
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });

  it('message', () => {
    const schema = ok.number(customMsg);
    const result = schema.validate('#^&#^');
    expect(result.errors).toBe(customMsg);
  });

  describe('optional', () => {
    const schema = ok.number().optional();
    it('valid', () => {
      const result = schema.validate(null);
      expect(result.valid).toBe(true);
    });

    it('casting', () => {
      const result = schema.cast(null);
      expect(result).toBe(null);
    });
  });
});

describe('min', () => {
  const schema = ok.number().min(10, customMsg);
  test('invalid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(15);
    expect(result.valid).toBe(true);
  });

  test('is inclusive', () => {
    const result = schema.validate(10);
    expect(result.valid).toBe(true);
  });

  test('message', () => {
    const result = schema.validate(5);
    expect(result.errors).toBe(customMsg);
  });
});

describe('max', () => {
  const schema = ok.number().max(10, customMsg);
  test('invalid', () => {
    const result = schema.validate(15);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(true);
  });

  test('is inclusive', () => {
    const result = schema.validate(10);
    expect(result.valid).toBe(true);
  });

  test('message', () => {
    const result = schema.validate(15);
    expect(result.errors).toBe(customMsg);
  });
});

describe('lessThan', () => {
  const schema = ok.number().lessThan(10, customMsg);
  test('invalid', () => {
    const result = schema.validate(15);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(true);
  });

  test('is exclusive', () => {
    const result = schema.validate(10);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate(15);
    expect(result.errors).toBe(customMsg);
  });
});

describe('moreThan', () => {
  const schema = ok.number().moreThan(10, customMsg);
  test('invalid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(15);
    expect(result.valid).toBe(true);
  });

  test('is exclusive', () => {
    const result = schema.validate(10);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate(5);
    expect(result.errors).toBe(customMsg);
  });
});

describe('positive', () => {
  const schema = ok.number().positive(customMsg);
  test('invalid', () => {
    const result = schema.validate(-5);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(true);
  });

  test('zero is not positive', () => {
    const result = schema.validate(0);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate(-5);
    expect(result.errors).toBe(customMsg);
  });
});

describe('negative', () => {
  const schema = ok.number().negative(customMsg);
  test('invalid', () => {
    const result = schema.validate(5);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(-5);
    expect(result.valid).toBe(true);
  });

  test('zero is not negative', () => {
    const result = schema.validate(0);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate(5);
    expect(result.errors).toBe(customMsg);
  });
});

describe('integer', () => {
  const schema = ok.number().integer(customMsg);
  test('invalid', () => {
    const result = schema.validate(372.21475815);
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate(15);
    expect(result.valid).toBe(true);
  });

  test('message', () => {
    const result = schema.validate(372.21475815);
    expect(result.errors).toBe(customMsg);
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
      expect(result.errors).toBe(minMsg);
    });

    test('integer fail', () => {
      const result = schema.validate(5.213);
      expect(result.errors).toBe(intMsg);
    });
  });

  describe('positive + less + more', () => {
    const schema = ok
      .number()
      .positive()
      .moreThan(5)
      .lessThan(10);

    test('valid', () => {
      const result = schema.validate(7);
      expect(result.valid).toBe(true);
    });

    test('invalid low', () => {
      const result = schema.validate(2);
      expect(result.valid).toBe(false);
    });

    test('invalid high', () => {
      const result = schema.validate(17);
      expect(result.valid).toBe(false);
    });
  });
});
