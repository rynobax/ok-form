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

class OKAny<Input = unknown, Parent = unknown, Root = unknown> {
  private isRequired = false;
  private requiredMsg = 'Required';
  protected validationMsg = 'Invalid';
  private tests: TestFn<Input, Parent, Root>[] = [];

  public __parent: Parent | undefined;
  public __root: Root | undefined;

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

  public required(msg?: string) {
    this.isRequired = true;
    if (msg) this.requiredMsg = msg;
    return this;
  }

  public test(testFn: TestFn<Input, Parent, Root>): OKAny<Input, Parent, Root> {
    this.tests.push(testFn);
    return this;
  }

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

    const parent = this.__parent as Parent;
    const root = this.__root as Root;
    for (const testFn of this.tests) {
      const res = testFn(value, { parent, root });
      if (res instanceof OKAny) return res.validate(value);
      else if (typeof res === 'string') return this.error(res);
    }

    return this.success();
  }
}

export default OKAny;
