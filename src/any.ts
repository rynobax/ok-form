interface ValidationErrorObject {
  [key: string]: ValidationError;
}

export type ValidationError = string | ValidationErrorObject;

interface ResultValid {
  valid: true;
  error: null;
}

interface ResultInvalidPrimitive {
  valid: false;
  error: string;
}

interface ResultInvalidObject {
  valid: false;
  error: ValidationErrorObject;
}

type ResultInvalid = ResultInvalidPrimitive | ResultInvalidObject;

type Result = ResultValid | ResultInvalid;

interface TestContext<Parent, Root> {
  parent: Parent;
  root: Root;
}

type TestFn<Input, Parent, Root> = (
  val: Input,
  context: TestContext<Parent, Root>
) => OKAny | string | false | null | undefined | void;

interface Test<Input, Parent, Root> {
  testFn: TestFn<Input, Parent, Root>;
  skipIfNull?: boolean;
}

export type TransformFn<Input, Parent, Root> = (
  val: Input,
  context: TestContext<Parent, Root>
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
any;

function checkNullish(value: unknown) {
  // null, undefined, empty string all considered nullish
  return value === null || value === undefined || (value as string) === '';
}

class OKAny<Input = unknown, Parent = unknown, Root = unknown> {
  /* Instance keeping track of stuff */
  private isNullable = false;
  private requiredMessage = 'Required';

  protected tests: Test<Input, Parent, Root>[] = [];

  protected transforms: TransformFn<Input, Parent, Root>[] = [];

  public __parent: Parent | undefined;
  public __root: Root | undefined;
  protected getContext(): TestContext<Parent, Root> {
    const parent = this.__parent as Parent;
    const root = this.__root as Root;
    return { parent, root };
  }

  // No validation message, because any excepts anything!
  public constructor() {}

  protected error(msg: string): ResultInvalidPrimitive;
  protected error(msg: ValidationErrorObject): ResultInvalidObject;
  protected error(msg: string | ValidationErrorObject) {
    return { valid: false, error: msg };
  }

  protected success(): ResultValid {
    return { valid: true, error: null };
  }

  /**
   * Build schema
   */

  public nullable() {
    this.isNullable = true;
    return this;
  }

  public transform(transformFn: TransformFn<Input, Parent, Root>) {
    this.transforms.push(transformFn);
    return this;
  }

  public test(testFn: TestFn<Input, Parent, Root>): OKAny<Input, Parent, Root> {
    this.tests.push({ testFn });
    return this;
  }

  /**
   * @param msg Error message if field is empty (empty string, null, undefined)
   */
  public required(msg?: string) {
    if (msg) {
      this.requiredMessage = msg;
    }
    return this;
  }

  /**
   * Call after schema is defined
   */

  public cast(input: Input) {
    const context = this.getContext();
    return this.transforms.reduce(
      (prevValue, fn) => fn(prevValue, context),
      input
    );
  }

  public validate(input: Input): Result {
    const value = this.cast(input);

    const isNullish = checkNullish(value);
    if (isNullish && !this.isNullable) {
      return this.error(this.requiredMessage);
    }

    const context = this.getContext();
    for (const { testFn, skipIfNull } of this.tests) {
      if (isNullish && skipIfNull) {
        continue;
      }
      const res = testFn(value, context);
      if (res instanceof OKAny) return res.validate(value);
      else if (typeof res === 'string') return this.error(res);
    }

    return this.success();
  }
}

export default OKAny;
