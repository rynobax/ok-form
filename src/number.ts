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
  public constructor(msg?: string) {
    super(msg || 'Must be a number');
    this.transform(parseNumber);
    this.tests.push(v => {
      if (typeof v !== 'number' || Number.isNaN(v))
        return msg || 'Must be a number';
      return;
    });
  }

  // If the predicate returns true, the test passes, and the value is ok
  // if it returns false, the error message will be returned
  private addTest = (predicate: (v: number) => boolean, msg: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const testFn = (val: Input) => (predicate(val as any) ? null : msg);
    this.tests.push(testFn);
  };

  public validate(input: Input) {
    // Generic validation
    return super.validate(input);
  }

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
