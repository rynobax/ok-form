import OKAny, { TransformFn } from './any';
declare class OKString<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    constructor(msg?: string, transform?: TransformFn<Input, Parent, Root>);
    /**
     * Verify that the string is an exact length
     * @param len required length of array
     * @param msg error message if test fails
     */
    length(len: number, msg?: string): this;
    /**
     * Verify that the string is at least a certain length
     * @param min the minimum valid length
     * @param msg error message if test fails
     */
    min(min: number, msg?: string): this;
    /**
     * Verify that the string is at most a certain length
     * @param max the maximum valid length
     * @param msg error message if test fails
     */
    max(max: number, msg?: string): this;
    /**
     * Verify that the string matches a regular expression
     * @param regex regular expression to use
     * @param msg error message if test fails
     */
    matches(regex: RegExp, msg?: string): this;
    /**
     * Verify that the string is an email address
     * @param msg error message if test fails
     */
    email(msg?: string): this;
    private addTest;
}
export default OKString;
