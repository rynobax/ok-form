import OKAny, { Result } from './any';
export interface Shape<Input> {
    [key: string]: OKAny<Input>;
}
declare class OKObject<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    private shape;
    private parseErrorMsg;
    /**
     * Create an object schema, which will only accept an object
     * @param shape A schema for the object
     * @param msg The error message if the schema is not passed an object
     */
    constructor(shape: Shape<Input>, msg?: string);
    private addTest;
    private iterateShape;
    private setContext;
    validate(input: Input): Result;
    validateAsync(input: Input): Promise<Result>;
    cast(input: Input): Input;
}
export default OKObject;
