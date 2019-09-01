import ok from '../index';

describe('not optional by default', () => {
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

describe('optional', () => {
  const schema = ok.any().optional();

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

describe('uses last', () => {
  test('required -> optional', () => {
    const schema = ok
      .any()
      .required()
      .optional();
    const result = schema.validate(null);
    expect(result.valid).toBe(true);
  });

  test('optional -> required', () => {
    const schema = ok
      .any()
      .optional()
      .required();
    const result = schema.validate(null);
    expect(result.valid).toBe(false);
  });

  test('optional -> required -> optional', () => {
    const schema = ok
      .any()
      .optional()
      .required()
      .optional();
    const result = schema.validate(null);
    expect(result.valid).toBe(true);
  });

  test('required -> optional -> required', () => {
    const schema = ok
      .any()
      .required()
      .optional()
      .required();
    const result = schema.validate(null);
    expect(result.valid).toBe(false);
  });

  describe('conditional', () => {
    const schema = ok.object({
      required: ok.boolean(),
      value: ok
        .any()
        .optional()
        .test((_, { parent }) =>
          parent.required ? ok.any().required() : ok.any().optional()
        ),
    });

    test('required', () => {
      const result = schema.validate({ required: true, value: null });
      expect(result.valid).toBe(false);
    });

    test('not required', () => {
      const result = schema.validate({ required: false, value: null });
      expect(result.valid).toBe(true);
    });
  });
});
