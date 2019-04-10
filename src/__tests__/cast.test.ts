import ok from '../index';

describe('cast', () => {
  const schema = ok.number().transform(v => v * 10);
  test('works', () => {
    const result = schema.cast(5);
    expect(result).toEqual(50);
  });
});

describe('multiple transforms', () => {
  const schema = ok
    .number()
    .transform(v => v + 5)
    .transform(v => v * 10);
  test('works', () => {
    const result = schema.cast(5);
    expect(result).toEqual(100);
  });
});

describe('object transforms', () => {
  test('works', () => {
    const schema = ok.object({
      double: ok.number().transform(v => v * 2),
      string: ok.number(),
    });
    const result = schema.cast({ double: 5, string: '8' });
    expect(result).toEqual({ double: 10, string: 8 });
  });

  test('nested', () => {
    const schema = ok.object({
      double: ok.number().transform(v => v * 2),
      nested: ok.object({
        triple: ok.number().transform(v => v * 3),
      }),
    });
    const result = schema.cast({ double: 5, nested: { triple: 5 } });
    expect(result).toEqual({ double: 10, nested: { triple: 15 } });
  });
});

describe('casting nonsense', () => {
  test('object', () => {
    const schema = ok.object({
      double: ok.number().transform(v => v * 2),
      string: ok.number(),
    });
    expect(schema.cast('lol')).toEqual('lol');
  });

  test('nestedobject', () => {
    const schema = ok.object({
      foo: ok.object({
        double: ok.number().transform(v => v * 2),
        string: ok.number(),
      }),
    });
    expect(schema.cast({ foo: 'lol' })).toEqual({ foo: 'lol' });
  });

  test('number', () => {
    const schema = ok.number();
    const result = schema.cast('#$&*#&$');
    expect(result).toEqual(NaN);
  });
});
