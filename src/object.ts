import OKAny, { ValidationError } from './any';

export interface Shape<InputShape> {
  [key: string]: OKAny<InputShape>;
}

interface UnknownObj {
  [key: string]: unknown;
}

class OKObject<InputShape = unknown> extends OKAny<InputShape> {
  private shape: Shape<InputShape>;

  public constructor(shape: Shape<InputShape>, msg?: string) {
    super(msg || 'Must be an object');
    this.shape = shape;
  }

  public validate(input: InputShape) {
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

export default OKObject;
