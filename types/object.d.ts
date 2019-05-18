import OKAny, { Result } from './any';
export declare type Shape<Input> = {
    [key in keyof Input]: OKAny;
};
declare class OKObject<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    private shape;
    private parseErrorMsg;
    constructor(shape: Shape<Input>, msg?: string);
    private addTest;
    private iterateShape;
    private setContext;
    validate(input: Input): Result;
    validateAsync(input: Input): Promise<Result>;
    cast(input: Input): Input;
}
export default OKObject;
