import OKAny, { Result } from './any';
declare class OKArray<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    private shape;
    private parseErrorMsg;
    constructor(shape: OKAny, msg?: string);
    private addTest;
    private setContext;
    validate(input: Input): Result;
    validateAsync(input: Input): Promise<Result>;
    cast(input: Input): Input;
    length(len: number, msg?: string): this;
    min(min: number, msg?: string): this;
    max(max: number, msg?: string): this;
}
export default OKArray;
