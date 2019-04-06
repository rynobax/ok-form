import OKAny, { ValidationError } from './any';

export interface Shape<Input> {
  [key: string]: OKAny<Input>;
}

interface UnknownObj {
  [key: string]: unknown;
}

class OKObject<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private shape: Shape<Input>;

  public constructor(shape: Shape<Input>, msg?: string) {
    super(msg || 'Must be an object');
    this.shape = shape;
  }

  public validate(input: Input) {
    // Parent validation
    const superRes = super.validate(input);
    if (!superRes.valid) return superRes;

    // Parsing
    if (typeof input !== 'object' || input === null || Array.isArray(input))
      return this.error(this.validationMsg);

    // Each key
    let foundError = false;
    const error: ValidationError = {};
    for (const [key, ok] of Object.entries(this.shape)) {
      const val: any = (input as UnknownObj)[key];

      ok.__parent = (input as unknown) as Parent;
      // If this already has a root, pass in that one
      ok.__root = this.__root || ((input as unknown) as Root);

      const res = ok.validate(val);
      if (!res.valid) {
        foundError = true;
        error[key] = res.error;
      }
    }

    if (foundError) return this.error(error);

    return this.success();
  }
}

export default OKObject;
