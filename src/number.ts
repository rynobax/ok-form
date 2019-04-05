import OKAny from './any';

const parseNumber = (val: unknown) => {
  if (typeof val === 'string') {
    const isEmpty = val.trim() === '';
    if (isEmpty) return NaN;
    else return Number(val);
  }
  if (typeof val === 'number') return val;
  return NaN;
};

class OKNumber extends OKAny {
  private mins: { min: number; msg: string }[] = [];
  private shouldBeInt = false;
  private shouldBeIntMsg = 'Must be an integer';

  public constructor(msg?: string) {
    super(msg || 'Must be a number');
  }

  public validate(input: unknown) {
    // Parent validation
    const superRes = super.validate(input);
    if (!superRes.valid) return superRes;

    // Parsing
    const val = parseNumber(input);
    if (Number.isNaN(val)) return this.error(this.validationMsg);

    // min
    for (const { min, msg } of this.mins) {
      if (val < min) return this.error(msg);
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

  public integer(msg?: string) {
    this.shouldBeInt = true;
    if (msg) this.shouldBeIntMsg = msg;
    return this;
  }
}

export default OKNumber;
