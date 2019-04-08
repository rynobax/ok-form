import OKAny from './any';
declare class OKNumber<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    /**
     * Create a number schema
     *
     * If the input value is a non empty string, it will be converted to a number
     * with Number(val)
     *
     * If the parsed value is NaN, validation will fail
     *
     * @param msg The error message if the schema cannot convert the value to a
     * number
     */
    constructor(msg?: string);
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
