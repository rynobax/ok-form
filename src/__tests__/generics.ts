/* This file should be manually inspected */

import ok from '../index';

describe('object generic', () => {
  interface Input {
    foo: string;
    bar: string;
  }

  const schema = ok.object<Input>({
    foo: ok.number(),
    bar: ok.number(),
  });

  /* Invalid */
  schema.validate({
    foo: 1,
    bar: true,
  });

  /* Valid */
  schema.validate({
    foo: '1',
    bar: '2',
  });
});
