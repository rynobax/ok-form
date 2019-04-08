import OKAny, { ValidationError, Result } from './any';
import { ValidationRuntimeError } from './errors';

export interface Shape<Input> {
  [key: string]: OKAny<Input>;
}

interface UnknownObj {
  [key: string]: unknown;
}

function isObject(v: unknown) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

class OKObject<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private shape: Shape<Input>;
  private parseErrorMsg = 'Must be an object';

  public constructor(shape: Shape<Input>, msg?: string) {
    super();
    this.shape = shape;
    if (msg) this.parseErrorMsg = msg;
    this.addTest(isObject, this.parseErrorMsg);
  }

  private addTest = this.makeAddTest<{}>();

  // Returns list of shape, with child OK's populated with parent + root
  private iterateShape(input: Input) {
    // If input in null return immediately
    if (!input) return [];
    return Object.keys(this.shape).map(key => {
      const ok = this.shape[key];
      const val: any = (input as UnknownObj)[key];
      return { ok, val, key };
    });
  }

  private setContext(input: Input) {
    // If input in null return immediately
    if (!input) return;
    Object.keys(this.shape).forEach(key => {
      const ok = this.shape[key];
      ok.__parent = (input as unknown) as Parent;
      // If this already has a root, pass in that one
      ok.__root = this.__root || ((input as unknown) as Root);
      ok.__path = this.__path.concat(key);
    });
  }

  /* Call after schema is defined */

  public validate(input: Input): Result {
    this.setContext(input);

    // Generic validation
    const superRes = super.validate(input);
    if (!superRes.valid) return superRes;

    // Each key
    let foundError = false;
    const error: ValidationError = {};
    for (const { ok, val, key } of this.iterateShape(input)) {
      const res = ok.validate(val);
      if (!res.valid) {
        foundError = true;
        error[key] = res.error;
      }
    }

    if (foundError) return this.error(error);

    return this.success();
  }

  public async validateAsync(input: Input): Promise<Result> {
    this.setContext(input);

    // Generic validation
    const superRes = await super.validateAsync(input);
    if (!superRes.valid) return superRes;

    // Each key
    let foundError = false;
    const error: ValidationError = {};
    await Promise.all(
      this.iterateShape(input).map(async ({ ok, val, key }) => {
        const res = await ok.validateAsync(val);
        if (!res.valid) {
          foundError = true;
          error[key] = res.error;
        }
      })
    );

    if (foundError) return this.error(error);

    return this.success();
  }

  // Override cast behavior so that children get cast
  public cast(input: Input) {
    // If we are trying to cast something that is not an object give up
    if (!isObject(input)) {
      throw new ValidationRuntimeError({
        message: this.parseErrorMsg,
        originalError: new Error(`Cannot cast ${typeof input} to object`),
      });
    }
    const newInput: UnknownObj = {};
    for (const { ok, val, key } of this.iterateShape(input)) {
      newInput[key] = ok.cast(val);
    }
    const context = this.getContext();
    return this.transforms.reduce(
      (prevValue, fn) => fn(prevValue, context),
      newInput as Input
    );
  }
}

export default OKObject;
