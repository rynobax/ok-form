export interface ValidationErrorObject {
  [key: string]: ValidationError;
}

export type ValidationError = string | ValidationErrorObject;

interface ResultValid {
  valid: true;
  error: null;
  validationError: null;
}

interface ResultInvalidBase {
  valid: false;
}

interface ResultInvalidPrimitive extends ResultInvalidBase {
  error: string;
}

interface ResultInvalidObject extends ResultInvalidBase {
  error: ValidationErrorObject;
}

type ResultInvalid = ResultInvalidPrimitive | ResultInvalidObject;

export type Result = ResultValid | ResultInvalid;

interface TestContext<Parent, Root> {
  parent: Parent;
  root: Root;
  path: string[];
}

type TestFnResult = OKAny | string | false | null | undefined | void;

type SyncTestFn<Input, Parent, Root> = (
  val: Input,
  context: TestContext<Parent, Root>
) => TestFnResult;

type AsyncTestFn<Input, Parent, Root> = (
  val: Input,
  context: TestContext<Parent, Root>
) => Promise<TestFnResult>;

type TestFn<Input, Parent, Root> =
  | SyncTestFn<Input, Parent, Root>
  | AsyncTestFn<Input, Parent, Root>;

interface Test<Input, Parent, Root> {
  testFn: TestFn<Input, Parent, Root>;
  skipIfNull?: boolean;
}

type TransformFn<Input, Parent, Root> = (
  val: Input,
  context: TestContext<Parent, Root>
) => any;

function checkNullish(value: unknown) {
  // null, undefined, empty string all considered nullish
  return value === null || value === undefined || (value as string) === '';
}

function isString(val: any): val is string {
  return typeof val === 'string';
}

class OKAny<Input = unknown, Parent = unknown, Root = unknown> {
  /* Instance keeping track of stuff */
  private isOptional = false;
  private requiredMessage = 'Required';

  protected tests: Test<Input, Parent, Root>[] = [];

  protected transforms: TransformFn<Input, Parent, Root>[] = [];

  // @internal
  public __parent: Parent | undefined;
  // @internal
  public __root: Root | undefined;
  // @internal
  public __path: string[] = [];

  public constructor() {}

  /* Internal */

  protected error(msg: string): ResultInvalidPrimitive;
  protected error(msg: ValidationErrorObject): ResultInvalidObject;
  protected error(msg: (string | null)[]): ResultInvalidObject;
  protected error(msg: (ValidationErrorObject | null)[]): ResultInvalidObject;
  protected error(
    msg:
      | string
      | ValidationErrorObject
      | (string | null)[]
      | (ValidationErrorObject | null)[]
  ) {
    return { valid: false, error: msg };
  }

  protected success(): ResultValid {
    return { valid: true, error: null, validationError: null };
  }

  protected getContext(): TestContext<Parent, Root> {
    const parent = this.__parent as Parent;
    const root = this.__root as Root;
    const path = this.__path;
    return { parent, root, path };
  }

  // If the predicate returns true, the test passes, and the value is ok
  // if it returns false, the error message will be returned
  // These tests will be skipped if the value is null and field is marked
  // optional, because it doesn't make sense to apply them to a null value
  protected makeAddTest = <T = unknown>() => (
    predicate: (v: T) => boolean,
    msg: string
  ) => {
    const testFn = (val: Input) => (predicate(val as any) ? null : msg);
    this.tests.push({ testFn, skipIfNull: true });
  };

  /**
   * Mark schema as optional, meaning that empty string, null, and undefined
   * are valid values
   */
  public optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Add a tranformation to the schema.  The transformation will be run before
   * any of the tests
   * @param transformFn A function that returns the updated value
   */
  public transform(transformFn: TransformFn<Input, Parent, Root>) {
    this.transforms.push(transformFn);
    return this;
  }

  /**
   * Add an arbitrary test to the schema
   * @param testFn A function which will be passed the current value, and
   * should return an error message string if there is an error.  If a schema
   * is returned, it will be executed and the result used.
   */
  public test(testFn: TestFn<Input, Parent, Root>): OKAny<Input, Parent, Root> {
    this.tests.push({ testFn });
    return this;
  }

  /**
   * Fields are considered required by default.  If you want to customize the
   * error message, you can use this method.
   * @param msg Error message if field is empty (empty string, null, undefined)
   */
  public required(msg?: string) {
    if (msg) {
      this.requiredMessage = msg;
    }
    return this;
  }

  /**
   * Attempt to cast the input into the schema shape.  All transforms will be
   * run, and the result returned, or an error thrown.
   * @param input The object to be cast
   */
  public cast(input: Input) {
    const context = this.getContext();
    return this.transforms.reduce(
      (prevValue, fn) => fn(prevValue, context),
      input
    );
  }

  /**
   * Validate an object.  All transforms will be run, then all tests will
   * be run, and a result object will be returned.  If all the tests pass,
   * valid will be true, and error will be null.  If any test fails, valid
   * will be false, and error will contain the all the errors that occured.
   * @param input The object to be validated
   */
  public validate(input: Input): Result {
    const value = this.cast(input);

    const isNullish = checkNullish(value);
    if (isNullish && !this.isOptional) {
      return this.error(this.requiredMessage);
    }

    const context = this.getContext();
    for (const { testFn, skipIfNull } of this.tests) {
      if (isNullish && skipIfNull) {
        continue;
      }
      const res = testFn(value, context);
      if (res instanceof Promise)
        return this.error(
          'Cannot run async test in validate, use validateAsync'
        );
      else if (res instanceof OKAny) return res.validate(value);
      else if (isString(res)) return this.error(res);
    }

    return this.success();
  }

  /**
   * Validate an object asynchronously.  All transforms will be run, then all
   * tests will be run, and a promise for the result object will be returned.
   * If all the tests pass, valid will be true, and error will be null.  If
   * any test fails, valid will be false, and error will contain the all the
   * errors that occured.
   * @param input The object to be validated
   */
  public async validateAsync(input: Input): Promise<Result> {
    const value = this.cast(input);

    const isNullish = checkNullish(value);
    if (isNullish && !this.isOptional) {
      return this.error(this.requiredMessage);
    }

    const context = this.getContext();
    const testResults = await Promise.all(
      this.tests.map(async ({ testFn, skipIfNull }) => {
        if (isNullish && skipIfNull) {
          return null;
        }
        const res = await testFn(value, context);
        if (res instanceof OKAny)
          return res.validateAsync(value).then(r => r.error);
        else if (isString(res)) return res;
        else return null;
      })
    );
    const firstError = testResults.filter(isString)[0];
    if (firstError) return this.error(firstError);
    else return this.success();
  }
}

export default OKAny;
