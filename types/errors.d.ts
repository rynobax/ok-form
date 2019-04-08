interface ValidationRuntimeErrorParams {
    message: string;
    originalError: Error;
}
export declare class ValidationRuntimeError extends Error {
    originalError: Error;
    constructor(params: ValidationRuntimeErrorParams);
}
export {};
