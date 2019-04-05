import ok from '../index';

describe('any', () => {
  describe('required', () => {
    test('invalid', () => {
      const schema = ok.any().required();
      const result = schema.validate(null);
      expect(result.valid).toBe(false);
    });

    test('empty string', () => {
      const schema = ok.any().required();
      const result = schema.validate('');
      expect(result.valid).toBe(false);
    });

    test('string', () => {
      const schema = ok.any().required();
      const result = schema.validate('woah');
      expect(result.valid).toBe(true);
    });

    test('number', () => {
      const schema = ok.any().required();
      const result = schema.validate(42);
      expect(result.valid).toBe(true);
    });

    test('message', () => {
      const customMsg = 'This field is required!!!';
      const schema = ok.any().required(customMsg);
      const result = schema.validate(null);
      expect(result.error).toEqual(customMsg);
    });
  });

  describe('nullable', () => {
    test.todo('invalid');
    test.todo('valid');
  });

  describe('test', () => {
    test.todo('invalid');
    test.todo('valid');
  });
});
