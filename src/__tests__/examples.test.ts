import ok from '../ok';

describe('sign up', () => {
  const schema = ok.object({
    first: ok.string().optional(),
    last: ok.string().optional(),
    email: ok.string().email('Invalid email'),
    password: ok.string().min(8, 'Password must be at least 8 characters!'),
    confirmPassword: ok.string().test((v, { parent }) => {
      if (v !== parent.password) return 'Passwords must match!';
    }),
  });

  test('valid', () => {
    const result = schema.validate({
      first: 'John',
      last: '',
      email: 'john@gmail.com',
      password: 'supersecret',
      confirmPassword: 'supersecret',
    });
    expect(result.valid).toBe(true);
    expect(result.error).toEqual(null);
  });

  test('invalid', () => {
    const result = schema.validate({
      first: 'John',
      last: '',
      email: 'not an email',
      password: 'short',
      confirmPassword: 'notsecret',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toEqual({
      email: 'Invalid email',
      password: 'Password must be at least 8 characters!',
      confirmPassword: 'Passwords must match!',
    });
  });
});

describe('sign up async', () => {
  const checkIsUsernameInUse = async (username: string) => {
    if (username === 'skywalker') return true;
    return false;
  };

  const schema = ok.object({
    username: ok
      .string()
      .min(5, 'Username must be at least 5 characters')
      .test(async v => {
        const isInUse = await checkIsUsernameInUse(v);
        if (isInUse) return 'Username already in use';
      }),
    password: ok.string().min(8, 'Password must be at least 8 characters!'),
  });

  test('valid', async () => {
    const result = await schema.validateAsync({
      username: 'vader',
      password: 'supersecret',
    });
    expect(result.valid).toBe(true);
    expect(result.error).toEqual(null);
  });

  test('invalid', async () => {
    const result = await schema.validateAsync({
      username: 'skywalker',
      password: 'supersecret',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toEqual({
      username: 'Username already in use',
    });
  });
});

describe('residents', () => {
  const schema = ok.object({
    building: ok.string(),
    residents: ok.array(
      ok.object({
        name: ok.string().required('Name is required!'),
        age: ok.number().test((age, { path, root }) => {
          const ndx = Number(path[1]);
          const isLast = root.residents.length - 1 === ndx;
          const isOldest = root.residents.every(r => r.age <= age);
          if (isLast && !isOldest) return 'Last resident must be the oldest!';
        }),
      })
    ),
  });

  test('valid', async () => {
    const result = await schema.validate({
      building: 'Apt A',
      residents: [
        { name: 'Alice', age: 12 },
        { name: 'Bob', age: 15 },
        { name: 'Claire', age: 32 },
      ],
    });
    expect(result.valid).toBe(true);
    expect(result.error).toEqual(null);
  });

  test('invalid', async () => {
    const result = await schema.validate({
      building: 'Apt A',
      residents: [
        { name: '', age: 12 },
        { name: 'Claire', age: 32 },
        { name: 'Bob', age: 15 },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.error).toEqual({
      residents: [
        { name: 'Name is required!' },
        null,
        { age: 'Last resident must be the oldest!' },
      ],
    });
  });
});
