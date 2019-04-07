import ok from '../index';

describe('primitive', () => {
  const customMsg = 'Must not be 0';
  const schema = ok.any().test(v => {
    if (v === 0) return customMsg;
    return;
  });

  test('valid', () => {
    const result = schema.validate(42);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate(0);
    expect(result.valid).toBe(false);
  });

  test('message', () => {
    const result = schema.validate(0);
    expect(result.error).toBe(customMsg);
  });
});

describe('object', () => {
  const schema = ok.object({
    even: ok.number().test((v: any) => v % 2 !== 0 && 'Must be even'),
    odd: ok.number().test((v: any) => v % 2 === 0 && 'Must be odd'),
  });

  test('valid', () => {
    const result = schema.validate({
      even: 2,
      odd: 3,
    });
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate({
      even: 3,
      odd: 2,
    });
    expect(result.valid).toBe(false);
  });
});

describe('parent simple ', () => {
  const schema = ok.object({
    foo: ok.number(),
    bar: ok
      .number()
      .test(
        (v, { parent }) => v === (parent as any).foo && 'Bar cannot equal foo'
      ),
  });

  test('valid', () => {
    const result = schema.validate({
      foo: 1,
      bar: 2,
    });
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate({
      foo: 1,
      bar: 1,
    });
    expect(result.valid).toBe(false);
  });
});

describe('parent deeply nested', () => {
  const schema = ok.object({
    nested: ok.object({
      deeply: ok.object({
        foo: ok.number(),
        bar: ok
          .number()
          .test(
            (v, { parent }) =>
              v === (parent as any).foo && 'Bar cannot equal foo'
          ),
      }),
    }),
  });

  test('valid', () => {
    const result = schema.validate({
      nested: {
        deeply: {
          foo: 1,
          bar: 2,
        },
      },
    });
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate({
      nested: {
        deeply: {
          foo: 1,
          bar: 1,
        },
      },
    });
    expect(result.valid).toBe(false);
  });
});

describe('parent array', () => {
  const schema = ok.array(
    ok.number().test((v, { parent }) => {
      if (parent.every(e => e === v)) return 'one must be different';
    })
  );

  test('valid', () => {
    const result = schema.validate([1, 2, 3]);
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate([1, 1, 1]);
    expect(result.valid).toBe(false);
  });
});

describe('root', () => {
  const schema = ok.object({
    foo: ok.number(),
    nested: ok.object({
      deeply: ok.object({
        bar: ok
          .number()
          .test(
            (v, { root }) => v === (root as any).foo && 'Bar cannot equal foo'
          ),
      }),
    }),
  });

  test('valid', () => {
    const result = schema.validate({
      foo: 1,
      nested: {
        deeply: {
          bar: 2,
        },
      },
    });
    expect(result.valid).toBe(true);
  });

  test('invalid', () => {
    const result = schema.validate({
      foo: 1,
      nested: {
        deeply: {
          bar: 1,
        },
      },
    });
    expect(result.valid).toBe(false);
  });
});

describe('tests that throws error', () => {
  test.todo('number');
  test.todo('object');
});
