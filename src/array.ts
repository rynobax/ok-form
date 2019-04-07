import OKAny, { Result } from './any';
import { ValidationRuntimeError } from './errors';

class OKArray<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private shape: OKAny;
  private parseErrorMsg = 'Must be an array';

  public constructor(shape: OKAny, msg?: string) {
    super();
    this.shape = shape;
    if (msg) this.parseErrorMsg = msg;
    this.addTest(v => Array.isArray(v), this.parseErrorMsg);
  }

  private addTest = this.makeAddTest<unknown[]>();

  private setContext(input: Input) {
    // If input in null return immediately
    if (!input) return;
    this.shape.__parent = (input as unknown) as Parent;
    // If this already has a root, pass in that one
    this.shape.__root = this.__root || ((input as unknown) as Root);
  }

  /* Call after schema is defined */

  public validate(input: Input): Result {
    this.setContext(input);

    // Generic validation
    const superRes = super.validate(input);
    if (!superRes.valid) return superRes;

    const errors = ((input as unknown) as any[]).map(el => {
      return this.shape.validate(el);
    });

    const foundError = errors.some(e => !e.valid);
    // typescript cannot comprehend that they are all of the same type
    if (foundError) return this.error(errors.map(e => e.error) as any[]);

    return this.success();
  }

  // Override cast behavior so that all elements get cast
  public cast(input: Input) {
    // If we are trying to cast something that is not an array give up
    if (!Array.isArray(input)) {
      throw new ValidationRuntimeError({
        message: this.parseErrorMsg,
        originalError: new Error(`Cannot cast ${typeof input} to array`),
      });
    }
    return (input.map(el => this.shape.cast(el)) as unknown) as Input;
  }
}

export default OKArray;
