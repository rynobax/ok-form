declare type ValidationErrorPrimitive = string;
export interface ValidationErrorObject {
    [key: string]: ValidationError;
}
interface ValidationErrorArray extends Array<ValidationError> {
}
declare type ValidationError = ValidationErrorPrimitive | ValidationErrorObject | ValidationErrorArray;
export interface ResultValid {
    valid: true;
    errors: null;
}
interface ResultInvalidBase {
    valid: false;
}
interface ResultInvalidPrimitive extends ResultInvalidBase {
    errors: ValidationErrorPrimitive;
}
interface ResultInvalidObject extends ResultInvalidBase {
    errors: ValidationErrorObject;
}
interface ResultInvalidArray extends ResultInvalidBase {
    errors: ValidationErrorArray;
}
export interface ResultInvalidAny extends ResultInvalidBase {
    errors: any;
}
declare type ResultPrimitive = ResultValid | ResultInvalidPrimitive;
declare type ResultObject = ResultValid | ResultInvalidObject;
declare type ResultArray = ResultValid | ResultInvalidArray;
declare type ResultAny = ResultValid | ResultInvalidAny;
export declare type Result = ResultPrimitive | ResultObject | ResultArray | ResultAny;
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
declare class OKAny<Input = any, Parent = any, Root = any> {
    private isOptional;
    private requiredMessage;
    protected tests: Test<Input, Parent, Root>[];
    protected transforms: TransformFn<Input, Parent, Root>[];
    constructor();
    protected error(msg: ValidationErrorPrimitive): ResultInvalidPrimitive;
    protected error(msg: ValidationErrorObject): ResultInvalidObject;
    protected error(msg: ValidationErrorArray): ResultInvalidArray;
    protected success(): ResultValid;
    protected getContext(): TestContext<Parent, Root>;
    protected makeAddTest: <T = unknown>() => (predicate: (v: T) => boolean, msg: string) => void;
    /**
     * Mark schema as optional, meaning that empty string, null, and undefined
     * are valid values
     */
    optional(): this;
    /**
     * Add a tranformation to the schema.  The transformation will be run before
     * any of the tests
     * @param transformFn A function that returns the updated value
     */
    transform(transformFn: TransformFn<Input, Parent, Root>): this;
    /**
     * Add an arbitrary test to the schema
     * @param testFn A function which will be passed the current value, and
     * should return an error message string if there is an error.  If a schema
     * is returned, it will be executed and the result used.
     */
    test(testFn: TestFn<Input, Parent, Root>): OKAny<Input, Parent, Root>;
    /**
     * Fields are considered required by default.  If you want to customize the
     * error message, you can use this method.
     * @param msg Error message if field is empty (empty string, null, undefined)
     */
    required(msg?: string): this;
    /**
     * Attempt to cast the input into the schema shape.  All transforms will be
     * run, and the result returned, or an error thrown.
     * @param input The object to be cast
     */
    cast(input: Input): Input;
    /**
     * Validate an object.  All transforms will be run, then all tests will
     * be run, and a result object will be returned.  If all the tests pass,
     * valid will be true, and error will be null.  If any test fails, valid
     * will be false, and error will contain the all the errors that occured.
     * @param input The object to be validated
     */
    validate(input: Input): Result;
    /**
     * Validate an object asynchronously.  All transforms will be run, then all
     * tests will be run, and a promise for the result object will be returned.
     * If all the tests pass, valid will be true, and error will be null.  If
     * any test fails, valid will be false, and error will contain the all the
     * errors that occured.
     * @param input The object to be validated
     */
    validateAsync(input: Input): Promise<Result>;
}
export default OKAny;
