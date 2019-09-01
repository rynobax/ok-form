import ok from '../index';

describe('messages', () => {
  const customParsingMsg = 'Must be a number!!!';
  const customRequiredMsg = 'Field is required!!!';
  const schema = ok.number(customParsingMsg).required(customRequiredMsg);

  test('parsing message', () => {
    const result = schema.validate('&*^#');
    expect(result.errors).toEqual(customParsingMsg);
  });

  test('empty string message', () => {
    const result = schema.validate('');
    expect(result.errors).toEqual(customRequiredMsg);
  });

  test('null message', () => {
    const result = schema.validate(null);
    expect(result.errors).toEqual(customRequiredMsg);
  });

  test('undefined message', () => {
    const result = schema.validate(undefined);
    expect(result.errors).toEqual(customRequiredMsg);
  });
});
