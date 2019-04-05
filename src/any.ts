interface ResultValid {
  valid: true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface ResultInvalid {
  valid: false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

type Result = ResultValid | ResultInvalid;

class OKAny {
  private isRequired = false;
  private requiredMsg = 'Required';
  protected validationMsg = 'Invalid';

  public constructor(msg?: string) {
    if (msg) this.validationMsg = msg;
  }

  protected error(msg: string): ResultInvalid {
    return { valid: false, error: msg };
  }

  protected success(): ResultValid {
    return { valid: true, error: null };
  }

  public required(msg?: string) {
    this.isRequired = true;
    if (msg) this.requiredMsg = msg;
    return this;
  }

  public validate(value: unknown): Result {
    if (this.isRequired) {
      // TODO: I don't think this is good
      // probably just dont check at all
      if (value === null || value === undefined || value === '')
        return this.error(this.requiredMsg);
    }
    return this.success();
  }
}

export default OKAny;
