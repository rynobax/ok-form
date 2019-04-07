import ok from '../index';

describe.only('parsing', () => {
  const schema = ok.array(ok.number());
  test.each<[string, any, boolean]>([
    ['empty string', '   ', false],
    ['number', 5, false],
    ['string', '5', false],
    ['true', true, false],
    ['false', false, false],
    ['object', {}, false],
    ['array', [5], true],
    ['null', null, false],
  ])('%s', (_, value, valid) => {
    const result = schema.validate(value);
    expect(result.valid).toBe(valid);
  });
});

test('custom message', () => {
  const customMsg = 'custom array err msg';
  const schema = ok.array(ok.number());
  const result = schema.validate('yo');
  expect(result.error).toBe(customMsg);
});

describe('simple', () => {
  const schema = ok.array(ok.number());

  test('invalid', () => {
    const result = schema.validate({
      num: null,
    });
    expect(result.valid).toBe(false);
  });

  test('valid', () => {
    const result = schema.validate({
      num: 5,
    });
    expect(result.valid).toBe(true);
  });
});
