import OKAny from './any';
declare class OKArray<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    private shape;
    private parseErrorMsg;
    constructor(shape: OKAny, msg?: string);
    private addTest;
    private setContext;
    validate(input: Input): import("./any").ResultValid | import("./any").ResultInvalidAny;
    validateAsync(input: Input): Promise<import("./any").ResultValid | import("./any").ResultInvalidAny>;
    cast(input: Input): Input;
    /**
     * Verify that the array is an exact length
     * @param len required length of array
     * @param msg error message if test fails
     */
    length(len: number, msg?: string): this;
    /**
     * Verify that the array is at least a certain length
     * @param min the minimum valid length
     * @param msg error message if test fails
     */
    min(min: number, msg?: string): this;
    /**
     * Verify that the array is at most a certain length
     * @param max the maximum valid length
     * @param msg error message if test fails
     */
    max(max: number, msg?: string): this;
}
export default OKArray;
