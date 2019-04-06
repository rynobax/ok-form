import OKAny, { ValidationError } from './any';

export interface Shape {
  [key: string]: OKAny;
}

interface UnknownObj {
  [key: string]: unknown;
}

class OKNumber extends OKAny {
  private shape: Shape;

  public constructor(shape: Shape, msg?: string) {
    super(msg || 'Must be an object');
    this.shape = shape;
  }

  public validate(input: unknown) {
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
      const val = (input as UnknownObj)[key];

      ok.__parent = input;
      // If this already has a root, pass in that one
      ok.__root = this.__root || input;

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

export default OKNumber;
