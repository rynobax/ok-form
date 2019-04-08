import OKAny from './any';
declare class OKString<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    constructor(msg?: string);
    length(len: number, msg?: string): this;
    min(min: number, msg?: string): this;
    max(max: number, msg?: string): this;
    matches(regex: RegExp, msg?: string): this;
    email(msg?: string): this;
    private addTest;
}
export default OKString;
