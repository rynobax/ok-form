import ok from '../index';

const wait = () => new Promise(r => setTimeout(() => r(), 25));

const asyncTest = async (v: any) => {
  await wait();
  if (v === 0) return 'Cannot be zero!';
};

describe('simple', () => {
  const schema = ok
    .number()
    .max(50)
    .test(asyncTest);

  test('valid', async () => {
    const result = await schema.validateAsync(1);
    expect(result.valid).toBe(true);
  });

  test('invalid', async () => {
    const result = await schema.validateAsync(0);
    expect(result.valid).toBe(false);
  });
});

describe('validate sync with async test errors', () => {
  const errMsg = 'Cannot run async test in validate, use validateAsync';

  test('simple', async () => {
    const schema = ok
      .number()
      .max(50)
      .test(asyncTest);
    const result = await schema.validate(1);
    expect(result.error).toEqual(errMsg);
  });

  test('object', async () => {
    const schema = ok.object({
      foo: ok
        .number()
        .max(50)
        .test(asyncTest),
    });
    const result = await schema.validate({ foo: 1 });
    expect(result.error).toEqual({
      foo: errMsg,
    });
  });

  test('array', async () => {
    const schema = ok.array(
      ok
        .number()
        .max(50)
        .test(asyncTest)
    );
    const result = await schema.validate([1, 1]);
    expect(result.error).toEqual([errMsg, errMsg]);
  });
});

describe('object', () => {
  const schema = ok.object({
    foo: ok
      .number()
      .max(50)
      .test(asyncTest),
  });

  test('valid', async () => {
    const result = await schema.validateAsync({ foo: 1 });
    expect(result.valid).toBe(true);
  });

  test('invalid', async () => {
    const result = await schema.validateAsync({ foo: 0 });
    expect(result.valid).toBe(false);
  });
});

describe('array', () => {
  const schema = ok.array(
    ok
      .number()
      .max(50)
      .test(asyncTest)
  );

  test('valid', async () => {
    const result = await schema.validateAsync([1, 1, 1]);
    expect(result.valid).toBe(true);
  });

  test('invalid', async () => {
    const result = await schema.validateAsync([1, 0, 1]);
    expect(result.valid).toBe(false);
  });
});

describe('complex', () => {
  const schema = ok.array(
    ok.object({
      foo: ok.array(
        ok.object({
          bar: ok
            .number()
            .max(50)
            .test(asyncTest),
        })
      ),
    })
  );

  test('valid', async () => {
    const result = await schema.validateAsync([{ foo: [{ bar: 1 }] }]);
    expect(result.valid).toBe(true);
  });

  test('invalid', async () => {
    const result = await schema.validateAsync([{ foo: [{ bar: 0 }] }]);
    expect(result.valid).toBe(false);
  });
});
