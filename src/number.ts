import OKAny, { TransformFn } from './any';

const parseNumber = (val: unknown) => {
  if (typeof val === 'string') {
    // For strings, any string of spaces is considered empty
    const isEmpty = val.trim() === '';
    if (isEmpty) return null;
    // If it isn't empty, it is parsed with Number
    else return Number(val);
  }
  // Numbers, null, undefined are returned directly
  if (typeof val === 'number' || val === null || val === undefined) return val;
  // Everything else is considered not a number
  return NaN;
};

class OKNumber<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  public constructor(msg?: string) {
    super();
    this.transform(parseNumber);
    this.addTest(
      v => typeof v === 'number' && !Number.isNaN(v),
      msg || 'Must be a number'
    );
  }

  private addTest = this.makeAddTest<number>();

  public min(min: number, msg?: string) {
    this.addTest(
      v => v >= min,
      msg || `Must be greater than or equal to ${min}`
    );
    return this;
  }

  public max(max: number, msg?: string) {
    this.addTest(v => v <= max, msg || `Must be less than or equal to ${max}`);
    return this;
  }

  public integer(msg?: string) {
    this.addTest(v => Number.isInteger(v), msg || 'Must be an integer');
    return this;
  }

  public transform(transformFn: TransformFn<Input, Parent, Root>) {
    this.transforms.push(transformFn);
    return this;
  }
}

export default OKNumber;
