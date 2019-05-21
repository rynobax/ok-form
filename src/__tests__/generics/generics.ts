/* This file should be manually inspected */

import ok from '../../index';

describe('Can not use generics', () => {
  /* GOOD */
  const schema = ok.object({
    foo: ok.number(),
    bar: ok.number(),
  });
  schema.validate(null);
});

describe('input shape', () => {
  describe('simple', () => {
    interface Input {
      foo: string;
      bar: string;
    }

    const schema = ok.object<Input>({
      foo: ok.number(),
      bar: ok.number(),
    });

    /* GOOD */
    schema.validate({
      foo: '1',
      bar: '2',
    });

    /* BAD */
    schema.validate({
      foo: 1,
      bar: true,
    });

    /* BAD */
    schema.validate({
      foo: '1',
    });
  });

  describe('nested', () => {
    interface Input {
      foo: string;
      deep: {
        nesting: {
          bar: string;
        };
      };
    }

    const schema = ok.object<Input>({
      foo: ok.number(),
      deep: ok.object({
        nesting: ok.object({
          bar: ok.number(),
        }),
      }),
    });

    /* GOOD */
    schema.validate({
      foo: '1',
      deep: {
        nesting: {
          bar: '2',
        },
      },
    });

    /* BAD */
    schema.validate({
      foo: 1,
      deep: {
        nesting: {
          bar: false,
        },
      },
    });
  });
});

describe('parent shape', () => {
  interface Nesting {
    bar: string;
  }

  interface Input {
    foo: string;
    nesting: Nesting;
  }

  /* GOOD */
  ok.object<unknown, Input>({
    foo: ok.number<string, Input>().test((v, ctx) => {
      v === '5';
      ctx.parent.nesting.bar === '5';
    }),
    nesting: ok.object({
      bar: ok.number(),
    }),
  });

  /* BAD */
  ok.object<unknown, Input>({
    foo: ok.number<string, Input>().test((v, ctx) => {
      v === 5;
      ctx.parent.nesting.bar === 5;
    }),
    nesting: ok.object({
      bar: ok.number(),
    }),
  });
});

describe('root shape', () => {
  interface Nesting {
    bar: string;
  }

  interface Input {
    foo: string;
    nesting: Nesting;
  }

  /* GOOD */
  ok.object<unknown, Input, Input>({
    foo: ok.number(),
    nesting: ok.object({
      bar: ok.number<string, Nesting, Input>().test((v, { parent, root }) => {
        v === '5';
        parent.bar === '5';
        root.foo === '5';
      }),
    }),
  });

  /* BAD */
  ok.object<unknown, Input, Input>({
    foo: ok.number(),
    nesting: ok.object({
      bar: ok.number<string, Nesting, Input>().test((v, { parent, root }) => {
        v === 5;
        parent.bar === 5;
        root.foo === 5;
      }),
    }),
  });
});

describe('schema shape', () => {
  interface Input {
    foo: string;
    bar: string;
  }

  /* GOOD */
  ok.object<Input>({
    foo: ok.number(),
    bar: ok.number(),
  });

  /* BAD */
  ok.object<Input>({
    foo: ok.number(),
    bar: ok.number(),
    qux: ok.number(),
  });

  /* BAD */
  ok.object<Input>({
    foo: ok.number(),
  });
});

describe('validate can be passed to fn expecting object (formik)', () => {
  interface Input {
    foo: string;
    bar: string;
  }

  const schema = ok.object<Input>({
    foo: ok.number(),
    bar: ok.number(),
  });

  const val = {
    foo: '',
    bar: '',
  };

  function acceptsObject(str: {}) {
    str;
  }

  /* GOOD */
  acceptsObject(schema.validate(val).errors);
});
