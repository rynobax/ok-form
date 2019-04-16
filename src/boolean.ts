import OKAny, { TransformFn } from './any';

const parseBoolean = (val: unknown) => {
  if (typeof val === 'string') {
    // For strings, any string of spaces is considered empty
    const isEmpty = val.trim() === '';
    if (isEmpty) return null;
    // If it isn't empty, check if it is the string true or false
    else if (val === 'true') return true;
    else if (val === 'false') return false;
    else return val;
  }
  // Everything else is returned directly
  return val;
};

class OKBoolean<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  public constructor(
    msg?: string,
    transform?: TransformFn<Input, Parent, Root>
  ) {
    super();
    if (transform) {
      this.transform(transform);
    } else {
      this.transform(parseBoolean);
    }
    this.addTest(v => typeof v === 'boolean', msg || 'Must be a boolean');
  }

  private addTest = this.makeAddTest<boolean>();
}

export default OKBoolean;
