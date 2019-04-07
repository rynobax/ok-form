import ok from '../ok';

describe('sign up', () => {
  const schema = ok.object({
    first: ok.string().optional(),
    last: ok.string().optional(),
    email: ok.string().email(),
    password: ok.string().min(8, 'Password must be at least 8 characters!'),
    confirmPassword: ok.string().test((v, { parent }) => {
      if (v !== parent.password) return 'Passwords do not match!';
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
});
