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

interface TestContext {
  parent: unknown;
  root: unknown;
}

type TestFn = (
  val: unknown,
  context: TestContext
) => string | false | null | undefined | void;

class OKAny {
  private isRequired = false;
  private requiredMsg = 'Required';
  protected validationMsg = 'Invalid';
  private tests: TestFn[] = [];

  public __parent: unknown;
  public __root: unknown;

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

  public test(testFn: TestFn): OKAny {
    this.tests.push(testFn);
    return this;
  }

  public validate(value: unknown): Result {
    if (this.isRequired) {
      // TODO: I don't think this is good
      // probably just dont check at all
      if (value === null || value === undefined || value === '')
        return this.error(this.requiredMsg);
    }

    const parent = this.__parent;
    const root = this.__root;
    for (const testFn of this.tests) {
      const msg = testFn(value, { parent, root });
      if (msg) return this.error(msg);
    }

    return this.success();
  }
}

export default OKAny;
