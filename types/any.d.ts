import { ValidationRuntimeError } from './errors';
export interface ValidationErrorObject {
    [key: string]: ValidationError;
}
export declare type ValidationError = string | ValidationErrorObject;
interface ResultValid {
    valid: true;
    error: null;
    validationError: null;
}
interface ResultInvalidBase {
    valid: false;
    validationError: ValidationRuntimeError;
}
interface ResultInvalidPrimitive extends ResultInvalidBase {
    error: string;
}
interface ResultInvalidObject extends ResultInvalidBase {
    error: ValidationErrorObject;
}
declare type ResultInvalid = ResultInvalidPrimitive | ResultInvalidObject;
export declare type Result = ResultValid | ResultInvalid;
interface TestContext<Parent, Root> {
    parent: Parent;
    root: Root;
    path: string[];
}
declare type TestFnResult = OKAny | string | false | null | undefined | void;
declare type SyncTestFn<Input, Parent, Root> = (val: Input, context: TestContext<Parent, Root>) => TestFnResult;
declare type AsyncTestFn<Input, Parent, Root> = (val: Input, context: TestContext<Parent, Root>) => Promise<TestFnResult>;
declare type TestFn<Input, Parent, Root> = SyncTestFn<Input, Parent, Root> | AsyncTestFn<Input, Parent, Root>;
interface Test<Input, Parent, Root> {
    testFn: TestFn<Input, Parent, Root>;
    skipIfNull?: boolean;
}
export declare type TransformFn<Input, Parent, Root> = (val: Input, context: TestContext<Parent, Root>) => any;
declare class OKAny<Input = unknown, Parent = unknown, Root = unknown> {
    private isOptional;
    private requiredMessage;
    protected tests: Test<Input, Parent, Root>[];
    protected transforms: TransformFn<Input, Parent, Root>[];
    constructor();
    protected error(msg: string, validationError?: ValidationRuntimeError): ResultInvalidPrimitive;
    protected error(msg: ValidationErrorObject, validationError?: ValidationRuntimeError): ResultInvalidObject;
    protected error(msg: (string | null)[], validationError?: ValidationRuntimeError): ResultInvalidObject;
    protected error(msg: (ValidationErrorObject | null)[], validationError?: ValidationRuntimeError): ResultInvalidObject;
    protected success(): ResultValid;
    protected getContext(): TestContext<Parent, Root>;
    protected makeAddTest: <T = unknown>() => (predicate: (v: T) => boolean, msg: string) => void;
    /**
     * Build schema
     */
    optional(): this;
    transform(transformFn: TransformFn<Input, Parent, Root>): this;
    test(testFn: TestFn<Input, Parent, Root>): OKAny<Input, Parent, Root>;
    /**
     * @param msg Error message if field is empty (empty string, null, undefined)
     */
    required(msg?: string): this;
    /**
     * Call after schema is defined
     */
    cast(input: Input): Input;
    private handleValidationError;
    validate(input: Input): Result;
    validateAsync(input: Input): Promise<Result>;
}
export default OKAny;
