import ok from '../index';

describe('any', () => {
  describe('required', () => {
    const customMsg = 'This field is required!!!';
    const schema = ok.any().required(customMsg);

    test('invalid', () => {
      const result = schema.validate(null);
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

    test('number', () => {
      const result = schema.validate(42);
      expect(result.valid).toBe(true);
    });

    test('message', () => {
      const result = schema.validate(null);
      expect(result.error).toEqual(customMsg);
    });
  });

  describe('nullable', () => {
    test.todo('invalid');
    test.todo('valid');
  });
});
