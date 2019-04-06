import ok from '../index';

describe('any', () => {
  describe('nonNullable by default', () => {
    const customMsg = 'This field is required!!!';
    const schema = ok.any(customMsg);

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

    test('message', () => {
      const result = schema.validate(null);
      expect(result.error).toEqual(customMsg);
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
