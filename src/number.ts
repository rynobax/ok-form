import OKAny, { TransformFn } from './any';

const parseNumber = (val: unknown) => {
  if (typeof val === 'string') {
    const isEmpty = val.trim() === '';
    if (isEmpty) return NaN;
    else return Number(val);
  }
  if (typeof val === 'number') return val;
  return NaN;
};

class OKNumber<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private mins: { min: number; msg: string }[] = [];
  private maxs: { max: number; msg: string }[] = [];
  private shouldBeInt = false;
  private shouldBeIntMsg = 'Must be an integer';

  public constructor(msg?: string) {
    super(msg || 'Must be a number');
    this.transform(parseNumber);
  }

  public validate(input: Input) {
    // Generic validation
    const val = super.cast(input);
    const genericValRes = super.validate(val);
    if (!genericValRes.valid) return genericValRes;

    // Parsing
    if (typeof val !== 'number' || Number.isNaN(val))
      return this.error(this.validationMsg);

    // min
    for (const { min, msg } of this.mins) {
      if (val < min) return this.error(msg);
    }

    // max
    for (const { max, msg } of this.maxs) {
      if (val > max) return this.error(msg);
    }

    // integer
    if (this.shouldBeInt && !Number.isInteger(val)) {
      return this.error(this.shouldBeIntMsg);
    }

    return this.success();
  }

  public min(min: number, msg?: string) {
    this.mins.push({
      min,
      msg: msg || `Must be greater than or equal to ${min}`,
    });
    return this;
  }

  public max(max: number, msg?: string) {
    this.maxs.push({
      max,
      msg: msg || `Must be less than or equal to ${max}`,
    });
    return this;
  }

  public integer(msg?: string) {
    this.shouldBeInt = true;
    if (msg) this.shouldBeIntMsg = msg;
    return this;
  }

  public transform(transformFn: TransformFn<Input, Parent, Root>) {
    this.transforms.push(transformFn);
    return this;
  }
}

export default OKNumber;
