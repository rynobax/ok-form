import OKAny from './any';
declare class OKBoolean<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
    /**
     * Create a boolean schema
     *
     * It will accept only booleans, or the strings "true" or "false"
     *
     * @param msg The error message if the schema cannot convert the value to a
     * boolean
     */
    constructor(msg?: string);
    private addTest;
}
export default OKBoolean;
