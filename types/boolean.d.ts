import OKAny, { TransformFn } from './any';
declare class OKBoolean<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    constructor(msg?: string, transform?: TransformFn<Input, Parent, Root>);
    private addTest;
}
export default OKBoolean;
