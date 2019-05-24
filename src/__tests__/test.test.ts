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
    expect(result.errors).toBe(customMsg);
  });
});

describe('short circuit', () => {
  test('empty string returned is converted to null', () => {
    const schema = ok
      .string()
      .optional()
      .test(() => '' && ok.string());

    const result = schema.validate('hi');
    expect(result.errors).toBe(null);
  });

  test('false returned is converted to null', () => {
    const schema = ok
      .string()
      .optional()
      .test(() => false && ok.string());

    const result = schema.validate('hi');
    expect(result.errors).toBe(null);
  });

  test('undefined returned is converted to null', () => {
    const schema = ok
      .string()
      .optional()
      .test(() => undefined && ok.string());

    const result = schema.validate('hi');
    expect(result.errors).toBe(null);
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

describe('path', () => {
  // expect is broken inside cbs because expect error gets caught
  test('simple', () => {
    let p;
    ok.number()
      .test((v, { path }) => {
        p = path;
      })
      .validate(5);
    expect(p).toEqual([]);
  });

  test('object', () => {
    let p;
    ok.object({
      foo: ok.number().test((v, { path }) => {
        p = path;
      }),
    }).validate({ foo: 5 });
    expect(p).toEqual(['foo']);
  });

  test('array', () => {
    let p;
    ok.array(
      ok.number().test((v, { path }) => {
        if (v === 2) p = path;
      })
    ).validate([0, 1, 2]);
    expect(p).toEqual(['2']);
  });

  test('complex', () => {
    let p;
    ok.array(
      ok.object({
        foo: ok.object({
          bar: ok.array(
            ok.number().test((v, { path }) => {
              p = path;
            })
          ),
        }),
      })
    ).validate([{ foo: { bar: [1] } }]);
    expect(p).toEqual(['0', 'foo', 'bar', '0']);
  });
});
