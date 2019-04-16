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
  public constructor(
    msg?: string,
    transform?: TransformFn<Input, Parent, Root>
  ) {
    super();
    if (transform) {
      this.transform(transform);
    } else {
      this.transform(parseNumber);
    }
    this.addTest(
      v => typeof v === 'number' && !Number.isNaN(v),
      msg || 'Must be a number'
    );
  }

  private addTest = this.makeAddTest<number>();

  /**
   * Verify that the number is greater than a value
   * @param min minimum value
   * @param msg error message if test fails
   */
  public min(min: number, msg?: string) {
    this.addTest(
      v => v >= min,
      msg || `Must be greater than or equal to ${min}`
    );
    return this;
  }

  /**
   * Verify that the number is less than a value
   * @param max maximum value
   * @param msg error message if test fails
   */
  public max(max: number, msg?: string) {
    this.addTest(v => v <= max, msg || `Must be less than or equal to ${max}`);
    return this;
  }

  /**
   * Verify that the number is less than a value
   * @param max maximum value
   * @param msg error message if test fails
   */
  public lessThan(max: number, msg?: string) {
    this.addTest(v => v < max, msg || `Must be less than ${max}`);
    return this;
  }

  /**
   * Verify that the number is greater than a value
   * @param min minimum value
   * @param msg error message if test fails
   */
  public moreThan(min: number, msg?: string) {
    this.addTest(v => v > min, msg || `Must be greater than ${min}`);
    return this;
  }

  /**
   * Verify that the number is greater than zero
   * @param msg error message if test fails
   */
  public positive(msg?: string) {
    this.addTest(v => v > 0, msg || `Must be positive`);
    return this;
  }

  /**
   * Verify that the number is less than zero
   * @param msg error message if test fails
   */
  public negative(msg?: string) {
    this.addTest(v => v < 0, msg || `Must be negative`);
    return this;
  }

  /**
   * Verify that the number is an integer
   * @param msg error message if test fails
   */
  public integer(msg?: string) {
    this.addTest(v => Number.isInteger(v), msg || 'Must be an integer');
    return this;
  }
}

export default OKNumber;
