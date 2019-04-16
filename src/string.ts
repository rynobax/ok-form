import OKAny, { TransformFn } from './any';

// from emailregex.com
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const parseString = (val: unknown) => {
  if (val === null || val === undefined) return val;
  else if (typeof val === 'string') return val;
  else if (typeof val === 'object') return val;
  else return String(val);
};

class OKString<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  public constructor(
    msg?: string,
    transform?: TransformFn<Input, Parent, Root>
  ) {
    super();
    if (transform) {
      this.transform(transform);
    } else {
      this.transform(parseString);
    }
    this.addTest(v => typeof v === 'string', msg || 'Must be a string');
  }

  /**
   * Verify that the string is an exact length
   * @param len required length of array
   * @param msg error message if test fails
   */
  public length(len: number, msg?: string) {
    this.addTest(v => v.length === len, msg || `Must have length ${len}`);
    return this;
  }

  /**
   * Verify that the string is at least a certain length
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
   * Verify that the string is at most a certain length
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

  /**
   * Verify that the string matches a regular expression
   * @param regex regular expression to use
   * @param msg error message if test fails
   */
  public matches(regex: RegExp, msg?: string) {
    this.addTest(
      v => regex.test(v),
      msg || `Must match regular expression: ${regex.toString()}`
    );
    return this;
  }

  /**
   * Verify that the string is an email address
   * @param msg error message if test fails
   */
  public email(msg?: string) {
    this.addTest(v => emailRegex.test(v), msg || `Must be an email address`);
    return this;
  }

  private addTest = this.makeAddTest<string>();
}

export default OKString;
