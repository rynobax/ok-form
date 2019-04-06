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

export type TransformFn<Input, Parent, Root> = (
  val: Input,
  context: TestContext<Parent, Root>
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
any;

class OKAny<Input = unknown, Parent = unknown, Root = unknown> {
  /* Instance keeping track of stuff */
  private isRequired = false;
  private requiredMsg = 'Required';
  protected validationMsg = 'Invalid';
  private tests: TestFn<Input, Parent, Root>[] = [];
  protected transforms: TransformFn<Input, Parent, Root>[] = [];

  public __parent: Parent | undefined;
  public __root: Root | undefined;
  private getContext(): TestContext<Parent, Root> {
    const parent = this.__parent as Parent;
    const root = this.__root as Root;
    return { parent, root };
  }

  public constructor(msg?: string) {
    if (msg) this.validationMsg = msg;
  }

  protected error(msg: string): ResultInvalidPrimitive;
  protected error(msg: ValidationErrorObject): ResultInvalidObject;
  protected error(msg: string | ValidationErrorObject) {
    return { valid: false, error: msg };
  }

  protected success(): ResultValid {
    return { valid: true, error: null };
  }

  /* Build schema */

  public required(msg?: string) {
    this.isRequired = true;
    if (msg) this.requiredMsg = msg;
    return this;
  }

  public transform(transformFn: TransformFn<Input, Parent, Root>) {
    this.transforms.push(transformFn);
    return this;
  }

  public test(testFn: TestFn<Input, Parent, Root>): OKAny<Input, Parent, Root> {
    this.tests.push(testFn);
    return this;
  }

  /* Call after schema is defined */

  public validate(value: Input): Result {
    // if something is required, the only bad values should be
    // null, undefined, empty string
    if (this.isRequired) {
      if (
        value === null ||
        value === undefined ||
        ((value as unknown) as string) === ''
      )
        return this.error(this.requiredMsg);
    }

    const context = this.getContext();
    for (const testFn of this.tests) {
      const res = testFn(value, context);
      if (res instanceof OKAny) return res.validate(value);
      else if (typeof res === 'string') return this.error(res);
    }

    return this.success();
  }

  public cast(value: Input) {
    const context = this.getContext();
    return this.transforms.reduce(
      (prevValue, fn) => fn(prevValue, context),
      value
    );
  }
}

export default OKAny;
