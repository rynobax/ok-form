import OKAny, { TransformFn } from './any';
declare class OKNumber<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    constructor(msg?: string);
    private addTest;
    min(min: number, msg?: string): this;
    max(max: number, msg?: string): this;
    lessThan(x: number, msg?: string): this;
    moreThan(x: number, msg?: string): this;
    positive(msg?: string): this;
    negative(msg?: string): this;
    integer(msg?: string): this;
    transform(transformFn: TransformFn<Input, Parent, Root>): this;
}
export default OKNumber;
