import { ValidationRuntimeError } from './errors';

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
  validationError: ValidationRuntimeError;
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

export type TransformFn<Input, Parent, Root> = (
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

  // No validation message, because any excepts anything!
  public constructor() {}

  /* Internal */

  protected error(
    msg: string,
    validationError?: ValidationRuntimeError
  ): ResultInvalidPrimitive;
  protected error(
    msg: ValidationErrorObject,
    validationError?: ValidationRuntimeError
  ): ResultInvalidObject;
  protected error(
    msg: (string | null)[],
    validationError?: ValidationRuntimeError
  ): ResultInvalidObject;
  protected error(
    msg: (ValidationErrorObject | null)[],
    validationError?: ValidationRuntimeError
  ): ResultInvalidObject;
  protected error(
    msg:
      | string
      | ValidationErrorObject
      | (string | null)[]
      | (ValidationErrorObject | null)[],
    validationError?: ValidationRuntimeError
  ) {
    return {
      valid: false,
      error: msg,
      validationError: validationError || null,
    };
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
   * Build schema
   */

  public optional() {
    this.isOptional = true;
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

  private handleValidationError(err: any) {
    // An error thrown by use (ex: impossible cast request)
    if (err instanceof ValidationRuntimeError) {
      return this.error(err.message, err);
    } else if (err && err.message) {
      // Unknown error
      const runtimeError = new ValidationRuntimeError({
        message: err.message,
        originalError: err,
      });
      return this.error('Invalid', runtimeError);
    } else {
      // Non error was thrown
      const runtimeError = new ValidationRuntimeError({
        message: 'Error',
        originalError: err,
      });
      return this.error('Invalid', runtimeError);
    }
  }

  public validate(input: Input): Result {
    try {
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
    } catch (err) {
      return this.handleValidationError(err);
    }
  }

  public async validateAsync(input: Input): Promise<Result> {
    try {
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
    } catch (err) {
      return this.handleValidationError(err);
    }
  }
}

export default OKAny;
