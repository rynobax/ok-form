import OKAny, { Result } from './any';

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

  private setContext(input: Input, ndx: number) {
    // If input in null return immediately
    if (!input) return;
    this.shape.__parent = (input as unknown) as Parent;
    // If this already has a root, pass in that one
    this.shape.__root = this.__root || ((input as unknown) as Root);
    this.shape.__path = this.__path.concat(String(ndx));
  }

  public validate(input: Input): Result {
    // Generic validation
    const superRes = super.validate(input);
    if (!superRes.valid) return superRes;

    const errors = ((input as unknown) as any[]).map((el, ndx) => {
      this.setContext(input, ndx);
      return this.shape.validate(el);
    });

    const foundError = errors.some(e => !e.valid);
    // typescript cannot comprehend that they are all of the same type
    if (foundError) return this.error(errors.map(e => e.errors) as any[]);

    return this.success();
  }

  public async validateAsync(input: Input): Promise<Result> {
    // Generic validation
    const superRes = await super.validateAsync(input);
    if (!superRes.valid) return superRes;

    const errors = await Promise.all(
      ((input as unknown) as any[]).map((el, ndx) => {
        this.setContext(input, ndx);
        return this.shape.validateAsync(el);
      })
    );

    const foundError = errors.some(e => !e.valid);
    // typescript cannot comprehend that they are all of the same type
    if (foundError) return this.error(errors.map(e => e.errors) as any[]);

    return this.success();
  }

  // Override cast behavior so that all elements get cast
  public cast(input: Input) {
    // If we are trying to cast something that is not an array give up
    if (!Array.isArray(input)) {
      return input;
    }
    return (input.map(el => this.shape.cast(el)) as unknown) as Input;
  }

  /**
   * Verify that the array is an exact length
   * @param len required length of array
   * @param msg error message if test fails
   */
  public length(len: number, msg?: string) {
    this.addTest(v => v.length === len, msg || `Must have length ${len}`);
    return this;
  }

  /**
   * Verify that the array is at least a certain length
   * @param min the minimum valid length
   * @param msg error message if test fails
   */
  public min(min: number, msg?: string) {
    this.addTest(
      v => v.length >= min,
      msg || `Must have length greater than or equal to ${min}`
    );
    return this;
  }

  /**
   * Verify that the array is at most a certain length
   * @param max the maximum valid length
   * @param msg error message if test fails
   */
  public max(max: number, msg?: string) {
    this.addTest(
      v => v.length <= max,
      msg || `Must have length less than or equal to ${max}`
    );
    return this;
  }
}

export default OKArray;
