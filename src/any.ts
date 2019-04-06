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

type PredicateTestFn = (val: unknown) => boolean;
type MessageTestFn = (val: unknown) => string | null | undefined | void;
type TestFn = PredicateTestFn | MessageTestFn;

interface PredicateTest {
  testFn: PredicateTestFn;
  msg: string;
  type: 'pred';
}

interface MessageTest {
  testFn: MessageTestFn;
  type: 'msg';
}

class OKAny {
  private isRequired = false;
  private requiredMsg = 'Required';
  protected validationMsg = 'Invalid';

  private tests: (PredicateTest | MessageTest)[] = [];

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

  public test(testFn: PredicateTestFn, msg: string): OKAny;
  public test(testFn: MessageTestFn): OKAny;
  public test(testFn: TestFn, msg?: string): OKAny {
    if (msg) {
      this.tests.push({ testFn: testFn as PredicateTestFn, msg, type: 'pred' });
    } else {
      this.tests.push({ testFn: testFn as MessageTestFn, type: 'msg' });
    }
    return this;
  }

  public validate(value: unknown): Result {
    if (this.isRequired) {
      // TODO: I don't think this is good
      // probably just dont check at all
      if (value === null || value === undefined || value === '')
        return this.error(this.requiredMsg);
    }

    for (const test of this.tests) {
      if (test.type === 'pred') {
        const { testFn, msg } = test;
        const valid = testFn(value);
        if (!valid) return this.error(msg);
      } else {
        const { testFn } = test;
        const msg = testFn(value);
        if (msg) return this.error(msg);
      }
    }

    return this.success();
  }
}

export default OKAny;
