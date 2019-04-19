import OKAny, { TransformFn } from './any';
declare class OKNumber<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    constructor(msg?: string, transform?: TransformFn<Input, Parent, Root>);
    private addTest;
    /**
     * Verify that the number is greater than a value
     * @param min minimum value
     * @param msg error message if test fails
     */
    min(min: number, msg?: string): this;
    /**
     * Verify that the number is less than a value
     * @param max maximum value
     * @param msg error message if test fails
     */
    max(max: number, msg?: string): this;
    /**
     * Verify that the number is less than a value
     * @param max maximum value
     * @param msg error message if test fails
     */
    lessThan(max: number, msg?: string): this;
    /**
     * Verify that the number is greater than a value
     * @param min minimum value
     * @param msg error message if test fails
     */
    moreThan(min: number, msg?: string): this;
    /**
     * Verify that the number is greater than zero
     * @param msg error message if test fails
     */
    positive(msg?: string): this;
    /**
     * Verify that the number is less than zero
     * @param msg error message if test fails
     */
    negative(msg?: string): this;
    /**
     * Verify that the number is an integer
     * @param msg error message if test fails
     */
    integer(msg?: string): this;
}
export default OKNumber;
