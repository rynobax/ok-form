interface ValidationRuntimeErrorParams {
  message: string;
  originalError: Error;
}

export class ValidationRuntimeError extends Error {
  public originalError: Error;

  public constructor(params: ValidationRuntimeErrorParams) {
    super();
    this.message = params.message;
    this.originalError = params.originalError;
  }
}
