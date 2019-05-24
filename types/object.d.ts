import OKAny from './any';
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
    validate(input: Input): import("./any").ResultValid | import("./any").ResultInvalidAny;
    validateAsync(input: Input): Promise<import("./any").ResultValid | import("./any").ResultInvalidAny>;
    cast(input: Input): Input;
}
export default OKObject;
