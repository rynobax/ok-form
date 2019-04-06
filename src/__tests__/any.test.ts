import ok from '../index';

describe('any', () => {
  describe('nonNullable by default', () => {
    const customMsg = 'This field is required!!!';
    const schema = ok.any().required(customMsg);

    test('null', () => {
      const result = schema.validate(null);
      expect(result.valid).toBe(false);
    });

    test('undefined', () => {
      const result = schema.validate(undefined);
      expect(result.valid).toBe(false);
    });

    test('empty string', () => {
      const result = schema.validate('');
      expect(result.valid).toBe(false);
    });

    test('string', () => {
      const result = schema.validate('woah');
      expect(result.valid).toBe(true);
    });
  });

  describe('nullable', () => {
    const schema = ok.any().nullable();

    test('null', () => {
      const result = schema.validate(null);
      expect(result.valid).toBe(true);
    });

    test('undefined', () => {
      const result = schema.validate(undefined);
      expect(result.valid).toBe(true);
    });

    test('empty string', () => {
      const result = schema.validate('');
      expect(result.valid).toBe(true);
    });
  });
});

describe('messages', () => {
  const customParsingMsg = 'Must be a number!!!';
  const customRequiredMsg = 'Field is required!!!';
  const schema = ok.number(customParsingMsg).required(customRequiredMsg);

  test('parsing message', () => {
    const result = schema.validate('&*^#');
    expect(result.error).toEqual(customParsingMsg);
  });

  test('empty string message', () => {
    const result = schema.validate('');
    expect(result.error).toEqual(customRequiredMsg);
  });

  test('null message', () => {
    const result = schema.validate(null);
    expect(result.error).toEqual(customRequiredMsg);
  });

  test('undefined message', () => {
    const result = schema.validate(undefined);
    expect(result.error).toEqual(customRequiredMsg);
  });
});
