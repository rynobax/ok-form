import ok from '../index';

describe('parsing', () => {
  const schema = ok.boolean();
  test.each<[string, any, boolean]>([
    ['empty string', '   ', false],
    ['number', 5, false],
    ['string', '5', false],
    ['true', true, true],
    ['false', false, true],
    ['object', {}, false],
    ['array', [5], false],
    ['null', null, false],
    ['true str', 'true', true],
    ['false str', 'false', true],
  ])('%s', (_, value, valid) => {
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });

  it('message', () => {
    const customMsg = 'Custom validation msg';
    const schema = ok.boolean(customMsg);
    const result = schema.validate('#^&#^');
    expect(result.error).toBe(customMsg);
  });

  describe('optional', () => {
    it('valid', () => {
      const schema = ok.boolean().optional();
      const result = schema.validate(null);
      expect(result.valid).toBe(true);
    });

    it('casting', () => {
      const schema = ok.boolean().optional();
      const result = schema.cast(null);
      expect(result).toBe(null);
    });
  });
});
